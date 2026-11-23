import { escapeHtml } from './codeHighlight'

export type IntegrityMarkdownBlock =
  | { type: 'html'; html: string }
  | { type: 'code'; language: string; content: string }

function sanitizeHref(raw: string): string | null {
  const url = raw.trim()
  if (/^(?:https?:\/\/|mailto:|\/|#)/i.test(url)) {
    return escapeHtml(url)
  }
  return null
}

export function renderInlineMarkdown(raw: string): string {
  const placeholders: string[] = []
  let text = raw

  // Protect inline code spans first
  text = text.replace(/`([^`]+)`/g, (_, code: string) => {
    const idx = placeholders.length
    placeholders.push(
      `<code class="rounded bg-slate-100 dark:bg-zinc-800 px-1.5 py-0.5 font-mono text-[0.85em] text-accent dark:text-brand-300 border border-slate-200/70 dark:border-zinc-700/70">${escapeHtml(code)}</code>`,
    )
    return `\u0000CODE${idx}\u0000`
  })

  text = escapeHtml(text)

  // Links: [label](url) (supports one level of balanced parentheses in URLs)
  text = text.replace(/\[([^\]]+)\]\(((?:[^()\s]|\([^()\s]*\))+)\)/g, (_, label: string, url: string) => {
    const safe = sanitizeHref(url)
    if (!safe) return label
    const external = /^https?:\/\//i.test(url.trim())
    const attrs = external ? ' target="_blank" rel="noopener noreferrer"' : ''
    return `<a href="${safe}"${attrs} class="font-medium text-accent dark:text-brand-300 underline underline-offset-2 hover:text-accent-hover">${label}</a>`
  })

  // Bold, italic, strikethrough
  text = text.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-slate-900 dark:text-slate-50">$1</strong>')
  text = text.replace(/__([^_]+)__/g, '<strong class="font-semibold text-slate-900 dark:text-slate-50">$1</strong>')
  text = text.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>')
  text = text.replace(/~~([^~]+)~~/g, '<del class="opacity-70">$1</del>')

  // Restore inline code spans
  text = text.replace(/\u0000CODE(\d+)\u0000/g, (_, i: string) => placeholders[Number(i)] ?? '')
  return text
}

function parseTableRow(line: string): string[] {
  return line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map(cell => cell.trim())
}

function isTableSeparator(line: string): boolean {
  return /^\|?(\s*:?-{3,}:?\s*\|)+\s*:?-{3,}:?\s*\|?$/.test(line.trim())
}

function renderProseSegment(segment: string): string {
  const lines = segment.replace(/\r\n/g, '\n').split('\n')
  const out: string[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i] ?? ''
    const trimmed = line.trim()

    if (!trimmed) {
      i++
      continue
    }

    // Horizontal rule
    if (/^(?:-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
      out.push('<hr class="my-5 border-slate-200 dark:border-zinc-800" />')
      i++
      continue
    }

    // Headings h1-h4
    const headingMatch = /^(#{1,4})\s+(.+)$/.exec(trimmed)
    if (headingMatch) {
      const level = headingMatch[1]!.length
      const content = renderInlineMarkdown(headingMatch[2]!)
      const styles: Record<number, string> = {
        1: 'text-xl font-bold tracking-tight text-slate-950 dark:text-white mt-6 mb-3 first:mt-0',
        2: 'text-lg font-semibold tracking-tight text-slate-950 dark:text-white mt-6 mb-2.5 pb-1.5 border-b border-slate-200/80 dark:border-zinc-800 first:mt-0',
        3: 'text-base font-semibold text-slate-900 dark:text-slate-100 mt-5 mb-2 first:mt-0',
        4: 'text-sm font-semibold text-slate-900 dark:text-slate-100 mt-4 mb-1.5 first:mt-0',
      }
      out.push(`<h${level} class="${styles[level]}">${content}</h${level}>`)
      i++
      continue
    }

    // Blockquote
    if (trimmed.startsWith('>')) {
      const quoteLines: string[] = []
      while (i < lines.length && (lines[i] ?? '').trim().startsWith('>')) {
        quoteLines.push((lines[i] ?? '').trim().replace(/^>\s?/, ''))
        i++
      }
      out.push(
        `<blockquote class="my-4 border-l-2 border-accent dark:border-brand-400 bg-brand-50/40 dark:bg-brand-950/30 pl-4 pr-3 py-2 rounded-r-lg text-sm text-slate-700 dark:text-zinc-300">${quoteLines.map(renderInlineMarkdown).join('<br />')}</blockquote>`,
      )
      continue
    }

    // GFM Table
    if (trimmed.includes('|') && i + 1 < lines.length && isTableSeparator(lines[i + 1] ?? '')) {
      const headers = parseTableRow(trimmed)
      i += 2
      const bodyRows: string[][] = []
      while (i < lines.length && (lines[i] ?? '').trim().includes('|') && (lines[i] ?? '').trim() !== '') {
        bodyRows.push(parseTableRow(lines[i] ?? ''))
        i++
      }
      const thead = headers
        .map(h => `<th class="px-3.5 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 whitespace-nowrap">${renderInlineMarkdown(h)}</th>`)
        .join('')
      const tbody = bodyRows
        .map(
          row =>
            `<tr class="border-t border-slate-100 dark:border-zinc-800/80">${headers
              .map((_, colIdx) => `<td class="px-3.5 py-2.5 text-sm text-slate-700 dark:text-zinc-300">${renderInlineMarkdown(row[colIdx] ?? '')}</td>`)
              .join('')}</tr>`,
        )
        .join('')
      out.push(
        `<div class="my-4 overflow-x-auto rounded-lg border border-slate-200 dark:border-zinc-800"><table class="w-full border-collapse text-sm"><thead class="bg-slate-50/80 dark:bg-zinc-900/70"><tr>${thead}</tr></thead><tbody>${tbody}</tbody></table></div>`,
      )
      continue
    }

    // Unordered list
    if (/^[-*+]\s+/.test(trimmed)) {
      const items: string[] = []
      while (i < lines.length && /^\s*[-*+]\s+/.test(lines[i] ?? '')) {
        items.push((lines[i] ?? '').replace(/^\s*[-*+]\s+/, ''))
        i++
      }
      out.push(
        `<ul class="my-3 list-disc pl-5 space-y-1.5 text-sm text-slate-700 dark:text-zinc-300">${items.map(item => `<li>${renderInlineMarkdown(item)}</li>`).join('')}</ul>`,
      )
      continue
    }

    // Ordered list
    if (/^\d+\.\s+/.test(trimmed)) {
      const items: string[] = []
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i] ?? '')) {
        items.push((lines[i] ?? '').replace(/^\s*\d+\.\s+/, ''))
        i++
      }
      out.push(
        `<ol class="my-3 list-decimal pl-5 space-y-1.5 text-sm text-slate-700 dark:text-zinc-300">${items.map(item => `<li>${renderInlineMarkdown(item)}</li>`).join('')}</ol>`,
      )
      continue
    }

    // Paragraph (collect consecutive plain lines)
    const paraLines: string[] = []
    while (
      i < lines.length
      && (lines[i] ?? '').trim() !== ''
      && !/^(?:#{1,4}\s|>|[-*+]\s|\d+\.\s|-{3,}|\*{3,})/.test((lines[i] ?? '').trim())
    ) {
      paraLines.push((lines[i] ?? '').trim())
      i++
    }
    out.push(
      `<p class="my-3 text-sm leading-relaxed text-slate-700 dark:text-zinc-300 first:mt-0 last:mb-0">${renderInlineMarkdown(paraLines.join(' '))}</p>`,
    )
  }

  return out.join('\n')
}

export function parseMarkdownBlocks(markdown: string): IntegrityMarkdownBlock[] {
  if (!markdown) return []
  const normalized = markdown.replace(/\r\n/g, '\n')
  const fenceRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g
  const blocks: IntegrityMarkdownBlock[] = []

  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = fenceRegex.exec(normalized)) !== null) {
    const before = normalized.slice(lastIndex, match.index)
    const html = renderProseSegment(before)
    if (html.trim()) {
      blocks.push({ type: 'html', html })
    }

    const language = (match[1] || 'text').toLowerCase()
    const content = (match[2] ?? '').replace(/\n$/, '')
    blocks.push({ type: 'code', language, content })

    lastIndex = fenceRegex.lastIndex
  }

  const tail = normalized.slice(lastIndex)
  const tailHtml = renderProseSegment(tail)
  if (tailHtml.trim()) {
    blocks.push({ type: 'html', html: tailHtml })
  }

  return blocks
}

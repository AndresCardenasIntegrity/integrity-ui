import { describe, expect, it } from 'vitest'
import {
  escapeHtml,
  highlightCode,
  normalizeCodeContent,
} from '../app/utils/codeHighlight'
import { parseMarkdownBlocks, renderInlineMarkdown } from '../app/utils/markdown'
import { ansiToHtml, detectLogLevel, parseTerminalLogs, stripAnsi } from '../app/utils/terminalLog'

describe('codeHighlight utilities', () => {
  it('escapes HTML safely and pretty-prints JSON objects and strings', () => {
    expect(escapeHtml('<script>alert("x")</script>')).toBe('&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;')
    expect(normalizeCodeContent({ ok: true, count: 2 }, 'json')).toBe('{\n  "ok": true,\n  "count": 2\n}')
    expect(normalizeCodeContent('{"a":1}', 'json')).toBe('{\n  "a": 1\n}')
  })

  it('highlights JSON keys, strings, numbers, and booleans without leaking raw tags', () => {
    const html = highlightCode('{"name": "<tag>", "ok": true, "ms": 42}', 'json')
    expect(html).toContain('text-sky-300')
    expect(html).toContain('text-emerald-300')
    expect(html).toContain('text-violet-300')
    expect(html).toContain('text-amber-300')
    expect(html).not.toContain('<tag>')
    expect(html).toContain('&lt;tag&gt;')
  })

  it('highlights bash commands and flags', () => {
    const html = highlightCode('pm2 logs integrity-api --lines 100', 'bash')
    expect(html).toContain('text-indigo-300')
    expect(html).toContain('text-amber-300')
  })
})

describe('terminalLog utilities (PM2 & ANSI)', () => {
  it('strips and converts ANSI color sequences safely to HTML spans', () => {
    const raw = '\u001b[32mREADY\u001b[0m server <ok>'
    expect(stripAnsi(raw)).toBe('READY server <ok>')
    const html = ansiToHtml(raw)
    expect(html).toContain('text-emerald-400')
    expect(html).toContain('&lt;ok&gt;')
  })

  it('parses PM2 process prefixes, timestamps, and log severity levels', () => {
    const entries = parseTerminalLogs([
      '0|integrity-api | 2026-11-23 17:30:01.102 INFO GET /api/health 200 12ms',
      '1|worker-sync   | 2026-11-23 17:30:14.892 WARN Slow upstream 429',
      '0|integrity-api | 2026-11-23 17:30:18.210 ERROR POST /api/hook 502 ECONNREFUSED',
    ])

    expect(entries).toHaveLength(3)
    expect(entries[0]).toMatchObject({
      process: '0|integrity-api',
      timestamp: '2026-11-23 17:30:01.102',
      level: 'info',
    })
    expect(entries[1]?.level).toBe('warn')
    expect(entries[2]?.level).toBe('error')
    expect(detectLogLevel('READY listening on port 3000')).toBe('success')
  })
})

describe('markdown utilities', () => {
  it('splits fenced JSON code blocks from prose and renders GFM tables', () => {
    const md = [
      '## Estado',
      '',
      '| Servicio | Estatus |',
      '| --- | --- |',
      '| `api` | **OK** |',
      '',
      '```json',
      '{"healthy": true}',
      '```',
    ].join('\n')

    const blocks = parseMarkdownBlocks(md)
    expect(blocks).toHaveLength(2)
    expect(blocks[0]?.type).toBe('html')
    if (blocks[0]?.type === 'html') {
      expect(blocks[0].html).toContain('<h2')
      expect(blocks[0].html).toContain('<table')
      expect(blocks[0].html).toContain('<code')
    }
    expect(blocks[1]).toEqual({
      type: 'code',
      language: 'json',
      content: '{"healthy": true}',
    })
  })

  it('sanitizes unsafe javascript: URLs while preserving safe links', () => {
    expect(renderInlineMarkdown('[Click](javascript:alert(1))')).toBe('Click')
    expect(renderInlineMarkdown('[Docs](/data)')).toContain('href="/data"')
    expect(renderInlineMarkdown('[GitHub](https://github.com)')).toContain('target="_blank"')
  })
})

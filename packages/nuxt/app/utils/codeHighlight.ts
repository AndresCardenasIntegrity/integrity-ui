export type IntegrityCodeLanguage =
  | 'json'
  | 'ts'
  | 'typescript'
  | 'js'
  | 'javascript'
  | 'vue'
  | 'html'
  | 'bash'
  | 'sh'
  | 'shell'
  | 'sql'
  | 'css'
  | 'text'
  | string

export function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export function normalizeCodeContent(
  code: string | Record<string, unknown> | unknown[],
  language?: string,
  prettyJson = true,
): string {
  if (typeof code !== 'string') {
    try {
      return JSON.stringify(code, null, 2)
    } catch {
      return String(code)
    }
  }

  const lang = (language ?? '').toLowerCase()
  if (prettyJson && lang === 'json') {
    const trimmed = code.trim()
    if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
      try {
        return JSON.stringify(JSON.parse(trimmed), null, 2)
      } catch {
        return code
      }
    }
  }
  return code
}

function highlightJson(raw: string): string {
  const escaped = escapeHtml(raw)
  const tokenRegex = /(&quot;(?:\\u[a-fA-F0-9]{4}|\\[^u]|[^\\&]|&(?!quot;))*&quot;(\s*:)?|\b(?:true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?|[{}\[\],:])/g
  return escaped.replace(tokenRegex, (match, _group, colon) => {
    if (match.startsWith('&quot;')) {
      if (colon) {
        const keyPart = match.slice(0, match.lastIndexOf(':'))
        return `<span class="text-sky-300">${keyPart}</span><span class="text-zinc-500">:</span>`
      }
      return `<span class="text-emerald-300">${match}</span>`
    }
    if (/^(?:true|false|null)$/.test(match)) {
      return `<span class="text-violet-300">${match}</span>`
    }
    if (/^-?\d/.test(match)) {
      return `<span class="text-amber-300">${match}</span>`
    }
    return `<span class="text-zinc-500">${match}</span>`
  })
}

function highlightBash(raw: string): string {
  return raw
    .split('\n')
    .map((line) => {
      const escaped = escapeHtml(line)
      if (/^\s*#/.test(line)) {
        return `<span class="text-zinc-500 italic">${escaped}</span>`
      }
      return escaped.replace(
        /(&quot;[^&]*?&quot;|&#39;[^&]*?&#39;|\$\{?[A-Za-z_][A-Za-z0-9_]*\}?|\s--?[a-zA-Z0-9-]+|\b(?:pnpm|npm|npx|git|pm2|docker|curl|node|nuxt|export|cd|mkdir|cp|rm|ssh|systemctl|nginx)\b)/g,
        (match) => {
          if (match.startsWith('&quot;') || match.startsWith('&#39;')) {
            return `<span class="text-emerald-300">${match}</span>`
          }
          if (match.startsWith('$')) {
            return `<span class="text-sky-300">${match}</span>`
          }
          if (/^\s-/.test(match)) {
            return `<span class="text-amber-300">${match}</span>`
          }
          return `<span class="text-indigo-300 font-medium">${match}</span>`
        },
      )
    })
    .join('\n')
}

function highlightScriptOrMarkup(raw: string): string {
  const escaped = escapeHtml(raw)
  const tokenRegex = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/|&lt;!--[\s\S]*?--&gt;|&quot;(?:\\.|[^\\&]|&(?!quot;))*&quot;|&#39;(?:\\.|[^\\&]|&(?!#39;))*&#39;|`(?:\\.|[^\\`])*`|&lt;\/?[A-Za-z][A-Za-z0-9-]*|\b(?:import|export|from|default|const|let|var|function|return|async|await|if|else|for|of|in|while|try|catch|finally|throw|new|type|interface|extends|true|false|null|undefined|void|as)\b|\b\d+(?:\.\d+)?\b)/g

  return escaped.replace(tokenRegex, (match) => {
    if (match.startsWith('//') || match.startsWith('/*') || match.startsWith('&lt;!--')) {
      return `<span class="text-zinc-500 italic">${match}</span>`
    }
    if (match.startsWith('&quot;') || match.startsWith('&#39;') || match.startsWith('`')) {
      return `<span class="text-emerald-300">${match}</span>`
    }
    if (match.startsWith('&lt;')) {
      return `<span class="text-sky-300">${match}</span>`
    }
    if (/^\d/.test(match)) {
      return `<span class="text-amber-300">${match}</span>`
    }
    return `<span class="text-violet-300">${match}</span>`
  })
}

function highlightSql(raw: string): string {
  const escaped = escapeHtml(raw)
  const tokenRegex = /(--[^\n]*|&#39;(?:&#39;&#39;|[^&]|&(?!#39;))*&#39;|\b(?:SELECT|FROM|WHERE|JOIN|LEFT|RIGHT|INNER|OUTER|ON|AS|AND|OR|NOT|IN|IS|NULL|ORDER|BY|GROUP|HAVING|LIMIT|OFFSET|INSERT|INTO|VALUES|UPDATE|SET|DELETE|CREATE|TABLE|INDEX|DISTINCT|COUNT|SUM|AVG|CASE|WHEN|THEN|ELSE|END)\b|\b\d+(?:\.\d+)?\b)/gi
  return escaped.replace(tokenRegex, (match) => {
    if (match.startsWith('--')) return `<span class="text-zinc-500 italic">${match}</span>`
    if (match.startsWith('&#39;')) return `<span class="text-emerald-300">${match}</span>`
    if (/^\d/.test(match)) return `<span class="text-amber-300">${match}</span>`
    return `<span class="text-sky-300 font-medium">${match}</span>`
  })
}

export function highlightCode(raw: string, language?: IntegrityCodeLanguage): string {
  const lang = (language ?? 'text').toLowerCase().trim()
  if (lang === 'json') return highlightJson(raw)
  if (lang === 'bash' || lang === 'sh' || lang === 'shell' || lang === 'zsh') return highlightBash(raw)
  if (lang === 'sql') return highlightSql(raw)
  if (['ts', 'typescript', 'js', 'javascript', 'vue', 'html', 'xml', 'jsx', 'tsx', 'css'].includes(lang)) {
    return highlightScriptOrMarkup(raw)
  }
  return escapeHtml(raw)
}

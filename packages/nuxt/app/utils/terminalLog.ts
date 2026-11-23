import { escapeHtml } from './codeHighlight'

export type IntegrityLogLevel = 'error' | 'warn' | 'info' | 'debug' | 'success' | 'plain'

export interface IntegrityTerminalLine {
  lineNumber: number
  raw: string
  plain: string
  process?: string
  timestamp?: string
  level: IntegrityLogLevel
  html: string
}

const ANSI_REGEX = /\u001b\[([0-9;]*)m/g

const ANSI_COLOR_CLASS: Record<number, string> = {
  30: 'text-zinc-500',
  31: 'text-red-400',
  32: 'text-emerald-400',
  33: 'text-amber-300',
  34: 'text-sky-400',
  35: 'text-violet-400',
  36: 'text-cyan-300',
  37: 'text-zinc-200',
  90: 'text-zinc-500',
  91: 'text-red-300',
  92: 'text-emerald-300',
  93: 'text-amber-200',
  94: 'text-sky-300',
  95: 'text-violet-300',
  96: 'text-cyan-200',
  97: 'text-white',
}

export function stripAnsi(input: string): string {
  return input.replace(ANSI_REGEX, '')
}

export function ansiToHtml(input: string): string {
  let result = ''
  let lastIndex = 0
  let currentColor = ''
  let isBold = false
  let isDim = false

  function wrap(text: string): string {
    if (!text) return ''
    const escaped = escapeHtml(text)
    const classes: string[] = []
    if (currentColor) classes.push(currentColor)
    if (isBold) classes.push('font-semibold')
    if (isDim) classes.push('opacity-65')
    if (!classes.length) return escaped
    return `<span class="${classes.join(' ')}">${escaped}</span>`
  }

  let match: RegExpExecArray | null
  ANSI_REGEX.lastIndex = 0
  while ((match = ANSI_REGEX.exec(input)) !== null) {
    result += wrap(input.slice(lastIndex, match.index))
    lastIndex = ANSI_REGEX.lastIndex

    const codes = (match[1] ?? '0')
      .split(';')
      .filter(Boolean)
      .map(Number)

    if (!codes.length) codes.push(0)

    for (const code of codes) {
      if (code === 0) {
        currentColor = ''
        isBold = false
        isDim = false
      } else if (code === 1) {
        isBold = true
      } else if (code === 2) {
        isDim = true
      } else if (code === 22) {
        isBold = false
        isDim = false
      } else if (code === 39) {
        currentColor = ''
      } else if (ANSI_COLOR_CLASS[code]) {
        currentColor = ANSI_COLOR_CLASS[code]
      }
    }
  }

  result += wrap(input.slice(lastIndex))
  return result
}

export function detectLogLevel(plainLine: string): IntegrityLogLevel {
  if (/\b(?:ERROR|FATAL|ERR|CRITICAL|EXCEPTION|UNCAUGHT|ECONNREFUSED|ETIMEDOUT)\b/i.test(plainLine) || /\b5\d{2}\b/.test(plainLine)) {
    return 'error'
  }
  if (/\b(?:WARN|WARNING|DEPRECATED|RETRY)\b/i.test(plainLine) || /\b4\d{2}\b/.test(plainLine)) {
    return 'warn'
  }
  if (/\b(?:ONLINE|READY|STARTED|LISTENING|CONNECTED|SUCCESS|OK)\b/i.test(plainLine)) {
    return 'success'
  }
  if (/\b(?:DEBUG|TRACE|VERBOSE)\b/i.test(plainLine)) {
    return 'debug'
  }
  if (/\b(?:INFO|LOG|PM2|GET|POST|PUT|PATCH|DELETE)\b/i.test(plainLine)) {
    return 'info'
  }
  return 'plain'
}

function highlightPlainMessage(text: string): string {
  const escaped = escapeHtml(text)
  return escaped.replace(
    /(\b(?:ERROR|FATAL|ERR|CRITICAL)\b|\b(?:WARN|WARNING)\b|\b(?:INFO|DEBUG|TRACE)\b|\b(?:ONLINE|READY|LISTENING|SUCCESS)\b|\b(?:GET|POST|PUT|PATCH|DELETE)\b|\b[2345]\d{2}\b|\b\d+(?:\.\d+)?\s?(?:ms|s|MB|KB|%)\b)/g,
    (token) => {
      if (/^(?:ERROR|FATAL|ERR|CRITICAL)$/.test(token)) return `<span class="text-red-400 font-semibold">${token}</span>`
      if (/^(?:WARN|WARNING)$/.test(token)) return `<span class="text-amber-300 font-semibold">${token}</span>`
      if (/^(?:ONLINE|READY|LISTENING|SUCCESS)$/.test(token)) return `<span class="text-emerald-400 font-semibold">${token}</span>`
      if (/^(?:INFO|DEBUG|TRACE)$/.test(token)) return `<span class="text-sky-400 font-semibold">${token}</span>`
      if (/^(?:GET|POST|PUT|PATCH|DELETE)$/.test(token)) return `<span class="text-indigo-300 font-medium">${token}</span>`
      if (/^5\d{2}$/.test(token)) return `<span class="text-red-400 font-semibold">${token}</span>`
      if (/^4\d{2}$/.test(token)) return `<span class="text-amber-300 font-semibold">${token}</span>`
      if (/^2\d{2}$/.test(token)) return `<span class="text-emerald-400 font-semibold">${token}</span>`
      if (/^3\d{2}$/.test(token)) return `<span class="text-cyan-300">${token}</span>`
      return `<span class="text-violet-300">${token}</span>`
    },
  )
}

const PM2_PREFIX_RE = /^(\d+\|[^|]+?)\s*\|\s*(.*)$/
const TIMESTAMP_RE = /^(\d{4}-\d{2}-\d{2}[T\s]\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:?\d{2})?):?\s*(.*)$/

export function parseTerminalLogs(input: string | string[]): IntegrityTerminalLine[] {
  const lines = Array.isArray(input)
    ? input
    : input.replace(/\r\n/g, '\n').split('\n')

  return lines.map((raw, idx) => {
    const hasAnsi = /\u001b\[/.test(raw)
    const plain = stripAnsi(raw)
    let restPlain = plain
    let processName: string | undefined
    let timestamp: string | undefined

    const pm2Match = PM2_PREFIX_RE.exec(restPlain)
    if (pm2Match) {
      processName = pm2Match[1]?.trim()
      restPlain = pm2Match[2] ?? ''
    }

    const tsMatch = TIMESTAMP_RE.exec(restPlain)
    if (tsMatch) {
      timestamp = tsMatch[1]
      restPlain = tsMatch[2] ?? ''
    }

    const level = detectLogLevel(plain)

    let html: string
    if (hasAnsi) {
      let rawRest = raw
      if (processName) {
        rawRest = rawRest.replace(/^(?:\u001b\[[0-9;]*m)*\d+\|[^|]+?(?:\u001b\[[0-9;]*m)*\s*\|\s*/, '')
      }
      if (timestamp) {
        rawRest = rawRest.replace(/^(?:\u001b\[[0-9;]*m)*\d{4}-\d{2}-\d{2}[T\s]\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:?\d{2})?:?\s*/, '')
      }
      html = ansiToHtml(rawRest)
    } else {
      html = highlightPlainMessage(restPlain)
    }

    return {
      lineNumber: idx + 1,
      raw,
      plain,
      process: processName,
      timestamp,
      level,
      html,
    }
  })
}

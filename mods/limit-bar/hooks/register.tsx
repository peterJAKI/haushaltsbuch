import { atom, read, update } from 'claude-code'
import type { Register } from 'claude-code'

import type { Win } from '../types'

const win = atom({ plugin: 'limit-bar', key: 'win' } as const, null)

const pick = (limits: { kind: string; percentUsed: number; resetsAt?: string }[]): Win | null => {
  const w = limits.find(l => l.kind === 'five_hour')

  return w ? { percent: w.percentUsed, resetsAt: w.resetsAt } : null
}

const colorOf = (p: number) => (p >= 90 ? 'red' : p >= 70 ? 'yellow' : p < 10 ? 'green' : undefined)

const timeOf = (iso?: string) => {
  if (!iso) return '?'
  const d = new Date(iso)

  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const u = await $.session.usage()
    await update($, win, () => pick(u.rateLimits))

    return next(e)
  })

  on('session.measure', async ($, e, next) => {
    await update($, win, () => pick(e.rateLimits))

    return next(e)
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    const w = await read($, win)

    if (w === null) return next(e)

    const { Box, Text } = $.ui.resolve(e)
    const p = Math.max(0, Math.min(100, w.percent))
    const filled = Math.round(p / 5)
    const bar = '█'.repeat(filled) + '░'.repeat(20 - filled)

    return (
      <Box>
        <Text>5h-Limit </Text>
        <Text color={colorOf(p)}>{bar} {Math.round(w.percent)}%</Text>
        <Text dimColor> · Reset {timeOf(w.resetsAt)} Uhr</Text>
      </Box>
    )
  })
}

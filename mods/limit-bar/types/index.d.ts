export type Win = { percent: number; resetsAt?: string }

declare module 'claude-code' {
  interface PluginState {
    'limit-bar': { win: Win | null }
  }
}

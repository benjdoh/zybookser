import { storage } from 'wxt/storage'
import { writable } from 'svelte/store'
import { onDestroy } from 'svelte'

export type Area = 'local' | 'session' | 'sync' | 'managed'

export function store<T>(name: string, val: T, opts?: { area?: Area }) {
  const w = writable(val)
  const n = `${opts?.area || 'local'}:${name}`

  const unwatch = storage.watch<T>(n, (v) => v && w.set(v))
  const unwatch_writable = w.subscribe(async (val) => await storage.setItem(n, val))

  onDestroy(() => {
    unwatch()
    unwatch_writable()
  })

  return w
}

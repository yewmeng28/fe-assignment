import { useSyncExternalStore } from 'react'

/**
 * Theme and segment live on <html data-*> (the design tokens read them from
 * there) and are remembered in localStorage. index.html applies the saved
 * values before first paint; this hook lets any number of components read and
 * change them and stay in sync.
 */
interface Preferences {
  theme: 'light' | 'dark'
  segment: 'retail' | 'premium'
}

const DEFAULTS: Preferences = { theme: 'light', segment: 'retail' }
const listeners = new Set<() => void>()

// While this class is on <html>, colours fade (see index.css) instead of
// snapping, so switching theme or segment doesn't flash.
let transitionTimer: number | undefined

function startColourTransition() {
  const root = document.documentElement
  root.classList.add('theme-transition')
  window.clearTimeout(transitionTimer)
  transitionTimer = window.setTimeout(
    () => root.classList.remove('theme-transition'),
    400,
  )
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export default function usePreference<K extends keyof Preferences>(
  key: K,
): [Preferences[K], (value: Preferences[K]) => void] {
  const value = useSyncExternalStore(
    subscribe,
    () => document.documentElement.dataset[key] ?? DEFAULTS[key],
    () => DEFAULTS[key],
  ) as Preferences[K]

  const setValue = (next: Preferences[K]) => {
    startColourTransition()
    document.documentElement.dataset[key] = next
    try {
      localStorage.setItem(key, next)
    } catch {
      // Storage can be blocked (private mode); the choice just won't persist.
    }
    listeners.forEach((listener) => listener())
  }

  return [value, setValue]
}

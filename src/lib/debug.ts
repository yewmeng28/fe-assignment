/**
 * Demo hooks for the loading/error/empty states (see the API contract's
 * "Test and demo hooks"). Nothing here runs unless someone picks a scenario in
 * the debug menu, which only appears when the page URL contains `?debug`.
 */
export type DebugScenario =
  | 'none'
  | 'error'
  | 'empty-transactions'
  | 'empty-payees'
  | 'transfer-rejected'

/** Scenarios that change what GET requests return (so cached data is stale). */
export function affectsReads(value: DebugScenario): boolean {
  return value !== 'none' && value !== 'transfer-rejected'
}

let scenario: DebugScenario = 'none'
const listeners = new Set<() => void>()

export function isDebugEnabled(): boolean {
  return new URLSearchParams(window.location.search).has('debug')
}

export function subscribeToDebugScenario(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function getDebugScenario(): DebugScenario {
  return scenario
}

export function setDebugScenario(next: DebugScenario) {
  scenario = next
  listeners.forEach((listener) => listener())
}

/** Adds the mock API's `scenario` parameter to a GET request, if one is active. */
export function applyDebugScenario(path: string, method = 'GET'): string {
  if (method.toUpperCase() !== 'GET') return path

  const value =
    scenario === 'error'
      ? 'error'
      : scenario === 'empty-transactions' && path.startsWith('/api/transactions')
        ? 'empty'
        : scenario === 'empty-payees' && path.startsWith('/api/payees')
          ? 'empty'
          : null

  if (!value) return path
  return `${path}${path.includes('?') ? '&' : '?'}scenario=${value}`
}

/**
 * `transfer-rejected`: the form's own checks pass, but the request that reaches
 * the API asks for far more than any account holds, so the API answers 422
 * (INSUFFICIENT_FUNDS) with its own message. That exercises the "API rejected
 * it anyway" path without a real server fault.
 */
export function applyDebugRequest(path: string, init?: RequestInit) {
  if (
    scenario !== 'transfer-rejected' ||
    path !== '/api/transfers' ||
    init?.method?.toUpperCase() !== 'POST' ||
    typeof init.body !== 'string'
  ) {
    return init
  }

  const body = JSON.parse(init.body) as Record<string, unknown>
  return { ...init, body: JSON.stringify({ ...body, amount: 1_000_000 }) }
}

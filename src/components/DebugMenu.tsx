import { useQueryClient } from '@tanstack/react-query'
import { useSyncExternalStore } from 'react'
import {
  affectsReads,
  getDebugScenario,
  isDebugEnabled,
  setDebugScenario,
  subscribeToDebugScenario,
  type DebugScenario,
} from '../lib/debug'

const OPTIONS: Array<{ value: DebugScenario; label: string }> = [
  { value: 'none', label: 'Normal' },
  { value: 'error', label: 'Requests fail (dashboard error)' },
  { value: 'empty-transactions', label: 'No transactions' },
  { value: 'empty-payees', label: 'No saved payees' },
  { value: 'transfer-rejected', label: 'API rejects the transfer' },
]

/**
 * Lets a reviewer see the error and empty states on the deployed site. It is
 * hidden unless the URL has `?debug`, so it isn't part of the normal UI.
 */
export default function DebugMenu() {
  const queryClient = useQueryClient()
  const scenario = useSyncExternalStore(
    subscribeToDebugScenario,
    getDebugScenario,
  )

  if (!isDebugEnabled()) return null

  const choose = (next: DebugScenario) => {
    const readsChange = affectsReads(scenario) || affectsReads(next)
    setDebugScenario(next)
    // Drop cached data (not just refetch) so the loading and error states show.
    // Skipped when only the transfer request is affected: the dashboard is fine.
    if (readsChange) void queryClient.resetQueries()
  }

  return (
    <details className="debug-menu container" open>
      <summary>Debug: demo states</summary>
      <fieldset>
        <legend className="sr-only">Demo scenario</legend>
        {OPTIONS.map((option) => (
          <label key={option.value} className="debug-menu__option">
            <input
              type="radio"
              name="debug-scenario"
              checked={scenario === option.value}
              onChange={() => choose(option.value)}
            />
            {option.label}
          </label>
        ))}
      </fieldset>
    </details>
  )
}

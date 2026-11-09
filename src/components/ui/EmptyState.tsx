import type { ReactNode } from 'react'

interface EmptyStateProps {
  message: string
  /** Optional recovery action, e.g. a "Clear search" button. */
  action?: ReactNode
}

export default function EmptyState({ message, action }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <p>{message}</p>
      {action}
    </div>
  )
}

import type { ReactNode } from 'react'
import { AlertIcon } from './icons'

interface InlineErrorProps {
  message: string
  /** Optional action, e.g. a "Retry" button. */
  action?: ReactNode
}

export default function InlineError({ message, action }: InlineErrorProps) {
  return (
    <div role="alert" className="inline-error">
      <span className="inline-error__icon">
        <AlertIcon />
      </span>
      <p className="inline-error__message">{message}</p>
      {action}
    </div>
  )
}

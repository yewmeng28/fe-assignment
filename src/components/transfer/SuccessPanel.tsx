import { useEffect, useRef } from 'react'
import type { Transfer } from '../../api/types'
import { formatMoney } from '../../lib/format'
import Button from '../ui/Button'
import { CheckIcon } from '../ui/icons'

interface SuccessPanelProps {
  transfer: Transfer
  onDone: () => void
}

export default function SuccessPanel({ transfer, onDone }: SuccessPanelProps) {
  const headingRef = useRef<HTMLHeadingElement>(null)
  const { recipient } = transfer

  useEffect(() => {
    headingRef.current?.focus()
  }, [])

  return (
    <div className="success" aria-live="polite">
      <span className="success__icon">
        <CheckIcon />
      </span>
      <h3 ref={headingRef} tabIndex={-1} className="success__title">
        Transfer sent
      </h3>
      <p className="success__amount amount">{formatMoney(transfer.amount)}</p>
      <p className="success__recipient">
        to {recipient.name} · {recipient.bank} · {recipient.accountNumberMasked}
      </p>
      <p className="success__reference">
        Reference <strong>{transfer.reference}</strong>
      </p>
      <p className="success__note">The money should arrive within minutes.</p>
      <Button block onClick={onDone}>
        Back to dashboard
      </Button>
    </div>
  )
}

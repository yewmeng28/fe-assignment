import type { ReactNode } from 'react'
import { formatMoney } from '../lib/format'

interface BalanceHeroProps {
  total: number
  depositAccountCount: number
  /** The "New transfer" button. Fixed to the bottom of the screen on mobile. */
  action: ReactNode
}

export default function BalanceHero({
  total,
  depositAccountCount,
  action,
}: BalanceHeroProps) {
  return (
    <section className="balance-hero" aria-labelledby="total-label">
      <div>
        <p id="total-label" className="balance-hero__label">
          Total available
        </p>
        <p className="balance-hero__amount amount">{formatMoney(total)}</p>
        <p className="balance-hero__caption">
          Across {depositAccountCount} deposit accounts
        </p>
      </div>
      <div className="balance-hero__action">{action}</div>
    </section>
  )
}

import { formatMoney } from '../lib/format'
import { Card, CardHeader } from './ui/Card'
import ProgressBar from './ui/ProgressBar'

interface DailyLimitCardProps {
  limit: number
  used: number
}

export default function DailyLimitCard({ limit, used }: DailyLimitCardProps) {
  const remaining = limit - used

  return (
    <Card as="aside" aria-labelledby="daily-limit-title">
      <CardHeader title="Daily limit" titleId="daily-limit-title" />
      <div className="card__body daily-limit">
        <p className="daily-limit__remaining">
          <span className="amount">{formatMoney(remaining)}</span> remaining
          today
        </p>
        <ProgressBar value={limit > 0 ? used / limit : 0} label="Daily limit used" />
        <p className="daily-limit__note">
          Resets daily. Applies to all transfers.
        </p>
      </div>
    </Card>
  )
}

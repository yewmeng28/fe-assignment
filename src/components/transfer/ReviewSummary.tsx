import { formatMoney } from '../../lib/format'

interface ReviewSummaryProps {
  fromAccount: string
  recipient: string
  amount: number
  fee: number
  note: string
}

/** The "Check the details" table. Nothing is sent until the user confirms. */
export default function ReviewSummary({
  fromAccount,
  recipient,
  amount,
  fee,
  note,
}: ReviewSummaryProps) {
  return (
    <dl className="summary">
      <div className="summary__row">
        <dt>From</dt>
        <dd>{fromAccount}</dd>
      </div>
      <div className="summary__row">
        <dt>To</dt>
        <dd>{recipient}</dd>
      </div>
      <div className="summary__row">
        <dt>Amount</dt>
        <dd className="amount">{formatMoney(amount)}</dd>
      </div>
      <div className="summary__row">
        <dt>Fee</dt>
        <dd className="amount">{formatMoney(fee)}</dd>
      </div>
      {note ? (
        <div className="summary__row">
          <dt>Note</dt>
          <dd>{note}</dd>
        </div>
      ) : null}
      <div className="summary__row summary__row--total">
        <dt>Total</dt>
        <dd className="amount">{formatMoney(amount + fee)}</dd>
      </div>
    </dl>
  )
}

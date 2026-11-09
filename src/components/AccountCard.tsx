import type { Account } from '../api/types'
import { formatMoney } from '../lib/format'
import { Card } from './ui/Card'

export default function AccountCard({ account }: { account: Account }) {
  const isCredit = account.type === 'credit'

  return (
    <Card as="article" className="account-card">
      <h3 className="account-card__name">{account.name}</h3>
      <p className="account-card__number">{account.maskedNumber}</p>
      <p className="account-card__balance amount">
        {formatMoney(account.balance)}
      </p>
      {isCredit ? <p className="account-card__note">Amount due</p> : null}
    </Card>
  )
}

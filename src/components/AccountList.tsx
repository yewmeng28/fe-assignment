import type { Account } from '../api/types'
import AccountCard from './AccountCard'

export default function AccountList({ accounts }: { accounts: Account[] }) {
  return (
    <section aria-labelledby="accounts-title">
      <h2 id="accounts-title" className="section-title">
        Accounts
      </h2>
      <div className="account-list">
        {accounts.map((account) => (
          <AccountCard key={account.id} account={account} />
        ))}
      </div>
    </section>
  )
}

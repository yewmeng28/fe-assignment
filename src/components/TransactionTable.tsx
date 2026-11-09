import { useState } from 'react'
import type { Transaction } from '../api/types'
import { formatMoney, formatShortDate, formatText } from '../lib/format'
import { matchesSearch } from '../lib/search'
import Button from './ui/Button'
import { Card, CardHeader } from './ui/Card'
import Chip from './ui/Chip'
import EmptyState from './ui/EmptyState'
import SearchInput from './ui/SearchInput'
import { cx } from '../lib/cx'

interface TransactionTableProps {
  transactions: Transaction[]
  /** Show the "View all" / "View less" button. */
  canToggleAll: boolean
  showingAll: boolean
  onToggleAll: () => void
}

/** `in` → `+SGD 45.00`, `out` → `-SGD 86.40` */
function formatSignedAmount(transaction: Transaction): string {
  return transaction.direction === 'in'
    ? `+${formatMoney(transaction.amount)}`
    : formatMoney(-transaction.amount)
}

export default function TransactionTable({
  transactions,
  canToggleAll,
  showingAll,
  onToggleAll,
}: TransactionTableProps) {
  const [query, setQuery] = useState('')

  const isSearching = query.trim() !== ''
  const visible = transactions.filter((transaction) =>
    matchesSearch(query, [transaction.description, transaction.category]),
  )

  const clearSearch = () => setQuery('')

  return (
    <Card as="section" aria-labelledby="transactions-title">
      <CardHeader
        title="Recent transactions"
        titleId="transactions-title"
        description="Your latest account activity"
        action={
          <>
            <SearchInput
              value={query}
              onChange={setQuery}
              placeholder="Search transactions"
            />
            {canToggleAll ? (
              <Button variant="ghost" onClick={onToggleAll}>
                {showingAll ? 'View less' : 'View all'}
              </Button>
            ) : null}
          </>
        }
      />

      <p className="transactions__count" aria-live="polite">
        {isSearching
          ? `${visible.length} ${visible.length === 1 ? 'result' : 'results'}`
          : null}
      </p>

      {visible.length === 0 ? (
        isSearching ? (
          <EmptyState
            message="No transactions match your search."
            action={
              <Button variant="secondary" onClick={clearSearch}>
                Clear search
              </Button>
            }
          />
        ) : (
          <EmptyState message="No transactions to display" />
        )
      ) : (
        <div className="table-wrapper">
          <table className="txn-table">
            <thead>
              <tr>
                <th scope="col">Description</th>
                <th scope="col">Category</th>
                <th scope="col">Date</th>
                <th scope="col" className="txn-table__amount-head">
                  Amount
                </th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="txn__description">{transaction.description}</td>
                  <td className="txn__category">
                    {formatText(transaction.category)}
                  </td>
                  <td className="txn__date">
                    {formatShortDate(transaction.date)}
                  </td>
                  <td
                    className={cx(
                      'txn__amount amount',
                      transaction.direction === 'in' && 'txn__amount--in',
                    )}
                  >
                    {formatSignedAmount(transaction)}
                  </td>
                  <td className="txn__status">
                    {transaction.status === 'pending' ? (
                      <Chip type="warning">Pending</Chip>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  )
}

import { useRef, useState } from 'react'
import useAccounts from '../hooks/useAccounts'
import useCustomer from '../hooks/useCustomer'
import useTransactions from '../hooks/useTransactions'
import { getDepositAccounts, getTotalAvailable } from '../lib/accounts'
import {formatLongDate, getTimeOfDay} from '../lib/format'
import AccountList from './AccountList'
import BalanceHero from './BalanceHero'
import DailyLimitCard from './DailyLimitCard'
import DashboardSkeleton from './DashboardSkeleton'
import TransactionTable from './TransactionTable'
import TransferDialog from './transfer/TransferDialog'
import Button from './ui/Button'
import InlineError from './ui/InlineError'
import { PlusIcon } from './ui/icons'

const RECENT_LIMIT = 8
const ALL_LIMIT = 50

export default function Dashboard() {
  const customer = useCustomer()
  const accounts = useAccounts()
  const [showingAll, setShowingAll] = useState(false)
  const [transferOpen, setTransferOpen] = useState(false)
  const transferButtonRef = useRef<HTMLButtonElement>(null)
  const transactions = useTransactions(showingAll ? ALL_LIMIT : RECENT_LIMIT)

  const queries = [customer, accounts, transactions]

  const isLoading = queries.some(
    (query) => query.isPending || (query.isError && query.isFetching),
  )

  if (isLoading) {
    return (
      <main className="container page">
        <DashboardSkeleton />
      </main>
    )
  }

  if (!customer.data || !accounts.data || !transactions.data) {
    const retry = () => {
      queries.filter((query) => query.isError).forEach((query) => void query.refetch())
    }

    return (
      <main className="container page">
        <InlineError
          message="We couldn't load your dashboard."
          action={<Button onClick={retry}>Retry</Button>}
        />
      </main>
    )
  }

  const { firstName, dailyTransferLimit, transferredToday } = customer.data
  const now = new Date().toISOString()

  return (
    <main className="container page">
      {/*
        One grid. Mobile: a single column in DOM order, so the daily limit sits
        above the transactions. Desktop: the daily limit moves to the 300px
        right rail (see .rail in dashboard.css).
      */}
      <div className="dashboard">
        <div className="welcome">
          <h1 className="welcome__title">Good {getTimeOfDay(new Date().toISOString())}, {firstName}</h1>
          <p className="welcome__date">{formatLongDate(now)}</p>
        </div>

        <BalanceHero
          total={getTotalAvailable(accounts.data)}
          depositAccountCount={getDepositAccounts(accounts.data).length}
          action={
            <Button
              ref={transferButtonRef}
              variant="inverse"
              icon={<PlusIcon />}
              onClick={() => setTransferOpen(true)}
            >
              New transfer
            </Button>
          }
        />

        <AccountList accounts={accounts.data} />

        <div className="rail">
          <DailyLimitCard limit={dailyTransferLimit} used={transferredToday} />
        </div>

        <TransactionTable
          transactions={transactions.data.transactions}
          canToggleAll={showingAll || transactions.data.total > RECENT_LIMIT}
          showingAll={showingAll}
          onToggleAll={() => setShowingAll((value) => !value)}
        />
      </div>

      {transferOpen ? (
        <TransferDialog
          accounts={accounts.data}
          remainingLimit={dailyTransferLimit - transferredToday}
          returnFocusRef={transferButtonRef}
          onClose={() => setTransferOpen(false)}
        />
      ) : null}
    </main>
  )
}

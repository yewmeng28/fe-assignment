import type { Account } from '../api/types'

/** Checking and savings. The credit card is money owed, not money available. */
export function getDepositAccounts(accounts: Account[]): Account[] {
  return accounts.filter((account) => account.type !== 'credit')
}

export function getTotalAvailable(accounts: Account[]): number {
  return getDepositAccounts(accounts).reduce(
    (sum, account) => sum + account.balance,
    0,
  )
}

import { z } from 'zod'
import type { Account, CreateTransferRequest } from '../api/types'
import { formatMoney } from './format'

/**
 * Every transfer validation rule lives here, once. The form uses it for inline
 * errors (on blur) and for the Continue button; nothing else re-implements it.
 */

export const NEW_RECIPIENT = 'new'
export const BANKS = ['DBS', 'OCBC', 'UOB', 'POSB', 'Maybank', 'Citibank']
export const NOTE_MAX_LENGTH = 50
export const MIN_AMOUNT = 1

export interface TransferLimits {
  /** Deposit accounts the user can send from. */
  accounts: Account[]
  /** Daily limit minus what was already sent today. */
  remainingLimit: number
}

/** Shape of the form. All fields are strings so inputs stay controlled. */
export const transferFormShape = z.object({
  /** A saved payee id, or `NEW_RECIPIENT`. Empty until the user picks. */
  recipientId: z.string(),
  newName: z.string(),
  newAccountNumber: z.string(),
  newBank: z.string(),
  fromAccountId: z.string(),
  amount: z.string(),
  note: z.string(),
})

export type TransferFormValues = z.infer<typeof transferFormShape>

/** Returns the first problem with an amount, or `null` if it's fine. */
export function getAmountError(
  raw: string,
  balance: number | undefined,
  remainingLimit: number,
): string | null {
  const text = raw.trim()

  if (text === '') return 'Enter an amount.'
  if (!/^\d+(\.\d*)?$/.test(text)) return 'Enter a valid amount, like 25.50.'
  if (!/^\d+(\.\d{1,2})?$/.test(text)) {
    return "Amount can't have more than 2 decimal places."
  }

  const amount = Number(text)
  if (amount < MIN_AMOUNT) {
    return `The minimum transfer is ${formatMoney(MIN_AMOUNT)}.`
  }
  if (balance !== undefined && amount > balance) {
    return `Amount can't be more than your available balance (${formatMoney(balance)}).`
  }
  if (amount > remainingLimit) {
    return `This transfer exceeds your remaining daily limit (${formatMoney(remainingLimit)}).`
  }
  return null
}

export function createTransferSchema({ accounts, remainingLimit }: TransferLimits) {
  return transferFormShape.superRefine((values, ctx) => {
    const fail = (path: keyof TransferFormValues, message: string) =>
      ctx.addIssue({ code: 'custom', path: [path], message })

    if (values.recipientId === '') {
      fail('recipientId', 'Choose who you’re sending to.')
    } else if (values.recipientId === NEW_RECIPIENT) {
      const name = values.newName.trim()
      if (name.length < 2 || name.length > 50) {
        fail('newName', 'Enter a name between 2 and 50 characters.')
      }
      if (!/^\d{8}$/.test(values.newAccountNumber)) {
        fail('newAccountNumber', 'Enter a valid 8-digit account number.')
      }
      if (values.newBank === '') fail('newBank', 'Choose a bank.')
    }

    const account = accounts.find((item) => item.id === values.fromAccountId)
    if (!account) fail('fromAccountId', 'Choose an account to send from.')

    const amountError = getAmountError(values.amount, account?.balance, remainingLimit)
    if (amountError) fail('amount', amountError)

    if (values.note.length > NOTE_MAX_LENGTH) {
      fail('note', `Note can be at most ${NOTE_MAX_LENGTH} characters.`)
    }
  })
}

export function buildTransferRequest(
  values: TransferFormValues,
): CreateTransferRequest {
  const note = values.note.trim()
  const base = {
    fromAccountId: values.fromAccountId,
    amount: Number(values.amount),
    ...(note ? { note } : {}),
  }

  if (values.recipientId === NEW_RECIPIENT) {
    return {
      ...base,
      recipient: {
        name: values.newName.trim(),
        accountNumber: values.newAccountNumber,
        bank: values.newBank,
      },
    }
  }
  return { ...base, payeeId: values.recipientId }
}

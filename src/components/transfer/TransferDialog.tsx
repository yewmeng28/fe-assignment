import { useEffect, useMemo, useRef, useState, type RefObject } from 'react'
import { FormProvider, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ApiError } from '../../api/client'
import type { Account, Payee, Transfer } from '../../api/types'
import useCreateTransfer from '../../hooks/useCreateTransfer'
import usePayees from '../../hooks/usePayees'
import { getDepositAccounts } from '../../lib/accounts'
import {
  NEW_RECIPIENT,
  buildTransferRequest,
  createTransferSchema,
  type TransferFormValues,
} from '../../lib/transfer'
import Button from '../ui/Button'
import InlineError from '../ui/InlineError'
import Modal from '../ui/Modal'
import Stepper from '../ui/Stepper'
import AmountStep from './AmountStep'
import RecipientStep from './RecipientStep'
import ReviewSummary from './ReviewSummary'
import SuccessPanel from './SuccessPanel'

const STEPS = ['Recipient', 'Amount', 'Review']
const TITLES = ['Who are you sending to?', 'How much?', 'Check the details']
const FEE = 0
const SEND_ERROR =
  "Something went wrong. Your money hasn't left your account. Try again."

/** Fields to check before leaving each step. */
const STEP_FIELDS: Array<Array<keyof TransferFormValues>> = [
  ['recipientId', 'newName', 'newAccountNumber', 'newBank'],
  ['fromAccountId', 'amount', 'note'],
]

interface TransferDialogProps {
  accounts: Account[]
  remainingLimit: number
  onClose: () => void
  returnFocusRef?: RefObject<HTMLElement | null>
}

function describeRecipient(values: TransferFormValues, payees: Payee[] = []) {
  if (values.recipientId === NEW_RECIPIENT) {
    return `${values.newName.trim()} · ${values.newBank} · •••• ${values.newAccountNumber.slice(-4)}`
  }
  const payee = payees.find((item) => item.id === values.recipientId)
  return payee
    ? `${payee.name} · ${payee.bank} · ${payee.accountNumberMasked}`
    : ''
}

function getSendErrorMessage(error: unknown): string {
  // 4xx: the API explained what's wrong. Anything else: use the standard copy.
  return error instanceof ApiError && error.status < 500
    ? error.message
    : SEND_ERROR
}

/** Mount only while open so every open starts with a clean form. */
export default function TransferDialog({
  accounts,
  remainingLimit,
  onClose,
  returnFocusRef,
}: TransferDialogProps) {
  const [step, setStep] = useState(0)
  const [completed, setCompleted] = useState<Transfer | null>(null)
  const [sendError, setSendError] = useState<string | null>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)

  const payees = usePayees()
  const createTransfer = useCreateTransfer()

  const depositAccounts = useMemo(() => getDepositAccounts(accounts), [accounts])
  const schema = useMemo(
    () => createTransferSchema({ accounts: depositAccounts, remainingLimit }),
    [depositAccounts, remainingLimit],
  )

  const form = useForm<TransferFormValues>({
    resolver: zodResolver(schema),
    mode: 'onTouched',
    defaultValues: {
      recipientId: '',
      newName: '',
      newAccountNumber: '',
      newBank: '',
      fromAccountId: depositAccounts[0]?.id ?? '',
      amount: '',
      note: '',
    },
  })
  const values = useWatch({ control: form.control }) as TransferFormValues

  // Move focus to the step title so screen readers announce each new step.
  useEffect(() => {
    headingRef.current?.focus()
  }, [step])

  const goNext = async () => {
    const fields = STEP_FIELDS[step]
    if (await form.trigger(fields, { shouldFocus: true })) setStep(step + 1)
  }

  const confirm = form.handleSubmit(async (formValues) => {
    if (createTransfer.isPending) return
    setSendError(null)
    try {
      const response = await createTransfer.mutateAsync(
        buildTransferRequest(formValues),
      )
      setCompleted(response.transfer)
    } catch (error) {
      setSendError(getSendErrorMessage(error))
    }
  })

  const isSending = createTransfer.isPending
  const fromAccount = depositAccounts.find(
    (item) => item.id === values.fromAccountId,
  )

  const footer = completed ? undefined : (
    <>
      {step === 0 ? (
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
      ) : (
        <Button
          variant="secondary"
          disabled={isSending}
          onClick={() => setStep(step - 1)}
        >
          Back
        </Button>
      )}
      {step < 2 ? (
        <Button onClick={() => void goNext()}>Continue</Button>
      ) : (
        <Button disabled={isSending} onClick={() => void confirm()}>
          {isSending ? 'Sending…' : 'Confirm transfer'}
        </Button>
      )}
    </>
  )

  return (
    <Modal
      title="New transfer"
      onClose={onClose}
      closeDisabled={isSending}
      returnFocusRef={returnFocusRef}
      header={completed ? undefined : <Stepper steps={STEPS} current={step} />}
      footer={footer}
    >
      {completed ? (
        <SuccessPanel transfer={completed} onDone={onClose} />
      ) : (
        <FormProvider {...form}>
          <form noValidate onSubmit={(event) => event.preventDefault()}>
            <h3 ref={headingRef} tabIndex={-1} className="step-title">
              {TITLES[step]}
            </h3>

            {step === 0 ? (
              <RecipientStep
                payees={payees.data}
                isLoading={payees.isPending}
                isError={payees.isError}
                onRetry={() => void payees.refetch()}
              />
            ) : null}

            {step === 1 ? (
              <AmountStep
                accounts={depositAccounts}
                remainingLimit={remainingLimit}
              />
            ) : null}

            {step === 2 ? (
              <div className="step">
                <ReviewSummary
                  fromAccount={
                    fromAccount
                      ? `${fromAccount.name} · ${fromAccount.maskedNumber}`
                      : ''
                  }
                  recipient={describeRecipient(values, payees.data)}
                  amount={Number(values.amount)}
                  fee={FEE}
                  note={values.note.trim()}
                />
                {sendError ? <InlineError message={sendError} /> : null}
              </div>
            ) : null}
          </form>
        </FormProvider>
      )}
    </Modal>
  )
}

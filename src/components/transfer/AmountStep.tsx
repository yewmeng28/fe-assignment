import { useFormContext, useWatch } from 'react-hook-form'
import type { Account } from '../../api/types'
import { formatMoney } from '../../lib/format'
import {
  NOTE_MAX_LENGTH,
  type TransferFormValues,
} from '../../lib/transfer'
import { cx } from '../../lib/cx'
import Button from '../ui/Button'
import Field from '../ui/Field'

const QUICK_AMOUNTS = [50, 100, 250, 500]

interface AmountStepProps {
  /** Accounts money can be sent from (no credit card). */
  accounts: Account[]
  remainingLimit: number
}

export default function AmountStep({
  accounts,
  remainingLimit,
}: AmountStepProps) {
  const {
    register,
    control,
    setValue,
    getValues,
    trigger,
    formState: { errors },
  } = useFormContext<TransferFormValues>()
  const [fromAccountId, note] = useWatch({
    control,
    name: ['fromAccountId', 'note'],
  })
  const account = accounts.find((item) => item.id === fromAccountId)

  const setQuickAmount = (value: number) =>
    setValue('amount', String(value), {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    })

  return (
    <div className="step">
      <Field
        label="From account"
        hint="Deposit accounts only"
        error={errors.fromAccountId?.message}
      >
        {(fieldProps) => (
          <select
            className="input"
            {...fieldProps}
            {...register('fromAccountId', {
              // The balance changes with the account, so re-check the amount.
              onChange: () => {
                if (getValues('amount')) void trigger('amount')
              },
            })}
          >
            {accounts.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} · {item.maskedNumber}
              </option>
            ))}
          </select>
        )}
      </Field>

      <div className="step__group">
        <Field label="Amount" error={errors.amount?.message}>
          {(fieldProps) => (
            <div className={cx('amount-input', errors.amount && 'amount-input--invalid')}>
              <span className="amount-input__currency" aria-hidden="true">
                SGD
              </span>
              <input
                className="amount-input__field amount"
                inputMode="decimal"
                autoComplete="off"
                placeholder="0.00"
                {...fieldProps}
                {...register('amount')}
              />
            </div>
          )}
        </Field>

        <div role="group" aria-label="Quick amounts" className="quick-amounts">
          {QUICK_AMOUNTS.map((value) => (
            <Button
              key={value}
              variant="secondary"
              onClick={() => setQuickAmount(value)}
            >
              {value}
            </Button>
          ))}
        </div>

        <dl className="limits">
          <div>
            <dt>Available</dt>
            <dd className="amount">
              {account ? formatMoney(account.balance) : '–'}
            </dd>
          </div>
          <div>
            <dt>Remaining daily limit</dt>
            <dd className="amount">{formatMoney(remainingLimit)}</dd>
          </div>
        </dl>
      </div>

      <Field
        label="Note (optional)"
        error={errors.note?.message}
        aside={
          <span
            className={cx(
              'field__counter',
              note.length > NOTE_MAX_LENGTH && 'field__counter--over',
            )}
          >
            {note.length}/{NOTE_MAX_LENGTH}
          </span>
        }
      >
        {(fieldProps) => (
          <input
            className="input"
            autoComplete="off"
            {...fieldProps}
            {...register('note')}
          />
        )}
      </Field>
    </div>
  )
}

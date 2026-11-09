import { useState } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import type { Payee } from '../../api/types'
import { BANKS, NEW_RECIPIENT, type TransferFormValues } from '../../lib/transfer'
import { matchesSearch } from '../../lib/search'
import Button from '../ui/Button'
import EmptyState from '../ui/EmptyState'
import Field from '../ui/Field'
import InlineError from '../ui/InlineError'
import SearchInput from '../ui/SearchInput'
import Skeleton from '../ui/Skeleton'
import PayeeOption from './PayeeOption'

interface RecipientStepProps {
  payees: Payee[] | undefined
  isLoading: boolean
  isError: boolean
  onRetry: () => void
}

export default function RecipientStep({
  payees,
  isLoading,
  isError,
  onRetry,
}: RecipientStepProps) {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<TransferFormValues>()
  const [search, setSearch] = useState('')
  const recipientId = useWatch({ control, name: 'recipientId' })

  const visiblePayees = (payees ?? []).filter((payee) =>
    matchesSearch(search, [payee.name, payee.bank]),
  )
  const radio = register('recipientId')

  return (
    <div className="step">
      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Search payees"
      />

      <fieldset
        className="payee-list"
        aria-describedby={errors.recipientId ? 'recipient-error' : undefined}
      >
        <legend className="sr-only">Recipient</legend>

        {isLoading ? (
          [0, 1, 2].map((index) => <Skeleton key={index} height={56} />)
        ) : isError ? (
          <InlineError
            message="We couldn't load your payees."
            action={
              <Button variant="secondary" onClick={onRetry}>
                Retry
              </Button>
            }
          />
        ) : payees?.length === 0 ? (
          <EmptyState message="You have no saved payees yet." />
        ) : visiblePayees.length === 0 ? (
          <EmptyState message="No payees match your search." />
        ) : (
          visiblePayees.map((payee) => (
            <PayeeOption
              key={payee.id}
              initials={payee.initials}
              title={payee.name}
              subtitle={`${payee.bank} · ${payee.accountNumberMasked}`}
              inputProps={{ ...radio, value: payee.id }}
            />
          ))
        )}

        <PayeeOption
          initials="+"
          title="Send to someone new"
          inputProps={{ ...radio, value: NEW_RECIPIENT }}
        />
      </fieldset>

      {errors.recipientId ? (
        <p id="recipient-error" className="field__error">
          {errors.recipientId.message}
        </p>
      ) : null}

      {recipientId === NEW_RECIPIENT ? (
        <div className="new-recipient">
          <Field label="Recipient name" error={errors.newName?.message}>
            {(control) => (
              <input
                className="input"
                autoComplete="off"
                {...control}
                {...register('newName')}
              />
            )}
          </Field>
          <Field
            label="Account number"
            hint="8 digits"
            error={errors.newAccountNumber?.message}
          >
            {(control) => (
              <input
                className="input"
                inputMode="numeric"
                autoComplete="off"
                {...control}
                {...register('newAccountNumber')}
              />
            )}
          </Field>
          <Field label="Bank" error={errors.newBank?.message}>
            {(control) => (
              <select className="input" {...control} {...register('newBank')}>
                <option value="">Select a bank</option>
                {BANKS.map((bank) => (
                  <option key={bank} value={bank}>
                    {bank}
                  </option>
                ))}
              </select>
            )}
          </Field>
        </div>
      ) : null}
    </div>
  )
}

import type { ComponentProps } from 'react'

interface PayeeOptionProps {
  initials: string
  title: string
  subtitle?: string
  /** Props for the radio input (from `register`, plus `value`). */
  inputProps: ComponentProps<'input'>
}

/** One selectable row in the recipient list. A real radio, so arrow keys work. */
export default function PayeeOption({
  initials,
  title,
  subtitle,
  inputProps,
}: PayeeOptionProps) {
  return (
    <label className="payee-option">
      <input type="radio" className="payee-option__input" {...inputProps} />
      <span className="payee-option__initials" aria-hidden="true">
        {initials}
      </span>
      <span className="payee-option__text">
        <span className="payee-option__title">{title}</span>
        {subtitle ? (
          <span className="payee-option__subtitle">{subtitle}</span>
        ) : null}
      </span>
    </label>
  )
}

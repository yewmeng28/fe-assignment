import { useId, type ReactNode } from 'react'

interface FieldControlProps {
  id: string
  'aria-describedby': string | undefined
  'aria-invalid': boolean
}

interface FieldProps {
  label: string
  /** Validation message. Linked to the control with `aria-describedby`. */
  error?: string
  hint?: string
  /** Shown to the right of the label, e.g. a character counter. */
  aside?: ReactNode
  /** Render the control and spread the props you get onto it. */
  children: (control: FieldControlProps) => ReactNode
}

/** Label + control + hint + error, wired together for screen readers. */
export default function Field({
  label,
  error,
  hint,
  aside,
  children,
}: FieldProps) {
  const id = useId()
  const hintId = `${id}-hint`
  const errorId = `${id}-error`
  const describedBy =
    [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(' ') ||
    undefined

  return (
    <div className="field">
      <div className="field__top">
        <label htmlFor={id} className="field__label">
          {label}
        </label>
        {aside}
      </div>
      {children({
        id,
        'aria-describedby': describedBy,
        'aria-invalid': Boolean(error),
      })}
      {hint ? (
        <p id={hintId} className="field__hint">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="field__error">
          {error}
        </p>
      ) : null}
    </div>
  )
}

import type { ReactNode } from 'react'
import { cx } from '../../lib/cx'

interface Option<T extends string> {
  value: T
  /** Visible text, or the accessible name when `icon` is given. */
  label: string
  /** Shown instead of the text; the label then becomes the `aria-label`. */
  icon?: ReactNode
}

interface SegmentedControlProps<T extends string> {
  /** Accessible name for the group, e.g. "Appearance". */
  label: string
  options: Option<T>[]
  value: T
  onChange: (value: T) => void
  className?: string
}

/** A row of mutually exclusive toggle buttons (`aria-pressed`). */
export default function SegmentedControl<T extends string>({
  label,
  options,
  value,
  onChange,
  className,
}: SegmentedControlProps<T>) {
  return (
    <div role="group" aria-label={label} className={cx('segmented', className)}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={option.value === value}
          aria-label={option.icon ? option.label : undefined}
          onClick={() => onChange(option.value)}
        >
          {option.icon ?? option.label}
        </button>
      ))}
    </div>
  )
}

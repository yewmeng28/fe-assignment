import type { ComponentProps, ReactNode } from 'react'
import { cx } from '../../lib/cx'

type Variant = 'primary' | 'secondary' | 'ghost' | 'inverse'

interface ButtonProps extends ComponentProps<'button'> {
  variant?: Variant
  /** Stretch to the full width of the container. */
  block?: boolean
  /** Decorative icon shown before the label. */
  icon?: ReactNode
}

export default function Button({
  variant = 'primary',
  block = false,
  icon,
  type = 'button',
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cx('btn', `btn--${variant}`, block && 'btn--block', className)}
      {...rest}
    >
      {icon}
      {children}
    </button>
  )
}

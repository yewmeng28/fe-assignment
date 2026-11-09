import type { ComponentProps, ReactNode } from 'react'
import { cx } from '../../lib/cx'

interface IconButtonProps extends ComponentProps<'button'> {
  /** Required: an icon has no visible text, so the name comes from here. */
  label: string
  icon: ReactNode
}

/** A round, 44px button that shows only an icon. */
export default function IconButton({
  label,
  icon,
  type = 'button',
  className,
  ...rest
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      className={cx('icon-button', className)}
      {...rest}
    >
      {icon}
    </button>
  )
}

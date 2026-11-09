import type { ReactNode } from 'react'
import { cx } from '../../lib/cx'

interface ChipProps {
  type?: 'neutral' | 'warning' | 'positive'
  children: ReactNode
}

export default function Chip({ type = 'neutral', children }: ChipProps) {
  return <span className={cx('chip', `chip--${type}`)}>{children}</span>
}

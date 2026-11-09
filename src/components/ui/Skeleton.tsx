import { cx } from '../../lib/cx'

interface SkeletonProps {
  width?: number | string
  height?: number | string
  className?: string
}

/** Placeholder block shown while data loads. Hidden from screen readers. */
export default function Skeleton({
  width = '100%',
  height = 16,
  className,
}: SkeletonProps) {
  return (
    <span
      className={cx('skeleton', className)}
      style={{ width, height }}
      aria-hidden="true"
    />
  )
}

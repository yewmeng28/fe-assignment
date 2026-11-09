interface ProgressBarProps {
  /** Share used, from 0 to 1. */
  value: number
  label: string
}

export default function ProgressBar({ value, label }: ProgressBarProps) {
  const percent = Math.round(Math.min(Math.max(value, 0), 1) * 100)

  return (
    <div
      className="progress"
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
    >
      <div className="progress__fill" style={{ width: `${percent}%` }} />
    </div>
  )
}

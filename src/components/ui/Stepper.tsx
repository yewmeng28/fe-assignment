import { cx } from '../../lib/cx'

interface StepperProps {
  steps: string[]
  /** Zero-based index of the current step. */
  current: number
}

export default function Stepper({ steps, current }: StepperProps) {
  return (
    <ol className="stepper" aria-label="Progress">
      {steps.map((step, index) => (
        <li
          key={step}
          className={cx(
            'stepper__step',
            index === current && 'stepper__step--current',
            index < current && 'stepper__step--done',
          )}
          aria-current={index === current ? 'step' : undefined}
        >
          <span className="stepper__number" aria-hidden="true">
            {index + 1}
          </span>
          {step}
        </li>
      ))}
    </ol>
  )
}

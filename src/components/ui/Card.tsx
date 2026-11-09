import type { HTMLAttributes, ReactNode } from 'react'
import { cx } from '../../lib/cx'

interface CardProps extends HTMLAttributes<HTMLElement> {
  as?: 'section' | 'article' | 'aside' | 'div'
}

export function Card({ as: Tag = 'div', className, ...rest }: CardProps) {
  return <Tag className={cx('card', className)} {...rest} />
}

interface CardHeaderProps {
  title: string
  /** Id for the heading so the card can use `aria-labelledby`. */
  titleId?: string
  description?: string
  /** Controls shown on the right (wraps below on narrow screens). */
  action?: ReactNode
}

export function CardHeader({
  title,
  titleId,
  description,
  action,
}: CardHeaderProps) {
  return (
    <div className="card__header">
      <div>
        <h2 id={titleId} className="card__title">
          {title}
        </h2>
        {description ? <p className="card__description">{description}</p> : null}
      </div>
      {action ? <div className="card__action">{action}</div> : null}
    </div>
  )
}

import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
  type RefObject,
} from 'react'
import { createPortal } from 'react-dom'
import { CloseIcon } from './icons'

interface ModalProps {
  title: string
  onClose: () => void
  /** Disable Esc and the ✕ button, e.g. while a request is in flight. */
  closeDisabled?: boolean
  /** Element to focus after closing. Defaults to whatever had focus on open. */
  returnFocusRef?: RefObject<HTMLElement | null>
  /** Content fixed under the title (e.g. a stepper). */
  header?: ReactNode
  children: ReactNode
  /** Buttons pinned to the bottom. */
  footer?: ReactNode
}

const FOCUSABLE =
  'a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'

/**
 * Accessible modal: centred dialog on desktop, full-screen sheet on mobile
 * (see ui.css). Traps focus, closes on Esc, locks page scroll and gives focus
 * back to the opener. Mount it only while open so its state resets each time.
 */
export default function Modal({
  title,
  onClose,
  closeDisabled = false,
  returnFocusRef,
  header,
  children,
  footer,
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const [opener] = useState(() => document.activeElement as HTMLElement | null)

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    const returnTarget = returnFocusRef?.current ?? opener
    document.body.style.overflow = 'hidden'
    dialogRef.current?.focus()

    return () => {
      document.body.style.overflow = previousOverflow
      returnTarget?.focus()
    }
  }, [opener, returnFocusRef])

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape' && !closeDisabled) {
      event.stopPropagation()
      onClose()
      return
    }

    if (event.key !== 'Tab' || !dialogRef.current) return

    const focusable = Array.from(
      dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
    )
    if (focusable.length === 0) return

    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    const active = document.activeElement

    if (event.shiftKey && (active === first || active === dialogRef.current)) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && active === last) {
      event.preventDefault()
      first.focus()
    }
  }

  return createPortal(
    <div className="modal-backdrop">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
        className="modal"
        onKeyDown={handleKeyDown}
      >
        <div className="modal__header">
          <h2 id="modal-title" className="modal__title">
            {title}
          </h2>
          <button
            type="button"
            className="modal__close"
            aria-label="Close"
            disabled={closeDisabled}
            onClick={onClose}
          >
            <CloseIcon />
          </button>
        </div>
        {header}
        <div className="modal__body">{children}</div>
        {footer ? <div className="modal__footer">{footer}</div> : null}
      </div>
    </div>,
    document.body,
  )
}

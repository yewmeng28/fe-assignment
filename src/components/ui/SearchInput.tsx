import { useId } from 'react'
import { cx } from '../../lib/cx'
import { CloseIcon, SearchIcon } from './icons'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder: string
  /** Accessible name; defaults to the placeholder. */
  label?: string
  className?: string
}

export default function SearchInput({
  value,
  onChange,
  placeholder,
  label = placeholder,
  className,
}: SearchInputProps) {
  const id = useId()

  return (
    <div className={cx('search', className)}>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <span className="search__icon">
        <SearchIcon />
      </span>
      <input
        id={id}
        type="search"
        className="search__input"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
      {value ? (
        <button
          type="button"
          className="search__clear"
          aria-label="Clear text"
          onClick={() => onChange('')}
        >
          <CloseIcon />
        </button>
      ) : null}
    </div>
  )
}

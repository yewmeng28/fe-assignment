interface AvatarProps {
  initials: string
  /** Accessible name, e.g. "Account: Ava Chen". */
  label: string
}

export default function Avatar({ initials, label }: AvatarProps) {
  return (
    <span className="avatar" role="img" aria-label={label}>
      {initials}
    </span>
  )
}

import MeridianMark from './MeridianMark'
import SegmentSwitch from './SegmentSwitch'
import ThemeToggle from './ThemeToggle'
import Avatar from './ui/Avatar'

// Overview is the only page. The others are decoration (out of scope), so
// they are shown disabled.
const NAV_ITEMS = ['Overview', 'Cards', 'Payments', 'Insights']

export default function Header() {
  return (
    <header className="app-header">
      <div className="app-header__inner container">
        <div className="app-header__brand">
          <MeridianMark />
          <strong>Meridian</strong>
        </div>

        <nav aria-label="Primary" className="app-header__nav">
          {NAV_ITEMS.map((item, index) => (
            <button
              key={item}
              type="button"
              className="app-header__link"
              aria-current={index === 0 ? 'page' : undefined}
              disabled={index !== 0}
            >
              {item}
            </button>
          ))}
        </nav>

        {/* Single instance; on mobile CSS moves it onto its own row. */}
        <SegmentSwitch className="app-header__segment" />
        <ThemeToggle />
        <Avatar initials="AC" label="Account: Ava Chen" />
      </div>
    </header>
  )
}

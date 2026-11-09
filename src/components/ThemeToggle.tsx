import usePreference from '../hooks/usePreference'
import SegmentedControl from './ui/SegmentedControl'
import { MoonIcon, SunIcon } from './ui/icons'

export default function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = usePreference('theme')

  return (
    <SegmentedControl
      label="Appearance"
      className={className}
      value={theme}
      onChange={setTheme}
      options={[
        { value: 'light', label: 'Light', icon: <SunIcon /> },
        { value: 'dark', label: 'Dark', icon: <MoonIcon /> },
      ]}
    />
  )
}

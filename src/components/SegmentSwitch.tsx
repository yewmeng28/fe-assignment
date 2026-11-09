import usePreference from '../hooks/usePreference'
import SegmentedControl from './ui/SegmentedControl'

export default function SegmentSwitch({ className }: { className?: string }) {
  const [segment, setSegment] = usePreference('segment')

  return (
    <SegmentedControl
      label="Customer segment"
      className={className}
      value={segment}
      onChange={setSegment}
      options={[
        { value: 'retail', label: 'Retail' },
        { value: 'premium', label: 'Premium' },
      ]}
    />
  )
}

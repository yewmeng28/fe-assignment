/**
 * Shared formatters so every screen (and test) renders money and dates the
 * same way.
 *
 * Note: `Intl` puts a non-breaking space (U+00A0) between `SGD` and the
 * number. In tests, assert against `formatMoney(...)` rather than typing the
 * string by hand.
 */
const money = new Intl.NumberFormat('en-SG', {
  style: 'currency',
  currency: 'SGD',
  currencyDisplay: 'code',
})

/** `4280.55` → `SGD 4,280.55`, `-420.3` → `-SGD 420.30` */
export function formatMoney(amount: number): string {
  return money.format(amount)
}

// Dates are shown in Singapore time so the output doesn't depend on where the
// app (or the test runner) happens to be.
const shortDate = new Intl.DateTimeFormat('en-SG', {
  day: 'numeric',
  month: 'short',
  timeZone: 'Asia/Singapore',
})

const longDate = new Intl.DateTimeFormat('en-SG', {
  day: 'numeric',
  weekday: 'long',
  month: 'long',
  timeZone: 'Asia/Singapore',
})

/** `2026-10-18T08:15:00+08:00` → `18 Oct` */
export function formatShortDate(iso: string): string {
  return shortDate.format(new Date(iso))
}

/** `2026-10-18T08:15:00+08:00` → `Wednesday,18 October` */
export function formatLongDate(iso: string): string {
  return longDate.format(new Date(iso))
}

const hourInSingapore = new Intl.DateTimeFormat('en-SG', {
  hour: 'numeric',
  hourCycle: 'h23',
  timeZone: 'Asia/Singapore',
})

/** ISO timestamp → `morning` | `afternoon` | `evening` (Singapore time). */
export function getTimeOfDay(iso: string): string {
  const hour = Number(hourInSingapore.format(new Date(iso)))

  if (hour < 12) return 'morning'
  if (hour < 17) return 'afternoon'
  return 'evening'
}

export function formatText(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

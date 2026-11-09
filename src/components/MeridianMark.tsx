/**
 * Meridian logo mark: an "M" whose diagonals are drawn as a single wave.
 * The stems are the peaks, the centre dips to a trough, then the line
 * rises again. A fainter second wave sits beneath as a "horizon" line.
 * Colours come from tokens via CSS (see .brand-mark in index.css).
 */
export default function MeridianMark({ size = 32 }: { size?: number }) {
  return (
    <svg
      className="brand-mark"
      width={size}
      height={size}
      viewBox="0 0 32 32"
      aria-hidden="true"
      focusable="false"
    >
      <rect className="brand-mark-bg" width="32" height="32" rx="8" />
      <path
        className="brand-mark-wave"
        d="M8 21V10C8 10 11.5 10 13 15C14.2 19 14.8 20 16 20C17.2 20 17.8 19 19 15C20.5 10 24 10 24 10V21"
      />
      <path
        className="brand-mark-swell"
        d="M8 25.5C10.7 23.5 13.3 23.5 16 25.5C18.7 27.5 21.3 27.5 24 25.5"
      />
    </svg>
  )
}

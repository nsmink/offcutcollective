import type { ReactNode } from "react"

// Shared hand-drawn annotation primitives used across the Inspiration page and
// the service subpages. Authors configure which word(s) get underlined and
// which image region gets circled from Sanity, and these components render
// the actual SVG marks.

export function DrawnUnderline({ className }: { className?: string }) {
  return (
    <svg
      className={className ? `studio-drawn-underline ${className}` : "studio-drawn-underline"}
      viewBox="0 0 240 20"
      aria-hidden="true"
    >
      <path d="M5 11C16 10 25 13 36 12C47 11 55 8 66 10C77 12 85 15 96 13C108 11 114 7 126 10C137 13 144 16 156 13C168 10 173 7 185 10C197 13 204 16 216 13C225 11 232 10 237 12" />
    </svg>
  )
}

// Wrap any word(s) in a title/subtitle with <Underlined> to draw the
// hand-drawn underline beneath them. Authors choose which word(s) to
// underline by configuring the underline text in Sanity, without touching
// the SVG or CSS.
export function Underlined({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className="studio-title-underlined">
      {children}
      <DrawnUnderline className={className} />
    </span>
  )
}

// Splits a title into a plain prefix/suffix and an underlined middle segment
// matching `underlineText` (case-insensitive). Falls back to underlining the
// whole title when no match is configured/found.
export function renderUnderlinedTitle(title: string, underlineText: string | undefined, className?: string): ReactNode {
  const target = underlineText?.trim()

  if (!target) {
    return <Underlined className={className}>{title}</Underlined>
  }

  const index = title.toLowerCase().indexOf(target.toLowerCase())

  if (index === -1) {
    return <Underlined className={className}>{title}</Underlined>
  }

  const before = title.slice(0, index)
  const match = title.slice(index, index + target.length)
  const after = title.slice(index + target.length)

  return (
    <>
      {before}
      <Underlined className={className}>{match}</Underlined>
      {after}
    </>
  )
}

// Like renderUnderlinedTitle, but renders the plain title with no underline at
// all when no underlineText is configured/found, instead of underlining the
// whole title. Use this for titles that previously had no underline by
// default (About page, homepage) so the annotation only appears when an
// editor explicitly configures it in Sanity.
export function renderOptionallyUnderlinedTitle(
  title: string,
  underlineText: string | undefined,
  className?: string,
): ReactNode {
  const target = underlineText?.trim()

  if (!target) {
    return title
  }

  const index = title.toLowerCase().indexOf(target.toLowerCase())

  if (index === -1) {
    return title
  }

  const before = title.slice(0, index)
  const match = title.slice(index, index + target.length)
  const after = title.slice(index + target.length)

  return (
    <>
      {before}
      <Underlined className={className}>{match}</Underlined>
      {after}
    </>
  )
}

export function DrawnCircle({ className }: { className?: string }) {
  return (
    <svg
      className={className ? `studio-drawn-circle ${className}` : "studio-drawn-circle"}
      viewBox="0 0 200 200"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path d="M101 7C148 3 193 38 197 95C200 141 172 182 124 192C77 202 27 184 10 138C-6 94 22 46 68 15C79 8 90 10 101 7" />
    </svg>
  )
}

// Configures a hand-drawn circle over a region of an image. `region` is a
// percentage-based box (top/left/width/height) relative to the image, so any
// image can have its own circled area — driven directly from Sanity content.
export type CircleRegion = { top: string; left: string; width: string; height: string }

export function CircledRegion({ region }: { region: CircleRegion }) {
  return (
    <div
      className="studio-drawn-circle-wrap"
      style={{ top: region.top, left: region.left, width: region.width, height: region.height }}
      aria-hidden="true"
    >
      <DrawnCircle />
    </div>
  )
}

// Sanity stores circle regions as plain percentage numbers (0-100). Converts
// that shape into the CSS-ready CircleRegion string format above.
export function toCircleRegion(
  region: { top?: number; left?: number; width?: number; height?: number } | null | undefined,
): CircleRegion | null {
  if (
    !region ||
    typeof region.top !== "number" ||
    typeof region.left !== "number" ||
    typeof region.width !== "number" ||
    typeof region.height !== "number"
  ) {
    return null
  }

  return {
    top: `${region.top}%`,
    left: `${region.left}%`,
    width: `${region.width}%`,
    height: `${region.height}%`,
  }
}

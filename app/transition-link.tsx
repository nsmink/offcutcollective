'use client'

// A drop-in replacement for next/link's <Link> that routes internal
// navigations through the shared page-transition curtain (see
// page-transition.tsx) instead of navigating instantly. External links,
// hash links, and modified clicks (cmd/ctrl/middle-click, target="_blank")
// are left to behave like a normal link/anchor.
import Link from "next/link"
import { forwardRef, type MouseEvent } from "react"
import { usePageTransition } from "./page-transition"

type TransitionLinkProps = Omit<React.ComponentPropsWithoutRef<typeof Link>, "href"> & {
  href: string
}

const TransitionLink = forwardRef<HTMLAnchorElement, TransitionLinkProps>(function TransitionLink(
  { href, onClick, ...rest },
  ref,
) {
  const { navigate } = usePageTransition()

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event)

    if (event.defaultPrevented) {
      return
    }

    const isModifiedClick = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0
    const isHashLink = href.startsWith("#") || href.startsWith("/#")
    const isExternalOrProtocolLink = href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("http")

    if (isModifiedClick || isHashLink || isExternalOrProtocolLink) {
      return
    }

    event.preventDefault()
    navigate(href)
  }

  return <Link ref={ref} href={href} onClick={handleClick} {...rest} />
})

export default TransitionLink

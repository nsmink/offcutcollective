import Link from "next/link"
import TransitionLink from "./transition-link"
import { DEFAULT_CONTACT_EMAIL } from "./contact"

type SiteHeaderProps = {
  activeHref?: string
  contactEmail?: string
}

// The standard site header (wordmark + primary nav) shared by About, the
// service subpages, and any generic CMS-created page. It intentionally
// renders as a plain sibling to each page's PageTransitionFrame-wrapped
// content, so it never animates during route transitions.
export default function SiteHeader({ activeHref, contactEmail = DEFAULT_CONTACT_EMAIL }: SiteHeaderProps) {
  return (
    <header className="studio-header">
      <TransitionLink href="/" className="studio-brand site-wordmark">
        offcut studio
      </TransitionLink>
      <nav className="studio-nav" aria-label="Main navigation">
        <Link href="/#work">Work</Link>
        <TransitionLink href="/about" aria-current={activeHref === "/about" ? "page" : undefined}>
          About
        </TransitionLink>
        <a href={`mailto:${contactEmail}`}>Say hello ↗</a>
      </nav>
    </header>
  )
}

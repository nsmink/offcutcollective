import Link from "next/link"
import TransitionLink from "./transition-link"
import { DEFAULT_CONTACT_EMAIL } from "./contact"

type SiteFooterProps = {
  description?: string
  contactEmail?: string
}

export default function SiteFooter({
  description = "Making sense of complexity, one useful offcut at a time.",
  contactEmail = DEFAULT_CONTACT_EMAIL,
}: SiteFooterProps) {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div>
          <p className="site-wordmark">offcut studio</p>
          <p className="site-footer-note">{description}</p>
        </div>
        <nav className="site-footer-links" aria-label="Footer navigation">
          <TransitionLink href="/about">About</TransitionLink>
          <Link href="/#work">Work</Link>
          <TransitionLink href="/studio">Inspiration</TransitionLink>
          <a href={`mailto:${contactEmail}`}>Email ↗</a>
        </nav>
        <p className="site-footer-meta">© {new Date().getFullYear()} Offcut Studio</p>
      </div>
    </footer>
  )
}

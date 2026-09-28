import type { Metadata } from "next"
import Link from "next/link"
import SiteFooter from "../site-footer"
import TransitionLink from "../transition-link"
import { client } from "@/sanity/client"
import { ABOUT_PAGE_QUERY, SITE_SETTINGS_QUERY } from "@/sanity/queries"
import { renderOptionallyUnderlinedTitle } from "../drawn-annotations"
import { PageTransitionFrame } from "../page-transition"
import { ContentBlocks, type ContentBlock } from "../content-blocks"

export const metadata: Metadata = {
  title: "About — Offcut Co.",
  description: "A short introduction to Offcut Studio and how we work.",
}

export const dynamic = "force-dynamic"

export default async function AboutPage() {
  const [aboutPage, siteSettings] = await Promise.all([
    client.fetch<{
      kicker?: string
      title?: string
      underlineText?: string
      paragraphs?: string[]
      contactLabel?: string
      content?: ContentBlock[]
    } | null>(ABOUT_PAGE_QUERY),
    client.fetch<{
      footerDescription?: string
      contactEmail?: string
    } | null>(SITE_SETTINGS_QUERY),
  ])

  const paragraphs = aboutPage?.paragraphs?.filter(Boolean) ?? [
    "Offcut Studio is a small collective for people, teams, and organisations working through complexity. We look closely at the systems around us, keep what is useful, and turn overlooked details into clearer ways of working.",
    "Our work moves between research, design, development, workshops, and physical making. We bring the right mix together for each question, with curiosity, care, and a preference for practical ideas over unnecessary noise.",
  ]

  return (
    <div className="about-page">
      <header className="studio-header">
        <TransitionLink href="/" className="studio-brand site-wordmark">offcut studio</TransitionLink>
        <nav className="studio-nav" aria-label="Main navigation">
          <Link href="/#work">Work</Link>
          <TransitionLink href="/about" aria-current="page">About</TransitionLink>
          <Link href="/#contact">Say hello ↗</Link>
        </nav>
      </header>

      <PageTransitionFrame>
      <main className="about-shell">
        <section className="about-paper" aria-labelledby="about-title">
        <div className="about-paper-shape" aria-hidden="true" />
          <div className="about-kicker">{aboutPage?.kicker ?? "About Offcut"}</div>
          <h1 id="about-title">
            {renderOptionallyUnderlinedTitle(aboutPage?.title ?? "We find the useful bits hiding in the mess.", aboutPage?.underlineText)}
          </h1>
          <div className="about-copy">
            {paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
          <Link href={`mailto:${siteSettings?.contactEmail ?? "hello@offcut.studio"}`} className="about-contact">
            {aboutPage?.contactLabel ?? "Start a conversation"} ↗
          </Link>
          <ContentBlocks blocks={aboutPage?.content} />
        </section>
      </main>
      <SiteFooter
        description={siteSettings?.footerDescription}
        contactEmail={siteSettings?.contactEmail}
      />
      </PageTransitionFrame>
    </div>
  )
}

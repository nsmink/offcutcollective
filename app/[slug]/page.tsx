import type { Metadata } from "next"
import { notFound } from "next/navigation"
import SiteFooter from "../site-footer"
import SiteHeader from "../site-header"
import { client } from "@/sanity/client"
import { PAGE_BY_SLUG_QUERY, PAGE_SLUGS_QUERY, SITE_SETTINGS_QUERY } from "@/sanity/queries"
import { renderOptionallyUnderlinedTitle } from "../drawn-annotations"
import { PageTransitionFrame } from "../page-transition"
import { ContentBlocks, type ContentBlock } from "../content-blocks"

// Reserved routes handled by their own dedicated page files. A generic CMS
// page created in Sanity with one of these slugs would otherwise collide
// with those routes, so we exclude them here rather than at the CMS level.
const reservedSlugs = new Set([
  "about",
  "studio",
  "ontwerp",
  "ontwikkeling",
  "onderzoek",
  "offsite",
  "objecten",
])

export const dynamic = "force-dynamic"
export const dynamicParams = true

type PageData = {
  title?: string
  kicker?: string
  underlineText?: string
  intro?: string
  contactLabel?: string
  content?: ContentBlock[]
}

async function getPage(slug: string) {
  if (reservedSlugs.has(slug)) {
    return null
  }

  return client.fetch<PageData | null>(PAGE_BY_SLUG_QUERY, { slug })
}

export async function generateStaticParams() {
  const slugs = await client.fetch<string[]>(PAGE_SLUGS_QUERY)
  return slugs.filter((slug) => !reservedSlugs.has(slug)).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const page = await getPage(slug)

  if (!page) {
    return {}
  }

  return {
    title: `${page.title ?? slug} — Offcut Co.`,
  }
}

export default async function GenericPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [page, siteSettings] = await Promise.all([
    getPage(slug),
    client.fetch<{ footerDescription?: string; contactEmail?: string } | null>(SITE_SETTINGS_QUERY),
  ])

  if (!page) {
    notFound()
  }

  return (
    <div className="about-page">
      <SiteHeader />

      <PageTransitionFrame>
        <main className="about-shell">
          <section className="about-paper" aria-labelledby="page-title">
            <div className="about-paper-shape" aria-hidden="true" />
            <div className="about-kicker">{page.kicker ?? "Offcut Studio"}</div>
            <h1 id="page-title">{renderOptionallyUnderlinedTitle(page.title ?? "", page.underlineText)}</h1>
            {page.intro && (
              <div className="about-copy">
                <p>{page.intro}</p>
              </div>
            )}
            {page.contactLabel && (
              <a href={`mailto:${siteSettings?.contactEmail ?? "hello@offcut.studio"}`} className="about-contact">
                {page.contactLabel} ↗
              </a>
            )}
            <ContentBlocks blocks={page.content} />
          </section>
        </main>
        <SiteFooter description={siteSettings?.footerDescription} contactEmail={siteSettings?.contactEmail} />
      </PageTransitionFrame>
    </div>
  )
}

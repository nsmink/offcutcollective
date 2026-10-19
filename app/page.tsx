import { cookies } from "next/headers"
import HomeClient from "./home-client"
import { client } from "@/sanity/client"
import { HOME_PAGE_QUERY, PROMOTED_INSPIRATION_QUERY, SITE_SETTINGS_QUERY } from "@/sanity/queries"
import type { ContentBlock } from "./content-blocks"

export const dynamic = "force-dynamic"

export default async function Home() {
  const cookieStore = await cookies()
  const hasSeenHomepageIntro = cookieStore.get("offcut-homepage-intro-seen")?.value === "1"
  const [promotedInspiration, homePage, siteSettings] = await Promise.all([
    client.fetch<{
      title?: string
      dateLabel?: string
      description?: string
    } | null>(PROMOTED_INSPIRATION_QUERY),
    client.fetch<{ content?: ContentBlock[] } | null>(HOME_PAGE_QUERY),
    client.fetch<{ contactEmail?: string } | null>(SITE_SETTINGS_QUERY),
  ])

  return (
    <HomeClient
      hasSeenHomepageIntro={hasSeenHomepageIntro}
      promotedInspiration={promotedInspiration}
      content={homePage?.content}
      contactEmail={siteSettings?.contactEmail}
    />
  )
}

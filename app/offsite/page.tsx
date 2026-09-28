import type { Metadata } from "next"
import ResearchClient from "../onderzoek/onderzoek-client"
import { getServicePageConfig } from "@/sanity/service-page"

export const metadata: Metadata = {
  title: "Offsite — Offcut Co.",
  description: "Hands-on training days for teams and professionals.",
}

export const dynamic = "force-dynamic"

export default async function OffsitePage() {
  const config = await getServicePageConfig({
    slug: "offsite",
    title: "Offsite",
    intro: "We create focused training days where teams can step out of the daily rhythm, make space for new ideas, and turn them into practical moves.",
    rotation: "-1.45deg",
  })

  return (
    <ResearchClient config={config} />
  )
}

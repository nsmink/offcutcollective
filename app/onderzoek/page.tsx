import type { Metadata } from "next"
import ResearchClient from "./onderzoek-client"
import { getServicePageConfig } from "@/sanity/service-page"

export const metadata: Metadata = {
  title: "Onderzoek — Offcut Co.",
  description: "Services for research, data analysis, A/B testing, and usability.",
}

export const dynamic = "force-dynamic"

export default async function ResearchPage() {
  const config = await getServicePageConfig({
    slug: "onderzoek",
    title: "Onderzoek",
    intro: "We uncover the patterns, friction, and opportunities hidden inside complex systems, using research that gives teams a clear next step.",
    rotation: "1.25deg",
  })

  return (
    <ResearchClient config={config} />
  )
}

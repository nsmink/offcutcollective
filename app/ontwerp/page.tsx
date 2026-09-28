import type { Metadata } from "next"
import ResearchClient from "../onderzoek/onderzoek-client"
import { getServicePageConfig } from "@/sanity/service-page"

export const metadata: Metadata = {
  title: "Ontwerp — Offcut Co.",
  description: "Designing clear digital solutions for complex systems, information, and tasks.",
}

export const dynamic = "force-dynamic"

export default async function DesignPage() {
  const config = await getServicePageConfig({
    slug: "ontwerp",
    title: "Ontwerp",
    intro: "We turn complex systems, information, and tasks into clear digital products that feel considered, useful, and easy to move through.",
    rotation: "-0.85deg",
  })

  return (
    <ResearchClient config={config} />
  )
}

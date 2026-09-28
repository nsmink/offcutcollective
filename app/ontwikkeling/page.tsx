import type { Metadata } from "next"
import ResearchClient from "../onderzoek/onderzoek-client"
import { getServicePageConfig } from "@/sanity/service-page"

export const metadata: Metadata = {
  title: "Ontwikkeling — Offcut Co.",
  description: "Building and adapting digital products for real workflows.",
}

export const dynamic = "force-dynamic"

export default async function DevelopmentPage() {
  const config = await getServicePageConfig({
    slug: "ontwikkeling",
    title: "Ontwikkeling",
    intro: "We adapt or build digital products around the way people actually work, keeping the structure lightweight, reliable, and ready to grow.",
    rotation: "1.8deg",
  })

  return (
    <ResearchClient config={config} />
  )
}

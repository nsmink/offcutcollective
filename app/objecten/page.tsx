import type { Metadata } from "next"
import ResearchClient from "../onderzoek/onderzoek-client"
import { getServicePageConfig } from "@/sanity/service-page"

export const metadata: Metadata = {
  title: "Objecten — Offcut Co.",
  description: "Physical products made from local offcuts.",
}

export const dynamic = "force-dynamic"

export default async function ObjectsPage() {
  const config = await getServicePageConfig({
    slug: "objecten",
    title: "Objecten",
    intro: "We make physical products from local offcuts, giving overlooked materials a useful second life through small, thoughtful objects.",
    rotation: "0.7deg",
  })

  return (
    <ResearchClient config={config} />
  )
}

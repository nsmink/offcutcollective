import type { Metadata } from "next"
import StudioClient from "./studio-client"

export const metadata: Metadata = {
  title: "Inspiration — Offcut Co.",
  description: "Why so serious? Inspiration from urban design interventions.",
}

export default function InspirationPage() {
  return <StudioClient />
}

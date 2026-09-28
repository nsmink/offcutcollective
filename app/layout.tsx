import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { PageTransitionProvider } from "./page-transition"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Offcut studio",
  description: "Offcut Studio is a small collective for people, teams, and organisations working through complexity",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        <PageTransitionProvider>{children}</PageTransitionProvider>
      </body>
    </html>
  )
}

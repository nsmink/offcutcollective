'use client'

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState, type CSSProperties } from "react"
import SiteFooter from "./site-footer"
import TransitionLink from "./transition-link"
import { PageTransitionFrame } from "./page-transition"
import { renderOptionallyUnderlinedTitle } from "./drawn-annotations"
import { ContentBlocks, type ContentBlock } from "./content-blocks"

function CategoryDrawing({ variant }: { variant: "curves" | "slashes" | "laneStripes" | "smiley" | "cutPlan" }) {
  const shared = `category-icon-drawing category-icon-drawing-${variant} drawn-annotation`

  switch (variant) {
    case "curves":
      return (
        <svg viewBox="0 0 112 112" className={shared} aria-hidden="true">
          <path pathLength="1" d="M21 96C21 56 52 24 96 20" />
          <path pathLength="1" d="M46 96C46 69 69 46 96 46" />
        </svg>
      )
    case "slashes":
      return (
        <svg viewBox="0 0 112 112" className={shared} aria-hidden="true">
          <path pathLength="1" d="M49 71C52 61 55 51 59 42" />
          <path pathLength="1" d="M65 71C68 61 71 51 75 42" />
        </svg>
      )
    case "laneStripes":
      return (
        <svg viewBox="0 0 112 112" className={shared} aria-hidden="true">
          <path pathLength="1" d="M64 24C62 36 60 48 58 60" />
          <path pathLength="1" d="M56 72C54 83 52 94 50 104" />
        </svg>
      )
    case "smiley":
      return (
        <svg viewBox="0 0 112 112" className={shared} aria-hidden="true">
          <path pathLength="1" d="M35 56C35 43 44 34 57 34C70 34 78 43 78 56C78 68 69 77 56 77C44 77 35 68 35 56Z" />
          <path pathLength="1" d="M46 51C48 49 50 49 52 51" />
          <path pathLength="1" d="M61 51C63 49 66 49 67 52" />
          <path pathLength="1" d="M45 62C49 67 55 69 61 68C65 67 69 64 71 60" />
          <path pathLength="1" d="M37 50C38 40 46 33 57 32" />
        </svg>
      )
    case "cutPlan":
      return (
        <svg viewBox="0 0 112 112" className={shared} aria-hidden="true">
          <path pathLength="1" d="M13 25H41V48H13Z" />
          <path pathLength="1" d="M68 23H101V40H68Z" />
          <path pathLength="1" d="M69 60H101V84H69Z" />
          <path pathLength="1" d="M18 68C30 61 44 65 48 78C39 90 23 87 16 75C15 72 15 70 18 68Z" />
        </svg>
      )
    default:
      return null
  }
}

function CategoryArtwork({ variant, className }: { variant: "orangeArc" | "darkGreenTopBar" | "coralWedge" | "terracottaCircle" | "greenRoundedBase"; className?: string }) {
  const shared = className ?? "h-full w-full"

  switch (variant) {
    case "orangeArc":
      return (
        <svg viewBox="0 0 78 78" className={shared} aria-hidden="true">
          <path
            d="M40.173 74.5024C39.4464 65.1189 40.0412 36.527 73.5091 32.7139C75.058 32.5385 76.2276 31.3483 76.2356 29.9214L78 2.83531C78.008 1.20658 76.511 -0.0888027 74.7306 0.00476897C59.8609 0.788432 -2.01716 5.14243 0.0506281 75.2422C0.0945387 76.792 1.4917 78.0231 3.19223 77.9997L37.1351 77.523C38.9115 77.4996 40.2967 76.1195 40.173 74.5024Z"
            fill="#F3802A"
          />
        </svg>
      )
    case "darkGreenTopBar":
      return (
        <svg viewBox="0 0 88 54" className={shared} aria-hidden="true">
          <path d="M5.39275 0H88V54H0V7.89458C0 3.53644 2.41712 0 5.39586 0H5.39275Z" fill="#185047" />
        </svg>
      )
    case "coralWedge":
      return (
        <svg viewBox="0 0 54 88" className={shared} aria-hidden="true">
          <path d="M0 88L20.4491 0H54V88H0Z" fill="#FA956F" />
        </svg>
      )
    case "terracottaCircle":
      return (
        <svg viewBox="0 0 72 72" className={shared} aria-hidden="true">
          <path d="M36 72C55.8822 72 72 55.8822 72 36C72 16.1178 55.8822 0 36 0C16.1178 0 0 16.1178 0 36C0 55.8822 16.1178 72 36 72Z" fill="#D86033" />
        </svg>
      )
    case "greenRoundedBase":
      return (
        <svg viewBox="0 0 88 54" className={shared} aria-hidden="true">
          <path d="M0 0H88C88 29.8034 76.0305 54 61.2876 54H0V0Z" fill="#428C53" />
        </svg>
      )
    default:
      return null
  }
}

const categoryCards = [
  { number: "01 /", color: "text-[#f3802a]", artwork: "orangeArc" as const, artworkClassName: "h-[78px] w-[88px]", title: "Ontwerp", description: "Digitale oplossingen voor complexe systemen, informatie of taken.", marker: "curves" as const, href: "/ontwerp", rotation: "-0.85deg" },
  { number: "02 /", color: "text-[#185047]", artwork: "darkGreenTopBar" as const, artworkClassName: "h-[54px] w-[88px]", title: "Ontwikkeling", description: "Aanpassen of bouwen van digitale producten.", marker: "slashes" as const, href: "/ontwikkeling", rotation: "1.8deg" },
  { number: "03 /", color: "text-[#fa956f]", artwork: "coralWedge" as const, artworkClassName: "h-[88px] w-[54px]", title: "Onderzoek", description: "Uitlichten van knelpunten en kansen met data-analyse en UX research.", marker: "laneStripes" as const, href: "/onderzoek", rotation: "1.25deg" },
  { number: "04 /", color: "text-[#d86033]", artwork: "terracottaCircle" as const, artworkClassName: "h-[72px] w-[72px]", title: "Offsite", description: "Trainingsdagen voor teams en professionals.", marker: "smiley" as const, href: "/offsite", rotation: "-1.45deg" },
  { number: "05 /", color: "text-[#428c53]", artwork: "greenRoundedBase" as const, artworkClassName: "h-[54px] w-[88px]", title: "Objecten", description: "Fysieke producten van lokale offcuts.", marker: "cutPlan" as const, href: "/objecten", rotation: "0.7deg" },
]

type PromotedInspiration = {
  title?: string
  underlineText?: string
  dateLabel?: string
  description?: string
} | null

export default function HomeClient({
  hasSeenHomepageIntro = false,
  promotedInspiration,
  content,
}: {
  hasSeenHomepageIntro?: boolean
  promotedInspiration?: PromotedInspiration
  content?: ContentBlock[]
}) {
  const router = useRouter()
  const [shouldRunHomepageIntro, setShouldRunHomepageIntro] = useState(!hasSeenHomepageIntro)
  const defaultOrbPosition = { left: -82, top: 98, scale: 1 }
  const defaultCoralAccentPosition = { x: 0, y: 0, rotate: 7, scale: 1 }
  const defaultBlueAccentPosition = { x: 0, y: 0, rotate: -9, scale: 1 }

  const [orbPosition, setOrbPosition] = useState(defaultOrbPosition)
  const [coralAccentPosition, setCoralAccentPosition] = useState(defaultCoralAccentPosition)
  const [blueAccentPosition, setBlueAccentPosition] = useState(defaultBlueAccentPosition)
  const [isBooting, setIsBooting] = useState(!hasSeenHomepageIntro)
  const [isPageVisible, setIsPageVisible] = useState(hasSeenHomepageIntro)
  const inspirationTitle = promotedInspiration?.title ?? "Why so serious? Inspiration from urban design interventions."
  const inspirationDate = promotedInspiration?.dateLabel ?? "Berlin art week 2026"

  useEffect(() => {
    router.prefetch("/studio")
    router.prefetch("/onderzoek")
    router.prefetch("/ontwerp")
    router.prefetch("/ontwikkeling")
    router.prefetch("/offsite")
    router.prefetch("/objecten")

    const hasSeenIntro = hasSeenHomepageIntro || window.sessionStorage.getItem("offcut-homepage-intro-seen") === "1"

    if (hasSeenIntro) {
      setShouldRunHomepageIntro(false)
      setIsBooting(false)
      setIsPageVisible(true)
      return
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const minimumBootDelay = reduceMotion ? 250 : 2200
    const loadingExitDuration = reduceMotion ? 0 : 900

    const pageRevealTimer = window.setTimeout(() => {
      setIsPageVisible(true)
      window.sessionStorage.setItem("offcut-homepage-intro-seen", "1")
      document.cookie = "offcut-homepage-intro-seen=1; path=/; max-age=86400; SameSite=Lax"
    }, minimumBootDelay)

    const bootTimer = window.setTimeout(() => {
      setIsBooting(false)
    }, minimumBootDelay + loadingExitDuration)

    return () => {
      window.clearTimeout(bootTimer)
      window.clearTimeout(pageRevealTimer)
    }
  }, [router, hasSeenHomepageIntro])

  const resetHeroMotion = () => {
    setOrbPosition(defaultOrbPosition)
    setCoralAccentPosition(defaultCoralAccentPosition)
    setBlueAccentPosition(defaultBlueAccentPosition)
  }

  const randomizeHeroMotion = () => {
    const reduceMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches

    if (reduceMotion) {
      resetHeroMotion()
      return
    }

    const nextOrbLeft = Math.min(58, Math.max(-130, -82 + Math.round((Math.random() - 0.5) * 110)))
    const nextOrbTop = Math.min(182, Math.max(50, 98 + Math.round((Math.random() - 0.5) * 82)))
    const nextOrbScale = 0.96 + Math.random() * 0.28

    setOrbPosition({ left: nextOrbLeft, top: nextOrbTop, scale: nextOrbScale })
    setCoralAccentPosition({
      x: Math.round((Math.random() - 0.5) * 18),
      y: Math.round((Math.random() - 0.5) * 16),
      rotate: 7 + (Math.random() - 0.5) * 12,
      scale: 0.98 + Math.random() * 0.1,
    })
    setBlueAccentPosition({
      x: Math.round((Math.random() - 0.5) * 20),
      y: Math.round((Math.random() - 0.5) * 20),
      rotate: -9 + (Math.random() - 0.5) * 16,
      scale: 0.96 + Math.random() * 0.12,
    })
  }


  return (
      <div className={`offcut-homepage-shell ${isBooting ? "is-loading" : ""} ${isPageVisible ? "is-visible" : ""} ${shouldRunHomepageIntro ? "" : "is-returning"} min-h-screen bg-[#f7f6f1] text-[#11110f] antialiased`}>
      <div className="mx-auto max-w-[1440px]">
        <header className="relative px-[42px] pt-[26px]">
          <div className="mx-auto mb-[18px] flex max-w-[1240px] items-center justify-between">
            <p className="site-wordmark text-[#11110f]">offcut studio</p>

            <nav className="flex items-center gap-[28px] text-[14px] text-black">
              <Link href="#work" className="transition-opacity hover:opacity-70">Work</Link>
              <TransitionLink href="/about" className="transition-opacity hover:opacity-70">About</TransitionLink>
              <Link href="#contact" className="transition-opacity hover:opacity-70">Say hello ↗</Link>
            </nav>
          </div>
        </header>
        <PageTransitionFrame>
        <main>
          <section className="homepage-hero relative overflow-hidden px-[42px] pb-[28px]" onMouseEnter={randomizeHeroMotion} onMouseLeave={resetHeroMotion}>
            <div className="mx-auto max-w-[1240px]">
              <div className="relative">
                <div
                  className="homepage-hero-orb absolute h-[205px] w-[205px] rounded-full bg-[#f3802a] transition-all duration-700 ease-out"
                  style={{ left: `${orbPosition.left}px`, top: `${orbPosition.top}px`, transform: `scale(${orbPosition.scale})` }}
                />
                <div
                  className="homepage-hero-coral absolute right-[-30px] top-[44px] h-[350px] w-[132px] rounded-[32px] bg-[#fa956f] transition-all duration-700 ease-out"
                  style={{
                    transform: `translate(${coralAccentPosition.x}px, ${coralAccentPosition.y}px) rotate(${coralAccentPosition.rotate}deg) scale(${coralAccentPosition.scale})`,
                  }}
                />
                <div
                  className="homepage-hero-blue absolute bottom-[44px] left-[66px] h-[72px] w-[60px] rounded-[4px] bg-[#1b40a8] transition-all duration-700 ease-out"
                  style={{
                    transform: `translate(${blueAccentPosition.x}px, ${blueAccentPosition.y}px) rotate(${blueAccentPosition.rotate}deg) scale(${blueAccentPosition.scale})`,
                  }}
                />

                <div className="homepage-hero-copy relative mx-auto max-w-[980px] pb-[24px] pt-[30px] text-center">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-[#185047]">Offcut Collective</p>

                  <h1 className="mx-auto mt-[22px] max-w-[860px] text-[72px] font-extrabold leading-[0.94] tracking-[-0.07em] text-[#11110f]">
                    We look for hidden
                    <br />
                    gems within the chaos.
                  </h1>

                  <p className="mx-auto mt-[18px] max-w-[620px] text-[18px] leading-[1.45] text-[#5d625c]">
                    We all face complexity on a daily basis. Sometimes the solutions to this overload is hidden just within
                    those systems and workflows. Decluttering these processes often teaches us valuable insights – and
                    sometimes provides building blocks for new solutions.
                  </p>

                  <p className="mt-[14px] text-[12px] uppercase tracking-[0.08em] text-[#5d625c]">What ↓</p>

                </div>
              </div>
            </div>
          </section>

          <section className="relative overflow-hidden bg-[#e8f4f1] px-[42px] pb-[42px] pt-[30px]" id="work">
            <div className="mx-auto max-w-[1180px]">
              <div className="mx-auto flex max-w-[1180px] justify-center">
                <div className="grid w-full max-w-[1180px] grid-cols-1 gap-[14px] sm:grid-cols-2 xl:grid-cols-5 xl:[grid-template-columns:repeat(5,minmax(0,1fr))]">
                  {categoryCards.map((card, index) => {
                    const cardClassName = `offcut-category-card group flex h-[258px] min-h-[258px] w-full max-w-[212px] flex-col justify-between rounded-[32px] bg-white p-[20px] shadow-[0px_16px_32px_0px_rgba(16,32,26,0.13)] transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0px_18px_32px_0px_rgba(16,32,26,0.16)] sm:max-w-none xl:max-w-none ${card.title === "Objecten" ? "hover:scale-[1.02]" : ""}`
                    const cardStyle: CSSProperties = {
                      animationDelay: `${index * 110}ms`,
                      animationPlayState: isPageVisible ? "running" : "paused",
                    }
                    const cardContent = (
                      <>
                        <div className="flex w-full min-w-0 flex-col gap-[8px]">
                          <p className={`text-[12px] font-normal ${card.color}`}>{card.number}</p>
                          <div className={`relative overflow-visible transition-all duration-300 ease-out ${card.title === "Objecten" ? "group-hover:scale-[1.08]" : "group-hover:scale-[1.06]"} ${card.artworkClassName}`} aria-hidden="true">
                            <CategoryArtwork variant={card.artwork} className="block h-full w-full transition-transform duration-300 ease-out group-hover:scale-[1.03]" />
                            <CategoryDrawing variant={card.marker} />
                          </div>
                        </div>

                        <div className="w-full min-w-0">
                          <p className="text-[20px] font-bold leading-[1.05] text-[#11110f]">{card.title}</p>
                          <p className="mt-[6px] text-[13px] leading-[1.35] text-[#5d625c]">{card.description}</p>
                        </div>
                      </>
                    )

                    if ("href" in card) {
                      return (
                        <TransitionLink key={card.title} href={card.href} className={cardClassName} style={cardStyle}>
                          {cardContent}
                        </TransitionLink>
                      )
                    }

                    return (
                      <article key={card.title} className={cardClassName} style={cardStyle}>
                        {cardContent}
                      </article>
                    )
                  })}
                </div>
              </div>
            </div>
          </section>

          <section className="relative bg-[#f4e879] px-[42px] py-[38px]" id="studio">
            <div className="relative mx-auto flex max-w-[1240px] flex-col gap-[18px] text-[#11110f]">
              <div className="relative pb-[14px]">
                <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-[#1b40a8]">Inspiration</p>
                <h2 className="mt-[18px] max-w-[610px] text-[32px] font-bold leading-[1.12] tracking-[-0.04em] text-[#11110f]">
                  {renderOptionallyUnderlinedTitle(inspirationTitle, promotedInspiration?.underlineText)}
                </h2>
              </div>

              <div className="mt-[12px] flex items-end justify-between gap-[18px] text-[#11110f]" id="contact">
                <div>
                  <p className="text-[12px] uppercase tracking-[0.12em]">{inspirationDate}</p>
                  <TransitionLink href="/studio" className="inspiration-explore-link mt-[4px] inline-flex items-center gap-[4px] text-[28px] leading-none">
                    Explore ↗
                  </TransitionLink>
                </div>

              </div>
            </div>
          </section>

          {content?.length ? (
            <section className="relative px-[42px] py-[38px]">
              <div className="mx-auto max-w-[1240px]">
                <ContentBlocks blocks={content} />
              </div>
            </section>
          ) : null}
        </main>
        <SiteFooter />
        </PageTransitionFrame>
      </div>
      </div>
  )
}

'use client'

// Uniform, rect-free page transition used across the entire site.
//
// Why this exists: the previous approach measured the clicked element's
// on-screen rect on the origin page, stored it in sessionStorage, then had
// the destination page re-measure its own layout and FLIP-animate between
// the two. That requires the two independent React trees (and the hard
// navigation/hydration boundary between them) to agree on exact pixel
// positions, which turned out to be too fragile to keep stable.
//
// This replacement never looks at layout at all: the page itself barely
// moves. Content lifts a small amount with a slight tilt and fades out,
// the route change happens once it's invisible, then the new page drops
// back in from a small offset with the opposite tilt and fades in. There is
// no full-viewport slide, warp, or curtain — most of the page reads as
// staying put, it's just a small, quick settle. Any layout shift or scroll
// jump on the destination page happens while it's invisible, so it's never
// seen — this works identically for every route without per-page wiring.
//
// Only the PageTransitionFrame-wrapped content animates. Each page keeps
// its header/nav outside that wrapper so the wordmark and menu never move,
// fade, or flicker during a transition — they read as fixed chrome.
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react"
import { usePathname, useRouter } from "next/navigation"

// Keep in sync with the transition durations set in globals.css on
// .page-transition-content-covering (exit) and
// .page-transition-content-revealing (entrance/spring settle).
const exitDuration = 200
const enterDuration = 460

type TransitionPhase = "hidden" | "covering" | "covered" | "revealing"

type PageTransitionContextValue = {
  navigate: (href: string) => void
  phase: TransitionPhase
}

const PageTransitionContext = createContext<PageTransitionContextValue | null>(null)

export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [phase, setPhase] = useState<TransitionPhase>("hidden")
  const pendingHrefRef = useRef<string | null>(null)
  const previousPathnameRef = useRef(pathname)

  const navigate = useCallback(
    (href: string) => {
      if (href === pathname) {
        return
      }

      pendingHrefRef.current = href
      setPhase("covering")
    },
    [pathname],
  )

  // Once the current content has fully lifted away and faded out, trigger
  // the actual route change. The destination page mounts while still
  // invisible, so nothing it does (including scroll position resets) is
  // ever visible mid-transition.
  useEffect(() => {
    if (phase !== "covering") {
      return
    }

    const coverTimer = window.setTimeout(() => {
      setPhase("covered")

      if (pendingHrefRef.current) {
        router.push(pendingHrefRef.current)
      }
    }, exitDuration)

    return () => window.clearTimeout(coverTimer)
  }, [phase, router])

  // Reveal as soon as the pathname actually changes to the destination,
  // regardless of how long navigation/hydration took. If nothing is
  // covering the screen (e.g. back/forward navigation without going through
  // `navigate`), this is a no-op.
  useEffect(() => {
    if (previousPathnameRef.current === pathname) {
      return
    }

    previousPathnameRef.current = pathname
    pendingHrefRef.current = null

    setPhase((currentPhase) => (currentPhase === "hidden" ? "hidden" : "revealing"))
  }, [pathname])

  useEffect(() => {
    if (phase !== "revealing") {
      return
    }

    const revealTimer = window.setTimeout(() => {
      setPhase("hidden")
    }, enterDuration)

    return () => window.clearTimeout(revealTimer)
  }, [phase])

  return (
    <PageTransitionContext.Provider value={{ navigate, phase }}>
      {children}
    </PageTransitionContext.Provider>
  )
}

export function usePageTransition() {
  const context = useContext(PageTransitionContext)

  if (!context) {
    throw new Error("usePageTransition must be used within a PageTransitionProvider")
  }

  return context
}

// Wrap only the part of a page that should animate (i.e. everything except
// a persistent header/nav) in this. Because the header lives outside this
// wrapper, it never moves, fades, or re-renders during a transition — it
// reads as fixed chrome around the animated content beneath it.
export function PageTransitionFrame({ children }: { children: ReactNode }) {
  const { phase } = usePageTransition()

  return (
    <div className={`page-transition-content page-transition-content-${phase}`}>
      {children}
    </div>
  )
}

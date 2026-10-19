'use client'

import Link from "next/link"
import TransitionLink from "../transition-link"
import SiteFooter from "../site-footer"
import { PageTransitionFrame } from "../page-transition"
import { DEFAULT_CONTACT_EMAIL } from "../contact"
import { CircledRegion, renderUnderlinedTitle, toCircleRegion } from "../drawn-annotations"
import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react"

type CircleRegionInput = { top?: number; left?: number; width?: number; height?: number } | null

type TopicContent =
  | { _key: string; _type: "topicText"; text?: string }
  | { _key: string; _type: "topicImage"; imageUrl?: string; alt?: string; caption?: string; circleRegion?: CircleRegionInput }
  | { _key: string; _type: "topicNote"; kind?: "sticky" | "method" | "field"; text?: string }

type ServiceTopic = {
  id: string
  title: string
  underlineText?: string
  description?: string
  content?: TopicContent[]
}

// Groups of consecutive image/note items are collaged together into a single
// draggable "pile", while text items render as normal paragraphs in the flow.
// Keeping the pile in document flow (rather than absolutely positioned over
// the whole content area) guarantees it never overlaps body text on load,
// while pointer-drag still lets users move individual notes/images anywhere
// within the content column afterwards.
type FlowGroup =
  | { kind: "text"; key: string; text: string }
  | { kind: "pile"; key: string; items: Array<Extract<TopicContent, { _type: "topicImage" | "topicNote" }>> }

function groupTopicContent(content: TopicContent[]): FlowGroup[] {
  const groups: FlowGroup[] = []

  for (const item of content) {
    if (item._type === "topicText") {
      if (item.text) {
        groups.push({ kind: "text", key: item._key, text: item.text })
      }
      continue
    }

    const lastGroup = groups[groups.length - 1]

    if (lastGroup?.kind === "pile") {
      lastGroup.items.push(item)
    } else {
      groups.push({ kind: "pile", key: `pile-${item._key}`, items: [item] })
    }
  }

  return groups
}

type DraggableId = string
type DraggablePositions = Record<DraggableId, { x: number; y: number }>
type DragState = {
  id: DraggableId
  pointerId: number
  startX: number
  startY: number
  originX: number
  originY: number
}
type DragStyle = CSSProperties & {
  "--drag-x": string
  "--drag-y": string
}
type ServicePaperStyle = CSSProperties & {
  "--page-paper-rotation": string
}

export type ServicePageConfig = {
  slug: string
  title: string
  intro: string
  rotation: string
  contactEmail?: string
  topics?: ServiceTopic[]
}

const defaultServicePageConfig: ServicePageConfig = {
  slug: "onderzoek",
  title: "Onderzoek",
  intro: "",
  rotation: "1.25deg",
}

export default function ResearchClient({ config = defaultServicePageConfig }: { config?: ServicePageConfig }) {
  const dragAreaRef = useRef<HTMLDivElement>(null)
  const draggableRefs = useRef<Partial<Record<DraggableId, HTMLDivElement>>>({})
  const dragState = useRef<DragState | null>(null)
  const [draggablePositions, setDraggablePositions] = useState<DraggablePositions>({})
  const [activeDraggableId, setActiveDraggableId] = useState<DraggableId | null>(null)
  const topics = config.topics ?? []
  const contactEmail = config.contactEmail ?? DEFAULT_CONTACT_EMAIL
  const [activeTopicId, setActiveTopicId] = useState(topics[0]?.id)
  const activeTopic = topics.find((topic) => topic.id === activeTopicId) ?? topics[0]
  const flowGroups = activeTopic?.content?.length ? groupTopicContent(activeTopic.content) : []

  const getDragStyle = (id: DraggableId): DragStyle => {
    const position = draggablePositions[id] ?? { x: 0, y: 0 }

    return {
      "--drag-x": `${position.x}px`,
      "--drag-y": `${position.y}px`,
    }
  }

  const moveDraggableItem = (id: DraggableId, nextPosition: { x: number; y: number }) => {
    setDraggablePositions((currentPositions) => {
      const currentPosition = currentPositions[id] ?? { x: 0, y: 0 }
      const dragArea = dragAreaRef.current
      const draggableItem = draggableRefs.current[id]

      if (!dragArea || !draggableItem) {
        return {
          ...currentPositions,
          [id]: nextPosition,
        }
      }

      const dragAreaRect = dragArea.getBoundingClientRect()
      const itemRect = draggableItem.getBoundingClientRect()
      const deltaX = nextPosition.x - currentPosition.x
      const deltaY = nextPosition.y - currentPosition.y
      let clampedX = nextPosition.x
      let clampedY = nextPosition.y

      const nextLeft = itemRect.left + deltaX
      const nextRight = itemRect.right + deltaX
      const nextTop = itemRect.top + deltaY
      const nextBottom = itemRect.bottom + deltaY

      if (nextLeft < dragAreaRect.left) {
        clampedX += dragAreaRect.left - nextLeft
      }

      if (nextRight > dragAreaRect.right) {
        clampedX -= nextRight - dragAreaRect.right
      }

      if (nextTop < dragAreaRect.top) {
        clampedY += dragAreaRect.top - nextTop
      }

      if (nextBottom > dragAreaRect.bottom) {
        clampedY -= nextBottom - dragAreaRect.bottom
      }

      return {
        ...currentPositions,
        [id]: { x: Math.round(clampedX), y: Math.round(clampedY) },
      }
    })
  }

  const handlePointerDown = (id: DraggableId, event: PointerEvent<HTMLDivElement>) => {
    event.preventDefault()
    const currentPosition = draggablePositions[id] ?? { x: 0, y: 0 }
    dragState.current = {
      id,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: currentPosition.x,
      originY: currentPosition.y,
    }
    setActiveDraggableId(id)
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handlePointerMove = (id: DraggableId, event: PointerEvent<HTMLDivElement>) => {
    const currentDrag = dragState.current

    if (!currentDrag || currentDrag.id !== id || currentDrag.pointerId !== event.pointerId) {
      return
    }

    moveDraggableItem(id, {
      x: currentDrag.originX + event.clientX - currentDrag.startX,
      y: currentDrag.originY + event.clientY - currentDrag.startY,
    })
  }

  const stopDragging = (id: DraggableId, event: PointerEvent<HTMLDivElement>) => {
    const currentDrag = dragState.current

    if (currentDrag?.id === id && currentDrag.pointerId === event.pointerId) {
      dragState.current = null
      setActiveDraggableId(null)
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId)
      }
    }
  }

  const handleKeyDown = (id: DraggableId, event: KeyboardEvent<HTMLDivElement>) => {
    const step = event.shiftKey ? 36 : 12
    const moves: Partial<Record<string, { x: number; y: number }>> = {
      ArrowLeft: { x: -step, y: 0 },
      ArrowRight: { x: step, y: 0 },
      ArrowUp: { x: 0, y: -step },
      ArrowDown: { x: 0, y: step },
    }
    const move = moves[event.key]

    if (!move) {
      return
    }

    event.preventDefault()
    const currentPosition = draggablePositions[id] ?? { x: 0, y: 0 }
    moveDraggableItem(id, {
      x: currentPosition.x + move.x,
      y: currentPosition.y + move.y,
    })
  }

  const draggableProps = (id: DraggableId, label: string) => ({
    ref: (element: HTMLDivElement | null) => {
      if (element) {
        draggableRefs.current[id] = element
      } else {
        delete draggableRefs.current[id]
      }
    },
    style: getDragStyle(id),
    role: "button",
    tabIndex: 0,
    "aria-label": label,
    onPointerDown: (event: PointerEvent<HTMLDivElement>) => handlePointerDown(id, event),
    onPointerMove: (event: PointerEvent<HTMLDivElement>) => handlePointerMove(id, event),
    onPointerUp: (event: PointerEvent<HTMLDivElement>) => stopDragging(id, event),
    onPointerCancel: (event: PointerEvent<HTMLDivElement>) => stopDragging(id, event),
    onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => handleKeyDown(id, event),
  })

  const selectTopic = (id: string) => {
    setActiveTopicId(id)
    setDraggablePositions({})
    setActiveDraggableId(null)
  }

  return (
    <div className={`service-page service-page-${config.slug}`}>
      <header className="studio-header service-header">
        <TransitionLink href="/" className="studio-brand site-wordmark">
          offcut studio
        </TransitionLink>

        <nav className="studio-nav" aria-label="Main navigation">
          <Link href="/#work">Work</Link>
          <TransitionLink href="/about">About</TransitionLink>
          <a href={`mailto:${contactEmail}`}>Say hello ↗</a>
        </nav>
      </header>

      <PageTransitionFrame>
      <main className="service-shell">
        <div className="service-site-shapes" aria-hidden="true">
          <div className="homepage-hero-orb service-site-orb" />
          <div className="homepage-hero-coral service-site-coral" />
          <div className="homepage-hero-blue service-site-blue" />
        </div>

        <div className="service-paper-wrap">
          <section
            className={`service-paper service-paper-${config.slug}`}
            style={{ "--page-paper-rotation": config.rotation } as ServicePaperStyle}
            aria-labelledby="research-title"
          >
            <div className="service-hero-copy">
              <div>
                <p className="studio-kicker">Services</p>
                <h1 id="research-title">{config.title}</h1>
              </div>

              {config.intro && <p className="service-intro">{config.intro}</p>}

              <TransitionLink href="/" className="studio-back-link service-back-link">
                Back <span>↗</span>
              </TransitionLink>
            </div>

            {topics.length > 0 && (
              <div className="service-topic-row">
                <div className="service-topic-grid" aria-label="Service topics">
                  {topics.map((topic) => (
                    <article key={topic.id} className={activeTopicId === topic.id ? "service-topic is-active" : "service-topic"}>
                      <h2>
                        <button type="button" onClick={() => selectTopic(topic.id)} aria-pressed={activeTopicId === topic.id}>
                          {activeTopicId === topic.id
                            ? renderUnderlinedTitle(topic.title, topic.underlineText, "service-tab-underline")
                            : topic.title}
                        </button>
                      </h2>
                      {topic.description && <p>{topic.description}</p>}
                    </article>
                  ))}
                </div>

                <div ref={dragAreaRef} className="service-draggable-area">
                  <div key={activeTopicId} className="service-cms-content" aria-label={`${activeTopic?.title ?? ""} content`}>
                    {flowGroups.map((group) => {
                      if (group.kind === "text") {
                        return (
                          <p key={group.key} className="service-cms-text">
                            {group.text}
                          </p>
                        )
                      }

                      return (
                        <div key={group.key} className="service-content-pile">
                          {group.items.map((item) => {
                            if (item._type === "topicImage" && item.imageUrl) {
                              const region = toCircleRegion(item.circleRegion)

                              return (
                                <div
                                  key={item._key}
                                  {...draggableProps(item._key, `Move ${item.caption ?? "image"}`)}
                                  className={`service-pile-image studio-draggable ${activeDraggableId === item._key ? "is-dragging" : ""}`}
                                >
                                  <figure className="service-cms-image">
                                    <img src={item.imageUrl} alt={item.alt ?? ""} draggable={false} />
                                    {region && <CircledRegion region={region} />}
                                  </figure>
                                </div>
                              )
                            }

                            if (item._type === "topicNote" && item.text) {
                              const label = item.kind === "method" ? "Method note" : item.kind === "field" ? "Field note" : "Question"

                              return (
                                <div
                                  key={item._key}
                                  {...draggableProps(item._key, `Move ${label.toLowerCase()}`)}
                                  className={`service-pile-note studio-draggable ${activeDraggableId === item._key ? "is-dragging" : ""}`}
                                >
                                  <aside className={`service-cms-note service-cms-note-${item.kind ?? "sticky"}`}>
                                    <span>{label}</span>
                                    <p>{item.text}</p>
                                  </aside>
                                </div>
                              )
                            }

                            return null
                          })}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}
          </section>

          <div className="service-cta-row">
            <a href={`mailto:${contactEmail}`} className="service-cta-button">
              <span className="service-cta-kicker">Interested in our approach?</span>
              <span className="service-cta-label">Let&rsquo;s talk <span aria-hidden="true">↗</span></span>
            </a>
          </div>
        </div>
      </main>
      <SiteFooter contactEmail={contactEmail} />
      </PageTransitionFrame>
    </div>
  )
}

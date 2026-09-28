'use client'

import Link from "next/link"
import TransitionLink from "../transition-link"
import {
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
} from "react"
import { CircledRegion, Underlined } from "../drawn-annotations"
import { PageTransitionFrame } from "../page-transition"

type InspirationPaperStyle = CSSProperties

const inspirationImages = [
  {
    className: "studio-image-train",
    src: "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=900&q=85",
    alt: "A yellow train crossing an elevated rail bridge",
  },
  {
    className: "studio-image-building",
    src: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1100&q=85",
    alt: "A modern concrete building with curved architectural details",
  },
  {
    className: "studio-image-portrait",
    src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=700&q=85",
    alt: "A close-up black-and-white portrait",
    // Configures the hand-drawn circle annotation: percentage-based box relative
    // to the image, so any image can highlight a chosen region simply by
    // passing its own `circle` values (or omitting it for no annotation).
    circle: { top: "8%", left: "10%", width: "80%", height: "78%" },
  },
  {
    className: "studio-image-facade",
    src: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=700&q=85",
    alt: "A repeating modern building facade",
  },
  {
    className: "studio-image-rooftop",
    src: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=900&q=85",
    alt: "Apartments viewed from street level",
  },
] as const

const draggableItems = [
  { id: "train", label: "Move train image" },
  { id: "building", label: "Move building image" },
  { id: "portrait", label: "Move portrait image" },
  { id: "facade", label: "Move facade image" },
  { id: "rooftop", label: "Move rooftop image" },
  { id: "quote", label: "Move question note" },
  { id: "observation", label: "Move observation note" },
  { id: "field", label: "Move field note" },
] as const

type DraggableId = (typeof draggableItems)[number]["id"]
type DragPosition = { x: number; y: number }
type DragPositions = Record<DraggableId, DragPosition>
type DragState = DragPosition & {
  id: DraggableId
  pointerId: number
  startX: number
  startY: number
}
type DragStyle = CSSProperties & {
  "--drag-x": string
  "--drag-y": string
}

const initialDragPositions = draggableItems.reduce((positions, item) => {
  positions[item.id] = { x: 0, y: 0 }
  return positions
}, {} as DragPositions)

export default function StudioClient() {
  const dragAreaRef = useRef<HTMLDivElement>(null)
  const draggableRefs = useRef<Partial<Record<DraggableId, HTMLElement>>>({})
  const dragState = useRef<DragState | null>(null)
  const [dragPositions, setDragPositions] = useState<DragPositions>(initialDragPositions)
  const [activeDraggableId, setActiveDraggableId] = useState<DraggableId | null>(null)

  const getDragStyle = (id: DraggableId): DragStyle => {
    const position = dragPositions[id]
    return { "--drag-x": `${position.x}px`, "--drag-y": `${position.y}px` }
  }

  const moveDraggableItem = (id: DraggableId, nextPosition: DragPosition) => {
    setDragPositions((currentPositions) => {
      const currentPosition = currentPositions[id]
      const dragArea = dragAreaRef.current
      const draggableItem = draggableRefs.current[id]

      if (!dragArea || !draggableItem) {
        return { ...currentPositions, [id]: nextPosition }
      }

      const dragAreaRect = dragArea.getBoundingClientRect()
      const itemRect = draggableItem.getBoundingClientRect()
      const deltaX = nextPosition.x - currentPosition.x
      const deltaY = nextPosition.y - currentPosition.y
      let x = nextPosition.x
      let y = nextPosition.y

      if (itemRect.left + deltaX < dragAreaRect.left) x += dragAreaRect.left - itemRect.left - deltaX
      if (itemRect.right + deltaX > dragAreaRect.right) x -= itemRect.right + deltaX - dragAreaRect.right
      if (itemRect.top + deltaY < dragAreaRect.top) y += dragAreaRect.top - itemRect.top - deltaY
      if (itemRect.bottom + deltaY > dragAreaRect.bottom) y -= itemRect.bottom + deltaY - dragAreaRect.bottom

      return { ...currentPositions, [id]: { x: Math.round(x), y: Math.round(y) } }
    })
  }

  const handlePointerDown = (id: DraggableId, event: PointerEvent<HTMLElement>) => {
    event.preventDefault()
    const currentPosition = dragPositions[id]
    dragState.current = { id, pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, ...currentPosition }
    setActiveDraggableId(id)
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handlePointerMove = (id: DraggableId, event: PointerEvent<HTMLElement>) => {
    const currentDrag = dragState.current
    if (!currentDrag || currentDrag.id !== id || currentDrag.pointerId !== event.pointerId) return

    moveDraggableItem(id, {
      x: currentDrag.x + event.clientX - currentDrag.startX,
      y: currentDrag.y + event.clientY - currentDrag.startY,
    })
  }

  const stopDragging = (id: DraggableId, event: PointerEvent<HTMLElement>) => {
    const currentDrag = dragState.current
    if (!currentDrag || currentDrag.id !== id || currentDrag.pointerId !== event.pointerId) return

    dragState.current = null
    setActiveDraggableId(null)
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
  }

  const handleKeyDown = (id: DraggableId, event: KeyboardEvent<HTMLElement>) => {
    const step = event.shiftKey ? 36 : 12
    const moves: Partial<Record<string, DragPosition>> = {
      ArrowLeft: { x: -step, y: 0 },
      ArrowRight: { x: step, y: 0 },
      ArrowUp: { x: 0, y: -step },
      ArrowDown: { x: 0, y: step },
    }
    const move = moves[event.key]
    if (!move) return

    event.preventDefault()
    const currentPosition = dragPositions[id]
    moveDraggableItem(id, { x: currentPosition.x + move.x, y: currentPosition.y + move.y })
  }

  const draggableProps = (id: DraggableId, label: string) => ({
    ref: (element: HTMLElement | null) => {
      if (element) draggableRefs.current[id] = element
      else delete draggableRefs.current[id]
    },
    style: getDragStyle(id),
    role: "button",
    tabIndex: 0,
    "aria-label": label,
    onPointerDown: (event: PointerEvent<HTMLElement>) => handlePointerDown(id, event),
    onPointerMove: (event: PointerEvent<HTMLElement>) => handlePointerMove(id, event),
    onPointerUp: (event: PointerEvent<HTMLElement>) => stopDragging(id, event),
    onPointerCancel: (event: PointerEvent<HTMLElement>) => stopDragging(id, event),
    onKeyDown: (event: KeyboardEvent<HTMLElement>) => handleKeyDown(id, event),
  })

  return (
    <div className="studio-page">
      <header className="studio-header">
        <TransitionLink href="/" className="studio-brand" aria-label="Offcut Co. home">
          offcut Co.
        </TransitionLink>
        <nav className="studio-nav" aria-label="Main navigation">
          <Link href="/#work">Work</Link>
          <Link href="/studio" aria-current="page">Studio</Link>
          <Link href="/#contact">Say hello ↗</Link>
        </nav>
      </header>

      <PageTransitionFrame>
      <main>
      <section className="studio-shell" aria-labelledby="studio-title">
        <div className="studio-side-shape studio-side-shape-orange" aria-hidden="true" />
        <div className="studio-side-shape studio-side-shape-coral" aria-hidden="true" />

        <article className="studio-paper">
          <TransitionLink href="/" className="studio-back-link">
            Back ↗
          </TransitionLink>
          <div className="studio-heading">
            <p className="studio-kicker">Inspiration</p>
            <h1 id="studio-title">
              Why so <br />
              serious?
              <span>Inspiration from</span>
              <span>urban design</span>
              <Underlined>interventions.</Underlined>
            </h1>
          </div>

          <p className="studio-abstract">
            A loose page of colour, useful accidents and everyday interventions gathered between Rotterdam and Marseille.
            A loose page of colour, useful accidents and everyday interventions gathered between Rotterdam and Marseille.
            A loose page of colour, useful accidents and everyday interventions gathered between Rotterdam and Marseille.
            A loose page of colour, useful accidents and everyday interventions gathered between Rotterdam and Marseille.
          </p>

          <div ref={dragAreaRef} className="studio-collage" aria-label="Urban design inspiration collage">
            <div
              className="studio-collage-marker"
              aria-hidden="true"
            />
            {inspirationImages.map((image) => {
              const id = image.className.replace("studio-image-", "") as DraggableId
              const item = draggableItems.find((draggableItem) => draggableItem.id === id)

              return (
              <figure
                key={image.className}
                className={`studio-image ${image.className} studio-draggable ${activeDraggableId === id ? "is-dragging" : ""}`}
                {...draggableProps(id, item?.label ?? "Move inspiration image")}
              >
                <img src={image.src} alt={image.alt} />
                {"circle" in image && image.circle ? <CircledRegion region={image.circle} /> : null}
              </figure>
              )
            })}

            <aside
              className={`studio-caption-card studio-draggable ${activeDraggableId === "field" ? "is-dragging" : ""}`}
              {...draggableProps("field", "Move field note")}
            >
              <p>Fri 11:42 / Vieux-Port</p>
              <span>Fumicire that turns waiting into a small public ritual.</span>
            </aside>

            <aside
              className={`studio-quote-card studio-draggable ${activeDraggableId === "quote" ? "is-dragging" : ""}`}
              {...draggableProps("quote", "Move question note")}
            >
              <p>Question to keep</p>
              <span>Can a detour become the destination?</span>
            </aside>

            <aside
              className={`studio-observation-card studio-draggable ${activeDraggableId === "observation" ? "is-dragging" : ""}`}
              {...draggableProps("observation", "Move observation note")}
            >
              <p>Observation</p>
              <span>Can a detour become the destination? Can a detour become the destination?</span>
            </aside>
          </div>
        </article>
      </section>
      </main>
      </PageTransitionFrame>
    </div>
  )
}

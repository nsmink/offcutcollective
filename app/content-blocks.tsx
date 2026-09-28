// Shared content-block renderer used by every page type (Homepage, About,
// generic Pages, and — via their own bespoke pile/drag layout — Service
// pages). Editors add the same set of block kinds (text, image, note) from
// Sanity on every page; this component renders that shared shape the same
// way everywhere so pages stay visually and structurally consistent.
import { CircledRegion, toCircleRegion } from "./drawn-annotations"

type CircleRegionInput = { top?: number; left?: number; width?: number; height?: number } | null

export type ContentBlock =
  | { _key: string; _type: "contentText"; text?: string }
  | {
      _key: string
      _type: "contentImage"
      imageUrl?: string
      alt?: string
      caption?: string
      circleRegion?: CircleRegionInput
    }
  | { _key: string; _type: "contentNote"; kind?: "sticky" | "method" | "field"; text?: string }

const noteLabel: Record<NonNullable<Extract<ContentBlock, { _type: "contentNote" }>["kind"]>, string> = {
  sticky: "Note",
  method: "Method note",
  field: "Field note",
}

export function ContentBlocks({ blocks }: { blocks?: ContentBlock[] }) {
  if (!blocks?.length) {
    return null
  }

  return (
    <div className="page-content-blocks">
      {blocks.map((block) => {
        if (block._type === "contentText" && block.text) {
          return (
            <p key={block._key} className="page-content-text">
              {block.text}
            </p>
          )
        }

        if (block._type === "contentImage" && block.imageUrl) {
          const region = toCircleRegion(block.circleRegion)

          return (
            <figure key={block._key} className="page-content-image">
              <img src={block.imageUrl} alt={block.alt ?? ""} />
              {region && <CircledRegion region={region} />}
              {block.caption && <figcaption>{block.caption}</figcaption>}
            </figure>
          )
        }

        if (block._type === "contentNote" && block.text) {
          return (
            <aside key={block._key} className={`page-content-note page-content-note-${block.kind ?? "sticky"}`}>
              <span>{noteLabel[block.kind ?? "sticky"]}</span>
              <p>{block.text}</p>
            </aside>
          )
        }

        return null
      })}
    </div>
  )
}

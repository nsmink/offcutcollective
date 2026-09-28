const CONTENT_BLOCKS_PROJECTION = `content[]{
  _key,
  _type,
  text,
  kind,
  alt,
  caption,
  circleRegion,
  "imageUrl": image.asset->url
}`

export const HOME_PAGE_QUERY = `*[_id == "homePage"][0]{
  heroLabel,
  heroStatement,
  heroDescription,
  inspirationTitle,
  inspirationDescription,
  ${CONTENT_BLOCKS_PROJECTION}
}`

export const ABOUT_PAGE_QUERY = `*[_id == "aboutPage"][0]{
  kicker,
  title,
  underlineText,
  paragraphs,
  contactLabel,
  ${CONTENT_BLOCKS_PROJECTION}
}`

export const SITE_SETTINGS_QUERY = `*[_id == "siteSettings"][0]{
  siteTitle,
  footerDescription,
  contactEmail
}`

export const PROMOTED_INSPIRATION_QUERY = `*[_type == "inspirationItem" && promoteOnHomepage == true] | order(_updatedAt desc)[0]{
  title,
  underlineText,
  dateLabel,
  description
}`

export const SERVICE_PAGE_BY_SLUG_QUERY = `*[_type == "servicePage" && slug.current == $slug][0]{
  title,
  intro,
  topics[]{
    _key,
    title,
    underlineText,
    description,
    content[]{
      _key,
      _type,
      text,
      kind,
      alt,
      caption,
      circleRegion,
      "imageUrl": image.asset->url
    }
  }
}`

export const PAGE_BY_SLUG_QUERY = `*[_type == "page" && slug.current == $slug][0]{
  title,
  kicker,
  underlineText,
  intro,
  contactLabel,
  ${CONTENT_BLOCKS_PROJECTION}
}`

export const PAGE_SLUGS_QUERY = `*[_type == "page" && defined(slug.current)].slug.current`


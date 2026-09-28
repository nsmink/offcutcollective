import {defineQuery} from 'next-sanity'

export const HOME_PAGE_QUERY = defineQuery(`
  *[_id == "homePage"][0]{
    heroLabel,
    heroStatement,
    heroDescription,
    inspirationTitle,
    inspirationDescription
  }
`)

export const SERVICE_PAGES_QUERY = defineQuery(`
  *[_type == "servicePage"] | order(title asc) {
    _id,
    title,
    "slug": slug.current,
    cardDescription
  }
`)

export const SERVICE_PAGE_BY_SLUG_QUERY = defineQuery(`
  *[_type == "servicePage" && slug.current == $slug][0]{
    _id,
    title,
    intro,
    topics[]{
      _key,
      title,
      description,
      question,
      fieldNote,
      metric
    }
  }
`)

export const ABOUT_PAGE_QUERY = defineQuery(`
  *[_id == "aboutPage"][0]{
    kicker,
    title,
    paragraphs,
    contactLabel
  }
`)

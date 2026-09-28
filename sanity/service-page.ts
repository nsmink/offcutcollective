import { client } from "@/sanity/client"
import { SERVICE_PAGE_BY_SLUG_QUERY } from "@/sanity/queries"
import type { ServicePageConfig } from "@/app/onderzoek/onderzoek-client"

type SanityServiceTopic = {
  _key?: string
  title?: string
  underlineText?: string
  description?: string
  content?: ServicePageConfig["topics"] extends Array<infer Topic>
    ? Topic extends { content?: infer Content }
      ? Content
      : never
    : never
}

// Only real Sanity content is ever rendered on the service pages: `topics`
// come exclusively from the CMS (no hardcoded dummy topics/content), while
// `fallback` only supplies placeholder title/intro/rotation copy for the rare
// case a servicePage document hasn't been created yet.
export async function getServicePageConfig(
  fallback: ServicePageConfig,
): Promise<ServicePageConfig> {
  const servicePage = await client.fetch<{
    title?: string
    intro?: string
    topics?: SanityServiceTopic[]
  } | null>(SERVICE_PAGE_BY_SLUG_QUERY, { slug: fallback.slug })

  const topics = servicePage?.topics
    ?.filter((topic): topic is SanityServiceTopic & { _key: string; title: string } =>
      Boolean(topic._key && topic.title),
    )
    .map((topic) => ({
      id: topic._key,
      title: topic.title,
      underlineText: topic.underlineText,
      description: topic.description,
      content: topic.content,
    }))

  return {
    ...fallback,
    title: servicePage?.title ?? fallback.title,
    intro: servicePage?.intro ?? fallback.intro,
    topics: topics ?? [],
  }
}

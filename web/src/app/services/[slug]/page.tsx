import {notFound} from 'next/navigation'
import Link from 'next/link'
import {client} from '@/sanity/client'
import {SERVICE_PAGE_BY_SLUG_QUERY} from '@/sanity/queries'

export const dynamic = 'force-dynamic'

export default async function ServicePage({params}: PageProps<'/services/[slug]'>) {
  const {slug} = await params
  const service = await client.fetch(SERVICE_PAGE_BY_SLUG_QUERY, {slug})

  if (!service) {
    notFound()
  }

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-6 py-20 sm:px-12">
      <Link className="text-sm underline underline-offset-4" href="/">
        Back to Offcut
      </Link>
      <p className="mt-16 text-sm font-medium uppercase tracking-[0.18em] text-zinc-600">Services</p>
      <h1 className="mt-4 text-5xl font-semibold tracking-tight sm:text-7xl">{service.title}</h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-600">{service.intro}</p>

      {service.topics?.length ? (
        <section className="mt-16" aria-labelledby="topics-title">
          <h2 id="topics-title" className="text-2xl font-semibold">
            Topics
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {service.topics.map((topic) => (
              <article className="rounded-2xl border border-zinc-200 p-6" key={topic._key}>
                <h3 className="text-xl font-semibold">{topic.title}</h3>
                {topic.description ? <p className="mt-2 text-zinc-600">{topic.description}</p> : null}
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  )
}

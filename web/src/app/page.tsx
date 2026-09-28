import Link from 'next/link'
import {client} from '@/sanity/client'
import {HOME_PAGE_QUERY, SERVICE_PAGES_QUERY} from '@/sanity/queries'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const [homePage, servicePages] = await Promise.all([
    client.fetch(HOME_PAGE_QUERY),
    client.fetch(SERVICE_PAGES_QUERY),
  ])

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-16 px-6 py-20 sm:px-12">
      <header className="flex items-center justify-between">
        <p className="font-semibold tracking-tight">offcut studio</p>
        <Link className="text-sm underline underline-offset-4" href="/about">
          About
        </Link>
      </header>

      <section className="max-w-3xl">
        <p className="mb-4 text-sm font-medium uppercase tracking-[0.18em] text-zinc-600">
          {homePage?.heroLabel ?? 'Offcut Collective'}
        </p>
        <h1 className="text-5xl font-semibold tracking-tight sm:text-7xl">
          {homePage?.heroStatement ?? 'Content is ready for Offcut.'}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-600">
          {homePage?.heroDescription ?? 'Add the homepage content in Sanity Studio to start managing this site.'}
        </p>
      </section>

      <section aria-labelledby="services-title">
        <h2 id="services-title" className="text-2xl font-semibold">
          Services
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {servicePages.map((service) => (
            <Link
              className="rounded-2xl border border-zinc-200 p-6 transition-colors hover:border-zinc-900"
              href={`/services/${service.slug}`}
              key={service._id}
            >
              <h3 className="text-xl font-semibold">{service.title}</h3>
              <p className="mt-2 text-zinc-600">{service.cardDescription}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}

import Link from 'next/link'
import {client} from '@/sanity/client'
import {ABOUT_PAGE_QUERY} from '@/sanity/queries'

export const dynamic = 'force-dynamic'

export default async function AboutPage() {
  const aboutPage = await client.fetch(ABOUT_PAGE_QUERY)

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-6 py-20 sm:px-12">
      <Link className="text-sm underline underline-offset-4" href="/">
        Back to Offcut
      </Link>
      <p className="mt-16 text-sm font-medium uppercase tracking-[0.18em] text-zinc-600">
        {aboutPage?.kicker ?? 'About Offcut'}
      </p>
      <h1 className="mt-4 max-w-4xl text-5xl font-semibold tracking-tight sm:text-7xl">
        {aboutPage?.title ?? 'We find the useful bits hiding in the mess.'}
      </h1>
      <div className="mt-10 max-w-2xl space-y-6 text-lg leading-8 text-zinc-600">
        {aboutPage?.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      </div>
    </main>
  )
}

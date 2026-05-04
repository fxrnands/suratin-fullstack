import Link from 'next/link'

export interface RelatedPageLink {
  href: string
  label: string
}

interface RelatedPagesProps {
  title?: string
  links: RelatedPageLink[]
}

export function RelatedPages({ title = 'Halaman terkait', links }: RelatedPagesProps) {
  return (
    <section className="mt-12" aria-labelledby="related-heading">
      <h2 id="related-heading" className="text-xl font-bold tracking-tight">
        {title}
      </h2>
      <ul className="mt-4 list-inside list-disc space-y-2 text-sm text-primary sm:text-base">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="underline-offset-4 hover:underline">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

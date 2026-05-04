interface FaqItem {
  q: string
  a: string
}

interface FaqSectionProps {
  title?: string
  items: FaqItem[]
}

export function FaqSection({ title = 'Pertanyaan yang sering ditanya', items }: FaqSectionProps) {
  return (
    <section className="mt-14 border-t border-border/60 pt-12" aria-labelledby="faq-heading">
      <h2 id="faq-heading" className="text-2xl font-bold tracking-tight">
        {title}
      </h2>
      <dl className="mt-8 space-y-8">
        {items.map((item) => (
          <div key={item.q}>
            <dt className="text-base font-semibold text-foreground">{item.q}</dt>
            <dd className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">{item.a}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

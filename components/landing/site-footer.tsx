interface SiteFooterProps {
  brand?: string
}

export function SiteFooter({ brand = 'Suratin' }: SiteFooterProps) {
  return (
    <footer className="border-t border-border/30 px-4 py-8 text-center text-sm text-muted-foreground">
      <p>
        &copy; {new Date().getFullYear()} {brand}.
      </p>
    </footer>
  )
}

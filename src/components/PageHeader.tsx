import Link from "next/link";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showSearch?: boolean;
  backHref?: string;
}

export function PageHeader({ title, subtitle, showSearch = false, backHref }: PageHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-surface-border/60 bg-background/80 backdrop-blur-xl">
      <div className="flex min-h-[3.25rem] items-center justify-between px-4 py-2">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          {backHref && (
            <Link
              href={backHref}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-surface-border/80 text-gold transition hover:border-gold/40 hover:bg-gold/5"
              aria-label="返回"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          )}
          <div className="min-w-0">
            <h1 className="truncate font-display text-[1.35rem] font-semibold leading-tight tracking-wide text-gold">
              {title}
            </h1>
            {subtitle && (
              <p className="truncate text-[10px] uppercase tracking-luxury text-cream/50">{subtitle}</p>
            )}
          </div>
        </div>
        {showSearch && (
          <Link
            href="/search"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-surface-border/80 text-foreground/70 transition hover:border-gold/40 hover:text-gold"
            aria-label="搜尋"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3-3" strokeLinecap="round" />
            </svg>
          </Link>
        )}
      </div>
      <div className="gold-rule-wide opacity-60" />
    </header>
  );
}

import Link from "next/link";

interface PageHeaderProps {
  title: string;
  showSearch?: boolean;
  backHref?: string;
}

export function PageHeader({ title, showSearch = false, backHref }: PageHeaderProps) {
  return (
    <header className="sticky top-0 z-40 flex h-12 items-center justify-between border-b border-surface-border bg-background/95 px-4 backdrop-blur-md">
      <div className="flex min-w-0 flex-1 items-center gap-2">
        {backHref && (
          <Link href={backHref} className="shrink-0 text-gold" aria-label="返回">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        )}
        <h1 className="truncate font-display text-lg font-semibold tracking-wide text-gold">
          {title}
        </h1>
      </div>
      {showSearch && (
        <Link href="/search" className="shrink-0 p-1 text-foreground/70" aria-label="搜尋">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3-3" strokeLinecap="round" />
          </svg>
        </Link>
      )}
    </header>
  );
}

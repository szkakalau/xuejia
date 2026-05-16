"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const nav = [{ href: "/admin/products", label: "商品管理" }];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="min-h-dvh bg-[var(--background)] text-foreground">
      <header className="border-b border-surface-border bg-surface px-4 py-3">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link href="/admin/products" className="font-display text-lg text-gold">
            雪茄商城後台
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/categories" className="text-foreground/60 hover:text-gold">
              查看前台
            </Link>
            <button type="button" onClick={logout} className="text-foreground/60 hover:text-gold">
              登出
            </button>
          </div>
        </div>
      </header>
      <div className="mx-auto flex max-w-5xl gap-6 px-4 py-6">
        <aside className="hidden w-40 shrink-0 md:block">
          <nav className="space-y-1">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-lg px-3 py-2 text-sm ${
                  pathname.startsWith(item.href)
                    ? "bg-gold/15 font-medium text-gold"
                    : "text-foreground/60 hover:bg-surface-elevated"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";

const tabs = [
  { href: "/categories", label: "首頁", icon: HomeIcon },
  { href: "/cart", label: "購物車", icon: CartIcon },
  { href: "/contact", label: "客服", icon: ContactIcon },
];

export function TabBar() {
  const pathname = usePathname();
  const { count } = useCart();

  return (
    <nav className="fixed bottom-0 left-1/2 z-50 w-full max-w-lg -translate-x-1/2 border-t border-surface-border bg-surface/95 backdrop-blur-md safe-pb">
      <div className="flex h-14 items-stretch justify-around">
        {tabs.map((tab) => {
          const active =
            tab.href === "/categories"
              ? pathname === "/" || pathname.startsWith("/categories") || pathname.startsWith("/product") || pathname.startsWith("/search")
              : pathname.startsWith(tab.href);
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-1 flex-col items-center justify-center gap-0.5 text-[10px] transition-colors ${
                active ? "text-gold" : "text-foreground/50"
              }`}
            >
              <span className="relative">
                <Icon active={active} />
                {tab.href === "/cart" && count > 0 && (
                  <span className="absolute -right-2 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[9px] font-bold text-background">
                    {count > 99 ? "99+" : count}
                  </span>
                )}
              </span>
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 10.5L12 3l9 7.5V20a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1v-9.5z" fill={active ? "currentColor" : "none"} />
    </svg>
  );
}

function CartIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="9" cy="20" r="1.5" fill={active ? "currentColor" : "none"} />
      <circle cx="18" cy="20" r="1.5" fill={active ? "currentColor" : "none"} />
      <path d="M2 3h2l2.4 12h11.2l2-8H6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ContactIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M21 11.5a8.5 8.5 0 01-9 8.5 8.5 8.5 0 01-9-8.5 8.5 8.5 0 019-8.5 8.5 8.5 0 019 8.5z" fill={active ? "currentColor" : "none"} />
      <path d="M8 11h8M8 14h5" strokeLinecap="round" />
    </svg>
  );
}

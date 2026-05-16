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
    <nav className="pointer-events-none fixed bottom-0 left-1/2 z-50 w-full max-w-lg -translate-x-1/2 px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
      <div className="pointer-events-auto flex h-[3.75rem] items-stretch justify-around rounded-2xl border border-surface-border/70 bg-surface/90 shadow-float backdrop-blur-xl">
        {tabs.map((tab) => {
          const active =
            tab.href === "/categories"
              ? pathname === "/" ||
                pathname.startsWith("/categories") ||
                pathname.startsWith("/product") ||
                pathname.startsWith("/search")
              : pathname.startsWith(tab.href);
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`relative flex flex-1 flex-col items-center justify-center gap-0.5 text-[10px] tracking-wide transition-all duration-300 ${
                active ? "text-gold" : "text-foreground/45 hover:text-foreground/70"
              }`}
            >
              {active && (
                <span className="absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-gold/80 to-transparent" />
              )}
              <span className={`relative transition-transform duration-300 ${active ? "scale-110" : ""}`}>
                <Icon active={active} />
                {tab.href === "/cart" && count > 0 && (
                  <span className="absolute -right-2.5 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[9px] font-bold text-background shadow-gold">
                    {count > 99 ? "99+" : count}
                  </span>
                )}
              </span>
              <span className={active ? "font-medium" : ""}>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path
        d="M3 10.5L12 3l9 7.5V20a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1v-9.5z"
        fill={active ? "currentColor" : "none"}
        opacity={active ? 0.25 : 1}
      />
      <path d="M3 10.5L12 3l9 7.5V20a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1v-9.5z" />
    </svg>
  );
}

function CartIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="9" cy="20" r="1.5" fill={active ? "currentColor" : "none"} />
      <circle cx="18" cy="20" r="1.5" fill={active ? "currentColor" : "none"} />
      <path d="M2 3h2l2.4 12h11.2l2-8H6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ContactIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path
        d="M21 11.5a8.5 8.5 0 01-9 8.5 8.5 8.5 0 01-9-8.5 8.5 8.5 0 019-8.5 8.5 8.5 0 019 8.5z"
        fill={active ? "currentColor" : "none"}
        opacity={active ? 0.2 : 1}
      />
      <path d="M8 11h8M8 14h5" strokeLinecap="round" />
    </svg>
  );
}

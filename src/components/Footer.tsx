export function Footer() {
  return (
    <footer className="border-t border-surface-border px-4 py-6 pb-28 text-center text-[10px] leading-relaxed text-foreground/40">
      <p>古巴雪茄零售 · 價格以港幣（HKD）標示，僅供參考。</p>
      <p className="mt-2">
        雪茄產品僅向符合當地法律規定之年齡及地區之客戶銷售。請負責任享用。
      </p>
      <p className="mt-2">線上支付由 Stripe 安全處理，不支持微信/支付寶掃碼。</p>
    </footer>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-surface-border/40 px-6 py-8 pb-32 text-center">
      <div className="gold-rule mx-auto mb-5" />
      <p className="font-display text-sm tracking-wide text-gold/80">古巴雪茄零售</p>
      <p className="mt-2 text-[10px] leading-relaxed text-foreground/35">
        價格以港幣（HKD）標示，僅供參考。
        <br />
        雪茄產品僅向符合當地法律規定之年齡及地區之客戶銷售。
      </p>
      <p className="mt-3 text-[10px] text-foreground/30">Stripe 安全支付 · 不支持微信/支付寶掃碼</p>
    </footer>
  );
}

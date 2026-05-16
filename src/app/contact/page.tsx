import Image from "next/image";
import { PageHeader } from "@/components/PageHeader";
import { ShopShell } from "@/components/ShopShell";

export default function ContactPage() {
  return (
    <ShopShell>
      <PageHeader title="客服" subtitle="WeChat Support" />
      <div className="animate-fade-up flex flex-col items-center px-6 py-10 text-center">
        <div className="gold-rule mb-6" />
        <h2 className="font-display text-2xl tracking-wide text-gold">微信客服</h2>
        <p className="mt-3 max-w-xs text-sm leading-relaxed text-cream/50">
          掃碼添加微信，諮詢庫存、配送及 VIP 價格
        </p>
        <div className="relative mt-10 rounded-3xl border border-gold/25 bg-gradient-to-b from-surface-elevated to-surface p-3 shadow-gold">
          <div className="relative h-56 w-56 overflow-hidden rounded-2xl bg-white">
            <Image
              src="/wechat-qr.svg"
              alt="微信客服二維碼"
              fill
              className="object-contain p-3"
              sizes="224px"
            />
          </div>
          <p className="mt-4 text-[10px] uppercase tracking-luxury text-gold-muted">Scan to connect</p>
        </div>
        <p className="mt-8 text-xs text-foreground/40">
          服務時間：週一至週日 10:00 – 22:00（香港時間）
        </p>
        <p className="mt-4 max-w-xs text-xs leading-relaxed text-foreground/35">
          亦可透過購物車結帳後，我們將於 24 小時內與您確認訂單詳情。
        </p>
      </div>
    </ShopShell>
  );
}

import Image from "next/image";
import { PageHeader } from "@/components/PageHeader";
import { ShopShell } from "@/components/ShopShell";

export default function ContactPage() {
  return (
    <ShopShell>
      <PageHeader title="客服" />
      <div className="flex flex-col items-center px-6 py-10 text-center">
        <h2 className="font-display text-xl text-gold">微信客服</h2>
        <p className="mt-2 text-sm text-foreground/60">
          掃碼添加微信，諮詢庫存、配送及 VIP 價格
        </p>
        <div className="relative mt-8 h-56 w-56 overflow-hidden rounded-2xl border border-surface-border bg-white p-2">
          <Image
            src="/wechat-qr.svg"
            alt="微信客服二維碼"
            fill
            className="object-contain p-2"
            sizes="224px"
          />
        </div>
        <p className="mt-6 text-xs text-foreground/40">
          服務時間：週一至週日 10:00 – 22:00（香港時間）
        </p>
        <p className="mt-4 text-xs leading-relaxed text-foreground/40">
          亦可透過購物車結帳後，我們將於 24 小時內與您確認訂單詳情。
        </p>
      </div>
    </ShopShell>
  );
}

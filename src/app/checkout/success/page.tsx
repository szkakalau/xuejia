import Link from "next/link";
import { ClearCartOnSuccess } from "@/components/ClearCartOnSuccess";
import { PageHeader } from "@/components/PageHeader";
import { ShopShell } from "@/components/ShopShell";

export default function CheckoutSuccessPage() {
  return (
    <ShopShell>
      <ClearCartOnSuccess />
      <PageHeader title="支付成功" />
      <div className="flex flex-col items-center px-6 py-16 text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gold/20 text-3xl text-gold">
          ✓
        </div>
        <h2 className="font-display text-xl text-gold">感謝您的訂購</h2>
        <p className="mt-3 text-sm text-foreground/60">
          我們已收到您的付款，將盡快透過微信或電郵與您確認發貨詳情。
        </p>
        <Link
          href="/categories"
          className="mt-8 rounded-full bg-gold px-8 py-3 text-sm font-medium text-background"
        >
          繼續選購
        </Link>
        <Link href="/contact" className="mt-4 text-sm text-gold underline">
          聯繫客服
        </Link>
      </div>
    </ShopShell>
  );
}

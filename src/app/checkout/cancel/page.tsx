import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { ShopShell } from "@/components/ShopShell";

export default function CheckoutCancelPage() {
  return (
    <ShopShell>
      <PageHeader title="支付已取消" />
      <div className="flex flex-col items-center px-6 py-16 text-center">
        <h2 className="font-display text-xl text-foreground/80">您已取消支付</h2>
        <p className="mt-3 text-sm text-foreground/60">購物車商品已保留，可隨時返回結算。</p>
        <Link
          href="/cart"
          className="mt-8 rounded-full bg-gold px-8 py-3 text-sm font-medium text-background"
        >
          返回購物車
        </Link>
      </div>
    </ShopShell>
  );
}

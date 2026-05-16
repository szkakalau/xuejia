import { NextResponse } from "next/server";
import { getProductById } from "@/lib/products";
import { getStripe, hkdToStripeAmount } from "@/lib/stripe";
import type { CheckoutItem } from "@/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { items?: CheckoutItem[] };
    const items = body.items;

    if (!items?.length) {
      return NextResponse.json({ error: "購物車為空" }, { status: 400 });
    }

    const lineItems: {
      price_data: {
        currency: string;
        product_data: { name: string; images?: string[] };
        unit_amount: number;
      };
      quantity: number;
    }[] = [];

    for (const item of items) {
      const product = getProductById(item.productId);
      if (!product) {
        return NextResponse.json({ error: `商品不存在: ${item.productId}` }, { status: 400 });
      }
      if (!product.inStock || product.priceHkd <= 0) {
        return NextResponse.json({ error: `${product.name} 暫不可購買` }, { status: 400 });
      }
      if (item.quantity < 1 || item.quantity > 99) {
        return NextResponse.json({ error: "數量無效" }, { status: 400 });
      }

      const origin = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
      const imageUrl = product.image.startsWith("http")
        ? product.image
        : `${origin}${product.image}`;

      lineItems.push({
        price_data: {
          currency: "hkd",
          product_data: {
            name: `${product.brandName} — ${product.nameZh || product.name}`,
            images: [imageUrl],
          },
          unit_amount: hkdToStripeAmount(product.priceHkd),
        },
        quantity: item.quantity,
      });
    }

    const stripe = getStripe();
    const origin = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cancel`,
      locale: "zh-HK",
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Checkout error:", err);
    const message =
      err instanceof Error && err.message.includes("STRIPE")
        ? "支付尚未配置，請聯繫店家"
        : "結算失敗，請稍後再試";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

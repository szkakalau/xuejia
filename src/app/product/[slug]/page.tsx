import { ProductDetail } from "@/components/ProductDetail";
import { ShopShell } from "@/components/ShopShell";
import { PageHeader } from "@/components/PageHeader";
import { getProductBySlug } from "@/lib/products";

export const revalidate = 60;
export const dynamic = "force-dynamic";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return (
      <ShopShell>
        <PageHeader title="商品不存在" backHref="/categories" />
        <p className="py-20 text-center text-foreground/50">找不到此商品</p>
      </ShopShell>
    );
  }

  return <ProductDetail product={product} />;
}

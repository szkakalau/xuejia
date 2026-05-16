import { CategoriesView } from "@/components/CategoriesView";
import { getBrands, getProducts } from "@/lib/products";

export const revalidate = 60;
export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const [brands, products] = await Promise.all([getBrands(), getProducts()]);
  return <CategoriesView brands={brands} products={products} />;
}

import { revalidatePath } from "next/cache";

export function revalidateStorefront() {
  revalidatePath("/");
  revalidatePath("/categories");
  revalidatePath("/search");
  revalidatePath("/product", "layout");
  revalidatePath("/api/products");
}

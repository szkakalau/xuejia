export interface Brand {
  id: string;
  name: string;
  nameZh: string;
  slug: string;
}

export interface ProductSpecs {
  length: string;
  ringGauge: number | null;
  packaging: string;
}

export interface Product {
  id: string;
  brandId: string;
  brandName: string;
  brandNameZh: string;
  name: string;
  nameZh: string;
  specs: ProductSpecs;
  priceHkd: number;
  priceDisplay: string;
  inStock: boolean;
  image: string;
  slug: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  product?: Product;
}

export interface CheckoutItem {
  productId: string;
  quantity: number;
}

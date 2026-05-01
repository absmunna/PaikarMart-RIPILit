import { Product } from "./product.types";
import { api } from "@/lib/api";

interface ApiProduct {
  id: string;
  sellerId: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  price: number;
  originalPrice: number | null;
  category: string | null;
  rating: string | null;
  reviewCount: number;
  stock: number;
  sold: number;
  isFlashSale: boolean;
}

function adapt(p: ApiProduct): Product {
  return {
    id: p.id,
    title: p.title,
    price: p.price,
    oldPrice: p.originalPrice ?? undefined,
    image: p.imageUrl ?? "",
    sellerId: p.sellerId,
    rating: p.rating ? Number(p.rating) : 0,
    reviewCount: p.reviewCount,
    category: p.category ?? "Other",
    description: p.description ?? "",
    isFlashSale: p.isFlashSale || undefined,
  };
}

export async function getProducts(category?: string): Promise<Product[]> {
  const all = await api.get<ApiProduct[]>("/api/products");
  const list = all.map(adapt);
  if (category) {
    return list.filter((p) => p.category.toLowerCase() === category.toLowerCase());
  }
  return list;
}

export async function getProductById(id: string): Promise<Product | undefined> {
  try {
    const p = await api.get<ApiProduct>(`/api/products/${id}`);
    return adapt(p);
  } catch {
    return undefined;
  }
}

export const MOCK_PRODUCTS: Product[] = [];

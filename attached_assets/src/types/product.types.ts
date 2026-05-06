export interface Product {
  id: string;
  title: string;
  price: number;
  oldPrice?: number;
  image: string;
  images?: string[];
  sellerId: string;
  rating: number;
  reviewCount: number;
  category: string;
  description: string;
  isFlashSale?: boolean;
  isNewArrival?: boolean;
  isWholesale?: boolean;
}

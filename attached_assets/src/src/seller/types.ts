export type SellerType =
  | "retail"
  | "wholesale"
  | "dropship"
  | "grocery"
  | "service"
  | "hotel"
  | "real_estate";

export const SELLER_TYPE_LABELS: Record<SellerType, string> = {
  retail: "Retail",
  wholesale: "Wholesale",
  dropship: "Dropshipping",
  grocery: "Grocery",
  service: "Services",
  hotel: "Hotel / Tour",
  real_estate: "Real Estate",
};

export type VerificationStatus = "unsubmitted" | "pending" | "approved" | "rejected";

export interface SellerProfile {
  shopName: string;
  tagline: string;
  type: SellerType;
  category: string;
  location: string;
  contactEmail: string;
  contactPhone: string;
  avatarUrl: string;
  coverUrl: string;
  verified: boolean;
  verificationStatus: VerificationStatus;
  documents: { id: string; name: string; kind: "nid" | "passport" | "business" }[];
}

export type SellerOrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface SellerProduct {
  id: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  categoryName: string;
  type: SellerType;
  location: string;
  images: string[];
  videoUrl?: string;
  tags: string[];
  views: number;
  createdAt: string;
}

export interface SellerOrder {
  id: string;
  customerName: string;
  productTitle: string;
  productImage: string;
  quantity: number;
  total: number;
  status: SellerOrderStatus;
  createdAt: string;
}

export const ORDER_STATUS_FLOW: SellerOrderStatus[] = [
  "pending",
  "processing",
  "shipped",
  "delivered",
];

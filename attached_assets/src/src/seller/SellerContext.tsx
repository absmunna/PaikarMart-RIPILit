import * as React from "react";
import {
  SellerOrder,
  SellerOrderStatus,
  SellerProduct,
  SellerProfile,
  VerificationStatus,
} from "./types";

interface SellerContextValue {
  isSeller: boolean;
  becomeSeller: () => void;
  profile: SellerProfile;
  updateProfile: (patch: Partial<SellerProfile>) => void;
  products: SellerProduct[];
  createProduct: (input: Omit<SellerProduct, "id" | "views" | "createdAt">) => SellerProduct;
  updateProduct: (id: string, patch: Partial<SellerProduct>) => void;
  deleteProduct: (id: string) => void;
  orders: SellerOrder[];
  setOrderStatus: (id: string, status: SellerOrderStatus) => void;
  submitVerification: (
    docs: SellerProfile["documents"],
    type: SellerProfile["type"],
    category: string,
  ) => void;
  verificationStatus: VerificationStatus;
}

const SellerContext = React.createContext<SellerContextValue | null>(null);

const initialProfile: SellerProfile = {
  shopName: "Aurora Goods Co.",
  tagline: "Curated essentials, delivered locally.",
  type: "retail",
  category: "Home & Lifestyle",
  location: "Dhaka, Bangladesh",
  contactEmail: "hello@auroragoods.example",
  contactPhone: "+880 1700 000000",
  avatarUrl: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=200",
  coverUrl: "https://images.unsplash.com/photo-1557683316-973673baf926?w=1200",
  verified: false,
  verificationStatus: "unsubmitted",
  documents: [],
};

const seedProducts = (): SellerProduct[] => [
  {
    id: "sp_1",
    title: "Handwoven Cotton Throw",
    description: "Soft, breathable cotton throw, ethically made by local artisans.",
    price: 38,
    stock: 24,
    categoryId: "home",
    categoryName: "Home & Lifestyle",
    type: "retail",
    location: "Dhaka, Bangladesh",
    images: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600"],
    tags: ["home", "cotton", "handmade"],
    views: 248,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
  },
  {
    id: "sp_2",
    title: "Ceramic Pour-over Set",
    description: "A minimalist matte ceramic pour-over kit for the perfect morning cup.",
    price: 54,
    stock: 12,
    categoryId: "home",
    categoryName: "Kitchen",
    type: "retail",
    location: "Dhaka, Bangladesh",
    images: ["https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600"],
    tags: ["coffee", "ceramic"],
    views: 412,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
  },
  {
    id: "sp_3",
    title: "Linen Tote – Sand",
    description: "Heavyweight linen tote with reinforced handles. Holds groceries for days.",
    price: 22,
    stock: 0,
    categoryId: "fashion",
    categoryName: "Fashion",
    type: "retail",
    location: "Dhaka, Bangladesh",
    images: ["https://images.unsplash.com/photo-1593998066526-65fcab3021a2?w=600"],
    tags: ["bag", "linen"],
    views: 96,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 22).toISOString(),
  },
];

const seedOrders = (): SellerOrder[] => [
  {
    id: "so_1001",
    customerName: "Nadia R.",
    productTitle: "Handwoven Cotton Throw",
    productImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=200",
    quantity: 2,
    total: 76,
    status: "pending",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: "so_1002",
    customerName: "Imran K.",
    productTitle: "Ceramic Pour-over Set",
    productImage: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200",
    quantity: 1,
    total: 54,
    status: "processing",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
  },
  {
    id: "so_1003",
    customerName: "Sara P.",
    productTitle: "Linen Tote – Sand",
    productImage: "https://images.unsplash.com/photo-1593998066526-65fcab3021a2?w=200",
    quantity: 3,
    total: 66,
    status: "shipped",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 60).toISOString(),
  },
  {
    id: "so_1004",
    customerName: "Tareq M.",
    productTitle: "Handwoven Cotton Throw",
    productImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=200",
    quantity: 1,
    total: 38,
    status: "delivered",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
  },
];

export function SellerProvider({ children }: { children: React.ReactNode }) {
  const [isSeller, setIsSeller] = React.useState(false);
  const [profile, setProfile] = React.useState<SellerProfile>(initialProfile);
  const [products, setProducts] = React.useState<SellerProduct[]>(seedProducts);
  const [orders, setOrders] = React.useState<SellerOrder[]>(seedOrders);

  const value: SellerContextValue = {
    isSeller,
    becomeSeller: () => setIsSeller(true),
    profile,
    updateProfile: (patch) => setProfile((p) => ({ ...p, ...patch })),
    products,
    createProduct: (input) => {
      const created: SellerProduct = {
        ...input,
        id: `sp_${Math.random().toString(36).slice(2, 9)}`,
        views: 0,
        createdAt: new Date().toISOString(),
      };
      setProducts((prev) => [created, ...prev]);
      return created;
    },
    updateProduct: (id, patch) =>
      setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p))),
    deleteProduct: (id) => setProducts((prev) => prev.filter((p) => p.id !== id)),
    orders,
    setOrderStatus: (id, status) =>
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o))),
    submitVerification: (docs, type, category) => {
      setProfile((p) => ({
        ...p,
        documents: docs,
        type,
        category,
        verificationStatus: "pending",
      }));
      setIsSeller(true);
    },
    verificationStatus: profile.verificationStatus,
  };

  return <SellerContext.Provider value={value}>{children}</SellerContext.Provider>;
}

export function useSeller() {
  const ctx = React.useContext(SellerContext);
  if (!ctx) throw new Error("useSeller must be used inside <SellerProvider>");
  return ctx;
}

import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import FeedHome from "@/pages/social/FeedHome";
import PostDetail from "@/pages/social/PostDetail";
import Spotlight from "@/pages/social/Spotlight";
import MarketplaceHome from "@/pages/marketplace/MarketplaceHome";
import CategoryPage from "@/pages/marketplace/CategoryPage";
import SearchPage from "@/pages/marketplace/SearchPage";
import ProductDetail from "@/pages/marketplace/ProductDetail";
import SellerProfile from "@/pages/seller/SellerProfile";
import SellerDashboard from "@/pages/seller/SellerDashboard";
import SellerProducts from "@/pages/seller/SellerProducts";
import SellerOrders from "@/pages/seller/SellerOrders";
import CartPage from "@/pages/cart/CartPage";
import OrdersPage from "@/pages/orders/OrdersPage";
import OrderDetail from "@/pages/orders/OrderDetail";
import WalletPage from "@/pages/wallet/WalletPage";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import NotFound from "@/pages/notfound/NotFound";
import NotificationsPage from "@/pages/notifications/NotificationsPage";
import { ProtectedRoute, RoleRoute, SellerOwnerRoute } from "@/features/auth/ProtectedRoute";

export function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<FeedHome />} />
        <Route path="/post/:id" element={<PostDetail />} />
        <Route path="/spotlight" element={<Spotlight />} />
        
        <Route path="/marketplace" element={<MarketplaceHome />} />
        <Route path="/marketplace/category/:slug" element={<CategoryPage />} />
        <Route path="/marketplace/search" element={<SearchPage />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        
        <Route path="/seller/:handle" element={<SellerProfile />} />
        <Route path="/seller/:handle/dashboard" element={<SellerOwnerRoute><SellerDashboard /></SellerOwnerRoute>} />
        <Route path="/seller/:handle/products" element={<SellerOwnerRoute><SellerProducts /></SellerOwnerRoute>} />
        <Route path="/seller/:handle/orders" element={<SellerOwnerRoute><SellerOrders /></SellerOwnerRoute>} />
        
        <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
        
        <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
        <Route path="/orders/:id" element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />
        
        <Route path="/wallet" element={<ProtectedRoute><WalletPage /></ProtectedRoute>} />

        <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

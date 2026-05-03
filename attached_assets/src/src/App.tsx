import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { useEffect, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import { AppShell } from "@/components/layout/AppShell";
import NotFound from "@/pages/not-found";

import Home from "@/pages/home";
import Marketplace from "@/pages/marketplace";
import ProductDetail from "@/pages/product-detail";
import Vendors from "@/pages/vendors";
import VendorDetail from "@/pages/vendor-detail";
import Local from "@/pages/local";
import Categories from "@/pages/categories";
import Reels from "@/pages/reels";
import Demand from "@/pages/demand";
import DemandDetail from "@/pages/demand-detail";
import Cart from "@/pages/cart";
import Orders from "@/pages/orders";
import Notifications from "@/pages/notifications";
import DevNotes from "@/pages/dev-notes";
import Profile from "@/pages/profile";
import FAQPage from "@/pages/faq";
import TermsPage from "@/pages/terms";

import { SellerProvider } from "@/seller/SellerContext";
import { SellerLayout } from "@/seller/SellerLayout";
import SellerDashboard from "@/pages/seller/dashboard";
import SellerProducts from "@/pages/seller/products";
import SellerProductForm from "@/pages/seller/product-form";
import SellerOrdersPage from "@/pages/seller/orders";
import SellerProfilePage from "@/pages/seller/profile";
import SellerVerification from "@/pages/seller/verification";
import SellerAnalytics from "@/pages/seller/analytics";

// New: feature providers
import { ThemeProvider } from "@/features/theme/ThemeContext";
import { AuthProvider, useAuth } from "@/features/auth/AuthContext";
import { CartProvider } from "@/features/cart/CartContext";
import { WishlistProvider } from "@/features/wishlist/WishlistContext";
import { LocationProvider } from "@/features/location/LocationContext";
import { PKCoinProvider } from "@/features/wallet/PKCoinContext";
import { VideoUnlockProvider } from "@/features/digital-content/VideoUnlockContext";

// New: pages
import LoginPage from "@/pages/auth/login";
import RegisterPage from "@/pages/auth/register";
import SellerRegisterPage from "@/pages/auth/seller-register";
import WalletPage from "@/pages/wallet";
import VideoLibrary from "@/pages/video";
import VideoDetail from "@/pages/video/detail";
import VideoPackage from "@/pages/video/package";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminSettings from "@/pages/admin/settings";
import AdminChanges from "@/pages/admin/changes";
import AdminRegistry from "@/pages/admin/registry";
import AdminUsers from "@/pages/admin/users";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/auth/login");
    }
  }, [isAuthenticated, setLocation]);

  if (!isAuthenticated) return null;
  return <>{children}</>;
}

function SellerRoutes() {
  return (
    <SellerLayout>
      <Switch>
        <Route path="/seller" component={SellerDashboard} />
        <Route path="/seller/products" component={SellerProducts} />
        <Route path="/seller/products/new" component={SellerProductForm} />
        <Route path="/seller/products/:id/edit" component={SellerProductForm} />
        <Route path="/seller/new-product" component={SellerProductForm} />
        <Route path="/seller/orders" component={SellerOrdersPage} />
        <Route path="/seller/analytics" component={SellerAnalytics} />
        <Route path="/seller/profile" component={SellerProfilePage} />
        <Route path="/seller/verification" component={SellerVerification} />
        <Route component={NotFound} />
      </Switch>
    </SellerLayout>
  );
}

function Router() {
  return (
    <AppShell>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/marketplace" component={Marketplace} />
        <Route path="/marketplace/product/:id" component={ProductDetail} />
        <Route path="/vendors" component={Vendors} />
        <Route path="/vendors/:id" component={VendorDetail} />
        <Route path="/local" component={Local} />
        <Route path="/categories" component={Categories} />
        <Route path="/reels" component={Reels} />
        <Route path="/demand" component={Demand} />
        <Route path="/demand/:id" component={DemandDetail} />
        <Route path="/cart" component={Cart} />
        <Route path="/orders" component={Orders} />
        <Route path="/notifications" component={Notifications} />
        <Route path="/faq" component={FAQPage} />
        <Route path="/terms" component={TermsPage} />

        {/* Auth */}
        <Route path="/auth/login" component={LoginPage} />
        <Route path="/auth/register" component={RegisterPage} />
        <Route path="/auth/seller-register" component={SellerRegisterPage} />

        {/* Wallet */}
        <Route path="/wallet" component={WalletPage} />

        {/* Digital video content */}
        <Route path="/video" component={VideoLibrary} />
        <Route path="/video/package/:id" component={VideoPackage} />
        <Route path="/video/:id" component={VideoDetail} />

        {/* Admin */}
        <Route path="/admin">{() => (
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        )}</Route>
        <Route path="/admin/settings">{() => (
          <ProtectedRoute>
            <AdminSettings />
          </ProtectedRoute>
        )}</Route>
        <Route path="/admin/changes">{() => (
          <ProtectedRoute>
            <AdminChanges />
          </ProtectedRoute>
        )}</Route>
        <Route path="/admin/registry">{() => (
          <ProtectedRoute>
            <AdminRegistry />
          </ProtectedRoute>
        )}</Route>
        <Route path="/admin/users">{() => (
          <ProtectedRoute>
            <AdminUsers />
          </ProtectedRoute>
        )}</Route>
        <Route path="/admin/dev-notes">{() => (
          <ProtectedRoute>
            <DevNotes />
          </ProtectedRoute>
        )}</Route>

        <Route path="/seller/:rest*">{() => (
          <ProtectedRoute>
            <SellerRoutes />
          </ProtectedRoute>
        )}</Route>
        <Route path="/seller">{() => (
          <ProtectedRoute>
            <SellerRoutes />
          </ProtectedRoute>
        )}</Route>
        <Route path="/profile" component={Profile} />
        <Route component={NotFound} />
      </Switch>
    </AppShell>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <LocationProvider>
            <PKCoinProvider>
              <VideoUnlockProvider>
                <WishlistProvider>
                  <CartProvider>
                    <TooltipProvider>
                      <SellerProvider>
                        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
                          <Router />
                        </WouterRouter>
                        <Toaster />
                      </SellerProvider>
                    </TooltipProvider>
                  </CartProvider>
                </WishlistProvider>
              </VideoUnlockProvider>
            </PKCoinProvider>
          </LocationProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;

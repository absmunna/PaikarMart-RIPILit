import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { CartProvider } from "@/hooks/use-cart";
import NotFound from "@/pages/not-found";

import Home from "@/pages/index";
import ProductsPage from "@/pages/products/index";
import ProductDetailPage from "@/pages/products/[id]";
import CartPage from "@/pages/cart";
import CheckoutPage from "@/pages/checkout";
import OrdersPage from "@/pages/orders/index";
import OrderDetailPage from "@/pages/orders/[id]";
import VendorsPage from "@/pages/vendors/index";
import VendorDetailPage from "@/pages/vendors/[id]";
import LoginPage from "@/pages/login";
import RegisterPage from "@/pages/register";
import SellerRegisterPage from "@/pages/seller/register";
import SellerDashboardPage from "@/pages/seller/dashboard";
import AdminDashboardPage from "@/pages/admin/dashboard";
import WalletPage from "@/pages/wallet";
import NotificationsPage from "@/pages/notifications";
import FAQPage from "@/pages/faq";
import TermsPage from "@/pages/terms";
import ProfilePage from "@/pages/profile";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/products" component={ProductsPage} />
      <Route path="/products/:id" component={ProductDetailPage} />
      <Route path="/cart" component={CartPage} />
      <Route path="/checkout" component={CheckoutPage} />
      <Route path="/orders" component={OrdersPage} />
      <Route path="/orders/:id" component={OrderDetailPage} />
      <Route path="/vendors" component={VendorsPage} />
      <Route path="/vendors/:id" component={VendorDetailPage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/register" component={RegisterPage} />
      <Route path="/seller/register" component={SellerRegisterPage} />
      <Route path="/seller/dashboard" component={SellerDashboardPage} />
      <Route path="/admin/dashboard" component={AdminDashboardPage} />
      <Route path="/wallet" component={WalletPage} />
      <Route path="/notifications" component={NotificationsPage} />
      <Route path="/faq" component={FAQPage} />
      <Route path="/terms" component={TermsPage} />
      <Route path="/profile" component={ProfilePage} />
      <Route component={NotFound} />
    </Switch>
  );
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <TooltipProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
            <Toaster position="top-right" richColors />
          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

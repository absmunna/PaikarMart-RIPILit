import { Switch, Route, Redirect } from "wouter";
import { type ReactNode } from "react";
import { useAuth } from "@/hooks/use-auth";

import Home from "@/pages/index";
import FeedPage from "@/pages/feed";
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
import NotFound from "@/pages/not-found";

function RequireAuth({ children }: { children: ReactNode }) {
  const { isLoggedIn } = useAuth();
  if (!isLoggedIn) return <Redirect to="/login" />;
  return <>{children}</>;
}

function RequireSeller({ children }: { children: ReactNode }) {
  const { isLoggedIn, role } = useAuth();
  if (!isLoggedIn) return <Redirect to="/login" />;
  if (role !== "seller" && role !== "admin") return <Redirect to="/" />;
  return <>{children}</>;
}

function RequireAdmin({ children }: { children: ReactNode }) {
  const { isLoggedIn, role } = useAuth();
  if (!isLoggedIn) return <Redirect to="/login" />;
  if (role !== "admin") return <Redirect to="/" />;
  return <>{children}</>;
}

export function AppRouter() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/feed" component={FeedPage} />
      <Route path="/products" component={ProductsPage} />
      <Route path="/products/:id" component={ProductDetailPage} />
      <Route path="/cart" component={CartPage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/register" component={RegisterPage} />
      <Route path="/faq" component={FAQPage} />
      <Route path="/terms" component={TermsPage} />
      <Route path="/vendors" component={VendorsPage} />
      <Route path="/vendors/:id" component={VendorDetailPage} />

      <Route path="/checkout">
        <RequireAuth><CheckoutPage /></RequireAuth>
      </Route>
      <Route path="/orders">
        <RequireAuth><OrdersPage /></RequireAuth>
      </Route>
      <Route path="/orders/:id">
        {() => <RequireAuth><OrderDetailPage /></RequireAuth>}
      </Route>
      <Route path="/wallet">
        <RequireAuth><WalletPage /></RequireAuth>
      </Route>
      <Route path="/notifications">
        <RequireAuth><NotificationsPage /></RequireAuth>
      </Route>
      <Route path="/profile">
        <RequireAuth><ProfilePage /></RequireAuth>
      </Route>
      <Route path="/seller/register">
        <RequireAuth><SellerRegisterPage /></RequireAuth>
      </Route>
      <Route path="/seller/dashboard">
        <RequireSeller><SellerDashboardPage /></RequireSeller>
      </Route>
      <Route path="/admin/dashboard">
        <RequireAdmin><AdminDashboardPage /></RequireAdmin>
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

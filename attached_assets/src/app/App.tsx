import { Suspense } from "react";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { AuthProvider } from "@/features/auth/auth.context";
import { CartProvider } from "@/features/cart/cart.context";
import { WalletProvider } from "@/features/wallet/wallet.context";
import { AppRouter } from "./router";
import Loader from "@/components/common/Loader";

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <WalletProvider>
            <Suspense fallback={<Loader full label="Loading PaikarMart…" />}>
              <AppRouter />
            </Suspense>
          </WalletProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

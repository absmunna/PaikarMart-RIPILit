import { Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { CartProvider } from "@/hooks/use-cart";
import { WishlistProvider } from "@/context/WishlistContext";
import { LocationProvider } from "@/context/LocationContext";
import { PKCoinProvider } from "@/context/PKCoinContext";
import { VideoUnlockProvider } from "@/context/VideoUnlockContext";
import { SellerProvider } from "@/seller/SellerContext";
import { AppRouter } from "@/routes/index";

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
        <LocationProvider>
          <PKCoinProvider>
            <VideoUnlockProvider>
              <WishlistProvider>
                <SellerProvider>
                  <CartProvider>
                    <TooltipProvider>
                      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
                        <AppRouter />
                      </WouterRouter>
                      <Toaster position="top-right" richColors />
                    </TooltipProvider>
                  </CartProvider>
                </SellerProvider>
              </WishlistProvider>
            </VideoUnlockProvider>
          </PKCoinProvider>
        </LocationProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

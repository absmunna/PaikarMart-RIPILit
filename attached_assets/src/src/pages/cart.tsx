import { useGetCart, getGetCartQueryKey, useRemoveCartItem, useCreateOrder } from "@workspace/api-client-react";
import { formatBDT } from "@/lib/format";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { toast } from "sonner";

export default function Cart() {
  const [, setLocation] = useLocation();
  const qc = useQueryClient();
  const { data: cart } = useGetCart({ query: { queryKey: getGetCartQueryKey() } });
  const removeItem = useRemoveCartItem();
  const createOrder = useCreateOrder();

  const handleRemove = (id: string) => {
    removeItem.mutate({ itemId: id }, {
      onSuccess: () => {
        toast.success("Item removed");
        qc.invalidateQueries({ queryKey: getGetCartQueryKey() });
      }
    });
  };

  const handleCheckout = () => {
    createOrder.mutate(undefined, {
      onSuccess: () => {
        toast.success("Order placed successfully!");
        qc.invalidateQueries({ queryKey: getGetCartQueryKey() });
        setLocation("/orders");
      }
    });
  };

  if (!cart) return <div className="p-8 text-center text-white">Loading...</div>;

  if (cart.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 p-4">
        <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/20">
          <ShoppingBag className="w-12 h-12" />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Your cart is empty</h2>
          <p className="text-white/50 max-w-sm">Looks like you haven't added anything to your cart yet. Explore our marketplace to find products you'll love.</p>
        </div>
        <Link href="/marketplace">
          <Button className="mt-4 bg-primary hover:bg-primary/90 text-white rounded-full px-8">
            Start Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-white">Shopping Cart</h1>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="flex-1 flex flex-col gap-4 w-full">
          {cart.items.map((item) => (
            <GlassCard key={item.id} className="p-4 flex gap-4">
              <Link href={`/marketplace/product/${item.product.id}`} className="shrink-0">
                <img 
                  src={item.product.images[0]} 
                  alt={item.product.title} 
                  className="w-24 h-24 object-cover rounded-lg border border-white/10"
                />
              </Link>
              
              <div className="flex flex-col flex-1 py-1">
                <div className="flex justify-between items-start gap-4">
                  <Link href={`/marketplace/product/${item.product.id}`}>
                    <h3 className="font-medium text-white hover:text-primary transition-colors line-clamp-2">{item.product.title}</h3>
                  </Link>
                  <button 
                    onClick={() => handleRemove(item.id)}
                    className="text-white/40 hover:text-red-400 transition-colors p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="text-sm text-white/50 mt-1">{item.product.vendor.name}</div>
                
                <div className="mt-auto flex items-center justify-between">
                  <div className="text-sm text-white/70">Qty: <span className="font-semibold text-white">{item.quantity}</span></div>
                  <div className="font-bold text-primary">৳{Number((item.product.price * item.quantity).toFixed(2)).toLocaleString("en-IN")}</div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        <GlassCard className="w-full md:w-80 p-6 flex flex-col gap-6 sticky top-24 shrink-0">
          <h2 className="text-lg font-semibold text-white">Order Summary</h2>
          
          <div className="flex flex-col gap-3 text-sm">
            <div className="flex justify-between text-white/70">
              <span>Subtotal ({cart.itemCount} items)</span>
              <span>{formatBDT(cart.subtotal)}</span>
            </div>
            <div className="flex justify-between text-white/70">
              <span>Shipping</span>
              <span className="text-green-400">Free</span>
            </div>
            <div className="flex justify-between text-white/70">
              <span>Tax</span>
              <span>{formatBDT(0)}</span>
            </div>
            
            <div className="h-px bg-white/10 my-1" />
            
            <div className="flex justify-between items-end">
              <span className="font-medium text-white">Total</span>
              <span className="text-2xl font-bold text-primary">{formatBDT(cart.subtotal)}</span>
            </div>
          </div>

          <Button 
            className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl h-12 text-base"
            onClick={handleCheckout}
            disabled={createOrder.isPending}
          >
            {createOrder.isPending ? "Processing..." : (
              <>Checkout <ArrowRight className="w-4 h-4 ml-2" /></>
            )}
          </Button>
        </GlassCard>
      </div>
    </div>
  );
}

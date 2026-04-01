import React from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/hooks/use-cart";
import { useLocation } from "wouter";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const [, setLocation] = useLocation();

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    clearCart();
    // Simulate order placement
    setTimeout(() => {
      setLocation("/orders");
    }, 1000);
  };

  if (items.length === 0) {
    setLocation("/cart");
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="p-6 border rounded-xl">
              <h2 className="text-xl font-bold mb-4">Customer Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <Input required placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone Number</label>
                  <Input required placeholder="+880" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">Delivery Address</label>
                  <Input required placeholder="123 Street Name" />
                </div>
              </div>
            </div>
            
            <div className="p-6 border rounded-xl">
              <h2 className="text-xl font-bold mb-4">Payment Method</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 border rounded-lg bg-primary/5 border-primary">
                  <input type="radio" name="payment" defaultChecked className="h-4 w-4 text-primary" />
                  <span className="font-medium">Cash on Delivery</span>
                </div>
                <div className="flex items-center gap-3 p-4 border rounded-lg opacity-50 pointer-events-none">
                  <input type="radio" name="payment" disabled className="h-4 w-4" />
                  <span className="font-medium">Online Payment (Coming Soon)</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6 border rounded-xl h-fit sticky top-24">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-4 mb-6">
              {items.map(item => (
                <div key={item.productId} className="flex justify-between text-sm">
                  <span>{item.quantity}x {item.productName}</span>
                  <span>৳{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 mb-6 space-y-2">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>৳{totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Delivery Charge</span>
                <span>৳100</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t mt-2">
                <span>Total</span>
                <span>৳{(totalPrice + 100).toLocaleString()}</span>
              </div>
            </div>
            <Button type="submit" className="w-full" size="lg">Place Order</Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}

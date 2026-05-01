import React, { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useCreateOrder } from "@workspace/api-client-react";
import { toast } from "sonner";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState("");
  const [area, setArea] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash_on_delivery");
  const deliveryCharge = 100;

  const createOrderMutation = useCreateOrder({
    mutation: {
      onSuccess: () => {
        clearCart();
        toast.success("Order placed successfully!");
        setLocation("/orders");
      },
      onError: (err) => {
        toast.error((err as Error).message || "Failed to place order");
      },
    },
  });

  useEffect(() => {
    if (items.length === 0) setLocation("/cart");
  }, [items.length, setLocation]);

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) { toast.error("Please enter delivery address"); return; }

    createOrderMutation.mutate({
      data: {
        items: items.map(i => ({
          productId: i.productId,
          quantity: i.quantity,
        })),
        customerName: name,
        customerPhone: phone,
        customerAddress: address,
        district: area || undefined,
        area: area || undefined,
        paymentMethod,
        deliveryType: "seller_delivery",
        // pass userId outside Zod-validated fields so server can read it
        ...(user?.id ? { userId: user.id } as Record<string, unknown> : {}),
      } as Parameters<typeof createOrderMutation.mutate>[0]["data"],
    });
  };

  if (items.length === 0) return null;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="p-6 border rounded-xl">
              <h2 className="text-xl font-bold mb-4">Delivery Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <Input required placeholder="Your name" value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone Number</label>
                  <Input required placeholder="+880 1XXXXXXXXX" value={phone} onChange={e => setPhone(e.target.value)} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">Delivery Address</label>
                  <Input required placeholder="House, Road, Area, District" value={address} onChange={e => setAddress(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Area / Thana</label>
                  <Input placeholder="e.g. Dhanmondi" value={area} onChange={e => setArea(e.target.value)} />
                </div>
              </div>
            </div>

            <div className="p-6 border rounded-xl">
              <h2 className="text-xl font-bold mb-4">Payment Method</h2>
              <div className="space-y-3">
                {[
                  { value: "cash_on_delivery", label: "Cash on Delivery" },
                  { value: "bkash", label: "bKash" },
                  { value: "nagad", label: "Nagad" },
                ].map(opt => (
                  <label key={opt.value} className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === opt.value ? "border-primary bg-primary/5" : "border-gray-200 hover:bg-gray-50"}`}>
                    <input
                      type="radio" name="payment" value={opt.value}
                      checked={paymentMethod === opt.value}
                      onChange={() => setPaymentMethod(opt.value)}
                      className="h-4 w-4 text-primary"
                    />
                    <span className="font-medium">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="p-6 border rounded-xl h-fit sticky top-24">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-3 mb-6">
              {items.map(item => (
                <div key={item.productId} className="flex justify-between text-sm">
                  <span className="flex-1 mr-2 text-gray-700">{item.quantity}× {item.productName}</span>
                  <span className="font-medium">৳{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 mb-6 space-y-2">
              <div className="flex justify-between text-muted-foreground text-sm">
                <span>Subtotal</span>
                <span>৳{totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-muted-foreground text-sm">
                <span>Delivery Charge</span>
                <span>৳{deliveryCharge}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t mt-2">
                <span>Total</span>
                <span>৳{(totalPrice + deliveryCharge).toLocaleString()}</span>
              </div>
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={createOrderMutation.isPending}>
              {createOrderMutation.isPending ? "Placing Order..." : "Place Order"}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}

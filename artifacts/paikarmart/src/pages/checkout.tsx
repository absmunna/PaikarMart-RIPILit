import React, { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useCreateOrder } from "@workspace/api-client-react";
import { toast } from "sonner";
import {
  MapPin, Phone, User, Truck, CreditCard, Smartphone, Banknote,
  ShieldCheck, ArrowRight, Package
} from "lucide-react";

const PAYMENT_METHODS = [
  { value: "cash_on_delivery", label: "Cash on Delivery", icon: Banknote, desc: "Pay when you receive" },
  { value: "bkash",           label: "bKash",             icon: Smartphone, desc: "Mobile banking" },
  { value: "nagad",           label: "Nagad",             icon: Smartphone, desc: "Mobile banking" },
];

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
      onError: (err: any) => {
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
        items: items.map(i => ({ productId: i.productId, quantity: i.quantity })),
        customerName: name,
        customerPhone: phone,
        customerAddress: address,
        district: area || undefined,
        area: area || undefined,
        paymentMethod,
        deliveryType: "seller_delivery",
        ...(user?.id ? { userId: user.id } as Record<string, unknown> : {}),
      } as Parameters<typeof createOrderMutation.mutate>[0]["data"],
    });
  };

  if (items.length === 0) return null;

  const inputCls = "bg-white/5 border-white/15 text-white placeholder:text-white/30 focus:border-primary focus:ring-primary";
  const labelCls = "text-sm font-medium text-white/60 mb-1.5 block";

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Checkout</h1>
          <p className="text-white/40 text-sm mt-0.5">{items.length} item{items.length !== 1 ? "s" : ""} · Confirm your order</p>
        </div>

        <form onSubmit={handlePlaceOrder}>
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left — Delivery + Payment */}
            <div className="flex-1 space-y-5">
              {/* Delivery Info */}
              <div className="glass-card rounded-2xl p-6">
                <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" /> Delivery Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                      <Input required placeholder="Your name" value={name} onChange={e => setName(e.target.value)}
                        className={`${inputCls} pl-10`} />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                      <Input required placeholder="+880 1XXXXXXXXX" value={phone} onChange={e => setPhone(e.target.value)}
                        className={`${inputCls} pl-10`} />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelCls}>Delivery Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                      <Input required placeholder="House, Road, Area, District" value={address} onChange={e => setAddress(e.target.value)}
                        className={`${inputCls} pl-10`} />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Area / Thana</label>
                    <Input placeholder="e.g. Dhanmondi" value={area} onChange={e => setArea(e.target.value)}
                      className={inputCls} />
                  </div>
                </div>
              </div>

              {/* Delivery Type */}
              <div className="glass-card rounded-2xl p-6">
                <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                  <Truck className="h-5 w-5 text-blue-400" /> Delivery Type
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { value: "seller_delivery", label: "Standard Delivery", desc: "3-7 business days", price: "৳100", icon: Truck, color: "text-primary" },
                    { value: "express",          label: "Express Delivery",  desc: "1-2 business days",  price: "৳200", icon: Truck, color: "text-amber-400" },
                  ].map(opt => (
                    <div key={opt.value}
                      className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                        "seller_delivery" === opt.value
                          ? "border-primary/40 bg-primary/10"
                          : "border-white/10 bg-white/3 hover:border-white/20"
                      }`}>
                      <opt.icon className={`h-5 w-5 mt-0.5 ${opt.color}`} />
                      <div className="flex-1">
                        <p className="font-semibold text-white text-sm">{opt.label}</p>
                        <p className="text-xs text-white/40">{opt.desc}</p>
                      </div>
                      <span className="text-sm font-bold text-white">{opt.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Method */}
              <div className="glass-card rounded-2xl p-6">
                <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-purple-400" /> Payment Method
                </h2>
                <div className="space-y-3">
                  {PAYMENT_METHODS.map(opt => {
                    const Icon = opt.icon;
                    return (
                      <label key={opt.value}
                        className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                          paymentMethod === opt.value
                            ? "border-primary/40 bg-primary/10"
                            : "border-white/10 hover:border-white/20 hover:bg-white/3"
                        }`}>
                        <input type="radio" name="payment" value={opt.value}
                          checked={paymentMethod === opt.value}
                          onChange={() => setPaymentMethod(opt.value)}
                          className="h-4 w-4 accent-primary" />
                        <div className="h-9 w-9 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                          <Icon className="h-4 w-4 text-white/60" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-white text-sm">{opt.label}</p>
                          <p className="text-xs text-white/40">{opt.desc}</p>
                        </div>
                        {paymentMethod === opt.value && (
                          <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center shrink-0">
                            <ShieldCheck className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right — Order Summary */}
            <div className="w-full lg:w-80 xl:w-96 shrink-0">
              <div className="glass-card rounded-2xl p-5 sticky top-24">
                <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" /> Order Summary
                </h2>

                {/* Items */}
                <div className="space-y-3 mb-5 max-h-60 overflow-y-auto pr-1">
                  {items.map(item => (
                    <div key={item.productId} className="flex gap-3 items-center">
                      <div className="h-12 w-12 rounded-lg bg-white/5 border border-white/10 overflow-hidden shrink-0">
                        {item.image ? (
                          <img src={item.image} alt={item.productName} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="h-5 w-5 text-white/20" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white line-clamp-1">{item.productName}</p>
                        <p className="text-xs text-white/40">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-sm font-semibold text-white shrink-0">
                        ৳{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="border-t border-white/10 pt-4 space-y-2.5 mb-5">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/50">Subtotal</span>
                    <span className="text-white">৳{totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/50">Delivery</span>
                    <span className="text-white">৳{deliveryCharge}</span>
                  </div>
                  <div className="flex justify-between font-bold text-base pt-2 border-t border-white/10">
                    <span className="text-white">Total</span>
                    <span className="text-primary text-lg">৳{(totalPrice + deliveryCharge).toLocaleString()}</span>
                  </div>
                </div>

                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 font-semibold h-11" size="lg"
                  disabled={createOrderMutation.isPending}>
                  {createOrderMutation.isPending
                    ? "Placing Order..."
                    : <><span>Place Order</span> <ArrowRight className="h-4 w-4 ml-2" /></>
                  }
                </Button>

                <div className="flex items-center justify-center gap-1.5 mt-4 text-xs text-white/30">
                  <ShieldCheck className="h-3.5 w-3.5 text-primary/60" />
                  Secure & encrypted checkout
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
}

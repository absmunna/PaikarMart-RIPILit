import React from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useCart } from "@/hooks/use-cart";
import {
  Minus, Plus, Trash2, ShoppingBag, ArrowRight,
  Tag, Truck, Shield, Package, Store
} from "lucide-react";

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, totalPrice } = useCart();
  const deliveryCharge = items.length > 0 ? 60 : 0;
  const discount = 0;
  const grandTotal = totalPrice + deliveryCharge - discount;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-1">Shopping Cart</h1>
        <p className="text-sm text-white/40 mb-8">
          {items.length} item{items.length !== 1 ? "s" : ""} in your cart
        </p>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-24 w-24 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
              <ShoppingBag className="h-12 w-12 text-primary/60" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Your cart is empty</h2>
            <p className="text-white/40 mb-8">Add items to your cart to get started</p>
            <Link href="/products">
              <Button className="bg-primary hover:bg-primary/90">Continue Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Cart Items — Left */}
            <div className="flex-1 min-w-0 space-y-3">
              {items.map(item => (
                <div key={item.productId} className="glass-card rounded-xl overflow-hidden hover:border-white/15 transition-all">
                  <div className="p-4">
                    <div className="flex gap-4">
                      {/* Image */}
                      <div className="h-24 w-24 bg-white/5 rounded-xl overflow-hidden shrink-0 border border-white/10">
                        {item.image ? (
                          <img src={item.image} alt={item.productName} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="h-8 w-8 text-white/10" />
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div className="flex justify-between gap-2">
                          <div className="min-w-0">
                            <h3 className="font-semibold text-white line-clamp-2 text-sm">{item.productName}</h3>
                            <p className="text-xs text-white/40 mt-0.5 flex items-center gap-1">
                              <Store className="h-3 w-3 text-primary/60" />
                              {item.vendorName}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="font-bold text-white">৳{(item.price * item.quantity).toLocaleString()}</div>
                            <div className="text-xs text-white/30">৳{item.price.toLocaleString()} each</div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          {/* Quantity */}
                          <div className="flex items-center gap-0.5 bg-white/5 border border-white/10 rounded-lg overflow-hidden">
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                              className="h-8 w-8 flex items-center justify-center hover:bg-white/10 transition-colors text-white/60"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="w-10 text-center text-sm font-semibold text-white">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                              className="h-8 w-8 flex items-center justify-center hover:bg-white/10 transition-colors text-white/60"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.productId)}
                            className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" /> Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Continue Shopping */}
              <Link href="/products">
                <Button variant="outline" className="border-white/15 text-white/60 hover:bg-white/5 hover:text-white w-full sm:w-auto">
                  ← Continue Shopping
                </Button>
              </Link>
            </div>

            {/* Order Summary — Right */}
            <div className="w-full lg:w-80 xl:w-96 shrink-0 space-y-4">
              {/* Promo Code */}
              <div className="glass-card rounded-xl p-4">
                <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <Tag className="h-4 w-4 text-primary" /> Promo Code
                </h3>
                <div className="flex gap-2">
                  <input
                    placeholder="Enter coupon code"
                    className="flex-1 bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary"
                  />
                  <Button size="sm" variant="outline" className="border-white/15 text-white/60 hover:bg-white/5">Apply</Button>
                </div>
              </div>

              {/* Summary */}
              <div className="glass-card rounded-xl p-5 sticky top-24">
                <h2 className="text-lg font-bold text-white mb-5">Order Summary</h2>

                <div className="space-y-3 mb-5">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/50">Subtotal ({items.length} items)</span>
                    <span className="font-medium text-white">৳{totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/50 flex items-center gap-1.5">
                      <Truck className="h-3.5 w-3.5" /> Delivery
                    </span>
                    <span className="font-medium text-white">৳{deliveryCharge}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-primary flex items-center gap-1.5">
                        <Tag className="h-3.5 w-3.5" /> Discount
                      </span>
                      <span className="font-medium text-primary">-৳{discount}</span>
                    </div>
                  )}
                </div>

                <div className="border-t border-white/10 pt-4 mb-5">
                  <div className="flex justify-between font-bold">
                    <span className="text-white">Grand Total</span>
                    <span className="text-xl text-primary">৳{grandTotal.toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-white/30 mt-1">Inclusive of all taxes</p>
                </div>

                <Link href="/checkout">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-white font-semibold h-11" size="lg">
                    Proceed to Checkout <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>

              {/* Trust badges */}
              <div className="glass-card rounded-xl p-4 space-y-3">
                {[
                  { icon: Truck, text: "Fast delivery across Bangladesh", color: "text-primary" },
                  { icon: Shield, text: "Secure & encrypted checkout", color: "text-blue-400" },
                  { icon: Tag, text: "Best price guaranteed", color: "text-purple-400" },
                ].map(({ icon: Icon, text, color }) => (
                  <div key={text} className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                      <Icon className={`h-4 w-4 ${color}`} />
                    </div>
                    <span className="text-sm text-white/50">{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

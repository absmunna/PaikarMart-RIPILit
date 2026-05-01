import React from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { useCart } from "@/hooks/use-cart";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag, Truck } from "lucide-react";

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, totalPrice } = useCart();
  const deliveryCharge = items.length > 0 ? 60 : 0;
  const discount = 0;
  const grandTotal = totalPrice + deliveryCharge - discount;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-2 text-gray-900">Shopping Cart</h1>
        <p className="text-sm text-gray-500 mb-8">{items.length} item{items.length !== 1 ? "s" : ""} in your cart</p>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <div className="h-24 w-24 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="h-12 w-12 text-green-400" />
            </div>
            <h2 className="text-xl font-semibold mb-2 text-gray-800">Your cart is empty</h2>
            <p className="text-gray-500 mb-8">Add items to your cart to get started</p>
            <Link href="/products">
              <Button className="bg-green-600 hover:bg-green-700">Continue Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-3">
              {items.map(item => (
                <Card key={item.productId} className="overflow-hidden border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="h-24 w-24 bg-gray-50 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                        {item.image ? (
                          <img src={item.image} alt={item.productName} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag className="h-8 w-8 text-gray-300" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div className="flex justify-between gap-2">
                          <div className="min-w-0">
                            <h3 className="font-semibold text-gray-800 line-clamp-2 text-sm">{item.productName}</h3>
                            <p className="text-xs text-gray-500 mt-0.5">Sold by: <span className="text-green-600">{item.vendorName}</span></p>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="font-bold text-gray-900">৳{(item.price * item.quantity).toLocaleString()}</div>
                            <div className="text-xs text-gray-500">৳{item.price.toLocaleString()} each</div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-1 border border-gray-200 rounded-lg overflow-hidden">
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                              className="h-8 w-8 flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-600"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="w-10 text-center text-sm font-semibold text-gray-800">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                              className="h-8 w-8 flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-600"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.productId)}
                            className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" /> Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="space-y-4">
              <Card className="border-gray-100 shadow-sm sticky top-28">
                <CardContent className="p-6">
                  <h2 className="text-lg font-bold mb-5 text-gray-900">Order Summary</h2>
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal ({items.length} items)</span>
                      <span className="font-medium">৳{totalPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 flex items-center gap-1"><Truck className="h-3.5 w-3.5" /> Delivery</span>
                      <span className="font-medium">৳{deliveryCharge}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-green-600 flex items-center gap-1"><Tag className="h-3.5 w-3.5" /> Discount</span>
                        <span className="font-medium text-green-600">-৳{discount}</span>
                      </div>
                    )}
                  </div>
                  <div className="border-t pt-4 mb-6">
                    <div className="flex justify-between font-bold text-base">
                      <span className="text-gray-900">Grand Total</span>
                      <span className="text-green-700 text-lg">৳{grandTotal.toLocaleString()}</span>
                    </div>
                  </div>
                  <Link href="/checkout">
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold" size="lg">
                      Proceed to Checkout <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                  <Link href="/products">
                    <Button variant="outline" className="w-full mt-3" size="sm">Continue Shopping</Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Trust badges */}
              <Card className="border-gray-100 shadow-sm">
                <CardContent className="p-4">
                  <div className="space-y-2.5 text-sm text-gray-600">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                        <Truck className="h-4 w-4 text-green-600" />
                      </div>
                      <span>Fast delivery across Bangladesh</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                        <Tag className="h-4 w-4 text-blue-600" />
                      </div>
                      <span>Secure & encrypted checkout</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

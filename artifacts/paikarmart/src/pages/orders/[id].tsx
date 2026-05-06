import React from "react";
import { Layout } from "@/components/layout/Layout";
import { useGetOrder } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading } = useGetOrder(id || "", { query: { enabled: !!id } });

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-1/3 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              <Skeleton className="h-48 w-full rounded-xl" />
              <Skeleton className="h-64 w-full rounded-xl" />
            </div>
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!order) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Order not found</h1>
          <Link href="/orders">
            <Button>Back to Orders</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Order Details</h1>
            <p className="text-muted-foreground mt-1">Order #{order.id}</p>
          </div>
          <Badge variant={order.status === "completed" ? "default" : "secondary"} className="w-fit text-lg py-1 px-4">
            {order.status}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            {/* Tracking Timeline */}
            <div className="p-6 border rounded-xl bg-card">
              <h2 className="text-xl font-bold mb-6">Tracking</h2>
              <div className="relative border-l-2 border-primary/20 ml-3 space-y-8">
                <div className="relative">
                  <div className="absolute -left-[21px] top-1 h-4 w-4 rounded-full bg-primary ring-4 ring-background" />
                  <div className="pl-6">
                    <div className="font-semibold text-primary">Order Placed</div>
                    <div className="text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleString()}</div>
                  </div>
                </div>
                {order.status !== "pending" && (
                  <div className="relative">
                    <div className="absolute -left-[21px] top-1 h-4 w-4 rounded-full bg-primary ring-4 ring-background" />
                    <div className="pl-6">
                      <div className="font-semibold text-primary">Confirmed</div>
                    </div>
                  </div>
                )}
                {["shipped", "completed"].includes(order.status) && (
                  <div className="relative">
                    <div className="absolute -left-[21px] top-1 h-4 w-4 rounded-full bg-primary ring-4 ring-background" />
                    <div className="pl-6">
                      <div className="font-semibold text-primary">Shipped</div>
                      {order.trackingCode && <div className="text-sm text-muted-foreground mt-1">Tracking Code: {order.trackingCode}</div>}
                    </div>
                  </div>
                )}
                {order.status === "completed" && (
                  <div className="relative">
                    <div className="absolute -left-[21px] top-1 h-4 w-4 rounded-full bg-primary ring-4 ring-background" />
                    <div className="pl-6">
                      <div className="font-semibold text-primary">Delivered</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Items */}
            <div className="p-6 border rounded-xl bg-card">
              <h2 className="text-xl font-bold mb-4">Items</h2>
              <div className="space-y-4">
                {order.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center py-2 border-b last:border-0">
                    <div>
                      <div className="font-medium">{item.productName}</div>
                      <div className="text-sm text-muted-foreground">Qty: {item.quantity} × ৳{item.price.toLocaleString()}</div>
                      {item.vendorName && <div className="text-xs text-muted-foreground mt-1">Vendor: {item.vendorName}</div>}
                    </div>
                    <div className="font-bold">৳{item.subtotal.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* Summary */}
            <div className="p-6 border rounded-xl bg-card">
              <h2 className="text-xl font-bold mb-4">Summary</h2>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>৳{(order.totalAmount - (order.deliveryCharge || 0)).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivery</span>
                  <span>৳{(order.deliveryCharge || 0).toLocaleString()}</span>
                </div>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>৳{order.totalAmount.toLocaleString()}</span>
                </div>
                <div className="text-sm text-muted-foreground mt-2 text-right">
                  Paid via {order.paymentMethod}
                </div>
              </div>
            </div>

            {/* Shipping Info */}
            <div className="p-6 border rounded-xl bg-card">
              <h2 className="text-xl font-bold mb-4">Shipping Info</h2>
              <div className="space-y-3 text-sm">
                <div>
                  <div className="text-muted-foreground">Name</div>
                  <div className="font-medium">{order.customerName || "N/A"}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Phone</div>
                  <div className="font-medium">{order.customerPhone || "N/A"}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Address</div>
                  <div className="font-medium">{order.customerAddress || "N/A"}</div>
                  {order.area && order.district && (
                    <div className="font-medium">{order.area}, {order.district}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

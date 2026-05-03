import React from "react";
import { Layout } from "@/components/layout/Layout";
import { useListOrders } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";

export default function OrdersPage() {
  const { user } = useAuth();
  const { data: ordersData, isLoading } = useListOrders({ user_id: user?.id });
  const orders = ordersData?.orders || [];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>
        
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 w-full rounded-xl" />)}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl text-muted-foreground">No orders found</h2>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order: any) => (
              <Link key={order.id} href={`/orders/${order.id}`}>
                <div className="p-6 border rounded-xl hover:shadow-md transition-all cursor-pointer bg-card">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Order ID: {order.id}</div>
                      <div className="text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</div>
                    </div>
                    <Badge variant={order.status === "completed" ? "default" : "secondary"}>
                      {order.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="space-y-1">
                      {order.items.map((item: any, i: number) => (
                        <div key={i} className="text-sm font-medium">
                          {item.quantity}x {item.productName}
                        </div>
                      ))}
                    </div>
                    <div className="font-bold text-lg">৳{order.totalAmount.toLocaleString()}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

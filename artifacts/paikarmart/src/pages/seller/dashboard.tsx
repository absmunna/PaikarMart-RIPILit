import React from "react";
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { useGetSellerDashboard } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Package, ShoppingBag, DollarSign, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SellerDashboardPage() {
  const { user } = useAuth();
  
  if (user?.role !== "seller") {
    return <Redirect to="/login" />;
  }

  const { data: dashboard, isLoading } = useGetSellerDashboard(user?.id || "seller-1");

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-48 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 w-full rounded-xl" />)}
          </div>
          <Skeleton className="h-96 w-full rounded-xl" />
        </div>
      </Layout>
    );
  }

  const stats = [
    { title: "Total Sales", value: `৳${dashboard?.totalSales.toLocaleString() || 0}`, icon: DollarSign, color: "text-green-500" },
    { title: "Total Orders", value: dashboard?.totalOrders || 0, icon: ShoppingBag, color: "text-blue-500" },
    { title: "Active Products", value: dashboard?.totalProducts || 0, icon: Package, color: "text-purple-500" },
    { title: "Pending Orders", value: dashboard?.pendingOrders || 0, icon: Activity, color: "text-orange-500" },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl font-bold">Seller Dashboard</h1>
          <Button>+ Add New Product</Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, i) => (
            <Card key={i}>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">{stat.title}</p>
                  <h3 className="text-2xl font-bold">{stat.value}</h3>
                </div>
                <div className={`h-12 w-12 rounded-full bg-muted flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                {dashboard?.recentOrders?.length ? (
                  <div className="space-y-4">
                    {dashboard.recentOrders.map(order => (
                      <div key={order.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                        <div>
                          <div className="font-medium">Order #{order.id}</div>
                          <div className="text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">৳{order.totalAmount.toLocaleString()}</div>
                          <div className="text-sm capitalize text-primary">{order.status}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">No recent orders found.</div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Inventory Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">In Stock</span>
                    <span className="font-bold">{dashboard?.inStock || 0} items</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Out of Stock</span>
                    <span className="font-bold text-destructive">{dashboard?.outOfStock || 0} items</span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t">
                    <span className="font-medium">Estimated Profit</span>
                    <span className="font-bold text-primary">৳{dashboard?.estimatedProfit?.toLocaleString() || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}

import React, { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { useGetAdminDashboard } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Store, ShoppingBag, DollarSign, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AdminDashboardPage() {
  const { user } = useAuth();
  
  if (user?.role !== "admin") {
    return <Redirect to="/login" />;
  }

  const { data: dashboard, isLoading } = useGetAdminDashboard();

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-48 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 w-full rounded-xl" />)}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Skeleton className="h-96 w-full rounded-xl" />
            <Skeleton className="h-96 w-full rounded-xl" />
          </div>
        </div>
      </Layout>
    );
  }

  const stats = [
    { title: "Total Users", value: dashboard?.totalUsers || 0, icon: Users, color: "text-blue-500" },
    { title: "Total Sellers", value: dashboard?.totalSellers || 0, icon: Store, color: "text-purple-500" },
    { title: "Total Orders", value: dashboard?.totalOrders || 0, icon: ShoppingBag, color: "text-orange-500" },
    { title: "Platform Profit", value: `৳${dashboard?.platformProfit.toLocaleString() || 0}`, icon: DollarSign, color: "text-green-500" },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Recent Seller Applications</CardTitle>
            </CardHeader>
            <CardContent>
              {dashboard?.recentSellers?.length ? (
                <div className="space-y-4">
                  {dashboard.recentSellers.map(seller => (
                    <div key={seller.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                      <div>
                        <div className="font-medium">{seller.shopName}</div>
                        <div className="text-sm text-muted-foreground">{seller.businessType.replace('_', ' ')}</div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="text-green-600 hover:text-green-700 hover:bg-green-50"><CheckCircle className="h-4 w-4 mr-1" /> Approve</Button>
                        <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50"><XCircle className="h-4 w-4 mr-1" /> Reject</Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">No recent applications.</div>
              )}
            </CardContent>
          </Card>
          
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
                        <Badge variant={order.status === "completed" ? "default" : "secondary"} className="mt-1">
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">No recent orders.</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}

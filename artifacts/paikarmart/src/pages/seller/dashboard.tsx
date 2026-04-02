import React, { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/hooks/use-auth";
import { Redirect, Link } from "wouter";
import { useGetSellerDashboard, useListProducts } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Package, ShoppingBag, DollarSign, Activity, LayoutDashboard,
  Plus, Settings, Users, TrendingUp, Bell, LogOut, ChevronRight,
  Truck, CheckCircle, Clock, XCircle, Store, Star,
  BarChart2, Tag, Building2, Upload, Search
} from "lucide-react";

type Tab = "overview" | "orders" | "products" | "b2b" | "analytics" | "settings";

const STATUS_CONFIG = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-700", icon: Clock },
  confirmed: { label: "Confirmed", color: "bg-blue-100 text-blue-700", icon: CheckCircle },
  processing: { label: "Processing", color: "bg-purple-100 text-purple-700", icon: Clock },
  shipped: { label: "Shipped", color: "bg-cyan-100 text-cyan-700", icon: Truck },
  completed: { label: "Delivered", color: "bg-green-100 text-green-700", icon: CheckCircle },
  incomplete: { label: "Incomplete", color: "bg-red-100 text-red-700", icon: XCircle },
};

export default function SellerDashboardPage() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [searchProduct, setSearchProduct] = useState("");

  if (user?.role !== "seller") {
    return <Redirect to="/login" />;
  }

  const { data: dashboard, isLoading } = useGetSellerDashboard(user?.id || "seller-1");
  const { data: productsData } = useListProducts({ vendor_id: user?.id });
  const products = (productsData?.products || []).filter(p =>
    !searchProduct || p.name.toLowerCase().includes(searchProduct.toLowerCase())
  );

  const stats = [
    { title: "Total Sales", value: `৳${(dashboard?.totalSales || 0).toLocaleString()}`, icon: DollarSign, color: "bg-green-50 text-green-600", change: "+12%" },
    { title: "Total Orders", value: dashboard?.totalOrders || 0, icon: ShoppingBag, color: "bg-blue-50 text-blue-600", change: "+8%" },
    { title: "Active Products", value: dashboard?.totalProducts || 0, icon: Package, color: "bg-purple-50 text-purple-600", change: "stable" },
    { title: "Pending Orders", value: dashboard?.pendingOrders || 0, icon: Activity, color: "bg-orange-50 text-orange-600", change: "-3%" },
  ];

  const sidebarItems: { key: Tab; label: string; icon: React.ElementType; badge?: string }[] = [
    { key: "overview", label: "Overview", icon: LayoutDashboard },
    { key: "orders", label: "Orders", icon: ShoppingBag, badge: dashboard?.pendingOrders ? String(dashboard.pendingOrders) : undefined },
    { key: "products", label: "Products", icon: Package },
    { key: "b2b", label: "B2B Requests", icon: Building2, badge: "New" },
    { key: "analytics", label: "Analytics", icon: BarChart2 },
    { key: "settings", label: "Settings", icon: Settings },
  ];

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-48 mb-8" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-28 w-full rounded-xl" />)}
          </div>
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="w-full lg:w-60 shrink-0">
            <div className="bg-gradient-to-br from-green-700 to-emerald-600 text-white rounded-2xl p-5 mb-4 shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-12 w-12 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center">
                  <Store className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-bold text-sm">{user.name}</p>
                  <Badge className="bg-white/20 text-white border-0 text-[10px] mt-0.5">Seller Account</Badge>
                </div>
              </div>
              <div className="flex gap-2 mt-2">
                <Link href="/seller/register">
                  <Button size="sm" className="h-7 text-[11px] bg-white/20 hover:bg-white/30 text-white border-white/30 border">
                    <Plus className="h-3 w-3 mr-1" /> Add Product
                  </Button>
                </Link>
              </div>
            </div>
            <Card className="border-gray-100 shadow-sm overflow-hidden">
              <CardContent className="p-2">
                {sidebarItems.map(item => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.key;
                  return (
                    <button key={item.key} onClick={() => setActiveTab(item.key)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all mb-0.5 ${
                        isActive ? "bg-green-600 text-white" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}>
                      <div className="flex items-center gap-2.5">
                        <Icon className="h-4 w-4 shrink-0" />
                        {item.label}
                      </div>
                      {item.badge && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                          isActive ? "bg-white/20 text-white" : item.badge === "New" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                        }`}>{item.badge}</span>
                      )}
                    </button>
                  );
                })}
                <div className="border-t border-gray-100 mt-1 pt-1">
                  <button onClick={logout} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all">
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Main */}
          <div className="flex-1 min-w-0">
            {/* Overview */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h1 className="text-xl font-bold text-gray-900">Seller Dashboard</h1>
                  <Button className="bg-green-600 hover:bg-green-700 h-9 text-sm" onClick={() => toast.info("Add product form coming soon")}>
                    <Plus className="h-4 w-4 mr-1" /> Add Product
                  </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {stats.map((s) => {
                    const Icon = s.icon;
                    return (
                      <Card key={s.title} className="border-gray-100 shadow-sm">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className={`h-9 w-9 rounded-xl ${s.color} flex items-center justify-center`}>
                              <Icon className="h-4.5 w-4.5" />
                            </div>
                            <span className={`text-[11px] font-semibold ${
                              s.change.startsWith("+") ? "text-green-600" : s.change.startsWith("-") ? "text-red-500" : "text-gray-400"
                            }`}>{s.change}</span>
                          </div>
                          <p className="text-xl font-bold text-gray-900">{s.value}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{s.title}</p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Recent Orders */}
                  <div className="lg:col-span-2">
                    <Card className="border-gray-100 shadow-sm">
                      <CardHeader className="pb-3 pt-5 px-5">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">Recent Orders</CardTitle>
                          <Button variant="ghost" size="sm" className="text-green-600 text-xs" onClick={() => setActiveTab("orders")}>View All</Button>
                        </div>
                      </CardHeader>
                      <CardContent className="px-5 pb-5">
                        {dashboard?.recentOrders?.length ? (
                          <div className="space-y-3">
                            {dashboard.recentOrders.map(order => {
                              const s = STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.pending;
                              const Icon = s.icon;
                              return (
                                <div key={order.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                                  <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center border border-gray-200">
                                      <ShoppingBag className="h-3.5 w-3.5 text-green-600" />
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-gray-800">#{order.id}</p>
                                      <p className="text-[11px] text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <span className="font-bold text-gray-900 text-sm">৳{order.totalAmount.toLocaleString()}</span>
                                    <span className={`text-[10px] px-2 py-1 rounded-full font-medium flex items-center gap-1 ${s.color}`}>
                                      <Icon className="h-3 w-3" /> {s.label}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <ShoppingBag className="h-12 w-12 text-gray-200 mx-auto mb-3" />
                            <p className="text-gray-500 text-sm">No recent orders found</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Inventory Summary */}
                  <div className="space-y-4">
                    <Card className="border-gray-100 shadow-sm">
                      <CardHeader className="pb-3 pt-5 px-5">
                        <CardTitle className="text-base">Inventory</CardTitle>
                      </CardHeader>
                      <CardContent className="px-5 pb-5 space-y-3">
                        {[
                          { label: "In Stock", value: dashboard?.inStock || 0, color: "text-green-600" },
                          { label: "Out of Stock", value: dashboard?.outOfStock || 0, color: "text-red-500" },
                        ].map(item => (
                          <div key={item.label} className="flex justify-between items-center p-3 rounded-xl bg-gray-50">
                            <span className="text-sm text-gray-600">{item.label}</span>
                            <span className={`font-bold ${item.color}`}>{item.value}</span>
                          </div>
                        ))}
                        <div className="flex justify-between items-center p-3 rounded-xl bg-green-50 mt-2">
                          <span className="text-sm font-medium text-green-800">Est. Profit</span>
                          <span className="font-bold text-green-700">৳{(dashboard?.estimatedProfit || 0).toLocaleString()}</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-gray-100 shadow-sm">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                          <span className="text-sm font-semibold text-gray-800">Seller Rating</span>
                        </div>
                        <p className="text-3xl font-extrabold text-gray-900">4.7</p>
                        <p className="text-xs text-gray-500">Based on 128 reviews</p>
                        <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-yellow-400 rounded-full" style={{ width: "94%" }} />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === "orders" && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-5">Manage Orders</h2>
                {dashboard?.recentOrders?.length ? (
                  <div className="space-y-3">
                    {dashboard.recentOrders.map(order => {
                      const s = STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.pending;
                      const Icon = s.icon;
                      return (
                        <Card key={order.id} className="border-gray-100 shadow-sm">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-bold text-gray-900">Order #{order.id}</p>
                                <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString("en-BD", { day: "numeric", month: "short", year: "numeric" })}</p>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="font-bold text-green-700">৳{order.totalAmount.toLocaleString()}</span>
                                <span className={`text-xs px-2.5 py-1 rounded-full font-semibold flex items-center gap-1 ${s.color}`}>
                                  <Icon className="h-3 w-3" /> {s.label}
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <Card className="border-gray-100 shadow-sm">
                    <CardContent className="py-16 text-center">
                      <ShoppingBag className="h-16 w-16 text-gray-200 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-700">No orders yet</h3>
                      <p className="text-gray-500 text-sm">Orders from buyers will appear here</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Products Tab */}
            {activeTab === "products" && (
              <div>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-xl font-bold text-gray-900">My Products</h2>
                  <Button className="bg-green-600 hover:bg-green-700 h-9 text-sm" onClick={() => toast.info("Product creation form coming soon!")}>
                    <Plus className="h-4 w-4 mr-1" /> Add Product
                  </Button>
                </div>
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input placeholder="Search products..." value={searchProduct} onChange={e => setSearchProduct(e.target.value)} className="pl-9 border-gray-200" />
                </div>
                {products.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {products.slice(0, 12).map(p => (
                      <Card key={p.id} className="border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-4 flex gap-3">
                          <div className="h-16 w-16 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                            {p.images?.[0] ? <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" /> : <Package className="h-8 w-8 text-gray-300 m-auto mt-4" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm text-gray-800 line-clamp-1">{p.name}</p>
                            <p className="text-xs text-gray-500 mb-1">{p.category}</p>
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-green-700 text-sm">৳{p.price?.toLocaleString()}</span>
                              <Badge className={p.inStock ? "bg-green-50 text-green-700 border-green-100" : "bg-red-50 text-red-700 border-red-100"}>
                                {p.inStock ? "In Stock" : "Out"}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="border-gray-100 shadow-sm">
                    <CardContent className="py-16 text-center">
                      <Package className="h-16 w-16 text-gray-200 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-700">No products yet</h3>
                      <p className="text-gray-500 text-sm mb-5">Add your first product to start selling</p>
                      <Button className="bg-green-600 hover:bg-green-700" onClick={() => toast.info("Coming soon!")}>
                        <Plus className="h-4 w-4 mr-2" /> Add Your First Product
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* B2B Tab */}
            {activeTab === "b2b" && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">B2B Marketplace</h2>
                <p className="text-gray-500 text-sm mb-6">Manage bulk orders and business-to-business inquiries</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {[
                    { label: "B2B Inquiries", value: 0, icon: Building2, color: "bg-blue-50 text-blue-600" },
                    { label: "Active B2B Orders", value: 0, icon: ShoppingBag, color: "bg-green-50 text-green-600" },
                    { label: "B2B Revenue", value: "৳0", icon: DollarSign, color: "bg-purple-50 text-purple-600" },
                  ].map(s => {
                    const Icon = s.icon;
                    return (
                      <Card key={s.label} className="border-gray-100 shadow-sm">
                        <CardContent className="p-4 flex items-center gap-3">
                          <div className={`h-10 w-10 rounded-xl ${s.color} flex items-center justify-center shrink-0`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-xl font-bold text-gray-900">{s.value}</p>
                            <p className="text-xs text-gray-500">{s.label}</p>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                <Card className="border-gray-100 shadow-sm mb-4">
                  <CardHeader className="pb-3 pt-5 px-5">
                    <CardTitle className="text-base">B2B Configuration</CardTitle>
                  </CardHeader>
                  <CardContent className="px-5 pb-5 space-y-4">
                    {[
                      { label: "Minimum Order Quantity (MOQ)", desc: "Set the minimum units for bulk orders", value: "10 units" },
                      { label: "Wholesale Price Tier", desc: "Discount for B2B buyers vs retail", value: "15% off" },
                      { label: "B2B Payment Terms", desc: "Net payment terms for businesses", value: "Net 30 days" },
                    ].map(c => (
                      <div key={c.label} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{c.label}</p>
                          <p className="text-xs text-gray-500">{c.desc}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-green-700">{c.value}</span>
                          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-green-600 h-7" onClick={() => toast.info("Edit feature coming soon")}>Edit</Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="border-green-100 bg-green-50 shadow-sm">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-xl bg-green-600 flex items-center justify-center shrink-0">
                        <TrendingUp className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-green-900 mb-1">Enable B2B Supplier Listing</p>
                        <p className="text-sm text-green-700 mb-3">Get listed in the PaikarMart B2B Wholesale Hub. Access bulk buyers and businesses across Bangladesh.</p>
                        <Button className="bg-green-600 hover:bg-green-700 h-9 text-sm" onClick={() => toast.success("B2B listing application submitted!")}>
                          Apply for B2B Supplier Status
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === "analytics" && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-5">Analytics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Card className="border-gray-100 shadow-sm">
                    <CardHeader className="pb-2 pt-5 px-5">
                      <CardTitle className="text-base flex items-center gap-2">
                        <BarChart2 className="h-4 w-4 text-green-600" /> Revenue Chart
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-5 pb-5">
                      <div className="h-40 flex items-end gap-1">
                        {[30, 55, 40, 75, 60, 90, 45, 80, 65, 95, 70, 85].map((v, i) => (
                          <div key={i} className="flex-1 bg-green-100 rounded-t-sm hover:bg-green-400 transition-colors cursor-pointer" style={{ height: `${v}%` }} />
                        ))}
                      </div>
                      <div className="flex justify-between text-[9px] text-gray-400 mt-1">
                        {["J","F","M","A","M","J","J","A","S","O","N","D"].map(m => <span key={m}>{m}</span>)}
                      </div>
                      <p className="text-xs text-center text-gray-400 mt-3">Real-time analytics • Coming Soon</p>
                    </CardContent>
                  </Card>
                  <Card className="border-gray-100 shadow-sm">
                    <CardHeader className="pb-2 pt-5 px-5">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Tag className="h-4 w-4 text-green-600" /> Top Categories
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-5 pb-5">
                      <div className="space-y-3">
                        {[
                          { name: "Electronics", pct: 40 },
                          { name: "Fashion", pct: 25 },
                          { name: "Grocery", pct: 20 },
                          { name: "Other", pct: 15 },
                        ].map(c => (
                          <div key={c.name}>
                            <div className="flex justify-between text-xs text-gray-600 mb-1">
                              <span>{c.name}</span>
                              <span className="font-bold">{c.pct}%</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-full bg-green-500 rounded-full" style={{ width: `${c.pct}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-5">Seller Settings</h2>
                <div className="space-y-4">
                  {[
                    { title: "Shop Information", desc: "Update your shop name, logo, and description", icon: Store },
                    { title: "Payment Settings", desc: "Configure your bank account or mobile banking", icon: DollarSign },
                    { title: "Delivery Zones", desc: "Set your delivery area and shipping rates", icon: Truck },
                    { title: "Notifications", desc: "Manage order and payment notification preferences", icon: Bell },
                  ].map(s => {
                    const Icon = s.icon;
                    return (
                      <Card key={s.title} className="border-gray-100 shadow-sm cursor-pointer hover:shadow-md transition-shadow" onClick={() => toast.info(`${s.title} settings coming soon!`)}>
                        <CardContent className="p-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-green-50 flex items-center justify-center">
                              <Icon className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800 text-sm">{s.title}</p>
                              <p className="text-xs text-gray-500">{s.desc}</p>
                            </div>
                          </div>
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

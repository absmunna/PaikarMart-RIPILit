import React, { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/hooks/use-auth";
import { Redirect, Link } from "wouter";
import { useListOrders } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  User, Package, Heart, Star, Wallet, Settings, LogOut,
  LayoutDashboard, ChevronRight, MapPin, Phone, Mail,
  Edit2, CheckCircle, Clock, Truck, XCircle, Lock, Bell
} from "lucide-react";

type Tab = "dashboard" | "orders" | "wishlist" | "reviews" | "wallet" | "settings";

const STATUS_CONFIG = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-700", icon: Clock },
  confirmed: { label: "Confirmed", color: "bg-blue-100 text-blue-700", icon: CheckCircle },
  processing: { label: "Processing", color: "bg-purple-100 text-purple-700", icon: Clock },
  shipped: { label: "Shipped", color: "bg-cyan-100 text-cyan-700", icon: Truck },
  completed: { label: "Delivered", color: "bg-green-100 text-green-700", icon: CheckCircle },
  incomplete: { label: "Incomplete", color: "bg-red-100 text-red-700", icon: XCircle },
};

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "+8801234567890");
  const [emailVal, setEmailVal] = useState(user?.email || "");

  const { data: ordersData } = useListOrders({ user_id: user?.id || "user-1" });
  const orders = ordersData?.orders || [];

  if (!user || user.id === "guest") {
    return <Redirect to="/login" />;
  }

  const sidebarItems: { key: Tab; label: string; icon: React.ElementType; badge?: string }[] = [
    { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { key: "orders", label: "My Orders", icon: Package, badge: orders.length ? String(orders.length) : undefined },
    { key: "wishlist", label: "Wishlist", icon: Heart },
    { key: "reviews", label: "My Reviews", icon: Star },
    { key: "wallet", label: "Wallet", icon: Wallet, badge: "Soon" },
    { key: "settings", label: "Settings", icon: Settings },
  ];

  const handleSaveProfile = () => {
    setEditMode(false);
    toast.success("Profile updated successfully!");
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 shrink-0">
            {/* User Card */}
            <div className="bg-gradient-to-br from-green-700 to-emerald-600 text-white rounded-2xl p-5 mb-4 shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-14 w-14 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center text-2xl font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-base">{user.name}</p>
                  <Badge className="bg-white/20 text-white border-0 text-[10px] capitalize mt-0.5">{user.role}</Badge>
                </div>
              </div>
              <div className="text-xs text-white/70 flex items-center gap-1.5">
                <MapPin className="h-3 w-3" /> Dhaka, Bangladesh
              </div>
            </div>

            {/* Nav Items */}
            <Card className="border-gray-100 shadow-sm overflow-hidden">
              <CardContent className="p-2">
                {sidebarItems.map(item => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.key;
                  const isComingSoon = item.key === "wallet";
                  return (
                    <button key={item.key} onClick={() => setActiveTab(item.key)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all mb-0.5 ${
                        isActive ? "bg-green-600 text-white" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}>
                      <div className="flex items-center gap-2.5">
                        <Icon className="h-4 w-4 shrink-0" />
                        {item.label}
                      </div>
                      <div className="flex items-center gap-1.5">
                        {item.badge && (
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                            isActive ? "bg-white/20 text-white" : item.badge === "Soon" ? "bg-orange-100 text-orange-600" : "bg-green-100 text-green-700"
                          }`}>{item.badge}</span>
                        )}
                        {!item.badge && <ChevronRight className={`h-3.5 w-3.5 ${isActive ? "text-white/60" : "text-gray-300"}`} />}
                      </div>
                    </button>
                  );
                })}
                <div className="border-t border-gray-100 mt-1 pt-1">
                  <button onClick={() => { logout(); }} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all">
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Dashboard */}
            {activeTab === "dashboard" && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-gray-900">My Account Dashboard</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Total Orders", value: orders.length, icon: Package, color: "bg-blue-50 text-blue-600" },
                    { label: "Delivered", value: orders.filter((o: any) => o.status === "completed").length, icon: CheckCircle, color: "bg-green-50 text-green-600" },
                    { label: "Pending", value: orders.filter((o: any) => o.status === "pending").length, icon: Clock, color: "bg-yellow-50 text-yellow-600" },
                    { label: "Wishlist", value: 0, icon: Heart, color: "bg-pink-50 text-pink-600" },
                  ].map(s => {
                    const Icon = s.icon;
                    return (
                      <Card key={s.label} className="border-gray-100 shadow-sm">
                        <CardContent className="p-4 flex items-center gap-3">
                          <div className={`h-10 w-10 rounded-xl ${s.color} flex items-center justify-center shrink-0`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                            <p className="text-xs text-gray-500">{s.label}</p>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* Profile Preview Card */}
                <Card className="border-gray-100 shadow-sm">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-800">Personal Information</h3>
                      <Button variant="outline" size="sm" onClick={() => setActiveTab("settings")} className="text-green-600 border-green-200 hover:bg-green-50">
                        <Edit2 className="h-3.5 w-3.5 mr-1" /> Edit
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      {[
                        { icon: User, label: "Full Name", value: user.name },
                        { icon: Phone, label: "Phone", value: "+8801234567890" },
                        { icon: Mail, label: "Email", value: user.email || "Not added" },
                        { icon: MapPin, label: "Location", value: "Dhaka, Bangladesh" },
                      ].map(f => {
                        const Icon = f.icon;
                        return (
                          <div key={f.label} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                            <Icon className="h-4 w-4 text-green-600 shrink-0" />
                            <div>
                              <p className="text-[10px] text-gray-500 uppercase tracking-wide">{f.label}</p>
                              <p className="font-medium text-gray-800">{f.value}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Orders */}
                {orders.length > 0 && (
                  <Card className="border-gray-100 shadow-sm">
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-800">Recent Orders</h3>
                        <Button variant="ghost" size="sm" onClick={() => setActiveTab("orders")} className="text-green-600 text-xs">View All</Button>
                      </div>
                      <div className="space-y-3">
                        {orders.slice(0, 3).map((order: any) => {
                          const s = STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.pending;
                          const Icon = s.icon;
                          return (
                            <Link href={`/orders/${order.id}`} key={order.id}>
                              <div className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                                <div className="flex items-center gap-3">
                                  <div className="h-9 w-9 rounded-lg bg-green-50 flex items-center justify-center">
                                    <Package className="h-4 w-4 text-green-600" />
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-800">#{order.id}</p>
                                    <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-gray-800 text-sm">৳{order.totalAmount.toLocaleString()}</span>
                                  <span className={`text-[10px] px-2 py-1 rounded-full font-medium flex items-center gap-1 ${s.color}`}>
                                    <Icon className="h-3 w-3" /> {s.label}
                                  </span>
                                </div>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === "orders" && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-5">My Orders</h2>
                {orders.length === 0 ? (
                  <Card className="border-gray-100 shadow-sm">
                    <CardContent className="py-16 text-center">
                      <Package className="h-16 w-16 text-gray-200 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">No orders yet</h3>
                      <p className="text-gray-500 text-sm mb-6">Browse products and place your first order</p>
                      <Link href="/products"><Button className="bg-green-600 hover:bg-green-700">Shop Now</Button></Link>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order: any) => {
                      const s = STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.pending;
                      const Icon = s.icon;
                      return (
                        <Link href={`/orders/${order.id}`} key={order.id}>
                          <Card className="border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                            <CardContent className="p-5">
                              <div className="flex items-center justify-between mb-3">
                                <div>
                                  <p className="font-bold text-gray-900">Order #{order.id}</p>
                                  <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString("en-BD", { day: "numeric", month: "short", year: "numeric" })}</p>
                                </div>
                                <span className={`text-xs px-3 py-1.5 rounded-full font-semibold flex items-center gap-1.5 ${s.color}`}>
                                  <Icon className="h-3.5 w-3.5" /> {s.label}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-600">{(order.items as any[]).length} item(s)</p>
                                <p className="font-bold text-green-700">৳{order.totalAmount.toLocaleString()}</p>
                              </div>
                              {order.trackingCode && (
                                <div className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                                  <Truck className="h-3 w-3 text-green-600" /> Tracking: {order.trackingCode}
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Wishlist */}
            {activeTab === "wishlist" && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-5">My Wishlist</h2>
                <Card className="border-gray-100 shadow-sm">
                  <CardContent className="py-16 text-center">
                    <Heart className="h-16 w-16 text-gray-200 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Your wishlist is empty</h3>
                    <p className="text-gray-500 text-sm mb-6">Save products you love for later</p>
                    <Link href="/products"><Button className="bg-green-600 hover:bg-green-700">Browse Products</Button></Link>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Reviews */}
            {activeTab === "reviews" && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-5">My Reviews</h2>
                <Card className="border-gray-100 shadow-sm">
                  <CardContent className="py-16 text-center">
                    <Star className="h-16 w-16 text-gray-200 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No reviews yet</h3>
                    <p className="text-gray-500 text-sm">Purchase and receive products to leave reviews</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Wallet Tab */}
            {activeTab === "wallet" && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-5">My Wallet</h2>
                <Card className="border-gray-100 shadow-sm">
                  <CardContent className="py-12 text-center">
                    <div className="h-20 w-20 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center mx-auto mb-4">
                      <Wallet className="h-10 w-10 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Wallet System</h3>
                    <Badge className="bg-orange-100 text-orange-600 border-orange-200 mb-4">Coming Soon</Badge>
                    <p className="text-gray-500 text-sm max-w-sm mx-auto mb-6">Earn rewards on every purchase. Track your balance, rewards, and investment value.</p>
                    <Link href="/wallet"><Button variant="outline" className="border-green-200 text-green-700 hover:bg-green-50">View Wallet Page</Button></Link>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Settings */}
            {activeTab === "settings" && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-5">Account Settings</h2>
                <div className="space-y-5">
                  <Card className="border-gray-100 shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-5">
                        <h3 className="font-semibold text-gray-800">Personal Information</h3>
                        <Button variant="outline" size="sm" onClick={() => setEditMode(v => !v)} className="text-green-600 border-green-200 hover:bg-green-50">
                          {editMode ? "Cancel" : <><Edit2 className="h-3.5 w-3.5 mr-1" /> Edit</>}
                        </Button>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-700 mb-1.5 block">Full Name</Label>
                          <Input value={name} onChange={e => setName(e.target.value)} disabled={!editMode} className={editMode ? "border-green-300 focus:border-green-500" : "bg-gray-50"} />
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-700 mb-1.5 block">Phone Number</Label>
                          <Input value={phone} onChange={e => setPhone(e.target.value)} disabled={!editMode} className={editMode ? "border-green-300 focus:border-green-500" : "bg-gray-50"} />
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-700 mb-1.5 block">Email Address</Label>
                          <Input type="email" value={emailVal} onChange={e => setEmailVal(e.target.value)} disabled={!editMode} placeholder="Add your email" className={editMode ? "border-green-300 focus:border-green-500" : "bg-gray-50"} />
                        </div>
                        {editMode && (
                          <Button onClick={handleSaveProfile} className="w-full bg-green-600 hover:bg-green-700 mt-2">Save Changes</Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-gray-100 shadow-sm">
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2"><Bell className="h-4 w-4 text-green-600" /> Notifications</h3>
                      <div className="space-y-3">
                        {[
                          { label: "Order Updates", desc: "Get notified about your order status" },
                          { label: "Promotional Offers", desc: "Receive deals and discount alerts" },
                          { label: "Account Alerts", desc: "Security and account notifications" },
                        ].map(n => (
                          <div key={n.label} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                            <div>
                              <p className="text-sm font-medium text-gray-700">{n.label}</p>
                              <p className="text-xs text-gray-500">{n.desc}</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" defaultChecked className="sr-only peer" />
                              <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5 peer-checked:bg-green-600 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all" />
                            </label>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-gray-100 shadow-sm">
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2"><Lock className="h-4 w-4 text-green-600" /> Security</h3>
                      <Button variant="outline" className="w-full border-gray-200 text-gray-600 hover:bg-gray-50" onClick={() => window.location.href = "/login"}>
                        Change Password
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border-red-50 shadow-sm">
                    <CardContent className="p-6">
                      <Button variant="destructive" className="w-full" onClick={logout}>
                        <LogOut className="h-4 w-4 mr-2" /> Logout from PaikarMart
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

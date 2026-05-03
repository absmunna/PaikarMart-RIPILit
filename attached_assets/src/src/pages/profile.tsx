import * as React from "react";
import {
  useGetMe,
  getGetMeQueryKey,
  useListOrders,
  getListOrdersQueryKey,
  useListDemands,
  getListDemandsQueryKey,
  useListProducts,
  getListProductsQueryKey,
  useListPosts,
  getListPostsQueryKey,
} from "@workspace/api-client-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MapPin, Settings, ShieldCheck, Package, FileText, Heart, Store, LayoutDashboard, Trash2, ShoppingBag } from "lucide-react";
import { Link } from "wouter";
import { format, formatDistanceToNow } from "date-fns";
import { useAuth } from "@/features/auth/AuthContext";
import { useWishlist } from "@/features/wishlist/WishlistContext";
import { toast } from "sonner";
import { PostCard } from "@/components/feed/PostCard";
import { formatBDT } from "@/lib/format";

export default function Profile() {
  const { data: user } = useGetMe({ query: { queryKey: getGetMeQueryKey() } });
  const { data: orders } = useListOrders({ query: { queryKey: getListOrdersQueryKey() } });
  const { data: demands } = useListDemands({ mine: true }, { query: { queryKey: getListDemandsQueryKey({ mine: true }) } });
  const { data: products } = useListProducts({}, { query: { queryKey: getListProductsQueryKey() } });
  const { data: posts } = useListPosts({}, { query: { queryKey: getListPostsQueryKey() } });
  const { role } = useAuth();
  const wishlist = useWishlist();

  const isSeller = role === "seller" || role === "admin";

  const [editOpen, setEditOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [bio, setBio] = React.useState("");

  React.useEffect(() => {
    if (user) {
      setName(user.name ?? "");
      setBio(user.bio ?? "");
    }
  }, [user]);

  const saveProfile = () => {
    try {
      const draft = { name, bio, savedAt: new Date().toISOString() };
      window.localStorage.setItem("pm.profile.draft.v1", JSON.stringify(draft));
      toast.success("Profile updated");
      setEditOpen(false);
    } catch {
      toast.error("Could not save");
    }
  };

  const myPosts = (posts ?? []).filter(
    (p) => p?.author?.id === user?.id || p?.author?.name === user?.name,
  );

  const myProducts = (products ?? []).slice(0, 8);
  const rawTab = new URLSearchParams(window.location.search).get("tab");
  const tabMap: Record<string, string> = { wishlist: "wishlist", demands: "demands", products: "products", posts: "timeline", orders: "orders" };
  const initialTab = rawTab && tabMap[rawTab] ? tabMap[rawTab] : "orders";
  const settingsHref = role === "admin" ? "/admin/settings" : isSeller ? "/seller/profile" : "/profile";

  if (!user)
    return <div className="p-8 text-center text-white/70">Loading profile...</div>;

  const tabsList = [
    { v: "orders", label: "Purchases", Icon: Package },
    { v: "demands", label: "My Demands", Icon: FileText },
    { v: "wishlist", label: "Wishlist", Icon: Heart },
    ...(isSeller
      ? [
          { v: "products", label: "My Products", Icon: Store },
          { v: "incoming", label: "Incoming Orders", Icon: ShoppingBag },
        ]
      : []),
    { v: "timeline", label: "My Posts", Icon: FileText },
  ];

  return (
    <div className="flex flex-col pb-20">
      <div className="relative h-40 md:h-56 w-full bg-gradient-to-r from-blue-900 via-[#0f172a] to-purple-900 rounded-b-2xl overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926')] opacity-20 mix-blend-overlay" />
      </div>

      <div className="max-w-4xl mx-auto w-full px-3 sm:px-6 -mt-14 relative z-10 flex flex-col gap-5">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-4">
            <Avatar className="h-24 w-24 md:h-28 md:w-28 border-4 border-[#0f172a] rounded-full bg-[#0f172a]">
              <AvatarImage src={user.avatarUrl} className="object-cover" />
              <AvatarFallback className="text-3xl">{user.name?.[0]}</AvatarFallback>
            </Avatar>

            <div className="flex flex-col gap-1 pb-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl md:text-2xl font-bold text-white">{name || user.name}</h1>
                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-primary/20 text-primary font-bold">
                  {role}
                </span>
              </div>
              <p className="text-primary text-sm">@{user.handle}</p>

              <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-white/60">
                <div className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {user.location}</div>
                {user.verified && (
                  <div className="flex items-center gap-1 text-green-400 bg-green-400/10 px-2 py-0.5 rounded">
                    <ShieldCheck className="h-3.5 w-3.5" /> Verified
                  </div>
                )}
                {user.trustScore != null && (
                  <div className="flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded text-white/80">
                    Trust: <span className="font-bold text-white">{user.trustScore}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 pb-1">
            <Button
              onClick={() => setEditOpen(true)}
              variant="outline"
              className="bg-white/5 border-white/20 text-white hover:bg-white/10"
            >
              Edit Profile
            </Button>
            <Link href={settingsHref}>
              <Button variant="outline" size="icon" className="bg-white/5 border-white/20 text-white hover:bg-white/10">
                <Settings className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>

        {bio && <p className="text-white/80 text-sm">{bio}</p>}

        {/* Quick action: create product/demand instead of "become a seller" */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5">
          <Link href={isSeller ? "/seller/products/new" : "/auth/seller-register"}>
            <GlassCard className="p-3 flex items-center gap-3 hover:bg-white/10 cursor-pointer">
              <div className="p-2 rounded-lg bg-emerald-500/15 text-emerald-300">
                <Store className="w-4 h-4" />
              </div>
              <div className="text-sm font-medium text-white">
                {isSeller ? "Create Product" : "Open a Shop"}
              </div>
            </GlassCard>
          </Link>
          <Link href="/demand">
            <GlassCard className="p-3 flex items-center gap-3 hover:bg-white/10 cursor-pointer">
              <div className="p-2 rounded-lg bg-amber-500/15 text-amber-300">
                <FileText className="w-4 h-4" />
              </div>
              <div className="text-sm font-medium text-white">Create Demand Post</div>
            </GlassCard>
          </Link>
          <Link href={role === "admin" ? "/admin" : isSeller ? "/seller" : "/orders"}>
            <GlassCard className="p-3 flex items-center gap-3 hover:bg-white/10 cursor-pointer col-span-2 lg:col-span-1">
              <div className="p-2 rounded-lg bg-blue-500/15 text-blue-300">
                <LayoutDashboard className="w-4 h-4" />
              </div>
              <div className="text-sm font-medium text-white">
                {role === "admin" ? "Open Admin Center" : isSeller ? "Open Seller Center" : "Open My Orders"}
              </div>
            </GlassCard>
          </Link>
        </div>

        <Tabs defaultValue={initialTab} className="w-full mt-2">
          <TabsList className="bg-white/5 border border-white/10 w-full justify-start h-auto rounded-xl p-1 overflow-x-auto no-scrollbar flex-nowrap">
            {tabsList.map((t) => (
              <TabsTrigger
                key={t.v}
                value={t.v}
                className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white text-white/70 py-2 px-4 shrink-0 text-sm"
              >
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="orders" className="mt-5 outline-none flex flex-col gap-3">
            {(orders?.length ?? 0) === 0 ? (
              <Empty Icon={Package} text="No orders yet." />
            ) : (
              orders?.map((order) => (
                <GlassCard key={order.id} className="p-4 flex flex-col sm:flex-row justify-between gap-3">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs text-white/50">Order #{order.id.slice(0, 8)}</span>
                    <span className="font-medium text-white text-sm">{format(new Date(order.createdAt), "MMM d, yyyy")}</span>
                    <span className="text-xs text-white/70 mt-1">{order.items?.length ?? 0} items</span>
                  </div>
                  <div className="flex flex-col items-start sm:items-end gap-1.5">
                    <span className="text-lg font-bold text-primary">{formatBDT(order.total, { decimals: true })}</span>
                    <span className="px-2 py-0.5 rounded bg-white/10 text-white text-[10px] uppercase tracking-wider">{order.status}</span>
                  </div>
                </GlassCard>
              ))
            )}
          </TabsContent>

          <TabsContent value="demands" className="mt-5 outline-none flex flex-col gap-3">
            {(demands?.length ?? 0) === 0 ? (
              <Empty Icon={FileText} text="You haven't posted any demands yet." />
            ) : (
              demands?.map((d) => (
                <Link key={d.id} href={`/demand/${d.id}`}>
                  <GlassCard className="p-4 hover:-translate-y-0.5 transition-transform cursor-pointer">
                    <div className="flex justify-between items-start mb-1.5">
                      <h3 className="font-medium text-white text-sm">{d.title}</h3>
                      <span className="px-2 py-0.5 rounded bg-white/10 text-white/80 text-[10px] uppercase tracking-wider">{d.status}</span>
                    </div>
                    <p className="text-xs text-white/60 line-clamp-1 mb-2">{d.description}</p>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-primary font-bold">{formatBDT(d.budget)}</span>
                      <span className="text-white/50">{d.matchCount} matches</span>
                    </div>
                  </GlassCard>
                </Link>
              ))
            )}
          </TabsContent>

          <TabsContent value="wishlist" className="mt-5 outline-none">
            {wishlist.items.length === 0 ? (
              <Empty Icon={Heart} text="Your wishlist is empty." />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {wishlist.items.map((w) => (
                  <GlassCard key={w.productId} className="p-3 flex flex-col gap-2">
                    {w.imageUrl && (
                      <img src={w.imageUrl} alt={w.title} className="w-full aspect-square object-cover rounded-md" />
                    )}
                    <div className="text-sm text-white truncate">{w.title}</div>
                    <div className="flex items-center justify-between">
                      <span className="text-primary font-bold text-sm">{formatBDT(w.price)}</span>
                      <button onClick={() => wishlist.remove(w.productId)} className="text-white/50 hover:text-red-400">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </GlassCard>
                ))}
              </div>
            )}
          </TabsContent>

          {isSeller && (
            <TabsContent value="products" className="mt-5 outline-none">
              {myProducts.length === 0 ? (
                <Empty Icon={Store} text="No products uploaded yet." />
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {myProducts.map((p) => (
                    <Link key={p.id} href={`/marketplace/product/${p.id}`}>
                      <GlassCard className="p-3 flex flex-col gap-2 hover:-translate-y-0.5 transition-transform cursor-pointer">
                        {p.images?.[0] && (
                          <img src={p.images[0]} alt={p.title} className="w-full aspect-square object-cover rounded-md" />
                        )}
                        <div className="text-sm text-white truncate">{p.title}</div>
                        <div className="text-primary font-bold text-sm">{formatBDT(p.price)}</div>
                        <div className="text-[10px] text-white/40">
                          Added {p.createdAt ? formatDistanceToNow(new Date(p.createdAt), { addSuffix: true }) : ""}
                        </div>
                      </GlassCard>
                    </Link>
                  ))}
                </div>
              )}
            </TabsContent>
          )}

          {isSeller && (
            <TabsContent value="incoming" className="mt-5 outline-none flex flex-col gap-3">
              {(orders?.length ?? 0) === 0 ? (
                <Empty Icon={ShoppingBag} text="No incoming orders yet." />
              ) : (
                orders?.map((o) => (
                  <GlassCard key={o.id} className="p-4 flex justify-between gap-3">
                    <div>
                      <div className="text-xs text-white/50">#{o.id.slice(0, 8)}</div>
                      <div className="text-sm text-white">{o.items?.length ?? 0} items - {format(new Date(o.createdAt), "MMM d")}</div>
                    </div>
                    <div className="text-primary font-bold">{formatBDT(o.total)}</div>
                  </GlassCard>
                ))
              )}
            </TabsContent>
          )}

          <TabsContent value="timeline" className="mt-5 outline-none flex flex-col gap-4">
            {myPosts.length === 0 ? (
              <Empty Icon={FileText} text="You haven't posted anything yet. Use the composer at the top of the feed." />
            ) : (
              myPosts.map((p) => <PostCard key={p.id} post={p} />)
            )}
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="bg-[#0f172a] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3 py-2">
            <label className="text-xs text-white/60">Display name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-white/10 border border-white/10 rounded-md h-10 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <label className="text-xs text-white/60 mt-2">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="bg-white/10 border border-white/10 rounded-md p-3 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)} className="bg-white/5 border-white/20 text-white">
              Cancel
            </Button>
            <Button onClick={saveProfile}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Empty({ Icon, text }: { Icon: React.ComponentType<{ className?: string }>; text: string }) {
  return (
    <div className="py-10 text-center text-white/50 border border-white/10 border-dashed rounded-xl bg-white/5">
      <Icon className="w-10 h-10 mx-auto mb-2 opacity-30" />
      <p className="text-sm">{text}</p>
    </div>
  );
}


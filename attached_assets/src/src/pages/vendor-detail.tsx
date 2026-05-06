import { useParams } from "wouter";
import { useGetVendor, getGetVendorQueryKey } from "@workspace/api-client-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProductGrid } from "@/components/product/ProductGrid";
import { PostCard } from "@/components/feed/PostCard";
import { Button } from "@/components/ui/button";
import { MapPin, Star, Users, CheckCircle, Mail } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

export default function VendorDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: vendor } = useGetVendor(id, { query: { queryKey: getGetVendorQueryKey(id), enabled: !!id } });

  if (!vendor) return <div className="p-8 text-center text-white">Loading...</div>;

  return (
    <div className="flex flex-col">
      {/* Cover & Avatar Header */}
      <div className="relative h-64 md:h-80 w-full bg-black/40">
        <img src={vendor.coverUrl} alt="Cover" className="w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/50 to-transparent" />
      </div>

      <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 -mt-24 relative z-10 flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
            <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-[#0f172a] rounded-2xl shadow-xl bg-[#0f172a]">
              <AvatarImage src={vendor.avatarUrl} className="object-cover" />
              <AvatarFallback className="text-4xl rounded-2xl">{vendor.name[0]}</AvatarFallback>
            </Avatar>
            
            <div className="flex flex-col gap-2 pb-2">
              <div className="flex items-center gap-2">
                <h1 className="text-3xl md:text-4xl font-bold text-white">{vendor.name}</h1>
                {vendor.verified && <CheckCircle className="h-6 w-6 text-primary" />}
              </div>
              <p className="text-white/70 text-lg">{vendor.tagline}</p>
              
              <div className="flex flex-wrap items-center gap-4 mt-1 text-sm text-white/60">
                <div className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {vendor.location}</div>
                <div className="flex items-center gap-1 text-yellow-400"><Star className="h-4 w-4 fill-current" /> <span className="text-white/60">{vendor.rating.toFixed(1)}</span></div>
                <div className="flex items-center gap-1"><Users className="h-4 w-4" /> {vendor.followers.toLocaleString()} Followers</div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 pb-2">
            <Button className="bg-primary hover:bg-primary/90 text-white rounded-full px-8">Follow</Button>
            <Button variant="outline" size="icon" className="rounded-full bg-white/5 border-white/20 text-white hover:bg-white/10">
              <Mail className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {vendor.description && (
          <GlassCard className="p-6">
            <h3 className="font-semibold text-white mb-2">About</h3>
            <p className="text-white/80 leading-relaxed">{vendor.description}</p>
          </GlassCard>
        )}

        <Tabs defaultValue="products" className="w-full mt-4">
          <TabsList className="bg-white/5 border border-white/10 p-1 w-full justify-start h-auto rounded-xl">
            <TabsTrigger value="products" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white text-white/70 py-2.5 px-6">
              Products ({vendor.products.length})
            </TabsTrigger>
            <TabsTrigger value="posts" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white text-white/70 py-2.5 px-6">
              Posts ({vendor.recentPosts.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="products" className="mt-6 outline-none">
            <ProductGrid products={vendor.products} emptyMessage="This vendor hasn't listed any products yet." />
          </TabsContent>
          
          <TabsContent value="posts" className="mt-6 outline-none">
            <div className="max-w-2xl flex flex-col gap-4">
              {vendor.recentPosts.length > 0 ? (
                vendor.recentPosts.map(post => (
                  <PostCard key={post.id} post={post} />
                ))
              ) : (
                <div className="text-center text-white/50 py-12">No posts yet.</div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

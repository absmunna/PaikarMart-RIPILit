import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { MapPin, Star, Settings, Plus, MessageSquare, Share2, Bell } from "lucide-react";
import { MOCK_SELLERS, getFeedPosts } from "@/features/posts/post.api";
import type { Post } from "@/features/posts/post.types";
import { useAuth } from "@/features/auth/auth.context";
import { Avatar } from "@/components/common/Avatar";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { FeedPostCard } from "@/components/feed/FeedPostCard";
import CreatePost from "@/pages/social/CreatePost";
import { WalletCard } from "@/components/wallet/WalletCard";
import { Badge } from "@/components/ui/Badge";

export default function SellerProfile() {
  const { handle } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tab, setTab] = useState<"products" | "posts" | "reviews" | "about">("products");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const isOwnProfile = user?.handle === `@${handle}`;
  const profile = isOwnProfile ? user : MOCK_SELLERS.find((s) => s.handle === `@${handle}`) || MOCK_SELLERS[0];
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    if (!profile?.id) return;
    getFeedPosts().then((all) => setPosts(all.filter((p) => p.authorId === profile.id)));
  }, [profile?.id]);

  if (!profile) return null;

  const sellerType = profile.sellerType ?? "retail";
  const shopName = profile.shopName ?? profile.name;
  const coverImage = profile.shopCover ?? "/generated/banner1.png";
  const shopLogo = profile.shopLogo ?? `/generated/avatar${(parseInt(profile.id.replace("s-", "")) % 4) + 1}.png`;
  const verified = profile.isVerified ?? false;

  const getSellerBadge = () => {
    const badges: Record<string, { label: string; color: string }> = {
      wholesale: { label: "Wholesale", color: "bg-blue-500/10 text-blue-500 border-blue-500/30" },
      retail: { label: "Retail Seller", color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/30" },
      service: { label: "Service Provider", color: "bg-purple-500/10 text-purple-500 border-purple-500/30" },
      content_creator: { label: "Creator", color: "bg-pink-500/10 text-pink-500 border-pink-500/30" },
    };
    return badges[sellerType];
  };

  const badge = getSellerBadge();

  return (
    <div className="pb-24 min-h-screen">
      {/* Cover Image */}
      <div className="h-40 sm:h-48 lg:h-56 bg-gradient-to-r from-emerald-600 to-blue-600 relative">
        <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
        {isOwnProfile && (
          <button className="absolute top-4 right-4 h-10 w-10 rounded-full glass bg-black/20 text-white flex items-center justify-center hover:bg-black/40 transition">
            <Settings className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Profile Header Section */}
      <div className="px-4 lg:px-8 relative mb-8">
        {/* Logo & Info */}
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-16 sm:-mt-20 mb-6">
          <div className="relative">
            <Avatar 
              src={shopLogo} 
              fallback={profile.name} 
              size="xl"
              className="border-4 border-[rgb(var(--bg))] shadow-lg" 
            />
            {verified && (
              <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-[rgb(var(--primary))] flex items-center justify-center border-2 border-[rgb(var(--bg))]">
                <span className="text-white text-xs font-bold">✓</span>
              </div>
            )}
          </div>

          <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-[rgb(var(--text))]">{shopName}</h1>
              <p className="text-sm text-[rgb(var(--text-muted))] mt-1 flex items-center gap-2">
                <span>{profile.handle}</span>
                {verified && <Badge variant="success" className="text-[10px]">Verified</Badge>}
              </p>
            </div>

            {!isOwnProfile && (
              <div className="flex gap-2 mt-4 sm:mt-0">
                <Button size="sm" variant="primary" className="gap-1.5">
                  <Bell className="h-4 w-4" /> Follow
                </Button>
                <Button size="sm" variant="outline" className="gap-1.5">
                  <MessageSquare className="h-4 w-4" /> Message
                </Button>
                <Button size="sm" variant="outline" className="gap-1">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            )}
            {isOwnProfile && (
              <Button size="sm" variant="outline">Edit Shop</Button>
            )}
          </div>
        </div>

        {/* Stats & Badge */}
        <div className="flex flex-wrap items-center gap-6 mb-6 pb-6 border-b border-[rgba(var(--glass-stroke)/0.1)]">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg text-[rgb(var(--text))]">{profile.followers || "1.2k"}</span>
            <span className="text-sm text-[rgb(var(--text-muted))]">Followers</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500 fill-current" />
            <span className="font-bold text-[rgb(var(--text))]">{profile.rating || "4.8"}</span>
            <span className="text-sm text-[rgb(var(--text-muted))]">rating</span>
          </div>
          <Badge variant="primary" className={`${badge.color} border`}>
            {badge.label}
          </Badge>
          <div className="flex items-center gap-1 text-sm text-[rgb(var(--text-muted))]">
            <MapPin className="h-4 w-4" /> Dhaka
          </div>
        </div>

        {/* Wallet for own profile */}
        {isOwnProfile && (
          <div className="mb-6">
            <WalletCard />
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="sticky top-16 z-20 bg-[rgba(var(--bg)/0.95)] backdrop-blur-md border-b border-[rgba(var(--glass-stroke)/0.1)]">
        <div className="px-4 lg:px-8 flex border-b border-[rgba(var(--glass-stroke)/0.1)]">
          {[
            { key: "products", label: "Products" },
            { key: "posts", label: "Posts" },
            { key: "reviews", label: "Reviews" },
            { key: "about", label: "About" },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key as any)}
              className={`px-4 lg:px-6 py-3 text-sm font-semibold transition-colors border-b-2 ${
                tab === t.key ? "border-[rgb(var(--primary))] text-[rgb(var(--primary))]" : "border-transparent text-[rgb(var(--text-muted))] hover:text-[rgb(var(--text))]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 lg:px-8 py-6 flex flex-col gap-4">
        {tab === "products" && (
          <div className="text-center py-12">
            <p className="text-[rgb(var(--text-muted))] mb-4">Products listed in marketplace.</p>
            {isOwnProfile && (
              <Link to={`/seller/${profile.handle.replace("@","")}/products`} className="inline-block px-6 py-2 rounded-xl bg-[rgb(var(--primary))] text-white font-semibold hover:opacity-90 transition">
                Manage Products
              </Link>
            )}
          </div>
        )}
        
        {tab === "posts" && (
          <div className="space-y-4">
            {posts.length > 0 ? (
              posts.map(p => <FeedPostCard key={p.id} post={p} />)
            ) : (
              <div className="text-center py-12 text-[rgb(var(--text-muted))]">
                No posts yet
              </div>
            )}
          </div>
        )}
        
        {tab === "reviews" && (
          <div className="text-center py-12 text-[rgb(var(--text-muted))]">
            Reviews from customers will appear here.
          </div>
        )}
        
        {tab === "about" && (
          <div className="glass-card p-6">
            <h3 className="font-bold text-lg mb-3 text-[rgb(var(--text))]">About {shopName}</h3>
            <p className="text-[rgb(var(--text-muted))] leading-relaxed mb-4">
              Welcome to {shopName}! We are a trusted {sellerType} seller on PaikarMart, committed to providing quality products and excellent customer service.
            </p>
            <div className="space-y-2 text-sm">
              <p><span className="font-semibold text-[rgb(var(--text))]">Seller Type:</span> {badge.label}</p>
              <p><span className="font-semibold text-[rgb(var(--text))]">Location:</span> Dhaka, Bangladesh</p>
              <p><span className="font-semibold text-[rgb(var(--text))]">Joined:</span> January 2024</p>
            </div>
          </div>
        )}
      </div>

      {/* FAB for owner */}
      {isOwnProfile && (
        <button 
          onClick={() => setIsCreateOpen(true)}
          className="fixed bottom-[calc(env(safe-area-inset-bottom)+88px)] right-6 h-14 w-14 rounded-full bg-[rgb(var(--primary))] text-white shadow-glow flex items-center justify-center z-30 hover:scale-105 active:scale-95 transition-transform"
        >
          <Plus className="h-6 w-6" />
        </button>
      )}

      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Create New">
        <CreatePost onClose={() => setIsCreateOpen(false)} />
      </Modal>
    </div>
  );
}

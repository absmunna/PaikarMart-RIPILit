import { useGetCategories } from "@workspace/api-client-react";
import { Link } from "wouter";
import * as Icons from "lucide-react";
import { Layout } from "@/components/layout/Layout";

const CATEGORY_THEMES: Record<string, { from: string; to: string; light: string }> = {
  Electronics:  { from: "from-blue-500/20",   to: "to-cyan-500/10",    light: "text-blue-400" },
  Fashion:      { from: "from-pink-500/20",   to: "to-purple-500/10",  light: "text-pink-400" },
  Grocery:      { from: "from-green-500/20",  to: "to-emerald-500/10", light: "text-green-400" },
  Services:     { from: "from-amber-500/20",  to: "to-orange-500/10",  light: "text-amber-400" },
  Wholesale:    { from: "from-purple-500/20", to: "to-indigo-500/10",  light: "text-purple-400" },
  Digital:      { from: "from-cyan-500/20",   to: "to-blue-500/10",    light: "text-cyan-400" },
};

const SHOP_TYPES = [
  { icon: Icons.Building2,   label: "Wholesale",  desc: "Bulk orders, trade prices",     color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20", href: "/products?type=wholesale" },
  { icon: Icons.ShoppingBag, label: "Retail",     desc: "Single items, best quality",    color: "text-blue-400",   bg: "bg-blue-500/10 border-blue-500/20",   href: "/products?type=retail" },
  { icon: Icons.Zap,         label: "Digital",    desc: "Software, ebooks, courses",     color: "text-cyan-400",   bg: "bg-cyan-500/10 border-cyan-500/20",   href: "/products?type=digital" },
  { icon: Icons.Wrench,      label: "Services",   desc: "Freelance & professional work", color: "text-amber-400",  bg: "bg-amber-500/10 border-amber-500/20", href: "/products?type=service" },
];

const POPULAR_TAGS = [
  "Mobile Phones", "Laptops", "Saree", "Panjabi", "Rice (Bulk)", "Mustard Oil",
  "Web Development", "Graphic Design", "LED TV", "Headphones", "T-Shirt",
  "Spices", "Organic Vegetables", "App Development", "Video Editing",
];

export default function CategoriesPage() {
  const { data: catData, isLoading } = useGetCategories();
  const categories = catData?.categories || [];
  const skeletons = Array.from({ length: 6 });

  return (
    <Layout>
      {/* Hero Banner */}
      <div className="border-b border-white/5 mb-8">
        <div className="container mx-auto px-4 py-10">
          <div className="max-w-2xl">
            <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-2">Browse Everything</p>
            <h1 className="text-4xl font-extrabold text-white mb-3">All Categories</h1>
            <p className="text-white/40 text-lg">
              From electronics to groceries, wholesale to digital — find everything in one place across Bangladesh.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-12">

        {/* Main Category Grid */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Icons.Layers className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold text-white">Product Categories</h2>
            {!isLoading && <span className="text-sm text-white/30 ml-1">· {categories.length} categories</span>}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {isLoading
              ? skeletons.map((_, i) => (
                  <div key={i} className="glass-card rounded-2xl p-6 animate-pulse h-40" />
                ))
              : categories.map((cat: any) => {
                  const iconName = cat.icon as string | undefined;
                  const IconComponent = (iconName && (Icons as any)[iconName]) ? (Icons as any)[iconName] : Icons.Tag;
                  const theme = CATEGORY_THEMES[cat.name] || { from: "from-primary/15", to: "to-purple-500/10", light: "text-primary" };

                  return (
                    <Link key={cat.id} href={`/products?categoryId=${cat.id}`}>
                      <div className={`group cursor-pointer glass-card rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-4 min-h-[160px] hover:border-primary/30 hover:-translate-y-1 transition-all duration-200 bg-gradient-to-br ${theme.from} ${theme.to}`}>
                        <div className={`h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform ${theme.light}`}>
                          <IconComponent className="h-7 w-7" />
                        </div>
                        <div>
                          <h3 className={`font-bold text-white group-hover:${theme.light} transition-colors text-base mb-1`}>
                            {cat.name}
                          </h3>
                          {cat.productCount != null && (
                            <p className="text-xs text-white/40">{cat.productCount} items</p>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
          </div>
        </div>

        {/* Shop by Type */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Icons.Filter className="h-5 w-5 text-purple-400" />
            <h2 className="text-xl font-bold text-white">Shop by Type</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {SHOP_TYPES.map(type => {
              const Icon = type.icon;
              return (
                <Link key={type.label} href={type.href}>
                  <div className={`group cursor-pointer rounded-2xl border p-5 flex flex-col gap-3 hover:-translate-y-0.5 transition-all duration-200 ${type.bg}`}>
                    <div className={`h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center ${type.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className={`font-bold text-white group-hover:${type.color} transition-colors mb-0.5`}>{type.label}</h3>
                      <p className="text-xs text-white/40">{type.desc}</p>
                    </div>
                    <div className={`flex items-center gap-1 text-xs font-medium ${type.color} mt-auto`}>
                      Browse <Icons.ChevronRight className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Featured Categories (3-col banner style) */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Icons.TrendingUp className="h-5 w-5 text-amber-400" />
            <h2 className="text-xl font-bold text-white">Trending Sections</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: "Electronics & Gadgets",
                desc: "Latest smartphones, laptops, and accessories from top brands",
                icon: Icons.Cpu,
                gradient: "from-blue-600/20 via-cyan-500/10 to-transparent",
                color: "text-blue-400",
                href: "/products?category=Electronics",
                badge: "Hot",
              },
              {
                title: "Fashion & Clothing",
                desc: "Traditional and modern styles — saree, panjabi, western wear",
                icon: Icons.Shirt,
                gradient: "from-pink-600/20 via-purple-500/10 to-transparent",
                color: "text-pink-400",
                href: "/products?category=Fashion",
                badge: "Trending",
              },
              {
                title: "Wholesale Market",
                desc: "Bulk products at factory prices for retailers and resellers",
                icon: Icons.Warehouse,
                gradient: "from-purple-600/20 via-indigo-500/10 to-transparent",
                color: "text-purple-400",
                href: "/products?category=Wholesale",
                badge: "Bulk",
              },
            ].map(card => {
              const Icon = card.icon;
              return (
                <Link key={card.title} href={card.href}>
                  <div className={`group cursor-pointer glass-card rounded-2xl overflow-hidden bg-gradient-to-br ${card.gradient} p-6 min-h-[180px] flex flex-col justify-between hover:border-white/20 hover:-translate-y-0.5 transition-all duration-200`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className={`h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center ${card.color}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/10 text-white/60 uppercase tracking-wide">
                        {card.badge}
                      </span>
                    </div>
                    <div>
                      <h3 className={`font-bold text-white text-lg mb-1.5 group-hover:${card.color} transition-colors`}>{card.title}</h3>
                      <p className="text-sm text-white/40 leading-relaxed">{card.desc}</p>
                    </div>
                    <div className={`flex items-center gap-1 text-sm font-semibold ${card.color} mt-4`}>
                      Explore <Icons.ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Popular Search Tags */}
        <div>
          <div className="flex items-center gap-2 mb-5">
            <Icons.Search className="h-5 w-5 text-white/40" />
            <h2 className="text-xl font-bold text-white">Popular Searches</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {POPULAR_TAGS.map(tag => (
              <Link key={tag} href={`/products?q=${encodeURIComponent(tag)}`}>
                <span className="px-4 py-2 rounded-full glass-card text-sm text-white/60 hover:text-white hover:border-primary/30 transition-all cursor-pointer">
                  {tag}
                </span>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </Layout>
  );
}

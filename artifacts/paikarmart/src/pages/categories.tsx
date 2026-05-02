import { useGetCategories } from "@workspace/api-client-react";
import { Link } from "wouter";
import * as Icons from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { GlassCard } from "@/components/ui/GlassCard";

export default function CategoriesPage() {
  const { data: catData, isLoading } = useGetCategories();
  const categories = catData?.categories;

  const skeletons = Array.from({ length: 10 });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Categories</h1>
          <p className="text-white/60 mt-1">Browse all available product and service categories.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {isLoading
            ? skeletons.map((_, i) => (
                <div key={i} className="glass-card rounded-xl p-6 animate-pulse h-32" />
              ))
            : categories?.map((cat) => {
                const iconName = (cat as any).icon as string | undefined;
                const IconComponent = (iconName && (Icons as any)[iconName]) ? (Icons as any)[iconName] : Icons.Tag;
                return (
                  <Link key={cat.id} href={`/products?categoryId=${cat.id}`}>
                    <GlassCard
                      className="p-6 flex flex-col items-center justify-center text-center gap-3 cursor-pointer group"
                      hoverEffect
                    >
                      <div className="h-12 w-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-medium text-white group-hover:text-primary transition-colors text-sm">
                          {cat.name}
                        </h3>
                        {(cat as any).productCount != null && (
                          <p className="text-xs text-white/50 mt-0.5">{(cat as any).productCount} items</p>
                        )}
                      </div>
                    </GlassCard>
                  </Link>
                );
              })}
        </div>
      </div>
    </Layout>
  );
}

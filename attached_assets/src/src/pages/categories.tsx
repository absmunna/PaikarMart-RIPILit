import { useListCategories, getListCategoriesQueryKey } from "@workspace/api-client-react";
import { Link } from "wouter";
import * as Icons from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

export default function Categories() {
  const { data: categories } = useListCategories({ query: { queryKey: getListCategoriesQueryKey() } });

  return (
    <div className="p-4 flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Categories</h1>
        <p className="text-white/60 mt-1">Browse all available product and service categories.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {categories?.map((cat) => {
          const IconComponent = (Icons as any)[cat.icon] || Icons.Tag;
          
          return (
            <Link key={cat.id} href={`/marketplace?categoryId=${cat.id}`}>
              <GlassCard className="p-6 flex flex-col items-center justify-center text-center gap-3 cursor-pointer group" hoverEffect>
                <div className="h-12 w-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <IconComponent className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-medium text-white group-hover:text-primary transition-colors">{cat.name}</h3>
                  <p className="text-xs text-white/50 mt-1">{cat.productCount} items</p>
                </div>
              </GlassCard>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

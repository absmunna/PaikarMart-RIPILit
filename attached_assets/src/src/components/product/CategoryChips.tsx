import { useListCategories, getListCategoriesQueryKey } from "@workspace/api-client-react";
import { Link } from "wouter";
import * as Icons from "lucide-react";

export function CategoryChips({ activeId }: { activeId?: string }) {
  const { data: categories } = useListCategories({ query: { queryKey: getListCategoriesQueryKey() } });

  if (!categories?.length) return null;

  return (
    <div className="flex overflow-x-auto gap-2 pb-2 no-scrollbar">
      <Link 
        href="/marketplace" 
        className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-full border text-sm transition-colors ${
          !activeId 
            ? "bg-primary border-primary text-white" 
            : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white"
        }`}
      >
        All
      </Link>
      
      {(Array.isArray(categories) ? categories : []).map((category) => {
        const IconComponent = (Icons as any)[category.icon] || Icons.Tag;
        const isActive = activeId === category.id;
        
        return (
          <Link 
            key={category.id}
            href={`/marketplace?categoryId=${category.id}`} 
            className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-full border text-sm transition-colors ${
              isActive 
                ? "bg-primary border-primary text-white" 
                : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            <IconComponent className="w-4 h-4" />
            {category.name}
          </Link>
        );
      })}
    </div>
  );
}

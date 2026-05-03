import { Link } from "wouter";
import { useListCategories, getListCategoriesQueryKey } from "@workspace/api-client-react";
import { Layers } from "lucide-react";

const COLORS = [
  "from-blue-500/30 to-blue-500/5 text-blue-200",
  "from-emerald-500/30 to-emerald-500/5 text-emerald-200",
  "from-purple-500/30 to-purple-500/5 text-purple-200",
  "from-amber-500/30 to-amber-500/5 text-amber-200",
  "from-rose-500/30 to-rose-500/5 text-rose-200",
  "from-cyan-500/30 to-cyan-500/5 text-cyan-200",
  "from-indigo-500/30 to-indigo-500/5 text-indigo-200",
  "from-pink-500/30 to-pink-500/5 text-pink-200",
];

export function CategoryQuickGrid() {
  const { data } = useListCategories({ query: { queryKey: getListCategoriesQueryKey() } });
  const cats = Array.isArray(data)
    ? data.slice(0, 8)
    : Array.isArray((data as any)?.categories)
    ? (data as any).categories.slice(0, 8)
    : [];

  if (!Array.isArray(cats) || cats.length === 0) {
    return (
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="aspect-square rounded-xl skeleton-shimmer" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
      {(Array.isArray(cats) ? cats : []).map((c, i) => (
        <Link key={c.id} href={`/categories/${c.slug ?? c.id}`}>
          <div
            className={`aspect-square rounded-xl bg-gradient-to-br ${COLORS[i % COLORS.length]} border border-white/10 flex flex-col items-center justify-center gap-1.5 p-2 hover:-translate-y-0.5 transition-transform cursor-pointer`}
          >
            <Layers className="w-5 h-5" />
            <span className="text-[10px] sm:text-xs font-medium text-white text-center line-clamp-2 leading-tight">
              {c.name}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}

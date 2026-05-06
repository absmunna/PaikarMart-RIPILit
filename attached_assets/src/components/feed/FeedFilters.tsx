import { PostType } from "@/types/post.types";

interface FeedFiltersProps {
  active: string;
  onChange: (filter: string) => void;
}

const FILTERS = ["All", "Products", "Services", "Demand", "Nearby"];

export function FeedFilters({ active, onChange }: FeedFiltersProps) {
  return (
    <div className="sticky top-16 z-30 -mx-4 px-4 py-3 bg-[rgba(var(--bg)/0.8)] backdrop-blur-md border-b border-[rgba(var(--glass-stroke)/0.1)] overflow-x-auto no-scrollbar">
      <div className="flex items-center gap-2 w-max">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => onChange(f)}
            className={`chip ${active === f ? "chip-active" : ""}`}
          >
            {f}
          </button>
        ))}
      </div>
    </div>
  );
}

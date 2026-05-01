import { Link } from "wouter";
import { useListDemands, getListDemandsQueryKey } from "@workspace/api-client-react";
import { Clock } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { formatBDT } from "@/lib/format";

export function DemandRail() {
  const { data } = useListDemands({}, { query: { queryKey: getListDemandsQueryKey() } });
  const items = (data ?? []).slice(0, 8);

  if (items.length === 0) {
    return (
      <div className="grid sm:grid-cols-2 gap-3">
        {(Array.isArray(Array.from({ length: 4 })) ? Array.from({ length: 4 }) : []).map((_, i) => (
          <div key={i} className="h-24 rounded-xl skeleton-shimmer" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 gap-3">
      {(Array.isArray(items.slice(0, 4)) ? items.slice(0, 4) : []).map((d) => (
        <Link key={d.id} href={`/demand/${d.id}`}>
          <GlassCard className="p-4 hover:-translate-y-0.5 transition-transform cursor-pointer h-full">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h4 className="font-medium text-white text-sm line-clamp-1">{d.title}</h4>
              <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 text-[10px] uppercase tracking-wider shrink-0">
                {d.urgency ?? "open"}
              </span>
            </div>
            <p className="text-xs text-white/60 line-clamp-2 mb-3">{d.description}</p>
            <div className="flex items-center justify-between text-xs">
              <span className="text-primary font-bold">{formatBDT(d.budget)}</span>
              <span className="text-white/50 inline-flex items-center gap-1">
                <Clock className="w-3 h-3" /> {d.matchCount ?? 0} matches
              </span>
            </div>
          </GlassCard>
        </Link>
      ))}
    </div>
  );
}


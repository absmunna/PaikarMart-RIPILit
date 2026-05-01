import { Vendor } from "@workspace/api-client-react";
import { Link } from "wouter";
import { GlassCard } from "@/components/ui/GlassCard";
import { MapPin, Star, Users } from "lucide-react";

export function VendorCard({ vendor }: { vendor: Vendor }) {
  return (
    <Link href={`/vendors/${vendor.id}`}>
      <GlassCard className="w-[280px] shrink-0 group cursor-pointer overflow-hidden flex flex-col h-full" hoverEffect>
        <div className="h-24 bg-white/10 relative">
          <img src={vendor.coverUrl} alt="Cover" className="w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity" />
          <div className="absolute -bottom-6 left-4 border-2 border-[#0f172a] rounded-xl overflow-hidden bg-[#0f172a]">
            <img src={vendor.avatarUrl} alt={vendor.name} className="w-12 h-12 object-cover" />
          </div>
        </div>
        <div className="pt-8 p-4 flex flex-col flex-1">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-semibold text-white leading-tight line-clamp-1">{vendor.name}</h3>
            {vendor.verified && <span className="text-primary text-xs shrink-0">✓</span>}
          </div>
          <p className="text-xs text-white/50 mb-3 capitalize line-clamp-1">{vendor.type.replace('_', ' ')} • {vendor.tagline}</p>
          
          <div className="mt-auto grid grid-cols-2 gap-2 text-xs text-white/70">
            <div className="flex items-center gap-1 bg-white/5 rounded px-2 py-1">
              <Star className="w-3 h-3 text-yellow-400" />
              <span>{vendor.rating.toFixed(1)}</span>
            </div>
            <div className="flex items-center gap-1 bg-white/5 rounded px-2 py-1">
              <Users className="w-3 h-3 text-primary" />
              <span>{vendor.followers}</span>
            </div>
            <div className="flex items-center gap-1 bg-white/5 rounded px-2 py-1 col-span-2">
              <MapPin className="w-3 h-3 text-primary" />
              <span className="truncate">{vendor.location}</span>
            </div>
          </div>
        </div>
      </GlassCard>
    </Link>
  );
}

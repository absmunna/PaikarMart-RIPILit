import { useParams, Link } from "wouter";
import { formatBDT } from "@/lib/format";
import { useGetDemand, getGetDemandQueryKey } from "@workspace/api-client-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { VendorCard } from "@/components/vendor/VendorCard";
import { ArrowLeft, Clock, MapPin, DollarSign, Tag, Calendar } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";

export default function DemandDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: demand } = useGetDemand(id, { query: { queryKey: getGetDemandQueryKey(id), enabled: !!id } });

  if (!demand) return <div className="p-8 text-center text-white">Loading...</div>;

  return (
    <div className="flex flex-col gap-6 p-4 max-w-4xl mx-auto">
      <Link href="/demand" className="inline-flex items-center gap-2 text-white/70 hover:text-white w-fit">
        <ArrowLeft className="w-4 h-4" />
        Back to Demands
      </Link>

      <GlassCard className="p-6 md:p-8 flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                demand.status === 'open' ? 'bg-green-500/20 text-green-400' :
                demand.status === 'matched' ? 'bg-primary/20 text-primary' :
                'bg-white/10 text-white/50'
              }`}>
                {demand.status}
              </span>
              <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                demand.urgency === 'urgent' ? 'bg-red-500/20 text-red-400' :
                demand.urgency === 'normal' ? 'bg-blue-500/20 text-blue-400' :
                'bg-green-500/20 text-green-400'
              }`}>
                {demand.urgency}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight">{demand.title}</h1>
          </div>
          
          <div className="flex flex-col gap-1 items-start md:items-end shrink-0">
            <span className="text-sm text-white/50 uppercase tracking-wider font-semibold">Budget</span>
            <span className="text-3xl font-bold text-primary">{formatBDT(demand.budget)}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-y border-white/10">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-white/50 text-xs font-medium uppercase"><Tag className="w-3.5 h-3.5" /> Category</div>
            <span className="text-white text-sm">{demand.category.name}</span>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-white/50 text-xs font-medium uppercase"><MapPin className="w-3.5 h-3.5" /> Location</div>
            <span className="text-white text-sm">{demand.location || "Anywhere"}</span>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-white/50 text-xs font-medium uppercase"><Clock className="w-3.5 h-3.5" /> Posted</div>
            <span className="text-white text-sm">{formatDistanceToNow(new Date(demand.createdAt), { addSuffix: true })}</span>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-white/50 text-xs font-medium uppercase"><Calendar className="w-3.5 h-3.5" /> Date</div>
            <span className="text-white text-sm">{format(new Date(demand.createdAt), "MMM d, yyyy")}</span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="font-semibold text-white">Details</h3>
          <p className="text-white/80 whitespace-pre-wrap leading-relaxed">{demand.description}</p>
        </div>

        <div className="flex items-center gap-4 mt-2 p-4 bg-white/5 rounded-xl border border-white/10">
          <Avatar className="h-10 w-10 border border-white/20">
            <AvatarImage src={demand.author.avatarUrl} />
            <AvatarFallback>{demand.author.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-xs text-white/50">Posted by</span>
            <span className="font-medium text-white">{demand.author.name}</span>
          </div>
          <div className="ml-auto">
            <Button variant="outline" className="bg-transparent border-white/20 text-white hover:bg-white/10">
              Message Buyer
            </Button>
          </div>
        </div>
      </GlassCard>

      <div className="mt-4 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Matched Vendors ({demand.matches.length})</h2>
        </div>
        
        {demand.matches.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {demand.matches.map(vendor => (
              <div key={vendor.id} className="w-full">
                <VendorCard vendor={vendor} />
              </div>
            ))}
          </div>
        ) : (
          <GlassCard className="p-8 text-center flex flex-col items-center justify-center gap-2">
            <span className="text-4xl">🔍</span>
            <h3 className="text-lg font-medium text-white">No matches yet</h3>
            <p className="text-sm text-white/50 max-w-md">We're actively searching for vendors that match these requirements. Check back soon!</p>
          </GlassCard>
        )}
      </div>
    </div>
  );
}

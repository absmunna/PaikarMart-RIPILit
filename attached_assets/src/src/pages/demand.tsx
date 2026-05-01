import { useState } from "react";
import { formatBDT } from "@/lib/format";
import { Link } from "wouter";
import { useListDemands, getListDemandsQueryKey, useCreateDemand, useListCategories, getListCategoriesQueryKey, DemandUrgency, CreateDemandBodyUrgency } from "@workspace/api-client-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, MapPin, Users, Plus } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function Demand() {
  const qc = useQueryClient();
  const { data: demands } = useListDemands({}, { query: { queryKey: getListDemandsQueryKey() } });
  const { data: categories } = useListCategories({ query: { queryKey: getListCategoriesQueryKey() } });
  const createDemand = useCreateDemand();
  
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: "",
    categoryId: "",
    location: "",
    urgency: "normal" as CreateDemandBodyUrgency
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createDemand.mutate(
      { 
        data: { 
          title: formData.title,
          description: formData.description,
          budget: Number(formData.budget),
          categoryId: formData.categoryId,
          location: formData.location || undefined,
          urgency: formData.urgency
        } 
      },
      {
        onSuccess: () => {
          toast.success("Demand posted successfully!");
          setOpen(false);
          qc.invalidateQueries({ queryKey: getListDemandsQueryKey() });
          setFormData({ title: "", description: "", budget: "", categoryId: "", location: "", urgency: "normal" });
        }
      }
    );
  };

  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Demands</h1>
          <p className="text-white/60 mt-1">Post what you need, let vendors come to you.</p>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-white rounded-full">
              <Plus className="w-4 h-4 mr-2" />
              Post Request
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#0f172a] border-white/10 text-white sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Post a Demand</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Title</label>
                <Input 
                  required 
                  value={formData.title} 
                  onChange={e => setFormData({...formData, title: e.target.value})} 
                  placeholder="e.g. Need 500 custom printed t-shirts" 
                  className="bg-white/5 border-white/10" 
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea 
                  required 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})} 
                  placeholder="Provide details about your requirement..." 
                  className="bg-white/5 border-white/10 min-h-[100px]" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Budget (USD)</label>
                  <Input 
                    type="number" 
                    required 
                    min="1"
                    value={formData.budget} 
                    onChange={e => setFormData({...formData, budget: e.target.value})} 
                    placeholder="1000" 
                    className="bg-white/5 border-white/10" 
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select value={formData.categoryId} onValueChange={v => setFormData({...formData, categoryId: v})} required>
                    <SelectTrigger className="bg-white/5 border-white/10">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map(c => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Location (Optional)</label>
                  <Input 
                    value={formData.location} 
                    onChange={e => setFormData({...formData, location: e.target.value})} 
                    placeholder="e.g. New York, NY" 
                    className="bg-white/5 border-white/10" 
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Urgency</label>
                  <Select value={formData.urgency} onValueChange={(v: CreateDemandBodyUrgency) => setFormData({...formData, urgency: v})} required>
                    <SelectTrigger className="bg-white/5 border-white/10 capitalize">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(DemandUrgency).map(u => (
                        <SelectItem key={u} value={u} className="capitalize">{u}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button type="submit" disabled={createDemand.isPending} className="mt-4 w-full">
                {createDemand.isPending ? "Posting..." : "Post Demand"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {demands?.length === 0 && (
          <div className="col-span-full py-12 text-center text-white/50">
            No demands posted yet. Be the first!
          </div>
        )}
        
        {demands?.map((demand) => (
          <Link key={demand.id} href={`/demand/${demand.id}`}>
            <GlassCard className="p-5 flex flex-col h-full cursor-pointer" hoverEffect>
              <div className="flex items-start justify-between gap-4 mb-3">
                <h3 className="font-semibold text-white line-clamp-2">{demand.title}</h3>
                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                  demand.urgency === 'urgent' ? 'bg-red-500/20 text-red-400' :
                  demand.urgency === 'normal' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-green-500/20 text-green-400'
                }`}>
                  {demand.urgency}
                </span>
              </div>
              
              <p className="text-sm text-white/70 line-clamp-2 mb-4 flex-1">{demand.description}</p>
              
              <div className="flex flex-col gap-3 mt-auto pt-4 border-t border-white/10 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-white/50 text-xs">Budget</span>
                  <span className="font-bold text-primary">{formatBDT(demand.budget)}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs text-white/60">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{formatDistanceToNow(new Date(demand.createdAt), { addSuffix: true })}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>{demand.matchCount} Matches</span>
                  </div>
                  {demand.location && (
                    <div className="flex items-center gap-1 col-span-2">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate">{demand.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </GlassCard>
          </Link>
        ))}
      </div>
    </div>
  );
}

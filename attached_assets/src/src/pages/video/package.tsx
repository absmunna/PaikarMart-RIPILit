import { useRoute, Link } from "wouter";
import { formatBDT } from "@/lib/format";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Lock } from "lucide-react";
import { toast } from "sonner";
import { getPackageById, getVideoById } from "@/features/digital-content/data";
import { useVideoUnlock } from "@/features/digital-content/VideoUnlockContext";
import { usePKCoin } from "@/features/wallet/PKCoinContext";

export default function VideoPackagePage() {
  const [, params] = useRoute("/video/package/:id");
  const id = params?.id;
  const pkg = id ? getPackageById(id) : undefined;
  const { hasPackageUnlocked, unlockPackage, unlockVideo } = useVideoUnlock();
  const wallet = usePKCoin();

  if (!pkg) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10 text-center">
        <h1 className="text-xl font-bold mb-2">Package not found</h1>
        <Link href="/video"><Button variant="outline">Back to library</Button></Link>
      </div>
    );
  }

  const owned = hasPackageUnlocked(pkg.id);
  const purchase = () => {
    unlockPackage(pkg.id);
    pkg.videoIds.forEach(unlockVideo);
    wallet.earnFromOrder(pkg.price, true);
    toast.success("Bundle unlocked!", { description: pkg.title });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      <Link href="/video" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to library
      </Link>

      <GlassCard className="p-0 overflow-hidden">
        <div className="aspect-[2.5/1] bg-black/40 relative">
          <img src={pkg.thumbnail} alt={pkg.title} className="w-full h-full object-cover opacity-80" />
        </div>
        <div className="p-5 flex items-start gap-4 flex-wrap justify-between">
          <div>
            <h1 className="text-2xl font-bold">{pkg.title}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              by {pkg.vendor.name} · {pkg.videoIds.length} videos
            </p>
            <p className="mt-2 text-sm">{pkg.description}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-primary">{formatBDT(pkg.price)}</div>
            {owned ? (
              <Badge className="mt-2">Owned</Badge>
            ) : (
              <Button className="mt-2" onClick={purchase}>
                <Lock className="h-4 w-4 mr-1" /> Buy bundle
              </Button>
            )}
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-5 space-y-2">
        <div className="font-semibold mb-2">Included videos</div>
        {pkg.videoIds.map((vid) => {
          const v = getVideoById(vid);
          if (!v) return null;
          return (
            <Link key={vid} href={`/video/${vid}`} className="flex items-center gap-3 p-3 rounded-lg border border-white/10 hover:bg-white/5">
              <img src={v.thumbnail} alt={v.title} className="h-14 w-24 rounded object-cover" />
              <div className="flex-1">
                <div className="text-sm font-medium">{v.title}</div>
                <div className="text-xs text-muted-foreground line-clamp-1">{v.description}</div>
              </div>
              <div className="text-sm text-muted-foreground">{formatBDT(v.price)}</div>
            </Link>
          );
        })}
      </GlassCard>
    </div>
  );
}

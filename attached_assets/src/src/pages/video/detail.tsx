import { useRoute, Link } from "wouter";
import { formatBDT } from "@/lib/format";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Lock, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { getVideoById, packagesContaining } from "@/features/digital-content/data";
import { VideoPlayer } from "@/features/digital-content/components/VideoPlayer";
import { useVideoUnlock } from "@/features/digital-content/VideoUnlockContext";
import { usePKCoin } from "@/features/wallet/PKCoinContext";

export default function VideoDetailPage() {
  const [, params] = useRoute("/video/:id");
  const id = params?.id;
  const v = id ? getVideoById(id) : undefined;
  const { hasVideoUnlocked, unlockVideo } = useVideoUnlock();
  const wallet = usePKCoin();

  if (!v) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10 text-center">
        <h1 className="text-xl font-bold mb-2">Video not found</h1>
        <Link href="/video"><Button variant="outline">Back to library</Button></Link>
      </div>
    );
  }

  const purchase = () => {
    unlockVideo(v.id);
    wallet.earnFromOrder(v.price, true);                              // platform-owned content earns PK Coin
    toast.success("Unlocked!", { description: v.title });
  };

  const bundles = packagesContaining(v.id);
  const unlocked = hasVideoUnlocked(v.id);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      <Link href="/video" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to library
      </Link>

      <VideoPlayer
        videoId={v.id}
        previewUrl={v.previewUrl}
        fullUrl={v.fullUrl}
        previewSeconds={v.previewSeconds}
        thumbnail={v.thumbnail}
        price={v.price}
        currency={v.currency}
        onPurchase={purchase}
      />

      <GlassCard className="p-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold">{v.title}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              by {v.vendor.name} {v.vendor.verified && <span className="text-primary">✓</span>}
            </p>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              {v.tags.map((t) => <Badge key={t} variant="outline">{t}</Badge>)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-primary">{formatBDT(v.price)}</div>
            {unlocked ? (
              <Badge className="mt-2">Unlocked</Badge>
            ) : (
              <Button className="mt-2" onClick={purchase}>
                <Lock className="h-4 w-4 mr-1" /> Unlock full video
              </Button>
            )}
          </div>
        </div>
        <p className="mt-4 text-sm leading-relaxed">{v.description}</p>
      </GlassCard>

      {bundles.length > 0 && (
        <GlassCard className="p-5">
          <div className="flex items-center gap-2 font-semibold mb-3">
            <Sparkles className="h-4 w-4 text-primary" /> Save more with a bundle
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {bundles.map((p) => (
              <Link key={p.id} href={`/video/package/${p.id}`} className="rounded-lg border border-white/10 p-4 hover:bg-white/5">
                <div className="font-medium">{p.title}</div>
                <div className="text-xs text-muted-foreground line-clamp-2">{p.description}</div>
                <div className="text-primary font-semibold mt-2">{formatBDT(p.price)} · {p.videoIds.length} videos</div>
              </Link>
            ))}
          </div>
        </GlassCard>
      )}
    </div>
  );
}

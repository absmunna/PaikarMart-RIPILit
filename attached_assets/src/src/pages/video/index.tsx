import { Link } from "wouter";
import { formatBDT } from "@/lib/format";
import { GlassCard } from "@/components/ui/GlassCard";
import { Play, Lock } from "lucide-react";
import { DIGITAL_VIDEOS, DIGITAL_PACKAGES } from "@/features/digital-content/data";
import { useVideoUnlock } from "@/features/digital-content/VideoUnlockContext";

export default function VideoLibraryPage() {
  const { hasVideoUnlocked, hasPackageUnlocked } = useVideoUnlock();

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
      <header>
        <h1 className="text-2xl md:text-3xl font-bold">Digital Video Library</h1>
        <p className="text-sm text-muted-foreground">
          Watch a free preview, then unlock the full video to keep watching.
        </p>
      </header>

      <section>
        <h2 className="text-lg font-semibold mb-3">Bundles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {DIGITAL_PACKAGES.map((pkg) => {
            const unlocked = hasPackageUnlocked(pkg.id);
            return (
              <Link key={pkg.id} href={`/video/package/${pkg.id}`}>
                <GlassCard className="overflow-hidden cursor-pointer group" hoverEffect>
                  <div className="aspect-video bg-black/40 relative">
                    <img src={pkg.thumbnail} className="w-full h-full object-cover opacity-80" alt={pkg.title} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="rounded-full bg-black/60 backdrop-blur p-3"><Play className="h-6 w-6 text-white" /></div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="font-semibold">{pkg.title}</div>
                    <div className="text-xs text-muted-foreground line-clamp-2">{pkg.description}</div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="text-primary font-bold">{formatBDT(pkg.price)}</div>
                      {unlocked ? (
                        <span className="text-xs text-emerald-400">Owned</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground"><Lock className="h-3 w-3" /> Locked</span>
                      )}
                    </div>
                  </div>
                </GlassCard>
              </Link>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">Individual videos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {DIGITAL_VIDEOS.map((v) => {
            const unlocked = hasVideoUnlocked(v.id);
            return (
              <Link key={v.id} href={`/video/${v.id}`}>
                <GlassCard className="overflow-hidden cursor-pointer group" hoverEffect>
                  <div className="aspect-video bg-black/40 relative">
                    <img src={v.thumbnail} className="w-full h-full object-cover" alt={v.title} />
                    <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-black/60 backdrop-blur px-2 py-0.5 text-[10px] text-white">
                      <Play className="h-3 w-3" /> Free preview · {Math.floor(v.previewSeconds / 60)}m
                    </span>
                  </div>
                  <div className="p-3">
                    <div className="font-medium text-sm line-clamp-1">{v.title}</div>
                    <div className="text-xs text-muted-foreground line-clamp-2">{v.description}</div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="text-primary font-semibold text-sm">{formatBDT(v.price)}</div>
                      {unlocked ? (
                        <span className="text-xs text-emerald-400">Unlocked</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground"><Lock className="h-3 w-3" /> Locked</span>
                      )}
                    </div>
                  </div>
                </GlassCard>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}

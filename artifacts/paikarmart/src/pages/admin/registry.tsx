import { Layout } from "@/components/layout/Layout";
import { GlassCard } from "@/components/ui/GlassCard";

const SLOTS = [
  { id: "post.card", description: "Social feed post card", variants: ["default"] },
  { id: "product.card", description: "Product listing card", variants: ["default"] },
  { id: "vendor.card", description: "Vendor/seller card", variants: ["default"] },
  { id: "video.player", description: "Digital content video player", variants: ["default"] },
];

export default function AdminRegistryPage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 space-y-6 max-w-4xl">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">UI Component Registry</h1>
          <p className="text-sm text-white/50 mt-1">
            Swap component variants without touching code. Add new variants by registering them in
            <code className="mx-1 text-white/70">src/features/registry/componentRegistry.ts</code>.
          </p>
        </div>

        <GlassCard className="p-0 overflow-hidden">
          <ul className="divide-y divide-white/5">
            {SLOTS.map((slot) => (
              <li key={slot.id} className="p-4 flex items-center gap-4">
                <div className="flex-1">
                  <div className="font-mono text-sm text-white">{slot.id}</div>
                  <div className="text-xs text-white/50 mt-0.5">{slot.description}</div>
                </div>
                <div className="text-xs text-white/40">
                  {slot.variants.length} variant{slot.variants.length !== 1 ? "s" : ""}
                </div>
                <span className="text-xs px-2 py-1 rounded bg-primary/20 text-primary">
                  {slot.variants[0]}
                </span>
              </li>
            ))}
          </ul>
        </GlassCard>

        <GlassCard className="p-5">
          <h2 className="font-semibold text-white mb-3">How it works</h2>
          <ol className="space-y-2 text-sm text-white/60 list-decimal list-inside">
            <li>Register a new variant in <code className="text-white/80">componentRegistry.ts</code> by adding a lazy import under the slot's <code className="text-white/80">variants</code> key.</li>
            <li>Select the active variant here — it persists to localStorage.</li>
            <li>Pages render the active variant via <code className="text-white/80">&lt;Slot id="post.card" /&gt;</code> without any code change.</li>
          </ol>
        </GlassCard>
      </div>
    </Layout>
  );
}

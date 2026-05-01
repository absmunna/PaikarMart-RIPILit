import { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { listSlots, setActiveVariant, type SlotId } from "@/features/registry/componentRegistry";
import { logChange } from "@/features/registry/aiLogger";

export default function AdminRegistryPage() {
  const [rows, setRows] = useState(listSlots());

  useEffect(() => {
    const fn = () => setRows(listSlots());
    window.addEventListener("pm:registry:changed", fn);
    return () => window.removeEventListener("pm:registry:changed", fn);
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
      <h1 className="text-2xl md:text-3xl font-bold">UI Component Registry</h1>
      <p className="text-sm text-muted-foreground">
        Swap component variants without touching code. Add new variants by registering them in
        <code className="mx-1 text-foreground">src/features/registry/componentRegistry.ts</code>.
      </p>

      <GlassCard className="p-0 overflow-hidden">
        <ul>
          {rows.map((r) => (
            <li key={r.id} className="p-4 border-b border-white/5 last:border-b-0 flex items-center gap-3">
              <div className="flex-1">
                <div className="font-mono text-sm">{r.id}</div>
                <div className="text-xs text-muted-foreground">{r.variants.length} variant(s)</div>
              </div>
              <Select
                value={r.active}
                onValueChange={(v) => {
                  setActiveVariant(r.id as SlotId, v);
                  logChange({ scope: "registry", actor: "admin", summary: `${r.id} → ${v}` });
                }}
              >
                <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {r.variants.map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                </SelectContent>
              </Select>
            </li>
          ))}
        </ul>
      </GlassCard>
    </div>
  );
}

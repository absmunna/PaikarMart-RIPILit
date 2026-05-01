import { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";
import { clearLog, readLog, type AIChange } from "@/features/registry/aiLogger";

export default function AdminChangesPage() {
  const [list, setList] = useState<AIChange[]>(() => readLog());

  useEffect(() => {
    const fn = () => setList(readLog());
    window.addEventListener("pm:ai:logged", fn);
    return () => window.removeEventListener("pm:ai:logged", fn);
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold">AI Change Log</h1>
        <Button variant="outline" onClick={() => { clearLog(); setList([]); }}>
          <Trash2 className="h-4 w-4 mr-1" /> Clear
        </Button>
      </div>

      <GlassCard className="p-0 overflow-hidden">
        {list.length === 0 ? (
          <div className="p-6 text-center text-sm text-muted-foreground">No changes recorded yet.</div>
        ) : (
          <ul>
            {list.map((c) => (
              <li key={c.id} className="p-4 border-b border-white/5 last:border-b-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className="capitalize">{c.scope}</Badge>
                  <Badge variant="secondary" className="capitalize">{c.actor}</Badge>
                  <span className="text-xs text-muted-foreground">{new Date(c.at).toLocaleString()}</span>
                </div>
                <div className="mt-1 text-sm">{c.summary}</div>
                {c.details && (
                  <pre className="mt-2 bg-black/40 rounded p-2 text-[11px] text-muted-foreground overflow-x-auto">
{JSON.stringify(c.details, null, 2)}
                  </pre>
                )}
              </li>
            ))}
          </ul>
        )}
      </GlassCard>
    </div>
  );
}

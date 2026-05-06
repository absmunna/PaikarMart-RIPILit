import { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
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
    <Layout>
      <div className="container mx-auto px-4 py-8 space-y-6 max-w-4xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">Admin Change Log</h1>
            <p className="text-sm text-white/50 mt-1">All admin and system configuration changes.</p>
          </div>
          <Button variant="outline" onClick={() => { clearLog(); setList([]); toast(); }}
            className="bg-white/5 border-white/10 text-white/70 hover:bg-white/10">
            <Trash2 className="h-4 w-4 mr-2" /> Clear log
          </Button>
        </div>

        <GlassCard className="p-0 overflow-hidden">
          {list.length === 0 ? (
            <div className="p-10 text-center text-sm text-white/40">No changes recorded yet.</div>
          ) : (
            <ul className="divide-y divide-white/5">
              {list.map((c) => (
                <li key={c.id} className="p-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className="capitalize border-white/20 text-white/70">{c.scope}</Badge>
                    <Badge variant="secondary" className="capitalize">{c.actor}</Badge>
                    <span className="text-xs text-white/40">{new Date(c.at).toLocaleString()}</span>
                  </div>
                  <div className="mt-1.5 text-sm text-white">{c.summary}</div>
                  {!!c.details && (
                    <pre className="mt-2 bg-black/40 rounded p-2 text-[11px] text-white/50 overflow-x-auto">
                      {JSON.stringify(c.details as object, null, 2)}
                    </pre>
                  )}
                </li>
              ))}
            </ul>
          )}
        </GlassCard>
      </div>
    </Layout>
  );
}

function toast() {
  import("sonner").then(({ toast }) => toast.success("Change log cleared"));
}

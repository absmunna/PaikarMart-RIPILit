import { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { getFlags, setFlag, resetFlags, type FeatureFlags } from "@/config/feature.flags";
import { getProfitShare, setProfitShare, type ProfitShareConfig } from "@/config/profitShare.config";
import { PAYMENT_GATEWAYS } from "@/config/payment.config";
import { DELIVERY_PROVIDERS } from "@/config/delivery.config";
import { logChange } from "@/features/registry/aiLogger";

export default function AdminSettingsPage() {
  const [flags, setFlags] = useState<FeatureFlags>(getFlags());
  const [profit, setProfit] = useState<ProfitShareConfig>(getProfitShare());

  useEffect(() => {
    const onFlags = () => setFlags(getFlags());
    const onProfit = () => setProfit(getProfitShare());
    window.addEventListener("pm:flags:changed", onFlags);
    window.addEventListener("pm:profitShare:changed", onProfit);
    return () => {
      window.removeEventListener("pm:flags:changed", onFlags);
      window.removeEventListener("pm:profitShare:changed", onProfit);
    };
  }, []);

  const toggleFlag = (k: keyof FeatureFlags, v: boolean) => {
    setFlag(k, v);
    setFlags((s) => ({ ...s, [k]: v }));
    logChange({ scope: "feature-flag", actor: "admin", summary: `Toggled ${k} → ${v ? "ON" : "OFF"}` });
  };

  const saveProfit = () => {
    setProfitShare(profit);
    logChange({ scope: "profit-share", actor: "admin", summary: "Updated profit-share config", details: { ...profit } });
    toast.success("Profit-share config saved");
  };

  const totalShare = profit.platformPercent + profit.sellerPercent + profit.affiliatePercent;
  const valid = totalShare <= 100;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 space-y-6 max-w-5xl">
        <h1 className="text-2xl md:text-3xl font-bold text-white">Platform Settings</h1>

        <GlassCard className="p-6">
          <h2 className="font-semibold text-white mb-4">Profit Share & PK Coin</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-white/70">Platform %</Label>
              <Input type="number" value={profit.platformPercent}
                onChange={(e) => setProfit({ ...profit, platformPercent: Number(e.target.value) })}
                className="bg-white/5 border-white/10 text-white" />
            </div>
            <div className="space-y-1">
              <Label className="text-white/70">Seller %</Label>
              <Input type="number" value={profit.sellerPercent}
                onChange={(e) => setProfit({ ...profit, sellerPercent: Number(e.target.value) })}
                className="bg-white/5 border-white/10 text-white" />
            </div>
            <div className="space-y-1">
              <Label className="text-white/70">Affiliate %</Label>
              <Input type="number" value={profit.affiliatePercent}
                onChange={(e) => setProfit({ ...profit, affiliatePercent: Number(e.target.value) })}
                className="bg-white/5 border-white/10 text-white" />
            </div>
            <div className="space-y-1">
              <Label className="text-white/70">PK Coin reward %</Label>
              <Input type="number" value={profit.pkCoinRewardPercent}
                onChange={(e) => setProfit({ ...profit, pkCoinRewardPercent: Number(e.target.value) })}
                className="bg-white/5 border-white/10 text-white" />
            </div>
            <label className="flex items-center gap-3 md:col-span-2 text-sm text-white/70 cursor-pointer">
              <Switch checked={profit.pkCoinOnlyOnOwnProducts}
                onCheckedChange={(v) => setProfit({ ...profit, pkCoinOnlyOnOwnProducts: v })} />
              Award PK Coin only on PaikarMart-owned products
            </label>
          </div>
          <div className={`mt-3 text-xs ${valid ? "text-white/40" : "text-red-400"}`}>
            Total share: {totalShare}% {!valid && "(exceeds 100% — please fix before saving)"}
          </div>
          <Button className="mt-4 bg-primary hover:bg-primary/90" disabled={!valid} onClick={saveProfit}>
            Save profit-share
          </Button>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white">Feature Flags</h2>
            <Button variant="outline" size="sm" onClick={() => { resetFlags(); setFlags(getFlags()); toast.success("Flags reset to defaults"); }}
              className="bg-white/5 border-white/10 text-white/70 hover:bg-white/10 text-xs">
              Reset to defaults
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {(Object.keys(flags) as (keyof FeatureFlags)[]).map((k) => (
              <label key={k} className="flex items-center justify-between gap-3 rounded-lg border border-white/10 p-3 cursor-pointer hover:bg-white/5 transition-colors">
                <span className="text-sm font-mono text-white/80">{k}</span>
                <Switch checked={!!flags[k]} onCheckedChange={(v) => toggleFlag(k, v)} />
              </label>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h2 className="font-semibold text-white mb-4">Payment Gateways</h2>
          <div className="space-y-2">
            {PAYMENT_GATEWAYS.map((g) => (
              <div key={g.id} className="flex items-center justify-between rounded-lg border border-white/10 p-3">
                <div>
                  <div className="text-sm font-medium text-white">{g.name}</div>
                  <div className="text-xs text-white/50">{g.currency} · fee {g.feePercent}%</div>
                </div>
                <span className={g.enabled ? "text-emerald-400 text-xs" : "text-white/30 text-xs"}>
                  {g.enabled ? (g.mock ? "Enabled (mock)" : "Live") : "Disabled"}
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-white/40 mt-3">Toggle providers in <code className="text-white/60">src/config/payment.config.ts</code></p>
        </GlassCard>

        <GlassCard className="p-6">
          <h2 className="font-semibold text-white mb-4">Delivery Providers</h2>
          <div className="space-y-2">
            {DELIVERY_PROVIDERS.map((d) => (
              <div key={d.id} className="flex items-center justify-between rounded-lg border border-white/10 p-3">
                <div>
                  <div className="text-sm font-medium text-white">{d.name}</div>
                  <div className="text-xs text-white/50">
                    Base ৳{d.baseChargeBDT} · +৳{d.perKgBDT}/kg · {d.estimatedDays}
                  </div>
                </div>
                <span className={d.enabled ? "text-emerald-400 text-xs" : "text-white/30 text-xs"}>
                  {d.enabled ? "Enabled" : "Disabled"}
                </span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </Layout>
  );
}

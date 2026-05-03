import { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

import { DEFAULT_FEATURE_FLAGS, getFlags, setFlag, type FeatureFlagKey } from "@/config/feature.flags";
import { getProfitShare, setProfitShare, type ProfitShareConfig } from "@/config/profitShare.config";
import { PAYMENT_GATEWAYS } from "@/config/payment.config";
import { DELIVERY_PROVIDERS } from "@/config/delivery.config";
import { logChange } from "@/features/registry/aiLogger";

export default function AdminSettingsPage() {
  const [flags, setFlags] = useState(getFlags());
  const [profit, setProfit] = useState<ProfitShareConfig>(getProfitShare());

  useEffect(() => {
    const onFlagsChange = () => setFlags(getFlags());
    const onProfitChange = () => setProfit(getProfitShare());
    window.addEventListener("pm:flags:changed", onFlagsChange);
    window.addEventListener("pm:profit:changed", onProfitChange);
    return () => {
      window.removeEventListener("pm:flags:changed", onFlagsChange);
      window.removeEventListener("pm:profit:changed", onProfitChange);
    };
  }, []);

  const toggleFlag = (k: FeatureFlagKey, v: boolean) => {
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
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold">Platform Settings</h1>

      <GlassCard className="p-5">
        <h2 className="font-semibold mb-4">Profit share & PK Coin</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1"><Label>Platform %</Label><Input type="number" value={profit.platformPercent} onChange={(e) => setProfit({ ...profit, platformPercent: Number(e.target.value) })} /></div>
          <div className="space-y-1"><Label>Seller %</Label><Input type="number" value={profit.sellerPercent} onChange={(e) => setProfit({ ...profit, sellerPercent: Number(e.target.value) })} /></div>
          <div className="space-y-1"><Label>Affiliate %</Label><Input type="number" value={profit.affiliatePercent} onChange={(e) => setProfit({ ...profit, affiliatePercent: Number(e.target.value) })} /></div>
          <div className="space-y-1"><Label>PK Coin reward %</Label><Input type="number" value={profit.pkCoinRewardPercent} onChange={(e) => setProfit({ ...profit, pkCoinRewardPercent: Number(e.target.value) })} /></div>
          <label className="flex items-center gap-2 md:col-span-2 text-sm">
            <Switch checked={profit.pkCoinOnlyOnOwnProducts} onCheckedChange={(v) => setProfit({ ...profit, pkCoinOnlyOnOwnProducts: v })} />
            Award PK Coin only on PaikarMart-owned products
          </label>
        </div>
        <div className={`mt-3 text-xs ${valid ? "text-muted-foreground" : "text-rose-400"}`}>
          Total: {totalShare}% {valid ? "" : "(exceeds 100%)"}
        </div>
        <Button className="mt-4" disabled={!valid} onClick={saveProfit}>Save profit-share</Button>
      </GlassCard>

      <GlassCard className="p-5">
        <h2 className="font-semibold mb-4">Feature flags</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {(Object.keys(DEFAULT_FEATURE_FLAGS) as FeatureFlagKey[]).map((k) => (
            <label key={k} className="flex items-center justify-between gap-3 rounded-lg border border-white/10 p-3">
              <span className="text-sm font-mono">{k}</span>
              <Switch checked={!!flags[k]} onCheckedChange={(v) => toggleFlag(k, v)} />
            </label>
          ))}
        </div>
      </GlassCard>

      <GlassCard className="p-5">
        <h2 className="font-semibold mb-4">Payment gateways</h2>
        <div className="space-y-2">
          {PAYMENT_GATEWAYS.map((g) => (
            <div key={g.id} className="flex items-center justify-between rounded-lg border border-white/10 p-3">
              <div>
                <div className="text-sm font-medium">{g.label}</div>
                <div className="text-xs text-muted-foreground">{g.region} · {g.currencies.join(", ")}</div>
              </div>
              <span className={g.enabled ? "text-emerald-400 text-xs" : "text-muted-foreground text-xs"}>
                {g.enabled ? (g.mock ? "Enabled (mock)" : "Enabled") : "Disabled"}
              </span>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Toggle providers in <code>src/config/payment.config.ts</code>. Stripe / bKash / Nagad SDKs wire up to the same interface.
        </p>
      </GlassCard>

      <GlassCard className="p-5">
        <h2 className="font-semibold mb-4">Delivery providers</h2>
        <div className="space-y-2">
          {DELIVERY_PROVIDERS.map((d) => (
            <div key={d.id} className="flex items-center justify-between rounded-lg border border-white/10 p-3">
              <div>
                <div className="text-sm font-medium">{d.label}</div>
                <div className="text-xs text-muted-foreground">
                  {d.region} · base {d.baseFee} · per kg {d.perKgFee} · {d.estDays[0]}-{d.estDays[1]} days
                </div>
              </div>
              <span className={d.enabled ? "text-emerald-400 text-xs" : "text-muted-foreground text-xs"}>
                {d.enabled ? "Enabled" : "Disabled"}
              </span>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

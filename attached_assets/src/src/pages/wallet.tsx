import { GlassCard } from "@/components/ui/GlassCard";
import { Coins, ArrowDown, ArrowUp, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePKCoin } from "@/features/wallet/PKCoinContext";
import { getProfitShare } from "@/config/profitShare.config";

const KIND_ICON = {
  earn:   { Icon: ArrowDown, color: "text-emerald-400" },
  bonus:  { Icon: Gift,      color: "text-amber-400" },
  refund: { Icon: ArrowDown, color: "text-blue-400" },
  spend:  { Icon: ArrowUp,   color: "text-rose-400" },
} as const;

export default function WalletPage() {
  const wallet = usePKCoin();
  const cfg = getProfitShare();

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <GlassCard className="p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-12 w-12 rounded-full bg-primary/15 flex items-center justify-center">
            <Coins className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">PK Coin Wallet</h1>
            <p className="text-sm text-muted-foreground">
              Earn {cfg.pkCoinRewardPercent}% back on PaikarMart-owned products.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="rounded-lg border border-white/10 p-4">
            <div className="text-xs text-muted-foreground">Balance</div>
            <div className="text-2xl font-bold text-primary">{wallet.balance} PKC</div>
          </div>
          <div className="rounded-lg border border-white/10 p-4">
            <div className="text-xs text-muted-foreground">Lifetime earned</div>
            <div className="text-2xl font-bold">{wallet.lifetimeEarned}</div>
          </div>
          <div className="rounded-lg border border-white/10 p-4">
            <div className="text-xs text-muted-foreground">Lifetime spent</div>
            <div className="text-2xl font-bold">{wallet.lifetimeSpent}</div>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <Button onClick={() => wallet.bonus(50, "Demo bonus")}>+ 50 PKC bonus (demo)</Button>
          <Button variant="outline" onClick={() => wallet.spend(20, "Demo spend")}>- 20 PKC spend (demo)</Button>
        </div>
      </GlassCard>

      <GlassCard className="p-0 overflow-hidden">
        <div className="p-4 border-b border-white/10 font-semibold">Transactions</div>
        {wallet.history.length === 0 ? (
          <div className="p-6 text-center text-sm text-muted-foreground">No transactions yet.</div>
        ) : (
          <ul>
            {wallet.history.map((tx) => {
              const meta = KIND_ICON[tx.kind];
              const I = meta.Icon;
              return (
                <li key={tx.id} className="flex items-center gap-3 p-3 border-b border-white/5 last:border-b-0">
                  <I className={`h-4 w-4 ${meta.color}`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm capitalize">{tx.kind} · {tx.note ?? "—"}</div>
                    <div className="text-xs text-muted-foreground">{new Date(tx.at).toLocaleString()}</div>
                  </div>
                  <div className={`font-mono text-sm ${meta.color}`}>
                    {tx.kind === "spend" ? "-" : "+"}{tx.amount}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </GlassCard>
    </div>
  );
}

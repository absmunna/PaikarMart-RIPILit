import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Wallet as WalletIcon, ArrowUpRight, ArrowDownRight, TrendingUp, Lock, Gift, BarChart3, ArrowLeft, X } from "lucide-react";
import { useWallet } from "@/features/wallet/wallet.context";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { formatPrice } from "@/utils/formatPrice";
import Loader from "@/components/common/Loader";

const MOCK_GRAPH = [30, 55, 40, 70, 60, 85, 75, 90, 80, 95, 88, 100];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function BarGraph({ data, labels }: { data: number[]; labels: string[] }) {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-1.5 h-32 relative">
      {data.map((v, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
          <div
            className="w-full rounded-t-md transition-all duration-500 group-hover:opacity-80"
            style={{
              height: `${(v / max) * 100}%`,
              minHeight: 4,
              background:
                "linear-gradient(to top, rgb(var(--primary)), rgba(var(--primary) / 0.4))",
              boxShadow: "0 0 12px rgba(var(--primary) / 0.4)",
            }}
          />
          <span className="text-[9px] text-[rgb(var(--text-subtle))]">{labels[i]}</span>
        </div>
      ))}
    </div>
  );
}

function MoneyDialog({
  mode,
  open,
  onClose,
  onConfirm,
  maxBalance,
}: {
  mode: "deposit" | "withdraw";
  open: boolean;
  onClose: () => void;
  onConfirm: (amount: number) => void;
  maxBalance: number;
}) {
  const [amount, setAmount] = useState("");
  if (!open) return null;
  const num = parseInt(amount.replace(/[^0-9]/g, ""), 10) || 0;
  const isWithdraw = mode === "withdraw";
  const tooMuch = isWithdraw && num > maxBalance;
  const valid = num > 0 && !tooMuch;

  return (
    <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-[420px] glass-strong rounded-t-2xl sm:rounded-2xl border border-[rgba(var(--glass-stroke)/0.3)] p-5 m-0 sm:m-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg text-[rgb(var(--text))]">
            {isWithdraw ? "Withdraw to bKash / Bank" : "Deposit to wallet"}
          </h3>
          <button onClick={onClose} className="h-8 w-8 rounded-full glass flex items-center justify-center">
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="text-xs text-[rgb(var(--text-muted))] mb-3">
          {isWithdraw
            ? `Available: ${formatPrice(maxBalance)} · Min ৳100, max ৳50,000 per request.`
            : "Funds are added instantly in this demo. Real gateways come with the backend."}
        </p>
        <Input
          type="text"
          inputMode="numeric"
          placeholder="Amount in ৳"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="text-lg font-bold"
        />
        {tooMuch && (
          <p className="text-xs text-red-500 mt-2">Amount exceeds your available balance.</p>
        )}
        <div className="flex gap-2 mt-3">
          {[500, 1000, 2500, 5000].map((v) => (
            <button
              key={v}
              onClick={() => setAmount(String(v))}
              className="flex-1 py-1.5 rounded-full text-xs font-semibold bg-[rgba(var(--glass-tint)/0.1)] hover:bg-[rgba(var(--glass-tint)/0.2)] text-[rgb(var(--text))]"
            >
              ৳{v}
            </button>
          ))}
        </div>
        <Button
          fullWidth
          className="mt-4 h-11 font-bold glow-primary press"
          disabled={!valid}
          onClick={() => valid && onConfirm(num)}
        >
          {isWithdraw ? "Confirm withdraw" : "Add funds"}
        </Button>
      </div>
    </div>
  );
}

export default function WalletPage() {
  const navigate = useNavigate();
  const { wallet, isLoading } = useWallet();
  const [dialog, setDialog] = useState<"deposit" | "withdraw" | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  if (isLoading) return <Loader full />;
  if (!wallet) return null;

  const handleConfirm = (amount: number) => {
    const action = dialog === "withdraw" ? "Withdraw" : "Deposit";
    setDialog(null);
    setToast(`${action} of ${formatPrice(amount)} requested. (Connects to backend later.)`);
    setTimeout(() => setToast(null), 2800);
  };

  return (
    <div className="min-h-screen pb-24 px-4 pt-4 flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="h-9 w-9 flex items-center justify-center rounded-full glass hover:bg-[rgba(var(--glass-tint)/0.2)]">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-xl font-bold text-[rgb(var(--text))]">My Wallet</h1>
      </div>

      {/* Main Balance */}
      <Card className="bg-gradient-to-br from-emerald-600 to-[rgb(var(--primary))] text-white border-none shadow-glow p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-white/80 text-sm mb-1">Available Balance</p>
            <h2 className="text-4xl font-extrabold tracking-tight">{formatPrice(wallet.balance)}</h2>
          </div>
          <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-md">
            <WalletIcon className="h-5 w-5 text-white" />
          </div>
        </div>
        <div className="flex gap-3 mt-4">
          <button
            onClick={() => setDialog("withdraw")}
            className="flex-1 bg-white/15 hover:bg-white/25 transition rounded-xl py-2.5 flex items-center justify-center gap-1.5 text-sm font-semibold press"
          >
            <ArrowUpRight className="h-4 w-4" /> Withdraw
          </button>
          <button
            onClick={() => setDialog("deposit")}
            className="flex-1 bg-white/15 hover:bg-white/25 transition rounded-xl py-2.5 flex items-center justify-center gap-1.5 text-sm font-semibold press"
          >
            <ArrowDownRight className="h-4 w-4" /> Deposit
          </button>
        </div>
      </Card>

      <MoneyDialog
        mode={dialog ?? "deposit"}
        open={dialog !== null}
        onClose={() => setDialog(null)}
        onConfirm={handleConfirm}
        maxBalance={wallet.balance}
      />

      {toast && (
        <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-[90] glass-strong border border-[rgba(var(--glass-stroke)/0.3)] rounded-full px-4 py-2 text-xs font-medium text-[rgb(var(--text))] shadow-lg max-w-[90%] text-center">
          {toast}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-1.5 text-sm font-medium text-[rgb(var(--text-muted))] mb-2">
            <Gift className="h-4 w-4 text-[rgb(var(--primary))]" /> Total Earned
          </div>
          <h3 className="text-xl font-bold text-[rgb(var(--text))] mb-1">{formatPrice(wallet.totalEarned)}</h3>
          <Badge variant="success" className="text-[9px]">2-3% reward</Badge>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-1.5 text-sm font-medium text-[rgb(var(--text-muted))] mb-2">
            <TrendingUp className="h-4 w-4 text-blue-500" /> Investments
          </div>
          <h3 className="text-xl font-bold text-[rgb(var(--text))] mb-1">{formatPrice(wallet.investmentValue)}</h3>
          <Badge variant="default" className="text-[9px] gap-1"><Lock className="h-2 w-2" /> Coming Soon</Badge>
        </Card>
      </div>

      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-[rgb(var(--text))] flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-[rgb(var(--primary))]" /> Monthly Activity
          </h3>
          <Badge variant="warning">Preview</Badge>
        </div>
        <BarGraph data={MOCK_GRAPH} labels={MONTHS} />
      </Card>

      <div>
        <h2 className="text-lg font-bold mb-3 text-[rgb(var(--text))]">Recent Transactions</h2>
        <Card className="flex flex-col overflow-hidden">
          {wallet.transactions.length ? (
            <div className="divide-y divide-[rgba(var(--glass-stroke)/0.1)]">
              {wallet.transactions.map(tx => (
                <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-[rgba(var(--glass-tint)/0.05)] transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${
                      tx.type === "reward" ? "bg-[rgba(var(--primary)/0.15)] text-[rgb(var(--primary))]" : "bg-blue-500/15 text-blue-500"
                    }`}>
                      {tx.type === "reward" ? <Gift className="h-5 w-5" /> : tx.type === "deposit" ? <ArrowDownRight className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-[rgb(var(--text))] capitalize">{tx.type}</p>
                      <p className="text-xs text-[rgb(var(--text-muted))] mt-0.5">{tx.description || tx.createdAt.split("T")[0]}</p>
                    </div>
                  </div>
                  <div className={`font-bold text-base ${tx.amount > 0 ? "text-[rgb(var(--primary))]" : "text-[rgb(var(--text))]"}`}>
                    {tx.amount > 0 ? "+" : ""}{formatPrice(tx.amount)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-[rgb(var(--text-muted))]">No transactions yet</div>
          )}
        </Card>
      </div>
    </div>
  );
}

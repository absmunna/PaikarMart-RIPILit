import { Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/Card";
import { formatPrice } from "@/utils/formatPrice";
import { useWallet } from "@/features/wallet/wallet.context";

export function WalletCard() {
  const { wallet } = useWallet();

  return (
    <Link to="/wallet" className="block">
      <Card className="p-4 grad-aurora text-white border-none shadow-glow transition-transform hover:-translate-y-1">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-white/80 text-xs font-medium mb-1">Available Balance</p>
            <h3 className="text-2xl font-bold tracking-tight">
              {formatPrice(wallet?.balance || 0)}
            </h3>
          </div>
          <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-md">
            <Wallet className="h-5 w-5 text-white" />
          </div>
        </div>
        <div className="flex items-center justify-between text-xs text-white/90">
          <span>Tap to view details</span>
          <span className="font-medium">+ {formatPrice(wallet?.totalEarned || 0)} earned</span>
        </div>
      </Card>
    </Link>
  );
}

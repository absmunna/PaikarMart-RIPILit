import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, TrendingUp, Package, ShoppingBag, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { formatPrice } from "@/utils/formatPrice";
import { useAuth } from "@/features/auth/auth.context";
import { useEffect } from "react";

export default function SellerDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { handle } = useParams();

  useEffect(() => {
    if (user && handle !== user.handle.replace("@", "")) {
      navigate(`/seller/${user.handle.replace("@", "")}/dashboard`, { replace: true });
    }
  }, [user, handle, navigate]);

  if (!user || handle !== user.handle.replace("@", "")) {
    return null; // or loading state
  }

  const metrics = {
    wholesale: { revenue: 18400, orders: 12, label: "Quote requests" },
    retail: { revenue: 12500, orders: 8, label: "Pending orders" },
    service: { revenue: 9600, orders: 5, label: "Bookings" },
    content_creator: { revenue: 14800, orders: 22, label: "Subscribers" },
  } as const;

  const sellerType = user.sellerType ?? "retail";
  const currentMetrics = metrics[sellerType];

  return (
    <div className="min-h-screen pb-24 px-4 pt-4 flex flex-col gap-6">
      <div className="flex items-center gap-3 mb-2">
        <button onClick={() => navigate(-1)} className="h-9 w-9 flex items-center justify-center rounded-full glass hover:bg-[rgba(var(--glass-tint)/0.2)]">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-xl font-bold text-[rgb(var(--text))]">Dashboard</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 bg-[rgba(var(--primary)/0.05)] border-[rgba(var(--primary)/0.2)]">
          <div className="flex items-center gap-2 text-[rgb(var(--primary))] mb-2">
            <TrendingUp className="h-4 w-4" />
            <span className="font-semibold text-sm">Revenue (Today)</span>
          </div>
          <p className="text-2xl font-bold text-[rgb(var(--text))]">{formatPrice(12500)}</p>
        </Card>
        <Card className="p-4 bg-blue-500/5 border-blue-500/20">
          <div className="flex items-center gap-2 text-blue-500 mb-2">
            <ShoppingBag className="h-4 w-4" />
            <span className="font-semibold text-sm">{currentMetrics.label}</span>
          </div>
          <p className="text-2xl font-bold text-[rgb(var(--text))]">{currentMetrics.orders} <span className="text-sm font-normal text-[rgb(var(--text-muted))]">pending</span></p>
        </Card>
      </div>

      {/* Alerts */}
      <Card className="p-4 border-yellow-500/30 bg-yellow-500/5">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-yellow-600 dark:text-yellow-400 text-sm">Low Stock Alert</h3>
            <p className="text-sm text-[rgb(var(--text-muted))] mt-1">"Premium Kurta Set" has only 2 items left in inventory.</p>
          </div>
        </div>
      </Card>

      {/* Quick Links */}
      <div>
        <h2 className="text-lg font-bold text-[rgb(var(--text))] mb-3">Management</h2>
        <div className="flex flex-col gap-2">
          <Link to="products" className="glass-card p-4 flex items-center justify-between hover:border-[rgba(var(--primary)/0.3)] transition-colors">
            <div className="flex items-center gap-3">
              <Package className="h-5 w-5 text-[rgb(var(--text-muted))]" />
              <span className="font-semibold">Manage Products</span>
            </div>
            <span className="text-sm text-[rgb(var(--text-muted))]">24 items</span>
          </Link>
          <Link to="orders" className="glass-card p-4 flex items-center justify-between hover:border-[rgba(var(--primary)/0.3)] transition-colors">
            <div className="flex items-center gap-3">
              <ShoppingBag className="h-5 w-5 text-[rgb(var(--text-muted))]" />
              <span className="font-semibold">Manage Orders</span>
            </div>
            <span className="text-sm text-[rgb(var(--text-muted))]">View all</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

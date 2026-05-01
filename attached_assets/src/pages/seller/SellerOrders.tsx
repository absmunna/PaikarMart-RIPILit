import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Package, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/utils/formatPrice";
import { listSellerOrders, type Order } from "@/features/orders/order.api";
import { useAuth } from "@/features/auth/auth.context";

function relativeDate(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const day = 86400000;
  if (diff < day) return "Today";
  if (diff < 2 * day) return "Yesterday";
  return new Date(iso).toLocaleDateString("en-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function SellerOrders() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { handle } = useParams();
  const [orders, setOrders] = useState<Order[] | null>(null);

  useEffect(() => {
    if (user && handle !== user.handle.replace("@", "")) {
      navigate(`/seller/${user.handle.replace("@", "")}/orders`, { replace: true });
    }
  }, [user, handle, navigate]);

  if (!user || handle !== user.handle.replace("@", "")) {
    return null;
  }

  useEffect(() => {
    if (!user) return;
    listSellerOrders(user.id).then(setOrders).catch(() => setOrders([]));
  }, [user]);

  const getStatusColor = (status: string) => {
    if (status === "Delivered") return "success";
    if (status === "Processing") return "warning";
    return "primary";
  };

  return (
    <div className="min-h-screen pb-24 px-4 pt-4 flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="h-9 w-9 flex items-center justify-center rounded-full glass hover:bg-[rgba(var(--glass-tint)/0.2)]">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-xl font-bold text-[rgb(var(--text))]">My Orders</h1>
      </div>

      {orders === null ? (
        <div className="flex flex-col gap-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="glass-card p-4 h-24 animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-20 w-20 rounded-full glass flex items-center justify-center text-[rgb(var(--text-muted))] mb-4">
            <Package className="h-10 w-10" />
          </div>
          <h2 className="text-lg font-bold mb-2">No orders yet</h2>
          <p className="text-[rgb(var(--text-muted))] mb-6">Orders from your products will appear here.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map((order) => (
            <div
              key={order.id}
              className="glass-card p-4 cursor-pointer hover:bg-[rgba(var(--glass-tint)/0.1)]"
              onClick={() => navigate(`/orders/${order.id}`)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[rgb(var(--text))]">#{order.id.slice(-8)}</span>
                  <Badge variant={getStatusColor(order.status)} className="text-xs">
                    {order.status}
                  </Badge>
                </div>
                <ChevronRight className="h-4 w-4 text-[rgb(var(--text-muted))]" />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[rgb(var(--text-muted))]">{relativeDate(order.createdAt)}</span>
                <span className="font-semibold text-[rgb(var(--text))]">{formatPrice(order.total)}</span>
              </div>
              <div className="text-xs text-[rgb(var(--text-muted))] mt-1">
                {Array.isArray(order.items) ? order.items.length : 0} item{Array.isArray(order.items) && order.items.length !== 1 ? 's' : ''}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
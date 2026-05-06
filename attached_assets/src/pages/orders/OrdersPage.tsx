import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Package, ChevronRight, ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/utils/formatPrice";
import { listOrders, type Order } from "@/features/orders/order.api";

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

export default function OrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[] | null>(null);

  useEffect(() => {
    listOrders().then(setOrders).catch(() => setOrders([]));
  }, []);

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
            <ShoppingBag className="h-10 w-10" />
          </div>
          <h2 className="text-lg font-bold mb-2">No orders yet</h2>
          <p className="text-[rgb(var(--text-muted))] mb-6">Place your first order from the marketplace.</p>
          <Button onClick={() => navigate("/marketplace")}>Start Shopping</Button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => {
            const itemCount = Array.isArray(order.items)
              ? order.items.reduce((s, i) => s + (i.qty || 0), 0)
              : 0;
            const shortId = order.id.length > 12 ? `ORD-${order.id.slice(0, 6).toUpperCase()}` : order.id;
            return (
              <Link
                key={order.id}
                to={`/orders/${order.id}`}
                className="glass-card p-4 hover:border-[rgba(var(--primary)/0.3)] transition-colors"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-[rgb(var(--text))]">{shortId}</h3>
                    <p className="text-xs text-[rgb(var(--text-muted))] mt-1">{relativeDate(order.createdAt)}</p>
                  </div>
                  <Badge variant={getStatusColor(order.status) as any}>{order.status}</Badge>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-[rgba(var(--glass-stroke)/0.1)]">
                  <div className="flex items-center gap-2 text-sm text-[rgb(var(--text-muted))]">
                    <Package className="h-4 w-4" /> {itemCount} {itemCount === 1 ? "Item" : "Items"}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[rgb(var(--text))]">{formatPrice(order.total)}</span>
                    <ChevronRight className="h-4 w-4 text-[rgb(var(--text-muted))]" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

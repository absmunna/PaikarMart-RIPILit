import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, CheckCircle2, Circle, Truck, Phone, MessageCircle, X } from "lucide-react";
import { formatPrice } from "@/utils/formatPrice";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { getOrder, type Order } from "@/features/orders/order.api";

function buildTimeline(status: string, placedAt: string) {
  const placed = new Date(placedAt);
  const fmt = (d: Date) =>
    d.toLocaleString("en-BD", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
  const order = ["Processing", "Packed", "Shipped", "Delivered"];
  const idx = Math.max(0, order.indexOf(status));
  return [
    { label: "Order Placed", date: fmt(placed), done: true },
    { label: "Packed", date: idx >= 1 ? fmt(new Date(placed.getTime() + 4 * 3600000)) : "Pending", done: idx >= 1 },
    { label: "Shipped", date: idx >= 2 ? fmt(new Date(placed.getTime() + 24 * 3600000)) : "Pending", done: idx >= 2 },
    {
      label: "Delivered",
      date: idx >= 3 ? fmt(new Date(placed.getTime() + 48 * 3600000)) : `Estimated ${fmt(new Date(placed.getTime() + 48 * 3600000))}`,
      done: idx >= 3,
    },
  ];
}

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trackOpen, setTrackOpen] = useState(false);
  const [order, setOrder] = useState<Order | null | undefined>(undefined);

  useEffect(() => {
    if (!id) return;
    getOrder(id).then((o) => setOrder(o ?? null));
  }, [id]);

  if (order === undefined) {
    return (
      <div className="min-h-screen px-4 pt-4 flex flex-col gap-4">
        <div className="h-10 w-40 glass-card animate-pulse" />
        <div className="h-32 glass-card animate-pulse" />
        <div className="h-48 glass-card animate-pulse" />
      </div>
    );
  }

  if (order === null) {
    return (
      <div className="min-h-screen px-4 pt-4 flex flex-col items-center justify-center gap-4 text-center">
        <h1 className="text-xl font-bold text-[rgb(var(--text))]">Order not found</h1>
        <p className="text-sm text-[rgb(var(--text-muted))]">We couldn't find that order. It may have been removed.</p>
        <Button onClick={() => navigate("/orders")}>View My Orders</Button>
      </div>
    );
  }

  const timeline = buildTimeline(order.status, order.createdAt);
  const shortId = order.id.length > 12 ? `ORD-${order.id.slice(0, 6).toUpperCase()}` : order.id;
  const items = Array.isArray(order.items) ? order.items : [];

  return (
    <div className="min-h-screen pb-32 px-4 pt-4 flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="h-9 w-9 flex items-center justify-center rounded-full glass hover:bg-[rgba(var(--glass-tint)/0.2)]">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-xl font-bold text-[rgb(var(--text))]">Order Details</h1>
      </div>

      <div className="glass-card p-4">
        <div className="flex justify-between items-center mb-1">
          <h2 className="font-bold text-lg">{shortId}</h2>
          <span className="text-[rgb(var(--primary))] font-bold">{order.status}</span>
        </div>
        <p className="text-sm text-[rgb(var(--text-muted))]">
          Placed on {new Date(order.createdAt).toLocaleString("en-BD", { dateStyle: "medium", timeStyle: "short" })}
        </p>
      </div>

      {items.length > 0 && (
        <Card className="p-4">
          <h3 className="font-bold mb-4 text-[rgb(var(--text))]">Items ({items.length})</h3>
          <div className="flex flex-col gap-3">
            {items.map((it, i) => (
              <div key={i} className="flex gap-3">
                {it.image ? (
                  <img src={it.image} alt={it.title} className="w-14 h-14 rounded-lg object-cover bg-black/5" />
                ) : (
                  <div className="w-14 h-14 rounded-lg bg-[rgba(var(--glass-tint)/0.1)]" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold line-clamp-1">{it.title}</p>
                  <p className="text-xs text-[rgb(var(--text-muted))]">{it.sellerName}</p>
                  <p className="text-xs text-[rgb(var(--text-muted))]">Qty: {it.qty}</p>
                </div>
                <p className="text-sm font-bold text-[rgb(var(--text))]">{formatPrice(it.price * it.qty)}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card className="p-5">
        <h3 className="font-bold mb-4 text-[rgb(var(--text))]">Status</h3>
        <div className="flex flex-col gap-4 relative">
          <div className="absolute left-2.5 top-2 bottom-4 w-0.5 bg-[rgba(var(--glass-stroke)/0.2)]" />
          {timeline.map((step, i) => (
            <div key={i} className="flex gap-4 relative z-10">
              <div className="bg-[rgb(var(--bg-elevated))] rounded-full">
                {step.done ? (
                  <CheckCircle2 className="h-5 w-5 text-[rgb(var(--primary))] fill-[rgb(var(--primary))/0.2]" />
                ) : (
                  <Circle className="h-5 w-5 text-[rgb(var(--text-subtle))]" />
                )}
              </div>
              <div>
                <p className={`font-semibold text-sm ${step.done ? "text-[rgb(var(--text))]" : "text-[rgb(var(--text-muted))]"}`}>{step.label}</p>
                <p className="text-xs text-[rgb(var(--text-subtle))] mt-0.5">{step.date}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-start gap-3">
          <MapPin className="h-5 w-5 text-[rgb(var(--text-muted))] mt-0.5" />
          <div>
            <h3 className="font-bold text-[rgb(var(--text))] text-sm mb-1">Delivery Address</h3>
            <p className="text-sm text-[rgb(var(--text-muted))] leading-relaxed">
              {order.address?.name ?? "Rafiq Hossain"}<br />
              {order.address?.line1 ?? "House 12, Road 5, Dhanmondi"}<br />
              {order.address?.city ?? "Dhaka 1205"}, Bangladesh<br />
              {order.address?.phone ?? "+880 1711 223344"}
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="font-bold mb-4 text-[rgb(var(--text))]">Payment Summary</h3>
        <div className="flex flex-col gap-2 mb-4">
          <div className="flex justify-between text-sm text-[rgb(var(--text-muted))]">
            <span>Subtotal</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-sm text-[rgb(var(--primary))] font-medium">
              <span>Discount</span>
              <span>−{formatPrice(order.discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm text-[rgb(var(--text-muted))]">
            <span>Delivery Fee</span>
            <span>{formatPrice(order.delivery)}</span>
          </div>
        </div>
        <div className="h-[1px] w-full bg-[rgba(var(--glass-stroke)/0.2)] mb-3" />
        <div className="flex justify-between font-bold text-lg text-[rgb(var(--text))]">
          <span>Total</span>
          <span className="text-[rgb(var(--primary))]">{formatPrice(order.total)}</span>
        </div>
      </Card>

      <div className="fixed bottom-[calc(env(safe-area-inset-bottom)+96px)] left-0 right-0 z-50 pointer-events-none px-3">
        <div
          className="mx-auto max-w-[456px] lg:max-w-[496px] px-3 py-3 rounded-2xl sticky-cta-shadow border border-[rgba(var(--glass-stroke)/0.4)] backdrop-blur-2xl pointer-events-auto flex gap-2"
          style={{ background: "rgba(var(--bg-elevated) / 0.96)" }}
        >
          <Button
            variant="outline"
            className="flex-none px-3 press"
            onClick={() => alert("Calling support…")}
            aria-label="Contact support"
          >
            <Phone className="h-4 w-4" />
          </Button>
          <Button
            variant="primary"
            className="flex-1 h-11 font-bold glow-primary press flex items-center justify-center gap-2"
            onClick={() => setTrackOpen(true)}
          >
            <Truck className="h-4 w-4" /> Track Order
          </Button>
        </div>
      </div>

      {trackOpen && (
        <div
          className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setTrackOpen(false)}
        >
          <div
            className="w-full max-w-[420px] glass-strong rounded-t-2xl sm:rounded-2xl border border-[rgba(var(--glass-stroke)/0.3)] p-5 m-0 sm:m-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-[rgb(var(--text))]">Live Tracking</h3>
              <button
                onClick={() => setTrackOpen(false)}
                className="h-8 w-8 rounded-full glass flex items-center justify-center"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="rounded-xl overflow-hidden h-44 bg-[rgba(var(--glass-tint)/0.1)] border border-[rgba(var(--glass-stroke)/0.2)] flex items-center justify-center mb-4 relative">
              <div className="absolute inset-0 opacity-30 bg-[linear-gradient(135deg,transparent_25%,rgba(var(--primary)/0.4)_25%,rgba(var(--primary)/0.4)_50%,transparent_50%,transparent_75%,rgba(var(--primary)/0.4)_75%)] bg-[length:24px_24px]" />
              <div className="relative text-center">
                <Truck className="h-10 w-10 text-[rgb(var(--primary))] mx-auto mb-2" />
                <p className="text-sm font-semibold text-[rgb(var(--text))]">Courier on the way</p>
                <p className="text-xs text-[rgb(var(--text-muted))]">Mirpur Hub → Dhanmondi · 4.2 km away</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 press" onClick={() => alert("Calling rider…")}>
                <Phone className="h-4 w-4 mr-1" /> Call rider
              </Button>
              <Button variant="primary" className="flex-1 press">
                <MessageCircle className="h-4 w-4 mr-1" /> Chat
              </Button>
            </div>
            <p className="text-[10px] text-center text-[rgb(var(--text-subtle))] mt-3">
              Real GPS tracking comes online once the courier API is connected.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

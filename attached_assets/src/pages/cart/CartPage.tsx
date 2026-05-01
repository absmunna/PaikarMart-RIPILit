import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Trash2, Minus, Plus, ShoppingBag, Tag, Check } from "lucide-react";
import { useCart } from "@/features/cart/cart.context";
import { createOrder } from "@/features/orders/order.api";
import { formatPrice } from "@/utils/formatPrice";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const PROMO_CODES: Record<string, { label: string; discount: number }> = {
  EID10: { label: "EID10 — 10% off", discount: 0.1 },
  PAIKAR50: { label: "PAIKAR50 — flat ৳50 off", discount: 50 },
  WELCOME: { label: "WELCOME — 5% off your first order", discount: 0.05 },
};

export default function CartPage() {
  const navigate = useNavigate();
  const { items, total, count, setQty, removeItem, clear } = useCart();
  const [promo, setPromo] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [placing, setPlacing] = useState(false);
  const [placeError, setPlaceError] = useState<string | null>(null);

  const promoData = appliedPromo ? PROMO_CODES[appliedPromo] : null;
  const discount = promoData
    ? promoData.discount < 1
      ? Math.round(total * promoData.discount)
      : promoData.discount
    : 0;

  const delivery = count > 0 ? 60 : 0;
  const grandTotal = Math.max(0, total - discount) + delivery;

  const applyPromo = () => {
    const code = promo.trim().toUpperCase();
    if (!code) return;
    if (PROMO_CODES[code]) {
      setAppliedPromo(code);
      setPromoError(null);
    } else {
      setAppliedPromo(null);
      setPromoError("That promo code isn't valid.");
    }
  };

  const handleCheckout = async () => {
    if (placing || items.length === 0) return;
    setPlacing(true);
    setPlaceError(null);
    try {
      const order = await createOrder({
        subtotal: total,
        delivery,
        discount,
        total: grandTotal,
        address: {
          name: "Rafiq Hossain",
          line1: "House 12, Road 5, Dhanmondi",
          city: "Dhaka 1205",
          phone: "+880 1711 223344",
        },
        items: items.map((i) => ({
          productId: i.id,
          title: i.title,
          image: i.image,
          price: i.price,
          qty: i.qty,
          sellerId: i.sellerId,
          sellerName: i.sellerName,
        })),
      });
      // Server already cleared cart; sync local state.
      clear();
      navigate(`/orders/${order.id}`);
    } catch (e) {
      setPlaceError(e instanceof Error ? e.message : "Failed to place order");
      setPlacing(false);
    }
  };

  return (
    <div className="min-h-screen pb-32 px-4 pt-4 flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="h-9 w-9 flex items-center justify-center rounded-full glass hover:bg-[rgba(var(--glass-tint)/0.2)]">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-xl font-bold text-[rgb(var(--text))]">Shopping Cart</h1>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-20 w-20 rounded-full glass flex items-center justify-center text-[rgb(var(--text-muted))] mb-4">
            <ShoppingBag className="h-10 w-10" />
          </div>
          <h2 className="text-lg font-bold mb-2">Your cart is empty</h2>
          <p className="text-[rgb(var(--text-muted))] mb-6">Looks like you haven't added anything yet.</p>
          <Button onClick={() => navigate("/marketplace")}>Continue Shopping</Button>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4">
            {items.map(item => (
              <div key={item.id} className="glass-card p-3 flex gap-4">
                <img src={item.image} alt={item.title} className="w-20 h-20 rounded-xl object-cover bg-black/5" />
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h3 className="font-semibold text-sm line-clamp-2">{item.title}</h3>
                      <p className="text-xs text-[rgb(var(--text-muted))] mt-0.5">{item.sellerName}</p>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="text-[rgb(var(--text-muted))] hover:text-red-500 p-1">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <p className="font-bold text-[rgb(var(--primary))]">{formatPrice(item.price)}</p>
                    <div className="flex items-center gap-3 bg-[rgba(var(--glass-tint)/0.1)] rounded-lg px-2 py-1">
                      <button onClick={() => setQty(item.id, item.qty - 1)} className="text-[rgb(var(--text))]"><Minus className="h-3 w-3" /></button>
                      <span className="text-sm font-semibold w-4 text-center">{item.qty}</span>
                      <button onClick={() => setQty(item.id, item.qty + 1)} className="text-[rgb(var(--text))]"><Plus className="h-3 w-3" /></button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="glass-card p-4 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-[rgb(var(--text))]">
              <Tag className="h-4 w-4 text-[rgb(var(--primary))]" /> Promo code
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="EID10, PAIKAR50, WELCOME"
                value={promo}
                onChange={(e) => setPromo(e.target.value.toUpperCase())}
                className="flex-1 uppercase tracking-wider text-sm"
              />
              <Button
                variant={appliedPromo ? "soft" : "primary"}
                onClick={applyPromo}
                className="press"
              >
                {appliedPromo ? "Update" : "Apply"}
              </Button>
            </div>
            {appliedPromo && (
              <div className="flex items-center gap-2 text-xs text-[rgb(var(--primary))] font-medium">
                <Check className="h-3.5 w-3.5" /> Applied: {PROMO_CODES[appliedPromo].label}
              </div>
            )}
            {promoError && (
              <p className="text-xs text-red-500">{promoError}</p>
            )}
          </div>

          <div className="glass-card p-4 flex flex-col gap-2">
            <div className="flex justify-between text-sm text-[rgb(var(--text-muted))]">
              <span>Subtotal ({count} items)</span>
              <span>{formatPrice(total)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm text-[rgb(var(--primary))] font-medium">
                <span>Discount</span>
                <span>−{formatPrice(discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm text-[rgb(var(--text-muted))]">
              <span>Delivery Fee</span>
              <span>{formatPrice(delivery)}</span>
            </div>
            <div className="h-[1px] w-full bg-[rgba(var(--glass-stroke)/0.2)] my-1" />
            <div className="flex justify-between font-bold text-lg text-[rgb(var(--text))]">
              <span>Total</span>
              <span className="text-[rgb(var(--primary))]">{formatPrice(grandTotal)}</span>
            </div>
          </div>

          {/* Spacer so list isn't covered by sticky CTA */}
          <div className="h-4" />

          <div className="fixed bottom-[calc(env(safe-area-inset-bottom)+96px)] left-0 right-0 z-50 pointer-events-none px-3">
            <div
              className="mx-auto max-w-[456px] lg:max-w-[496px] px-3 py-3 rounded-2xl sticky-cta-shadow border border-[rgba(var(--glass-stroke)/0.4)] backdrop-blur-2xl pointer-events-auto"
              style={{ background: "rgba(var(--bg-elevated) / 0.96)" }}
            >
              <Button
                variant="primary"
                fullWidth
                disabled={placing}
                className="h-12 text-base font-bold glow-primary press disabled:opacity-60"
                onClick={handleCheckout}
              >
                {placing ? "Placing order…" : `Place Order · ${formatPrice(grandTotal)}`}
              </Button>
              {placeError && (
                <p className="text-xs text-red-500 mt-2 text-center">{placeError}</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

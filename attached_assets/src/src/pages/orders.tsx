import { useListOrders, getListOrdersQueryKey } from "@workspace/api-client-react";
import { formatBDT } from "@/lib/format";
import { GlassCard } from "@/components/ui/GlassCard";
import { Package, Clock, MapPin, FileText } from "lucide-react";
import { format } from "date-fns";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function Orders() {
  const { data: orders } = useListOrders({ query: { queryKey: getListOrdersQueryKey() } });

  if (!orders) return <div className="p-8 text-center text-white">Loading...</div>;

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 p-4">
        <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/20">
          <Package className="w-12 h-12" />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">No orders yet</h2>
          <p className="text-white/50 max-w-sm">When you place orders, they will appear here.</p>
        </div>
        <Link href="/marketplace">
          <Button className="mt-4 bg-primary hover:bg-primary/90 text-white rounded-full px-8">
            Start Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-white">Order History</h1>

      <div className="flex flex-col gap-4">
        {orders.map((order) => (
          <GlassCard key={order.id} className="overflow-hidden">
            <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 bg-white/5">
              <div className="flex flex-col gap-1 text-sm">
                <span className="text-white/50">Order Placed</span>
                <span className="text-white font-medium">{format(new Date(order.createdAt), "MMM d, yyyy")}</span>
              </div>
              <div className="flex flex-col gap-1 text-sm">
                <span className="text-white/50">Total</span>
                <span className="text-primary font-bold">{formatBDT(order.total)}</span>
              </div>
              <div className="flex flex-col gap-1 text-sm">
                <span className="text-white/50">Order ID</span>
                <span className="text-white font-medium uppercase">#{order.id.slice(0, 8)}</span>
              </div>
              <div className="flex items-center">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  order.status === 'delivered' ? 'bg-green-500/20 text-green-400' :
                  order.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                  order.status === 'shipped' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {order.status}
                </span>
              </div>
            </div>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="items" className="border-none">
                <AccordionTrigger className="px-5 py-4 hover:no-underline text-white/80 hover:text-white">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    <span>View {order.items.length} items</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-5 pb-5">
                  <div className="flex flex-col gap-4 pt-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex gap-4 items-center">
                        <Link href={`/marketplace/product/${item.product.id}`} className="shrink-0">
                          <img 
                            src={item.product.images[0]} 
                            alt={item.product.title} 
                            className="w-16 h-16 object-cover rounded border border-white/10"
                          />
                        </Link>
                        <div className="flex-1 min-w-0">
                          <Link href={`/marketplace/product/${item.product.id}`}>
                            <h4 className="text-sm font-medium text-white hover:text-primary truncate">{item.product.title}</h4>
                          </Link>
                          <p className="text-xs text-white/50 mt-0.5">{item.product.vendor.name}</p>
                          <div className="text-sm mt-1">
                            <span className="text-white/70">Qty: {item.quantity}</span>
                            <span className="mx-2 text-white/20">|</span>
                            <span className="font-semibold text-white">{formatBDT(item.product.price)}</span>
                          </div>
                        </div>
                        <div className="shrink-0">
                          <Button variant="outline" size="sm" className="h-8 bg-white/5 border-white/10 text-white">Buy Again</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

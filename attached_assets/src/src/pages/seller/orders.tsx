import { useState } from "react";
import { formatBDT } from "@/lib/format";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSeller } from "@/seller/SellerContext";
import { ORDER_STATUS_FLOW, SellerOrderStatus } from "@/seller/types";
import { format } from "date-fns";
import { Package, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const STATUS_STYLES: Record<SellerOrderStatus, string> = {
  pending: "bg-yellow-500/20 text-yellow-400",
  processing: "bg-blue-500/20 text-blue-400",
  shipped: "bg-purple-500/20 text-purple-400",
  delivered: "bg-green-500/20 text-green-400",
  cancelled: "bg-red-500/20 text-red-400",
};

export default function SellerOrders() {
  const { orders, setOrderStatus } = useSeller();
  const [filter, setFilter] = useState<"all" | SellerOrderStatus>("all");

  const visible = orders.filter((o) => filter === "all" || o.status === filter);

  const advance = (id: string, current: SellerOrderStatus) => {
    const idx = ORDER_STATUS_FLOW.indexOf(current);
    if (idx === -1 || idx === ORDER_STATUS_FLOW.length - 1) return;
    const next = ORDER_STATUS_FLOW[idx + 1];
    setOrderStatus(id, next);
    toast.success(`Order moved to ${next}`);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Orders</h1>
          <p className="text-white/60 mt-1">
            Manage incoming orders and update fulfillment status.
          </p>
        </div>
        <Select value={filter} onValueChange={(v: typeof filter) => setFilter(v)}>
          <SelectTrigger className="bg-white/5 border-white/10 text-white w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All orders</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {visible.length === 0 ? (
        <GlassCard className="p-12 text-center text-white/60">
          <Package className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>No orders to show.</p>
        </GlassCard>
      ) : (
        <GlassCard className="overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="text-white/60">Order</TableHead>
                  <TableHead className="text-white/60">Customer</TableHead>
                  <TableHead className="text-white/60">Date</TableHead>
                  <TableHead className="text-white/60">Total</TableHead>
                  <TableHead className="text-white/60">Status</TableHead>
                  <TableHead className="text-white/60 text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visible.map((o) => {
                  const idx = ORDER_STATUS_FLOW.indexOf(o.status);
                  const nextStatus =
                    idx >= 0 && idx < ORDER_STATUS_FLOW.length - 1
                      ? ORDER_STATUS_FLOW[idx + 1]
                      : null;
                  return (
                    <TableRow key={o.id} className="border-white/10 hover:bg-white/5">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img
                            src={o.productImage}
                            alt=""
                            className="w-10 h-10 rounded object-cover border border-white/10 shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="text-sm text-white truncate">
                              {o.productTitle}
                            </div>
                            <div className="text-xs text-white/50">
                              #{o.id} · qty {o.quantity}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-white/80">{o.customerName}</TableCell>
                      <TableCell className="text-white/60 text-sm">
                        {format(new Date(o.createdAt), "MMM d, h:mm a")}
                      </TableCell>
                      <TableCell className="text-primary font-semibold">
                        {formatBDT(o.total)}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLES[o.status]}`}
                        >
                          {o.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        {nextStatus ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => advance(o.id, o.status)}
                            className="bg-white/5 border-white/10 text-white hover:bg-white/10"
                          >
                            Mark {nextStatus}
                            <ArrowRight className="w-3 h-3 ml-2" />
                          </Button>
                        ) : (
                          <span className="text-xs text-white/40">—</span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </GlassCard>
      )}
    </div>
  );
}

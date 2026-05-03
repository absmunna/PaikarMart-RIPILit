import { useState } from "react";
import { formatBDT } from "@/lib/format";
import { Layout } from "@/components/layout/Layout";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useListOrders, useUpdateOrderStatus } from "@workspace/api-client-react";
import { useAuth } from "@/hooks/use-auth";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Package, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400",
  confirmed: "bg-blue-500/20 text-blue-400",
  processing: "bg-purple-500/20 text-purple-400",
  shipped: "bg-cyan-500/20 text-cyan-400",
  completed: "bg-green-500/20 text-green-400",
  incomplete: "bg-red-500/20 text-red-400",
};

const STATUS_FLOW = ["pending", "confirmed", "processing", "shipped", "completed"];

export default function SellerOrdersPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [filter, setFilter] = useState<string>("all");

  const { data, isLoading } = useListOrders(
    { seller_id: user?.id },
    { query: { enabled: !!user?.id } }
  );

  const updateStatus = useUpdateOrderStatus({
    mutation: {
      onSuccess: () => {
        toast.success("Order status updated");
        qc.invalidateQueries({ queryKey: ["/api/orders"] });
      },
      onError: () => toast.error("Failed to update order"),
    },
  });

  const orders = data?.orders || [];
  const visible = filter === "all" ? orders : orders.filter(o => o.status === filter);

  const advance = (id: string, current: string) => {
    const idx = STATUS_FLOW.indexOf(current);
    if (idx === -1 || idx === STATUS_FLOW.length - 1) return;
    const next = STATUS_FLOW[idx + 1];
    updateStatus.mutate({ id, data: { status: next as "pending" | "confirmed" | "processing" | "shipped" | "completed" | "incomplete" } });
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 flex flex-col gap-4">
          <Skeleton className="h-10 w-48 bg-white/5" />
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full rounded-xl bg-white/5" />)}
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Orders</h1>
            <p className="text-white/60 mt-1">
              {orders.length} total order{orders.length !== 1 ? "s" : ""} for your shop.
            </p>
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="bg-white/5 border-white/10 text-white w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All orders</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="incomplete">Incomplete</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {visible.length === 0 ? (
          <GlassCard className="p-12 text-center text-white/60">
            <Package className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>{orders.length === 0 ? "No orders have been placed for your shop yet." : `No orders with status "${filter}".`}</p>
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
                    const idx = STATUS_FLOW.indexOf(o.status || "");
                    const nextStatus = idx >= 0 && idx < STATUS_FLOW.length - 1 ? STATUS_FLOW[idx + 1] : null;
                    const items = (o.items || []) as Array<{ productName: string; quantity: number }>;
                    const firstItem = items[0];
                    return (
                      <TableRow key={o.id} className="border-white/10 hover:bg-white/5">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded bg-white/10 flex items-center justify-center shrink-0">
                              <Package className="w-5 h-5 text-white/30" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-sm text-white truncate">
                                {firstItem?.productName || "Order"}
                              </div>
                              <div className="text-xs text-white/50">
                                #{o.id} · {items.length} item{items.length !== 1 ? "s" : ""}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-white/80">
                          {(o as Record<string, unknown>).customerName as string || "Guest"}
                        </TableCell>
                        <TableCell className="text-white/60 text-sm">
                          {o.createdAt ? format(new Date(o.createdAt), "MMM d, h:mm a") : "—"}
                        </TableCell>
                        <TableCell className="text-primary font-semibold">
                          {formatBDT((o as Record<string, unknown>).totalAmount as number || 0)}
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLES[o.status || "pending"] || "bg-white/10 text-white/50"}`}>
                            {o.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          {nextStatus ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => advance(o.id, o.status || "")}
                              disabled={updateStatus.isPending}
                              className="bg-white/5 border-white/10 text-white hover:bg-white/10"
                            >
                              {updateStatus.isPending
                                ? <Loader2 className="w-3 h-3 animate-spin" />
                                : <><span className="capitalize">→ {nextStatus}</span> <ArrowRight className="w-3 h-3 ml-1" /></>
                              }
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
    </Layout>
  );
}

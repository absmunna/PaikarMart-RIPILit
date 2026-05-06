import * as React from "react";
import { Link } from "wouter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/GlassCard";
import { Image as ImageIcon, Package, FileText, PlaySquare, Wrench, Send } from "lucide-react";
import {
  useGetMe,
  useCreatePost,
  getListPostsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type Kind = "status" | "product" | "video" | "deal";

const QUICK = [
  { kind: "product" as Kind, label: "Product", Icon: Package, href: "/seller/products/new", color: "text-emerald-300" },
  { kind: "deal" as Kind, label: "Demand", Icon: FileText, href: "/demand", color: "text-amber-300" },
  { kind: "status" as Kind, label: "Service", Icon: Wrench, href: "/seller/products/new?type=service", color: "text-purple-300" },
  { kind: "video" as Kind, label: "Video", Icon: PlaySquare, href: "/video", color: "text-rose-300" },
];

export function CreatePostComposer() {
  const qc = useQueryClient();
  const { data: user } = useGetMe();
  const createPost = useCreatePost();

  const [content, setContent] = React.useState("");
  const [kind, setKind] = React.useState<Kind>("status");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    createPost.mutate(
      { data: { content: content.trim(), type: kind } },
      {
        onSuccess: () => {
          setContent("");
          setKind("status");
          qc.invalidateQueries({ queryKey: getListPostsQueryKey() });
          toast.success("Posted to feed");
        },
        onError: () => toast.error("Could not post"),
      },
    );
  };

  return (
    <GlassCard className="p-4 flex flex-col gap-3">
      <form onSubmit={submit} className="flex items-start gap-3">
        <Avatar className="h-9 w-9 shrink-0 border border-white/20">
          <AvatarImage src={user?.avatarUrl} />
          <AvatarFallback>{user?.name?.[0] ?? "U"}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0 flex flex-col gap-2">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What do you want to sell or request?"
            rows={2}
            className="w-full resize-none bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <div className="flex items-center justify-between gap-2">
            <select
              value={kind}
              onChange={(e) => setKind(e.target.value as Kind)}
              className="bg-white/10 text-white text-xs rounded-md px-2 py-1.5 border border-white/10 focus:outline-none"
            >
              <option value="status">Status</option>
              <option value="product">Product</option>
              <option value="deal">Deal / Demand</option>
              <option value="video">Video</option>
            </select>
            <Button type="submit" size="sm" disabled={createPost.isPending || !content.trim()}>
              <Send className="h-4 w-4 mr-1" />
              Post
            </Button>
          </div>
        </div>
      </form>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-white/5">
        {(Array.isArray(QUICK) ? QUICK : []).map(({ kind, label, Icon, href, color }) => (
          <Link key={kind} href={href}>
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 text-sm py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/85"
            >
              <Icon className={`h-4 w-4 ${color}`} />
              {label}
            </button>
          </Link>
        ))}
      </div>
    </GlassCard>
  );
}

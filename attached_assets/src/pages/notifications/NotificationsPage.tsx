import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Bell,
  Package,
  MessageCircle,
  Heart,
  UserPlus,
  Wallet as WalletIcon,
  Sparkles,
  Check,
} from "lucide-react";
import {
  AppNotification,
  getNotifications,
  NotificationKind,
} from "@/features/notifications/notification.api";
import { Skeleton } from "@/components/common/Loader";

const ICONS: Record<NotificationKind, JSX.Element> = {
  order: <Package className="h-5 w-5" />,
  comment: <MessageCircle className="h-5 w-5" />,
  like: <Heart className="h-5 w-5" />,
  reward: <Heart className="h-5 w-5" />,
  follow: <UserPlus className="h-5 w-5" />,
  wallet: <WalletIcon className="h-5 w-5" />,
  system: <Sparkles className="h-5 w-5" />,
};

const TINTS: Record<NotificationKind, string> = {
  order: "bg-[rgba(var(--primary)/0.15)] text-[rgb(var(--primary))]",
  comment: "bg-blue-500/15 text-blue-500",
  like: "bg-pink-500/15 text-pink-500",
  reward: "bg-pink-500/15 text-pink-500",
  follow: "bg-violet-500/15 text-violet-500",
  wallet: "bg-amber-500/15 text-amber-500",
  system: "bg-[rgba(var(--text-muted)/0.15)] text-[rgb(var(--text-muted))]",
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  return `${d}d`;
}

export default function NotificationsPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<AppNotification[] | null>(null);

  useEffect(() => {
    getNotifications().then(setItems);
  }, []);

  const markAllRead = () => {
    if (!items) return;
    setItems(items.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = items?.filter((n) => !n.read).length ?? 0;

  return (
    <div className="min-h-screen pb-24">
      <div className="sticky top-16 z-30 flex items-center gap-3 px-4 py-3 bg-[rgba(var(--bg)/0.85)] backdrop-blur-md border-b border-[rgba(var(--glass-stroke)/0.15)]">
        <button
          onClick={() => navigate(-1)}
          className="h-9 w-9 flex items-center justify-center rounded-full glass hover:bg-[rgba(var(--glass-tint)/0.2)]"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-[rgb(var(--text))] flex items-center gap-2">
            <Bell className="h-5 w-5" /> Notifications
          </h1>
          {unreadCount > 0 && (
            <p className="text-xs text-[rgb(var(--text-muted))]">
              {unreadCount} unread
            </p>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="text-xs font-semibold text-[rgb(var(--primary))] flex items-center gap-1 px-3 py-1.5 rounded-full hover:bg-[rgba(var(--primary)/0.1)]"
          >
            <Check className="h-3.5 w-3.5" /> Mark all read
          </button>
        )}
      </div>

      <div className="p-4 flex flex-col gap-2">
        {!items
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="glass-card p-4 flex gap-3">
                <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3 w-2/3 rounded" />
                  <Skeleton className="h-3 w-full rounded" />
                </div>
              </div>
            ))
          : items.length === 0
            ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="h-20 w-20 rounded-full glass flex items-center justify-center text-[rgb(var(--text-muted))] mb-4">
                  <Bell className="h-10 w-10" />
                </div>
                <h2 className="text-lg font-bold mb-1">All caught up</h2>
                <p className="text-sm text-[rgb(var(--text-muted))]">
                  You have no notifications right now.
                </p>
              </div>
            )
            : items.map((n) => {
                const inner = (
                  <div
                    className={`glass-card p-4 flex gap-3 hover-lift press transition ${
                      n.read ? "" : "border-[rgba(var(--primary)/0.35)]"
                    }`}
                  >
                    <div
                      className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${TINTS[n.kind]}`}
                    >
                      {ICONS[n.kind]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-semibold text-sm text-[rgb(var(--text))] truncate">
                          {n.title}
                        </p>
                        <span className="text-[10px] text-[rgb(var(--text-subtle))] shrink-0">
                          {timeAgo(n.createdAt)}
                        </span>
                      </div>
                      <p className="text-xs text-[rgb(var(--text-muted))] mt-1 leading-relaxed">
                        {n.body}
                      </p>
                    </div>
                    {!n.read && (
                      <div className="h-2 w-2 rounded-full bg-[rgb(var(--primary))] mt-2 shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                    )}
                  </div>
                );
                return n.link ? (
                  <Link key={n.id} to={n.link} className="block">
                    {inner}
                  </Link>
                ) : (
                  <div key={n.id}>{inner}</div>
                );
              })}
      </div>
    </div>
  );
}

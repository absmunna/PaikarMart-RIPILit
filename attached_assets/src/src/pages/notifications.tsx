import { useListNotifications, getListNotificationsQueryKey } from "@workspace/api-client-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, ShoppingBag, Star, MessageSquare, AlertCircle, FileText } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function Notifications() {
  const { data: notifications } = useListNotifications({ query: { queryKey: getListNotificationsQueryKey() } });

  if (!notifications) return <div className="p-8 text-center text-white">Loading...</div>;

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 p-4">
        <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/20">
          <Bell className="w-12 h-12" />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">All caught up!</h2>
          <p className="text-white/50 max-w-sm">You don't have any notifications right now.</p>
        </div>
      </div>
    );
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'order': return <ShoppingBag className="w-5 h-5 text-blue-400" />;
      case 'review': return <Star className="w-5 h-5 text-yellow-400" />;
      case 'message': return <MessageSquare className="w-5 h-5 text-green-400" />;
      case 'demand_match': return <FileText className="w-5 h-5 text-purple-400" />;
      case 'admin': return <AlertCircle className="w-5 h-5 text-red-400" />;
      default: return <Bell className="w-5 h-5 text-primary" />;
    }
  };

  return (
    <div className="flex flex-col gap-6 p-4 max-w-2xl mx-auto w-full">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Notifications</h1>
        <span className="text-sm text-primary cursor-pointer hover:underline">Mark all as read</span>
      </div>

      <div className="flex flex-col gap-3">
        {notifications.map((notification) => (
          <GlassCard 
            key={notification.id} 
            className={`p-4 flex gap-4 cursor-pointer transition-colors ${!notification.read ? 'bg-primary/5 border-primary/20' : ''}`}
            hoverEffect
          >
            {notification.actorAvatarUrl ? (
              <Avatar className="h-10 w-10 border border-white/10 shrink-0">
                <AvatarImage src={notification.actorAvatarUrl} />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            ) : (
              <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                {getIcon(notification.type)}
              </div>
            )}
            
            <div className="flex flex-col flex-1 gap-1 min-w-0">
              <div className="flex justify-between gap-2 items-start">
                <h4 className="font-medium text-sm text-white truncate">{notification.title}</h4>
                <span className="text-[10px] text-white/40 shrink-0 whitespace-nowrap">
                  {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                </span>
              </div>
              <p className="text-sm text-white/70 line-clamp-2">{notification.body}</p>
            </div>
            
            {!notification.read && (
              <div className="shrink-0 flex items-center">
                <div className="w-2 h-2 rounded-full bg-primary" />
              </div>
            )}
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

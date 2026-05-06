import React from "react";
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { useListNotifications } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Bell, Package, Truck, Info, Store } from "lucide-react";

export default function NotificationsPage() {
  const { user } = useAuth();
  
  if (user?.id === "guest") {
    return <Redirect to="/login" />;
  }

  const { data: notifData, isLoading } = useListNotifications({ user_id: user?.id || "user-1" });
  const notifications = notifData?.notifications || [];

  const getIcon = (type: string) => {
    switch (type) {
      case "order": return <Package className="h-5 w-5 text-blue-500" />;
      case "delivery": return <Truck className="h-5 w-5 text-green-500" />;
      case "account": return <Info className="h-5 w-5 text-purple-500" />;
      case "seller": return <Store className="h-5 w-5 text-orange-500" />;
      default: return <Bell className="h-5 w-5 text-muted-foreground" />;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-3xl font-bold mb-8">Notifications</h1>
        
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24 w-full rounded-xl" />)}
          </div>
        ) : notifications.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center text-muted-foreground flex flex-col items-center">
              <Bell className="h-12 w-12 mb-4 opacity-20" />
              <h2 className="text-xl font-medium mb-2">No notifications</h2>
              <p>You're all caught up!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {notifications.map((notif) => (
              <Card key={notif.id} className={notif.read ? "bg-muted/30" : "bg-card border-primary/30 shadow-sm"}>
                <CardContent className="p-4 flex gap-4">
                  <div className={`h-10 w-10 shrink-0 rounded-full flex items-center justify-center bg-background border ${!notif.read ? "border-primary/20" : ""}`}>
                    {getIcon(notif.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className={`font-medium ${!notif.read ? "text-foreground" : "text-foreground/80"}`}>
                        {notif.title}
                      </h3>
                      <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                        {new Date(notif.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className={`text-sm ${!notif.read ? "text-foreground/90" : "text-muted-foreground"}`}>
                      {notif.message}
                    </p>
                  </div>
                  {!notif.read && (
                    <div className="shrink-0 flex items-center justify-center w-4">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

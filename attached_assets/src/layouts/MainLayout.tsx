import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import BottomNav from "./BottomNav";
import HamburgerDrawer from "@/components/layout/HamburgerDrawer";
import Sidebar from "@/core/layouts/Sidebar";
import { getNotifications } from "@/features/notifications/notification.api";

export default function MainLayout() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    getNotifications().then((list) => setUnread(list.filter((n) => !n.read).length));
  }, []);

  return (
    <div className="app-shell flex flex-col lg:flex-row">
      {/* Desktop Sidebar */}
      <Sidebar />
      
      {/* Mobile/Tablet */}
      <HamburgerDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-70">
        <Header onOpenMenu={() => setMenuOpen(true)} unreadNotifications={unread} />
        <main key={location.pathname} className="flex-1 pb-28 lg:pb-6 page-fade">
          <Outlet />
        </main>
        {/* BottomNav visible only on mobile/tablet */}
        <BottomNav />
      </div>
    </div>
  );
}

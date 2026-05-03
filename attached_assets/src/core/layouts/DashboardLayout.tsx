import { Outlet } from "react-router-dom";
import Header from "@/layouts/Header";
import BottomNav from "@/layouts/BottomNav";
import Sidebar from "@/core/layouts/Sidebar";
import { useState } from "react";
import HamburgerDrawer from "@/components/layout/HamburgerDrawer";

export default function DashboardLayout() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="app-shell flex flex-col lg:flex-row">
      <Sidebar />
      <HamburgerDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
      
      <div className="flex-1 flex flex-col lg:ml-70">
        <Header onOpenMenu={() => setMenuOpen(true)} unreadNotifications={0} />
        <main className="flex-1 pb-28 lg:pb-6 page-fade">
          <div className="mx-auto w-full max-w-4xl px-4 lg:px-8">
            <Outlet />
          </div>
        </main>
        <BottomNav />
      </div>
    </div>
  );
}

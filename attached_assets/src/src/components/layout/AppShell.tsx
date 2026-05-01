import { useLocation } from "wouter";
import { Header } from "./Header";
import { BottomNav } from "./BottomNav";
import { DesktopSidebar } from "./Sidebar";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [location] = useLocation();
  const isReels = location === "/reels";
  const isAuth = location.startsWith("/auth");

  if (isReels) {
    return (
      <div className="min-h-[100dvh] w-full bg-[#000]">
        {children}
        <BottomNav />
      </div>
    );
  }

  if (isAuth) {
    return (
      <div className="min-h-[100dvh] w-full bg-[#0f172a] flex flex-col">
        <Header />
        <main className="flex-1 w-full flex items-start justify-center px-3 py-6 md:px-4 md:py-7">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] w-full bg-[#0f172a] flex flex-col">
      <Header />
      <div className="flex-1 w-full">
        <div className="max-w-[1400px] mx-auto w-full px-2.5 md:px-4 flex gap-4 md:gap-5 pb-24 md:pb-8 pt-3">
          <DesktopSidebar />
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}

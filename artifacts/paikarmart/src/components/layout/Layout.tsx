import React, { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { BottomNav } from "./BottomNav";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div
      className="min-h-[100dvh] flex flex-col"
      style={{
        background: "#061A12",
        backgroundImage: [
          "radial-gradient(ellipse 110% 60% at 15% 0%, rgba(0,255,156,0.07) 0%, transparent 55%)",
          "radial-gradient(ellipse 80% 60% at 88% 100%, rgba(29,191,115,0.05) 0%, transparent 55%)",
          "linear-gradient(160deg, #0B2B1F 0%, #061A12 60%, #071e14 100%)",
        ].join(", "),
      }}
    >
      <Header />
      <main className="flex-1 flex flex-col pb-16 md:pb-0">{children}</main>
      <BottomNav />
    </div>
  );
}

import React from "react";
import { Link } from "wouter";

const TEXT  = "#E8F5EE";
const MUTED = "#A3C9B8";
const GLOW  = "#00FF9C";

export function Footer() {
  return (
    <footer
      className="hidden md:block mt-8"
      style={{
        background: "rgba(6,22,14,0.90)",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(20px)",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-extrabold text-lg mb-3 font-['Outfit']">
              <span style={{ color: TEXT }}>Paikar</span>
              <span style={{ color: GLOW, textShadow: "0 0 10px rgba(0,255,156,0.5)" }}>Mart</span>
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: MUTED }}>
              Bangladesh's premium B2B wholesale marketplace. Connect buyers and sellers nationwide.
            </p>
          </div>
          {[
            { title: "Marketplace",  links: ["All Products","Top Sellers","New Arrivals","Wholesale Deals"] },
            { title: "Sellers",      links: ["Become a Seller","Seller Dashboard","Seller FAQ","Policies"] },
            { title: "Support",      links: ["Help Center","Contact Us","Return Policy","Privacy Policy"] },
          ].map(col => (
            <div key={col.title}>
              <h4 className="font-semibold text-sm mb-3 uppercase tracking-wide" style={{ color: TEXT }}>{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map(l => (
                  <li key={l}>
                    <Link href="#" className="text-sm transition-colors hover:text-[#00FF9C]" style={{ color: MUTED }}>{l}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between pt-6" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          <p className="text-xs" style={{ color: MUTED }}>© 2025 PaikarMart. All rights reserved.</p>
          <p className="text-xs" style={{ color: MUTED }}>Made with ❤️ in Bangladesh</p>
        </div>
      </div>
    </footer>
  );
}

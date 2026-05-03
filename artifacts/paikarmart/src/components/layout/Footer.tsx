import React from "react";
import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="mt-12 border-t" style={{ borderColor: "rgba(16,185,129,0.12)", background: "linear-gradient(180deg, hsl(160 28% 5%) 0%, hsl(160 30% 3%) 100%)" }}>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div
                className="h-9 w-9 rounded-xl flex items-center justify-center shadow-lg"
                style={{ background: "linear-gradient(135deg, hsl(145 65% 28%), hsl(145 60% 38%))", border: "1px solid rgba(16,185,129,0.4)" }}
              >
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <span className="font-bold text-xl">
                <span className="text-gradient-green">Paikar</span>
                <span style={{ color: "#9B1942" }}>Mart</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-5 text-white/40">
              The premium multi-vendor eCommerce marketplace for Bangladesh and South Asia.
            </p>
            <div className="flex gap-2">
              {["f", "in", "tw"].map(s => (
                <div
                  key={s}
                  className="h-8 w-8 rounded-lg flex items-center justify-center cursor-pointer text-xs font-bold text-white/60 hover:text-white transition-all hover:scale-110"
                  style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  {s}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-emerald-400 text-sm">Quick Links</h4>
            <ul className="space-y-2.5 text-sm text-white/40">
              {[
                { href: "/products", label: "All Products" },
                { href: "/vendors", label: "Vendors Directory" },
                { href: "/vendors?type=wholesale", label: "Wholesale Hub" },
                { href: "/vendors?type=service", label: "Services" },
                { href: "/seller/register", label: "Become a Seller" },
              ].map(item => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-emerald-400 transition-colors">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold mb-4 text-purple-400 text-sm">Customer Service</h4>
            <ul className="space-y-2.5 text-sm text-white/40">
              {[
                { href: "/profile", label: "My Account" },
                { href: "/orders", label: "Track My Order" },
                { href: "/wallet", label: "My Wallet" },
                { href: "/faq", label: "FAQ" },
                { href: "/terms", label: "Terms & Conditions" },
              ].map(item => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-purple-400 transition-colors">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-emerald-400 text-sm">Contact Us</h4>
            <ul className="space-y-2.5 text-sm text-white/40">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-0.5">✉</span> support@paikarmart.com
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-0.5">☎</span> +880 1234 567890
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-0.5">📍</span> Dhaka, Bangladesh
              </li>
            </ul>
            <div
              className="mt-4 p-3 rounded-xl"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(16,185,129,0.15)" }}
            >
              <p className="text-xs mb-2 text-white/35">Download our app</p>
              <div className="flex gap-2">
                {["App Store", "Play Store"].map(s => (
                  <div
                    key={s}
                    className="flex-1 rounded-lg px-2 py-1.5 text-[10px] text-center cursor-pointer text-white/50 hover:text-white transition-colors"
                    style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)" }}
                  >
                    {s}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div
          className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/25 border-t"
          style={{ borderColor: "rgba(16,185,129,0.1)" }}
        >
          <span>&copy; {new Date().getFullYear()} PaikarMart. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="hover:text-white/60 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white/60 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

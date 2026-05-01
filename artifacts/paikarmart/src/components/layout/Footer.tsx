import React from "react";
import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="mt-12" style={{ background: "linear-gradient(180deg, hsl(350 60% 12%) 0%, hsl(350 62% 8%) 100%)" }}>
      <div style={{ borderTop: "2px solid hsl(42 72% 50% / 0.5)" }}>
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-9 w-9 rounded-xl gold-ring flex items-center justify-center shadow-md" style={{ background: "linear-gradient(135deg, hsl(350 55% 22%), hsl(350 55% 35%))" }}>
                  <span className="text-white font-bold text-lg">P</span>
                </div>
                <span className="font-bold text-xl">
                  <span style={{ color: "hsl(42 80% 65%)" }}>Paikar</span>
                  <span className="text-rose-300">Mart</span>
                </span>
              </div>
              <p className="text-sm leading-relaxed mb-4" style={{ color: "hsl(350 20% 70%)" }}>
                The premium multi-vendor eCommerce marketplace for Bangladesh and South Asia.
              </p>
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-lg flex items-center justify-center cursor-pointer transition-all text-xs font-bold text-white gold-ring-sm hover:opacity-80" style={{ background: "hsl(350 55% 25%)" }}>f</div>
                <div className="h-8 w-8 rounded-lg flex items-center justify-center cursor-pointer transition-all text-xs font-bold text-white gold-ring-sm hover:opacity-80" style={{ background: "hsl(350 55% 25%)" }}>in</div>
                <div className="h-8 w-8 rounded-lg flex items-center justify-center cursor-pointer transition-all text-xs font-bold text-white gold-ring-sm hover:opacity-80" style={{ background: "hsl(350 55% 25%)" }}>tw</div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4" style={{ color: "hsl(42 80% 65%)" }}>Quick Links</h4>
              <ul className="space-y-2.5 text-sm" style={{ color: "hsl(350 20% 70%)" }}>
                <li><Link href="/products" className="hover:text-white transition-colors">All Products</Link></li>
                <li><Link href="/vendors" className="hover:text-white transition-colors">Vendors Directory</Link></li>
                <li><Link href="/vendors?type=wholesale" className="hover:text-white transition-colors">Wholesale Hub</Link></li>
                <li><Link href="/vendors?type=service" className="hover:text-white transition-colors">Services</Link></li>
                <li><Link href="/seller/register" className="hover:text-white transition-colors">Become a Seller</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4" style={{ color: "hsl(42 80% 65%)" }}>Customer Service</h4>
              <ul className="space-y-2.5 text-sm" style={{ color: "hsl(350 20% 70%)" }}>
                <li><Link href="/profile" className="hover:text-white transition-colors">My Account</Link></li>
                <li><Link href="/orders" className="hover:text-white transition-colors">Track My Order</Link></li>
                <li><Link href="/wallet" className="hover:text-white transition-colors">My Wallet</Link></li>
                <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4" style={{ color: "hsl(42 80% 65%)" }}>Contact Us</h4>
              <ul className="space-y-2.5 text-sm" style={{ color: "hsl(350 20% 70%)" }}>
                <li className="flex items-start gap-2">
                  <span style={{ color: "hsl(42 80% 65%)" }} className="mt-0.5">✉</span> support@paikarmart.com
                </li>
                <li className="flex items-start gap-2">
                  <span style={{ color: "hsl(42 80% 65%)" }} className="mt-0.5">☎</span> +880 1234 567890
                </li>
                <li className="flex items-start gap-2">
                  <span style={{ color: "hsl(42 80% 65%)" }} className="mt-0.5">📍</span> Dhaka, Bangladesh
                </li>
              </ul>
              <div className="mt-4 p-3 rounded-xl gold-ring-sm" style={{ background: "hsl(350 55% 16%)" }}>
                <p className="text-xs mb-1.5" style={{ color: "hsl(350 20% 60%)" }}>Download our app</p>
                <div className="flex gap-2">
                  <div className="flex-1 rounded-lg px-2 py-1.5 text-[10px] text-center cursor-pointer transition-colors hover:opacity-80 text-white" style={{ background: "hsl(350 55% 22%)" }}>App Store</div>
                  <div className="flex-1 rounded-lg px-2 py-1.5 text-[10px] text-center cursor-pointer transition-colors hover:opacity-80 text-white" style={{ background: "hsl(350 55% 22%)" }}>Play Store</div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm" style={{ borderTop: "1px solid hsl(42 72% 50% / 0.2)", color: "hsl(350 20% 55%)" }}>
            <span>&copy; {new Date().getFullYear()} PaikarMart. All rights reserved.</span>
            <div className="flex items-center gap-4">
              <Link href="/terms" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

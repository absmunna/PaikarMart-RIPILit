import React from "react";
import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-12">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <span className="font-bold text-xl">
                <span className="text-green-400">Paikar</span>
                <span className="text-rose-400">Mart</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              The premium multi-vendor eCommerce marketplace for Bangladesh and South Asia.
            </p>
            <div className="flex gap-3">
              <div className="h-8 w-8 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-green-600 cursor-pointer transition-colors text-xs font-bold">f</div>
              <div className="h-8 w-8 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-blue-500 cursor-pointer transition-colors text-xs font-bold">in</div>
              <div className="h-8 w-8 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-sky-500 cursor-pointer transition-colors text-xs font-bold">tw</div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/products" className="hover:text-green-400 transition-colors">All Products</Link></li>
              <li><Link href="/vendors" className="hover:text-green-400 transition-colors">Vendors Directory</Link></li>
              <li><Link href="/vendors?type=wholesale" className="hover:text-green-400 transition-colors">Wholesale Hub</Link></li>
              <li><Link href="/vendors?type=service" className="hover:text-green-400 transition-colors">Services</Link></li>
              <li><Link href="/seller/register" className="hover:text-green-400 transition-colors">Become a Seller</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Customer Service</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/profile" className="hover:text-green-400 transition-colors">My Account</Link></li>
              <li><Link href="/orders" className="hover:text-green-400 transition-colors">Track My Order</Link></li>
              <li><Link href="/wallet" className="hover:text-green-400 transition-colors">My Wallet</Link></li>
              <li><Link href="/faq" className="hover:text-green-400 transition-colors">FAQ</Link></li>
              <li><Link href="/terms" className="hover:text-green-400 transition-colors">Terms & Conditions</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Contact Us</h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-0.5">✉</span> support@paikarmart.com
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-0.5">☎</span> +880 1234 567890
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-0.5">📍</span> Dhaka, Bangladesh
              </li>
            </ul>
            <div className="mt-4 p-3 bg-gray-800 rounded-xl">
              <p className="text-xs text-gray-400 mb-1.5">Download our app</p>
              <div className="flex gap-2">
                <div className="flex-1 bg-gray-700 hover:bg-gray-600 rounded-lg px-2 py-1.5 text-[10px] text-center cursor-pointer transition-colors">App Store</div>
                <div className="flex-1 bg-gray-700 hover:bg-gray-600 rounded-lg px-2 py-1.5 text-[10px] text-center cursor-pointer transition-colors">Play Store</div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <span>&copy; {new Date().getFullYear()} PaikarMart. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="hover:text-green-400 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-green-400 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

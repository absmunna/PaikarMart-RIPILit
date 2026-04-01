import React from "react";
import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-muted mt-12 py-12 border-t">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <div className="h-6 w-6 rounded flex items-center justify-center bg-primary text-primary-foreground font-bold text-sm">P</div>
            PaikarMart
          </h3>
          <p className="text-muted-foreground text-sm">
            The premium multi-vendor eCommerce marketplace for Bangladesh and South Asia.
          </p>
        </div>
        
        <div>
          <h4 className="font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/products" className="hover:text-primary">All Products</Link></li>
            <li><Link href="/vendors" className="hover:text-primary">Vendors Directory</Link></li>
            <li><Link href="/seller/register" className="hover:text-primary">Become a Seller</Link></li>
            <li><Link href="/faq" className="hover:text-primary">FAQ</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-semibold mb-4">Customer Service</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/profile" className="hover:text-primary">My Account</Link></li>
            <li><Link href="/orders" className="hover:text-primary">Track Order</Link></li>
            <li><Link href="/terms" className="hover:text-primary">Terms & Conditions</Link></li>
            <li><Link href="/terms" className="hover:text-primary">Return Policy</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-semibold mb-4">Contact Us</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>Email: support@paikarmart.com</li>
            <li>Phone: +880 1234 567890</li>
            <li>Address: Dhaka, Bangladesh</li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} PaikarMart. All rights reserved.
      </div>
    </footer>
  );
}

import React, { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { GlassCard } from "@/components/ui/GlassCard";
import { ChevronDown, HelpCircle, Search, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    category: "General",
    items: [
      { q: "What is PaikarMart?", a: "PaikarMart is a premium multi-vendor eCommerce marketplace connecting buyers with wholesalers, retailers, brand sellers, and local shops across Bangladesh. Whether you're buying for personal use or in bulk for your business, PaikarMart has you covered." },
      { q: "Is PaikarMart free to use?", a: "Browsing and buying on PaikarMart is completely free. Sellers may be subject to a small platform commission on successful sales, which will be outlined during seller registration." },
    ],
  },
  {
    category: "Buying",
    items: [
      { q: "What payment methods are accepted?", a: "Currently we support Cash on Delivery (COD). Mobile banking options (bKash, Nagad) and card payments are coming very soon." },
      { q: "How long does delivery take?", a: "Delivery within Dhaka typically takes 1–3 working days. Outside Dhaka, it's 3–5 working days, depending on the seller's location and courier availability." },
      { q: "How do I track my order?", a: "Go to My Orders in your account dashboard. Each order shows real-time status updates (Placed → Confirmed → Shipped → Delivered). A tracking code will appear once the order is shipped." },
      { q: "Can I cancel my order?", a: "You can cancel orders that are still in 'Pending' status. Once confirmed or shipped, cancellation is not possible — please contact support for assistance." },
    ],
  },
  {
    category: "Selling",
    items: [
      { q: "How do I become a seller?", a: "Click 'Become a Seller' in the header or homepage. Choose your business type, fill in your shop details, and submit your application. Our team reviews within 24 hours." },
      { q: "What seller types are available?", a: "We support Wholesalers, Retailers, Brand Sellers, Local Shops, Dropshippers, Service Providers, and B2B Suppliers. Each type has its own dashboard features." },
      { q: "How does wholesale pricing work?", a: "Sellers set a Minimum Order Quantity (MOQ). When a buyer's cart quantity meets or exceeds the MOQ for a product, the wholesale price is applied automatically at checkout." },
    ],
  },
  {
    category: "Account",
    items: [
      { q: "How do I reset my password?", a: "On the login page, click 'Forgot Password'. Enter your registered phone number and we'll send a 6-digit OTP to reset your password securely." },
      { q: "Is my personal information safe?", a: "Yes. PaikarMart uses industry-standard encryption for all data. We never share your personal information with third parties without your consent." },
    ],
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b last:border-0" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover:bg-white/3 transition-colors"
      >
        <span className={cn("text-sm font-medium leading-snug", open ? "text-white" : "text-white/75")}>{q}</span>
        <ChevronDown className={cn("h-4 w-4 shrink-0 transition-transform text-white/35", open && "rotate-180")} />
      </button>
      {open && (
        <div className="px-5 pb-4">
          <p className="text-sm text-white/50 leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  const [search, setSearch] = useState("");

  const filtered = FAQS.map(group => ({
    ...group,
    items: group.items.filter(
      item => !search || item.q.toLowerCase().includes(search.toLowerCase()) || item.a.toLowerCase().includes(search.toLowerCase()),
    ),
  })).filter(group => group.items.length > 0);

  return (
    <Layout>
      {/* Hero */}
      <div className="border-b border-white/5 mb-8">
        <div className="container mx-auto px-4 py-10">
          <div className="max-w-2xl mx-auto text-center">
            <div className="h-12 w-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
              <HelpCircle className="h-6 w-6 text-emerald-400" />
            </div>
            <h1 className="text-3xl font-extrabold text-white mb-2">Help & FAQ</h1>
            <p className="text-white/40 mb-6">Find answers to common questions about buying and selling on PaikarMart.</p>
            {/* Search */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search questions..."
                className="w-full h-10 pl-10 pr-4 rounded-xl text-sm text-white placeholder:text-white/30 focus:outline-none"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(16,185,129,0.2)" }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-12 max-w-3xl">
        {filtered.length === 0 ? (
          <GlassCard className="py-12 text-center">
            <p className="text-white/40 text-sm">No results for "{search}"</p>
          </GlassCard>
        ) : (
          <div className="space-y-6">
            {filtered.map(group => (
              <div key={group.category}>
                <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-3">{group.category}</p>
                <GlassCard className="overflow-hidden">
                  {group.items.map(item => <FaqItem key={item.q} q={item.q} a={item.a} />)}
                </GlassCard>
              </div>
            ))}
          </div>
        )}

        {/* Contact CTA */}
        <GlassCard className="mt-8 p-5 flex flex-col sm:flex-row items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-purple-500/15 border border-purple-500/20 flex items-center justify-center shrink-0">
            <MessageCircle className="h-5 w-5 text-purple-400" />
          </div>
          <div className="text-center sm:text-left flex-1">
            <p className="text-sm font-semibold text-white">Still have questions?</p>
            <p className="text-xs text-white/40">Our support team is available 9am–10pm, 7 days a week.</p>
          </div>
          <a href="mailto:support@paikarmart.com"
            className="px-4 py-2 rounded-xl text-xs font-bold text-white transition-all hover:opacity-90 shrink-0"
            style={{ background: "linear-gradient(135deg, hsl(145 65% 28%), hsl(145 60% 36%))" }}>
            Contact Support
          </a>
        </GlassCard>
      </div>
    </Layout>
  );
}

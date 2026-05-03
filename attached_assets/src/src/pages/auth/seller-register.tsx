import { useState } from "react";
import { Link, useLocation } from "wouter";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/features/auth/AuthContext";
import { toast } from "sonner";

const SELLER_TYPES = [
  { value: "service", label: "Digital Service Seller", kind: "digital_service" },
  { value: "retail", label: "Physical Product Seller", kind: "physical_product" },
  { value: "wholesale", label: "Wholesale Product Seller", kind: "physical_product" },
] as const;
const DIGITAL_CATEGORIES = ["Consulting", "Design", "Development", "Marketing", "Education"];
const PHYSICAL_CATEGORIES = ["Electronics", "Fashion", "Grocery", "Home", "Beauty", "Sports"];

export default function SellerRegisterPage() {
  const [, navigate] = useLocation();
  const auth = useAuth();
  const [form, setForm] = useState({
    fullName: "", phone: "", email: "", password: "",
    shopName: "", type: "retail" as (typeof SELLER_TYPES)[number]["value"],
    subType: "", category: "", location: "",
    payoutKind: "mobile" as "mobile" | "bank",
    payoutAccount: "",
  });
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((s) => ({ ...s, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await auth.registerSeller({
        fullName: form.fullName,
        phone: form.phone,
        email: form.email,
        password: form.password,
        seller: {
          shopName: form.shopName,
          type: form.type,
          subType: form.subType || undefined,
          category: form.category || undefined,
          location: form.location || undefined,
          payoutMethod: { kind: form.payoutKind, details: { account: form.payoutAccount } },
        },
      });
      toast.success("Seller account created");
      navigate("/seller");
    } catch {
      toast.error("Seller registration failed");
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <GlassCard className="p-6">
        <h1 className="text-2xl font-bold mb-1">Become a seller</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Open your storefront — Retail, Wholesale, or Service.
        </p>

        <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1"><Label>Full name</Label><Input value={form.fullName} onChange={set("fullName")} required /></div>
          <div className="space-y-1"><Label>Phone</Label><Input value={form.phone} onChange={set("phone")} required /></div>
          <div className="space-y-1"><Label>Email</Label><Input type="email" value={form.email} onChange={set("email")} /></div>
          <div className="space-y-1"><Label>Password</Label><Input type="password" value={form.password} onChange={set("password")} required /></div>

          <div className="md:col-span-2 border-t border-white/10 pt-4">
            <h3 className="font-semibold mb-3">Shop details</h3>
          </div>

          <div className="space-y-1"><Label>Shop name</Label><Input value={form.shopName} onChange={set("shopName")} required /></div>
          <div className="space-y-1">
            <Label>Shop type</Label>
            <Select value={form.type} onValueChange={(v) => setForm((s) => ({ ...s, type: v as (typeof SELLER_TYPES)[number]["value"], category: "" }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {SELLER_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1"><Label>Sub-type / specialty</Label><Input value={form.subType} onChange={set("subType")} placeholder="e.g. Electronics, Fashion" /></div>
          <div className="space-y-1">
            <Label>Primary category</Label>
            <Select value={form.category} onValueChange={(v) => setForm((s) => ({ ...s, category: v }))}>
              <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
              <SelectContent>
                {(form.type === "service" ? DIGITAL_CATEGORIES : PHYSICAL_CATEGORIES).map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1 md:col-span-2"><Label>Location</Label><Input value={form.location} onChange={set("location")} placeholder="City, Country" /></div>

          <div className="md:col-span-2 border-t border-white/10 pt-4">
            <h3 className="font-semibold mb-3">Payout</h3>
          </div>
          <div className="space-y-1">
            <Label>Method</Label>
            <Select value={form.payoutKind} onValueChange={(v) => setForm((s) => ({ ...s, payoutKind: v as "mobile" | "bank" }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="mobile">Mobile wallet (bKash / Nagad / Rocket)</SelectItem>
                <SelectItem value="bank">Bank account</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1"><Label>Account / number</Label><Input value={form.payoutAccount} onChange={set("payoutAccount")} required /></div>

          <Button type="submit" className="md:col-span-2 mt-2">Create seller account</Button>
        </form>

        <p className="mt-6 text-sm text-muted-foreground">
          Just want to buy? <Link href="/auth/register" className="text-primary hover:underline">Create a buyer account</Link>
        </p>
      </GlassCard>
    </div>
  );
}

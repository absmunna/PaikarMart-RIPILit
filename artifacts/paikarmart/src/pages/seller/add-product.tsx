import React, { useState } from "react";
import { useLocation } from "wouter";
import { SellerLayout } from "@/components/layout/SellerLayout";
import { toast } from "sonner";
import { Upload, Package } from "lucide-react";

const GLOW = "#00FF9C"; const TEXT = "#E8F5EE"; const MUTED = "#A3C9B8";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: MUTED }}>{label}</label>
      {children}
    </div>
  );
}

function Input({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className="w-full h-10 px-3 rounded-xl text-sm outline-none transition-all" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: TEXT }} />;
}

function Select({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select {...props} className="w-full h-10 px-3 rounded-xl text-sm outline-none" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", color: TEXT }}>
      {children}
    </select>
  );
}

const CATEGORIES = ["Agriculture","Food & Grocery","Electronics","Textiles","Spices","Beauty & Care","Home & Living","Stationery","Other"];

export default function AddProductPage() {
  const [, navigate] = useLocation();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", category: "Agriculture", price: "", stock: "", moq: "",
    description: "", deliveryDays: "3-5", type: "wholesale",
  });

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price) {
      toast.error("Product name and price are required");
      return;
    }
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 800));
      toast.success("Product added successfully!");
      navigate("/seller/products");
    } catch {
      toast.error("Failed to add product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SellerLayout title="Add Product">
      <div className="max-w-2xl mx-auto">
        <div style={{ background: "linear-gradient(145deg,rgba(255,255,255,0.06),rgba(255,255,255,0.025))", border: "1px solid rgba(255,255,255,0.10)", borderRadius: 20, boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }}>
          <div className="flex items-center gap-3 px-5 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="h-9 w-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(0,255,156,0.12)" }}>
              <Package className="h-5 w-5" style={{ color: GLOW }} />
            </div>
            <h1 className="font-bold text-base" style={{ color: TEXT }}>Add New Product</h1>
          </div>

          <form onSubmit={handleSubmit} className="p-5 space-y-5">

            {/* Image upload area */}
            <div className="border-2 border-dashed rounded-xl p-8 flex flex-col items-center gap-3 cursor-pointer transition-all hover:bg-white/4" style={{ borderColor: "rgba(255,255,255,0.15)" }}>
              <div className="h-12 w-12 rounded-full flex items-center justify-center" style={{ background: "rgba(0,255,156,0.10)" }}>
                <Upload className="h-6 w-6" style={{ color: GLOW }} />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium" style={{ color: TEXT }}>Upload Product Images</p>
                <p className="text-xs mt-0.5" style={{ color: MUTED }}>PNG, JPG, WEBP up to 5MB each</p>
              </div>
              <button type="button" className="h-8 px-4 rounded-lg text-xs font-semibold btn-outline">Browse Files</button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Product Name *">
                <Input value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Miniket Rice 50kg" required />
              </Field>
              <Field label="Category">
                <Select value={form.category} onChange={e => set("category", e.target.value)}>
                  {CATEGORIES.map(c => <option key={c} className="bg-[#0B2B1F]">{c}</option>)}
                </Select>
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="Price (৳) *">
                <Input type="number" value={form.price} onChange={e => set("price", e.target.value)} placeholder="0.00" min="0" required />
              </Field>
              <Field label="Stock Qty">
                <Input type="number" value={form.stock} onChange={e => set("stock", e.target.value)} placeholder="0" min="0" />
              </Field>
              <Field label="Min Order Qty">
                <Input type="number" value={form.moq} onChange={e => set("moq", e.target.value)} placeholder="1" min="1" />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Product Type">
                <Select value={form.type} onChange={e => set("type", e.target.value)}>
                  <option value="wholesale" className="bg-[#0B2B1F]">Wholesale</option>
                  <option value="retail"    className="bg-[#0B2B1F]">Retail</option>
                  <option value="both"      className="bg-[#0B2B1F]">Both</option>
                </Select>
              </Field>
              <Field label="Delivery Days">
                <Select value={form.deliveryDays} onChange={e => set("deliveryDays", e.target.value)}>
                  {["1-2","3-5","5-7","7-14"].map(d => <option key={d} className="bg-[#0B2B1F]">{d}</option>)}
                </Select>
              </Field>
            </div>

            <Field label="Description">
              <textarea
                value={form.description}
                onChange={e => set("description", e.target.value)}
                rows={4}
                placeholder="Describe your product, quality, packaging, etc."
                className="w-full px-3 py-2.5 rounded-xl text-sm outline-none resize-none"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: TEXT }}
              />
            </Field>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => navigate("/seller/products")} className="flex-1 h-11 rounded-xl text-sm font-medium btn-outline">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="flex-1 h-11 rounded-xl text-sm font-bold btn-glow disabled:opacity-60">
                {loading ? "Adding..." : "Add Product"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </SellerLayout>
  );
}

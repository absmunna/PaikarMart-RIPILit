import React, { useState, useMemo, useRef, useCallback } from "react";
import { Link, useLocation, useRoute } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { GlassCard } from "@/components/ui/GlassCard";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft, Check, ImagePlus, X, MapPin, Tag,
  Package, DollarSign, FileText, Rss, Search, ChevronDown,
  Video, Globe, Languages, Info, Zap, Star, Save,
  ToggleLeft, ToggleRight, Percent, Layers, ChevronRight,
  UploadCloud, GripVertical, BadgePercent, ShoppingBag,
} from "lucide-react";
import { toast } from "sonner";
import { useSeller } from "@/seller/SellerContext";
import { SELLER_TYPE_LABELS, SellerType } from "@/seller/types";
import { formatBDT } from "@/lib/format";
import { cn } from "@/lib/utils";

/* ─── Constants ─────────────────────────────────────────────── */

const CATEGORIES = [
  { id: "home",        name: "Home & Lifestyle",     emoji: "🏡", subs: ["Furniture","Decor","Bedding","Lighting","Storage"] },
  { id: "fashion",     name: "Fashion & Apparel",    emoji: "👗", subs: ["Men","Women","Kids","Bags","Shoes","Accessories"] },
  { id: "kitchen",     name: "Kitchen & Dining",     emoji: "🍳", subs: ["Cookware","Cutlery","Storage","Appliances"] },
  { id: "electronics", name: "Electronics",          emoji: "📱", subs: ["Phones","Laptops","Audio","Cameras","Accessories"] },
  { id: "grocery",     name: "Grocery & Food",       emoji: "🛒", subs: ["Vegetables","Fruits","Dairy","Snacks","Beverages"] },
  { id: "beauty",      name: "Beauty & Personal Care",emoji: "💄", subs: ["Skincare","Makeup","Haircare","Fragrances"] },
  { id: "sports",      name: "Sports & Fitness",     emoji: "⚽", subs: ["Equipment","Clothing","Outdoor","Nutrition"] },
  { id: "books",       name: "Books & Stationery",   emoji: "📚", subs: ["Academic","Fiction","Office","Art Supplies"] },
  { id: "toys",        name: "Toys & Kids",          emoji: "🧸", subs: ["Infant","Educational","Outdoor","Games"] },
  { id: "health",      name: "Health & Wellness",    emoji: "💊", subs: ["Vitamins","Medical","Fitness","Mental Wellness"] },
  { id: "services",    name: "Services",             emoji: "🔧", subs: ["Repair","Cleaning","Delivery","IT"] },
  { id: "real_estate", name: "Real Estate",          emoji: "🏢", subs: ["Apartment","Commercial","Land","Office"] },
  { id: "hotel",       name: "Hotel & Tour",         emoji: "🏨", subs: ["Hotels","Tour Packages","Transport"] },
  { id: "automotive",  name: "Automotive",           emoji: "🚗", subs: ["Cars","Bikes","Parts","Accessories"] },
];

const POPULAR_CATS = ["electronics", "fashion", "grocery", "beauty", "home"];

const DISTRICTS = [
  "Dhaka","Chittagong","Sylhet","Rajshahi","Khulna",
  "Barisal","Rangpur","Mymensingh","Comilla","Gazipur",
  "Narayanganj","Narsingdi","Tangail","Bogura","Jessore",
];

const UNITS = ["Piece","Kg","Gram","Liter","Meter","Box","Dozen","Set","Pair","Pack","Bundle","Bag"];

const STEPS = [
  { id: 1, label: "Basic",   icon: FileText   },
  { id: 2, label: "Media",   icon: ImagePlus  },
  { id: 3, label: "Pricing", icon: DollarSign },
  { id: 4, label: "Details", icon: Tag        },
];

const SAMPLE_IMAGES = [
  "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80",
  "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600&q=80",
  "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80",
  "https://images.unsplash.com/photo-1604671368394-2240d0b1bb6c?w=600&q=80",
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
];

/* ─── Form State ─────────────────────────────────────────────── */

interface FormState {
  title: string;
  categoryId: string;
  subCategory: string;
  tags: string;
  tagInput: string;
  images: string[];
  primaryImageIndex: number;
  imageUrlInput: string;
  videoUrl: string;
  retailPrice: string;
  sellWholesale: boolean;
  wholesalePrice: string;
  moq: string;
  useDiscount: boolean;
  discountPct: string;
  stock: string;
  unit: string;
  shortDescription: string;
  fullDescription: string;
  descLang: "en" | "bn";
  location: string;
  postToFeed: boolean;
  type: SellerType;
}

/* ─── Shared primitives ──────────────────────────────────────── */

function Field({ label, hint, required, children }: {
  label: string; hint?: string; required?: boolean; children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-1.5">
        <label className="text-sm font-medium text-white/90">{label}</label>
        {required && <span className="text-[10px] text-rose-400">*</span>}
        {hint && (
          <div className="group relative">
            <Info className="h-3 w-3 text-white/25 cursor-help" />
            <div className="absolute bottom-full left-0 mb-1.5 hidden group-hover:block z-10 w-48 p-2 rounded-lg text-[10px] text-white/70 bg-black/80 backdrop-blur-sm border border-white/10">
              {hint}
            </div>
          </div>
        )}
      </div>
      {children}
    </div>
  );
}

function SI({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { className?: string }) {
  return (
    <Input {...props} className={cn(
      "bg-white/5 border-white/10 text-white placeholder:text-white/25 focus:border-emerald-500/50 focus:ring-0 h-10 rounded-xl transition-colors",
      className,
    )} />
  );
}

function ST({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { className?: string }) {
  return (
    <Textarea {...props} className={cn(
      "bg-white/5 border-white/10 text-white placeholder:text-white/25 focus:border-emerald-500/50 focus-visible:ring-0 rounded-xl resize-none transition-colors",
      className,
    )} />
  );
}

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button type="button" onClick={onToggle}
      className={cn(
        "relative h-6 w-11 rounded-full border transition-all duration-300 shrink-0",
        on ? "bg-emerald-500/40 border-emerald-500/60" : "bg-white/10 border-white/20",
      )}>
      <span className={cn(
        "absolute top-0.5 h-5 w-5 rounded-full transition-all duration-300 shadow-sm",
        on ? "left-5 bg-emerald-400" : "left-0.5 bg-white/40",
      )} />
    </button>
  );
}

/* ─── Step 1: Basic Info ─────────────────────────────────────── */

function StepBasic({ form, update }: { form: FormState; update: <K extends keyof FormState>(k: K, v: FormState[K]) => void }) {
  const [catSearch, setCatSearch] = useState("");
  const [showCatDropdown, setShowCatDropdown] = useState(false);

  const filteredCats = useMemo(
    () => CATEGORIES.filter(c => c.name.toLowerCase().includes(catSearch.toLowerCase())),
    [catSearch],
  );
  const selectedCat = CATEGORIES.find(c => c.id === form.categoryId);
  const popularCats = CATEGORIES.filter(c => POPULAR_CATS.includes(c.id));

  const tags = useMemo(() => form.tags.split(",").map(t => t.trim()).filter(Boolean), [form.tags]);

  const addTag = () => {
    const t = form.tagInput.trim().toLowerCase();
    if (!t) return;
    if (tags.includes(t)) { toast.error("Tag already added"); return; }
    if (tags.length >= 10) { toast.error("Max 10 tags"); return; }
    update("tags", [...tags, t].join(", "));
    update("tagInput", "");
  };

  return (
    <div className="flex flex-col gap-5">

      {/* Title */}
      <Field label="Product Title" required hint="Clear and descriptive — shown in search results.">
        <SI
          value={form.title}
          onChange={e => update("title", e.target.value)}
          placeholder="e.g. Samsung 65W USB-C Fast Charger"
          maxLength={120}
          className="h-12 text-base"
        />
        <span className="text-[10px] text-white/25 text-right">{form.title.length}/120</span>
      </Field>

      {/* Popular category chips */}
      <div>
        <p className="text-[10px] text-white/35 font-semibold uppercase tracking-wider mb-2">Popular Categories</p>
        <div className="flex flex-wrap gap-2">
          {popularCats.map(cat => (
            <button
              key={cat.id}
              type="button"
              onClick={() => { update("categoryId", cat.id); update("subCategory", ""); }}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                form.categoryId === cat.id
                  ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                  : "bg-white/5 border-white/10 text-white/50 hover:text-white hover:border-white/20",
              )}
            >
              <span>{cat.emoji}</span>{cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Category searchable dropdown */}
      <Field label="Category" required>
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowCatDropdown(v => !v)}
            className="w-full flex items-center justify-between px-3 h-10 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 text-sm text-left transition-colors"
          >
            {selectedCat ? (
              <span className="flex items-center gap-2 text-white">
                <span>{selectedCat.emoji}</span>{selectedCat.name}
              </span>
            ) : (
              <span className="text-white/30">Search or select a category</span>
            )}
            <ChevronDown className={cn("h-4 w-4 text-white/30 transition-transform", showCatDropdown && "rotate-180")} />
          </button>

          {showCatDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1 z-30 rounded-xl shadow-2xl overflow-hidden"
              style={{ background: "rgba(6,18,14,0.98)", border: "1px solid rgba(255,255,255,0.1)" }}>
              <div className="p-2 border-b border-white/5">
                <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-white/5">
                  <Search className="h-3.5 w-3.5 text-white/30 shrink-0" />
                  <input
                    autoFocus
                    value={catSearch}
                    onChange={e => setCatSearch(e.target.value)}
                    placeholder="Search category..."
                    className="flex-1 bg-transparent text-sm text-white placeholder:text-white/30 outline-none"
                  />
                </div>
              </div>
              <div className="max-h-52 overflow-y-auto p-1.5 grid grid-cols-2 gap-1">
                {filteredCats.map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => { update("categoryId", cat.id); update("subCategory", ""); setShowCatDropdown(false); setCatSearch(""); }}
                    className={cn(
                      "flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-left transition-all",
                      form.categoryId === cat.id
                        ? "bg-emerald-500/20 text-emerald-300 font-semibold"
                        : "text-white/60 hover:bg-white/5 hover:text-white",
                    )}
                  >
                    <span>{cat.emoji}</span>{cat.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </Field>

      {/* Sub category */}
      {selectedCat && selectedCat.subs.length > 0 && (
        <Field label="Sub Category">
          <div className="flex flex-wrap gap-2">
            {selectedCat.subs.map(sub => (
              <button
                key={sub}
                type="button"
                onClick={() => update("subCategory", form.subCategory === sub ? "" : sub)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                  form.subCategory === sub
                    ? "bg-purple-500/20 border-purple-500/40 text-purple-300"
                    : "bg-white/5 border-white/10 text-white/50 hover:text-white hover:border-white/20",
                )}
              >
                {sub}
              </button>
            ))}
          </div>
        </Field>
      )}

      {/* Tags */}
      <Field label="Tags" hint="Up to 10 tags help buyers find your product.">
        <div className="flex gap-2">
          <SI
            value={form.tagInput}
            onChange={e => update("tagInput", e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
            placeholder='e.g. "wireless" then Enter'
            className="flex-1"
          />
          <button type="button" onClick={addTag}
            className="px-4 rounded-xl bg-white/8 border border-white/10 text-white/60 text-sm font-medium hover:text-white hover:bg-white/12 transition-all shrink-0">
            Add
          </button>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1">
            {tags.map(tag => (
              <span key={tag} className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium text-emerald-400 bg-emerald-500/15 border border-emerald-500/25">
                #{tag}
                <button type="button" onClick={() => update("tags", tags.filter(t => t !== tag).join(", "))} className="text-emerald-400/50 hover:text-rose-400 ml-0.5 transition-colors">
                  <X className="h-2.5 w-2.5" />
                </button>
              </span>
            ))}
          </div>
        )}
      </Field>
    </div>
  );
}

/* ─── Step 2: Media ──────────────────────────────────────────── */

function StepMedia({ form, update }: { form: FormState; update: <K extends keyof FormState>(k: K, v: FormState[K]) => void }) {
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addImageUrl = useCallback((url: string) => {
    const trimmed = url.trim();
    if (!trimmed) return;
    if (form.images.includes(trimmed)) { toast.error("Image already added"); return; }
    if (form.images.length >= 8) { toast.error("Max 8 images"); return; }
    update("images", [...form.images, trimmed]);
    update("imageUrlInput", "");
  }, [form.images, update]);

  const removeImage = useCallback((idx: number) => {
    const next = form.images.filter((_, i) => i !== idx);
    update("images", next);
    if (form.primaryImageIndex === idx) update("primaryImageIndex", 0);
    else if (form.primaryImageIndex > idx) update("primaryImageIndex", form.primaryImageIndex - 1);
  }, [form.images, form.primaryImageIndex, update]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const text = e.dataTransfer.getData("text/plain");
    if (text) addImageUrl(text);
  }, [addImageUrl]);

  return (
    <div className="flex flex-col gap-5">

      {/* Drop zone */}
      <Field label="Product Images" required hint="Square 1:1 images look best. First image is cover by default.">
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={cn(
            "rounded-xl transition-all",
            dragOver ? "border-2 border-emerald-400/60 bg-emerald-500/8" : "border border-dashed border-white/15 bg-white/3",
          )}
        >
          {form.images.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-10 px-4 text-center cursor-pointer"
              onClick={() => fileInputRef.current?.click()}>
              <div className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                <UploadCloud className="h-6 w-6 text-white/30" />
              </div>
              <div>
                <p className="text-sm text-white/60 font-medium">Drag & drop or paste image URL below</p>
                <p className="text-[11px] text-white/25 mt-0.5">1:1 square recommended · Up to 8 images</p>
              </div>
            </div>
          ) : (
            <div className="p-3">
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {form.images.map((url, i) => (
                  <div key={url} className="relative group" style={{ aspectRatio: "1/1" }}>
                    <img
                      src={url}
                      alt={`img-${i}`}
                      className={cn(
                        "w-full h-full object-cover rounded-xl border-2 transition-all cursor-pointer",
                        form.primaryImageIndex === i ? "border-emerald-400 shadow-lg shadow-emerald-500/20" : "border-white/10 hover:border-white/25",
                      )}
                      onClick={() => update("primaryImageIndex", i)}
                      onError={e => { (e.target as HTMLImageElement).src = "https://placehold.co/200x200/0d1f1a/555?text=Error"; }}
                    />
                    {form.primaryImageIndex === i && (
                      <span className="absolute top-1 left-1 flex items-center gap-0.5 text-[8px] font-bold bg-emerald-500 text-white px-1.5 py-0.5 rounded-md">
                        <Star className="h-2 w-2" /> Cover
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 h-5 w-5 rounded-full bg-black/70 backdrop-blur-sm flex items-center justify-center text-white/70 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                    {form.primaryImageIndex !== i && (
                      <button
                        type="button"
                        onClick={() => update("primaryImageIndex", i)}
                        className="absolute bottom-1 left-1 right-1 text-[8px] bg-black/60 backdrop-blur-sm text-white/50 hover:text-white rounded-md py-0.5 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        Set as cover
                      </button>
                    )}
                  </div>
                ))}
                {form.images.length < 8 && (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-white/10 text-white/20 hover:border-emerald-500/30 hover:text-emerald-400/50 transition-all cursor-pointer"
                    style={{ aspectRatio: "1/1" }}
                  >
                    <ImagePlus className="h-5 w-5" />
                    <span className="text-[9px]">Add</span>
                  </div>
                )}
              </div>
              <p className="text-[10px] text-white/25 mt-2">Tap an image to set as cover photo</p>
            </div>
          )}
        </div>
      </Field>

      {/* URL input */}
      <div className="flex gap-2">
        <SI
          value={form.imageUrlInput}
          onChange={e => update("imageUrlInput", e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addImageUrl(form.imageUrlInput); } }}
          placeholder="Paste image URL and press Enter"
          className="flex-1"
        />
        <button type="button" onClick={() => addImageUrl(form.imageUrlInput)}
          className="px-4 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-sm font-semibold hover:bg-emerald-500/30 transition-all shrink-0">
          Add
        </button>
      </div>

      {/* Quick samples */}
      <div>
        <p className="text-[10px] text-white/30 mb-2 font-medium uppercase tracking-wider">Quick Sample Images</p>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {SAMPLE_IMAGES.map((url, i) => (
            <button key={i} type="button" onClick={() => addImageUrl(url)}
              className={cn(
                "shrink-0 h-12 w-12 rounded-lg overflow-hidden border-2 transition-all",
                form.images.includes(url) ? "border-emerald-500/60 opacity-50" : "border-white/10 hover:border-emerald-500/40",
              )}>
              <img src={url} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      {/* Video */}
      <Field label="Product Video" hint="YouTube, Vimeo, or direct .mp4 link. Optional.">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/30 shrink-0">
            <Video className="h-4 w-4" />
          </div>
          <SI
            value={form.videoUrl}
            onChange={e => update("videoUrl", e.target.value)}
            placeholder="https://youtube.com/... or .mp4 link"
            className="flex-1"
          />
        </div>
      </Field>

      <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden"
        onChange={e => {
          const files = Array.from(e.target.files || []);
          files.forEach(file => {
            const url = URL.createObjectURL(file);
            addImageUrl(url);
          });
          e.target.value = "";
        }}
      />
    </div>
  );
}

/* ─── Step 3: Pricing & Stock ────────────────────────────────── */

function StepPricing({ form, update }: { form: FormState; update: <K extends keyof FormState>(k: K, v: FormState[K]) => void }) {
  const retail = parseFloat(form.retailPrice) || 0;
  const wholesale = parseFloat(form.wholesalePrice) || 0;
  const discountPct = parseFloat(form.discountPct) || 0;
  const discountedPrice = retail > 0 && discountPct > 0 ? retail * (1 - discountPct / 100) : retail;
  const comparePrice = retail > 0 && discountPct > 0 ? retail : 0;

  return (
    <div className="flex flex-col gap-5">

      {/* Price preview */}
      {retail > 0 && (
        <div className="rounded-xl p-4 flex items-center justify-between gap-4"
          style={{ background: "rgba(16,185,129,0.07)", border: "1px solid rgba(16,185,129,0.15)" }}>
          <div>
            <p className="text-[10px] text-white/40 mb-1">Price Preview</p>
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-xl font-bold text-emerald-400">{formatBDT(discountedPrice)}</span>
              {discountPct > 0 && (
                <>
                  <span className="text-sm text-white/30 line-through">{formatBDT(retail)}</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-red-500/80 text-white">-{discountPct}%</span>
                </>
              )}
            </div>
            {form.sellWholesale && wholesale > 0 && (
              <p className="text-[10px] text-orange-400 mt-1">
                Wholesale: {formatBDT(wholesale)}{form.moq ? ` (MOQ: ${form.moq})` : ""}
              </p>
            )}
          </div>
          <div className="text-right">
            <p className="text-[10px] text-white/40">Stock</p>
            <p className="text-lg font-bold text-white">{form.stock || "—"}</p>
            <p className="text-[10px] text-white/40">{form.unit}</p>
          </div>
        </div>
      )}

      {/* Retail price */}
      <Field label="Retail Price (৳)" required>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-emerald-400 font-bold">৳</span>
          <SI type="number" min="0" step="1" value={form.retailPrice}
            onChange={e => update("retailPrice", e.target.value)}
            placeholder="0" className="pl-8 h-11 text-base font-semibold" />
        </div>
      </Field>

      {/* Discount toggle */}
      <div className={cn(
        "rounded-xl p-4 transition-all",
        form.useDiscount ? "border border-orange-500/20 bg-orange-500/5" : "border border-white/8 bg-white/3",
      )}>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <BadgePercent className="h-4 w-4 text-orange-400" />
            <span className="text-sm font-semibold text-white">Add Discount</span>
          </div>
          <Toggle on={form.useDiscount} onToggle={() => { update("useDiscount", !form.useDiscount); if (form.useDiscount) update("discountPct", ""); }} />
        </div>
        <p className="text-[11px] text-white/40 mb-3">Show a crossed-out original price with % off badge</p>
        {form.useDiscount && (
          <div className="flex items-center gap-3 mt-3">
            <div className="relative flex-1">
              <Percent className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/30" />
              <SI type="number" min="1" max="99" value={form.discountPct}
                onChange={e => update("discountPct", e.target.value)}
                placeholder="e.g. 20" className="pr-8" />
            </div>
            {retail > 0 && parseFloat(form.discountPct) > 0 && (
              <div className="text-right shrink-0">
                <p className="text-[10px] text-white/40">Final price</p>
                <p className="text-sm font-bold text-emerald-400">{formatBDT(retail * (1 - parseFloat(form.discountPct) / 100))}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Wholesale toggle */}
      <div className={cn(
        "rounded-xl p-4 transition-all",
        form.sellWholesale ? "border border-purple-500/20 bg-purple-500/5" : "border border-white/8 bg-white/3",
      )}>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4 text-purple-400" />
            <span className="text-sm font-semibold text-white">Also Sell Wholesale</span>
          </div>
          <Toggle on={form.sellWholesale} onToggle={() => update("sellWholesale", !form.sellWholesale)} />
        </div>
        <p className="text-[11px] text-white/40 mb-1">Set a bulk price for resellers and B2B buyers</p>
        {form.sellWholesale && (
          <div className="grid grid-cols-2 gap-3 mt-3">
            <Field label="Wholesale Price (৳)">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-purple-400 font-bold">৳</span>
                <SI type="number" min="0" value={form.wholesalePrice}
                  onChange={e => update("wholesalePrice", e.target.value)}
                  placeholder="0" className="pl-8" />
              </div>
            </Field>
            <Field label="Min. Order Qty" hint="Minimum order for wholesale price.">
              <SI type="number" min="1" value={form.moq}
                onChange={e => update("moq", e.target.value)}
                placeholder="e.g. 10" />
            </Field>
          </div>
        )}
      </div>

      {/* Stock + Unit */}
      <div className="grid grid-cols-2 gap-3">
        <Field label="Stock Quantity" required>
          <SI type="number" min="0" value={form.stock}
            onChange={e => update("stock", e.target.value)}
            placeholder="e.g. 50" />
        </Field>
        <Field label="Unit">
          <Select value={form.unit} onValueChange={v => update("unit", v)}>
            <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-xl h-10 focus:ring-0 focus:border-emerald-500/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#071410] border-white/10">
              {UNITS.map(u => (
                <SelectItem key={u} value={u} className="text-white/80 focus:bg-white/10 focus:text-white">{u}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>
    </div>
  );
}

/* ─── Step 4: Details ────────────────────────────────────────── */

function StepDetails({ form, update, sellerLocation }: {
  form: FormState;
  update: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
  sellerLocation: string;
}) {
  return (
    <div className="flex flex-col gap-5">

      {/* Short description */}
      <Field label="Short Description" required hint="1–2 sentences shown in product card / feed preview.">
        <ST
          value={form.shortDescription}
          onChange={e => update("shortDescription", e.target.value)}
          placeholder="Brief summary — shown in search results and feed cards"
          className="min-h-[72px]"
          maxLength={200}
        />
        <span className="text-[10px] text-white/25 text-right">{form.shortDescription.length}/200</span>
      </Field>

      {/* Full description with EN/BN toggle */}
      <Field label="Full Description" hint="Detailed product info. Supports Bangla.">
        <div className="flex gap-1.5 mb-2">
          {(["en","bn"] as const).map(lang => (
            <button key={lang} type="button" onClick={() => update("descLang", lang)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border transition-all",
                form.descLang === lang
                  ? lang === "en"
                    ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                    : "bg-purple-500/20 border-purple-500/40 text-purple-400"
                  : "bg-white/5 border-white/10 text-white/40 hover:text-white/70",
              )}>
              {lang === "en" ? <><Globe className="h-3 w-3" /> English</> : <><Languages className="h-3 w-3" /> বাংলা</>}
            </button>
          ))}
        </div>
        {form.descLang === "en" ? (
          <ST value={form.fullDescription}
            onChange={e => update("fullDescription", e.target.value)}
            placeholder="Write a detailed description — features, specs, materials, care instructions..."
            className="min-h-[140px]" />
        ) : (
          <ST value={form.fullDescription}
            onChange={e => update("fullDescription", e.target.value)}
            placeholder="পণ্যের বিস্তারিত বিবরণ — বৈশিষ্ট্য, উপাদান, ব্যবহার বিধি..."
            className="min-h-[140px]" />
        )}
      </Field>

      {/* Location */}
      <Field label="Product Location" required hint="Where this product ships from.">
        <div className="flex gap-2 mb-1.5">
          {sellerLocation && (
            <button type="button" onClick={() => update("location", sellerLocation)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                form.location === sellerLocation
                  ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                  : "bg-white/5 border-white/10 text-white/50 hover:text-white",
              )}>
              <MapPin className="h-3 w-3" /> Use shop location
            </button>
          )}
        </div>
        <Select value={form.location} onValueChange={v => update("location", v)}>
          <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-xl h-10 focus:ring-0 mb-1.5 focus:border-emerald-500/50">
            <SelectValue placeholder="Select district" />
          </SelectTrigger>
          <SelectContent className="bg-[#071410] border-white/10">
            {DISTRICTS.map(d => (
              <SelectItem key={d} value={d} className="text-white/80 focus:bg-white/10 focus:text-white">{d}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <SI value={form.location} onChange={e => update("location", e.target.value)}
          placeholder="Or type exact location (e.g. Mirpur, Dhaka)" />
      </Field>

      {/* Show in social feed */}
      <div className={cn(
        "rounded-xl p-4 flex items-start gap-4 transition-all",
        form.postToFeed ? "border border-emerald-500/20 bg-emerald-500/6" : "border border-white/8 bg-white/3",
      )}>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-0.5">
            <Rss className="h-4 w-4 text-emerald-400" />
            <span className="text-sm font-semibold text-white">Show in Social Feed</span>
          </div>
          <p className="text-[11px] text-white/45 leading-relaxed">
            Your product will appear in the Live Feed on the homepage, reaching more buyers organically.
          </p>
        </div>
        <Toggle on={form.postToFeed} onToggle={() => update("postToFeed", !form.postToFeed)} />
      </div>
    </div>
  );
}

/* ─── Step Progress Bar ──────────────────────────────────────── */

function StepBar({ current, onJump }: { current: number; onJump: (n: number) => void }) {
  return (
    <div className="flex items-center gap-0 mb-6">
      {STEPS.map((step, i) => {
        const done = current > step.id;
        const active = current === step.id;
        return (
          <React.Fragment key={step.id}>
            <button
              type="button"
              onClick={() => done && onJump(step.id)}
              className={cn("flex flex-col items-center gap-1.5", done && "cursor-pointer")}
            >
              <div className={cn(
                "h-8 w-8 rounded-xl flex items-center justify-center text-xs font-bold transition-all duration-200",
                done    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                : active ? "bg-emerald-500/20 border-2 border-emerald-500/60 text-emerald-400"
                :          "bg-white/5 border border-white/10 text-white/30",
              )}>
                {done ? <Check className="h-4 w-4" /> : <step.icon className="h-3.5 w-3.5" />}
              </div>
              <span className={cn(
                "text-[10px] font-medium transition-colors",
                active ? "text-emerald-400" : done ? "text-white/60" : "text-white/25",
              )}>
                {step.label}
              </span>
            </button>
            {i < STEPS.length - 1 && (
              <div className={cn(
                "flex-1 h-0.5 mb-4 mx-1 rounded-full transition-all duration-300",
                current > step.id ? "bg-emerald-500" : "bg-white/8",
              )} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

/* ─── Validation ─────────────────────────────────────────────── */

function validateStep(step: number, form: FormState): string | null {
  if (step === 1) {
    if (!form.title.trim())    return "Product title is required";
    if (!form.categoryId)      return "Please select a category";
  }
  if (step === 2) {
    if (form.images.length === 0) return "Add at least one product image";
  }
  if (step === 3) {
    if (!form.retailPrice || parseFloat(form.retailPrice) <= 0) return "Retail price must be greater than 0";
    if (!form.stock || parseInt(form.stock) < 0)                return "Stock quantity is required";
  }
  if (step === 4) {
    if (!form.shortDescription.trim()) return "Short description is required";
    if (!form.location.trim())         return "Location is required";
  }
  return null;
}

/* ─── Main Page ──────────────────────────────────────────────── */

export default function SellerProductFormPage() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute<{ id: string }>("/seller/products/:id/edit");
  const { products, profile, createProduct, updateProduct } = useSeller();

  const editing = params?.id ? products.find(p => p.id === params.id) : null;
  const isEdit = !!editing;

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);

  const [form, setForm] = useState<FormState>(() => editing ? {
    title:            editing.title,
    categoryId:       editing.categoryId,
    subCategory:      "",
    tags:             editing.tags.join(", "),
    tagInput:         "",
    images:           [...editing.images],
    primaryImageIndex: 0,
    imageUrlInput:    "",
    videoUrl:         editing.videoUrl ?? "",
    retailPrice:      String(editing.price),
    sellWholesale:    !!editing.wholesalePrice,
    wholesalePrice:   editing.wholesalePrice ? String(editing.wholesalePrice) : "",
    moq:              editing.moq ? String(editing.moq) : "",
    useDiscount:      !!editing.comparePrice,
    discountPct:      editing.comparePrice && editing.price
      ? String(Math.round(((editing.comparePrice - editing.price) / editing.comparePrice) * 100))
      : "",
    stock:            String(editing.stock),
    unit:             "Piece",
    shortDescription: editing.description,
    fullDescription:  editing.descriptionBn ?? "",
    descLang:         "en",
    location:         editing.location,
    postToFeed:       editing.postToFeed ?? false,
    type:             editing.type,
  } : {
    title:            "",
    categoryId:       "",
    subCategory:      "",
    tags:             "",
    tagInput:         "",
    images:           [],
    primaryImageIndex: 0,
    imageUrlInput:    "",
    videoUrl:         "",
    retailPrice:      "",
    sellWholesale:    false,
    wholesalePrice:   "",
    moq:              "",
    useDiscount:      false,
    discountPct:      "",
    stock:            "",
    unit:             "Piece",
    shortDescription: "",
    fullDescription:  "",
    descLang:         "en",
    location:         profile.location,
    postToFeed:       true,
    type:             profile.type,
  });

  const update = useCallback(<K extends keyof FormState>(k: K, v: FormState[K]) => {
    setForm(f => ({ ...f, [k]: v }));
  }, []);

  const goNext = () => {
    const err = validateStep(step, form);
    if (err) { toast.error(err); return; }
    setStep(s => Math.min(s + 1, 4));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goBack = () => {
    setStep(s => Math.max(s - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const buildPayload = () => {
    const cat = CATEGORIES.find(c => c.id === form.categoryId)!;
    const retail = parseFloat(form.retailPrice);
    const discountPct = form.useDiscount ? parseFloat(form.discountPct) : 0;
    const finalPrice = discountPct > 0 ? retail * (1 - discountPct / 100) : retail;
    return {
      title:          form.title.trim(),
      titleBn:        undefined,
      description:    form.shortDescription.trim(),
      descriptionBn:  form.fullDescription.trim() || undefined,
      categoryId:     cat.id,
      categoryName:   cat.name,
      type:           form.type,
      price:          Math.round(finalPrice),
      comparePrice:   discountPct > 0 ? retail : undefined,
      wholesalePrice: form.sellWholesale && form.wholesalePrice ? parseFloat(form.wholesalePrice) : undefined,
      moq:            form.sellWholesale && form.moq ? parseInt(form.moq) : undefined,
      stock:          parseInt(form.stock),
      images:         form.primaryImageIndex === 0
        ? form.images
        : [form.images[form.primaryImageIndex], ...form.images.filter((_, i) => i !== form.primaryImageIndex)],
      videoUrl:       form.videoUrl.trim() || undefined,
      location:       form.location.trim(),
      tags:           form.tags.split(",").map(t => t.trim()).filter(Boolean),
      postToFeed:     form.postToFeed,
    };
  };

  const onSaveDraft = async () => {
    if (!form.title.trim()) { toast.error("Add a title to save draft"); return; }
    setSavingDraft(true);
    await new Promise(r => setTimeout(r, 500));
    setSavingDraft(false);
    toast.success("Draft saved!");
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    for (let s = 1; s <= 4; s++) {
      const err = validateStep(s, form);
      if (err) { toast.error(`Step ${s}: ${err}`); setStep(s); return; }
    }
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 700));
    const payload = buildPayload();
    if (isEdit && editing) {
      updateProduct(editing.id, payload);
      toast.success("Product updated!");
    } else {
      createProduct(payload);
      toast.success(form.postToFeed ? "Product published & posted to Feed! 🎉" : "Product published! 🎉");
    }
    setSubmitting(false);
    setLocation("/seller/products");
  };

  const stepTitles: Record<number, string> = {
    1: "Basic Information",
    2: "Images & Media",
    3: "Pricing & Stock",
    4: "Description & Details",
  };

  const completedSteps = [1,2,3,4].filter(s => validateStep(s, form) === null).length;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-5 max-w-2xl">

        {/* ── Page Header ── */}
        <div className="flex items-start justify-between gap-3 mb-6">
          <div>
            <Link href="/seller/products">
              <button className="inline-flex items-center gap-1 text-xs text-white/40 hover:text-white/70 transition-colors mb-2">
                <ArrowLeft className="h-3.5 w-3.5" /> Back to Products
              </button>
            </Link>
            <h1 className="text-xl sm:text-2xl font-bold text-white leading-tight">
              {isEdit ? "Edit Product" : "Add New Product"}
            </h1>
            <p className="text-xs text-white/40 mt-0.5">
              {stepTitles[step]} · Step {step} of {STEPS.length} · {completedSteps}/4 complete
            </p>
          </div>

          {/* Header action buttons */}
          <div className="flex items-center gap-2 shrink-0 mt-1">
            <button
              type="button"
              onClick={onSaveDraft}
              disabled={savingDraft}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/12 bg-white/5 text-xs text-white/60 hover:text-white hover:bg-white/8 transition-all disabled:opacity-50"
            >
              {savingDraft
                ? <span className="h-3 w-3 rounded-full border border-white/30 border-t-white animate-spin" />
                : <Save className="h-3.5 w-3.5" />}
              Draft
            </button>
            <button
              type="button"
              onClick={onSubmit as unknown as React.MouseEventHandler}
              disabled={submitting}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all disabled:opacity-60 shadow-md hover:opacity-90"
              style={{ background: "linear-gradient(135deg, hsl(145 65% 30%), hsl(145 60% 40%))", boxShadow: "0 3px 12px rgba(16,185,129,0.3)" }}
            >
              {submitting
                ? <span className="h-3 w-3 rounded-full border border-white/30 border-t-white animate-spin" />
                : <Zap className="h-3.5 w-3.5" />}
              {isEdit ? "Save" : "Publish"}
            </button>
          </div>
        </div>

        {/* ── Step progress ── */}
        <StepBar current={step} onJump={setStep} />

        {/* ── Form body ── */}
        <form onSubmit={onSubmit}>
          <GlassCard className="p-5 sm:p-6 mb-5">
            {step === 1 && <StepBasic form={form} update={update} />}
            {step === 2 && <StepMedia form={form} update={update} />}
            {step === 3 && <StepPricing form={form} update={update} />}
            {step === 4 && <StepDetails form={form} update={update} sellerLocation={profile.location} />}
          </GlassCard>

          {/* ── Nav buttons ── */}
          <div className="flex items-center justify-between gap-3 mb-8">
            <button
              type="button"
              onClick={step === 1 ? () => setLocation("/seller/products") : goBack}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all"
            >
              <ArrowLeft className="h-4 w-4" />
              {step === 1 ? "Cancel" : "Back"}
            </button>

            <div className="flex items-center gap-3">
              {/* dots */}
              <div className="flex gap-1.5">
                {STEPS.map(s => (
                  <span key={s.id} className={cn(
                    "h-1.5 rounded-full transition-all",
                    step === s.id ? "w-4 bg-emerald-400"
                    : step > s.id ? "w-1.5 bg-emerald-500/50"
                    : "w-1.5 bg-white/15",
                  )} />
                ))}
              </div>

              {step < 4 ? (
                <button type="button" onClick={goNext}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white hover:opacity-90 shadow-lg transition-all"
                  style={{ background: "linear-gradient(135deg, hsl(145 65% 32%), hsl(145 60% 40%))", boxShadow: "0 4px 16px rgba(16,185,129,0.25)" }}>
                  Next <ChevronRight className="h-4 w-4" />
                </button>
              ) : (
                <button type="submit" disabled={submitting}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm text-white disabled:opacity-60 disabled:cursor-not-allowed hover:opacity-90 shadow-lg transition-all"
                  style={{ background: "linear-gradient(135deg, hsl(145 65% 30%), hsl(265 55% 38%))", boxShadow: "0 4px 20px rgba(16,185,129,0.3)" }}>
                  {submitting
                    ? <><span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Publishing...</>
                    : <><Check className="h-4 w-4" /> {isEdit ? "Save Changes" : "Publish Product"}</>}
                </button>
              )}
            </div>
          </div>

          {/* ── Big bottom publish button (Step 4 only) ── */}
          {step === 4 && (
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 rounded-2xl font-bold text-base text-white flex items-center justify-center gap-2.5 disabled:opacity-60 disabled:cursor-not-allowed transition-all hover:opacity-90 shadow-xl mb-4"
              style={{
                background: "linear-gradient(135deg, hsl(145 65% 28%), hsl(145 62% 38%), hsl(160 55% 42%))",
                boxShadow: "0 6px 28px rgba(16,185,129,0.35), 0 2px 8px rgba(0,0,0,0.4)",
              }}
            >
              {submitting
                ? <><span className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Publishing...</>
                : <><Zap className="h-5 w-5" /> {isEdit ? "Save Changes" : "Publish Product"}</>}
            </button>
          )}
        </form>
      </div>
    </Layout>
  );
}

import { useState, useMemo, useRef, useCallback } from "react";
import { Link, useLocation, useRoute } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft, ArrowRight, Check, ImagePlus, X, MapPin, Tag,
  Package, DollarSign, FileText, Rss, Search, ChevronDown,
  Trash2, Video, Globe, Languages, Info, Zap,
} from "lucide-react";
import { toast } from "sonner";
import { useSeller } from "@/seller/SellerContext";
import { SELLER_TYPE_LABELS, SellerType } from "@/seller/types";
import { formatBDT } from "@/lib/format";
import { cn } from "@/lib/utils";

/* ─── Constants ─────────────────────────────────────────────── */

const CATEGORIES = [
  { id: "home", name: "Home & Lifestyle", emoji: "🏡" },
  { id: "fashion", name: "Fashion & Apparel", emoji: "👗" },
  { id: "kitchen", name: "Kitchen & Dining", emoji: "🍳" },
  { id: "electronics", name: "Electronics", emoji: "📱" },
  { id: "grocery", name: "Grocery & Food", emoji: "🛒" },
  { id: "beauty", name: "Beauty & Personal Care", emoji: "💄" },
  { id: "sports", name: "Sports & Fitness", emoji: "⚽" },
  { id: "books", name: "Books & Stationery", emoji: "📚" },
  { id: "toys", name: "Toys & Kids", emoji: "🧸" },
  { id: "health", name: "Health & Wellness", emoji: "💊" },
  { id: "services", name: "Services", emoji: "🔧" },
  { id: "real_estate", name: "Real Estate", emoji: "🏢" },
  { id: "hotel", name: "Hotel & Tour", emoji: "🏨" },
  { id: "automotive", name: "Automotive", emoji: "🚗" },
];

const DISTRICTS = [
  "Dhaka", "Chittagong", "Sylhet", "Rajshahi", "Khulna",
  "Barisal", "Rangpur", "Mymensingh", "Comilla", "Gazipur",
  "Narayanganj", "Narsingdi", "Tangail", "Bogura", "Jessore",
];

const STEPS = [
  { id: 1, label: "Basic", icon: FileText },
  { id: 2, label: "Pricing", icon: DollarSign },
  { id: 3, label: "Media", icon: ImagePlus },
  { id: 4, label: "Details", icon: Tag },
];

const SAMPLE_IMAGES = [
  "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80",
  "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600&q=80",
  "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80",
  "https://images.unsplash.com/photo-1604671368394-2240d0b1bb6c?w=600&q=80",
];

/* ─── Form State ─────────────────────────────────────────────── */

interface FormState {
  title: string;
  titleBn: string;
  description: string;
  descriptionBn: string;
  categoryId: string;
  type: SellerType;
  descLang: "en" | "bn";
  retailPrice: string;
  wholesalePrice: string;
  comparePrice: string;
  moq: string;
  stock: string;
  images: string[];
  imageUrlInput: string;
  videoUrl: string;
  location: string;
  tags: string;
  tagInput: string;
  postToFeed: boolean;
}

/* ─── Sub-components ─────────────────────────────────────────── */

function Field({
  label, hint, required, children,
}: {
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

function StyledInput({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { className?: string }) {
  return (
    <Input
      {...props}
      className={cn(
        "bg-white/5 border-white/10 text-white placeholder:text-white/25 focus:border-emerald-500/50 focus:ring-0 focus:ring-offset-0 h-10 rounded-xl transition-colors",
        className,
      )}
    />
  );
}

function StyledTextarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { className?: string }) {
  return (
    <Textarea
      {...props}
      className={cn(
        "bg-white/5 border-white/10 text-white placeholder:text-white/25 focus:border-emerald-500/50 focus-visible:ring-0 rounded-xl resize-none transition-colors min-h-[100px]",
        className,
      )}
    />
  );
}

/* ─── Step 1: Basic Info ─────────────────────────────────────── */

function StepBasic({ form, update }: { form: FormState; update: <K extends keyof FormState>(k: K, v: FormState[K]) => void }) {
  const [catSearch, setCatSearch] = useState("");
  const [showCatDropdown, setShowCatDropdown] = useState(false);
  const catRef = useRef<HTMLDivElement>(null);

  const filteredCats = useMemo(
    () => CATEGORIES.filter(c => c.name.toLowerCase().includes(catSearch.toLowerCase())),
    [catSearch],
  );

  const selectedCat = CATEGORIES.find(c => c.id === form.categoryId);

  return (
    <div className="flex flex-col gap-5">
      {/* Title */}
      <Field label="Product Title" required hint="Keep it clear and descriptive. Appears in search results.">
        <StyledInput
          value={form.title}
          onChange={e => update("title", e.target.value)}
          placeholder="e.g. Samsung 65W USB-C Charger"
          maxLength={120}
        />
        <span className="text-[10px] text-white/25 text-right">{form.title.length}/120</span>
      </Field>

      {/* Title Bangla */}
      <Field label="পণ্যের নাম (বাংলা)" hint="Optional Bangla title for local buyers">
        <StyledInput
          value={form.titleBn}
          onChange={e => update("titleBn", e.target.value)}
          placeholder="যেমন: স্যামসাং ৬৫ওয়াট চার্জার"
        />
      </Field>

      {/* Description with lang toggle */}
      <Field label="Description" required hint="Describe your product in detail. Both English and Bangla supported.">
        <div className="flex gap-1.5 mb-2">
          <button
            type="button"
            onClick={() => update("descLang", "en")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border transition-all",
              form.descLang === "en"
                ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                : "bg-white/5 border-white/10 text-white/40 hover:text-white/70",
            )}
          >
            <Globe className="h-3 w-3" /> English
          </button>
          <button
            type="button"
            onClick={() => update("descLang", "bn")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border transition-all",
              form.descLang === "bn"
                ? "bg-purple-500/20 border-purple-500/40 text-purple-400"
                : "bg-white/5 border-white/10 text-white/40 hover:text-white/70",
            )}
          >
            <Languages className="h-3 w-3" /> বাংলা
          </button>
        </div>
        {form.descLang === "en" ? (
          <StyledTextarea
            value={form.description}
            onChange={e => update("description", e.target.value)}
            placeholder="Write a detailed description of your product..."
            className="min-h-[120px]"
          />
        ) : (
          <StyledTextarea
            value={form.descriptionBn}
            onChange={e => update("descriptionBn", e.target.value)}
            placeholder="আপনার পণ্যের বিস্তারিত বিবরণ লিখুন..."
            className="min-h-[120px]"
          />
        )}
      </Field>

      {/* Category with search */}
      <Field label="Category" required>
        <div className="relative" ref={catRef}>
          <button
            type="button"
            onClick={() => setShowCatDropdown(v => !v)}
            className="w-full flex items-center justify-between px-3 h-10 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 text-sm text-left transition-colors"
          >
            {selectedCat ? (
              <span className="flex items-center gap-2 text-white">
                <span>{selectedCat.emoji}</span> {selectedCat.name}
              </span>
            ) : (
              <span className="text-white/30">Select a category</span>
            )}
            <ChevronDown className={`h-4 w-4 text-white/30 transition-transform ${showCatDropdown ? "rotate-180" : ""}`} />
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
              <div className="max-h-48 overflow-y-auto p-1.5 grid grid-cols-2 gap-1">
                {filteredCats.map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => { update("categoryId", cat.id); setShowCatDropdown(false); setCatSearch(""); }}
                    className={cn(
                      "flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-left transition-all",
                      form.categoryId === cat.id
                        ? "bg-emerald-500/20 text-emerald-400 font-semibold"
                        : "text-white/60 hover:bg-white/5 hover:text-white",
                    )}
                  >
                    <span>{cat.emoji}</span> {cat.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </Field>

      {/* Listing type */}
      <Field label="Listing Type" required hint="How you sell this product.">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {(Object.keys(SELLER_TYPE_LABELS) as SellerType[]).map(t => (
            <button
              key={t}
              type="button"
              onClick={() => update("type", t)}
              className={cn(
                "px-3 py-2.5 rounded-xl text-xs font-medium border transition-all text-left",
                form.type === t
                  ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                  : "bg-white/5 border-white/10 text-white/50 hover:border-white/20 hover:text-white/80",
              )}
            >
              {SELLER_TYPE_LABELS[t]}
            </button>
          ))}
        </div>
      </Field>
    </div>
  );
}

/* ─── Step 2: Pricing ────────────────────────────────────────── */

function StepPricing({ form, update }: { form: FormState; update: <K extends keyof FormState>(k: K, v: FormState[K]) => void }) {
  const retail = parseFloat(form.retailPrice) || 0;
  const wholesale = parseFloat(form.wholesalePrice) || 0;
  const compare = parseFloat(form.comparePrice) || 0;
  const discount = compare > retail ? Math.round(((compare - retail) / compare) * 100) : null;

  return (
    <div className="flex flex-col gap-5">
      {/* Price preview card */}
      {retail > 0 && (
        <div className="rounded-xl p-3.5 flex items-center justify-between gap-4"
          style={{ background: "rgba(16,185,129,0.07)", border: "1px solid rgba(16,185,129,0.15)" }}>
          <div>
            <p className="text-[10px] text-white/40 mb-0.5">Price Preview</p>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-emerald-400">{formatBDT(retail)}</span>
              {compare > retail && <span className="text-sm text-white/30 line-through">{formatBDT(compare)}</span>}
              {discount && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-red-500/80 text-white">-{discount}%</span>}
            </div>
            {wholesale > 0 && (
              <p className="text-[10px] text-orange-400 mt-0.5">Wholesale: {formatBDT(wholesale)} {form.moq ? `(MOQ: ${form.moq})` : ""}</p>
            )}
          </div>
          <div className="text-right">
            <p className="text-[10px] text-white/40">Stock</p>
            <p className="text-base font-bold text-white">{form.stock || "—"}</p>
          </div>
        </div>
      )}

      {/* Retail price */}
      <Field label="Retail Price (৳)" required hint="The regular selling price shown to buyers.">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-emerald-400 font-bold">৳</span>
          <StyledInput
            type="number"
            min="0"
            step="1"
            value={form.retailPrice}
            onChange={e => update("retailPrice", e.target.value)}
            placeholder="0"
            className="pl-8"
          />
        </div>
      </Field>

      {/* Compare price */}
      <Field label="Compare-at Price (৳)" hint="Original / crossed-out price. Leave blank if no discount.">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-white/30 font-bold">৳</span>
          <StyledInput
            type="number"
            min="0"
            step="1"
            value={form.comparePrice}
            onChange={e => update("comparePrice", e.target.value)}
            placeholder="0  (optional)"
            className="pl-8"
          />
        </div>
      </Field>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-white/8" />
        <span className="text-[10px] text-white/30 font-medium uppercase tracking-wider">Wholesale (optional)</span>
        <div className="flex-1 h-px bg-white/8" />
      </div>

      {/* Wholesale price + MOQ */}
      <div className="grid grid-cols-2 gap-3">
        <Field label="Wholesale Price (৳)" hint="B2B bulk price for resellers.">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-orange-400 font-bold">৳</span>
            <StyledInput
              type="number"
              min="0"
              step="1"
              value={form.wholesalePrice}
              onChange={e => update("wholesalePrice", e.target.value)}
              placeholder="0"
              className="pl-8"
            />
          </div>
        </Field>
        <Field label="Min. Order Qty" hint="Minimum quantity for wholesale price.">
          <StyledInput
            type="number"
            min="1"
            value={form.moq}
            onChange={e => update("moq", e.target.value)}
            placeholder="e.g. 10"
          />
        </Field>
      </div>

      {/* Stock */}
      <Field label="Stock Quantity" required hint="Total units available.">
        <StyledInput
          type="number"
          min="0"
          value={form.stock}
          onChange={e => update("stock", e.target.value)}
          placeholder="e.g. 50"
        />
      </Field>
    </div>
  );
}

/* ─── Step 3: Media ──────────────────────────────────────────── */

function StepMedia({ form, update }: { form: FormState; update: <K extends keyof FormState>(k: K, v: FormState[K]) => void }) {
  const [dragOver, setDragOver] = useState(false);

  const addImageUrl = useCallback((url: string) => {
    const trimmed = url.trim();
    if (!trimmed) return;
    if (form.images.includes(trimmed)) { toast.error("Image already added"); return; }
    if (form.images.length >= 8) { toast.error("Max 8 images"); return; }
    update("images", [...form.images, trimmed]);
    update("imageUrlInput", "");
  }, [form.images, update]);

  const removeImage = useCallback((url: string) => {
    update("images", form.images.filter(i => i !== url));
  }, [form.images, update]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const text = e.dataTransfer.getData("text/plain");
    if (text) addImageUrl(text);
  }, [addImageUrl]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addImageUrl(form.imageUrlInput);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Drop zone / image grid */}
      <Field label="Product Images" required hint="Square (1:1) images look best. Max 8 images.">
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={cn(
            "rounded-xl p-3 transition-all min-h-[140px] flex flex-col gap-3",
            dragOver
              ? "border-2 border-emerald-400/60 bg-emerald-500/8"
              : "border border-dashed border-white/15 bg-white/3",
          )}
        >
          {form.images.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {form.images.map((url, i) => (
                <div key={url} className="relative group" style={{ aspectRatio: "1/1" }}>
                  <img
                    src={url}
                    alt={`img-${i}`}
                    className="w-full h-full object-cover rounded-xl border border-white/10"
                    onError={e => { (e.target as HTMLImageElement).src = "https://placehold.co/200x200/0d1f1a/555?text=Error"; }}
                  />
                  {i === 0 && (
                    <span className="absolute top-1 left-1 text-[8px] font-bold bg-emerald-500 text-white px-1.5 py-0.5 rounded-md">Cover</span>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(url)}
                    className="absolute top-1 right-1 h-5 w-5 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white/70 hover:text-white opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                </div>
              ))}
              {form.images.length < 8 && (
                <div className="flex items-center justify-center rounded-xl border-2 border-dashed border-white/10 text-white/20 hover:border-emerald-500/30 hover:text-emerald-400/50 transition-all cursor-pointer"
                  style={{ aspectRatio: "1/1" }}>
                  <ImagePlus className="h-6 w-6" />
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center gap-2 text-center py-4">
              <ImagePlus className="h-8 w-8 text-white/20" />
              <p className="text-sm text-white/30 font-medium">Drop image URL here or paste below</p>
              <p className="text-[10px] text-white/20">1:1 square images recommended · Max 8</p>
            </div>
          )}
        </div>
      </Field>

      {/* URL input */}
      <div className="flex gap-2">
        <StyledInput
          value={form.imageUrlInput}
          onChange={e => update("imageUrlInput", e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Paste image URL and press Enter or Add"
          className="flex-1"
        />
        <button
          type="button"
          onClick={() => addImageUrl(form.imageUrlInput)}
          className="px-4 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-sm font-semibold hover:bg-emerald-500/30 transition-all shrink-0"
        >
          Add
        </button>
      </div>

      {/* Quick sample images */}
      <div>
        <p className="text-[10px] text-white/30 mb-2 font-medium uppercase tracking-wider">Quick Sample Images</p>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {SAMPLE_IMAGES.map((url, i) => (
            <button
              key={i}
              type="button"
              onClick={() => addImageUrl(url)}
              className="shrink-0 h-12 w-12 rounded-lg overflow-hidden border-2 border-white/10 hover:border-emerald-500/40 transition-all"
            >
              <img src={url} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      {/* Video */}
      <Field label="Product Video URL" hint="YouTube, Vimeo, or direct .mp4 link. Optional.">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/30 shrink-0">
            <Video className="h-4 w-4" />
          </div>
          <StyledInput
            value={form.videoUrl}
            onChange={e => update("videoUrl", e.target.value)}
            placeholder="https://youtube.com/... or video.mp4"
            className="flex-1"
          />
        </div>
      </Field>
    </div>
  );
}

/* ─── Step 4: Details ────────────────────────────────────────── */

function StepDetails({ form, update }: { form: FormState; update: <K extends keyof FormState>(k: K, v: FormState[K]) => void }) {
  const tags = useMemo(
    () => form.tags.split(",").map(t => t.trim()).filter(Boolean),
    [form.tags],
  );

  const addTag = () => {
    const t = form.tagInput.trim().toLowerCase();
    if (!t) return;
    if (tags.includes(t)) { toast.error("Tag already added"); return; }
    if (tags.length >= 10) { toast.error("Max 10 tags"); return; }
    update("tags", [...tags, t].join(", "));
    update("tagInput", "");
  };

  const removeTag = (tag: string) => {
    update("tags", tags.filter(t => t !== tag).join(", "));
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Location */}
      <Field label="Product Location" required hint="Where is this product shipped from?">
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
          <Select value={form.location} onValueChange={v => update("location", v)}>
            <SelectTrigger className="pl-9 bg-white/5 border-white/10 text-white rounded-xl h-10 focus:ring-0 focus:ring-offset-0 focus:border-emerald-500/50">
              <SelectValue placeholder="Select district" />
            </SelectTrigger>
            <SelectContent className="bg-[#071410] border-white/10">
              {DISTRICTS.map(d => (
                <SelectItem key={d} value={d} className="text-white/80 focus:bg-white/10 focus:text-white">{d}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <StyledInput
          value={form.location}
          onChange={e => update("location", e.target.value)}
          placeholder="Or type exact location (e.g. Mirpur, Dhaka)"
          className="mt-1.5"
        />
      </Field>

      {/* Tags */}
      <Field label="Tags" hint="Add relevant tags to help buyers find your product. Max 10.">
        <div className="flex gap-2">
          <StyledInput
            value={form.tagInput}
            onChange={e => update("tagInput", e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
            placeholder='e.g. "electronics" then press Enter'
            className="flex-1"
          />
          <button
            type="button"
            onClick={addTag}
            className="px-4 rounded-xl bg-white/8 border border-white/10 text-white/60 text-sm font-medium hover:text-white hover:bg-white/12 transition-all shrink-0"
          >
            Add
          </button>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1">
            {tags.map(tag => (
              <span key={tag}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium text-emerald-400 bg-emerald-500/15 border border-emerald-500/25">
                # {tag}
                <button type="button" onClick={() => removeTag(tag)} className="text-emerald-400/50 hover:text-rose-400 transition-colors ml-0.5">
                  <X className="h-2.5 w-2.5" />
                </button>
              </span>
            ))}
          </div>
        )}
      </Field>

      {/* Post to Social Feed toggle */}
      <div className="rounded-xl p-4 flex items-start gap-4"
        style={{
          background: form.postToFeed ? "rgba(16,185,129,0.08)" : "rgba(255,255,255,0.03)",
          border: `1px solid ${form.postToFeed ? "rgba(16,185,129,0.2)" : "rgba(255,255,255,0.08)"}`,
        }}>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-0.5">
            <Rss className="h-4 w-4 text-emerald-400" />
            <span className="text-sm font-semibold text-white">Post to Social Feed</span>
          </div>
          <p className="text-[11px] text-white/45 leading-relaxed">
            Your product will appear in the Live Feed on the homepage, increasing visibility to potential buyers.
          </p>
        </div>
        <button
          type="button"
          onClick={() => update("postToFeed", !form.postToFeed)}
          className={cn(
            "relative h-6 w-11 rounded-full border shrink-0 transition-all duration-300 mt-0.5",
            form.postToFeed
              ? "bg-emerald-500/40 border-emerald-500/60"
              : "bg-white/10 border-white/20",
          )}
        >
          <span className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full transition-all duration-300 shadow-sm",
            form.postToFeed
              ? "left-5 bg-emerald-400"
              : "left-0.5 bg-white/40",
          )} />
        </button>
      </div>

      {/* Summary preview */}
      <div className="rounded-xl p-4 space-y-2" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <p className="text-[11px] text-white/40 font-semibold uppercase tracking-wider mb-3">Summary</p>
        <SummaryRow label="Feed" value={form.postToFeed ? "✅ Will appear in Social Feed" : "❌ Marketplace only"} />
        <SummaryRow label="Location" value={form.location || "—"} />
        <SummaryRow label="Tags" value={tags.length > 0 ? tags.map(t => `#${t}`).join(" ") : "—"} />
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 text-sm">
      <span className="text-white/35 w-20 shrink-0 text-[11px] mt-0.5">{label}</span>
      <span className="text-white/70 text-[11px] flex-1">{value}</span>
    </div>
  );
}

/* ─── Step Progress Bar ──────────────────────────────────────── */

function StepBar({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-0 mb-6">
      {STEPS.map((step, i) => {
        const done = current > step.id;
        const active = current === step.id;
        return (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center gap-1.5">
              <div className={cn(
                "h-8 w-8 rounded-xl flex items-center justify-center text-xs font-bold transition-all duration-200",
                done
                  ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                  : active
                    ? "bg-emerald-500/20 border-2 border-emerald-500/60 text-emerald-400"
                    : "bg-white/5 border border-white/10 text-white/30",
              )}>
                {done ? <Check className="h-4 w-4" /> : <step.icon className="h-3.5 w-3.5" />}
              </div>
              <span className={cn(
                "text-[10px] font-medium transition-colors",
                active ? "text-emerald-400" : done ? "text-white/60" : "text-white/25",
              )}>
                {step.label}
              </span>
            </div>
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
    if (!form.title.trim()) return "Product title is required";
    if (!form.description.trim()) return "Description is required";
    if (!form.categoryId) return "Please select a category";
  }
  if (step === 2) {
    if (!form.retailPrice || parseFloat(form.retailPrice) <= 0) return "Retail price must be greater than 0";
    if (!form.stock || parseInt(form.stock) < 0) return "Stock quantity is required";
  }
  if (step === 3) {
    if (form.images.length === 0) return "Add at least one product image";
  }
  if (step === 4) {
    if (!form.location.trim()) return "Location is required";
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

  const [form, setForm] = useState<FormState>(() => editing ? {
    title: editing.title,
    titleBn: editing.titleBn ?? "",
    description: editing.description,
    descriptionBn: editing.descriptionBn ?? "",
    categoryId: editing.categoryId,
    type: editing.type,
    descLang: "en",
    retailPrice: String(editing.price),
    wholesalePrice: editing.wholesalePrice ? String(editing.wholesalePrice) : "",
    comparePrice: editing.comparePrice ? String(editing.comparePrice) : "",
    moq: editing.moq ? String(editing.moq) : "",
    stock: String(editing.stock),
    images: [...editing.images],
    imageUrlInput: "",
    videoUrl: editing.videoUrl ?? "",
    location: editing.location,
    tags: editing.tags.join(", "),
    tagInput: "",
    postToFeed: editing.postToFeed ?? false,
  } : {
    title: "",
    titleBn: "",
    description: "",
    descriptionBn: "",
    categoryId: "",
    type: profile.type,
    descLang: "en",
    retailPrice: "",
    wholesalePrice: "",
    comparePrice: "",
    moq: "",
    stock: "",
    images: [],
    imageUrlInput: "",
    videoUrl: "",
    location: profile.location,
    tags: "",
    tagInput: "",
    postToFeed: true,
  });

  const update = useCallback(<K extends keyof FormState>(k: K, v: FormState[K]) => {
    setForm(f => ({ ...f, [k]: v }));
  }, []);

  const goNext = () => {
    const err = validateStep(step, form);
    if (err) { toast.error(err); return; }
    setStep(s => Math.min(s + 1, 4));
  };

  const goBack = () => setStep(s => Math.max(s - 1, 1));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validateStep(4, form);
    if (err) { toast.error(err); return; }

    setSubmitting(true);
    await new Promise(r => setTimeout(r, 600));

    const cat = CATEGORIES.find(c => c.id === form.categoryId)!;
    const payload = {
      title: form.title.trim(),
      titleBn: form.titleBn.trim() || undefined,
      description: form.description.trim(),
      descriptionBn: form.descriptionBn.trim() || undefined,
      categoryId: cat.id,
      categoryName: cat.name,
      type: form.type,
      price: parseFloat(form.retailPrice),
      wholesalePrice: form.wholesalePrice ? parseFloat(form.wholesalePrice) : undefined,
      comparePrice: form.comparePrice ? parseFloat(form.comparePrice) : undefined,
      moq: form.moq ? parseInt(form.moq) : undefined,
      stock: parseInt(form.stock),
      images: form.images,
      videoUrl: form.videoUrl.trim() || undefined,
      location: form.location.trim(),
      tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
      postToFeed: form.postToFeed,
    };

    if (isEdit && editing) {
      updateProduct(editing.id, payload);
      toast.success("Product updated successfully!");
    } else {
      createProduct(payload);
      toast.success(form.postToFeed ? "Product listed & posted to feed! 🎉" : "Product listed successfully! 🎉");
    }

    setSubmitting(false);
    setLocation("/seller/products");
  };

  const stepContent: Record<number, React.ReactNode> = {
    1: <StepBasic form={form} update={update} />,
    2: <StepPricing form={form} update={update} />,
    3: <StepMedia form={form} update={update} />,
    4: <StepDetails form={form} update={update} />,
  };

  const stepTitles: Record<number, string> = {
    1: "Basic Information",
    2: "Pricing & Stock",
    3: "Images & Media",
    4: "Location & Details",
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Back */}
        <Link href="/seller/products">
          <button className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors mb-5">
            <ArrowLeft className="h-4 w-4" />
            Back to Products
          </button>
        </Link>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-white">
              {isEdit ? "Edit Product" : "List a Product"}
            </h1>
            {form.postToFeed && !isEdit && (
              <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/25 text-emerald-400">
                <Zap className="h-2.5 w-2.5" /> Feed
              </span>
            )}
          </div>
          <p className="text-sm text-white/45">
            {stepTitles[step]} — Step {step} of {STEPS.length}
          </p>
        </div>

        {/* Step progress */}
        <StepBar current={step} />

        {/* Form */}
        <form onSubmit={onSubmit}>
          <GlassCard className="p-5 sm:p-6 mb-5">
            {stepContent[step]}
          </GlassCard>

          {/* Navigation buttons */}
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={step === 1 ? () => setLocation("/seller/products") : goBack}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all"
            >
              <ArrowLeft className="h-4 w-4" />
              {step === 1 ? "Cancel" : "Back"}
            </button>

            <div className="flex items-center gap-2">
              {/* Step dots */}
              <div className="flex gap-1.5 mr-2">
                {STEPS.map(s => (
                  <span key={s.id} className={cn(
                    "h-1.5 w-1.5 rounded-full transition-all",
                    step === s.id ? "w-4 bg-emerald-400" : step > s.id ? "bg-emerald-500/50" : "bg-white/15",
                  )} />
                ))}
              </div>

              {step < 4 ? (
                <button
                  type="button"
                  onClick={goNext}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90 shadow-lg"
                  style={{ background: "linear-gradient(135deg, hsl(145 65% 32%), hsl(145 60% 40%))", boxShadow: "0 4px 16px rgba(16,185,129,0.25)" }}
                >
                  Next <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed hover:opacity-90 shadow-lg"
                  style={{ background: "linear-gradient(135deg, hsl(145 65% 32%), hsl(265 55% 38%))", boxShadow: "0 4px 20px rgba(16,185,129,0.3)" }}
                >
                  {submitting ? (
                    <><span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Publishing...</>
                  ) : (
                    <><Check className="h-4 w-4" /> {isEdit ? "Save Changes" : "Publish Product"}</>
                  )}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
}

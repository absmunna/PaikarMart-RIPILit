import { useState, useMemo } from "react";
import { Link, useLocation, useRoute } from "wouter";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, ImagePlus, Video } from "lucide-react";
import { toast } from "sonner";
import { useSeller } from "@/seller/SellerContext";
import { SELLER_TYPE_LABELS, SellerType } from "@/seller/types";

const CATEGORIES = [
  { id: "home", name: "Home & Lifestyle" },
  { id: "fashion", name: "Fashion" },
  { id: "kitchen", name: "Kitchen" },
  { id: "electronics", name: "Electronics" },
  { id: "grocery", name: "Grocery" },
  { id: "services", name: "Services" },
  { id: "real_estate", name: "Real Estate" },
  { id: "hotel", name: "Hotel & Tour" },
];

interface FormState {
  title: string;
  description: string;
  price: string;
  stock: string;
  categoryId: string;
  type: SellerType;
  location: string;
  images: string;
  videoUrl: string;
  tags: string;
}

export default function SellerProductForm() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute<{ id: string }>("/seller/products/:id/edit");
  const { products, profile, createProduct, updateProduct } = useSeller();

  const editing = params?.id ? products.find((p) => p.id === params.id) : null;
  const isEdit = !!editing;

  const [form, setForm] = useState<FormState>(() =>
    editing
      ? {
          title: editing.title,
          description: editing.description,
          price: String(editing.price),
          stock: String(editing.stock),
          categoryId: editing.categoryId,
          type: editing.type,
          location: editing.location,
          images: editing.images.join(", "),
          videoUrl: editing.videoUrl ?? "",
          tags: editing.tags.join(", "),
        }
      : {
          title: "",
          description: "",
          price: "",
          stock: "",
          categoryId: "",
          type: profile.type,
          location: profile.location,
          images: "",
          videoUrl: "",
          tags: "",
        },
  );

  const previewImages = useMemo(
    () =>
      form.images
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    [form.images],
  );

  const update = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const imageUrls = previewImages;
    if (imageUrls.length === 0) {
      toast.error("Add at least one image URL");
      return;
    }
    const category = CATEGORIES.find((c) => c.id === form.categoryId);
    if (!category) {
      toast.error("Pick a category");
      return;
    }

    const payload = {
      title: form.title,
      description: form.description,
      price: Number(form.price),
      stock: Number(form.stock),
      categoryId: category.id,
      categoryName: category.name,
      type: form.type,
      location: form.location,
      images: imageUrls,
      videoUrl: form.videoUrl || undefined,
      tags: form.tags
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    if (isEdit && editing) {
      updateProduct(editing.id, payload);
      toast.success("Product updated");
    } else {
      createProduct(payload);
      toast.success("Product created");
    }
    setLocation("/seller/products");
  };

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <Link
        href="/seller/products"
        className="inline-flex items-center gap-2 text-white/70 hover:text-white w-fit"
      >
        <ArrowLeft className="w-4 h-4" /> Back to products
      </Link>

      <div>
        <h1 className="text-3xl font-bold text-white">
          {isEdit ? "Edit Product" : "Add New Product"}
        </h1>
        <p className="text-white/60 mt-1">
          {isEdit ? "Update the details of your listing." : "List a new item or service."}
        </p>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-6">
        <GlassCard className="p-6 flex flex-col gap-5">
          <Field label="Title">
            <Input
              required
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              placeholder="Product or service name"
              className="bg-white/5 border-white/10 text-white"
            />
          </Field>

          <Field label="Description">
            <Textarea
              required
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="Detailed description..."
              className="bg-white/5 border-white/10 text-white min-h-[140px]"
            />
          </Field>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Price (USD)">
              <Input
                type="number"
                required
                min="0.01"
                step="0.01"
                value={form.price}
                onChange={(e) => update("price", e.target.value)}
                className="bg-white/5 border-white/10 text-white"
              />
            </Field>
            <Field label="Stock">
              <Input
                type="number"
                required
                min="0"
                value={form.stock}
                onChange={(e) => update("stock", e.target.value)}
                className="bg-white/5 border-white/10 text-white"
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Category">
              <Select
                value={form.categoryId}
                onValueChange={(v) => update("categoryId", v)}
                required
              >
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Listing Type">
              <Select
                value={form.type}
                onValueChange={(v: SellerType) => update("type", v)}
                required
              >
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(SELLER_TYPE_LABELS) as SellerType[]).map((t) => (
                    <SelectItem key={t} value={t}>
                      {SELLER_TYPE_LABELS[t]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>

          <Field label="Location">
            <Input
              required
              value={form.location}
              onChange={(e) => update("location", e.target.value)}
              placeholder="City, country"
              className="bg-white/5 border-white/10 text-white"
            />
          </Field>
        </GlassCard>

        <GlassCard className="p-6 flex flex-col gap-5">
          <div>
            <div className="text-sm font-medium text-white mb-2">Photos</div>
            <p className="text-xs text-white/50 mb-3">
              Upload UI is for preview only — paste image URLs separated by commas.
            </p>
            <div className="flex flex-wrap gap-3 mb-3">
              {previewImages.length === 0 ? (
                <div className="h-24 w-24 rounded-lg bg-white/5 border border-white/10 border-dashed flex flex-col items-center justify-center text-white/50">
                  <ImagePlus className="w-6 h-6 mb-1" />
                  <span className="text-[10px]">Preview</span>
                </div>
              ) : (
                previewImages.map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt=""
                    className="h-24 w-24 rounded-lg object-cover border border-white/10"
                  />
                ))
              )}
            </div>
            <Textarea
              value={form.images}
              onChange={(e) => update("images", e.target.value)}
              placeholder="https://image1.jpg, https://image2.jpg"
              className="bg-white/5 border-white/10 text-white"
            />
          </div>

          <Field label="Video URL (optional)">
            <div className="flex gap-3">
              <div className="h-12 w-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/50 shrink-0">
                <Video className="w-5 h-5" />
              </div>
              <Input
                value={form.videoUrl}
                onChange={(e) => update("videoUrl", e.target.value)}
                placeholder="https://video.mp4"
                className="bg-white/5 border-white/10 text-white flex-1"
              />
            </div>
          </Field>

          <Field label="Tags (comma separated)">
            <Input
              value={form.tags}
              onChange={(e) => update("tags", e.target.value)}
              placeholder="electronics, gadget, new"
              className="bg-white/5 border-white/10 text-white"
            />
          </Field>
        </GlassCard>

        <div className="flex justify-end gap-3">
          <Link href="/seller/products">
            <Button type="button" variant="ghost" className="text-white hover:bg-white/10">
              Cancel
            </Button>
          </Link>
          <Button type="submit" className="bg-primary hover:bg-primary/90 px-8">
            {isEdit ? "Save Changes" : "Create Product"}
          </Button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-white">{label}</label>
      {children}
    </div>
  );
}

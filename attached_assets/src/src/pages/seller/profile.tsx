import { useState } from "react";
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
import { useSeller } from "@/seller/SellerContext";
import { SELLER_TYPE_LABELS, SellerType } from "@/seller/types";
import { ShieldCheck, MapPin, Mail, Phone, Pencil, Save, X } from "lucide-react";
import { toast } from "sonner";

export default function SellerProfilePage() {
  const { profile, updateProfile } = useSeller();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(profile);

  const onSave = () => {
    updateProfile(form);
    toast.success("Shop profile updated");
    setEditing(false);
  };

  const onCancel = () => {
    setForm(profile);
    setEditing(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Shop Profile</h1>
          <p className="text-white/60 mt-1">
            How customers see your storefront on PaikarMart.
          </p>
        </div>
        {!editing ? (
          <Button
            variant="outline"
            onClick={() => setEditing(true)}
            className="bg-white/5 border-white/10 text-white hover:bg-white/10"
          >
            <Pencil className="w-4 h-4 mr-2" /> Edit
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={onCancel}
              className="text-white hover:bg-white/10"
            >
              <X className="w-4 h-4 mr-2" /> Cancel
            </Button>
            <Button onClick={onSave} className="bg-primary hover:bg-primary/90">
              <Save className="w-4 h-4 mr-2" /> Save
            </Button>
          </div>
        )}
      </div>

      <GlassCard className="overflow-hidden">
        <div
          className="h-40 bg-gradient-to-r from-blue-900 via-[#0f172a] to-purple-900 bg-cover bg-center"
          style={{ backgroundImage: `url(${profile.coverUrl})` }}
        />
        <div className="p-6 flex flex-col md:flex-row gap-6 -mt-12">
          <img
            src={profile.avatarUrl}
            alt={profile.shopName}
            className="w-24 h-24 rounded-full border-4 border-[#0f172a] object-cover"
          />
          <div className="flex-1 flex flex-col gap-3 pt-2">
            {editing ? (
              <>
                <Input
                  value={form.shopName}
                  onChange={(e) => setForm({ ...form, shopName: e.target.value })}
                  className="bg-white/5 border-white/10 text-white text-xl font-bold"
                />
                <Textarea
                  value={form.tagline}
                  onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                  className="bg-white/5 border-white/10 text-white"
                  rows={2}
                />
              </>
            ) : (
              <>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-2xl font-bold text-white">{profile.shopName}</h2>
                  {profile.verified ? (
                    <span className="inline-flex items-center gap-1 text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                      <ShieldCheck className="w-3 h-3" /> Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs bg-white/10 text-white/60 px-2 py-1 rounded">
                      Unverified
                    </span>
                  )}
                  <span className="text-xs uppercase tracking-wider px-2 py-1 rounded bg-primary/20 text-primary">
                    {SELLER_TYPE_LABELS[profile.type]}
                  </span>
                </div>
                <p className="text-white/70">{profile.tagline}</p>
              </>
            )}
          </div>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard className="p-6 flex flex-col gap-4">
          <h3 className="text-lg font-semibold text-white">Shop Details</h3>
          <Row label="Seller Type" icon={<ShieldCheck className="w-4 h-4" />}>
            {editing ? (
              <Select
                value={form.type}
                onValueChange={(v: SellerType) => setForm({ ...form, type: v })}
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
            ) : (
              <span className="text-white">{SELLER_TYPE_LABELS[profile.type]}</span>
            )}
          </Row>
          <Row label="Category">
            {editing ? (
              <Input
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="bg-white/5 border-white/10 text-white"
              />
            ) : (
              <span className="text-white">{profile.category}</span>
            )}
          </Row>
          <Row label="Location" icon={<MapPin className="w-4 h-4" />}>
            {editing ? (
              <Input
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="bg-white/5 border-white/10 text-white"
              />
            ) : (
              <span className="text-white">{profile.location}</span>
            )}
          </Row>
        </GlassCard>

        <GlassCard className="p-6 flex flex-col gap-4">
          <h3 className="text-lg font-semibold text-white">Internal Contact</h3>
          <p className="text-xs text-white/50 -mt-2">
            Used by PaikarMart support — not shown publicly.
          </p>
          <Row label="Email" icon={<Mail className="w-4 h-4" />}>
            {editing ? (
              <Input
                value={form.contactEmail}
                onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                className="bg-white/5 border-white/10 text-white"
              />
            ) : (
              <span className="text-white">{profile.contactEmail}</span>
            )}
          </Row>
          <Row label="Phone" icon={<Phone className="w-4 h-4" />}>
            {editing ? (
              <Input
                value={form.contactPhone}
                onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
                className="bg-white/5 border-white/10 text-white"
              />
            ) : (
              <span className="text-white">{profile.contactPhone}</span>
            )}
          </Row>
        </GlassCard>
      </div>
    </div>
  );
}

function Row({
  label,
  icon,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-white/50">
        {icon}
        {label}
      </div>
      {children}
    </div>
  );
}

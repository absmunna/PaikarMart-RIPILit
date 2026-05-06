import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSeller } from "@/seller/SellerContext";
import { SELLER_TYPE_LABELS, SellerType, VerificationStatus } from "@/seller/types";
import {
  ShieldCheck,
  Upload,
  FileText,
  CheckCircle2,
  Clock,
  XCircle,
  X,
} from "lucide-react";
import { toast } from "sonner";

const STATUS_CONFIG: Record<
  VerificationStatus,
  { label: string; icon: React.ReactNode; className: string; description: string }
> = {
  unsubmitted: {
    label: "Not submitted",
    icon: <ShieldCheck className="w-5 h-5" />,
    className: "bg-white/10 text-white/70",
    description: "Submit your documents to get the verified badge on your shop.",
  },
  pending: {
    label: "Pending review",
    icon: <Clock className="w-5 h-5" />,
    className: "bg-yellow-500/20 text-yellow-400",
    description: "We've received your documents. Admins typically review within 1–3 days.",
  },
  approved: {
    label: "Approved",
    icon: <CheckCircle2 className="w-5 h-5" />,
    className: "bg-green-500/20 text-green-400",
    description: "Your shop is verified. The badge is now visible to customers.",
  },
  rejected: {
    label: "Rejected",
    icon: <XCircle className="w-5 h-5" />,
    className: "bg-red-500/20 text-red-400",
    description: "Your submission was rejected. Update your documents and try again.",
  },
};

const DOC_KINDS = [
  { id: "nid", label: "National ID" },
  { id: "passport", label: "Passport" },
  { id: "business", label: "Business Registration" },
] as const;

export default function SellerVerification() {
  const { profile, submitVerification } = useSeller();
  const [type, setType] = useState<SellerType>(profile.type);
  const [category, setCategory] = useState(profile.category);
  const [docs, setDocs] = useState(profile.documents);

  const status = profile.verificationStatus;
  const cfg = STATUS_CONFIG[status];

  const addMockDoc = (kind: "nid" | "passport" | "business") => {
    const label = DOC_KINDS.find((d) => d.id === kind)?.label ?? kind;
    setDocs((prev) => [
      ...prev,
      {
        id: `doc_${Math.random().toString(36).slice(2, 8)}`,
        name: `${label}_${prev.length + 1}.pdf`,
        kind,
      },
    ]);
  };

  const removeDoc = (id: string) => setDocs((prev) => prev.filter((d) => d.id !== id));

  const onSubmit = () => {
    if (docs.length === 0) {
      toast.error("Upload at least one document");
      return;
    }
    if (!category.trim()) {
      toast.error("Pick a category");
      return;
    }
    submitVerification(docs, type, category);
    toast.success("Submitted for admin approval");
  };

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold text-white">Seller Verification</h1>
        <p className="text-white/60 mt-1">
          Get the verified badge by submitting your seller information and documents.
        </p>
      </div>

      <GlassCard className="p-5 flex items-start gap-4">
        <div className={`p-3 rounded-xl ${cfg.className}`}>{cfg.icon}</div>
        <div className="flex-1">
          <div className="text-white font-semibold">{cfg.label}</div>
          <p className="text-sm text-white/60 mt-1">{cfg.description}</p>
        </div>
      </GlassCard>

      <GlassCard className="p-6 flex flex-col gap-5">
        <h2 className="text-lg font-semibold text-white">Seller Type</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {(Object.keys(SELLER_TYPE_LABELS) as SellerType[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={`p-3 rounded-lg border text-sm transition-colors ${
                type === t
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
              }`}
            >
              {SELLER_TYPE_LABELS[t]}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-white">Primary Category</label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {[
                "Home & Lifestyle",
                "Fashion",
                "Electronics",
                "Kitchen",
                "Grocery",
                "Services",
                "Real Estate",
                "Hotel & Tour",
              ].map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </GlassCard>

      <GlassCard className="p-6 flex flex-col gap-5">
        <div>
          <h2 className="text-lg font-semibold text-white">Documents</h2>
          <p className="text-sm text-white/50 mt-1">
            Upload UI is for preview — file picking is mocked.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {DOC_KINDS.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => addMockDoc(d.id)}
              className="p-4 rounded-lg border border-white/10 border-dashed bg-white/5 hover:bg-white/10 text-white/70 hover:text-white flex flex-col items-center gap-2 transition-colors"
            >
              <Upload className="w-5 h-5" />
              <span className="text-sm">Add {d.label}</span>
            </button>
          ))}
        </div>

        {docs.length > 0 && (
          <div className="flex flex-col gap-2">
            {docs.map((d) => (
              <div
                key={d.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10"
              >
                <FileText className="w-4 h-4 text-primary" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-white truncate">{d.name}</div>
                  <div className="text-xs text-white/50 capitalize">{d.kind}</div>
                </div>
                <Input
                  value={d.name}
                  onChange={(e) =>
                    setDocs((prev) =>
                      prev.map((p) => (p.id === d.id ? { ...p, name: e.target.value } : p)),
                    )
                  }
                  className="bg-white/5 border-white/10 text-white text-xs h-8 max-w-[200px]"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => removeDoc(d.id)}
                  className="text-white/50 hover:text-red-400 hover:bg-red-500/10 h-8 w-8 shrink-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </GlassCard>

      <div className="flex justify-end">
        <Button
          onClick={onSubmit}
          disabled={status === "pending"}
          className="bg-primary hover:bg-primary/90 px-8"
        >
          {status === "pending" ? "Awaiting review" : "Submit for approval"}
        </Button>
      </div>
    </div>
  );
}

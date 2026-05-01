import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface CreatePostProps {
  onClose: () => void;
}

export default function CreatePost({ onClose }: CreatePostProps) {
  const [tab, setTab] = useState<"Product" | "Service" | "Demand">("Product");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex bg-[rgba(var(--glass-tint)/0.1)] p-1 rounded-xl">
        {(["Product", "Service", "Demand"] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-1.5 text-sm font-semibold rounded-lg transition-all ${
              tab === t ? "bg-[rgb(var(--primary))] text-[rgb(var(--primary-foreground))] shadow-glow" : "text-[rgb(var(--text-muted))] hover:text-[rgb(var(--text))]"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="space-y-4 mt-2">
        <Input placeholder="Title" />
        <textarea 
          className="input min-h-[100px] resize-none" 
          placeholder={`Describe your ${tab.toLowerCase()}...`}
        />
        
        {tab === "Product" && (
          <div className="flex gap-4">
            <Input type="number" placeholder="Price (৳)" className="flex-1" />
            <Input placeholder="Category" className="flex-1" />
          </div>
        )}

        {(tab === "Service" || tab === "Demand") && (
          <Input placeholder="Location area" />
        )}

        <div className="h-24 rounded-xl border-2 border-dashed border-[rgba(var(--glass-stroke)/0.3)] flex items-center justify-center text-[rgb(var(--text-muted))] bg-[rgba(var(--glass-tint)/0.05)] cursor-pointer hover:bg-[rgba(var(--glass-tint)/0.1)] transition-colors">
          + Add Photo / Video
        </div>

        <Button variant="primary" fullWidth onClick={onClose} className="mt-4">
          Post {tab}
        </Button>
      </div>
    </div>
  );
}

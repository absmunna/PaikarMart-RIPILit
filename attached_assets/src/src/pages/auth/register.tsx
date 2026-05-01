import { useState } from "react";
import { Link, useLocation } from "wouter";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/features/auth/AuthContext";
import { toast } from "sonner";

export default function RegisterPage() {
  const [, navigate] = useLocation();
  const auth = useAuth();
  const [form, setForm] = useState({
    fullName: "", phone: "", email: "", password: "",
  });
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((s) => ({ ...s, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await auth.registerUser(form);
      toast.success("Account created");
      navigate("/");
    } catch {
      toast.error("Registration failed");
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <GlassCard className="p-6">
        <h1 className="text-2xl font-bold mb-1">Create an account</h1>
        <p className="text-sm text-muted-foreground mb-6">Buy & engage on PaikarMart</p>

        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1">
            <Label>Full name</Label>
            <Input value={form.fullName} onChange={set("fullName")} required />
          </div>
          <div className="space-y-1">
            <Label>Phone</Label>
            <Input value={form.phone} onChange={set("phone")} placeholder="01XXXXXXXXX" required />
          </div>
          <div className="space-y-1">
            <Label>Email (optional)</Label>
            <Input type="email" value={form.email} onChange={set("email")} />
          </div>
          <div className="space-y-1">
            <Label>Password</Label>
            <Input type="password" value={form.password} onChange={set("password")} required />
          </div>
          <Button type="submit" className="w-full">Create account</Button>
        </form>

        <p className="mt-6 text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-primary hover:underline">Log in</Link>
        </p>
      </GlassCard>
    </div>
  );
}

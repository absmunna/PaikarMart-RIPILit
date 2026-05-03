import { useState } from "react";
import { Link, useLocation } from "wouter";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/features/auth/AuthContext";
import { toast } from "sonner";

export default function LoginPage() {
  const [, navigate] = useLocation();
  const auth = useAuth();
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"user" | "admin" | "moderator">("user");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "user") {
        await auth.loginWithPhone(phone, password);
      } else {
        const endpoint = mode === "admin" ? "/api/auth/admin-login" : "/api/auth/moderator-login";
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        if (!res.ok) throw new Error("invalid credentials");
        const data = await res.json();
        window.localStorage.setItem("pm.auth.v1", JSON.stringify({
          id: data.user.id,
          fullName: data.user.name,
          phone: data.user.phone ?? "",
          email: data.user.email ?? email,
          avatarUrl: data.user.avatarUrl,
          role: data.user.role,
          createdAt: new Date().toISOString(),
        }));
        window.localStorage.setItem("pm.auth.token.v1", data.token ?? "");
        window.location.assign("/");
        return;
      }
      toast.success("Logged in");
      navigate("/");
    } catch {
      toast.error("Login failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <GlassCard className="p-6">
        <h1 className="text-2xl font-bold mb-1">Welcome back</h1>
        <p className="text-sm text-muted-foreground mb-6">Log in to PaikarMart</p>

        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1">
            <Label>Login as</Label>
            <Select value={mode} onValueChange={(v) => setMode(v as "user" | "admin" | "moderator")}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="moderator">Moderator</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {mode === "user" ? (
          <div className="space-y-1">
            <Label>Phone</Label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="01XXXXXXXXX" required />
          </div>
          ) : (
            <div className="space-y-1">
              <Label>Email</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={mode === "admin" ? "admin@pkmart.local" : "mod@pkmart.local"} required />
            </div>
          )}
          <div className="space-y-1">
            <Label>Password</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? "Logging in..." : "Log in"}
          </Button>
        </form>

        <div className="mt-6 text-sm text-muted-foreground space-y-2">
          <p>
            New here? <Link href="/auth/register" className="text-primary hover:underline">Create an account</Link>
          </p>
          <p>
            Want to sell? <Link href="/auth/seller-register" className="text-primary hover:underline">Become a seller</Link>
          </p>
        </div>
      </GlassCard>
    </div>
  );
}

import React, { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Link, useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { Phone, User, Lock, Eye, EyeOff, ArrowLeft, ArrowRight, CheckCircle2, Sparkles, KeyRound } from "lucide-react";
import { cn } from "@/lib/utils";

type Step = "info" | "otp" | "done";

export default function RegisterPage() {
  const { login } = useAuth();
  const [, navigate] = useLocation();

  const [step, setStep] = useState<Step>("info");
  const [name, setName]       = useState("");
  const [phone, setPhone]     = useState("");
  const [pass, setPass]       = useState("");
  const [showPass, setShowPass] = useState(false);
  const [otp, setOtp]         = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);

  const handleOtpChange = (val: string, i: number) => {
    const arr = [...otp];
    arr[i] = val.slice(-1);
    setOtp(arr);
    if (val && i < 5) {
      const next = document.getElementById(`reg-otp-${i + 1}`);
      if (next) (next as HTMLInputElement).focus();
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent, i: number) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) {
      const prev = document.getElementById(`reg-otp-${i - 1}`);
      if (prev) (prev as HTMLInputElement).focus();
    }
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim())       { toast.error("Please enter your full name"); return; }
    if (!phone.trim())      { toast.error("Please enter your phone number"); return; }
    if (pass.length < 6)    { toast.error("Password must be at least 6 characters"); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep("otp");
      toast.success("OTP sent to " + phone);
    }, 1000);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.some(d => !d)) { toast.error("Please enter the complete 6-digit OTP"); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      login({ id: "user-new", name, phone, role: "buyer", email: "" });
      setStep("done");
    }, 1000);
  };

  const inputCls = "h-11 bg-white/5 border-white/10 text-white placeholder:text-white/25 focus-visible:ring-emerald-500/40 focus-visible:border-emerald-500/40";

  return (
    <Layout>
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm mx-auto">

          {/* Logo + Title */}
          <div className="text-center mb-8">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl mb-4 shadow-lg"
              style={{ background: "linear-gradient(135deg, hsl(145 65% 26%), hsl(145 60% 38%))", border: "1.5px solid rgba(16,185,129,0.4)" }}>
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Create Account</h1>
            <p className="text-sm text-white/40 mt-1">Join PaikarMart — it's free!</p>
          </div>

          {/* STEP 1 — Info */}
          {step === "info" && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-white/60 uppercase tracking-wider">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                  <Input value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" className={cn(inputCls, "pl-9")} />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-white/60 uppercase tracking-wider">Phone Number</Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                    <Phone className="h-4 w-4 text-white/30" />
                    <span className="text-xs text-white/30 border-r border-white/10 pr-2">+880</span>
                  </div>
                  <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="01XXXXXXXXX" type="tel" className={cn(inputCls, "pl-16")} />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-white/60 uppercase tracking-wider">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                  <Input
                    value={pass} onChange={e => setPass(e.target.value)}
                    type={showPass ? "text" : "password"} placeholder="Min. 6 characters"
                    className={cn(inputCls, "pl-9 pr-10")}
                  />
                  <button type="button" onClick={() => setShowPass(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full h-11 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-60 mt-2"
                style={{ background: "linear-gradient(135deg, hsl(145 65% 28%), hsl(145 60% 40%))" }}>
                {loading ? "Sending OTP..." : <><span>Send OTP</span><ArrowRight className="h-4 w-4" /></>}
              </button>

              <p className="text-xs text-center text-white/35 pt-1">
                Already have an account?{" "}
                <Link href="/login" className="text-emerald-400 font-semibold hover:text-emerald-300">Sign In</Link>
              </p>
            </form>
          )}

          {/* STEP 2 — OTP */}
          {step === "otp" && (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div className="text-center">
                <div className="h-12 w-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center mx-auto mb-3">
                  <KeyRound className="h-5 w-5 text-emerald-400" />
                </div>
                <p className="text-sm text-white/60">OTP sent to <span className="text-white font-medium">{phone}</span></p>
                <p className="text-xs text-white/35 mt-0.5">Enter the 6-digit code below</p>
              </div>

              <div className="flex justify-center gap-2">
                {otp.map((d, i) => (
                  <input
                    key={i} id={`reg-otp-${i}`} type="text" inputMode="numeric" maxLength={1}
                    value={d} onChange={e => handleOtpChange(e.target.value, i)}
                    onKeyDown={e => handleOtpKeyDown(e, i)}
                    className="h-12 w-10 rounded-xl text-center text-lg font-bold text-white bg-white/5 border border-white/10 focus:outline-none focus:border-emerald-500/50 focus:bg-emerald-500/5 transition-all"
                  />
                ))}
              </div>

              <button type="submit" disabled={loading}
                className="w-full h-11 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-60"
                style={{ background: "linear-gradient(135deg, hsl(145 65% 28%), hsl(145 60% 40%))" }}>
                {loading ? "Verifying..." : "Create My Account"}
              </button>

              <button type="button" onClick={() => setStep("info")}
                className="w-full flex items-center justify-center gap-1.5 text-xs text-white/40 hover:text-white transition-colors py-1">
                <ArrowLeft className="h-3.5 w-3.5" /> Back
              </button>
            </form>
          )}

          {/* STEP 3 — Done */}
          {step === "done" && (
            <div className="text-center py-4">
              <div className="h-16 w-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto mb-5 shadow-lg"
                style={{ boxShadow: "0 0 30px rgba(16,185,129,0.2)" }}>
                <CheckCircle2 className="h-8 w-8 text-emerald-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Welcome, {name.split(" ")[0]}! 🎉</h2>
              <p className="text-sm text-white/40 mb-6">Your account is ready. Start exploring PaikarMart!</p>
              <div className="flex flex-col gap-3">
                <button onClick={() => navigate("/")}
                  className="w-full h-11 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90"
                  style={{ background: "linear-gradient(135deg, hsl(145 65% 28%), hsl(145 60% 40%))" }}>
                  Start Shopping
                </button>
                <button onClick={() => navigate("/profile")}
                  className="w-full h-11 rounded-xl font-bold text-sm text-white/50 bg-white/5 border border-white/10 hover:bg-white/8 hover:text-white transition-all">
                  Go to My Profile
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </Layout>
  );
}

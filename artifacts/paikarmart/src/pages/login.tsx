import React, { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocation } from "wouter";
import { toast } from "sonner";
import {
  Phone, Mail, Lock, Eye, EyeOff, ArrowLeft,
  ShieldCheck, Store, LayoutDashboard, KeyRound, Smartphone, Sparkles
} from "lucide-react";

type Mode = "main" | "otp_phone" | "password" | "forgot" | "forgot_otp" | "reset";
type LoginType = "buyer" | "seller" | "admin";

export default function LoginPage() {
  const { login } = useAuth();
  const [, navigate] = useLocation();

  const [mode, setMode] = useState<Mode>("main");
  const [loginType, setLoginType] = useState<LoginType>("buyer");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [showPass, setShowPass] = useState(false);
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [loading, setLoading] = useState(false);

  const handleOtpChange = (val: string, i: number) => {
    const arr = [...otp];
    arr[i] = val.slice(-1);
    setOtp(arr);
    if (val && i < 5) {
      const next = document.getElementById(`otp-${i + 1}`);
      if (next) (next as HTMLInputElement).focus();
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent, i: number) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) {
      const prev = document.getElementById(`otp-${i - 1}`);
      if (prev) (prev as HTMLInputElement).focus();
    }
  };

  const sendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) { toast.error("Please enter a phone number"); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setMode("otp_phone");
      toast.success("OTP sent to " + phone);
    }, 1000);
  };

  const doApiLogin = async (phoneVal: string, emailVal: string, role: LoginType) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: phoneVal || undefined, email: emailVal || undefined, role }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error((err as { error?: string }).error || "Login failed");
    }
    const data = await res.json() as { user: { id: string; name: string; role: "buyer" | "seller" | "admin"; phone?: string; email?: string } };
    return data.user;
  };

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await doApiLogin(phone, email, loginType);
      login(user);
      toast.success("Logged in successfully!");
      navigate(user.role === "seller" ? "/seller/dashboard" : user.role === "admin" ? "/admin/dashboard" : "/");
    } catch (err) {
      toast.error((err as Error).message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone && !email) { toast.error("Enter phone or email"); return; }
    setLoading(true);
    try {
      const user = await doApiLogin(phone, email, loginType);
      login(user);
      toast.success("Logged in successfully!");
      navigate(user.role === "seller" ? "/seller/dashboard" : user.role === "admin" ? "/admin/dashboard" : "/");
    } catch (err) {
      toast.error((err as Error).message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const sendForgotOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setMode("forgot_otp"); toast.success("OTP sent for password reset"); }, 900);
  };

  const verifyForgotOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setMode("reset");
  };

  const resetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass !== confirmPass) { toast.error("Passwords do not match"); return; }
    if (newPass.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    toast.success("Password reset successfully! Please login.");
    setMode("main");
    setNewPass(""); setConfirmPass(""); setOtp(["","","","","",""]);
  };

  const inputCls = "bg-white/5 border-white/15 text-white placeholder:text-white/30 focus:border-primary focus:ring-primary";
  const labelCls = "text-sm font-medium text-white/70 mb-1.5 block";

  return (
    <Layout>
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">

          {/* Role Tabs */}
          {mode === "main" && (
            <div className="flex gap-2 mb-5 p-1.5 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
              {([
                { key: "buyer", label: "Customer", icon: ShieldCheck },
                { key: "seller", label: "Seller", icon: Store },
                { key: "admin", label: "Admin", icon: LayoutDashboard },
              ] as { key: LoginType; label: string; icon: React.ElementType }[]).map(tab => {
                const Icon = tab.icon;
                return (
                  <button key={tab.key} onClick={() => setLoginType(tab.key)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                      loginType === tab.key
                        ? "bg-primary text-white shadow-sm"
                        : "text-white/50 hover:text-white/80 hover:bg-white/5"
                    }`}>
                    <Icon className="h-4 w-4" /> {tab.label}
                  </button>
                );
              })}
            </div>
          )}

          {/* Main Card */}
          <div className="glass-card rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="px-6 pt-6 pb-5 border-b border-white/10">
              {mode !== "main" && (
                <button onClick={() => { setMode("main"); setOtp(["","","","","",""]); }}
                  className="flex items-center gap-1.5 text-sm text-white/50 hover:text-primary mb-4 transition-colors">
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
              )}
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-primary to-emerald-400 flex items-center justify-center shadow-lg">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">
                    {mode === "main" && `${loginType === "buyer" ? "Customer" : loginType === "seller" ? "Seller" : "Admin"} Login`}
                    {mode === "otp_phone" && "Enter OTP"}
                    {mode === "password" && "Password Login"}
                    {mode === "forgot" && "Forgot Password"}
                    {mode === "forgot_otp" && "Verify OTP"}
                    {mode === "reset" && "Reset Password"}
                  </h1>
                  <p className="text-xs text-white/50">
                    {mode === "main" && "Login to your PaikarMart account"}
                    {mode === "otp_phone" && `OTP sent to ${phone}`}
                    {mode === "password" && "Login with your password"}
                    {mode === "forgot" && "Enter your phone or email"}
                    {mode === "forgot_otp" && "Enter the 6-digit OTP"}
                    {mode === "reset" && "Create a new password"}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              {/* Main Login Screen */}
              {mode === "main" && (
                <div className="space-y-4">
                  <form onSubmit={sendOtp} className="space-y-4">
                    <div>
                      <Label className={labelCls}>Phone Number</Label>
                      <div className="flex">
                        <div className="flex items-center justify-center px-3 border border-r-0 border-white/15 rounded-l-lg bg-white/5 text-white/60 text-sm font-medium">
                          +880
                        </div>
                        <Input
                          placeholder="1XXXXXXXXX"
                          value={phone} onChange={e => setPhone(e.target.value)}
                          className={`${inputCls} rounded-l-none`}
                        />
                      </div>
                    </div>
                    <Button type="submit" className="w-full bg-primary hover:bg-primary/90 h-11 font-semibold" disabled={loading}>
                      <Smartphone className="h-4 w-4 mr-2" />
                      {loading ? "Sending..." : "Send OTP"}
                    </Button>
                  </form>

                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-white/10" />
                    <span className="text-xs text-white/30">or</span>
                    <div className="flex-1 h-px bg-white/10" />
                  </div>

                  <Button variant="outline" className="w-full h-11 border-white/15 text-white/70 hover:bg-white/5 hover:text-white" onClick={() => setMode("password")}>
                    <Lock className="h-4 w-4 mr-2 text-primary" /> Login with Password
                  </Button>

                  <div className="text-center">
                    <button onClick={() => setMode("forgot")} className="text-sm text-primary hover:underline">
                      Forgot Password?
                    </button>
                  </div>

                  {/* Demo Accounts */}
                  <div className="pt-4 border-t border-white/10">
                    <p className="text-xs text-white/30 text-center mb-3">Quick login (demo)</p>
                    <div className="grid grid-cols-3 gap-2">
                      {([
                        { label: "Buyer", phone: "01811111111", role: "buyer" as LoginType, nav: "/" },
                        { label: "Seller", phone: "01700000002", role: "seller" as LoginType, nav: "/seller/dashboard" },
                        { label: "Admin", phone: "01700000001", role: "admin" as LoginType, nav: "/admin/dashboard" },
                      ]).map(a => (
                        <button key={a.label}
                          onClick={async () => {
                            try {
                              const user = await doApiLogin(a.phone, "", a.role);
                              login(user);
                              toast.success(`Logged in as ${user.name}`);
                              navigate(a.nav);
                            } catch { toast.error("Demo login failed"); }
                          }}
                          className="py-2 px-2 rounded-lg border border-white/10 text-xs font-medium text-white/50 hover:bg-primary/10 hover:border-primary/40 hover:text-primary transition-all">
                          {a.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* OTP Verification */}
              {mode === "otp_phone" && (
                <form onSubmit={verifyOtp} className="space-y-6">
                  <div>
                    <Label className={`${labelCls} text-center`}>Enter 6-digit OTP</Label>
                    <div className="flex gap-2 justify-center mt-3">
                      {otp.map((d, i) => (
                        <input key={i} id={`otp-${i}`} type="text" maxLength={1}
                          value={d} onChange={e => handleOtpChange(e.target.value, i)}
                          onKeyDown={e => handleOtpKeyDown(e, i)}
                          className="w-11 h-12 text-center text-lg font-bold bg-white/5 border-2 border-white/15 rounded-xl text-white focus:border-primary focus:outline-none transition-colors"
                        />
                      ))}
                    </div>
                  </div>
                  <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 text-center">
                    <p className="text-xs text-primary">Demo: Use any 6 digits to continue</p>
                  </div>
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90 h-11 font-semibold" disabled={loading}>
                    <ShieldCheck className="h-4 w-4 mr-2" />
                    {loading ? "Verifying..." : "Verify & Login"}
                  </Button>
                  <div className="text-center">
                    <button type="button" onClick={() => toast.success("OTP resent!")} className="text-sm text-primary hover:underline">
                      Resend OTP
                    </button>
                  </div>
                </form>
              )}

              {/* Password Login */}
              {mode === "password" && (
                <form onSubmit={handlePasswordLogin} className="space-y-4">
                  <div>
                    <Label className={labelCls}>Phone or Email</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                      <Input placeholder="Phone number or email" value={phone || email}
                        onChange={e => setPhone(e.target.value)}
                        className={`${inputCls} pl-10`} />
                    </div>
                  </div>
                  <div>
                    <Label className={labelCls}>Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                      <Input type={showPass ? "text" : "password"} placeholder="Your password"
                        value={password} onChange={e => setPassword(e.target.value)}
                        className={`${inputCls} pl-10 pr-10`} />
                      <button type="button" onClick={() => setShowPass(v => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                        {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <label className="flex items-center gap-2 text-sm text-white/50 cursor-pointer">
                      <input type="checkbox" className="accent-primary" /> Remember me
                    </label>
                    <button type="button" onClick={() => setMode("forgot")} className="text-sm text-primary hover:underline">Forgot?</button>
                  </div>
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90 h-11 font-semibold" disabled={loading}>
                    <KeyRound className="h-4 w-4 mr-2" />
                    {loading ? "Logging in..." : "Login"}
                  </Button>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-white/10" />
                    <span className="text-xs text-white/30">or use OTP instead</span>
                    <div className="flex-1 h-px bg-white/10" />
                  </div>
                  <Button type="button" variant="outline" className="w-full h-10 border-white/15 text-white/60 hover:bg-white/5 hover:text-white" onClick={() => setMode("main")}>
                    <Smartphone className="h-4 w-4 mr-2 text-primary" /> Login with OTP
                  </Button>
                </form>
              )}

              {/* Forgot Password */}
              {mode === "forgot" && (
                <form onSubmit={sendForgotOtp} className="space-y-4">
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-sm text-amber-400">
                    Enter your registered phone number or email. We will send you an OTP to reset your password.
                  </div>
                  <div>
                    <Label className={labelCls}>Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                      <Input placeholder="01XXXXXXXXX" value={phone} onChange={e => setPhone(e.target.value)} className={`${inputCls} pl-10`} />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-white/10" />
                    <span className="text-xs text-white/30">or</span>
                    <div className="flex-1 h-px bg-white/10" />
                  </div>
                  <div>
                    <Label className={labelCls}>Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                      <Input type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} className={`${inputCls} pl-10`} />
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90 h-11 font-semibold" disabled={loading}>
                    {loading ? "Sending..." : "Send Reset OTP"}
                  </Button>
                </form>
              )}

              {/* Forgot OTP Verify */}
              {mode === "forgot_otp" && (
                <form onSubmit={verifyForgotOtp} className="space-y-6">
                  <div>
                    <Label className={`${labelCls} text-center`}>Enter 6-digit OTP</Label>
                    <div className="flex gap-2 justify-center mt-3">
                      {otp.map((d, i) => (
                        <input key={i} id={`otp-${i}`} type="text" maxLength={1}
                          value={d} onChange={e => handleOtpChange(e.target.value, i)}
                          onKeyDown={e => handleOtpKeyDown(e, i)}
                          className="w-11 h-12 text-center text-lg font-bold bg-white/5 border-2 border-white/15 rounded-xl text-white focus:border-primary focus:outline-none transition-colors"
                        />
                      ))}
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90 h-11 font-semibold">
                    Verify OTP
                  </Button>
                </form>
              )}

              {/* Reset Password */}
              {mode === "reset" && (
                <form onSubmit={resetPassword} className="space-y-4">
                  <div>
                    <Label className={labelCls}>New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                      <Input type={showPass ? "text" : "password"} placeholder="Min. 6 characters"
                        value={newPass} onChange={e => setNewPass(e.target.value)}
                        className={`${inputCls} pl-10 pr-10`} />
                      <button type="button" onClick={() => setShowPass(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30">
                        {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <Label className={labelCls}>Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                      <Input type="password" placeholder="Repeat new password"
                        value={confirmPass} onChange={e => setConfirmPass(e.target.value)}
                        className={`${inputCls} pl-10`} />
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90 h-11 font-semibold">
                    <KeyRound className="h-4 w-4 mr-2" /> Reset Password
                  </Button>
                </form>
              )}
            </div>

            {/* Footer */}
            {mode === "main" && (
              <div className="px-6 pb-6 text-center border-t border-white/10 pt-4">
                <p className="text-sm text-white/40">
                  Don't have an account?{" "}
                  <a href="/register" className="text-primary font-semibold hover:underline">Sign up free</a>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

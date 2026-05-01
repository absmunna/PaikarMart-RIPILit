import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { useAuth } from "@/features/auth/auth.context";
import { User } from "@/types/user.types";

export default function Login() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("");

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) setStep(2);
    else {
      const demoUser: User = {
        id: "u-demo",
        name: "Rafiq Hossain",
        handle: "@rafiq",
        avatar: "",
        role: "seller",
        sellerType: "retail",
        shopName: "Rafiq Store",
        shopCover: "/generated/banner1.png",
        shopLogo: "/generated/avatar1.png",
        isVerified: true,
        followers: 2200,
        rating: 4.9,
        about: "Trusted retail seller on PaikarMart.",
      };
      signIn(demoUser);
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-[rgb(var(--primary))] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-floaty" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-floaty" style={{ animationDelay: "2s" }} />

      <div className="w-full max-w-sm relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="flex flex-col items-center mb-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[rgb(var(--primary))] text-[rgb(var(--primary-foreground))] shadow-glow mb-4">
            <span className="font-bold text-3xl leading-none">P</span>
          </div>
          <h1 className="text-2xl font-bold neon-text">Welcome Back</h1>
          <p className="text-[rgb(var(--text-muted))] mt-2 text-sm text-center">Log in to continue your shopping and selling journey.</p>
        </div>

        <Card className="p-6">
          <form onSubmit={handleNext} className="flex flex-col gap-4">
            {step === 1 ? (
              <>
                <div>
                  <label className="text-xs font-semibold text-[rgb(var(--text-muted))] mb-1.5 block">Phone Number</label>
                  <div className="flex gap-2">
                    <div className="input w-16 text-center shrink-0 flex items-center justify-center bg-[rgba(var(--glass-tint)/0.05)] border-[rgba(var(--glass-stroke)/0.1)]">+880</div>
                    <Input 
                      autoFocus
                      placeholder="17XX XXXXXX" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                <Button variant="primary" fullWidth className="mt-2 h-12 shadow-glow group">
                  Continue <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Button>
              </>
            ) : (
              <>
                <div className="text-center mb-2">
                  <p className="text-sm text-[rgb(var(--text))]">We sent a code to <span className="font-bold">+880 {phone}</span></p>
                  <button type="button" onClick={() => setStep(1)} className="text-xs text-[rgb(var(--primary))] mt-1 font-medium">Wrong number?</button>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[rgb(var(--text-muted))] mb-1.5 block text-center">Enter 4-digit code</label>
                  <Input 
                    autoFocus
                    placeholder="• • • •" 
                    className="text-center text-xl tracking-widest font-bold h-14 bg-[rgba(var(--glass-tint)/0.05)] border-[rgba(var(--glass-stroke)/0.2)]"
                  />
                </div>
                <Button variant="primary" fullWidth className="mt-2 h-12 shadow-glow">
                  Verify & Login
                </Button>
              </>
            )}
          </form>
        </Card>
        
        <p className="text-center text-sm text-[rgb(var(--text-muted))] mt-8">
          Don't have an account? <Button variant="ghost" size="sm" className="p-0 h-auto font-bold text-[rgb(var(--primary))]" onClick={() => navigate("/register")}>Sign up</Button>
        </p>
      </div>
    </div>
  );
}

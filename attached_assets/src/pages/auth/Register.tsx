import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { useAuth } from "@/features/auth/auth.context";
import { User } from "@/types/user.types";

export default function Register() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) setStep((s) => s + 1);
    else {
      const handle = `@${name.toLowerCase().replace(/\s/g, "") || "user"}`;
      const newUser: User = {
        id: `u-${Date.now()}`,
        name: name || "New User",
        handle,
        avatar: "",
        role: "user",
        isVerified: false,
        followers: 0,
        rating: 0,
        about: "New member of PaikarMart.",
      };
      signIn(newUser);
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-20 right-10 w-32 h-32 bg-[rgb(var(--accent-arrival))] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-floaty" />
      
      <div className="w-full max-w-sm relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-2xl font-bold neon-text">Create Account</h1>
          <p className="text-[rgb(var(--text-muted))] mt-2 text-sm text-center">Join PaikarMart today.</p>
        </div>

        <div className="flex justify-center gap-2 mb-6">
          {[1, 2, 3].map(i => (
            <div key={i} className={`h-1.5 rounded-full transition-all ${i <= step ? "w-8 bg-[rgb(var(--primary))]" : "w-4 bg-[rgba(var(--glass-stroke)/0.3)]"}`} />
          ))}
        </div>

        <Card className="p-6">
          <form onSubmit={handleNext} className="flex flex-col gap-4">
            {step === 1 && (
              <>
                <div>
                  <label className="text-xs font-semibold text-[rgb(var(--text-muted))] mb-1.5 block">What's your name?</label>
                  <Input 
                    autoFocus
                    placeholder="Full Name" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <Button variant="primary" fullWidth className="mt-2 h-12 shadow-glow group" disabled={!name}>
                  Continue <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Button>
              </>
            )}
            
            {step === 2 && (
              <>
                <div>
                  <label className="text-xs font-semibold text-[rgb(var(--text-muted))] mb-1.5 block">Phone Number</label>
                  <div className="flex gap-2">
                    <div className="input w-16 text-center shrink-0 flex items-center justify-center bg-[rgba(var(--glass-tint)/0.05)] border-[rgba(var(--glass-stroke)/0.1)]">+880</div>
                    <Input autoFocus placeholder="17XX XXXXXX" className="flex-1" />
                  </div>
                </div>
                <Button variant="primary" fullWidth className="mt-2 h-12 shadow-glow group">
                  Send Code <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Button>
              </>
            )}

            {step === 3 && (
              <>
                <div className="text-center mb-2">
                  <div className="h-12 w-12 rounded-full bg-[rgba(var(--primary)/0.15)] text-[rgb(var(--primary))] flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <p className="text-sm text-[rgb(var(--text))]">We sent a verification code to your phone.</p>
                </div>
                <div>
                  <Input 
                    autoFocus
                    placeholder="• • • •" 
                    className="text-center text-xl tracking-widest font-bold h-14 bg-[rgba(var(--glass-tint)/0.05)] border-[rgba(var(--glass-stroke)/0.2)]"
                  />
                </div>
                <Button variant="primary" fullWidth className="mt-2 h-12 shadow-glow">
                  Verify & Create Account
                </Button>
              </>
            )}
          </form>
        </Card>
        
        <p className="text-center text-sm text-[rgb(var(--text-muted))] mt-8">
          Already have an account? <Button variant="ghost" size="sm" className="p-0 h-auto font-bold text-[rgb(var(--primary))]" onClick={() => navigate("/login")}>Log in</Button>
        </p>
      </div>
    </div>
  );
}

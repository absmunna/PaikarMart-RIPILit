import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] w-full flex items-center justify-center p-4">
      <GlassCard className="w-full max-w-md p-8 text-center flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-2 text-red-500">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h1 className="text-3xl font-bold text-white">404</h1>
        <p className="text-white/60 mb-4">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link href="/">
          <Button className="bg-primary hover:bg-primary/90 text-white rounded-full px-8">
            Return Home
          </Button>
        </Link>
      </GlassCard>
    </div>
  );
}

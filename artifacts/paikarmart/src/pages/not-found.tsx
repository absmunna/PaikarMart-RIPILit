import { Link } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { Home, SearchX, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <Layout>
      <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
        <div className="text-center max-w-sm mx-auto">
          <div className="relative mb-6 inline-block">
            <div
              className="h-24 w-24 rounded-3xl flex items-center justify-center mx-auto"
              style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.15), rgba(139,92,246,0.15))", border: "1px solid rgba(16,185,129,0.2)" }}
            >
              <SearchX className="h-10 w-10 text-white/30" />
            </div>
            <span
              className="absolute -top-2 -right-2 text-2xl font-black"
              style={{ color: "rgba(16,185,129,0.5)", fontFamily: "monospace" }}
            >404</span>
          </div>

          <h1 className="text-2xl font-bold text-white mb-2">Page Not Found</h1>
          <p className="text-white/45 text-sm leading-relaxed mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/">
              <button
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90 shadow-lg"
                style={{ background: "linear-gradient(135deg, hsl(145 65% 32%), hsl(145 60% 40%))", boxShadow: "0 4px 16px rgba(16,185,129,0.25)" }}
              >
                <Home className="h-4 w-4" /> Go Home
              </button>
            </Link>
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white/60 border border-white/10 hover:text-white hover:bg-white/5 transition-all"
            >
              <ArrowLeft className="h-4 w-4" /> Go Back
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

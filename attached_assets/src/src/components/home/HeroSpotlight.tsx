import * as React from "react";
import { Link } from "wouter";
import { ChevronLeft, ChevronRight, Sparkles, Flame, ShoppingBag, PlayCircle, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

type Slide = {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  cta: string;
  href: string;
  image: string;
  gradient: string;
  Icon: React.ComponentType<{ className?: string }>;
};

const SLIDES: Slide[] = [
  {
    id: "spotlight-1",
    eyebrow: "Featured Drop",
    title: "Smartphone Mid-range Sale",
    subtitle: "Up to 22% off · Free PK Coin cashback on first order",
    cta: "Shop the drop",
    href: "/marketplace",
    image:
      "https://images.unsplash.com/photo-1512054502232-10a0a035d672?auto=format&fit=crop&w=1600&q=80",
    gradient: "from-blue-600/70 via-indigo-600/40 to-transparent",
    Icon: Sparkles,
  },
  {
    id: "spotlight-2",
    eyebrow: "Trending Now",
    title: "Fresh Hilsa Direct from Chandpur",
    subtitle: "Verified local sellers · Same-day delivery in Dhaka",
    cta: "Explore Local",
    href: "/local",
    image:
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1600&q=80",
    gradient: "from-emerald-600/70 via-teal-600/40 to-transparent",
    Icon: MapPin,
  },
  {
    id: "spotlight-3",
    eyebrow: "Creator Spotlight",
    title: "Premium Video Tutorials Unlocked",
    subtitle: "Pay with PK Coin · Preview before you unlock",
    cta: "Watch Now",
    href: "/reels",
    image:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1600&q=80",
    gradient: "from-purple-600/70 via-pink-600/40 to-transparent",
    Icon: PlayCircle,
  },
  {
    id: "spotlight-4",
    eyebrow: "Hot This Week",
    title: "Wholesale Markets Open in Chittagong",
    subtitle: "Bulk pricing · 350+ verified vendors live",
    cta: "Browse Vendors",
    href: "/vendors",
    image:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1600&q=80",
    gradient: "from-amber-600/70 via-orange-600/40 to-transparent",
    Icon: Flame,
  },
  {
    id: "spotlight-5",
    eyebrow: "Demand Match",
    title: "Post What You Need — Sellers Bid for It",
    subtitle: "23k active demand posts · Avg response < 4 hours",
    cta: "Post a Demand",
    href: "/demand",
    image:
      "https://images.unsplash.com/photo-1556742212-5b321f3c261b?auto=format&fit=crop&w=1600&q=80",
    gradient: "from-rose-600/70 via-fuchsia-600/40 to-transparent",
    Icon: ShoppingBag,
  },
];

export function HeroSpotlight() {
  const [active, setActive] = React.useState(0);
  const trackRef = React.useRef<HTMLDivElement | null>(null);
  const pausedRef = React.useRef(false);

  const scrollTo = React.useCallback((idx: number) => {
    const el = trackRef.current;
    if (!el) return;
    const child = el.children[idx] as HTMLElement | undefined;
    if (!child) return;
    el.scrollTo({ left: child.offsetLeft - el.offsetLeft, behavior: "smooth" });
  }, []);

  const go = React.useCallback(
    (dir: 1 | -1) => {
      setActive((prev) => {
        const next = (prev + dir + SLIDES.length) % SLIDES.length;
        scrollTo(next);
        return next;
      });
    },
    [scrollTo],
  );

  React.useEffect(() => {
    const id = setInterval(() => {
      if (pausedRef.current) return;
      go(1);
    }, 5000);
    return () => clearInterval(id);
  }, [go]);

  React.useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const w = el.clientWidth;
        const idx = Math.round(el.scrollLeft / w);
        if (idx !== active && idx >= 0 && idx < SLIDES.length) setActive(idx);
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [active]);

  return (
    <div
      className="relative w-full"
      onMouseEnter={() => (pausedRef.current = true)}
      onMouseLeave={() => (pausedRef.current = false)}
    >
      <div
        ref={trackRef}
        className="flex overflow-x-auto snap-x snap-mandatory rounded-2xl scroll-smooth no-scrollbar"
        style={{ scrollbarWidth: "none" }}
      >
        {(Array.isArray(SLIDES) ? SLIDES : []).map((s) => {
          const Icon = s.Icon;
          return (
            <div
              key={s.id}
              className="relative shrink-0 w-full snap-start h-[260px] sm:h-[320px] md:h-[360px] lg:h-[400px] overflow-hidden rounded-2xl"
            >
              <img
                src={s.image}
                alt={s.title}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
              <div className={`absolute inset-0 bg-gradient-to-r ${s.gradient}`} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              <div className="relative z-10 h-full flex flex-col justify-end p-5 sm:p-8 md:p-10 max-w-2xl">
                <div className="inline-flex items-center gap-2 self-start mb-3 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-[11px] uppercase tracking-wider font-medium">
                  <Icon className="w-3.5 h-3.5" /> {s.eyebrow}
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white drop-shadow leading-tight">
                  {s.title}
                </h2>
                <p className="mt-2 text-sm sm:text-base text-white/80 max-w-lg">
                  {s.subtitle}
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <Link href={s.href}>
                    <Button className="bg-white text-slate-900 hover:bg-white/90 rounded-full font-semibold">
                      {s.cta}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        aria-label="Previous slide"
        onClick={() => go(-1)}
        className="hidden sm:flex absolute left-2 top-1/2 -translate-y-1/2 h-9 w-9 items-center justify-center rounded-full bg-black/40 hover:bg-black/60 text-white border border-white/20 backdrop-blur-md"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        type="button"
        aria-label="Next slide"
        onClick={() => go(1)}
        className="hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 items-center justify-center rounded-full bg-black/40 hover:bg-black/60 text-white border border-white/20 backdrop-blur-md"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
        {(Array.isArray(SLIDES) ? SLIDES : []).map((s, i) => (
          <button
            key={s.id}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => {
              setActive(i);
              scrollTo(i);
            }}
            className={`transition-all rounded-full ${
              i === active
                ? "w-6 h-1.5 bg-white"
                : "w-1.5 h-1.5 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

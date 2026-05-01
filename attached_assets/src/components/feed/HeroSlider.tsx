import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const BANNERS = [
  { id: 1, image: "/generated/banner1.png", link: "/marketplace" },
  { id: 2, image: "/generated/banner2.png", link: "/marketplace" },
  { id: 3, image: "/generated/banner3.png", link: "/marketplace" },
];

export function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % BANNERS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl aspect-[21/9]">
      <div 
        className="flex transition-transform duration-500 ease-out h-full"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {BANNERS.map((banner) => (
          <Link key={banner.id} to={banner.link} className="w-full shrink-0 h-full">
            <img 
              src={banner.image} 
              alt="Promo Banner" 
              className="w-full h-full object-cover"
            />
          </Link>
        ))}
      </div>
      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
        {BANNERS.map((_, i) => (
          <button
            key={i}
            className={`h-1.5 rounded-full transition-all ${
              i === current ? "w-4 bg-[rgb(var(--primary))]" : "w-1.5 bg-white/50"
            }`}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Play } from "lucide-react";
import { MOCK_SELLERS } from "@/features/posts/post.api";
import { Avatar } from "@/components/common/Avatar";

export default function Spotlight() {
  const navigate = useNavigate();
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setActiveIdx(prev => (prev + 1) % MOCK_SELLERS.length);
    }, 4000);
    return () => clearInterval(t);
  }, []);

  const activeSeller = MOCK_SELLERS[activeIdx];

  return (
    <div className="fixed inset-0 z-50 bg-black text-white flex flex-col max-w-[480px] lg:max-w-[520px] mx-auto">
      {/* Progress Bars */}
      <div className="flex gap-1 p-2 pt-12">
        {MOCK_SELLERS.map((_, i) => (
          <div key={i} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white transition-all duration-linear" 
              style={{ 
                width: i < activeIdx ? "100%" : i === activeIdx ? "100%" : "0%",
                transitionDuration: i === activeIdx ? "4000ms" : "0ms" 
              }} 
            />
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-2">
        <button onClick={() => navigate(-1)} className="h-8 w-8 flex items-center justify-center">
          <ArrowLeft className="h-6 w-6 shadow-sm" />
        </button>
        <Link to={`/seller/${activeSeller.handle.replace("@", "")}`} className="flex items-center gap-2">
          <Avatar src={`/generated/avatar${(activeIdx % 4) + 1}.png`} fallback={activeSeller.name} size="sm" className="border-white/20" />
          <span className="font-bold drop-shadow-md">{activeSeller.name}</span>
          <span className="text-white/70 text-sm drop-shadow-md">2h</span>
        </Link>
      </div>

      {/* Content Area */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden" onClick={() => setActiveIdx(p => (p + 1) % MOCK_SELLERS.length)}>
        <img 
          src={activeIdx % 2 === 0 ? "/generated/product1.png" : "/generated/product2.png"} 
          alt="Story" 
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80" />
        
        <div className="absolute bottom-20 left-4 right-4 text-center">
          <h2 className="text-2xl font-bold mb-2 shadow-sm drop-shadow-md">New Arrivals in Store!</h2>
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30 text-sm font-bold">
            Swipe up to shop
          </div>
        </div>
      </div>
    </div>
  );
}

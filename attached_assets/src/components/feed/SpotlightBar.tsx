import { Link } from "react-router-dom";
import { MOCK_SELLERS } from "@/features/posts/post.api";
import { Avatar } from "@/components/common/Avatar";

export function SpotlightBar() {
  return (
    <div className="w-full py-4 -mx-4 px-4 overflow-x-auto no-scrollbar">
      <div className="flex items-center gap-4 w-max">
        {MOCK_SELLERS.map((seller, i) => (
          <Link key={seller.id} to={`/seller/${seller.handle.replace("@", "")}`} className="flex flex-col items-center gap-1 w-16">
            <div className="rounded-full p-[2px] bg-gradient-to-tr from-[rgb(var(--primary))] to-[rgb(var(--accent-hub))] shadow-glow">
              <Avatar 
                src={`/generated/avatar${(i % 4) + 1}.png`} 
                fallback={seller.name} 
                size="lg" 
                className="border-2 border-[rgb(var(--bg))] bg-[rgb(var(--bg))]"
              />
            </div>
            <span className="text-[10px] font-medium text-[rgb(var(--text))] text-center truncate w-full">
              {seller.name.split(" ")[0]}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

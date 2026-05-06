import { useListPosts, getListPostsQueryKey } from "@workspace/api-client-react";
import { formatBDT } from "@/lib/format";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Share2, MoreHorizontal, Store } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Link } from "wouter";

export default function Reels() {
  const { data: posts } = useListPosts({ type: "video" }, { query: { queryKey: getListPostsQueryKey({ type: "video" }) } });

  if (posts === undefined) {
    return <div className="h-[100dvh] flex items-center justify-center text-white/70">Loading reels…</div>;
  }
  if (!posts.length) {
    return <div className="h-[100dvh] flex items-center justify-center text-white/70">No reels yet.</div>;
  }

  return (
    <div className="h-[100dvh] w-full snap-y snap-mandatory overflow-y-scroll no-scrollbar bg-black pb-[calc(4rem+env(safe-area-inset-bottom))] md:pb-0">
      {posts.map((post) => (
        <Reel key={post.id} post={post} />
      ))}
    </div>
  );
}

function Reel({ post }: { post: any }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [liked, setLiked] = useState(post.liked);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            videoRef.current?.play();
            setIsPlaying(true);
          } else {
            videoRef.current?.pause();
            setIsPlaying(false);
          }
        });
      },
      { threshold: 0.6 }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="h-[100dvh] w-full snap-start relative bg-black flex items-center justify-center overflow-hidden">
      <video
        ref={videoRef}
        src={post.videoUrl}
        loop
        muted
        playsInline
        onClick={togglePlay}
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      {/* Dark gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80 pointer-events-none" />

      {/* Right Actions Bar */}
      <div className="absolute right-4 bottom-24 md:bottom-12 flex flex-col gap-6 items-center z-10">
        <Link href={`/vendors/${post.author.id}`} className="relative mb-2">
          <Avatar className="h-12 w-12 border-2 border-white">
            <AvatarImage src={post.author.avatarUrl} />
            <AvatarFallback>{post.author.name[0]}</AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-2 -right-2 bg-primary rounded-full p-0.5 border-2 border-black">
            <Store className="h-3 w-3 text-white" />
          </div>
        </Link>

        <button onClick={() => setLiked(!liked)} className="flex flex-col items-center gap-1 group">
          <div className="h-12 w-12 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center group-hover:bg-black/60 transition-colors">
            <Heart className={cn("h-6 w-6 transition-all duration-300", liked ? "fill-red-500 text-red-500 scale-110" : "text-white")} />
          </div>
          <span className="text-white text-xs font-medium drop-shadow-md">{post.likeCount + (liked && !post.liked ? 1 : (!liked && post.liked ? -1 : 0))}</span>
        </button>

        <button className="flex flex-col items-center gap-1 group">
          <div className="h-12 w-12 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center group-hover:bg-black/60 transition-colors">
            <MessageCircle className="h-6 w-6 text-white" />
          </div>
          <span className="text-white text-xs font-medium drop-shadow-md">{post.commentCount}</span>
        </button>

        <button className="flex flex-col items-center gap-1 group">
          <div className="h-12 w-12 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center group-hover:bg-black/60 transition-colors">
            <Share2 className="h-6 w-6 text-white" />
          </div>
          <span className="text-white text-xs font-medium drop-shadow-md">{post.shareCount}</span>
        </button>

        <button className="flex flex-col items-center gap-1 mt-4">
          <MoreHorizontal className="h-6 w-6 text-white drop-shadow-md" />
        </button>
      </div>

      {/* Bottom Info */}
      <div className="absolute bottom-24 md:bottom-8 left-4 right-20 z-10 flex flex-col gap-3">
        <Link href={`/vendors/${post.author.id}`} className="flex items-center gap-2 w-fit">
          <h3 className="font-bold text-white text-lg drop-shadow-md">{post.author.name}</h3>
          {post.author.verified && <span className="text-primary text-sm">✓</span>}
        </Link>
        <p className="text-white/90 text-sm line-clamp-3 drop-shadow-md">{post.content}</p>
        
        {post.product && (
          <Link href={`/marketplace/product/${post.product.id}`} className="mt-2 flex items-center gap-3 p-2 pr-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 w-fit hover:bg-white/20 transition-colors">
            <img src={post.product.images[0]} alt={post.product.title} className="h-12 w-12 rounded-lg object-cover" />
            <div className="flex flex-col">
              <span className="text-xs font-medium text-white">{post.product.title}</span>
              <span className="text-xs text-primary font-bold">{formatBDT(post.product.price)}</span>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}

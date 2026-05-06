import { useEffect, useState, useRef, useCallback } from "react";
import { getFeedPosts } from "@/features/posts/post.api";
import { Post } from "@/types/post.types";
import { HeroSlider } from "@/components/feed/HeroSlider";
import { SpotlightBar } from "@/components/feed/SpotlightBar";
import { FeedFilters } from "@/components/feed/FeedFilters";
import { FeedPostCard } from "@/components/feed/FeedPostCard";
import { FeedSkeletonList } from "@/components/common/Loader";

export default function FeedHome() {
  const [filter, setFilter] = useState("All");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  const observerTarget = useRef<HTMLDivElement>(null);

  const fetchPosts = async (pageNum: number, currentFilter: string, reset = false) => {
    try {
      const data = await getFeedPosts(pageNum, currentFilter);
      if (data.length === 0) setHasMore(false);
      setPosts(prev => reset ? data : [...prev, ...data]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    setPage(1);
    setHasMore(true);
    fetchPosts(1, filter, true);
  }, [filter]);

  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (target.isIntersecting && !loading && hasMore) {
      setPage(p => {
        const next = p + 1;
        fetchPosts(next, filter, false);
        return next;
      });
    }
  }, [loading, hasMore, filter]);

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, { threshold: 1.0 });
    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => observer.disconnect();
  }, [handleObserver]);

  return (
    <div className="flex flex-col px-4 pt-4 pb-8 min-h-screen">
      <HeroSlider />
      <SpotlightBar />
      <FeedFilters active={filter} onChange={setFilter} />
      
      <div className="mt-4 flex flex-col gap-4">
        {posts.map((post) => (
          <FeedPostCard key={post.id} post={post} />
        ))}
      </div>
      
      {loading && <div className="py-4"><FeedSkeletonList count={2} /></div>}
      
      <div ref={observerTarget} className="h-10 w-full" />
    </div>
  );
}

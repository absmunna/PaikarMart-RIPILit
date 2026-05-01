import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { getFeedPosts } from "@/features/posts/post.api";
import { Post } from "@/types/post.types";
import { FeedPostCard } from "@/components/feed/FeedPostCard";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/common/Avatar";
import Loader from "@/components/common/Loader";

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFeedPosts(1, "All").then(data => {
      setPost(data.find(p => p.id === id) || data[0]);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <Loader full />;
  if (!post) return <div className="p-8 text-center">Post not found</div>;

  return (
    <div className="min-h-screen pb-24">
      <div className="sticky top-16 z-30 flex items-center gap-3 p-4 bg-[rgba(var(--bg)/0.8)] backdrop-blur-md border-b border-[rgba(var(--glass-stroke)/0.1)]">
        <button onClick={() => navigate(-1)} className="h-9 w-9 flex items-center justify-center rounded-full glass hover:bg-[rgba(var(--glass-tint)/0.2)]">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-bold text-[rgb(var(--text))]">Post</h1>
      </div>

      <div className="pt-2 px-4">
        <FeedPostCard post={post} />

        <div className="mt-6 mb-4">
          <h2 className="font-bold text-[rgb(var(--text))] flex items-center gap-2">
            <MessageCircle className="h-5 w-5" /> Comments ({post.comments})
          </h2>
        </div>

        <div className="space-y-4 mb-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex gap-3">
              <Avatar fallback={`U${i}`} size="sm" />
              <div className="flex-1 glass-card p-3 !rounded-tl-sm">
                <p className="font-semibold text-sm text-[rgb(var(--text))]">User {i}</p>
                <p className="text-sm text-[rgb(var(--text-muted))] mt-1">This is a mock comment for the post. Looks great!</p>
                <div className="flex gap-3 mt-2 text-xs text-[rgb(var(--text-subtle))]">
                  <button className="hover:text-[rgb(var(--text))]">Like</button>
                  <button className="hover:text-[rgb(var(--text))]">Reply</button>
                  <span>2h</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Spacer so list isn't covered by sticky composer */}
      <div className="h-24" />

      <div className="fixed bottom-[calc(env(safe-area-inset-bottom)+96px)] left-0 right-0 z-50 pointer-events-none px-3">
        <div
          className="mx-auto max-w-[456px] lg:max-w-[496px] p-2 rounded-full border border-[rgb(var(--border))] backdrop-blur-2xl pointer-events-auto flex gap-2 items-center shadow-[0_12px_40px_-12px_rgba(15,23,42,0.22),0_2px_6px_rgba(15,23,42,0.06)]"
          style={{ background: "rgba(var(--bg-elevated) / 0.98)" }}
        >
          <Input placeholder="Write a comment..." className="flex-1 border-none bg-transparent shadow-none focus:ring-0" />
          <Button variant="primary" className="rounded-full press">Post</Button>
        </div>
      </div>
    </div>
  );
}

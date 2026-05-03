import { useListStories, getListStoriesQueryKey } from "@workspace/api-client-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { GlassCard } from "@/components/ui/GlassCard";
import { Link } from "wouter";

export function StoryBar() {
  const { data: stories = [], isLoading } = useListStories({ query: { queryKey: getListStoriesQueryKey() } });

  if (isLoading) {
    return (
      <GlassCard className="p-3">
        <div className="flex overflow-x-auto gap-4 no-scrollbar">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2 shrink-0">
              <div className="h-16 w-16 rounded-full skeleton-shimmer" />
              <div className="h-3 w-12 rounded skeleton-shimmer" />
            </div>
          ))}
        </div>
      </GlassCard>
    );
  }

  if (!Array.isArray(stories) || stories.length === 0) return null;

  return (
    <GlassCard className="p-3">
      <div className="flex overflow-x-auto gap-4 no-scrollbar snap-x snap-mandatory">
        {(Array.isArray(stories) ? stories : []).map((story) => {
        const author = story.author ?? { id: "", name: "?", avatarUrl: undefined };
        return (
          <Link
            key={story.id}
            href={author.id ? `/vendors/${author.id}` : "#"}
            className="flex flex-col items-center gap-2 shrink-0 group snap-start"
          >
            <div className="rounded-full p-[2px] bg-gradient-to-tr from-blue-500 via-primary to-purple-500 transition-transform duration-300 group-hover:scale-105 group-active:scale-95">
              <Avatar className="h-14 w-14 border-2 border-[#0f172a]">
                <AvatarImage src={author.avatarUrl} className="object-cover" />
                <AvatarFallback>{author.name?.[0] ?? "?"}</AvatarFallback>
              </Avatar>
            </div>
            <span className="text-xs text-white/80 w-16 truncate text-center">{author.name}</span>
          </Link>
        );
        })}
      </div>
    </GlassCard>
  );
}

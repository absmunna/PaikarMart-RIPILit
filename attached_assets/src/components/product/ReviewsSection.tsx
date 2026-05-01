import { useState } from "react";
import { Star, MessageCircle, ThumbsUp } from "lucide-react";
import { Avatar } from "@/components/common/Avatar";

interface Review {
  id: string;
  user: string;
  rating: number;
  text: string;
  helpful: number;
  date: string;
  isQA?: boolean;
  reply?: string;
}

const MOCK_REVIEWS: Review[] = [
  {
    id: "r1",
    user: "Nadia A.",
    rating: 5,
    text: "Excellent build quality and the embroidery is gorgeous. Fits true to size, ordered M and it's perfect.",
    helpful: 24,
    date: "3 days ago",
  },
  {
    id: "r2",
    user: "Imran K.",
    rating: 4,
    text: "Good fabric for the price. Stitching could be a bit tighter near the cuffs but overall happy.",
    helpful: 11,
    date: "1 week ago",
  },
  {
    id: "qa1",
    user: "Sabbir H.",
    rating: 0,
    text: "Is this color fast after washing?",
    helpful: 6,
    date: "2 weeks ago",
    isQA: true,
    reply:
      "Yes — we recommend cold wash for the first 2 cycles. Color stays true after that.",
  },
];

export function ReviewsSection({
  productRating,
  reviewCount,
}: {
  productRating: number;
  reviewCount: number;
}) {
  const [tab, setTab] = useState<"all" | "reviews" | "qa">("all");

  const filtered =
    tab === "reviews"
      ? MOCK_REVIEWS.filter((r) => !r.isQA)
      : tab === "qa"
        ? MOCK_REVIEWS.filter((r) => r.isQA)
        : MOCK_REVIEWS;

  const distribution = [5, 4, 3, 2, 1].map((stars) => {
    const sample =
      stars === 5 ? 0.62 : stars === 4 ? 0.24 : stars === 3 ? 0.08 : stars === 2 ? 0.04 : 0.02;
    return { stars, pct: Math.round(sample * 100) };
  });

  return (
    <div className="mb-6">
      <h3 className="font-bold text-[rgb(var(--text))] mb-3">Reviews & Q&amp;A</h3>

      <div className="glass-card p-4 mb-3">
        <div className="flex items-center gap-5">
          <div className="text-center">
            <div className="text-3xl font-extrabold text-[rgb(var(--text))]">
              {productRating.toFixed(1)}
            </div>
            <div className="flex justify-center gap-0.5 mt-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`h-3.5 w-3.5 ${
                    s <= Math.round(productRating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-[rgb(var(--text-subtle))]"
                  }`}
                />
              ))}
            </div>
            <div className="text-[10px] text-[rgb(var(--text-muted))] mt-1">
              {reviewCount} reviews
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-1">
            {distribution.map((d) => (
              <div key={d.stars} className="flex items-center gap-2 text-xs">
                <span className="w-3 text-[rgb(var(--text-muted))]">
                  {d.stars}
                </span>
                <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                <div className="flex-1 h-1.5 rounded-full bg-[rgba(var(--glass-tint)/0.15)] overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 rounded-full"
                    style={{ width: `${d.pct}%` }}
                  />
                </div>
                <span className="w-8 text-right text-[rgb(var(--text-muted))]">
                  {d.pct}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-2 mb-3">
        {(["all", "reviews", "qa"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
              tab === t
                ? "bg-[rgb(var(--primary))] text-[rgb(var(--primary-foreground))]"
                : "bg-[rgba(var(--glass-tint)/0.1)] text-[rgb(var(--text-muted))] hover:text-[rgb(var(--text))]"
            }`}
          >
            {t === "all" ? "All" : t === "reviews" ? "Reviews" : "Q&A"}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {filtered.map((r) => (
          <div key={r.id} className="glass-card p-3">
            <div className="flex items-start gap-3">
              <Avatar fallback={r.user[0]} size="sm" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold text-sm text-[rgb(var(--text))]">
                    {r.user}
                  </p>
                  <span className="text-[10px] text-[rgb(var(--text-subtle))]">
                    {r.date}
                  </span>
                </div>
                {r.isQA ? (
                  <div className="text-[10px] font-bold uppercase tracking-wider text-blue-500 mt-0.5">
                    Question
                  </div>
                ) : (
                  <div className="flex gap-0.5 mt-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`h-3 w-3 ${
                          s <= r.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-[rgb(var(--text-subtle))]"
                        }`}
                      />
                    ))}
                  </div>
                )}
                <p className="text-sm text-[rgb(var(--text))] mt-1.5 leading-relaxed">
                  {r.text}
                </p>
                {r.reply && (
                  <div className="mt-2 pl-3 border-l-2 border-[rgb(var(--primary))/0.5]">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[rgb(var(--primary))]">
                      Seller reply
                    </p>
                    <p className="text-sm text-[rgb(var(--text-muted))] mt-1">
                      {r.reply}
                    </p>
                  </div>
                )}
                <div className="flex items-center gap-4 mt-2 text-xs text-[rgb(var(--text-muted))]">
                  <button className="flex items-center gap-1 hover:text-[rgb(var(--text))]">
                    <ThumbsUp className="h-3 w-3" /> {r.helpful}
                  </button>
                  <button className="flex items-center gap-1 hover:text-[rgb(var(--text))]">
                    <MessageCircle className="h-3 w-3" /> Reply
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

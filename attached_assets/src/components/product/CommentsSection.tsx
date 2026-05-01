import { useEffect, useState } from "react";
import { MessageCircle, Star, Send, Reply, CheckCircle } from "lucide-react";
import { Comment, CommentType } from "@/types/comment.types";
import { getCommentsByTarget, addComment } from "@/features/comments/comment.api";
import { useAuth } from "@/features/auth/auth.context";
import { Avatar } from "@/components/common/Avatar";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { formatPrice } from "@/utils/formatPrice";

interface CommentsSectionProps {
  targetType: "product" | "seller" | "post";
  targetId: string;
  productId?: string; // For checking if user can review
}

export function CommentsSection({ targetType, targetId, productId }: CommentsSectionProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [commentType, setCommentType] = useState<CommentType>("qa");
  const [rating, setRating] = useState(5);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadComments();
  }, [targetType, targetId]);

  const loadComments = async () => {
    try {
      const data = await getCommentsByTarget(targetType, targetId);
      setComments(data);
    } catch (error) {
      console.error("Failed to load comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!user || !newComment.trim() || submitting) return;

    setSubmitting(true);
    try {
      const commentData = {
        authorId: user.id,
        targetId,
        targetType,
        type: commentType,
        text: newComment.trim(),
        ...(commentType === "review" && { rating }),
      };

      await addComment(commentData);
      setNewComment("");
      setRating(5);
      await loadComments();
    } catch (error) {
      console.error("Failed to add comment:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitReply = async (parentId: string) => {
    if (!user || !replyText.trim() || submitting) return;

    setSubmitting(true);
    try {
      await addComment({
        authorId: user.id,
        targetId,
        targetType,
        parentId,
        type: "qa",
        text: replyText.trim(),
      });
      setReplyingTo(null);
      setReplyText("");
      await loadComments();
    } catch (error) {
      console.error("Failed to add reply:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const canReview = () => {
    if (!user || !productId) return false;
    // This would need to check if user ordered this product
    // For now, allow reviews for demo
    return true;
  };

  const qaComments = comments.filter(c => c.type === "qa" && !c.parentId);
  const reviewComments = comments.filter(c => c.type === "review");

  const renderComment = (comment: Comment, isReply = false) => {
    const replies = comments.filter(c => c.parentId === comment.id);
    const isSellerReply = comment.isSellerReply;

    return (
      <div key={comment.id} className={`${isReply ? "ml-8 mt-3" : "mb-6"}`}>
        <div className="flex gap-3">
          <Avatar
            src=""
            fallback={comment.authorId === user?.id ? "You" : "U"}
            size="sm"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-sm text-[rgb(var(--text))]">
                {comment.authorId === user?.id ? "You" : "Anonymous"}
              </span>
              {isSellerReply && (
                <Badge variant="primary" className="text-xs">Seller</Badge>
              )}
              {comment.verifiedBuyer && (
                <Badge variant="success" className="text-xs flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" /> Verified Buyer
                </Badge>
              )}
              <span className="text-xs text-[rgb(var(--text-muted))]">
                {new Date(comment.createdAt).toLocaleDateString()}
              </span>
            </div>

            {comment.type === "review" && comment.rating && (
              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < comment.rating!
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            )}

            <p className="text-sm text-[rgb(var(--text))] mb-2">{comment.text}</p>

            {comment.imageUrl && (
              <img
                src={comment.imageUrl}
                alt="Review image"
                className="w-20 h-20 rounded-lg object-cover mb-2"
              />
            )}

            {!isReply && !isSellerReply && user && (
              <button
                onClick={() => setReplyingTo(comment.id)}
                className="text-xs text-[rgb(var(--text-muted))] hover:text-[rgb(var(--primary))] flex items-center gap-1"
              >
                <Reply className="h-3 w-3" /> Reply
              </button>
            )}
          </div>
        </div>

        {replies.map(reply => renderComment(reply, true))}

        {replyingTo === comment.id && (
          <div className="mt-3 ml-11">
            <div className="flex gap-2">
              <Input
                placeholder="Write a reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="flex-1 text-sm"
                onKeyPress={(e) => e.key === "Enter" && handleSubmitReply(comment.id)}
              />
              <Button
                size="sm"
                onClick={() => handleSubmitReply(comment.id)}
                disabled={!replyText.trim() || submitting}
              >
                <Send className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setReplyingTo(null);
                  setReplyText("");
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return <div className="py-8 text-center text-[rgb(var(--text-muted))]">Loading comments...</div>;
  }

  return (
    <div className="border-t border-[rgba(var(--glass-stroke)/0.1)] pt-6">
      <h3 className="font-bold text-[rgb(var(--text))] mb-4 flex items-center gap-2">
        <MessageCircle className="h-5 w-5" />
        Questions & Reviews
      </h3>

      {/* Comment Form */}
      {user && (
        <div className="mb-6 p-4 glass-card">
          <div className="flex gap-3 mb-3">
            <button
              onClick={() => setCommentType("qa")}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                commentType === "qa"
                  ? "bg-[rgb(var(--primary))] text-white"
                  : "bg-[rgba(var(--glass-tint)/0.2)] text-[rgb(var(--text))]"
              }`}
            >
              Ask Question
            </button>
            <button
              onClick={() => setCommentType("review")}
              disabled={!canReview()}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                commentType === "review"
                  ? "bg-[rgb(var(--primary))] text-white"
                  : "bg-[rgba(var(--glass-tint)/0.2)] text-[rgb(var(--text))]"
              } ${!canReview() ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              Write Review
            </button>
          </div>

          {commentType === "review" && (
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-medium text-[rgb(var(--text))]">Rating:</span>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setRating(i + 1)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-5 w-5 ${
                        i < rating
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Input
              placeholder={
                commentType === "qa"
                  ? "Ask a question about this product..."
                  : "Share your experience with this product..."
              }
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1"
              onKeyPress={(e) => e.key === "Enter" && handleSubmitComment()}
            />
            <Button
              onClick={handleSubmitComment}
              disabled={!newComment.trim() || submitting}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Reviews Summary */}
      {reviewComments.length > 0 && (
        <div className="mb-6 p-4 glass-card">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-[rgb(var(--text))]">Customer Reviews</h4>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="font-bold text-[rgb(var(--text))]">
                  {(reviewComments.reduce((sum, r) => sum + (r.rating || 0), 0) / reviewComments.length).toFixed(1)}
                </span>
              </div>
              <span className="text-sm text-[rgb(var(--text-muted))]">
                ({reviewComments.length} reviews)
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Comments */}
      <div className="space-y-4">
        {qaComments.length === 0 && reviewComments.length === 0 ? (
          <div className="text-center py-8 text-[rgb(var(--text-muted))]">
            No questions or reviews yet. Be the first to ask or review!
          </div>
        ) : (
          <>
            {reviewComments.map(comment => renderComment(comment))}
            {qaComments.map(comment => renderComment(comment))}
          </>
        )}
      </div>
    </div>
  );
}
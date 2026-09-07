"use client";

import { useState, useTransition } from "react";
import {
  MessageSquare,
  ThumbsUp,
  Reply,
  Send,
  Check,
  Loader2,
  Trash2,
  Share2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Clock,
  TrendingUp,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { formatRelativeTime } from "@/lib/utils";
import {
  postCommentAction,
  likeCommentAction,
  deleteCommentAction,
  CommentItem,
} from "@/lib/actions/comment.actions";

interface CommentsSectionProps {
  articleId: number;
  articleSlug: string;
  categorySlug: string;
  initialComments: CommentItem[];
}

type SortOption = "newest" | "popular" | "oldest";

const AVATAR_GRADIENTS = [
  "linear-gradient(135deg, #2D7FF9 0%, #165bb8 100%)",
  "linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)",
  "linear-gradient(135deg, #10b981 0%, #059669 100%)",
  "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
  "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
  "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
];

function getAvatarGradient(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_GRADIENTS.length;
  return AVATAR_GRADIENTS[index];
}

function getInitials(name: string): string {
  if (!name) return "U";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export function CommentsSection({
  articleId,
  articleSlug,
  categorySlug,
  initialComments,
}: CommentsSectionProps) {
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;

  const [commentsList, setCommentsList] = useState<CommentItem[]>(initialComments);
  const [newCommentText, setNewCommentText] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");

  const [activeReplyId, setActiveReplyId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");

  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [expandedThreads, setExpandedThreads] = useState<Set<number>>(new Set());

  const [isPending, startTransition] = useTransition();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [likedCommentIds, setLikedCommentIds] = useState<Set<number>>(new Set());
  const [copiedCommentId, setCopiedCommentId] = useState<number | null>(null);

  const articlePath = `/${categorySlug}/${articleSlug}`;
  const MAX_CHAR_LIMIT = 1000;

  const toggleThreadExpand = (commentId: number) => {
    setExpandedThreads((prev) => {
      const next = new Set(prev);
      if (next.has(commentId)) {
        next.delete(commentId);
      } else {
        next.add(commentId);
      }
      return next;
    });
  };

  const handlePostRootComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    setErrorMessage(null);
    setSuccessMessage(null);

    startTransition(async () => {
      const res = await postCommentAction({
        articleId,
        content: newCommentText.trim(),
        guestName: guestName.trim() || undefined,
        guestEmail: guestEmail.trim() || undefined,
        path: articlePath,
      });

      if (res.success && res.comment) {
        setCommentsList((prev) => [res.comment as CommentItem, ...prev]);
        setNewCommentText("");
        setSuccessMessage("Comment published successfully!");
        setTimeout(() => setSuccessMessage(null), 4000);
      } else {
        setErrorMessage(res.error || "Failed to submit comment.");
      }
    });
  };

  const handlePostReply = async (parentId: number) => {
    if (!replyText.trim()) return;

    setErrorMessage(null);

    startTransition(async () => {
      const res = await postCommentAction({
        articleId,
        parentId,
        content: replyText.trim(),
        guestName: guestName.trim() || undefined,
        guestEmail: guestEmail.trim() || undefined,
        path: articlePath,
      });

      if (res.success && res.comment) {
        const newReply = res.comment as CommentItem;
        setCommentsList((prev) =>
          prev.map((c) => {
            if (c.id === parentId) {
              return {
                ...c,
                replies: [...(c.replies || []), newReply],
              };
            }
            return c;
          })
        );
        // Automatically expand replies thread for this comment
        setExpandedThreads((prev) => new Set(prev).add(parentId));
        setReplyText("");
        setActiveReplyId(null);
        setSuccessMessage("Reply published successfully!");
        setTimeout(() => setSuccessMessage(null), 4000);
      } else {
        setErrorMessage(res.error || "Failed to post reply.");
      }
    });
  };

  const handleLike = async (commentId: number) => {
    if (likedCommentIds.has(commentId)) return;

    setLikedCommentIds((prev) => new Set(prev).add(commentId));

    // Optimistic update
    setCommentsList((prev) =>
      prev.map((c) => {
        if (c.id === commentId) {
          return { ...c, likes: c.likes + 1 };
        }
        if (c.replies) {
          return {
            ...c,
            replies: c.replies.map((r) =>
              r.id === commentId ? { ...r, likes: r.likes + 1 } : r
            ),
          };
        }
        return c;
      })
    );

    await likeCommentAction(commentId);
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    setCommentsList((prev) =>
      prev
        .filter((c) => c.id !== commentId)
        .map((c) => ({
          ...c,
          replies: c.replies ? c.replies.filter((r) => r.id !== commentId) : [],
        }))
    );

    const res = await deleteCommentAction(commentId, articlePath);
    if (res.success) {
      setSuccessMessage("Comment removed.");
      setTimeout(() => setSuccessMessage(null), 3000);
    } else {
      setErrorMessage(res.error || "Failed to delete comment.");
    }
  };

  const handleCopyLink = (commentId: number) => {
    const url = `${window.location.origin}${articlePath}#comment-${commentId}`;
    navigator.clipboard.writeText(url);
    setCopiedCommentId(commentId);
    setTimeout(() => setCopiedCommentId(null), 2500);
  };

  // Sorting Logic
  const sortedComments = [...commentsList].sort((a, b) => {
    if (sortBy === "popular") {
      const aTotal = a.likes + (a.replies?.length || 0);
      const bTotal = b.likes + (b.replies?.length || 0);
      return bTotal - aTotal;
    }
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    if (sortBy === "oldest") {
      return dateA - dateB;
    }
    // Default: newest first
    return dateB - dateA;
  });

  const totalCount = commentsList.reduce(
    (acc, c) => acc + 1 + (c.replies?.length || 0),
    0
  );

  return (
    <section
      className="article-comments mt-12 pt-8 border-t border-[var(--color-surface-border)]"
      aria-label="Reader Discussion"
    >
      {/* Discussion Header & Sorting Options */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#2D7FF9]/15 flex items-center justify-center border border-[#2D7FF9]/30">
            <MessageSquare className="w-5 h-5 text-[#2D7FF9]" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-[var(--color-text-primary)] leading-none">
              Reader Discussion
            </h2>
            <span className="text-xs text-muted-foreground mt-1 block">
              Join {totalCount} {totalCount === 1 ? "thought" : "thoughts"} shared by the community
            </span>
          </div>
        </div>

        {/* Filter Tabs */}
        {commentsList.length > 1 && (
          <div className="tc-comment-sort-bar self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setSortBy("newest")}
              className={`tc-comment-sort-btn ${
                sortBy === "newest" ? "tc-comment-sort-btn--active" : ""
              }`}
            >
              <Clock className="w-3 h-3 inline-block mr-1" />
              Newest
            </button>
            <button
              type="button"
              onClick={() => setSortBy("popular")}
              className={`tc-comment-sort-btn ${
                sortBy === "popular" ? "tc-comment-sort-btn--active" : ""
              }`}
            >
              <TrendingUp className="w-3 h-3 inline-block mr-1" />
              Popular
            </button>
            <button
              type="button"
              onClick={() => setSortBy("oldest")}
              className={`tc-comment-sort-btn ${
                sortBy === "oldest" ? "tc-comment-sort-btn--active" : ""
              }`}
            >
              Oldest
            </button>
          </div>
        )}
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="tc-comment-toast tc-comment-toast--success">
          <Check className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}
      {errorMessage && (
        <div className="tc-comment-toast tc-comment-toast--error">
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Form Card */}
      <div className="tc-comment-card mb-8">
        <form onSubmit={handlePostRootComment}>
          {!isLoggedIn && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-xs font-bold mb-1 text-[var(--color-text-primary)]">
                  Your Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Johnson"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-[var(--color-surface-border)] bg-[var(--color-surface-2)] text-[var(--color-text-primary)] focus:border-[#2D7FF9] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1 text-muted-foreground">
                  Email (Optional & Private)
                </label>
                <input
                  type="email"
                  placeholder="alex@example.com"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-[var(--color-surface-border)] bg-[var(--color-surface-2)] text-[var(--color-text-primary)] focus:border-[#2D7FF9] focus:outline-none"
                />
              </div>
            </div>
          )}

          {isLoggedIn && (
            <div className="flex items-center gap-2 mb-3 text-xs font-semibold">
              <div
                className="tc-comment-avatar tc-comment-avatar--sm"
                style={{ background: getAvatarGradient(session?.user?.name || "Member") }}
              >
                {getInitials(session?.user?.name || "Member")}
              </div>
              <span className="text-muted-foreground">
                Posting as{" "}
                <strong className="text-[var(--color-text-primary)]">
                  {session?.user?.name || "Member"}
                </strong>
              </span>
            </div>
          )}

          <div className="relative">
            <textarea
              rows={3}
              required
              maxLength={MAX_CHAR_LIMIT}
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              placeholder="What are your thoughts on this story? Share your perspective..."
              className="tc-comment-textarea"
            />
            <div className="flex items-center justify-between mt-2 px-1">
              <span className="tc-comment-char-count">
                {newCommentText.length} / {MAX_CHAR_LIMIT} characters
              </span>
              <button
                type="submit"
                disabled={isPending || !newCommentText.trim()}
                className="btn btn-primary text-xs sm:text-sm px-5 py-2 font-bold rounded-xl flex items-center gap-2"
              >
                {isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                {isPending ? "Publishing..." : "Post Comment"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Comment Feed */}
      {commentsList.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-2xl bg-[var(--color-surface-1)] border border-[var(--color-surface-border)]">
          <div className="w-12 h-12 rounded-full bg-[#2D7FF9]/10 text-[#2D7FF9] mx-auto mb-3 flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[var(--color-text-primary)]">
            Be the First to Comment
          </h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            No discussions started yet. Share your feedback or insights with the TechCrest community!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedComments.map((comment) => {
            const hasReplies = comment.replies && comment.replies.length > 0;
            const isExpanded = expandedThreads.has(comment.id);

            return (
              <div
                key={comment.id}
                id={`comment-${comment.id}`}
                className="tc-comment-card"
              >
                {/* Main Comment Header with Avatar */}
                <div className="flex items-start gap-3">
                  <div
                    className="tc-comment-avatar"
                    style={{ background: getAvatarGradient(comment.authorName) }}
                  >
                    {getInitials(comment.authorName)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs sm:text-sm text-[var(--color-text-primary)]">
                          {comment.authorName}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          &bull; {formatRelativeTime(comment.createdAt)}
                        </span>
                      </div>
                    </div>

                    {/* Comment Content */}
                    <p className="text-xs sm:text-sm leading-relaxed text-[var(--color-text-primary)] whitespace-pre-wrap">
                      {comment.content}
                    </p>

                    {/* Action Bar */}
                    <div className="flex items-center flex-wrap gap-2 mt-3">
                      <button
                        type="button"
                        onClick={() => handleLike(comment.id)}
                        className={`tc-comment-action-btn ${
                          likedCommentIds.has(comment.id)
                            ? "tc-comment-action-btn--liked"
                            : ""
                        }`}
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>{comment.likes > 0 ? comment.likes : "Like"}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setActiveReplyId(
                            activeReplyId === comment.id ? null : comment.id
                          );
                          setReplyText("");
                        }}
                        className="tc-comment-action-btn"
                      >
                        <Reply className="w-3.5 h-3.5" />
                        <span>Reply</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleCopyLink(comment.id)}
                        className="tc-comment-action-btn"
                        title="Copy direct link to comment"
                      >
                        {copiedCommentId === comment.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Share2 className="w-3.5 h-3.5" />
                        )}
                        <span>{copiedCommentId === comment.id ? "Copied!" : "Share"}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteComment(comment.id)}
                        className="tc-comment-action-btn tc-comment-action-btn--delete"
                        title="Delete comment"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>

                    {/* Inline Reply Input Box */}
                    {activeReplyId === comment.id && (
                      <div className="mt-3 pt-3 border-t border-[var(--color-surface-border)]">
                        <textarea
                          rows={2}
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder={`Replying to ${comment.authorName}...`}
                          className="tc-comment-textarea text-xs"
                        />
                        <div className="flex items-center justify-end gap-2 mt-2">
                          <button
                            type="button"
                            onClick={() => setActiveReplyId(null)}
                            className="tc-comment-action-btn"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            disabled={isPending || !replyText.trim()}
                            onClick={() => handlePostReply(comment.id)}
                            className="btn btn-primary text-xs font-bold px-4 py-1.5 rounded-xl flex items-center gap-1.5"
                          >
                            {isPending ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <Send className="w-3 h-3" />
                            )}
                            Reply
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Thread Collapse Toggle */}
                    {hasReplies && (
                      <button
                        type="button"
                        onClick={() => toggleThreadExpand(comment.id)}
                        className="tc-comment-reply-toggle"
                      >
                        {isExpanded ? (
                          <>
                            <ChevronUp className="w-3.5 h-3.5" />
                            Hide {comment.replies!.length}{" "}
                            {comment.replies!.length === 1 ? "reply" : "replies"}
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-3.5 h-3.5" />
                            Show {comment.replies!.length}{" "}
                            {comment.replies!.length === 1 ? "reply" : "replies"}
                          </>
                        )}
                      </button>
                    )}

                    {/* Nested Replies Section */}
                    {hasReplies && (isExpanded || comment.replies!.length <= 2) && (
                      <div className="tc-comment-thread">
                        {comment.replies!.map((reply) => (
                          <div
                            key={reply.id}
                            id={`comment-${reply.id}`}
                            className="flex items-start gap-2.5 pt-1"
                          >
                            <div
                              className="tc-comment-avatar tc-comment-avatar--sm"
                              style={{ background: getAvatarGradient(reply.authorName) }}
                            >
                              {getInitials(reply.authorName)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold text-xs text-[var(--color-text-primary)]">
                                  {reply.authorName}
                                </span>
                                <span className="text-[10px] text-muted-foreground">
                                  &bull; {formatRelativeTime(reply.createdAt)}
                                </span>
                              </div>
                              <p className="text-xs leading-relaxed text-[var(--color-text-primary)] whitespace-pre-wrap">
                                {reply.content}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <button
                                  type="button"
                                  onClick={() => handleLike(reply.id)}
                                  className={`tc-comment-action-btn ${
                                    likedCommentIds.has(reply.id)
                                      ? "tc-comment-action-btn--liked"
                                      : ""
                                  }`}
                                >
                                  <ThumbsUp className="w-3 h-3" />
                                  <span>
                                    {reply.likes > 0 ? reply.likes : "Like"}
                                  </span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteComment(reply.id)}
                                  className="tc-comment-action-btn tc-comment-action-btn--delete"
                                  title="Delete reply"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  <span>Delete</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

'use client';

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "../lib/supabase";
import { useLineLogin } from "../hooks/useLineLogin";
import BackButton from "./BackButton";
import { Share2, MoreHorizontal, Heart, MessageCircle, Send, ShoppingBag, ExternalLink, X } from "lucide-react";
import { toggleLike, createComment, toggleCommentLike } from "../app/actions";

interface Comment {
  id: string;
  post_id: string;
  parent_id: string | null;
  author_name: string;
  author_avatar: string;
  content: string;
  likes_count: number;
  created_at: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
  image_url: string;
  category_id: number;
  author_name: string;
  author_avatar: string;
  likes_count: number;
  created_at: string;
  categories: {
    name: string;
    emoji: string;
  } | null;
}

interface AffiliateProduct {
  id: string;
  name: string;
  image_url: string;
  affiliate_url: string;
  description: string;
}

interface ThreadInteractiveProps {
  post: Post;
  initialComments: Comment[];
  affiliateProduct: AffiliateProduct | null;
  initialHasLiked?: boolean;
  initialLikedCommentIds?: string[];
}

// Simple relative time formatter
function formatRelativeTime(dateString: string) {
  if (!dateString) return "";
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) {
    return "เมื่อครู่";
  } else if (diffMins < 60) {
    return `${diffMins} นาทีที่แล้ว`;
  } else if (diffHours < 24) {
    return `${diffHours} ชม.ที่แล้ว`;
  } else if (diffDays < 7) {
    return `${diffDays} วันที่แล้ว`;
  } else {
    return date.toLocaleDateString("th-TH", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }
}

export default function ThreadInteractive({ post, initialComments, affiliateProduct, initialHasLiked = false, initialLikedCommentIds = [] }: ThreadInteractiveProps) {
  const router = useRouter();
  const { user } = useLineLogin();
  const supabase = createClient();

  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [postLikes, setPostLikes] = useState(post.likes_count);
  const [hasLikedPost, setHasLikedPost] = useState(initialHasLiked);
  const [likedCommentIds, setLikedCommentIds] = useState<string[]>(initialLikedCommentIds);

  const [commentText, setCommentText] = useState("");
  const [replyTo, setReplyTo] = useState<{ id: string; author_name: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  // Group top-level vs nested replies
  const topLevelComments = comments.filter(c => c.parent_id === null);
  const replies = comments.filter(c => c.parent_id !== null);

  const repliesByParentId: { [key: string]: Comment[] } = {};
  replies.forEach(reply => {
    if (reply.parent_id) {
      if (!repliesByParentId[reply.parent_id]) {
        repliesByParentId[reply.parent_id] = [];
      }
      repliesByParentId[reply.parent_id].push(reply);
    }
  });

  const totalCommentsCount = comments.length;

  // Liking the Post
  const handleLikePost = async () => {
    if (!user) {
      alert("กรุณาผูกบัญชี LINE ก่อนร่วมแสดงความสนใจ");
      router.push("/welcome");
      return;
    }

    const newLikedState = !hasLikedPost;
    setHasLikedPost(newLikedState);
    setPostLikes(prev => newLikedState ? prev + 1 : Math.max(0, prev - 1));

    try {
      const res = await toggleLike(post.id);
      if (!res.success) {
        throw new Error(res.error || "เกิดข้อผิดพลาดในการถูกใจกระทู้");
      }
      if (res.liked !== undefined) {
        setHasLikedPost(res.liked);
      }
    } catch (err) {
      console.error("Failed to like post:", err);
      // rollback
      setHasLikedPost(!newLikedState);
      setPostLikes(prev => !newLikedState ? prev + 1 : Math.max(0, prev - 1));
    }
  };

  // Liking/Unliking a Comment
  const handleLikeComment = async (commentId: string, currentLikes: number) => {
    if (!user) {
      alert("กรุณาผูกบัญชี LINE ก่อนกดถูกใจคอมเมนต์");
      router.push("/welcome");
      return;
    }

    const alreadyLiked = likedCommentIds.includes(commentId);
    const newLikedState = !alreadyLiked;

    // Optimistic Update
    if (newLikedState) {
      setLikedCommentIds(prev => [...prev, commentId]);
      setComments(prev =>
        prev.map(c => (c.id === commentId ? { ...c, likes_count: c.likes_count + 1 } : c))
      );
    } else {
      setLikedCommentIds(prev => prev.filter(id => id !== commentId));
      setComments(prev =>
        prev.map(c => (c.id === commentId ? { ...c, likes_count: Math.max(0, c.likes_count - 1) } : c))
      );
    }

    try {
      const res = await toggleCommentLike(commentId);
      if (!res.success) {
        throw new Error(res.error || "เกิดข้อผิดพลาดในการสลับสถานะถูกใจคอมเมนต์");
      }
      if (res.liked !== undefined) {
        if (res.liked) {
          setLikedCommentIds(prev => prev.includes(commentId) ? prev : [...prev, commentId]);
        } else {
          setLikedCommentIds(prev => prev.filter(id => id !== commentId));
        }
      }
    } catch (err) {
      console.error("Failed to toggle comment like:", err);
      // rollback
      if (newLikedState) {
        setLikedCommentIds(prev => prev.filter(id => id !== commentId));
        setComments(prev =>
          prev.map(c => (c.id === commentId ? { ...c, likes_count: Math.max(0, c.likes_count - 1) } : c))
        );
      } else {
        setLikedCommentIds(prev => [...prev, commentId]);
        setComments(prev =>
          prev.map(c => (c.id === commentId ? { ...c, likes_count: c.likes_count + 1 } : c))
        );
      }
    }
  };

  // Reply trigger
  const handleReplyTrigger = (commentId: string, authorName: string) => {
    setReplyTo({ id: commentId, author_name: authorName });
    inputRef.current?.focus();
  };

  // Cancel reply trigger
  const handleCancelReply = () => {
    setReplyTo(null);
  };

  // Posting a Comment / Reply
  const handleSendComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!commentText.trim()) return;

    if (!user) {
      alert("กรุณาผูกบัญชี LINE ก่อนร่วมแสดงความคิดเห็น");
      router.push("/welcome");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await createComment(post.id, commentText.trim(), replyTo ? replyTo.id : null);

      if (!res.success) {
        throw new Error(res.error || "ไม่สามารถแสดงความคิดเห็นได้");
      }

      if (res.comment) {
        setComments(prev => [...prev, res.comment as Comment]);
        setCommentText("");
        setReplyTo(null);
      }
    } catch (err: any) {
      console.error("Failed to submit comment:", err);
      alert(err.message || "ไม่สามารถแสดงความคิดเห็นได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#F7F5F1] border-x border-saba-line flex flex-col pb-20 font-body relative">
      {/* Sticky Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-saba-line px-4 h-14 flex items-center justify-between shadow-sm">
        <BackButton />
        <span className="text-xs font-bold font-heading bg-saba-bg2 border border-saba-line px-3 py-1 rounded-full text-saba-black">
          {post.categories ? `${post.categories.emoji} ${post.categories.name}` : "🐾 ทั่วไป"}
        </span>
        <div className="flex items-center gap-2 text-saba-ink">
          <button className="p-1 hover:text-saba-orange transition">
            <Share2 className="w-5 h-5" />
          </button>
          <button className="p-1 hover:text-saba-orange transition">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="p-4 flex-1 space-y-4">
        {/* Post Card */}
        <div className="bg-white border border-saba-line rounded-2xl p-4 space-y-4 shadow-sm">
          {/* Author info */}
          <div className="flex items-center gap-3">
            {post.author_avatar ? (
              <img
                src={post.author_avatar}
                alt={post.author_name}
                className="w-10 h-10 rounded-full object-cover border border-saba-line"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-saba-bg2 border border-saba-line flex items-center justify-center text-base">
                🐾
              </div>
            )}
            <div>
              <h4 className="text-xs font-bold text-saba-black">{post.author_name}</h4>
              <p className="text-[9px] text-saba-muted font-cute mt-0.5">
                {formatRelativeTime(post.created_at)}
              </p>
            </div>
          </div>

          {/* Title & Body */}
          <div className="space-y-2">
            <h1 className="text-sm font-bold text-saba-black leading-snug font-heading">
              {post.title}
            </h1>
            <p className="text-xs text-saba-ink leading-relaxed whitespace-pre-wrap font-cute">
              {post.content}
            </p>
          </div>

          {/* Image */}
          {post.image_url && (
            <div className="rounded-xl overflow-hidden border border-saba-line">
              <img
                src={post.image_url}
                alt={post.title}
                className="w-full h-auto object-cover max-h-96"
              />
            </div>
          )}

          {/* Likes & Comments stats */}
          <div className="flex items-center justify-between text-[10px] text-saba-muted border-y border-saba-line py-2.5 font-cute font-semibold px-1">
            <div className="flex items-center gap-1">
              <Heart className={`w-3.5 h-3.5 ${hasLikedPost ? "text-red-500 fill-red-500" : "text-saba-muted"}`} />
              <span>ถูกใจ {postLikes} คน</span>
            </div>
            <div>
              <span>ความคิดเห็น {totalCommentsCount} รายการ</span>
            </div>
          </div>

          {/* Action Bar */}
          <div className="grid grid-cols-3 text-center text-xs font-bold text-saba-muted font-cute">
            <button
              onClick={handleLikePost}
              className={`flex items-center justify-center gap-1.5 py-1 hover:bg-black/5 rounded-lg transition ${
                hasLikedPost ? "text-red-500" : "hover:text-saba-orange"
              }`}
            >
              <Heart className={`w-4 h-4 ${hasLikedPost ? "fill-current" : ""}`} />
              <span>{hasLikedPost ? "ถูกใจแล้ว" : "ถูกใจ"}</span>
            </button>
            <button
              onClick={() => inputRef.current?.focus()}
              className="hover:text-saba-orange flex items-center justify-center gap-1.5 py-1 hover:bg-black/5 rounded-lg transition"
            >
              <MessageCircle className="w-4 h-4" />
              <span>คอมเมนต์</span>
            </button>
            <button className="hover:text-saba-orange flex items-center justify-center gap-1.5 py-1 hover:bg-black/5 rounded-lg transition">
              <Share2 className="w-4 h-4" />
              <span>แชร์</span>
            </button>
          </div>
        </div>

        {/* Affiliate card if matching */}
        {affiliateProduct && (
          <div className="bg-saba-orange/5 border border-saba-orange/20 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-sm animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-saba-orange/10 flex items-center justify-center text-saba-orange shrink-0">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] font-bold text-saba-orange uppercase tracking-wider font-cute">
                  สินค้าที่เกี่ยวข้อง (Affiliate)
                </p>
                <h4 className="text-xs font-bold text-saba-black line-clamp-1 mt-0.5 font-heading">
                  {affiliateProduct.name}
                </h4>
                {affiliateProduct.description && (
                  <p className="text-[9px] text-saba-muted line-clamp-1 font-cute mt-0.5">
                    {affiliateProduct.description}
                  </p>
                )}
              </div>
            </div>
            <a
              href={affiliateProduct.affiliate_url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-saba-orange hover:bg-orange-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shrink-0 transition flex items-center gap-1 font-cute shadow-sm shadow-orange-100"
            >
              ดูสินค้า
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}

        {/* Comments board */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-saba-black px-1 font-heading">
            ความคิดเห็น ({totalCommentsCount})
          </h3>

          {topLevelComments.length > 0 ? (
            <div className="space-y-4">
              {topLevelComments.map((comment) => {
                const commentReplies = repliesByParentId[comment.id] || [];
                const isLiked = likedCommentIds.includes(comment.id);

                return (
                  <div key={comment.id} className="space-y-3">
                    {/* Top Level Card */}
                    <div className="flex gap-2.5">
                      {comment.author_avatar ? (
                        <img
                          src={comment.author_avatar}
                          alt={comment.author_name}
                          className="w-8 h-8 rounded-full border border-saba-line object-cover shrink-0"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-saba-bg2 border border-saba-line flex items-center justify-center shrink-0 text-xs">
                          🐾
                        </div>
                      )}
                      <div className="flex-1 space-y-1">
                        <div className="bg-white rounded-2xl p-3 border border-saba-line inline-block max-w-full shadow-sm">
                          <p className="text-xs font-bold text-saba-black flex items-center gap-1.5">
                            {comment.author_name}
                            {comment.author_name === post.author_name && (
                              <span className="text-[8px] bg-saba-orange/10 text-saba-orange px-1.5 py-0.5 rounded font-bold">
                                (เจ้าของกระทู้)
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-saba-ink mt-1 leading-relaxed whitespace-pre-wrap font-cute">
                            {comment.content}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 pl-2 text-[9px] text-saba-muted font-cute font-semibold">
                          <span>{formatRelativeTime(comment.created_at)}</span>
                          <button
                            onClick={() => handleLikeComment(comment.id, comment.likes_count)}
                            className={`transition ${isLiked ? "text-red-500" : "hover:text-saba-orange"}`}
                          >
                            ถูกใจ ({comment.likes_count})
                          </button>
                          <button
                            onClick={() => handleReplyTrigger(comment.id, comment.author_name)}
                            className="hover:text-saba-orange transition"
                          >
                            ตอบกลับ
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Indented Replies */}
                    {commentReplies.length > 0 && (
                      <div className="space-y-3">
                        {commentReplies.map((reply) => {
                          const isReplyLiked = likedCommentIds.includes(reply.id);
                          return (
                            <div key={reply.id} className="flex gap-2.5 pl-10">
                              {reply.author_avatar ? (
                                <img
                                  src={reply.author_avatar}
                                  alt={reply.author_name}
                                  className="w-7 h-7 rounded-full border border-saba-line object-cover shrink-0"
                                />
                              ) : (
                                <div className="w-7 h-7 rounded-full bg-saba-bg2 border border-saba-line flex items-center justify-center shrink-0 text-[10px]">
                                  🐾
                                </div>
                              )}
                              <div className="flex-1 space-y-1">
                                <div className="bg-white rounded-2xl p-2.5 border border-saba-line inline-block max-w-full shadow-sm">
                                  <p className="text-[11px] font-bold text-saba-black flex items-center gap-1.5">
                                    {reply.author_name}
                                    {reply.author_name === post.author_name && (
                                      <span className="text-[8px] bg-saba-orange/10 text-saba-orange px-1.5 py-0.5 rounded font-bold">
                                        (เจ้าของกระทู้)
                                      </span>
                                    )}
                                  </p>
                                  <p className="text-xs text-saba-ink mt-0.5 leading-relaxed whitespace-pre-wrap font-cute">
                                    {reply.content}
                                  </p>
                                </div>
                                <div className="flex items-center gap-3 pl-2 text-[9px] text-saba-muted font-cute font-semibold">
                                  <span>{formatRelativeTime(reply.created_at)}</span>
                                  <button
                                    onClick={() => handleLikeComment(reply.id, reply.likes_count)}
                                    className={`transition ${isReplyLiked ? "text-red-500" : "hover:text-saba-orange"}`}
                                  >
                                    ถูกใจ ({reply.likes_count})
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 border border-dashed border-saba-line rounded-2xl bg-white/50">
              <p className="text-xs text-saba-muted font-cute">ยังไม่มีความคิดเห็น มาร่วมเป็นคนแรกกัน!</p>
            </div>
          )}
        </div>
      </main>

      {/* Sticky Bottom input bar (Active Client Form!) */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-saba-line z-40 shadow-lg flex flex-col transition-all">
        {/* Reply Indicator if active */}
        {replyTo && (
          <div className="px-4 py-1.5 bg-saba-bg2 border-b border-saba-line flex items-center justify-between text-[10px] font-bold font-cute text-saba-orange animate-fade-in">
            <span>กำลังตอบกลับคุณ "{replyTo.author_name}" ...</span>
            <button onClick={handleCancelReply} className="text-saba-muted hover:text-saba-black">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <form onSubmit={handleSendComment} className="h-16 px-4 flex items-center gap-3 w-full bg-white">
          <div className="flex-1 bg-saba-bg2 rounded-full border border-saba-line px-4 h-10 flex items-center justify-between">
            <input
              type="text"
              ref={inputRef}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              disabled={isSubmitting}
              placeholder={user ? (replyTo ? "พิมพ์คำตอบกลับ..." : "เขียนความคิดเห็น...") : "กรุณาผูกบัญชี LINE ก่อนแสดงความเห็น"}
              className="w-full bg-transparent text-xs font-cute text-saba-black placeholder:text-saba-muted focus:outline-none disabled:opacity-75"
            />
            <button
              type="submit"
              disabled={isSubmitting || !commentText.trim()}
              className="text-saba-orange hover:text-orange-600 disabled:text-saba-muted transition shrink-0 ml-1"
              aria-label="ส่งคอมเมนต์"
            >
              <Send className="w-4 h-4 fill-current" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

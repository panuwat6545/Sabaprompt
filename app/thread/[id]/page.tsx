import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "../../../lib/supabase";
import ThreadInteractive, { Comment, Post, AffiliateProduct } from "../../../components/ThreadInteractive";
import { getSession } from "../../../lib/session";
import { createAdminClient } from "../../../lib/supabase-admin";

export const revalidate = 0; // Fetch fresh data on every request

interface ThreadPageProps {
  params: Promise<{
    id: string;
  }>;
}

// SEO metadata generation for dynamic Facebook/social sharing
export async function generateMetadata({ params }: ThreadPageProps): Promise<Metadata> {
  const { id } = await params;
  const supabase = createClient();
  const { data: post } = await supabase
    .from("posts")
    .select("title, content, image_url")
    .eq("id", id)
    .single();

  if (!post) {
    return {
      title: "ไม่พบกระทู้ - SABALAND",
    };
  }

  return {
    title: `${post.title} - SABALAND 🐾`,
    description: post.content.substring(0, 100) + "...",
    openGraph: {
      title: post.title,
      description: post.content.substring(0, 100) + "...",
      images: post.image_url ? [{ url: post.image_url }] : [],
      type: "article",
    },
  };
}

export default async function ThreadPage({ params }: ThreadPageProps) {
  const { id } = await params;
  const supabase = createClient();

  // 1. Fetch single post with category relation
  const { data: post, error: postErr } = await supabase
    .from("posts")
    .select("*, categories(name, emoji)")
    .eq("id", id)
    .single();

  if (postErr || !post) {
    return notFound();
  }

  // 2. Fetch comments
  const { data: commentsRes } = await supabase
    .from("comments")
    .select("*")
    .eq("post_id", id)
    .order("created_at", { ascending: true });

  const allComments = commentsRes || [];

  // 3. Fetch related affiliate product matching the post category
  let affiliateProduct = null;
  if (post.category_id) {
    const { data: affiliates } = await supabase
      .from("affiliate_products")
      .select("*")
      .eq("category_id", post.category_id)
      .limit(1);
    affiliateProduct = affiliates?.[0] || null;
  }

  // 4. Fetch initial like state for the current logged-in user
  const session = await getSession();
  let initialHasLiked = false;
  let initialLikedCommentIds: string[] = [];

  if (session) {
    const adminSupabase = createAdminClient();
    
    // Fetch post like record
    const { data: likeRecord } = await adminSupabase
      .from("post_likes")
      .select("*")
      .eq("post_id", id)
      .eq("line_user_id", session.line_user_id)
      .maybeSingle();
    initialHasLiked = !!likeRecord;

    // Fetch comment like records for comments of this post
    if (allComments.length > 0) {
      const { data: likedCommentsData } = await adminSupabase
        .from("comment_likes")
        .select("comment_id")
        .eq("line_user_id", session.line_user_id)
        .in("comment_id", allComments.map(c => c.id));
      
      if (likedCommentsData) {
        initialLikedCommentIds = likedCommentsData.map(l => l.comment_id);
      }
    }
  }

  return (
    <ThreadInteractive
      post={post as unknown as Post}
      initialComments={allComments as unknown as Comment[]}
      affiliateProduct={affiliateProduct as unknown as AffiliateProduct | null}
      initialHasLiked={initialHasLiked}
      initialLikedCommentIds={initialLikedCommentIds}
    />
  );
}

import React from "react";
import { createClient } from "../lib/supabase";
import HomeFeedClient, { Post, Category } from "../components/HomeFeedClient";

export const revalidate = 0; // Fetch fresh data on every request

export default async function Home() {
  const supabase = createClient();

  // Fetch posts and categories in parallel
  const [postsRes, categoriesRes] = await Promise.all([
    supabase
      .from("posts")
      .select(`
        id,
        title,
        image_url,
        category_id,
        author_name,
        author_avatar,
        likes_count,
        categories (
          name,
          emoji
        )
      `)
      .order("created_at", { ascending: false }),
    supabase
      .from("categories")
      .select("id, name, emoji")
      .order("id", { ascending: true })
  ]);

  if (postsRes.error) {
    console.error("Error fetching posts:", postsRes.error);
  }
  if (categoriesRes.error) {
    console.error("Error fetching categories:", categoriesRes.error);
  }

  const posts = postsRes.data || [];
  const categories = categoriesRes.data || [];

  return (
    <HomeFeedClient initialPosts={posts as unknown as Post[]} categories={categories as unknown as Category[]} />
  );
}

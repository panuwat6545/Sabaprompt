import { NextResponse } from "next/server";
import { createClient } from "../../../../lib/supabase";

export const revalidate = 0; // Dynamic route handler

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim() || "";

    if (!q || q.length < 1) {
      return NextResponse.json({ suggestions: [] });
    }

    const supabase = createClient();

    // Query matching posts using regular anon client (public read policy active)
    const { data: posts, error } = await supabase
      .from("posts")
      .select(`
        id,
        title,
        image_url,
        categories (
          name,
          emoji
        )
      `)
      .or(`title.ilike.%${q}%,content.ilike.%${q}%`)
      .order("created_at", { ascending: false })
      .limit(8);

    if (error) {
      console.error("Error fetching suggest posts:", error);
      return NextResponse.json({ suggestions: [] });
    }

    const suggestions = (posts || []).map((post: any) => ({
      id: post.id,
      title: post.title,
      image_url: post.image_url,
      category_name: post.categories?.name || "",
      category_emoji: post.categories?.emoji || ""
    }));

    return NextResponse.json({ suggestions });
  } catch (err) {
    console.error("suggest route error:", err);
    return NextResponse.json({ suggestions: [] });
  }
}

import React from "react";
import Link from "next/link";
import { createClient } from "../../lib/supabase";
import BackButton from "../../components/BackButton";
import SearchBar from "../../components/SearchBar";
import BottomNav from "../../components/BottomNav";
import { Package } from "lucide-react";

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
  }>;
}

export const revalidate = 0; // Fetch fresh search results on demand

interface SearchPost {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  likes_count: number;
  author_name: string;
  author_avatar: string;
  created_at: string;
  categories: {
    name: string;
    emoji: string;
  } | null;
  comments?: { count: number }[];
}

interface AffiliateProduct {
  id: string;
  name: string;
  affiliate_url: string;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const queryStr = q?.trim() || "";

  let posts: SearchPost[] = [];
  let affiliateProduct: AffiliateProduct | null = null;

  if (queryStr) {
    const supabase = createClient();

    // Run searches in parallel
    const [postsRes, affRes] = await Promise.all([
      supabase
        .from("posts")
        .select(`
          id,
          title,
          content,
          image_url,
          likes_count,
          author_name,
          author_avatar,
          created_at,
          categories (
            name,
            emoji
          ),
          comments (
            count
          )
        `)
        .or(`title.ilike.%${queryStr}%,content.ilike.%${queryStr}%`)
        .order("created_at", { ascending: false })
        .limit(30),

      // Separate query for affiliate products
      (async () => {
        try {
          const { data, error } = await supabase
            .from("affiliate_products")
            .select("*")
            .or(`name.ilike.%${queryStr}%,tags.cs.{${queryStr}}`)
            .limit(1)
            .maybeSingle();

          if (!error && data) return data;
        } catch (e) {
          console.warn("Array search tags.cs query failed, falling back to name check:", e);
        }

        // Fallback: search by name only
        const { data: fallbackData } = await supabase
          .from("affiliate_products")
          .select("*")
          .ilike("name", `%${queryStr}%`)
          .limit(1)
          .maybeSingle();
        return fallbackData || null;
      })()
    ]);

    if (postsRes.error) {
      console.error("Error searching posts:", postsRes.error);
    } else {
      posts = (postsRes.data as unknown as SearchPost[]) || [];
    }

    affiliateProduct = affRes as unknown as AffiliateProduct | null;
  }

  // Extract unique hashtags using regex: /#[\u0E00-\u0E7Fa-zA-Z0-9_]+/g
  const hashtagsSet = new Set<string>();
  const hashtagRegex = /#[\u0E00-\u0E7Fa-zA-Z0-9_]+/g;

  if (posts.length > 0) {
    for (const post of posts) {
      if (post.content) {
        const matches = post.content.match(hashtagRegex);
        if (matches) {
          for (const match of matches) {
            hashtagsSet.add(match);
            if (hashtagsSet.size >= 5) break;
          }
        }
      }
      if (hashtagsSet.size >= 5) break;
    }
  }
  const relatedHashtags = Array.from(hashtagsSet);

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#F7F5F1] border-x border-saba-line flex flex-col pb-24 font-body relative">
      {/* Search Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-saba-line flex items-center gap-2.5 px-3 h-14 shadow-sm shrink-0">
        <BackButton />
        <SearchBar initialQuery={queryStr} alwaysVisible={true} />
      </header>

      {/* Main Container */}
      <main className="p-4 flex-1 space-y-5 flex flex-col">
        {!queryStr ? (
          /* Empty Initial State */
          <div className="text-center py-20 space-y-3 flex-1 flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-saba-bg2 border border-saba-line flex items-center justify-center text-2xl animate-bounce">
              🔍
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-saba-black font-heading">พิมพ์คำค้นหาเพื่อเริ่มต้น</h3>
              <p className="text-xs text-saba-muted font-cute">ค้นหากระทู้ ความรู้เรื่องสัตว์เลี้ยง หรือสินค้าแนะนำได้ทันที</p>
            </div>
          </div>
        ) : (
          /* Search Results Section */
          <div className="space-y-5 flex-1 flex flex-col">
            {/* Related Hashtags */}
            {relatedHashtags.length > 0 && (
              <div className="space-y-2 animate-fade-in shrink-0">
                <p className="text-[11px] font-bold text-saba-muted font-cute">แฮชแท็กที่เกี่ยวข้อง</p>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {relatedHashtags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/search?q=${encodeURIComponent(tag)}`}
                      replace
                      className="text-[10px] font-bold text-saba-orange bg-saba-orange/5 hover:bg-saba-orange/10 border border-saba-orange/15 px-3 py-1.5 rounded-full font-cute transition"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Affiliate Card */}
            {affiliateProduct && (
              <div className="bg-saba-orange/5 border border-saba-orange/20 rounded-2xl p-3 flex items-center justify-between gap-3 shadow-sm animate-fade-in shrink-0">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-saba-orange/10 flex items-center justify-center text-saba-orange shrink-0">
                    <Package className="w-5 h-5 animate-pulse" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[9px] text-saba-orange font-bold font-cute uppercase tracking-wide">สินค้าที่เกี่ยวข้อง (Affiliate)</p>
                    <h4 className="text-xs font-bold text-saba-black truncate font-heading mt-0.5">{affiliateProduct.name}</h4>
                  </div>
                </div>
                <a
                  href={affiliateProduct.affiliate_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 text-[10px] font-bold text-white bg-saba-orange hover:bg-orange-600 px-4.5 py-2 rounded-full shadow-sm font-cute transition"
                >
                  ดู
                </a>
              </div>
            )}

            {/* Posts Count */}
            <div className="flex-1 flex flex-col">
              <p className="text-[11px] font-bold text-saba-muted font-cute mb-3.5 shrink-0">
                กระทู้ {posts.length} รายการ
              </p>

              {posts.length > 0 ? (
                /* Results List (Linear, NOT Masonry) */
                <div className="space-y-3">
                  {posts.map((post) => {
                    const commentCount = post.comments?.[0]?.count || 0;
                    return (
                      <Link
                        key={post.id}
                        href={`/thread/${post.id}`}
                        className="flex gap-3.5 bg-white border border-saba-line hover:border-saba-orange/30 p-3 rounded-2xl shadow-sm hover:shadow-md transition duration-150"
                      >
                        {post.image_url ? (
                          <img
                            src={post.image_url}
                            alt={post.title}
                            className="w-16 h-16 rounded-xl object-cover shrink-0 border border-saba-line"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-xl bg-saba-bg2 border border-saba-line flex items-center justify-center text-xl text-saba-muted shrink-0 font-cute">
                            🐾
                          </div>
                        )}
                        <div className="min-w-0 flex-1 flex flex-col justify-between py-0.5">
                          <div>
                            {post.categories && (
                              <span className="text-[9px] font-bold text-saba-orange bg-saba-orange/5 border border-saba-orange/15 px-2 py-0.5 rounded-full font-cute">
                                {post.categories.emoji} {post.categories.name}
                              </span>
                            )}
                            <h3 className="text-xs font-bold text-saba-black mt-2 line-clamp-2 leading-relaxed font-heading">
                              {post.title}
                            </h3>
                          </div>
                          <p className="text-[9px] text-saba-muted font-cute mt-1">
                            โดย {post.author_name} · {post.likes_count} ถูกใจ · {commentCount} คอมเมนต์
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                /* Empty Results State */
                <div className="bg-white border border-saba-line rounded-2xl p-10 text-center space-y-3 shadow-sm flex flex-col items-center justify-center my-6 flex-1">
                  <div className="w-14 h-14 rounded-full bg-saba-bg2 border border-saba-line flex items-center justify-center text-2xl">
                    😿
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-saba-black font-heading">ยังไม่มีกระทู้ที่ตรงกับคำค้นหา &apos;{queryStr}&apos;</h3>
                    <p className="text-xs text-saba-muted font-cute">ลองเปลี่ยนคำค้นหาอื่นดูครับ 🐾</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Bottom Nav */}
      <BottomNav activeTab="home" />
    </div>
  );
}

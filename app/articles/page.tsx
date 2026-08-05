import React from "react";
import Link from "next/link";
import { createClient } from "../../lib/supabase";
import BottomNav from "../../components/BottomNav";
import SearchBar from "../../components/SearchBar";
import { BookOpen, Play, Bell } from "lucide-react";

export const revalidate = 0; // Always fetch dynamic content

export default async function ArticlesPage() {
  const supabase = createClient();

  const { data: articlesRes, error } = await supabase
    .from("articles")
    .select("*")
    .order("created_at", { ascending: false });

  const articles = articlesRes || [];

  if (error) {
    console.error("Error fetching articles:", error);
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#F7F5F1] border-x border-saba-line flex flex-col pb-24 font-body relative">
      {/* Sticky Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-saba-line px-4 h-14 flex items-center justify-between shadow-sm">
        <span className="text-base font-bold font-heading">
          SABA<span className="text-saba-orange">LAND</span> 🐾
        </span>
        <div className="flex items-center gap-3 text-saba-ink">
          <SearchBar />
          <Link href="/notifications" className="p-1 hover:text-saba-orange transition">
            <Bell className="w-5 h-5" />
          </Link>
        </div>
      </header>

      {/* Hero section */}
      <main className="p-4 space-y-5 flex-1">
        <div className="space-y-1">
          <h1 className="text-xl font-bold font-heading text-saba-black flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-saba-orange" />
            สาระน่ารู้จากสัตวแพทย์
          </h1>
          <p className="text-xs text-saba-muted font-cute">
            บทความดูแลสุขภาพและเคล็ดลับเพื่อความสุขของเจ้านาย 🐱🐾
          </p>
        </div>

        {/* Articles List */}
        {articles.length > 0 ? (
          <div className="space-y-4">
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/articles/${article.id}`}
                className="block bg-white border border-saba-line rounded-2xl overflow-hidden shadow-sm hover:border-saba-orange transition group"
              >
                {/* Thumbnail / Video Preview */}
                <div className="relative aspect-video w-full bg-saba-bg2 overflow-hidden border-b border-saba-line">
                  {article.thumbnail_url ? (
                    <img
                      src={article.thumbnail_url}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-102 transition duration-200"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-saba-muted font-cute">
                      🐾 ไม่มีรูปภาพ
                    </div>
                  )}

                  {/* Play Button Overlay if embed_url or has_video is present */}
                  {(article.embed_url || article.has_video) && (
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/30 transition-colors">
                      <div className="w-11 h-11 rounded-full bg-white/90 flex items-center justify-center text-saba-orange shadow-md scale-100 group-hover:scale-105 transition-transform duration-150">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Text Content */}
                <div className="p-4 space-y-2">
                  <span className="bg-saba-orange/10 text-saba-orange px-2.5 py-0.5 rounded-full font-bold text-[9px] border border-saba-orange/20 inline-block font-cute">
                    {article.tag}
                  </span>
                  <h3 className="text-sm font-bold text-saba-black line-clamp-2 leading-snug font-heading group-hover:text-saba-orange transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-xs text-saba-muted line-clamp-2 leading-relaxed font-cute">
                    {article.excerpt}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 space-y-2">
            <span className="text-3xl">🐾</span>
            <p className="text-xs text-saba-muted font-cute">ยังไม่มีบทความในขณะนี้</p>
          </div>
        )}
      </main>

      {/* Bottom Nav */}
      <BottomNav activeTab="articles" />
    </div>
  );
}

'use client';

import React, { useState } from "react";
import Link from "next/link";
import { Search, Bell, Heart } from "lucide-react";
import BottomNav from "./BottomNav";

interface Category {
  id: number;
  name: string;
  emoji: string;
}

interface Post {
  id: string;
  title: string;
  image_url: string;
  category_id: number;
  author_name: string;
  author_avatar: string;
  likes_count: number;
  categories: {
    name: string;
    emoji: string;
  } | null;
}

interface HomeFeedClientProps {
  initialPosts: Post[];
  categories: Category[];
}

import SearchBar from "./SearchBar";

export default function HomeFeedClient({ initialPosts, categories }: HomeFeedClientProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  // Client-side filtering of posts
  const filteredPosts = selectedCategoryId === null
    ? initialPosts
    : initialPosts.filter(post => post.category_id === selectedCategoryId);

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

      {/* Horizontally Scrollable Category Filter Pills */}
      <div className="bg-white/80 backdrop-blur sticky top-14 z-20 py-3 px-4 border-b border-saba-line overflow-x-auto flex gap-2 no-scrollbar scroll-smooth">
        {/* "ทั้งหมด" (All) Pill */}
        <button
          onClick={() => setSelectedCategoryId(null)}
          className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition cute-font border ${
            selectedCategoryId === null
              ? "bg-saba-orange border-saba-orange text-white shadow-sm"
              : "bg-white border-saba-line text-saba-ink hover:bg-black/5"
          }`}
        >
          ทั้งหมด
        </button>

        {/* Categories Pills */}
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategoryId(category.id)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition cute-font border ${
              selectedCategoryId === category.id
                ? "bg-saba-orange border-saba-orange text-white shadow-sm"
                : "bg-white border-saba-line text-saba-ink hover:bg-black/5"
            }`}
          >
            {category.emoji} {category.name}
          </button>
        ))}
      </div>

      {/* Masonry Feed Layout (using CSS columns) */}
      <main className="p-3 flex-1">
        {filteredPosts.length > 0 ? (
          <div className="columns-2 gap-3 w-full">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className="break-inside-avoid mb-3 rounded-2xl border border-saba-line overflow-hidden bg-white shadow-sm flex flex-col group hover:border-saba-orange transition-colors duration-150"
              >
                <Link href={`/thread/${post.id}`} className="block relative w-full h-auto">
                  {/* Category Badge overlay on Top-Left */}
                  {post.categories && (
                    <span className="absolute top-2 left-2 z-10 bg-white/90 backdrop-blur text-[9px] font-bold text-saba-black rounded-full px-2 py-0.5 shadow-sm border border-saba-line font-cute">
                      {post.categories.emoji} {post.categories.name}
                    </span>
                  )}
                  {/* Post Image */}
                  {post.image_url ? (
                    <img
                      src={post.image_url}
                      alt={post.title}
                      className="w-full h-auto object-cover border-b border-saba-line group-hover:opacity-95 transition-opacity"
                    />
                  ) : (
                    <div className="w-full aspect-[4/3] bg-saba-bg2 flex items-center justify-center text-xs text-saba-muted border-b border-saba-line font-cute">
                      🐾 ไม่มีรูปภาพ
                    </div>
                  )}
                </Link>

                {/* Card Content & Meta Info */}
                <div className="p-2.5 space-y-2">
                  <Link href={`/thread/${post.id}`} className="block hover:text-saba-orange transition-colors">
                    <h3 className="text-xs font-bold text-saba-black line-clamp-2 leading-relaxed font-heading">
                      {post.title}
                    </h3>
                  </Link>
                  <div className="flex items-center justify-between pt-1">
                    {/* Author Profile */}
                    <div className="flex items-center gap-1 min-w-0">
                      {post.author_avatar ? (
                        <img
                          src={post.author_avatar}
                          alt={post.author_name}
                          className="w-4.5 h-4.5 rounded-full object-cover border border-saba-line shrink-0"
                        />
                      ) : (
                        <div className="w-4.5 h-4.5 rounded-full bg-saba-bg2 border border-saba-line flex items-center justify-center shrink-0">
                          🐾
                        </div>
                      )}
                      <span className="text-[9px] text-saba-muted truncate font-cute">
                        {post.author_name}
                      </span>
                    </div>

                    {/* Likes Count */}
                    <div className="flex items-center gap-0.5 text-saba-muted hover:text-red-500 transition-colors cursor-pointer select-none">
                      <Heart className="w-3 h-3 fill-current" />
                      <span className="text-[9px] font-bold font-cute">
                        {post.likes_count}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 space-y-2">
            <span className="text-3xl">🐾</span>
            <p className="text-xs text-saba-muted font-cute">ยังไม่มีกระทู้ในหมวดหมู่นี้</p>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNav activeTab="home" />
    </div>
  );
}

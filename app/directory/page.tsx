import React from "react";
import Link from "next/link";
import { createClient } from "../../lib/supabase";
import BackButton from "../../components/BackButton";
import BottomNav from "../../components/BottomNav";
import SearchBar from "../../components/SearchBar";
import { MapPin, Phone, MessageSquare } from "lucide-react";

export const revalidate = 0; // Fetch fresh listings from DB

export default async function DirectoryPage() {
  const supabase = createClient();

  const { data: listingsRes, error } = await supabase
    .from("service_directory")
    .select("*")
    .order("created_at", { ascending: false });

  const listings = listingsRes || [];

  if (error) {
    console.error("Error fetching service directory:", error);
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#F7F5F1] border-x border-saba-line flex flex-col pb-24 font-body relative">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-saba-line px-4 h-14 flex items-center justify-between shadow-sm">
        <BackButton />
        <span className="text-xs font-bold font-heading bg-saba-bg2 border border-saba-line px-3.5 py-1 rounded-full text-saba-black">
          บริการใกล้บ้าน
        </span>
        <div className="flex items-center gap-3 text-saba-ink">
          <SearchBar />
        </div>
      </header>

      {/* Main Body */}
      <main className="p-4 space-y-5 flex-1">
        {/* Hero title */}
        <div className="space-y-1">
          <h1 className="text-xl font-bold font-heading text-saba-black flex items-center gap-2">
            <MapPin className="w-5 h-5 text-saba-orange" />
            บริการทาสแมว (Directory)
          </h1>
          <p className="text-xs text-saba-muted font-cute leading-relaxed">
            สารบัญโรงแรมแมวฝากเลี้ยงไร้กรง คลินิกสัตวแพทย์ 24 ชม. และพี่เลี้ยงแมวดูแลถึงบ้านเขตพื้นที่คุณ 🏠🐾
          </p>
        </div>

        {/* Directory Listings */}
        {listings.length > 0 ? (
          <div className="space-y-3.5">
            {listings.map((listing) => (
              <div
                key={listing.id}
                className="bg-white border border-saba-line rounded-2xl p-5 space-y-3.5 shadow-sm hover:border-saba-orange/60 transition duration-200"
              >
                <div>
                  <span className="bg-saba-orange/10 text-saba-orange px-2.5 py-0.5 rounded-full font-bold text-[9px] border border-saba-orange/20 inline-block font-cute">
                    {listing.category}
                  </span>
                  <h3 className="text-sm font-bold text-saba-black mt-2 font-heading">
                    {listing.name}
                  </h3>
                </div>

                {/* Quick actions buttons row */}
                <div className="flex gap-2.5 pt-1.5">
                  {listing.tel && (
                    <a
                      href={`tel:${listing.tel}`}
                      className="flex-1 py-2.5 rounded-xl bg-saba-orange hover:bg-orange-600 text-white text-xs font-bold text-center flex items-center justify-center gap-1.5 transition duration-150 shadow-sm shadow-orange-100 font-cute"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      โทรออก
                    </a>
                  )}
                  {listing.line_url && (
                    <a
                      href={listing.line_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2.5 rounded-xl bg-[#06C755] hover:bg-[#05b04b] text-white text-xs font-bold text-center flex items-center justify-center gap-1.5 transition duration-150 shadow-sm shadow-emerald-50 font-cute"
                    >
                      <MessageSquare className="w-3.5 h-3.5 fill-current" />
                      LINE
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 space-y-2 bg-white rounded-2xl border border-saba-line">
            <span className="text-3xl">📍</span>
            <p className="text-xs text-saba-muted font-cute">ยังไม่มีข้อมูลผู้ให้บริการในระบบ</p>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNav activeTab="profile" />
    </div>
  );
}

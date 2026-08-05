'use client';

import React, { Suspense } from "react";
import Link from "next/link";
import { useLineLogin } from "../../hooks/useLineLogin";
import { Droplet, Flame, LogIn, LogOut, User, ShoppingBag, MapPin } from "lucide-react";
import BottomNav from "../../components/BottomNav";

function WelcomeContent() {
  const { user, login, logout, loading } = useLineLogin();

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#F7F5F1] border-x border-saba-line flex flex-col pb-24 font-body relative">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-saba-line px-4 h-14 flex items-center justify-between shadow-sm">
        <span className="text-base font-bold font-heading">SABA<span className="text-saba-orange">LAND</span> 🐾</span>
        
        {/* LINE Login Status in Header */}
        {!loading && (
          <div>
            {user ? (
              <button
                onClick={logout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-saba-orange hover:bg-orange-600 text-white text-xs font-bold transition cute-font"
              >
                {user.picture ? (
                  <img
                    src={user.picture}
                    alt="user avatar"
                    className="w-4 h-4 rounded-full object-cover border border-white/20 shrink-0"
                  />
                ) : (
                  <User className="w-3.5 h-3.5" />
                )}
                <span className="truncate max-w-[85px]">{user.name}</span>
                <LogOut className="w-3 h-3 ml-0.5" />
              </button>
            ) : (
              <button
                onClick={login}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#06C755] hover:bg-[#05b34c] text-white text-xs font-bold transition cute-font"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>ผูกบัญชี LINE</span>
              </button>
            )}
          </div>
        )}
      </header>

      {/* Main Hero Container */}
      <main className="p-4 space-y-6 flex-1 flex flex-col justify-center">
        <div className="text-center space-y-2">
          <span className="text-3xl animate-bounce inline-block">🐾</span>
          <h1 className="text-2xl font-bold font-heading text-saba-black">
            ยินดีต้อนรับสู่ <span className="text-saba-orange">SABALAND</span>
          </h1>
          <p className="text-xs text-saba-muted font-cute max-w-xs mx-auto">
            ดินแดนดูแลสุขภาพเจ้านาย อ้างอิงตามสูตรสัตวแพทย์และหลักวิทยาศาสตร์
          </p>
        </div>

        {/* User Card if logged in */}
        {user && (
          <div className="bg-white border border-saba-line rounded-2xl p-4 flex items-center gap-3 shadow-sm">
            {user.picture && (
              <img
                src={user.picture}
                alt={user.name}
                className="w-12 h-12 rounded-full border border-saba-line object-cover shrink-0"
              />
            )}
            <div className="min-w-0 flex-1">
              <p className="text-xs text-saba-muted font-cute">โปรไฟล์ที่ผูกบัญชี:</p>
              <h3 className="text-sm font-bold text-saba-black truncate">{user.name}</h3>
              {user.status && <p className="text-[10px] text-saba-muted truncate mt-0.5">"{user.status}"</p>}
            </div>
          </div>
        )}

        {/* Tools Grid */}
        <div className="space-y-3">
          <Link
            href="/calculator/water"
            className="block bg-white hover:bg-orange-50/10 border border-saba-line hover:border-saba-orange rounded-2xl p-5 transition-all duration-200 group shadow-sm"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 shrink-0 group-hover:scale-105 transition-transform">
                <Droplet className="w-6 h-6 fill-blue-500/10" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-bold text-saba-black font-heading flex items-center gap-1.5">
                  เครื่องคำนวณน้ำดื่มรายวัน
                </h3>
                <p className="text-[11px] text-saba-muted font-cute mt-0.5">
                  คำนวณน้ำที่ต้องการตามน้ำหนัก สภาวะโรคไต และอาหารหลัก
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/calculator/calorie"
            className="block bg-white hover:bg-orange-50/10 border border-saba-line hover:border-saba-orange rounded-2xl p-5 transition-all duration-200 group shadow-sm"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-saba-orange shrink-0 group-hover:scale-105 transition-transform">
                <Flame className="w-6 h-6 fill-saba-orange/10" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-bold text-saba-black font-heading flex items-center gap-1.5">
                  เครื่องคำนวณแคลอรี (RER & MER)
                </h3>
                <p className="text-[11px] text-saba-muted font-cute mt-0.5">
                  คำนวณความต้องการพลังงานและประมาณน้ำหนักอาหารตามช่วงวัย
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/shop"
            className="block bg-white hover:bg-orange-50/10 border border-saba-line hover:border-saba-orange rounded-2xl p-5 transition-all duration-200 group shadow-sm"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500 shrink-0 group-hover:scale-105 transition-transform">
                <ShoppingBag className="w-6 h-6 fill-amber-500/10" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-bold text-saba-black font-heading flex items-center gap-1.5">
                  ร้านค้าแนะนำ (Affiliate Shop)
                </h3>
                <p className="text-[11px] text-saba-muted font-cute mt-0.5">
                  รวมสินค้าคุณภาพสำหรับแมวป่วยโรคไต และสินค้าเพื่อสุขภาพเจ้านาย 🛒
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/directory"
            className="block bg-white hover:bg-orange-50/10 border border-saba-line hover:border-saba-orange rounded-2xl p-5 transition-all duration-200 group shadow-sm"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500 shrink-0 group-hover:scale-105 transition-transform">
                <MapPin className="w-6 h-6 fill-emerald-500/10" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-bold text-saba-black font-heading flex items-center gap-1.5">
                  บริการใกล้บ้าน (Service Directory)
                </h3>
                <p className="text-[11px] text-saba-muted font-cute mt-0.5">
                  โรงแรมแมวฝากเลี้ยงไร้กรง คลินิกสัตวแพทย์ 24 ชม. และพี่เลี้ยงแมว 📍
                </p>
              </div>
            </div>
          </Link>
        </div>

        {/* Info Footnote */}
        <div className="text-center">
          <p className="text-[9px] text-saba-muted font-cute">
            🐾 ยินดีต้อนรับทาสแมวทุกท่าน · พัฒนาเวอร์ชัน Next.js 14 สำเร็จ
          </p>
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNav activeTab="profile" />
    </div>
  );
}

export default function WelcomePage() {
  return (
    <Suspense fallback={
      <div className="max-w-md mx-auto min-h-screen bg-[#F7F5F1] flex items-center justify-center font-cute text-xs text-saba-muted">
        กำลังโหลดข้อมูล... 🐾
      </div>
    }>
      <WelcomeContent />
    </Suspense>
  );
}

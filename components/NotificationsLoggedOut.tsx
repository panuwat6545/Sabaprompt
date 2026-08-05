'use client';

import React from "react";
import { LogIn } from "lucide-react";
import { useLineLogin } from "../hooks/useLineLogin";
import BottomNav from "./BottomNav";

export default function NotificationsLoggedOut() {
  const { login } = useLineLogin();

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#F7F5F1] border-x border-saba-line flex flex-col pb-24 font-body relative justify-center items-center px-6 text-center">
      <div className="bg-white border border-saba-line rounded-2xl p-8 space-y-6 shadow-sm w-full max-w-sm flex flex-col items-center">
        <div className="w-14 h-14 rounded-full bg-saba-bg2 border border-saba-line flex items-center justify-center text-2xl animate-bounce">
          🐾
        </div>
        <div className="space-y-2">
          <h2 className="text-base font-bold text-saba-black font-heading">เข้าสู่ระบบเพื่อดูการแจ้งเตือน</h2>
          <p className="text-xs text-saba-muted font-cute leading-relaxed">
            ผูกบัญชี LINE เพื่อรับแจ้งเตือนแบบเรียลไทม์เมื่อกระทู้ของคุณได้รับการกดถูกใจ หรือมีความคิดเห็นใหม่ๆ
          </p>
        </div>

        <button
          onClick={login}
          className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-[#06C755] hover:bg-[#05b34c] text-white text-xs font-bold transition shadow-sm font-cute"
        >
          <LogIn className="w-4 h-4" />
          <span>ผูกบัญชี LINE เพื่อเข้าใช้งาน</span>
        </button>
      </div>

      <BottomNav activeTab="notifications" />
    </div>
  );
}

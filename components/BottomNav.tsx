'use client';

import React from "react";
import Link from "next/link";
import { Home, BookOpen, Plus, Bell, User } from "lucide-react";
import { useNotificationCount } from "./NotificationProvider";

interface BottomNavProps {
  activeTab?: "home" | "articles" | "new_thread" | "notifications" | "profile";
}

export default function BottomNav({ activeTab }: BottomNavProps) {
  const unreadCount = useNotificationCount();

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white/95 backdrop-blur border-t border-saba-line h-16 flex items-center justify-around px-2 z-40 shadow-lg shadow-black/5">
      {/* Home Tab */}
      <Link 
        href="/"
        className={`flex flex-col items-center justify-center w-12 h-12 transition-colors duration-150 ${
          activeTab === "home" ? "text-saba-orange" : "text-saba-muted hover:text-saba-black"
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[9px] font-cute font-bold mt-1">หน้าแรก</span>
      </Link>

      {/* Articles Tab */}
      <Link 
        href="/articles"
        className={`flex flex-col items-center justify-center w-12 h-12 transition-colors duration-150 ${
          activeTab === "articles" ? "text-saba-orange" : "text-saba-muted hover:text-saba-black"
        }`}
      >
        <BookOpen className="w-5 h-5" />
        <span className="text-[9px] font-cute font-bold mt-1">สาระน่ารู้</span>
      </Link>

      {/* Center Plus Action Tab */}
      <div className="relative w-14 h-14 flex items-center justify-center -mt-6">
        <Link 
          href="/thread/new"
          className="w-12 h-12 rounded-full bg-saba-orange text-white flex items-center justify-center shadow-lg shadow-saba-orange/20 hover:bg-orange-600 transition-transform active:scale-95 duration-200 border-4 border-white"
        >
          <Plus className="w-6 h-6 stroke-[3px]" />
        </Link>
      </div>

      {/* Notifications Tab */}
      <Link 
        href="/notifications"
        className={`flex flex-col items-center justify-center w-12 h-12 transition-colors duration-150 ${
          activeTab === "notifications" ? "text-saba-orange" : "text-saba-muted hover:text-saba-black"
        }`}
      >
        <div className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[8px] font-bold rounded-full w-4.5 h-4.5 flex items-center justify-center border-2 border-white animate-pulse">
              {unreadCount}
            </span>
          )}
        </div>
        <span className="text-[9px] font-cute font-bold mt-1">แจ้งเตือน</span>
      </Link>

      {/* Profile Tab */}
      <Link 
        href="/welcome"
        className={`flex flex-col items-center justify-center w-12 h-12 transition-colors duration-150 ${
          activeTab === "profile" ? "text-saba-orange" : "text-saba-muted hover:text-saba-black"
        }`}
      >
        <User className="w-5 h-5" />
        <span className="text-[9px] font-cute font-bold mt-1">โปรไฟล์</span>
      </Link>
    </nav>
  );
}

'use client';

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Bell, Heart, MessageSquare, Reply, CheckCheck, ChevronRight } from "lucide-react";
import BottomNav from "./BottomNav";
import { markNotificationRead, markAllNotificationsRead } from "../app/actions";

interface NotificationItem {
  id: string;
  recipient_line_user_id: string;
  type: 'comment' | 'reply' | 'post_like' | 'comment_like';
  actor_name: string;
  post_id: string;
  comment_id: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
}

interface NotificationsClientProps {
  notifications: NotificationItem[];
}

function formatRelativeTime(dateString: string) {
  if (!dateString) return "";
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) {
    return "เมื่อครู่";
  } else if (diffMins < 60) {
    return `${diffMins} นาทีที่แล้ว`;
  } else if (diffHours < 24) {
    return `${diffHours} ชม.ที่แล้ว`;
  } else if (diffDays < 7) {
    return `${diffDays} วันที่แล้ว`;
  } else {
    return date.toLocaleDateString("th-TH", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }
}

export default function NotificationsClient({ notifications: initialNotifications }: NotificationsClientProps) {
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [isPending, startTransition] = useTransition();

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleMarkAllRead = async () => {
    if (unreadCount === 0) return;

    // Optimistically mark all as read
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));

    try {
      const res = await markAllNotificationsRead();
      if (!res.success) {
        throw new Error(res.error || "Failed to mark all as read");
      }
      router.refresh();
    } catch (err) {
      console.error(err);
      // Revert on error
      setNotifications(initialNotifications);
    }
  };

  const handleNotificationClick = async (notif: NotificationItem) => {
    if (!notif.is_read) {
      // Optimistically mark as read
      setNotifications(prev =>
        prev.map(n => (n.id === notif.id ? { ...n, is_read: true } : n))
      );
      try {
        await markNotificationRead(notif.id);
      } catch (err) {
        console.error("Failed to mark notification as read", err);
      }
    }
    // Route to the post details
    router.push(`/thread/${notif.post_id}`);
    router.refresh();
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "comment":
        return (
          <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
            <MessageSquare className="w-4 h-4 fill-blue-500/10" />
          </div>
        );
      case "reply":
        return (
          <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center shrink-0">
            <Reply className="w-4 h-4" />
          </div>
        );
      case "post_like":
        return (
          <div className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center shrink-0">
            <Heart className="w-4 h-4 fill-red-500/10" />
          </div>
        );
      case "comment_like":
        return (
          <div className="w-8 h-8 rounded-full bg-pink-50 text-pink-500 flex items-center justify-center shrink-0">
            <Heart className="w-4 h-4 fill-pink-500/10" />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-gray-50 text-gray-500 flex items-center justify-center shrink-0">
            <Bell className="w-4 h-4" />
          </div>
        );
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#F7F5F1] border-x border-saba-line flex flex-col pb-24 font-body relative">
      {/* Sticky Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-saba-line px-4 h-14 flex items-center justify-between shadow-sm shrink-0">
        <span className="text-base font-bold font-heading">
          การแจ้งเตือน <span className="text-saba-orange">({unreadCount})</span>
        </span>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="text-[10px] font-bold text-saba-orange hover:text-orange-600 flex items-center gap-1 bg-saba-orange/5 border border-saba-orange/15 px-2.5 py-1.5 rounded-full transition font-cute"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            ทำเครื่องหมายว่าอ่านแล้วทั้งหมด
          </button>
        )}
      </header>

      {/* Notifications List */}
      <main className="p-4 flex-1 space-y-3">
        {notifications.length > 0 ? (
          <div className="space-y-2.5">
            {notifications.map(notif => (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif)}
                className={`bg-white border rounded-2xl p-4 flex items-start justify-between gap-3 shadow-sm hover:border-saba-orange/30 transition duration-150 cursor-pointer relative ${
                  !notif.is_read ? "border-saba-orange/20" : "border-saba-line"
                }`}
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  {getIcon(notif.type)}
                  <div className="min-w-0 flex-1 space-y-1">
                    <p className={`text-xs leading-relaxed font-cute ${!notif.is_read ? "font-bold text-saba-black" : "text-saba-ink"}`}>
                      {notif.message}
                    </p>
                    <p className="text-[9px] text-saba-muted font-cute font-medium">
                      {formatRelativeTime(notif.created_at)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 self-center shrink-0">
                  {!notif.is_read && (
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" />
                  )}
                  <ChevronRight className="w-4 h-4 text-saba-muted" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-saba-line rounded-2xl p-10 text-center space-y-3 shadow-sm flex flex-col items-center justify-center my-8">
            <div className="w-14 h-14 rounded-full bg-saba-bg2 border border-saba-line flex items-center justify-center text-2xl animate-bounce">
              🐾
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-saba-black font-heading">ยังไม่มีการแจ้งเตือนใหม่</h3>
              <p className="text-xs text-saba-muted font-cute">หากมีทาสแมวคนอื่นมากดไลก์หรือแสดงความคิดเห็น จะแสดงที่นี่ครับ</p>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNav activeTab="notifications" />
    </div>
  );
}

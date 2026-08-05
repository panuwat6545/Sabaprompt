import type { Metadata } from "next";
import { Prompt, Mali } from "next/font/google";
import "./globals.css";
import { NotificationProvider } from "../components/NotificationProvider";
import { getUnreadNotificationCount } from "./actions";

const promptFont = Prompt({
  variable: "--font-prompt",
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
});

const maliFont = Mali({
  variable: "--font-mali",
  subsets: ["thai", "latin"],
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  title: "SABALAND 🐾 — ดินแดนทาสแมว & คลังสุขภาพเจ้านายสุดเลิฟ",
  description: "เว็บแอปพลิเคชันสำหรับช่วยเหลือทาสแมวในการคำนวณสภาวะสุขภาพเจ้านาย",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const unreadCount = await getUnreadNotificationCount();

  return (
    <html
      lang="th"
      className={`${promptFont.variable} ${maliFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <NotificationProvider count={unreadCount}>
          {children}
        </NotificationProvider>
      </body>
    </html>
  );
}

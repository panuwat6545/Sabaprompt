'use client';

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="p-1 text-saba-ink hover:text-saba-orange transition"
      aria-label="ย้อนกลับ"
    >
      <ArrowLeft className="w-5 h-5" />
    </button>
  );
}

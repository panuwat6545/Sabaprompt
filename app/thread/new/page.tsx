'use client';

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../../lib/supabase";
import { useLineLogin } from "../../../hooks/useLineLogin";
import BackButton from "../../../components/BackButton";
import { ChevronDown, ImagePlus, Info, Loader2, X } from "lucide-react";
import { createPost } from "../../actions";

interface Category {
  id: number;
  name: string;
  emoji: string;
}

function NewThreadContent() {
  const router = useRouter();
  const { user, loading: authLoading } = useLineLogin();
  const supabase = createClient();

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const hashtags = content.match(/#[\wก-๙]+/g) || [];
  const detectedTags = Array.from(new Set(hashtags));

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/welcome?error=please_login");
    }
  }, [user, authLoading, router]);

  // Fetch categories list
  useEffect(() => {
    async function getCategories() {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name, emoji")
        .order("id", { ascending: true });

      if (data && data.length > 0) {
        setCategories(data);
        setSelectedCategory(data[0]); // default select first
      }
    }
    getCategories();
  }, []);


  // Canvas image compression (resizes to max-width 800px, JPEG quality 0.8)
  const compressImage = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;
          const MAX_WIDTH = 800;

          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) resolve(blob);
              else reject(new Error("Image compression failed"));
            },
            "image/jpeg",
            0.8
          );
        };
      };
      reader.onerror = (err) => reject(err);
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Client-side MIME type check
      if (!file.type || !file.type.startsWith("image/")) {
        setErrorMessage("ไฟล์ที่แนบต้องเป็นรูปภาพเท่านั้น");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }

      // Client-side size check (5MB limit)
      const MAX_SIZE = 5 * 1024 * 1024;
      if (file.size > MAX_SIZE) {
        setErrorMessage("ขนาดไฟล์ต้องไม่เกิน 5MB");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }

      setErrorMessage(null); // Clear errors
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMessage("กรุณากรอกหัวข้อกระทู้");
      return;
    }
    if (!content.trim()) {
      setErrorMessage("กรุณากรอกเนื้อหากระทู้");
      return;
    }
    if (!selectedCategory) {
      setErrorMessage("กรุณาเลือกหมวดสายพันธุ์");
      return;
    }
    if (!user) {
      setErrorMessage("กรุณาเข้าสู่ระบบก่อนทำการโพสต์");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const actionFormData = new FormData();
      actionFormData.append("title", title.trim());
      actionFormData.append("content", content.trim());
      actionFormData.append("category_id", selectedCategory.id.toString());

      // 1. If an image is attached, compress client-side to save bandwidth
      if (imageFile) {
        const compressedBlob = await compressImage(imageFile);
        // Convert Blob to a File object before sending to Server Action
        const fileExt = imageFile.name.split(".").pop() || "jpg";
        const compressedFile = new File([compressedBlob], `image.${fileExt}`, {
          type: "image/jpeg",
        });
        actionFormData.append("image", compressedFile);
      }

      // 2. Insert post details + upload image server-side via Server Action
      const res = await createPost(actionFormData);

      if (!res.success) {
        throw new Error(res.error || "เกิดข้อผิดพลาดในการโพสต์กระทู้");
      }

      // 3. Success -> redirect to Home
      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("Post creation failed:", err);
      let userFriendlyMsg = err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการเชื่อมต่อระบบ";

      // Precise diagnostic mapping for storage/upload errors
      if (userFriendlyMsg.includes("Bucket not found") || userFriendlyMsg.includes("bucket")) {
        userFriendlyMsg = "ไม่พบที่เก็บรูปภาพ (Storage Bucket: thread-images) กรุณาสร้าง Bucket ในระบบหลังบ้านและตั้งค่าเป็น Public ก่อนครับ";
      } else if (userFriendlyMsg.includes("Payload Too Large") || userFriendlyMsg.includes("too large") || userFriendlyMsg.includes("size")) {
        userFriendlyMsg = "ขนาดรูปภาพใหญ่เกินขีดจำกัดของเซิร์ฟเวอร์ กรุณาลดขนาดรูปภาพ";
      } else if (userFriendlyMsg.includes("row-level security") || userFriendlyMsg.includes("RLS")) {
        userFriendlyMsg = "สิทธิ์ในการเขียนตารางถูกปฏิเสธ กรุณาตรวจสอบ RLS policies บน Supabase";
      }

      setErrorMessage(userFriendlyMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="max-w-md mx-auto min-h-screen bg-[#F7F5F1] flex flex-col items-center justify-center font-cute text-xs text-saba-muted">
        <Loader2 className="w-6 h-6 animate-spin text-saba-orange mb-2" />
        กำลังยืนยันบัญชี LINE...
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-white border-x border-saba-line flex flex-col pb-10 relative font-body">
      {/* Sticky Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-saba-line flex items-center justify-between px-3 h-14 shadow-sm">
        <div className="w-10">
          <BackButton />
        </div>
        <span className="text-sm font-bold font-heading">ตั้งกระทู้ใหม่</span>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="bg-saba-orange hover:bg-orange-600 text-white text-xs font-bold px-5 py-2 rounded-full transition flex items-center gap-1 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed font-cute"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>กำลังโพสต์</span>
            </>
          ) : (
            <span>โพสต์</span>
          )}
        </button>
      </header>

      {/* Main Form Fields */}
      <main className="p-4 space-y-5 flex-1">
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-cute p-3 rounded-xl">
            ⚠️ {errorMessage}
          </div>
        )}

        {/* Post in the name of profile card */}
        <div className="flex items-center gap-3 bg-saba-bg2 border border-saba-line rounded-2xl p-3.5">
          {user.picture ? (
            <img
              src={user.picture}
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover border border-saba-line"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-saba-orange/10 flex items-center justify-center text-saba-orange font-bold text-xs cute-font">
              ทาส
            </div>
          )}
          <div className="min-w-0 flex-1 relative">
            <p className="text-[10px] text-saba-muted font-cute">โพสต์ในนาม:</p>
            <p className="text-xs font-bold text-saba-black truncate">{user.name}</p>

            {/* Category selection selector trigger */}
            <div className="relative mt-1">
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-saba-line text-[10px] font-bold text-saba-black font-cute hover:border-saba-orange transition"
              >
                <span>
                  {selectedCategory
                    ? `${selectedCategory.emoji} ${selectedCategory.name}`
                    : "🐾 เลือกหมวดสายพันธุ์"}
                </span>
                <ChevronDown className="w-3 h-3 text-saba-muted shrink-0" />
              </button>

              {/* Dropdown Options */}
              {dropdownOpen && (
                <div className="absolute left-0 mt-1.5 w-44 bg-white border border-saba-line rounded-xl shadow-lg z-50 py-1.5 max-h-48 overflow-y-auto no-scrollbar animate-fade-in">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(cat);
                        setDropdownOpen(false);
                      }}
                      className="w-full px-3 py-1.5 text-left text-xs font-bold hover:bg-saba-bg2 text-saba-black flex items-center gap-2 font-cute transition"
                    >
                      <span>{cat.emoji}</span>
                      <span>{cat.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Title input */}
        <div className="space-y-1.5">
          <input
            type="text"
            placeholder="หัวข้อกระทู้ (สั้นๆ ให้คนอยากคลิก)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isSubmitting}
            className="w-full text-sm font-bold border-b border-saba-line pb-2.5 focus:outline-none focus:border-saba-orange text-saba-black placeholder:text-saba-muted placeholder:font-normal"
          />
        </div>

        {/* Content textarea */}
        <div className="space-y-1.5">
          <textarea
            rows={6}
            placeholder="เล่าเรื่องราวหรือคำถามของคุณ... ใส่ #แฮชแท็ก เพื่อให้คนหาเจอง่ายขึ้น"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isSubmitting}
            className="w-full text-xs text-saba-ink focus:outline-none placeholder:text-saba-muted resize-none leading-relaxed font-cute"
          />
        </div>

        {/* Detected Tags display */}
        {detectedTags.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap border-t border-saba-line/45 pt-3">
            <span className="text-[10px] text-saba-muted font-cute">แท็กที่ตรวจพบ:</span>
            {detectedTags.map((tag, idx) => (
              <span
                key={idx}
                className="text-[10px] font-bold text-saba-orange bg-orange-50 px-2 py-0.5 rounded-full border border-saba-orange/15 font-cute animate-fade-in"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Image Attachment grid */}
        <div className="border-t border-saba-line/45 pt-4 space-y-2">
          <p className="text-[11px] font-bold text-saba-muted font-cute">
            แนบรูปภาพประกอบ
          </p>

          <div className="flex items-center gap-2">
            {imagePreview ? (
              <div className="w-20 h-20 rounded-2xl overflow-hidden relative border border-saba-line shadow-sm group">
                <img
                  src={imagePreview}
                  alt="upload preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center transition"
                  aria-label="ลบรูปภาพ"
                >
                  <X className="w-3 h-3 text-white" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isSubmitting}
                className="w-20 h-20 rounded-2xl border-2 border-dashed border-saba-line hover:border-saba-orange hover:text-saba-orange flex flex-col items-center justify-center gap-1 text-saba-muted transition"
              >
                <ImagePlus className="w-5 h-5 shrink-0" />
                <span className="text-[8px] font-cute">เพิ่มรูป</span>
              </button>
            )}

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
          </div>

          <p className="text-[9px] text-saba-muted font-cute flex items-center gap-1">
            <Info className="w-3 h-3 text-saba-orange shrink-0" />
            ระบบจะบีบอัดรูปให้อัตโนมัติเพื่อประหยัดพื้นที่อินเทอร์เน็ต
          </p>
        </div>
      </main>
    </div>
  );
}

export default function NewThreadPage() {
  return (
    <Suspense fallback={
      <div className="max-w-md mx-auto min-h-screen bg-[#F7F5F1] flex items-center justify-center font-cute text-xs text-saba-muted">
        <Loader2 className="w-6 h-6 animate-spin text-saba-orange mb-2" />
        กำลังโหลดข้อมูล... 🐾
      </div>
    }>
      <NewThreadContent />
    </Suspense>
  );
}

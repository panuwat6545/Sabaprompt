import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "../../../lib/supabase";
import BackButton from "../../../components/BackButton";
import { Share2, Clock, Calendar, CheckCircle2 } from "lucide-react";

export const revalidate = 0; // Fetch fresh data on every request

interface ArticlePageProps {
  params: Promise<{
    id: string;
  }>;
}

// SEO Metadata Generation
export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { id } = await params;
  const supabase = createClient();
  const { data: article } = await supabase
    .from("articles")
    .select("title, excerpt, thumbnail_url")
    .eq("id", id)
    .single();

  if (!article) {
    return {
      title: "ไม่พบหลักสูตรสาระความรู้ - SABALAND",
    };
  }

  return {
    title: `${article.title} - SABALAND สาระน่ารู้ 🐾`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: article.thumbnail_url ? [{ url: article.thumbnail_url }] : [],
    },
  };
}

// Helper to provide detailed educational content based on the article title
function getArticleBody(title: string, excerpt: string) {
  if (title.includes("ป้อนยา")) {
    return (
      <div className="space-y-4 text-xs text-saba-ink leading-relaxed font-cute">
        <p className="font-bold text-saba-black text-sm">
          💡 ทำไมการป้อนยาแมวโรคไตจึงต้องละมุนละม่อม?
        </p>
        <p>
          แมวป่วยโรคไตมักมีภาวะทางเดินอาหารอ่อนแอ คลื่นไส้ง่าย และมีความเครียดสูงสะสม
          การป้อนยาแบบบังคับรุนแรงจะกระตุ้นความดันโลหิตสูงและอาจส่งผลเสียต่อการทำงานของไตโดยตรง
        </p>
        
        <h4 className="font-bold text-saba-black mt-3">🐾 ขั้นตอนการป้อนยาเม็ด (แบบไร้ความเครียด):</h4>
        <ul className="list-decimal pl-4 space-y-2">
          <li><strong>ห่อตัวด้วยผ้าขนหนู:</strong> คลุมหลังและอกของน้องเหลือเพียงส่วนหัว เพื่อป้องกันการตะกุยและลดสัญชาตญาณการหนี</li>
          <li><strong>เปิดขากรรไกรอย่างอ่อนโยน:</strong> ใช้นิ้วชี้และนิ้วโป้งจับขากรรไกรบนตรงซอกหลังฟันเขี้ยว เงยหน้าขึ้นทำมุม 45 องศา</li>
          <li><strong>หยอดและดันยาอย่างรวดเร็ว:</strong> ใช้มืออีกข้างกดขากรรไกรล่างลง แล้วทิ้งเม็ดยาเข้าจุดลึกสุดของโคนลิ้นทันที</li>
          <li><strong>ป้อนน้ำตามทันที:</strong> ป้อนน้ำเปล่าด้วยไซริงค์ประมาณ 2-3 cc เพื่อช่วยให้ยาเคลื่อนผ่านหลอดอาหารได้อย่างสะดวก ไม่ระคายเคืองคอ</li>
        </ul>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-[10px] text-amber-800 font-semibold mt-4">
          ⚠️ <strong>ข้อควรระวังสำคัญ:</strong> ห้ามป้อนยาในสภาวะที่แมวกำลังอาเจียนรุนแรง และห้ามบดเม็ดยาบางประเภทที่มีการเคลือบเฉพาะ (Enteric-coated) โดยไม่ได้ปรึกษาสัตวแพทย์เด็ดขาด
        </div>
      </div>
    );
  }

  if (title.includes("น้ำพุแมว")) {
    return (
      <div className="space-y-4 text-xs text-saba-ink leading-relaxed font-cute">
        <p className="font-bold text-saba-black text-sm">
          💧 น้ำเคลื่อนไหวช่วยกระตุ้นการดื่มน้ำได้อย่างไร?
        </p>
        <p>
          ตามสัญชาตญาณสัตว์ป่า แมวชอบดื่มน้ำไหลเนื่องจากมีความสะอาดและออกซิเจนสูงกว่าน้ำนิ่ง
          การใช้น้ำพุแมวจึงเป็นวิธีเพิ่มปริมาณน้ำดื่มที่ดีที่สุดเพื่อลดภาระงานของไตและป้องกันตะกอนนิ่วในท่อปัสสาวะ
        </p>

        <h4 className="font-bold text-saba-black mt-3">✨ ข้อดีของระบบน้ำพุกรอง 4 ชั้น:</h4>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <div className="p-2.5 bg-white border border-saba-line rounded-xl">
            <span className="font-bold text-saba-orange">1. กรองหยาบ</span>
            <p className="text-[10px] text-saba-muted mt-0.5">ดักจับเส้นขน ฝุ่นละออง และคราบน้ำลาย</p>
          </div>
          <div className="p-2.5 bg-white border border-saba-line rounded-xl">
            <span className="font-bold text-saba-orange">2. กรองคาร์บอน</span>
            <p className="text-[10px] text-saba-muted mt-0.5">ดูดซับกลิ่นคลอรีนและสารเคมีในน้ำประปา</p>
          </div>
        </div>

        <h4 className="font-bold text-saba-black mt-3">🧼 แนวทางทำความสะอาดเพื่อความสะอาดสูงสุด:</h4>
        <ul className="list-disc pl-4 space-y-1">
          <li>ควรล้างเครื่องและถอดแกนมอเตอร์มาเช็ดทำความสะอาดคราบเมือกสัปดาห์ละ 1 ครั้ง</li>
          <li>เปลี่ยนไส้กรองทุกๆ 3-4 สัปดาห์ เพื่อป้องกันการเติบโตของแบคทีเรีย</li>
          <li>หากเป็นไปได้ แนะนำให้ใช้น้ำดื่มบรรจุขวดหรือน้ำกรองแทนน้ำประปาดิบ</li>
        </ul>
      </div>
    );
  }

  if (title.includes("จัดคอนโดแมว")) {
    return (
      <div className="space-y-4 text-xs text-saba-ink leading-relaxed font-cute">
        <p className="font-bold text-saba-black text-sm">
          🏢 ทำไมแนวตั้งจึงสำคัญต่อความรู้สึกปลอดภัยของแมว?
        </p>
        <p>
          แมวเป็นทั้งผู้ล่าและผู้ถูกล่าในธรรมชาติ การขึ้นที่สูงทำให้พวกเขารู้สึกมีอำนาจ
          สามารถสังเกตสิ่งแวดล้อมโดยรอบได้ทั่วถึง และลดระดับความเครียดสะสมได้ดีมาก
        </p>

        <h4 className="font-bold text-saba-black mt-3">🪜 3 เทคนิคการแต่งมุม Vertical Space ในคอนโด:</h4>
        <div className="space-y-2.5">
          <div className="flex gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <strong>จัดวางติดริมหน้าต่าง:</strong> ให้เจ้านายได้ดูนก ดูใบไม้ปลิว
              การรับชมวิวภายนอกเป็นการกระตุ้นสมองแมวได้เป็นอย่างดี
            </div>
          </div>
          <div className="flex gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <strong>สร้างบันไดทางหนีหลายด้าน:</strong> คอนโดแมวหรือชั้นลอยที่ดีควรมีจุดขึ้นและลงอย่างน้อย 2 ทาง
              เพื่อหลีกเลี่ยงการถูกมุมอับเผชิญหน้าหากบ้านเลี้ยงแมวหลายตัว
            </div>
          </div>
        </div>

        <p className="text-[10px] text-saba-muted mt-4">
          * อ้างอิงแนวทางจัดสภาวะแวดล้อมแมวระบบปิดของสมาคมสัตวแพทย์ด้านพฤติกรรมสัตว์เลี้ยงสากล
        </p>
      </div>
    );
  }

  // Fallback content if no predefined template matches
  return (
    <div className="space-y-4 text-xs text-saba-ink leading-relaxed font-cute">
      <p className="font-bold text-saba-black text-sm">📖 รายละเอียดสาระน่ารู้เพิ่มเติม:</p>
      <p className="bg-white border border-saba-line rounded-xl p-3 italic">
        "{excerpt}"
      </p>
      <p>
        การดูแลแมวแสนรักต้องการความเอาใจใส่ในทุกๆ ด้าน ทั้งด้านโภชนาการ น้ำดื่ม สิ่งแวดล้อม และพฤติกรรม
        บทความนี้จัดทำขึ้นโดยทีมสัตวแพทย์ของ SABALAND เพื่อเป็นแนวทางสำหรับทาสทุกท่าน
      </p>
    </div>
  );
}

export default async function ArticleDetailPage({ params }: ArticlePageProps) {
  const { id } = await params;
  const supabase = createClient();

  const { data: article, error } = await supabase
    .from("articles")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !article) {
    return notFound();
  }

  // Format date
  const publishDate = new Date(article.created_at).toLocaleDateString("th-TH", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#F7F5F1] border-x border-saba-line flex flex-col pb-12 font-body relative">
      {/* Sticky Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-saba-line px-4 h-14 flex items-center justify-between shadow-sm">
        <BackButton />
        <span className="text-xs font-bold font-heading bg-saba-bg2 border border-saba-line px-3.5 py-1 rounded-full text-saba-black">
          สาระน่ารู้
        </span>
        <button className="p-1 text-saba-ink hover:text-saba-orange transition">
          <Share2 className="w-5 h-5" />
        </button>
      </header>

      {/* Main Content Area */}
      <main className="p-4 space-y-4 flex-1">
        {/* Responsive Video Embed or Image Thumbnail */}
        {article.embed_url ? (
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-saba-line bg-black shadow-sm">
            <iframe
              className="w-full h-full"
              src={article.embed_url}
              title={article.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        ) : (
          article.thumbnail_url && (
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-saba-line bg-white shadow-sm">
              <img
                src={article.thumbnail_url}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          )
        )}

        {/* Article Meta Info Card */}
        <div className="bg-white border border-saba-line rounded-2xl p-4 space-y-3.5 shadow-sm">
          <div className="flex items-center justify-between border-b border-saba-line pb-2.5">
            <span className="bg-saba-orange/10 text-saba-orange px-2.5 py-0.5 rounded-full font-bold text-[9px] border border-saba-orange/20 inline-block font-cute">
              {article.tag}
            </span>
            <div className="flex items-center gap-1.5 text-[9px] text-saba-muted font-cute">
              <Clock className="w-3.5 h-3.5" />
              <span>อ่าน 3 นาที</span>
              <span className="text-saba-line">|</span>
              <Calendar className="w-3.5 h-3.5" />
              <span>{publishDate}</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-base font-bold text-saba-black leading-snug font-heading">
            {article.title}
          </h1>

          {/* Excerpt Intro */}
          <p className="text-xs text-saba-muted font-cute italic leading-relaxed border-l-2 border-saba-orange pl-3 py-0.5">
            "{article.excerpt}"
          </p>

          {/* Detailed Educational Veterinary Content */}
          <div className="pt-2 border-t border-saba-line/40">
            {getArticleBody(article.title, article.excerpt)}
          </div>
        </div>
      </main>
    </div>
  );
}

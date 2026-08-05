import React from "react";
import Link from "next/link";
import { createClient } from "../../lib/supabase";
import BackButton from "../../components/BackButton";
import BottomNav from "../../components/BottomNav";
import SearchBar from "../../components/SearchBar";
import { ShoppingBag, Star, ExternalLink } from "lucide-react";

export const revalidate = 0; // Fetch fresh products from DB

export default async function ShopPage() {
  const supabase = createClient();

  const { data: productsRes, error } = await supabase
    .from("affiliate_products")
    .select("*")
    .order("created_at", { ascending: false });

  const products = productsRes || [];

  if (error) {
    console.error("Error fetching products:", error);
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#F7F5F1] border-x border-saba-line flex flex-col pb-24 font-body relative">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-saba-line px-4 h-14 flex items-center justify-between shadow-sm">
        <BackButton />
        <span className="text-xs font-bold font-heading bg-saba-bg2 border border-saba-line px-3.5 py-1 rounded-full text-saba-black">
          ร้านค้าแนะนำ
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
            <ShoppingBag className="w-5 h-5 text-saba-orange" />
            ร้านค้าทาสแมว (Affiliate)
          </h1>
          <p className="text-xs text-saba-muted font-cute leading-relaxed">
            รวมของใช้ อุปกรณ์ดูแลป้อนยา และโภชนาการสำหรับแมวป่วยโรคไตที่สัตวแพทย์แนะนำ 🏥✨
          </p>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white border border-saba-line rounded-2xl p-4 flex flex-col justify-between shadow-sm hover:border-saba-orange transition duration-200 group"
              >
                <div className="space-y-2">
                  {/* Rating & Price */}
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-amber-500 font-bold flex items-center gap-1 font-cute">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      {product.rating_text || "5.0"}
                    </span>
                    <span className="text-saba-orange font-bold font-heading text-xs">
                      {product.price_text}
                    </span>
                  </div>

                  {/* Image placeholder if no image_url provided, or product image */}
                  {product.image_url ? (
                    <div className="aspect-square rounded-xl overflow-hidden bg-saba-bg2 border border-saba-line">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-103 transition duration-200"
                      />
                    </div>
                  ) : (
                    <div className="aspect-square rounded-xl bg-saba-bg2 border border-saba-line flex flex-col items-center justify-center text-saba-muted">
                      <ShoppingBag className="w-6 h-6 opacity-30" />
                      <span className="text-[9px] font-cute mt-1">SABALAND</span>
                    </div>
                  )}

                  {/* Product Title */}
                  <h4 className="text-xs font-bold text-saba-black line-clamp-2 leading-relaxed font-heading group-hover:text-saba-orange transition-colors">
                    {product.name}
                  </h4>
                </div>

                {/* Checkout Link button */}
                <a
                  href={product.affiliate_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 bg-saba-orange hover:bg-orange-600 text-white text-[10px] font-bold rounded-xl text-center flex items-center justify-center gap-1 mt-3 font-cute shadow-sm shadow-orange-100 transition duration-150"
                >
                  เช็คราคา 🐾
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 space-y-2 bg-white rounded-2xl border border-saba-line">
            <span className="text-3xl">🛒</span>
            <p className="text-xs text-saba-muted font-cute">ยังไม่มีรายการสินค้าในระบบ</p>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNav activeTab="profile" />
    </div>
  );
}

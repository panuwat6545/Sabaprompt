'use client';

import React, { useState } from "react";
import Link from "next/link";
import { Lock, Droplet } from "lucide-react";

export default function WaterCalculator() {
  const [weight, setWeight] = useState<number>(4.0);
  const [condition, setCondition] = useState<"normal" | "kidney">("normal");
  const [diet, setDiet] = useState<"dry" | "wet">("dry");
  const [consentChecked, setConsentChecked] = useState<boolean>(false);

  // Calculation logic
  const hydrationFactor = condition === "kidney" ? 60 : 50;
  let waterVal = weight * hydrationFactor;
  if (diet === "wet") {
    waterVal = waterVal * 0.8;
  }
  waterVal = Math.round(waterVal);
  const syringeCount = Math.round(waterVal / 10);
  const percentage = Math.min(100, Math.round((waterVal / 400) * 100));
  const formulaString = diet === "wet"
    ? `${weight.toFixed(1)} kg × ${hydrationFactor} ml/kg × 0.8 (อาหารเปียก) = ${waterVal} ml/วัน`
    : `${weight.toFixed(1)} kg × ${hydrationFactor} ml/kg = ${waterVal} ml/วัน`;

  return (
    <div className="max-w-md mx-auto min-h-screen bg-white border-x border-saba-line flex flex-col pb-12">
      {/* Top Navigation */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-saba-line px-4 h-14 flex items-center justify-between">
        <span className="text-base font-bold font-heading">SABA<span className="text-saba-orange">LAND</span> 🐾</span>
        <div className="flex items-center gap-2 text-xs font-bold font-cute">
          <Link href="/" className="text-saba-muted hover:text-saba-black hover:underline">
            ← กลับหน้าหลัก
          </Link>
          <span className="text-saba-line">|</span>
          <Link href="/calculator/calorie" className="text-saba-orange hover:underline">
            สลับไปคำนวณแคลอรี →
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 flex-1 space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-xl font-bold font-heading text-saba-black flex items-center justify-center gap-2">
            <Droplet className="w-5 h-5 text-saba-orange fill-saba-orange/20 animate-pulse" />
            เครื่องคำนวณปริมาณน้ำดื่มรายวัน
          </h1>
          <p className="text-xs text-saba-muted font-cute">คำนวณปริมาณน้ำที่เจ้านายควรได้รับตามน้ำหนักและสุขภาพ</p>
        </div>

        {/* Input Form */}
        <div className="bg-saba-bg2 rounded-2xl p-4 border border-saba-line space-y-5">
          {/* Weight Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-saba-ink block">
              ⚖️ น้ำหนักตัวของเจ้านาย:
            </label>
            <div className="relative flex items-center">
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={weight}
                onChange={(e) => setWeight(Math.max(0.1, parseFloat(e.target.value) || 0))}
                className="w-full bg-white border border-saba-line rounded-xl px-3 py-2.5 text-sm font-bold focus:outline-none focus:border-saba-orange text-saba-black pr-12"
              />
              <span className="absolute right-4 text-xs font-bold text-saba-muted">
                kg
              </span>
            </div>
          </div>

          {/* Condition Toggle */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-saba-ink block">
              🏥 สภาพร่างกาย/โรคประจำตัว:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setCondition("normal")}
                className={`py-2.5 rounded-xl text-xs font-bold font-cute transition-all duration-200 border ${
                  condition === "normal"
                    ? "bg-saba-orange border-saba-orange text-white shadow-md shadow-orange-100"
                    : "bg-white border-saba-line text-saba-ink hover:bg-black/5"
                }`}
              >
                เจ้านายสุขภาพปกติ 😺
              </button>
              <button
                type="button"
                onClick={() => setCondition("kidney")}
                className={`py-2.5 rounded-xl text-xs font-bold font-cute transition-all duration-200 border ${
                  condition === "kidney"
                    ? "bg-saba-orange border-saba-orange text-white shadow-md shadow-orange-100"
                    : "bg-white border-saba-line text-saba-ink hover:bg-black/5"
                }`}
              >
                เจ้านายป่วยโรคไต (CKD) 😿
              </button>
            </div>
          </div>

          {/* Diet Toggle */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-saba-ink block">
              🍲 อาหารหลักในมื้อประจำวัน:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDiet("dry")}
                className={`py-2.5 rounded-xl text-xs font-bold font-cute transition-all duration-200 border ${
                  diet === "dry"
                    ? "bg-saba-orange border-saba-orange text-white shadow-md shadow-orange-100"
                    : "bg-white border-saba-line text-saba-ink hover:bg-black/5"
                }`}
              >
                อาหารเม็ด (แห้ง) 🍖
              </button>
              <button
                type="button"
                onClick={() => setDiet("wet")}
                className={`py-2.5 rounded-xl text-xs font-bold font-cute transition-all duration-200 border ${
                  diet === "wet"
                    ? "bg-saba-orange border-saba-orange text-white shadow-md shadow-orange-100"
                    : "bg-white border-saba-line text-saba-ink hover:bg-black/5"
                }`}
              >
                อาหารเปียก (ฉ่ำๆ) 🍲
              </button>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 space-y-3">
          <p className="text-[11px] text-amber-800 leading-relaxed">
            เครื่องมือและเนื้อหานี้จัดทำขึ้นเพื่อเป็นข้อมูลความรู้และการดูแลเบื้องต้นร่วมกับสัตวแพทย์เท่านั้น
            ไม่ใช่การวินิจฉัยหรือคำแนะนำทางการแพทย์ทดแทนสัตวแพทย์ผู้มีใบอนุญาต หากเจ้านายมีอาการซึม
            อาเจียน หรือไม่กินน้ำเกิน 24 ชั่วโมง โปรดนำส่งโรงพยาบาลสัตว์ทันที
          </p>
          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={consentChecked}
              onChange={(e) => setConsentChecked(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded text-saba-orange border-saba-line focus:ring-saba-orange accent-saba-orange"
            />
            <span className="text-[11px] text-saba-ink font-semibold">
              ฉันเข้าใจว่าข้อมูลนี้เป็นเพียงการประเมินเบื้องต้น และจะปรึกษาสัตวแพทย์ก่อนการปรับเปลี่ยนโภชนาการ
            </span>
          </label>
        </div>

        {/* Result Area */}
        <div className="border border-saba-line rounded-2xl overflow-hidden min-h-[160px] flex flex-col justify-center bg-white transition-all duration-300">
          {!consentChecked ? (
            /* Locked View */
            <div className="p-6 text-center space-y-2 flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-saba-bg2 flex items-center justify-center border border-saba-line text-saba-muted">
                <Lock className="w-4 h-4" />
              </div>
              <p className="text-xs font-bold text-saba-muted font-cute">
                ติ๊กยินยอมด้านบนเพื่อดูผลลัพธ์
              </p>
            </div>
          ) : (
            /* Unlocked View */
            <div className="p-5 space-y-4">
              <div className="text-center space-y-1">
                <p className="text-[10px] text-saba-muted font-bold font-cute uppercase tracking-wider">
                  ปริมาณน้ำที่แนะนำต่อวัน
                </p>
                <p className="text-2xl font-bold font-heading text-saba-orange">
                  {waterVal} <span className="text-base text-saba-black">ml/วัน</span>
                </p>
              </div>

              {/* Syringe count guide */}
              <div className="bg-saba-bg2 border border-saba-line rounded-xl px-3 py-2 text-center">
                <p className="text-xs text-saba-ink font-semibold">
                  เทียบเท่ากับไซริงค์ขนาด 10 ml จำนวน{" "}
                  <span className="text-saba-orange font-bold text-sm">{syringeCount}</span>{" "}
                  หลอด
                </p>
              </div>

              {/* Progress Bar with Water Wave style */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-saba-muted font-cute">
                  <span>ระดับความต้องการน้ำ</span>
                  <span>{percentage}%</span>
                </div>
                <div className="w-full bg-saba-bg2 rounded-full h-3.5 overflow-hidden border border-saba-line p-0.5">
                  <div
                    style={{ width: `${percentage}%` }}
                    className="bg-saba-orange h-full rounded-full transition-all duration-500 ease-out relative overflow-hidden"
                  >
                    {/* Water Wave Effect */}
                    <div className="absolute inset-0 bg-white/10 animate-[pulse_2s_infinite]"></div>
                  </div>
                </div>
              </div>

              {/* Formula Footnote */}
              <div className="bg-saba-bg2 border border-saba-line rounded-xl p-2.5 font-mono text-[9px] text-saba-muted break-all">
                <p className="font-bold text-[10px] text-saba-ink font-heading mb-0.5">สูตรการคำนวณ:</p>
                {formulaString}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

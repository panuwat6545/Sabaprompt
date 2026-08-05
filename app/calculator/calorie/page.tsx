'use client';

import React, { useState } from "react";
import Link from "next/link";
import { Lock, Flame } from "lucide-react";

type LifeStage = 'neutered_adult' | 'intact_adult' | 'weight_loss' | 'weight_gain' | 'kitten';

export default function CalorieCalculator() {
  const [weight, setWeight] = useState<number>(4.0);
  const [lifeStage, setLifeStage] = useState<LifeStage>('neutered_adult');
  const [consentChecked, setConsentChecked] = useState<boolean>(false);

  const lifeStageFactors = {
    neutered_adult: 1.2,
    intact_adult: 1.4,
    weight_loss: 0.8,
    weight_gain: 1.3,
    kitten: 2.5,
  };

  const multiplierLabels = {
    neutered_adult: "×1.2",
    intact_adult: "×1.4",
    weight_loss: "×0.8",
    weight_gain: "×1.3",
    kitten: "×2.5",
  };

  const lifeStageLabels = {
    neutered_adult: "แมวโตทำหมันแล้ว 😺",
    intact_adult: "แมวโตยังไม่ทำหมัน 😼",
    weight_loss: "ลดน้ำหนัก 🥗",
    weight_gain: "เพิ่มน้ำหนัก 🍗",
    kitten: "ลูกแมว (<1 ปี) 👶🐾",
  };

  // Calculations
  const rer = 70 * Math.pow(weight, 0.75);
  const factor = lifeStageFactors[lifeStage];
  const mer = rer * factor;
  const foodGrams = mer / 3.5;

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
          <Link href="/calculator/water" className="text-saba-orange hover:underline">
            สลับไปคำนวณน้ำ →
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 flex-1 space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-xl font-bold font-heading text-saba-black flex items-center justify-center gap-2">
            <Flame className="w-5 h-5 text-saba-orange fill-saba-orange/20 animate-pulse" />
            เครื่องคำนวณแคลอรีประจำวัน (RER & MER)
          </h1>
          <p className="text-xs text-saba-muted font-cute">คำนวณความต้องการพลังงานและปริมาณอาหารที่เจ้านายต้องการ</p>
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

          {/* Life Stage Stacked Toggles */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-saba-ink block">
              🧬 ช่วงวัยและสภาวะร่างกาย:
            </label>
            <div className="flex flex-col gap-2">
              {(Object.keys(lifeStageFactors) as LifeStage[]).map((stage) => (
                <button
                  key={stage}
                  type="button"
                  onClick={() => setLifeStage(stage)}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all duration-200 border flex items-center justify-between ${
                    lifeStage === stage
                      ? "bg-saba-orange border-saba-orange text-white shadow-md shadow-orange-100"
                      : "bg-white border-saba-line text-saba-ink hover:bg-black/5"
                  }`}
                >
                  <span className="font-cute">{lifeStageLabels[stage]}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    lifeStage === stage ? "bg-white/20 text-white" : "bg-saba-bg2 text-saba-muted border border-saba-line"
                  }`}>
                    {multiplierLabels[stage]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Conditional Note for Kitten */}
          {lifeStage === 'kitten' && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-2.5 text-[10px] text-amber-800 font-semibold flex items-center gap-1.5 animate-fade-in">
              <span>⚠️ ลูกแมวมีความต้องการพลังงานเฉพาะตัวสูง แนะนำปรึกษาสัตวแพทย์เพื่อความแม่นยำ</span>
            </div>
          )}
        </div>

        {/* Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 space-y-3">
          <p className="text-[11px] text-amber-800 leading-relaxed">
            เครื่องมือและเนื้อหานี้จัดทำขึ้นเพื่อเป็นข้อมูลความรู้และการดูแลเบื้องต้นร่วมกับสัตวแพทย์เท่านั้น
            ไม่ใช่การวินิจฉัยหรือคำแนะนำทางการแพทย์ทดแทนสัตวแพทย์ผู้มีใบอนุญาต หากเจ้านายมีอาการซึม
            อาเจียน หรือไม่กินอาหารเกิน 24 ชั่วโมง โปรดนำส่งโรงพยาบาลสัตว์ทันที
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
        <div className="border border-saba-line rounded-2xl overflow-hidden min-h-[180px] flex flex-col justify-center bg-white transition-all duration-300">
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
              <div className="grid grid-cols-2 divide-x divide-saba-line border-b border-saba-line pb-4">
                <div className="text-center px-2">
                  <p className="text-[9px] text-saba-muted font-bold font-cute uppercase tracking-wider">
                    พลังงานพื้นฐาน (RER)
                  </p>
                  <p className="text-lg font-bold font-heading text-saba-black mt-1">
                    {Math.round(rer)} <span className="text-xs font-normal">kcal/วัน</span>
                  </p>
                </div>
                <div className="text-center px-2">
                  <p className="text-[9px] text-saba-muted font-bold font-cute uppercase tracking-wider">
                    พลังงานที่ต้องการจริง (MER)
                  </p>
                  <p className="text-xl font-bold font-heading text-saba-orange mt-1">
                    {Math.round(mer)} <span className="text-xs font-normal text-saba-black">kcal/วัน</span>
                  </p>
                </div>
              </div>

              {/* Food portion guide */}
              <div className="bg-saba-bg2 border border-saba-line rounded-xl px-3 py-2 text-center space-y-1">
                <p className="text-xs text-saba-ink font-semibold">
                  คิดเป็นอาหารเม็ดโดยประมาณ:{" "}
                  <span className="text-saba-orange font-bold text-base">{foodGrams.toFixed(1)}</span>{" "}
                  กรัม/วัน
                </p>
                <p className="text-[9px] text-saba-muted font-cute">
                  ค่าประมาณ — ตรวจฉลากอาหารจริงของเจ้านายเพื่อความแม่นยำ (อ้างอิงพลังงาน 350 kcal/100g)
                </p>
              </div>

              {/* Formula Footnote */}
              <div className="bg-saba-bg2 border border-saba-line rounded-xl p-2.5 font-mono text-[9px] text-saba-muted space-y-1 select-all">
                <p className="font-bold text-[10px] text-saba-ink font-heading mb-0.5">สูตรการคำนวณ:</p>
                <p>RER = 70 × {weight.toFixed(1)}^0.75 = {Math.round(rer)} kcal/วัน</p>
                <p>MER = {Math.round(rer)} × {factor.toFixed(1)} ({lifeStageLabels[lifeStage].replace(/ [^\s]+$/, '')}) = {Math.round(mer)} kcal/วัน</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

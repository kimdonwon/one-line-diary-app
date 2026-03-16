"use client";

import React, { useState, useEffect, useRef } from "react";
import { toPng } from "html-to-image";

// --- Constants ---
const CANVAS_W = 1320;
const CANVAS_H = 2868;

const THEME = {
  bg: "#F7F3F0",
  fg: "#4A3728",
  accent: "#FEE97D", // surprised mood color
  muted: "#9E8E82",
};

const SCREENSHOTS = [
  {
    src: "/screenshots/Screenshot_20260315_142704_Expo Go.jpg",
    label: "자유로운 꾸미기",
    headline: "나만의 색깔로<br />다이어리를 꾸며보세요",
  },
  {
    src: "/screenshots/Screenshot_20260315_142933_Expo Go.jpg",
    label: "요약 페이지",
    headline: "한 눈에 보는<br />나의 하루 키워드",
  },
  {
    src: "/screenshots/Screenshot_20260315_142943_Expo Go.jpg",
    label: "활동 분석",
    headline: "어떤 활동을 하며<br />시간을 보냈나요?",
  },
  {
    src: "/screenshots/Screenshot_20260315_142950_Expo Go.jpg",
    label: "귀여운 이모지",
    headline: "감정을 담은<br />귀여운 캐릭터들",
  },
  {
    src: "/screenshots/Screenshot_20260315_142954_Expo Go.jpg",
    label: "간편한 기록",
    headline: "오늘을 한 줄로<br />가볍게 기록하세요",
  },
  {
    src: "/screenshots/Screenshot_20260315_143000_Expo Go.jpg",
    label: "성장 기록",
    headline: "하루하루 쌓여가는<br />나만의 성장 일지",
  },
];

// --- Mockup Helpers (from SKILL.md) ---
const MK_W = 1022;
const MK_H = 2082;
const SC_L = (52 / MK_W) * 100;
const SC_T = (46 / MK_H) * 100;
const SC_W = (918 / MK_W) * 100;
const SC_H = (1990 / MK_H) * 100;
const SC_RX = (126 / 918) * 100;
const SC_RY = (126 / 1990) * 100;

function Phone({ src, className = "", style = {} }: { src: string; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`relative ${className}`} style={{ aspectRatio: `${MK_W}/${MK_H}`, ...style }}>
      <img src="/mockup.png" alt="" className="block w-full h-full" draggable={false} />
      <div
        className="absolute z-10 overflow-hidden"
        style={{
          left: `${SC_L}%`,
          top: `${SC_T}%`,
          width: `${SC_W}%`,
          height: `${SC_H}%`,
          borderRadius: `${SC_RX}% / ${SC_RY}%`,
        }}
      >
        <img src={src} alt="" className="block w-full h-full object-cover object-top" draggable={false} />
      </div>
    </div>
  );
}

// --- Screenshot Slide Component ---
function Slide({
  index,
  data,
  canvasRef,
}: {
  index: number;
  data: (typeof SCREENSHOTS)[0];
  canvasRef: React.RefObject<HTMLDivElement | null>;
}) {
  const isOdd = index % 2 !== 0;
  const W = CANVAS_W;

  return (
    <div
      ref={canvasRef}
      className="relative flex flex-col items-center overflow-hidden"
      style={{
        width: W,
        height: CANVAS_H,
        backgroundColor: isOdd ? THEME.fg : THEME.bg,
        color: isOdd ? THEME.bg : THEME.fg,
        fontFamily: "Inter, sans-serif", // Fallback to Inter
      }}
    >
      {/* Background Decor */}
      <div
        className="absolute w-[150%] h-[50%] blur-[120px] opacity-20"
        style={{
          background: `radial-gradient(circle, ${THEME.accent} 0%, transparent 70%)`,
          top: "-10%",
          left: "-25%",
        }}
      />

      <div className="relative z-10 w-full pt-[180px] px-[120px] text-center">
        <p
          className="uppercase tracking-[0.2em] mb-8"
          style={{ fontSize: W * 0.028, color: isOdd ? THEME.accent : THEME.muted, fontWeight: 600 }}
        >
          {data.label}
        </p>
        <h1
          className="leading-[1.1] font-bold"
          style={{ fontSize: W * 0.095 }}
          dangerouslySetInnerHTML={{ __html: data.headline }}
        />
      </div>

      <div className="absolute bottom-[-100px] w-full flex justify-center">
        <Phone
          src={data.src}
          style={{
            width: "86%",
            transform: `translateY(10%) rotate(${isOdd ? "-3deg" : "3deg"})`,
            boxShadow: "0 50px 100px -20px rgba(0,0,0,0.3)",
          }}
        />
      </div>
    </div>
  );
}

// --- Main Page ---
export default function ScreenshotsPage() {
  const [exporting, setExporting] = useState(false);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleExportAll = async () => {
    setExporting(true);
    try {
      for (let i = 0; i < SCREENSHOTS.length; i++) {
        const el = slideRefs.current[i];
        if (!el) continue;

        // Ensure visible for capture
        const originalStyle = el.getAttribute("style") || "";
        el.setAttribute("style", originalStyle + "; position: absolute; left: 0; top: 0; z-index: 9999;");

        const opts = { width: CANVAS_W, height: CANVAS_H, pixelRatio: 1, cacheBust: true };
        
        // Double-call trick for fonts/images
        await toPng(el, opts);
        const dataUrl = await toPng(el, opts);

        // Reset style
        el.setAttribute("style", originalStyle);

        const link = document.createElement("a");
        link.download = `${String(i + 1).padStart(2, "0")}-screenshot-${SCREENSHOTS[i].label}.png`;
        link.href = dataUrl;
        link.click();

        await new Promise((r) => setTimeout(r, 500));
      }
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      setExporting(false);
    }
  };

  return (
    <main className="min-h-screen bg-neutral-900 p-8 text-white">
      <header className="max-w-7xl mx-auto flex justify-between items-center mb-12">
        <div>
          <h1 className="text-3xl font-bold mb-2">App Store Screenshots Generator</h1>
          <p className="text-neutral-400">Android Screenshot Resolution: 1320x2868 (Portrait)</p>
        </div>
        <button
          onClick={handleExportAll}
          disabled={exporting}
          className="bg-amber-400 hover:bg-amber-300 disabled:bg-neutral-700 text-black font-bold py-4 px-8 rounded-full transition-all scale-100 active:scale-95 shadow-xl"
        >
          {exporting ? "Exporting..." : "Download All Screenshots"}
        </button>
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {SCREENSHOTS.map((data, i) => (
          <div key={i} className="flex flex-col gap-4">
            <div className="bg-neutral-800 rounded-3xl overflow-hidden shadow-2xl relative group">
              {/* Preview Scale */}
              <div
                style={{
                  width: CANVAS_W,
                  height: CANVAS_H,
                  transform: `scale(${400 / CANVAS_W})`,
                  transformOrigin: "top left",
                }}
              >
                <Slide
                  index={i}
                  data={data}
                  canvasRef={(el) => (slideRefs.current[i] = el)}
                />
              </div>
              <div 
                style={{ height: (CANVAS_H * (400 / CANVAS_W)) }} 
                className="w-full pointer-events-none"
              />
            </div>
            <div className="px-4">
              <h3 className="text-xl font-semibold">{data.label}</h3>
              <p className="text-neutral-500 text-sm">Slide {i + 1}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Hidden container for full-res capture if needed, 
          but we are using the refs in the grid and temporarily moving them */}
    </main>
  );
}

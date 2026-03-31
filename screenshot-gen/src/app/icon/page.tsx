"use client";

import React, { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { FrogCharacter, CatCharacter, ChickCharacter, BearCharacter, RabbitCharacter } from "./MoodCharacters";
import { CloudSticker, SunSticker } from "./DoodleStickers";

export default function IconPage() {
  const iconRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    if (!iconRef.current) return;
    setExporting(true);
    try {
      const el = iconRef.current;
      const opts = { width: 1024, height: 1024, pixelRatio: 1, cacheBust: true };

      // Double trigger to ensure SVGs and fonts render perfectly
      await toPng(el, opts);
      const dataUrl = await toPng(el, opts);

      const link = document.createElement("a");
      link.download = `app-icon.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error(err);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col items-center justify-center p-8">
      <div className="mb-8">
        <button
          onClick={handleExport}
          disabled={exporting}
          className="bg-amber-400 hover:bg-amber-300 disabled:bg-neutral-700 text-black font-bold py-3 px-6 rounded-full"
        >
          {exporting ? "출력 중..." : "아이콘 다운로드 (1024x1024)"}
        </button>
      </div>

      {/* 1024x1024 Icon Canvas */}
      <div
        ref={iconRef}
        className="relative overflow-hidden flex items-center justify-center"
        style={{ width: 1024, height: 1024, backgroundColor: "#4ADE80" }}
      >
        {/* White Notepad Base */}
        <div
          className="relative bg-white"
          style={{
            width: 640,
            height: 640,
            borderRadius: 64,
            marginLeft: 40, // re-balance for 640 width to keep the whole unit centered
            boxShadow: "0 40px 80px rgba(0,0,0,0.15)",
            // background: "#f5f5f5ff"
          }}
        >
          {/* 3D Binder Rings with Holes */}
          <div className="absolute h-full left-[-45px] flex flex-col justify-center items-center">
            <div className="flex flex-col gap-[120px] z-10">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="relative flex items-center justify-center" style={{ width: 120, height: 60 }}>
                  {/* Paper Hole */}
                  <div
                    style={{
                      position: 'absolute',
                      right: 10,
                      width: 52,
                      height: 52,
                      backgroundColor: '#c9c4c4ff',
                      borderRadius: '50%',
                      boxShadow: 'inset 0 4px 8px rgba(0,0,0,0.2), 0 2px 4px rgba(255,255,255,0.8)',
                      zIndex: 1
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Minimalist Frog - Perfectly Centered in Paper */}
          <div className="w-full h-full relative flex items-center justify-center">
            <div style={{ transform: "scale(8.0)", marginTop: "-10px" }}>
              <FrogCharacter size={48} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

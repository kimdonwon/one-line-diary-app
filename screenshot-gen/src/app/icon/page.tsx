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
            width: 800,
            height: 800,
            borderRadius: 80,
            marginLeft: 50, // shift slightly right to accommodate rings
            boxShadow: "0 40px 80px rgba(0,0,0,0.15)",
            // background: "#f5f5f5ff"
          }}
        >
          {/* 3D Binder Rings with Holes */}
          <div className="absolute h-full left-[-45px] flex flex-col justify-center items-center">
            <div className="flex flex-col gap-[90px] z-10">
              {[...Array(5)].map((_, i) => (
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

          {/* Stickers Content */}
          <div className="w-full h-full pl-[100px] pr-10 py-10 flex flex-col items-center justify-center gap-[40px]">
            {/* Top Row */}
            <div className="flex justify-center gap-[50px]">
              <div
                className="flex items-center justify-center rounded-[30px]"
                style={{ width: 180, height: 180, backgroundColor: "#E6F2FF", transform: "rotate(-5deg)" }}
              >
                <div style={{ transform: "scale(2.0)" }}>
                  <CloudSticker size={50} style={{}} />
                </div>
              </div>
              <div
                className="flex items-center justify-center rounded-[30px]"
                style={{ width: 180, height: 180, backgroundColor: "#FFF0DC", transform: "rotate(3deg)" }}
              >
                <div style={{ transform: "scale(2.0)" }}>
                  <SunSticker size={50} style={{}} />
                </div>
              </div>
            </div>

            {/* Middle Row */}
            <div className="flex justify-center gap-[40px]">
              <div
                className="flex items-center justify-center rounded-[30px]"
                style={{ width: 180, height: 180, backgroundColor: "#E6F2FF", transform: "rotate(-2deg)" }}
              >
                <div style={{ transform: "scale(2.5)", marginTop: "-10px" }}>
                  <CatCharacter size={48} />
                </div>
              </div>
              <div
                className="flex items-center justify-center rounded-[30px]"
                style={{ width: 180, height: 180, backgroundColor: "#E1F8E8", transform: "rotate(0deg)" }}
              >
                <div style={{ transform: "scale(2.5)", marginTop: "-10px" }}>
                  <FrogCharacter size={48} />
                </div>
              </div>
              <div
                className="flex items-center justify-center rounded-[30px]"
                style={{ width: 180, height: 180, backgroundColor: "#F6E8FF", transform: "rotate(4deg)" }}
              >
                <div style={{ transform: "scale(2.5)", marginTop: "-10px" }}>
                  <RabbitCharacter size={48} />
                </div>
              </div>
            </div>

            {/* Bottom Row */}
            <div className="flex justify-center gap-[50px]">
              <div
                className="flex items-center justify-center rounded-[30px]"
                style={{ width: 180, height: 180, backgroundColor: "#FFEBDE", transform: "rotate(-3deg)" }}
              >
                <div style={{ transform: "scale(2.5)", marginTop: "-10px" }}>
                  <BearCharacter size={48} />
                </div>
              </div>
              <div
                className="flex items-center justify-center rounded-[30px]"
                style={{ width: 180, height: 180, backgroundColor: "#FFF0DC", transform: "rotate(5deg)" }}
              >
                <div style={{ transform: "scale(2.5)", marginTop: "-10px" }}>
                  <ChickCharacter size={48} />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

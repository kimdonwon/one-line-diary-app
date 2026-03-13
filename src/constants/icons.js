// 🎨 아이콘 SVG — 디자인 전용
// 앱 전체에서 사용하는 아이콘들을 한 곳에 모아 관리

import React from 'react';
import Svg, { Rect, Circle, Line, Path } from 'react-native-svg';

// ─── 미니 바 차트 아이콘 ───
// 섹션 타이틀 / 플로팅 버튼 등에서 사용
// mono=true: 흑백 (섹션 타이틀용), mono=false: 컬러 (플로팅 버튼용)
export function MiniChartIcon({ size = 18, mono = false, style }) {
    const c1 = mono ? '#C8BEB7' : '#7CD4A0';  // happy
    const c2 = mono ? '#9E8E82' : '#8BBFEF';  // sad
    const c3 = mono ? '#4A3728' : '#FFD485';  // surprised
    return (
        <Svg width={size} height={size} viewBox="0 0 18 18" style={[{ marginRight: 6 }, style]}>
            <Rect x="1" y="10" width="4" rx="1.5" height="7" fill={c1} />
            <Rect x="7" y="4" width="4" rx="1.5" height="13" fill={c2} />
            <Rect x="13" y="7" width="4" rx="1.5" height="10" fill={c3} />
        </Svg>
    );
}

// ─── 돋보기 로고 아이콘 (Doodle Flash: No Outlines) ───
export function SearchIcon({ size = 20, color = "#4A3728", style }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
            <Path
                d="M11 2C6.03 2 2 6.03 2 11c0 4.97 4.03 9 9 9 2.1 0 4.03-.71 5.56-1.9L21.07 22.5 22.5 21.07l-4.4-4.51C19.29 15.03 20 13.1 20 11c0-4.97-4.03-9-9-9zm0 2c3.87 0 7 3.13 7 7s-3.13 7-7 7-7-3.13-7-7 3.13-7 7-7z"
                fill={color}
            />
        </Svg>
    );
}

// ─── X 닫기/취소 로고 아이콘 (Doodle Flash: No Outlines) ───
export function CloseIcon({ size = 20, color = "#4A3728", style }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
            <Path
                d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                fill={color}
            />
        </Svg>
    );
}

// ─── 하단 탭 내비게이션 라인 아이콘 ───
export function SelectedHomeTabIcon({ size = 24, color }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <Path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <Path d="M9 22V12h6v10" />
        </Svg>
    );
}

export function HomeTabIcon({ size = 24, color }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <Path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <Path d="M9 22V12h6v10" />
        </Svg>
    );
}

export function StatsTabIcon({ size = 24, color }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <Path d="M18 20V10" />
            <Path d="M12 20V4" />
            <Path d="M6 20v-6" />
        </Svg>
    );
}

export function SelectedStatsTabIcon({ size = 24, color }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <Path d="M18 20V10" />
            <Path d="M12 20V4" />
            <Path d="M6 20v-6" />
        </Svg>
    );
}

export function ProfileTabIcon({ size = 24, color }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <Circle cx="12" cy="7" r="4" />
        </Svg>
    );
}

export function SelectedProfileTabIcon({ size = 24, color }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <Circle cx="12" cy="7" r="4" />
        </Svg>
    );
}

export function SettingsTabIcon({ size = 24, color }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <Circle cx="12" cy="12" r="3" />
            <Path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </Svg>
    );
}

export function SelectedSettingsTabIcon({ size = 24, color }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <Circle cx="12" cy="12" r="3" />
            <Path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </Svg>
    );
}

export function PlusButtonIcon({ size = 28, color = "#FFFFFF" }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <Line x1="12" y1="5" x2="12" y2="19" />
            <Line x1="5" y1="12" x2="19" y2="12" />
        </Svg>
    );
}

// ─── 다이어리 피드 탭 아이콘 (Book/Journal) ───
export function DiaryTabIcon({ size = 24, color }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <Path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <Path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </Svg>
    );
}

export function SelectedDiaryTabIcon({ size = 24, color }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <Path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <Path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </Svg>
    );
}

// ─── 요약 탭 아이콘 (Pie Chart) ───
export function SummaryTabIcon({ size = 24, color }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <Path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
            <Path d="M22 12A10 10 0 0 0 12 2v10z" />
        </Svg>
    );
}

export function SelectedSummaryTabIcon({ size = 24, color }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <Path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
            <Path d="M22 12A10 10 0 0 0 12 2v10z" />
        </Svg>
    );
}

// ─── 형광펜 아이콘 ───
export function HighlighterIcon({ size = 24, color = '#FFE066' }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <Path d="M18.37 2.63L14 7l-1.59-1.59a2 2 0 00-2.82 0L8 7l9 9 1.59-1.59a2 2 0 000-2.82L17 10l4.37-4.37a2.12 2.12 0 10-3-3z" />
            <Path d="M9 8l-5 5v4h4l5-5" />
            <Path d="M14.5 17.5L4.5 21.5l4-10" />
        </Svg>
    );
}

// ─── 되돌리기 (Undo) 아이콘 ───
export function UndoIcon({ size = 20, color = "#37352F" }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <Path d="M3 7v6h6" />
            <Path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
        </Svg>
    );
}

// ─── 전체 지우기 (Trash) 아이콘 ───
export function TrashIcon({ size = 20, color = "#37352F" }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <Path d="M3 6h18" />
            <Path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </Svg>
    );
}

// ─── 펜 메뉴 아이콘 ───
export function PenMenuIcon({ size = 24, color = "#37352F" }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <Circle cx="12" cy="12" r="1.5" />
            <Circle cx="12" cy="5" r="1.5" />
            <Circle cx="12" cy="19" r="1.5" />
        </Svg>
    );
}

// ─── X 아이콘 ───
export function XIcon({ size = 24, color = "#37352F" }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <Line x1="18" y1="6" x2="6" y2="18" />
            <Line x1="6" y1="6" x2="18" y2="18" />
        </Svg>
    );
}

// ─── 메시지/댓글 다이어로그 아이콘 ───
export function MessageCircleIcon({ size = 20, color = "#666666" }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <Path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </Svg>
    );
}

// ─── 카메라 아이콘 (Doodle Flash: Line Art with Flash Rays) ───
export function CameraIcon({ size = 24, color = "#2D1E16", style }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={style}>
            {/* Flash Rays (광선) */}
            <Path d="M12 1.5v2M7.5 3.5l1.2 1.2M3.5 7l2 .5M16.5 3.5l-1.2 1.2M20.5 7l-2 .5" fill="none" />

            {/* Top Bump (셔터/뷰파인더) */}
            <Path d="M9 9V7.5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1V9" fill="none" />

            {/* Body (본체) */}
            <Rect x="3" y="9" width="18" height="12" rx="2.5" fill="none" />

            {/* Lens (렌즈) */}
            <Circle cx="12" cy="15" r="3.5" fill="none" />
            <Circle cx="12" cy="15" r="1.2" strokeWidth="1.2" fill="none" />

            {/* Small Detail */}
            <Circle cx="18" cy="12" r="0.8" strokeWidth="1" fill="none" />
        </Svg>
    );
}

// ─── 스티커 아이콘 (Doodle Flash: Line Art Sparkling Sticker) ───
export function StickerIcon({ size = 24, active = false, style }) {
    const color = active ? "#2D1E16" : "#8B7E74"; // 활성: 딥브라운, 비활성: 딥 그레이베이지

    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={style}>
            {/* Sparkles (상단 반짝임) */}
            <Path d="M12 2v2M8 4l1 1M16 4l-1 1" fill="none" />

            {/* Sticker Body */}
            <Path
                d="M6 7h12a2 2 0 0 1 2 2v7l-4 4H6a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z"
                fill="none"
            />
            {/* 접힌 모서리 부분 */}
            <Path
                d="M20 16l-4 4v-2a2 2 0 0 1 2-2h2z"
                fill="none"
            />

            {/* Petit Face (귀여운 미소) */}
            <Circle cx="9" cy="12" r="0.8" strokeWidth="1" fill="none" />
            <Circle cx="13" cy="12" r="0.8" strokeWidth="1" fill="none" />
            <Path d="M10 15c.5.5 1.5.5 2 0" fill="none" />
        </Svg>
    );
}

// ─── 텍스트 아이콘 (Doodle Flash: Gizmo Box with 'T') ───
// 사용자가 제공한 바운딩 박 형태를 우리 스타일(코랄 포인트 + 반짝임)로 재해석
export function TextIcon({ size = 24, active = false, style }) {
    const color = active ? "#2D1E16" : "#8B7E74"; // 활성: 딥브라운, 비활성: 딥 그레이베이지

    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={style}>
            {/* Bounding Box Frame */}
            <Rect x="4" y="4" width="16" height="16" strokeWidth="1.5" fill="none" />

            {/* Gizmo Handles (4 corners) */}
            <Rect x="2.5" y="2.5" width="3.5" height="3.5" rx="1" fill="none" />
            <Rect x="18" y="2.5" width="3.5" height="3.5" rx="1" fill="none" />
            <Rect x="2.5" y="18" width="3.5" height="3.5" rx="1" fill="none" />
            <Rect x="18" y="18" width="3.5" height="3.5" rx="1" fill="none" />

            {/* 'T' Character (Bold) */}
            <Path d="M8.5 9h7M12 9v7" strokeWidth="2.2" fill="none" />
        </Svg>
    );
}

// ─── 페이지 추가 아이콘 (Doodle Flash: Line Art Document with Plus) ───
export function PageAddIcon({ size = 24, color = "#8B7E74", style }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={style}>
            {/* Document Frame */}
            <Path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <Path d="M14 2v6h6" />

            {/* Plus Symbol */}
            <Line x1="12" y1="12" x2="12" y2="18" strokeWidth="2" />
            <Line x1="9" y1="15" x2="15" y2="15" strokeWidth="2" />
        </Svg>
    );
}

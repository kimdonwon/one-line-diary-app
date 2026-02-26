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

// 🍰 소프트 파스텔 SVG 캐릭터
// 변경: 굵은 검정 → 따뜻한 브라운 라인, 더 큰 눈 하이라이트, 볼 홍조 강조
// react-native-svg 기반 - 모든 사이즈에서 선명한 벡터 렌더링

import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, Ellipse, Path, Rect, G, Line } from 'react-native-svg';

const LINE = '#5C4033';  // 따뜻한 브라운 라인 (검정 대신)
const LW = 2.5;          // 기본 선 두께 (4 → 2.5로 가벼워짐)

// ─── 🐸 개구리 (기쁨 / HAPPY) ───
// 동그란 파스텔 그린 얼굴, 큰 반짝이 눈, 활짝 웃는 입
function FrogCharacter({ size = 48 }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 100 100">
            {/* 왼쪽 눈 배경 */}
            <Circle cx="32" cy="28" r="18" fill="#7CD4A0" stroke={LINE} strokeWidth={LW} />
            <Circle cx="32" cy="28" r="12" fill="#fff" stroke={LINE} strokeWidth={LW - 0.5} />
            <Circle cx="34" cy="26" r="5" fill="#4A3728" />
            <Circle cx="36" cy="23" r="3" fill="#fff" />

            {/* 오른쪽 눈 배경 */}
            <Circle cx="68" cy="28" r="18" fill="#7CD4A0" stroke={LINE} strokeWidth={LW} />
            <Circle cx="68" cy="28" r="12" fill="#fff" stroke={LINE} strokeWidth={LW - 0.5} />
            <Circle cx="70" cy="26" r="5" fill="#4A3728" />
            <Circle cx="72" cy="23" r="3" fill="#fff" />

            {/* 몸통 */}
            <Ellipse cx="50" cy="62" rx="38" ry="30" fill="#7CD4A0" stroke={LINE} strokeWidth={LW} />

            {/* 볼 홍조 (더 선명하게) */}
            <Ellipse cx="25" cy="62" rx="9" ry="5" fill="#FFB5B5" opacity="0.7" />
            <Ellipse cx="75" cy="62" rx="9" ry="5" fill="#FFB5B5" opacity="0.7" />

            {/* 입 (활짝 웃는 큰 미소) */}
            <Path d="M 28 64 Q 50 88 72 64" fill="none" stroke={LINE} strokeWidth={LW} strokeLinecap="round" />

            {/* 콧구멍 */}
            <Circle cx="43" cy="56" r="2" fill="#5DA870" />
            <Circle cx="57" cy="56" r="2" fill="#5DA870" />
        </Svg>
    );
}

// ─── 🐱 고양이 (슬픔 / SAD) ───
// 파스텔 블루, 작은 귀, 검은 눈동자, 잘 보이는 눈물
function CatCharacter({ size = 48 }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 100 100">
            {/* 귀 (작게) */}
            <Path d="M 22 38 L 18 22 L 38 32 Z" fill="#8BBFEF" stroke={LINE} strokeWidth={LW} strokeLinejoin="round" />
            <Path d="M 25 35 L 22 27 L 34 33 Z" fill="#FFDDE4" />

            <Path d="M 78 38 L 82 22 L 62 32 Z" fill="#8BBFEF" stroke={LINE} strokeWidth={LW} strokeLinejoin="round" />
            <Path d="M 75 35 L 78 27 L 66 33 Z" fill="#FFDDE4" />

            {/* 얼굴 */}
            <Ellipse cx="50" cy="58" rx="40" ry="34" fill="#8BBFEF" stroke={LINE} strokeWidth={LW} />

            {/* 눈 ( >< 감은 눈 ) */}
            <Path d="M 28 44 L 34 50 L 28 56" fill="none" stroke={LINE} strokeWidth={LW} strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M 72 44 L 66 50 L 72 56" fill="none" stroke={LINE} strokeWidth={LW} strokeLinecap="round" strokeLinejoin="round" />

            {/* 눈물 (흰색으로 잘 보이게) */}
            <Line x1="34" y1="54" x2="34" y2="76" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
            <Line x1="66" y1="54" x2="66" y2="76" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />

            {/* 볼 홍조 */}
            <Ellipse cx="20" cy="60" rx="7" ry="4" fill="#FFB5B5" opacity="0.8" />
            <Ellipse cx="80" cy="60" rx="7" ry="4" fill="#FFB5B5" opacity="0.8" />

            {/* 코 */}
            <Ellipse cx="50" cy="60" rx="4" ry="2.5" fill="#FFB5B5" stroke={LINE} strokeWidth="1.5" />

            {/* 입 (처진 입) */}
            <Path d="M 44 67 Q 50 63 56 67" fill="none" stroke={LINE} strokeWidth={LW} strokeLinecap="round" />

            {/* 수염 */}
            <Line x1="14" y1="58" x2="26" y2="60" stroke={LINE} strokeWidth="1.5" strokeLinecap="round" />
            <Line x1="12" y1="65" x2="25" y2="64" stroke={LINE} strokeWidth="1.5" strokeLinecap="round" />
            <Line x1="86" y1="58" x2="74" y2="60" stroke={LINE} strokeWidth="1.5" strokeLinecap="round" />
            <Line x1="88" y1="65" x2="75" y2="64" stroke={LINE} strokeWidth="1.5" strokeLinecap="round" />
        </Svg>
    );
}

// ─── 🐥 병아리 (놀람 / SURPRISED) ───
// 파스텔 옐로우, 입을 쫙 벌린 놀란 표정
function ChickCharacter({ size = 48 }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 100 100">
            {/* 머리 깃 */}
            <Path d="M 50 14 Q 44 4 48 10 Q 42 2 50 8 Q 58 2 52 10 Q 56 4 50 14" fill="#FFD485" stroke={LINE} strokeWidth="1.5" />

            {/* 몸통 */}
            <Ellipse cx="50" cy="52" rx="36" ry="34" fill="#FFD485" stroke={LINE} strokeWidth={LW} />

            {/* 왼쪽 날개 (위로 올림 — 놀라서!) */}
            <Path d="M 14 44 Q 6 36 16 30" fill="#F5C34B" stroke={LINE} strokeWidth={LW} strokeLinecap="round" />
            {/* 오른쪽 날개 */}
            <Path d="M 86 44 Q 94 36 84 30" fill="#F5C34B" stroke={LINE} strokeWidth={LW} strokeLinecap="round" />

            {/* 왼쪽 눈 (크게 놀란!) */}
            <Circle cx="36" cy="42" r="12" fill="#fff" stroke={LINE} strokeWidth={LW} />
            <Circle cx="38" cy="40" r="5.5" fill="#4A3728" />
            <Circle cx="40" cy="37" r="2.5" fill="#fff" />

            {/* 오른쪽 눈 */}
            <Circle cx="64" cy="42" r="12" fill="#fff" stroke={LINE} strokeWidth={LW} />
            <Circle cx="66" cy="40" r="5.5" fill="#4A3728" />
            <Circle cx="68" cy="37" r="2.5" fill="#fff" />

            {/* 부리 — 쫙 벌린 입 (위아래 크게!) */}
            <Path d="M 38 58 L 50 50 L 62 58 Z" fill="#FFA94D" stroke={LINE} strokeWidth="1.5" strokeLinejoin="round" />
            <Path d="M 38 62 L 50 78 L 62 62 Z" fill="#FF8C2D" stroke={LINE} strokeWidth="1.5" strokeLinejoin="round" />

            {/* 볼 홍조 */}
            <Ellipse cx="20" cy="52" rx="7" ry="4" fill="#FFB5B5" opacity="0.8" />
            <Ellipse cx="80" cy="52" rx="7" ry="4" fill="#FFB5B5" opacity="0.8" />
        </Svg>
    );
}

// ─── 🐙 문어 (당황 / EMBARRASSED) ───
// 파스텔 핑크, 눈이 옆을 봄, 머쓱한 입, 땀방울
function OctopusCharacter({ size = 48 }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 100 100">
            {/* 머리 */}
            <Path d="M 20 55 Q 20 12 50 12 Q 80 12 80 55 L 80 58 L 20 58 Z"
                fill="#FFB5B5" stroke={LINE} strokeWidth={LW} />

            {/* 눈 (옆을 보는 머쓱한 눈) */}
            <Circle cx="36" cy="38" r="10" fill="#fff" stroke={LINE} strokeWidth={LW} />
            <Circle cx="40" cy="38" r="4" fill="#4A3728" />
            <Circle cx="42" cy="36" r="1.5" fill="#fff" />

            <Circle cx="64" cy="38" r="10" fill="#fff" stroke={LINE} strokeWidth={LW} />
            <Circle cx="68" cy="38" r="4" fill="#4A3728" />
            <Circle cx="70" cy="36" r="1.5" fill="#fff" />

            {/* 볼 홍조 (당황! 크고 선명하게) */}
            <Ellipse cx="24" cy="48" rx="9" ry="5" fill="#FF8FAB" opacity="0.9" />
            <Ellipse cx="76" cy="48" rx="9" ry="5" fill="#FF8FAB" opacity="0.9" />

            {/* 입 (머쓱한 일자 + 살짝 비뚤어진 입) */}
            <Path d="M 40 53 L 48 51 L 52 54 L 60 52" fill="none" stroke={LINE} strokeWidth={LW} strokeLinecap="round" strokeLinejoin="round" />

            {/* 다리들 (곱슬) */}
            <Path d="M 22 58 Q 16 70 22 80 Q 28 90 22 95" fill="none" stroke="#FFB5B5" strokeWidth="7" strokeLinecap="round" />
            <Path d="M 22 58 Q 16 70 22 80 Q 28 90 22 95" fill="none" stroke={LINE} strokeWidth="7.5" strokeLinecap="round" opacity="0.08" />

            <Path d="M 38 60 Q 32 72 38 82 Q 44 92 38 97" fill="none" stroke="#FFB5B5" strokeWidth="7" strokeLinecap="round" />
            <Path d="M 38 60 Q 32 72 38 82 Q 44 92 38 97" fill="none" stroke={LINE} strokeWidth="7.5" strokeLinecap="round" opacity="0.08" />

            <Path d="M 62 60 Q 68 72 62 82 Q 56 92 62 97" fill="none" stroke="#FFB5B5" strokeWidth="7" strokeLinecap="round" />
            <Path d="M 62 60 Q 68 72 62 82 Q 56 92 62 97" fill="none" stroke={LINE} strokeWidth="7.5" strokeLinecap="round" opacity="0.08" />

            <Path d="M 78 58 Q 84 70 78 80 Q 72 90 78 95" fill="none" stroke="#FFB5B5" strokeWidth="7" strokeLinecap="round" />
            <Path d="M 78 58 Q 84 70 78 80 Q 72 90 78 95" fill="none" stroke={LINE} strokeWidth="7.5" strokeLinecap="round" opacity="0.08" />

            {/* 땀방울 2개 */}
            <Path d="M 82 20 Q 85 14 88 20 Q 88 26 82 26 Q 79 26 82 20" fill="#D4EEFF" stroke="#8BBFEF" strokeWidth="1.5" />
            <Path d="M 76 12 Q 78 8 80 12 Q 80 16 76 16 Q 74 16 76 12" fill="#D4EEFF" stroke="#8BBFEF" strokeWidth="1" />
        </Svg>
    );
}

// ─── 🐻 곰 (쏘쏘 / SOSO) ───
// 파스텔 그레이, 동그란 귀, 살짝 미소 (무표정 → 미소로 변경)
function BearCharacter({ size = 48 }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 100 100">
            {/* 왼쪽 귀 */}
            <Circle cx="22" cy="22" r="16" fill="#C8BEB7" stroke={LINE} strokeWidth={LW} />
            <Circle cx="22" cy="22" r="8" fill="#E8DDD6" />

            {/* 오른쪽 귀 */}
            <Circle cx="78" cy="22" r="16" fill="#C8BEB7" stroke={LINE} strokeWidth={LW} />
            <Circle cx="78" cy="22" r="8" fill="#E8DDD6" />

            {/* 얼굴 */}
            <Ellipse cx="50" cy="56" rx="38" ry="34" fill="#C8BEB7" stroke={LINE} strokeWidth={LW} />

            {/* 눈 (점 눈 + 하이라이트) */}
            <Circle cx="36" cy="48" r="5" fill="#4A3728" />
            <Circle cx="38" cy="46" r="2" fill="#fff" />
            <Circle cx="64" cy="48" r="5" fill="#4A3728" />
            <Circle cx="66" cy="46" r="2" fill="#fff" />

            {/* 볼 홍조 */}
            <Ellipse cx="24" cy="58" rx="8" ry="5" fill="#FFB5B5" opacity="0.7" />
            <Ellipse cx="76" cy="58" rx="8" ry="5" fill="#FFB5B5" opacity="0.7" />

            {/* 코 주변 */}
            <Ellipse cx="50" cy="64" rx="16" ry="12" fill="#E8DDD6" />

            {/* 코 */}
            <Ellipse cx="50" cy="60" rx="6" ry="4" fill="#4A3728" />
            <Ellipse cx="49" cy="59" rx="2" ry="1.2" fill="#7A6555" />

            {/* 입 (살짝 미소 ← 무표정에서 변경) */}
            <Path d="M 42 68 Q 50 74 58 68" fill="none" stroke={LINE} strokeWidth={LW} strokeLinecap="round" />
        </Svg>
    );
}

// ─── 메인 export: 캐릭터 렌더러 ───
const CHARACTER_MAP = {
    frog: FrogCharacter,
    cat: CatCharacter,
    chick: ChickCharacter,
    octopus: OctopusCharacter,
    bear: BearCharacter,
};

export function MoodCharacter({ character, size = 48 }) {
    const CharComponent = CHARACTER_MAP[character];
    if (!CharComponent) return null;
    return <CharComponent size={size} />;
}

export { FrogCharacter, CatCharacter, ChickCharacter, OctopusCharacter, BearCharacter };

// 🍰 소프트 파스텔 SVG 캐릭터
// 변경: 굵은 검정 → 따뜻한 브라운 라인, 더 큰 눈 하이라이트, 볼 홍조 강조
// react-native-svg 기반 - 모든 사이즈에서 선명한 벡터 렌더링

import React from 'react';
import Svg, { Circle, Ellipse, Path, Rect, G, Line } from 'react-native-svg';

const LINE = '#5C4033';  // 따뜻한 브라운 라인 (검정 대신)
const LW = 2.5;          // 기본 선 두께 (4 → 2.5로 가벼워짐)

// ─── 🐸 개구리 (기쁨 / HAPPY) ───
// 동그란 파스텔 그린 얼굴, 큰 반짝이 눈, 활짝 웃는 입
function FrogCharacter({ size = 48 }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 100 100">
            {/* 왼쪽 눈 */}
            <Circle cx="32" cy="28" r="18" fill="#7CD4A0" stroke={LINE} strokeWidth={LW} />
            <Circle cx="32" cy="28" r="12" fill="#fff" stroke={LINE} strokeWidth={LW - 0.5} />
            <Circle cx="32" cy="28" r="4" fill={LINE} />

            {/* 오른쪽 눈 */}
            <Circle cx="68" cy="28" r="18" fill="#7CD4A0" stroke={LINE} strokeWidth={LW} />
            <Circle cx="68" cy="28" r="12" fill="#fff" stroke={LINE} strokeWidth={LW - 0.5} />
            <Circle cx="68" cy="28" r="4" fill={LINE} />

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
// 유저 제공 도안 기반: 파란색 몸체, U자형 감은 눈, 눈물 한 방울
function CatCharacter({ size = 48 }) {
    const BODY = "#8BBFEF"; // 파란색 고양이
    return (
        <Svg width={size} height={size} viewBox="-2 -2 104 104">
            <G transform="translate(50, 55) scale(1.2) translate(-50, -55)">
                {/* 🐱 고양이 실루엣 (Body & Ears combined) */}
                <Path
                    d="M 22 50 C 22 25, 25 18, 32 15 L 38 32 Q 50 28 62 32 L 68 15 C 75 18, 78 25, 78 50 C 78 85, 22 85, 22 50"
                    fill={BODY}
                    stroke={LINE}
                    strokeWidth={LW}
                    strokeLinejoin="round"
                />

                {/* 🐱 귀 안쪽 라인 (Inner Ear Outlines) */}
                <Path d="M 28 22 L 32 32" fill="none" stroke={LINE} strokeWidth={LW} strokeLinecap="round" />
                <Path d="M 72 22 L 68 32" fill="none" stroke={LINE} strokeWidth={LW} strokeLinecap="round" />

                {/* 🐱 눈 (U-shaped Closed Eyes) */}
                <Path d="M 36 48 Q 41 53 46 48" fill="none" stroke={LINE} strokeWidth={LW} strokeLinecap="round" />
                <Path d="M 54 48 Q 59 53 64 48" fill="none" stroke={LINE} strokeWidth={LW} strokeLinecap="round" />

                {/* 🐱 코 (Circular Nose) */}
                <Circle cx="50" cy="56" r="3" fill="none" stroke={LINE} strokeWidth={LW} />

                {/* 🐱 볼 홍조 (Blush - 더 작게) */}
                <Ellipse cx="33" cy="58" rx="4" ry="2" fill="#FFB5B5" opacity="0.6" />
                <Ellipse cx="67" cy="58" rx="4" ry="2" fill="#FFB5B5" opacity="0.6" />

                {/* 🐱 눈물 (Single Teardrop on the right) */}
                <Path d="M 62 55 Q 59 61 62 67 Q 65 61 62 55" fill="#fff" stroke={LINE} strokeWidth="1" />

                {/* 🐱 입 (Sad Curve) */}
                <Path d="M 43 72 Q 50 65 57 72" fill="none" stroke={LINE} strokeWidth={LW} strokeLinecap="round" />

                {/* 🐱 수염 (Whiskers - 더욱 짧고 귀엽게) */}
                <Path d="M 29 55 L 22 52" stroke={LINE} strokeWidth={LW} strokeLinecap="round" />
                <Path d="M 29 62 L 20 62" stroke={LINE} strokeWidth={LW} strokeLinecap="round" />
                <Path d="M 29 69 L 22 72" stroke={LINE} strokeWidth={LW} strokeLinecap="round" />

                <Path d="M 71 55 L 78 52" stroke={LINE} strokeWidth={LW} strokeLinecap="round" />
                <Path d="M 71 62 L 80 62" stroke={LINE} strokeWidth={LW} strokeLinecap="round" />
                <Path d="M 71 69 L 78 72" stroke={LINE} strokeWidth={LW} strokeLinecap="round" />
            </G>
        </Svg>
    );
}

// ─── 🐥 병아리 (화남 / ANGRY) ───
// 새 도안 기반 재설계: 동그란 얼굴, 삐죽한 눈썹, 다이아몬드 부리
function ChickCharacter({ size = 48 }) {
    const YELLOW = "#FFD485";
    return (
        <Svg width={size} height={size} viewBox="-2 -2 104 104">
            {/* 🐥 몸통/머리 (동그란 형태) */}
            <Circle cx="50" cy="55" r="40" fill={YELLOW} stroke={LINE} strokeWidth={LW} />

            {/* 🐥 머리 깃 (단순한 세 줄기) */}
            <Line x1="50" y1="15" x2="50" y2="5" stroke={LINE} strokeWidth={LW} strokeLinecap="round" />
            <Line x1="50" y1="15" x2="43" y2="7" stroke={LINE} strokeWidth={LW} strokeLinecap="round" />
            <Line x1="50" y1="15" x2="57" y2="7" stroke={LINE} strokeWidth={LW} strokeLinecap="round" />

            {/* 🐥 화난 눈 eyebrow ( \ / ) */}
            <Path d="M 30 38 L 44 42" stroke={LINE} strokeWidth={LW + 0.5} fill="none" strokeLinecap="round" />
            <Path d="M 70 38 L 56 42" stroke={LINE} strokeWidth={LW + 0.5} fill="none" strokeLinecap="round" />

            {/* 🐥 눈 (작은 점 눈) */}
            <Circle cx="38" cy="51" r="2.5" fill={LINE} />
            <Circle cx="62" cy="51" r="2.5" fill={LINE} />

            {/* 🐥 부리 (다이아몬드 형태 + 가운데 선) */}
            <Path
                d="M 50 48 L 58 63 L 50 78 L 42 63 Z"
                fill="#FF8C2D"
                stroke={LINE}
                strokeWidth={LW}
                strokeLinejoin="round"
            />
            <Line x1="42" y1="63" x2="58" y2="63" stroke={LINE} strokeWidth={LW} strokeLinecap="round" />

            {/* 🐥 볼 홍조 (가로로 긴 타원) */}
            <Ellipse cx="26" cy="65" rx="8" ry="4" fill="#FF7676" opacity="0.4" />
            <Ellipse cx="74" cy="65" rx="8" ry="4" fill="#FF7676" opacity="0.4" />
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

            {/* 입 (일직선 'ㅡ' 모양으로 변경) */}
            <Line x1="44" y1="72" x2="56" y2="72" stroke={LINE} strokeWidth={LW} strokeLinecap="round" />
        </Svg>
    );
}

// ─── 🐰 토끼 (당황 / CONFUSED) ───
// 파스텔 핑크, 긴 귀, 동그란 눈, 물음표
function RabbitCharacter({ size = 48 }) {
    return (
        <Svg width={size} height={size} viewBox="-2 -2 104 104">
            {/* 🐰 머리와 귀가 하나로 이어진 실루엣 (선 두께 살짝 조정) */}
            <Path
                d="M 33.5 37.5 L 26 11 Q 34 1 42 11 L 43.5 32.5 A 34 34 0 0 1 56.5 32.5 L 58 11 Q 66 1 74 11 L 66.5 37.5 A 34 34 0 1 1 33.5 37.5"
                fill="#FFDDE4"
                stroke={LINE}
                strokeWidth={LW - 0.4}
                strokeLinejoin="round"
            />

            {/* 속귀 (귀 모양 그대로 사이즈만 줄여서 재현) */}
            <Path d="M 34.5 33 L 30 15 Q 34 8 38 15 L 39 33 Z" fill="#FFFFFF" />
            <Path d="M 61 33 L 62 15 Q 66 8 70 15 L 65.5 33 Z" fill="#FFFFFF" />

            {/* 눈 (흰색 눈 확대 + 눈동자 점 유지) */}
            <Circle cx="40" cy="62" r="10" fill="#fff" stroke={LINE} strokeWidth={LW - 1} />
            <Circle cx="40" cy="62" r="2" fill={LINE} />
            <Circle cx="60" cy="62" r="10" fill="#fff" stroke={LINE} strokeWidth={LW - 1} />
            <Circle cx="60" cy="62" r="2" fill={LINE} />

            {/* 입 (더 큰 삼각형 입) */}
            <Path d="M 44 74 L 50 86 L 56 74 Z" fill="#FFA94D" stroke={LINE} strokeWidth="1.5" strokeLinejoin="round" />

            {/* 볼 홍조 */}
            <Ellipse cx="25" cy="72" rx="8" ry="4" fill="#FFB5B5" opacity="0.8" />
            <Ellipse cx="75" cy="72" rx="8" ry="4" fill="#FFB5B5" opacity="0.8" />

            {/* 물음표 3개 (Doodle 스타일) */}
            <G transform="translate(82, 28) rotate(15)">
                <Path d="M -4 -6 C -4 -12, 4 -12, 4 -6 C 4 -3, 0 -3, 0 2" fill="none" stroke={LINE} strokeWidth="2.5" strokeLinecap="round" />
                <Circle cx="0" cy="7" r="2" fill={LINE} />
            </G>
            <G transform="translate(92, 40) rotate(10) scale(0.7)">
                <Path d="M -4 -6 C -4 -12, 4 -12, 4 -6 C 4 -3, 0 -3, 0 2" fill="none" stroke={LINE} strokeWidth="2.5" strokeLinecap="round" />
                <Circle cx="0" cy="7" r="2" fill={LINE} />
            </G>
            <G transform="translate(74, 44) rotate(-10) scale(0.6)">
                <Path d="M -4 -6 C -4 -12, 4 -12, 4 -6 C 4 -3, 0 -3, 0 2" fill="none" stroke={LINE} strokeWidth="2.5" strokeLinecap="round" />
                <Circle cx="0" cy="7" r="2" fill={LINE} />
            </G>
        </Svg>
    );
}

// ─── 메인 export: 캐릭터 렌더러 ───
const CHARACTER_MAP = {
    frog: FrogCharacter,
    cat: CatCharacter,
    chick: ChickCharacter,
    bear: BearCharacter,
    rabbit: RabbitCharacter,
};

export function MoodCharacter({ character, size = 48 }) {
    const CharComponent = CHARACTER_MAP[character];
    if (!CharComponent) return null;
    return <CharComponent size={size} />;
}

export { FrogCharacter, CatCharacter, ChickCharacter, BearCharacter, RabbitCharacter };

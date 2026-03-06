// 🎨 활동 커스텀 아이콘 (SVG) - Doodle Flash Style
// 이모지 대신 사용할 감성적이고 귀여운 느낌의 파스텔 벡터 아이콘

import React from 'react';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

const LW = 4.5;
const LINE = "#283665"; // Deep Navy (기분 캐릭터와 통일)

export function ActivityIcon({ type, size = 24 }) {
    const s = size;
    switch (type) {
        case 'reading':
            return ( // 파스텔 북
                <Svg width={s} height={s} viewBox="0 0 100 100">
                    <Path d="M 18 28 C 30 20 50 25 50 25 C 50 25 50 75 50 85 C 50 85 30 80 18 88 Z" fill="#FEE97D" stroke={LINE} strokeWidth={LW} strokeLinejoin="round" />
                    <Path d="M 82 28 C 70 20 50 25 50 25 C 50 25 50 75 50 85 C 50 85 70 80 82 88 Z" fill="#B4DCC6" stroke={LINE} strokeWidth={LW} strokeLinejoin="round" />
                    <Path d="M 50 25 L 50 85" stroke={LINE} strokeWidth={LW} strokeLinecap="round" />
                    <Path d="M 27 45 L 42 42 M 27 60 L 42 57 M 73 45 L 58 42 M 73 60 L 58 57" stroke={LINE} strokeWidth={LW} strokeLinecap="round" />
                </Svg>
            );
        case 'video':
            return ( // 귀여운 아날로그 TV
                <Svg width={s} height={s} viewBox="0 0 100 100">
                    <Rect x="15" y="30" width="70" height="50" rx="12" fill="#8BBFEF" stroke={LINE} strokeWidth={LW} />
                    <Path d="M 35 15 L 50 30 L 65 15" stroke={LINE} strokeWidth={LW} strokeLinecap="round" strokeLinejoin="round" />
                    <Circle cx="35" cy="15" r="4" fill="#FFB5B5" stroke={LINE} strokeWidth={LW} />
                    <Circle cx="65" cy="15" r="4" fill="#FEE97D" stroke={LINE} strokeWidth={LW} />
                    <Path d="M 44 43 L 60 55 L 44 67 Z" fill="#FFFFFF" stroke={LINE} strokeWidth={LW} strokeLinejoin="round" />
                </Svg>
            );
        case 'study':
            return ( // 통통한 파스텔 연필
                <Svg width={s} height={s} viewBox="0 0 100 100">
                    <Path d="M 25 75 L 35 85 L 85 35 L 75 25 Z" fill="#FEE97D" stroke={LINE} strokeWidth={LW} strokeLinejoin="round" />
                    <Path d="M 25 75 L 35 85 L 14 90 Z" fill="#FFD485" stroke={LINE} strokeWidth={LW} strokeLinejoin="round" />
                    <Path d="M 85 35 L 75 25 L 80 20 L 90 30 Z" fill="#FFB5B5" stroke={LINE} strokeWidth={LW} strokeLinejoin="round" />
                    <Path d="M 45 55 L 55 65 M 55 45 L 65 55" stroke={LINE} strokeWidth={LW} strokeLinecap="round" />
                    <Circle cx="16" cy="88" r="3" fill={LINE} />
                </Svg>
            );
        case 'date':
            return ( // 도톰하고 빛나는 하트
                <Svg width={s} height={s} viewBox="0 0 100 100">
                    <Path d="M 50 85 C 50 85 10 55 15 30 C 18 15 40 10 50 30 C 60 10 82 15 85 30 C 90 55 50 85 50 85 Z" fill="#FFB5B5" stroke={LINE} strokeWidth={LW} strokeLinejoin="round" strokeLinecap="round" />
                    <Path d="M 28 35 A 8 8 0 0 1 38 25" stroke="#FFFFFF" strokeWidth={LW} strokeLinecap="round" />
                </Svg>
            );
        case 'game':
            return ( // 파스텔 게임패드
                <Svg width={s} height={s} viewBox="0 0 100 100">
                    <Rect x="12" y="32" width="76" height="42" rx="21" fill="#C9B5B6" stroke={LINE} strokeWidth={LW} />
                    <Path d="M 30 45 L 30 61 M 22 53 L 38 53" stroke="#FFFFFF" strokeWidth={6} strokeLinecap="round" />
                    <Circle cx="62" cy="58" r="5.5" fill="#FFB5B5" stroke={LINE} strokeWidth={2.5} />
                    <Circle cx="74" cy="46" r="5.5" fill="#FEE97D" stroke={LINE} strokeWidth={2.5} />
                </Svg>
            );
        case 'social':
            return ( // 건배하는 귀여운 파스텔 잔
                <Svg width={s} height={s} viewBox="0 0 100 100">
                    {/* 반짝이 효과 */}
                    <Path d="M 47 32 L 47 22 M 39 35 L 32 27 M 55 35 L 62 27" stroke="#FFB5B5" strokeWidth={LW} strokeLinecap="round" />
                    {/* 오른쪽 노란 잔 */}
                    <Path d="M 52 45 L 52 75 C 52 85 72 85 72 75 L 72 45 Z" fill="#FEE97D" stroke={LINE} strokeWidth={LW} strokeLinejoin="round" />
                    <Path d="M 72 55 C 84 55 84 70 72 70" fill="none" stroke={LINE} strokeWidth={LW} strokeLinecap="round" />
                    {/* 왼쪽 초록 잔 */}
                    <Path d="M 28 40 L 28 70 C 28 80 48 80 48 70 L 48 40 Z" fill="#B4DCC6" stroke={LINE} strokeWidth={LW} strokeLinejoin="round" />
                    <Path d="M 28 50 C 16 50 16 65 28 65" fill="none" stroke={LINE} strokeWidth={LW} strokeLinecap="round" />
                </Svg>
            );
        case 'exercise':
            return ( // 파스텔 아령
                <Svg width={s} height={s} viewBox="0 0 100 100">
                    <Path d="M 20 50 L 80 50" stroke={LINE} strokeWidth={LW} strokeLinecap="round" />
                    <Rect x="15" y="30" width="16" height="40" rx="6" fill="#8BBFEF" stroke={LINE} strokeWidth={LW} />
                    <Rect x="69" y="30" width="16" height="40" rx="6" fill="#FFB5B5" stroke={LINE} strokeWidth={LW} />
                    <Path d="M 20 30 L 20 70 M 74 30 L 74 70" stroke="#FFFFFF" strokeWidth={4} strokeLinecap="round" />
                </Svg>
            );
        default:
            return ( // 기본(기타)
                <Svg width={s} height={s} viewBox="0 0 100 100">
                    <Circle cx="50" cy="50" r="40" fill="#E8F1FB" stroke={LINE} strokeWidth={LW} />
                    <Path d="M 40 40 L 60 60 M 60 40 L 40 60" stroke={LINE} strokeWidth={LW} strokeLinecap="round" />
                </Svg>
            );
    }
}

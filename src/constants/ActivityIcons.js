// 🎨 활동 커스텀 아이콘 (SVG)
// 이모지 대신 사용할 감성적이고 귀여운 벡터 아이콘들

import React from 'react';
import Svg, { Path, Circle, Rect, Ellipse } from 'react-native-svg';

const LW = "3"; // Line width
const LINE = "#4A3728"; // Brown line

export function ActivityIcon({ type, size = 24 }) {
    const s = size;
    switch (type) {
        case 'reading':
            return (
                <Svg width={s} height={s} viewBox="0 0 100 100">
                    {/* 책 커버 */}
                    <Path d="M 20 80 Q 50 85 50 90 Q 50 85 80 80 L 80 20 Q 50 25 50 30 Q 50 25 20 20 Z" fill="#B5D8A0" stroke={LINE} strokeWidth={LW} strokeLinejoin="round" />
                    {/* 책 페이지 */}
                    <Path d="M 25 75 Q 50 80 50 90 L 50 30 Q 50 25 25 20 Z" fill="#FFFFFF" stroke={LINE} strokeWidth={LW} strokeLinejoin="round" />
                    <Path d="M 75 75 Q 50 80 50 90 L 50 30 Q 50 25 75 20 Z" fill="#FFFFFF" stroke={LINE} strokeWidth={LW} strokeLinejoin="round" />
                    {/* 선 */}
                    <Path d="M 30 40 L 45 40" stroke={LINE} strokeWidth={LW} strokeLinecap="round" />
                    <Path d="M 30 55 L 40 55" stroke={LINE} strokeWidth={LW} strokeLinecap="round" />
                    <Path d="M 70 40 L 55 40" stroke={LINE} strokeWidth={LW} strokeLinecap="round" />
                </Svg>
            );
        case 'video':
            return (
                <Svg width={s} height={s} viewBox="0 0 100 100">
                    <Rect x="20" y="35" width="60" height="45" rx="8" fill="#A8C8F0" stroke={LINE} strokeWidth={LW} />
                    <Path d="M 20 25 L 80 35 L 75 40 L 15 30 Z" fill="#4A3728" stroke={LINE} strokeWidth={LW} strokeLinejoin="round" />
                    <Path d="M 35 25 L 45 35 M 55 30 L 65 40" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
                    <Path d="M 45 50 L 58 57 L 45 64 Z" fill="#FFFFFF" stroke={LINE} strokeWidth={LW} strokeLinejoin="round" />
                </Svg>
            );
        case 'study':
            return (
                <Svg width={s} height={s} viewBox="0 0 100 100">
                    <Path d="M 30 80 L 75 35 L 65 25 L 20 70 L 20 80 Z" fill="#FFD485" stroke={LINE} strokeWidth={LW} strokeLinejoin="round" />
                    <Path d="M 65 25 L 75 35" stroke={LINE} strokeWidth={LW} />
                    <Path d="M 20 70 L 30 80" stroke={LINE} strokeWidth={LW} />
                    <Path d="M 20 80 L 15 85" stroke={LINE} strokeLinecap="round" strokeWidth={5} />
                    <Path d="M 70 30 L 80 20 Q 85 15 75 15 L 65 25 Z" fill="#FFB5B5" stroke={LINE} strokeWidth={LW} strokeLinejoin="round" />
                </Svg>
            );
        case 'date':
            return (
                <Svg width={s} height={s} viewBox="0 0 100 100">
                    <Path d="M 50 85 C 50 85 15 55 15 35 C 15 20 35 15 50 35 C 65 15 85 20 85 35 C 85 55 50 85 50 85 Z" fill="#FFB5B5" stroke={LINE} strokeWidth={LW} strokeLinejoin="round" />
                    <Circle cx="35" cy="35" r="4" fill="#FFFFFF" />
                </Svg>
            );
        case 'game':
            return (
                <Svg width={s} height={s} viewBox="0 0 100 100">
                    <Rect x="15" y="30" width="70" height="40" rx="20" fill="#C4A8F0" stroke={LINE} strokeWidth={LW} />
                    <Circle cx="35" cy="50" r="10" fill="#FFFFFF" stroke={LINE} strokeWidth={LW} />
                    <Path d="M 35 45 L 35 55 M 30 50 L 40 50" stroke={LINE} strokeWidth="4" />
                    <Circle cx="60" cy="55" r="4" fill="#FFB5B5" stroke={LINE} strokeWidth="2" />
                    <Circle cx="70" cy="45" r="4" fill="#8DD4C8" stroke={LINE} strokeWidth="2" />
                </Svg>
            );
        case 'social':
            return (
                <Svg width={s} height={s} viewBox="0 0 100 100">
                    <Path d="M 30 30 L 45 75 A 15 15 0 0 0 70 75 L 85 30 Z" fill="#F5C08A" stroke={LINE} strokeWidth={LW} strokeLinejoin="round" />
                    <Path d="M 35 45 L 80 45" stroke="#FFFFFF" strokeWidth="3" opacity="0.6" strokeLinecap="round" />
                    <Circle cx="35" cy="20" r="6" fill="#F5C08A" opacity="0.8" />
                    <Circle cx="50" cy="15" r="4" fill="#F5C08A" opacity="0.8" />
                    <Circle cx="65" cy="25" r="5" fill="#F5C08A" opacity="0.8" />
                </Svg>
            );
        case 'exercise':
            return (
                <Svg width={s} height={s} viewBox="0 0 100 100">
                    <Rect x="25" y="45" width="50" height="10" fill="#8DD4C8" stroke={LINE} strokeWidth={LW} />
                    <Rect x="15" y="35" width="10" height="30" rx="3" fill="#A8C8F0" stroke={LINE} strokeWidth={LW} />
                    <Rect x="5" y="40" width="10" height="20" rx="2" fill="#A8C8F0" stroke={LINE} strokeWidth={LW} />
                    <Rect x="75" y="35" width="10" height="30" rx="3" fill="#A8C8F0" stroke={LINE} strokeWidth={LW} />
                    <Rect x="85" y="40" width="10" height="20" rx="2" fill="#A8C8F0" stroke={LINE} strokeWidth={LW} />
                </Svg>
            );
        default:
            return (
                <Svg width={s} height={s} viewBox="0 0 100 100">
                    <Circle cx="50" cy="50" r="40" fill="#C8BEB7" stroke={LINE} strokeWidth={LW} />
                </Svg>
            );
    }
}

import React from 'react';
import Svg, { Path, Circle, Rect, Ellipse, Polygon } from 'react-native-svg';

// 🎨 Square Marshmallow Doodle Style
// 두툼한 마커펜 텍스처, 흰색 바탕에 검정 외관선, 제한적 원색 포인트 사용
// 바보귀여운 감성을 위해 팔다리는 가느다란 선 느낌, 눈은 점눈이나 간단한 선 활용

const SquareBody = () => (
    <Rect x="20" y="25" width="60" height="55" rx="12" fill="#FFFFFF" stroke="#000000" strokeWidth="4" strokeLinejoin="round" />
);

export function SqNormal({ size = 50, style }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 100 100" style={style}>
            {/* Arms */}
            <Path d="M20 50 Q10 45 15 60" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
            <Path d="M80 50 Q90 45 85 60" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
            {/* Legs */}
            <Path d="M40 80 L38 95 L30 95" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M60 80 L62 95 L70 95" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <SquareBody />
            {/* Eyes */}
            <Circle cx="35" cy="45" r="3" fill="#000000" />
            <Circle cx="65" cy="45" r="3" fill="#000000" />
            {/* Mouth */}
            <Path d="M45 60 Q50 65 55 60" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
        </Svg>
    );
}

export function SqSleepy({ size = 50, style }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 100 100" style={style}>
            <Path d="M20 60 Q10 70 15 50" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
            <Path d="M80 60 Q90 70 85 50" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
            <Path d="M35 80 L35 90 L28 92" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M65 80 L65 90 L72 92" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <SquareBody />
            {/* Sleepy Eyes */}
            <Path d="M30 45 Q35 50 40 45" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
            <Path d="M60 45 Q65 50 70 45" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
            <Path d="M45 60 L55 60" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
        </Svg>
    );
}

export function SqAngry({ size = 50, style }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 100 100" style={style}>
            <Path d="M20 45 Q10 40 10 30" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
            <Path d="M80 45 Q90 40 90 30" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
            <Path d="M40 80 L35 92 L25 90" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M60 80 L65 92 L75 90" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            {/* Angry mark */}
            <Path d="M85 15 L95 10 M90 5 L90 20 M85 10 L95 15" stroke="#FF4444" strokeWidth="3" strokeLinecap="round" />
            <SquareBody />
            <Path d="M30 40 L40 45" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
            <Path d="M70 40 L60 45" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
            <Circle cx="38" cy="48" r="2.5" fill="#000000" />
            <Circle cx="62" cy="48" r="2.5" fill="#000000" />
            <Path d="M42 63 Q50 55 58 63" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
        </Svg>
    );
}

export function SqCool({ size = 50, style }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 100 100" style={style}>
            <Path d="M20 50 Q10 40 10 50" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
            <Path d="M80 50 L90 60 L85 70" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M40 80 L40 95 L30 95" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M60 80 L60 95 L70 95" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <SquareBody />
            {/* Sunglasses */}
            <Path d="M25 45 Q50 45 75 45" stroke="#000000" strokeWidth="4" />
            <Path d="M25 45 L35 55 L45 45 Z" fill="#000000" />
            <Path d="M55 45 L65 55 L75 45 Z" fill="#000000" />
            <Path d="M45 65 L55 65" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
        </Svg>
    );
}

export function SqVomit({ size = 50, style }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 100 100" style={style}>
            <Path d="M20 45 Q5 40 15 30" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
            <Path d="M80 45 Q95 40 85 30" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
            <Path d="M45 80 L42 95 L35 95" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M55 80 L58 95 L65 95" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <SquareBody />
            <Circle cx="35" cy="40" r="3" fill="#000000" />
            <Circle cx="65" cy="40" r="3" fill="#000000" />
            <Ellipse cx="50" cy="55" rx="8" ry="10" fill="none" stroke="#000000" strokeWidth="3" />
            {/* Vomit accent */}
            <Path d="M46 65 Q40 80 50 95 Q60 80 54 65 Z" fill="#33FF99" />
            <Path d="M46 65 Q40 80 50 95 Q60 80 54 65 Z" fill="none" stroke="#000000" strokeWidth="3" />
        </Svg>
    );
}

export function SqLaugh({ size = 50, style }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 100 100" style={style}>
            <Path d="M20 40 Q10 25 15 15" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
            <Path d="M80 40 Q90 25 85 15" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
            <Path d="M35 80 L35 95 L45 90" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M65 80 L65 90 L75 95" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            {/* Action lines */}
            <Path d="M5 40 L15 50 M95 40 L85 50" stroke="#000000" strokeWidth="2" strokeLinecap="round" />
            <SquareBody />
            <Path d="M30 45 L35 40 L40 45" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M60 45 L65 40 L70 45" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M40 55 Q50 70 60 55 Z" fill="#000000" />
        </Svg>
    );
}

export function SqCry({ size = 50, style }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 100 100" style={style}>
            <Path d="M20 50 Q10 40 15 30" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
            <Path d="M80 50 Q90 40 85 30" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
            <Path d="M40 80 L42 90 L35 90" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
            <Path d="M60 80 L58 90 L65 90" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
            <SquareBody />
            {/* Cute Crying Eyes (U U Shape) */}
            <Path d="M30 45 Q35 52 40 45" fill="none" stroke="#000000" strokeWidth="3.5" strokeLinecap="round" />
            <Path d="M60 45 Q65 52 70 45" fill="none" stroke="#000000" strokeWidth="3.5" strokeLinecap="round" />
            {/* Sad Mouth */}
            <Path d="M46 62 Q50 58 54 62" fill="none" stroke="#000000" strokeWidth="2.5" strokeLinecap="round" />
            {/* Big Tear Drops */}
            <Path d="M30 55 Q25 65 30 75 Q35 65 30 55" fill="#00AAFF" stroke="#000000" strokeWidth="2" strokeLinejoin="round" />
            <Path d="M70 55 Q75 65 70 75 Q65 65 70 55" fill="#00AAFF" stroke="#000000" strokeWidth="2" strokeLinejoin="round" />
        </Svg>
    );
}

export function SqKnight({ size = 50, style }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 100 100" style={style}>
            {/* Shield (Right Hand) */}
            <Path d="M80 45 L95 45 L95 65 Q87.5 80 80 65 Z" fill="#FFFFFF" stroke="#000000" strokeWidth="3" strokeLinejoin="round" />
            {/* Right Arm */}
            <Path d="M80 55 L85 65" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
            
            <Path d="M40 80 L35 95 L25 95" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M60 80 L65 95 L75 95" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <SquareBody />
            
            {/* Sword (Left Hand) - Larger and More Visible */}
            <Path d="M5 25 L15 10 L25 25 L18 65 L12 65 Z" fill="#DDDDDD" stroke="#000000" strokeWidth="3" strokeLinejoin="round" />
            <Path d="M8 55 L22 55" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
            <Path d="M15 55 L15 75" stroke="#000000" strokeWidth="4" strokeLinecap="round" />
            
            {/* Left Arm holding the sword */}
            <Path d="M20 55 L15 65" fill="none" stroke="#000000" strokeWidth="4" strokeLinecap="round" />

            <Path d="M30 40 L40 45" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
            <Path d="M70 40 L60 45" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
            <Circle cx="38" cy="48" r="3" fill="#000000" />
            <Circle cx="62" cy="48" r="3" fill="#000000" />
            <Path d="M45 60 L55 60" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
        </Svg>
    );
}

export function SqFire({ size = 50, style }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 100 100" style={style}>
            <Path d="M20 30 Q5 35 10 20" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
            <Path d="M80 30 Q95 35 90 20" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
            <Path d="M40 80 L38 95 L30 95" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M60 80 L62 95 L70 95" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <SquareBody />
            <Path d="M30 40 L40 45" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
            <Path d="M70 40 L60 45" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
            <Circle cx="35" cy="48" r="3" fill="#000000" />
            <Circle cx="65" cy="48" r="3" fill="#000000" />
            {/* Fire */}
            <Path d="M45 60 Q30 70 15 65 Q25 75 10 80 Q30 85 45 70 Z" fill="#FF4444" stroke="#000000" strokeWidth="2" strokeLinejoin="round" />
            <Circle cx="50" cy="65" r="5" fill="none" stroke="#000000" strokeWidth="3" />
        </Svg>
    );
}

export function SqNerd({ size = 50, style }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 100 100" style={style}>
            <Path d="M20 60 Q10 55 10 45" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
            <Path d="M80 60 Q90 55 90 45" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
            <Path d="M42 80 L42 95 L35 95" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M58 80 L58 95 L65 95" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <SquareBody />
            {/* Glasses */}
            <Rect x="26" y="38" width="20" height="15" fill="none" stroke="#000000" strokeWidth="3" />
            <Rect x="54" y="38" width="20" height="15" fill="none" stroke="#000000" strokeWidth="3" />
            <Path d="M46 45 L54 45 M26 45 L20 45 M74 45 L80 45" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
            <Circle cx="36" cy="45" r="2" fill="#000000" />
            <Circle cx="64" cy="45" r="2" fill="#000000" />
            {/* Smile */}
            <Path d="M45 65 Q50 70 55 65" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
        </Svg>
    );
}

export function SqHuh({ size = 50, style }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 100 100" style={style}>
            {/* Raised Left Arm holding Smartphone */}
            <Path d="M20 50 Q12 40 10 35" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
            <Path d="M80 50 Q90 60 90 70" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
            <Path d="M40 80 L35 95 L25 95" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M60 80 L65 95 L75 95" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <SquareBody />
            {/* Smartphone raised up in Left Hand */}
            <Rect x="5" y="18" width="10" height="18" rx="2" fill="#FFFFFF" stroke="#000000" strokeWidth="2" transform="rotate(-5, 10, 25)" />
            <Circle cx="10" cy="22" r="1.2" fill="#000000" transform="rotate(-5, 10, 25)" />

            <Path d="M30 40 L45 42" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
            <Path d="M70 40 L55 42" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
            <Circle cx="37" cy="48" r="3" fill="#000000" />
            <Circle cx="63" cy="48" r="3" fill="#000000" />
            <Path d="M42 65 Q50 68 58 65" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
        </Svg>
    );
}

export function SqWalk({ size = 50, style }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 100 100" style={style}>
            <Path d="M20 45 L10 50 L15 60" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M80 45 L90 40 L95 50" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M35 80 L35 90 L45 90" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M65 80 L55 90 L60 95" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            {/* Speed lines */}
            <Path d="M5 70 L15 70 M5 85 L20 85" stroke="#000000" strokeWidth="2" strokeLinecap="round" />
            <SquareBody />
            <Path d="M30 45 Q35 40 40 45" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
            <Path d="M60 45 Q65 40 70 45" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
            <Path d="M45 60 Q50 65 55 60" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
        </Svg>
    );
}

export function SqShrug({ size = 50, style }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 100 100" style={style}>
            <Path d="M20 45 Q10 40 10 30" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
            <Path d="M80 45 Q90 40 90 30" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
            <Path d="M40 80 L40 95 L30 95" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M60 80 L60 95 L70 95" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <SquareBody />
            <Path d="M30 45 L40 45" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
            <Path d="M70 45 L60 45" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
            <Path d="M40 65 L60 65" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
        </Svg>
    );
}

export function SqWink({ size = 50, style }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 100 100" style={style}>
            {/* Dynamic Arms */}
            <Path d="M20 50 Q5 30 15 20" fill="none" stroke="#000000" strokeWidth="4" strokeLinecap="round" />
            <Path d="M80 50 Q95 70 85 85" fill="none" stroke="#000000" strokeWidth="4" strokeLinecap="round" />
            <Path d="M40 80 L30 95 L20 95" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M60 80 L70 95 L80 95" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <SquareBody />
            {/* Hip Neon Sunglasses */}
            <Rect x="25" y="42" width="22" height="12" rx="4" fill="#CCFF00" stroke="#000000" strokeWidth="2.5" />
            <Rect x="53" y="42" width="22" height="12" rx="4" fill="#CCFF00" stroke="#000000" strokeWidth="2.5" />
            <Path d="M47 48 L53 48" stroke="#000000" strokeWidth="2.5" />
            {/* Cool Smirk */}
            <Path d="M42 62 Q50 68 58 60" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
        </Svg>
    );
}

export function SqScream({ size = 50, style }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 100 100" style={style}>
            {/* Horns */}
            <Path d="M25 25 L30 10 L40 25 Z" fill="#000000" stroke="#000000" strokeWidth="2" strokeLinejoin="round" />
            <Path d="M60 25 L70 10 L75 25 Z" fill="#000000" stroke="#000000" strokeWidth="2" strokeLinejoin="round" />
            {/* Side Arms */}
            <Path d="M20 55 L5 65" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
            <Path d="M80 55 L95 65" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
            <Path d="M40 80 L35 90 C30 95 25 90 20 90" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M60 80 L65 90 C70 95 75 90 80 90" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <SquareBody />
            {/* > < Eyes */}
            <Path d="M30 40 L40 48 L30 56" fill="none" stroke="#000000" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M70 40 L60 48 L70 56" fill="none" stroke="#000000" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            {/* Outline Mouth */}
            <Path d="M40 68 Q50 78 60 68 Q50 63 40 68" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
    );
}

export function SqSilly({ size = 50, style }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 100 100" style={style}>
            <Path d="M20 50 Q5 60 10 70" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
            <Path d="M80 50 Q95 60 90 70" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
            <Path d="M40 80 L35 95 L25 95" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M60 80 L65 95 L75 95" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <SquareBody />
            <Path d="M30 45 L40 45 M35 40 L35 50" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
            <Path d="M60 45 L70 45 M65 40 L65 50" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
            {/* Mouth & Tongue */}
            <Path d="M40 60 L60 60" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
            <Path d="M50 60 L50 70 C50 75 56 75 56 70 L56 60" fill="#FF4444" stroke="#000000" strokeWidth="3" strokeLinejoin="round" />
        </Svg>
    );
}

export function SqLove({ size = 50, style }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 100 100" style={style}>
            {/* Natural Shy Arms */}
            <Path d="M22 55 Q12 60 18 45" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
            <Path d="M78 55 Q88 60 82 45" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
            <Path d="M45 80 L40 95 L30 95" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M55 80 L60 95 L70 95" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <SquareBody />
            {/* Thinner Outline Heart Eyes - Moved Closer */}
            <Path d="M38 52 L34 48 C31 44 35 40 38 44 C41 40 45 44 42 48 Z" fill="none" stroke="#000000" strokeWidth="2.5" strokeLinejoin="round" transform="scale(1.2) translate(-8, -12)" />
            <Path d="M62 52 L58 48 C55 44 59 40 62 44 C65 40 69 44 66 48 Z" fill="none" stroke="#000000" strokeWidth="2.5" strokeLinejoin="round" transform="scale(1.2) translate(-10, -12)" />
            
            <Path d="M40 65 Q50 72 60 65" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
        </Svg>
    );
}

export function SqShock({ size = 50, style }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 100 100" style={style}>
            <Path d="M20 50 Q10 40 15 30" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
            <Path d="M80 50 Q90 40 85 30" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
            <Path d="M40 80 L35 95 L40 90" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M60 80 L65 95 L60 90" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            {/* Impact Lines */}
            <Path d="M10 10 L20 20 M90 10 L80 20" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
            <SquareBody />
            <Circle cx="35" cy="45" r="5" fill="#FFFFFF" stroke="#000000" strokeWidth="2" />
            <Circle cx="35" cy="45" r="1.5" fill="#000000" />
            <Circle cx="65" cy="45" r="5" fill="#FFFFFF" stroke="#000000" strokeWidth="2" />
            <Circle cx="65" cy="45" r="1.5" fill="#000000" />
            <Ellipse cx="50" cy="65" rx="5" ry="8" fill="none" stroke="#000000" strokeWidth="3" />
        </Svg>
    );
}

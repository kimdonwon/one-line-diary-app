import React from 'react';
import Svg, { Path, Circle, Ellipse } from 'react-native-svg';

// 🎨 Doodle Flash Style Stickers (No Outlines)
// 색상의 면(Color Blocks)으로만 형태를 구성합니다.

export function FrogSticker({ size = 50, style }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 100 100" style={style}>
            {/* 🐸 개구리 얼굴 베이스 (vibrant green) */}
            <Ellipse cx="50" cy="55" rx="40" ry="35" fill="#7CD4A0" />

            {/* 👀 눈 튀어나온 부분 */}
            <Circle cx="30" cy="35" r="15" fill="#7CD4A0" />
            <Circle cx="70" cy="35" r="15" fill="#7CD4A0" />

            {/* ⚪ 흰자 */}
            <Circle cx="30" cy="35" r="8" fill="#FFFFFF" />
            <Circle cx="70" cy="35" r="8" fill="#FFFFFF" />

            {/* ⚫ 눈동자 (진한 녹색/갈색 면으로 선 없이 표현) */}
            <Circle cx="30" cy="35" r="4" fill="#4A3728" />
            <Circle cx="70" cy="35" r="4" fill="#4A3728" />

            {/* 😊 볼터치 (soft pink) */}
            <Circle cx="25" cy="65" r="6" fill="#FFB7B7" opacity="0.8" />
            <Circle cx="75" cy="65" r="6" fill="#FFB7B7" opacity="0.8" />
        </Svg>
    );
}

export function StrawberrySticker({ size = 50, style }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 100 100" style={style}>
            {/* 🍓 딸기 몸통 (vibrant red) */}
            <Path
                d="M50 85 C30 85 15 65 15 45 C15 30 30 20 50 20 C70 20 85 30 85 45 C85 65 70 85 50 85 Z"
                fill="#FF7474"
            />

            {/* 🌿 꼭지 (vibrant green) */}
            <Path
                d="M50 10 C55 25 70 20 70 28 C50 35 30 20 30 28 C30 20 45 25 50 10 Z"
                fill="#7CD4A0"
            />

            {/* ✨ 씨앗 (연한 노란색 면으로 표현) */}
            <Circle cx="40" cy="45" r="2" fill="#FFEBA2" />
            <Circle cx="60" cy="40" r="2" fill="#FFEBA2" />
            <Circle cx="50" cy="55" r="2" fill="#FFEBA2" />
            <Circle cx="35" cy="65" r="2" fill="#FFEBA2" />
            <Circle cx="65" cy="60" r="2" fill="#FFEBA2" />
        </Svg>
    );
}

export function BearSticker({ size = 50, style }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 100 100" style={style}>
            <Circle cx="30" cy="30" r="12" fill="#A67C52" />
            <Circle cx="70" cy="30" r="12" fill="#A67C52" />
            <Circle cx="50" cy="55" r="38" fill="#C19A6B" />
            <Circle cx="50" cy="65" r="15" fill="#F5E6D3" />
            <Circle cx="40" cy="50" r="4" fill="#4A3728" />
            <Circle cx="60" cy="50" r="4" fill="#4A3728" />
            <Circle cx="50" cy="62" r="4" fill="#4A3728" />
        </Svg>
    );
}

export function CherrySticker({ size = 50, style }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 100 100" style={style}>
            <Path d="M50 20 Q60 5 70 35" stroke="#7CD4A0" strokeWidth="4" fill="none" />
            <Path d="M50 20 Q40 5 30 35" stroke="#7CD4A0" strokeWidth="4" fill="none" />
            <Circle cx="30" cy="45" r="15" fill="#FF4D4D" />
            <Circle cx="70" cy="45" r="15" fill="#FF4D4D" />
            <Circle cx="25" cy="40" r="5" fill="#FFFFFF" opacity="0.4" />
            <Circle cx="65" cy="40" r="5" fill="#FFFFFF" opacity="0.4" />
        </Svg>
    );
}

export function CloudSticker({ size = 50, style }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 100 100" style={style}>
            <Circle cx="30" cy="60" r="20" fill="#A3D8FF" />
            <Circle cx="50" cy="50" r="25" fill="#A3D8FF" />
            <Circle cx="70" cy="60" r="20" fill="#A3D8FF" />
            <Circle cx="40" cy="55" r="2" fill="#FFFFFF" />
            <Circle cx="60" cy="55" r="2" fill="#FFFFFF" />
        </Svg>
    );
}

export function DaisySticker({ size = 50, style }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 100 100" style={style}>
            {[0, 45, 90, 135].map(deg => (
                <Ellipse key={deg} cx="50" cy="50" rx="35" ry="12" fill="#FFFFFF" stroke="#4A3728" strokeWidth="2" transform={`rotate(${deg} 50 50)`} />
            ))}
            <Circle cx="50" cy="50" r="15" fill="#FFD485" stroke="#4A3728" strokeWidth="2" />
        </Svg>
    );
}

export function PizzaSticker({ size = 50, style }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 100 100" style={style}>
            <Path d="M50 15 L85 80 L15 80 Z" fill="#FFD485" />
            <Circle cx="45" cy="45" r="5" fill="#FF4D4D" />
            <Circle cx="60" cy="65" r="4" fill="#FF4D4D" />
            <Circle cx="35" cy="70" r="4" fill="#FF4D4D" />
            <Path d="M15 80 Q50 90 85 80" stroke="#CB9D6C" strokeWidth="6" fill="none" />
        </Svg>
    );
}

export function AvocadoSticker({ size = 50, style }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 100 100" style={style}>
            <Ellipse cx="50" cy="55" rx="35" ry="40" fill="#7CD4A0" />
            <Ellipse cx="50" cy="55" rx="28" ry="33" fill="#A7D58C" />
            <Circle cx="50" cy="65" r="12" fill="#4A3728" />
        </Svg>
    );
}

export function SparkleSticker({ size = 50, style }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 100 100" style={style}>
            <Path d="M50 10 Q55 45 90 50 Q55 55 50 90 Q45 55 10 50 Q45 45 50 10" fill="#FFD485" />
        </Svg>
    );
}

export function HeartSticker({ size = 50, style }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 100 100" style={style}>
            <Path d="M50 85 Q30 65 15 45 Q5 25 25 15 Q40 5 50 25 Q60 5 75 15 Q95 25 85 45 Q70 65 50 85 Z" fill="#FF7474" />
        </Svg>
    );
}

export function StarSticker({ size = 50, style }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 100 100" style={style}>
            <Path d="M50 10 L60 35 L90 40 L65 60 L75 90 L50 75 L25 90 L35 60 L10 40 L40 35 Z" fill="#FFD485" />
        </Svg>
    );
}

export function LightningSticker({ size = 50, style }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 100 100" style={style}>
            <Path d="M45 10 L65 10 L45 50 L70 50 L35 90 L40 55 L20 55 Z" fill="#FFEBA2" />
        </Svg>
    );
}

export function SunSticker({ size = 50, style }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 100 100" style={style}>
            <Circle cx="50" cy="50" r="20" fill="#FFB5B5" />
            <Path d="M50 15 L50 25 M50 85 L50 75 M15 50 L25 50 M85 50 L75 50 M25 25 L32 32 M75 75 L68 68 M25 75 L32 68 M75 25 L68 32" stroke="#FFB5B5" strokeWidth="6" strokeLinecap="round" />
        </Svg>
    );
}

export function MoonSticker({ size = 50, style }) {
    return (
        <Svg width={size} height={size} viewBox="-15 -10 120 120" style={style}>
            <Path d="M55 15 A35 35 0 0 0 55 85 A40 40 0 1 1 55 15" fill="#8BBFEF" />
        </Svg>
    );
}

export function CoffeeSticker({ size = 50, style }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 100 100" style={style}>
            <Path d="M25 40 L75 40 L70 85 C69 90 31 90 30 85 Z" fill="#C8BEB7" />
            <Path d="M75 45 C85 45 85 65 73 65" stroke="#C8BEB7" strokeWidth="6" fill="none" strokeLinecap="round" />
            <Path d="M40 20 Q45 10 50 20 Q55 30 50 40" stroke="#E8D5CC" strokeWidth="4" fill="none" strokeLinecap="round" />
            <Path d="M60 15 Q65 5 70 15 Q75 25 70 35" stroke="#E8D5CC" strokeWidth="4" fill="none" strokeLinecap="round" />
        </Svg>
    );
}

export function WatermelonSticker({ size = 50, style }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 100 100" style={style}>
            <Path d="M15 40 A35 35 0 0 0 85 40 Z" fill="#7CD4A0" />
            <Path d="M25 40 A25 25 0 0 0 75 40 Z" fill="#FF7474" />
            <Circle cx="40" cy="50" r="2" fill="#4A3728" />
            <Circle cx="60" cy="50" r="2" fill="#4A3728" />
            <Circle cx="50" cy="60" r="2" fill="#4A3728" />
        </Svg>
    );
}

export function TulipSticker({ size = 50, style }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 100 100" style={style}>
            <Path d="M50 50 L50 90" stroke="#7CD4A0" strokeWidth="6" strokeLinecap="round" />
            <Path d="M50 70 Q65 70 70 50" stroke="#7CD4A0" strokeWidth="6" strokeLinecap="round" fill="none" />
            <Path d="M30 40 C30 65 70 65 70 40 L60 20 L50 35 L40 20 Z" fill="#FF8FAB" />
        </Svg>
    );
}

export function MushroomSticker({ size = 50, style }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 100 100" style={style}>
            <Path d="M40 50 L40 85 C40 90 60 90 60 85 L60 50 Z" fill="#E8D5CC" />
            <Path d="M20 50 C20 20 80 20 80 50 Z" fill="#FF7474" />
            <Circle cx="35" cy="40" r="4" fill="#FFFFFF" />
            <Circle cx="50" cy="30" r="5" fill="#FFFFFF" />
            <Circle cx="65" cy="40" r="4" fill="#FFFFFF" />
        </Svg>
    );
}

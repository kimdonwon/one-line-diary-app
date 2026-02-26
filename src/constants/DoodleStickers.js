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
            {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => (
                <Ellipse key={deg} cx="50" cy="50" rx="35" ry="12" fill="#FFFFFF" transform={`rotate(${deg} 50 50)`} />
            ))}
            <Circle cx="50" cy="50" r="15" fill="#FFD485" />
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

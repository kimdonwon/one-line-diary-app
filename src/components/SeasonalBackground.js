import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Circle, G, Line } from 'react-native-svg';

// ==========================================
// 🌸 프리미엄 벚꽃 에셋 (High-end Chery Blossom)
// ==========================================
const CherryBlossomInner = ({ color }) => (
    <>
        {[0, 72, 144, 216, 288].map((angle, i) => (
            <G key={`petal-${i}`} rotation={angle} origin="50, 50">
                {/* 메인 잎 */}
                <Path d="M 50,50 C 25,20 28,0 43,2 C 47,2.5 49,7 50,11 C 51,7 53,2.5 57,2 C 72,0 75,20 50,50 Z" fill={color} />
                {/* 잎 안쪽 그라데이션/음영 */}
                <Path d="M 50,50 C 37,30 40,15 46,16 C 48,16.5 49,19 50,22 C 51,19 52,16.5 54,16 C 60,15 63,30 50,50 Z" fill="#FF8FAB" opacity="0.6"/>
                {/* 수술 라인 */}
                <Line x1="50" y1="50" x2="43" y2="30" stroke="#FF6B81" strokeWidth="1" />
                <Line x1="50" y1="50" x2="57" y2="30" stroke="#FF6B81" strokeWidth="1" />
                <Line x1="50" y1="50" x2="50" y2="25" stroke="#FF6B81" strokeWidth="1" />
                {/* 수술 끝부분 (노란색 팁) */}
                <Circle cx="43" cy="30" r="1.5" fill="#FFD700" />
                <Circle cx="57" cy="30" r="1.5" fill="#FFD700" />
                <Circle cx="50" cy="25" r="1.5" fill="#FFD700" />
            </G>
        ))}
        {/* 꽃 중심부 */}
        <Circle cx="50" cy="50" r="5" fill="#FF6B81" />
        <Circle cx="50" cy="50" r="2.5" fill="#FFD700" />
    </>
);

const CherryBlossomBranch = ({ color }) => (
    <Svg viewBox="0 0 200 200" width="100%" height="100%">
        {/* 나뭇가지 */}
        <G stroke="#5D4037" strokeLinecap="round" fill="none">
            <Path d="M 0,200 Q 80,150 200,50" strokeWidth="6" />
            <Path d="M 80,150 Q 150,180 180,180" strokeWidth="4" />
            <Path d="M 120,110 Q 110,60 80,20" strokeWidth="3" />
        </G>
        
        {/* 활짝 핀 꽃들 */}
        <G transform="translate(140, 0) scale(0.6) rotate(15)"><CherryBlossomInner color={color} /></G>
        <G transform="translate(40, 100) scale(0.8) rotate(-20)"><CherryBlossomInner color={color} /></G>
        <G transform="translate(10, -10) scale(0.5) rotate(45)"><CherryBlossomInner color={color} /></G>
        <G transform="translate(100, 130) scale(0.7) rotate(70)"><CherryBlossomInner color={color} /></G>
        <G transform="translate(150, 50) scale(0.5) rotate(-40)"><CherryBlossomInner color={color} /></G>
        <G transform="translate(60, 30) scale(0.65) rotate(10)"><CherryBlossomInner color={color} /></G>
        <G transform="translate(-10, 140) scale(0.55) rotate(110)"><CherryBlossomInner color={color} /></G>
        
        {/* 꽃봉오리 */}
        <G transform="translate(180, 40) scale(0.3) rotate(80)">
             <Path d="M 50,50 C 30,20 40,0 50,0 C 60,0 70,20 50,50 Z" fill={color} />
             <Path d="M 45,50 Q 50,60 55,50 Z" fill="#5D4037" />
        </G>
        <G transform="translate(70, 10) scale(0.25) rotate(-30)">
             <Path d="M 50,50 C 30,20 40,0 50,0 C 60,0 70,20 50,50 Z" fill={color} />
             <Path d="M 45,50 Q 50,60 55,50 Z" fill="#5D4037" />
        </G>
    </Svg>
);

const CherryBlossomPetal = ({ color }) => (
    <Svg viewBox="0 0 100 100" width="100%" height="100%">
        <G origin="50,50" rotation="0">
             <Path d="M 50,50 C 25,20 28,0 43,2 C 47,2.5 49,7 50,11 C 51,7 53,2.5 57,2 C 72,0 75,20 50,50 Z" fill={color} />
             <Path d="M 50,50 C 37,30 40,15 46,16 C 48,16.5 49,19 50,22 C 51,19 52,16.5 54,16 C 60,15 63,30 50,50 Z" fill="#FF8FAB" opacity="0.6"/>
        </G>
    </Svg>
);


// ==========================================
// ⚙️ 계절별 설정 (Strategy Pattern)
// ==========================================
const DEFAULT_DECORATIONS = [
    { size: 120, top: '-2%', left: '-10%', rotate: '15deg', opScale: 0.6 },
    { size: 60, top: '15%', right: '5%', rotate: '-25deg', opScale: 0.9 },
    { size: 90, top: '45%', left: '85%', rotate: '45deg', opScale: 0.7 },
    { size: 160, top: '75%', left: '-15%', rotate: '-10deg', opScale: 0.5 },
    { size: 70, top: '85%', right: '8%', rotate: '30deg', opScale: 0.8 },
];

const SEASON_CONFIG = {
    spring: {
        color: '#FFB7B2',
        opacity: 0.6, // 디테일이 많아 오파시티를 조금 더 올림
        decorations: [
            // 나뭇가지 (화면 모서리에 배치하여 화사하게 감싸는 느낌)
            { size: 260, top: '-5%', right: '-15%', rotate: '110deg', opScale: 1, type: 'branch' },
            { size: 200, bottom: '-5%', left: '-15%', rotate: '-45deg', opScale: 0.8, type: 'branch' },
            // 떠다니는 단일 꽃잎들 (원근감)
            { size: 40, top: '25%', left: '10%', rotate: '15deg', opScale: 0.6, type: 'petal' },
            { size: 25, top: '40%', right: '20%', rotate: '82deg', opScale: 0.3, type: 'petal' },
            { size: 55, bottom: '25%', right: '10%', rotate: '-35deg', opScale: 0.5, type: 'petal' },
            { size: 30, top: '65%', left: '15%', rotate: '110deg', opScale: 0.4, type: 'petal' },
        ],
        renderShape: (color, type) => {
            if (type === 'branch') return <CherryBlossomBranch color={color} />;
            if (type === 'petal') return <CherryBlossomPetal color={color} />;
            return <CherryBlossomInner color={color} />;
        }
    },
    summer: {
        color: '#FFD166',
        opacity: 0.25,
        decorations: DEFAULT_DECORATIONS,
        renderShape: (color) => (
            <Svg viewBox="0 0 100 100" width="100%" height="100%">
                <Circle cx="50" cy="50" r="22" fill={color} />
                <Path d="M50 8 L50 22 M50 78 L50 92 M8 50 L22 50 M78 50 L92 50 M22 22 L32 32 M78 78 L68 68 M22 78 L32 68 M78 22 L68 32" stroke={color} strokeWidth="8" strokeLinecap="round" />
            </Svg>
        )
    },
    autumn: {
        color: '#E07A5F',
        opacity: 0.25,
        decorations: DEFAULT_DECORATIONS,
        renderShape: (color) => (
            <Svg viewBox="0 0 100 100" width="100%" height="100%">
                <Path d="M50,10 C30,30 20,50 50,90 C80,50 70,30 50,10 Z" fill={color} />
                <Path d="M50,85 L50,45" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" />
            </Svg>
        )
    },
    winter: {
        color: '#8ECAE6',
        opacity: 0.35,
        decorations: DEFAULT_DECORATIONS,
        renderShape: (color) => (
            <Svg viewBox="0 0 100 100" width="100%" height="100%">
                <G stroke={color} strokeWidth="8" strokeLinecap="round">
                    <Path d="M50 10 L50 90 M10 50 L90 50 M22 22 L78 78 M22 78 L78 22" />
                </G>
                <Circle cx="50" cy="50" r="10" fill="#FFFFFF" />
            </Svg>
        )
    }
};

/**
 * 🌸 동적 계절 정적 패턴 배경 (Premium Version)
 * 
 * 성능 저하(Jank)를 차단하기 위해 애니메이션 없이 `absolute` 뷰로 화면을 구성합니다.
 * 계절마다 다른 데코레이션 레이아웃(decorations)을 가질 수 있습니다.
 */
export function SeasonalBackground({ season }) {
    const getSeason = () => {
        if (season) return season;
        const month = new Date().getMonth() + 1;
        if (month >= 3 && month <= 5) return 'spring';
        if (month >= 6 && month <= 8) return 'summer';
        if (month >= 9 && month <= 11) return 'autumn';
        return 'winter';
    };

    const currentSeason = getSeason();
    const config = SEASON_CONFIG[currentSeason] || SEASON_CONFIG['spring'];
    const activeDecorations = config.decorations || DEFAULT_DECORATIONS;

    return (
        <View style={[StyleSheet.absoluteFill, { zIndex: 0, overflow: 'hidden' }]} pointerEvents="none">
            {activeDecorations.map((decor, index) => (
                <View
                    key={`decor-${index}`}
                    style={{
                        position: 'absolute',
                        ...(decor.top !== undefined && { top: decor.top }),
                        ...(decor.bottom !== undefined && { bottom: decor.bottom }),
                        ...(decor.left !== undefined && { left: decor.left }),
                        ...(decor.right !== undefined && { right: decor.right }),
                        width: decor.size,
                        height: decor.size,
                        transform: [{ rotate: decor.rotate }],
                        opacity: config.opacity * decor.opScale, 
                    }}
                >
                    {config.renderShape(config.color, decor.type)}
                </View>
            ))}
        </View>
    );
}

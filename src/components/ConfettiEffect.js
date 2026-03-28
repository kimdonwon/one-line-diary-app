import React, { useImperativeHandle, forwardRef, useRef, memo, useMemo, useCallback } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Reanimated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    Easing,
    interpolate,
    Extrapolation,
    withDelay
} from 'react-native-reanimated';

/**
 * 🎉 고성능 파티클 슬롯 (v3.1 - Yoga Bypass Architecture)
 * Transform 기반 포지셔닝으로 레이아웃 재계산을 완전히 제거했습니다.
 */
const ParticleSlot = memo(forwardRef(({ content }, ref) => {
    // 훅 규칙 준수
    const progress = useSharedValue(0);
    const vx = useSharedValue(0);
    const vy = useSharedValue(0);
    const rotations = useSharedValue(0);
    const originX = useSharedValue(0);
    const originY = useSharedValue(0);

    useImperativeHandle(ref, () => ({
        start: (config) => {
            vx.value = config.vx;
            vy.value = config.vy;
            rotations.value = config.rotations;
            originX.value = config.x;
            originY.value = config.y;

            progress.value = 0;
            // 미세한 랜덤 딜레이로 자연스러움 부여
            progress.value = withDelay(Math.random() * 60, withTiming(1, {
                duration: 1300,
                easing: Easing.out(Easing.cubic)
            }));
        }
    }));

    const animatedStyle = useAnimatedStyle(() => {
        const p = progress.value;

        // 🎉 [v3.2] Native Layer Cleanup: 애니메이션 전후로 레이아웃 엔진에서 완전히 제거
        if (p <= 0 || p >= 1) {
            return {
                display: 'none',
                opacity: 0,
            };
        }

        const dx = originX.value + vx.value * p;
        const dy = originY.value + vy.value * p + (p * p * 250); // Gravity direction

        const scale = interpolate(p, [0, 0.1, 0.7, 1], [0, 1.4, 0.8, 0], Extrapolation.CLAMP);
        const opacity = interpolate(p, [0.6, 1], [1, 0], Extrapolation.CLAMP);
        const rotate = p * rotations.value * 360;

        return {
            display: 'flex',
            transform: [
                { translateX: dx },
                { translateY: dy },
                { scale },
                { rotate: `${rotate}deg` }
            ],
            opacity,
        };
    });

    return (
        <Reanimated.View style={[confettiStyles.particle, animatedStyle]} pointerEvents="none">
            {content}
        </Reanimated.View>
    );
}));

/**
 * 🎉 고성능 파티클 pooling 엔진 (v3.1 - Zero-React Injection)
 * 1. Layout Property (left/top)를 제거하고 Transform으로 위치 계산 통합.
 * 2. SharedValue Flattening으로 스레드 전송 부하 최소화.
 * 3. React.memo 적용으로 부모 리렌더링 영향권에서 독립.
 */
export const ConfettiEffect = memo(forwardRef(({
    renderItem,
    emojis,
    particleCount = 9,
}, ref) => {
    const poolSize = 30;
    const slotIndex = useRef(0);
    const lastBurstTime = useRef(0);
    const slotRefs = useRef([]);

    // 슬롯 참조 저장 함수 안정화
    const setSlotRef = useCallback((el, index) => {
        slotRefs.current[index] = el;
    }, []);

    // 슬롯 콘텐츠 생성 (renderItem 파선 시에만 재성성)
    const slots = useMemo(() => Array.from({ length: poolSize }, (_, i) => ({
        id: i,
        content: renderItem ? renderItem(i) : (
            <Text style={confettiStyles.emoji}>
                {emojis ? emojis[i % emojis.length] : '🎉'}
            </Text>
        )
    })), [emojis, renderItem]);

    useImperativeHandle(ref, () => ({
        burst: (x, y) => {
            const now = Date.now();
            const timeSinceLastBurst = now - lastBurstTime.current;

            if (timeSinceLastBurst < 120) return;
            lastBurstTime.current = now;

            const isRapidFire = timeSinceLastBurst < 500;
            const currentCount = isRapidFire ? Math.max(6, Math.floor(particleCount / 2)) : particleCount;

            for (let i = 0; i < currentCount; i++) {
                const idx = (slotIndex.current + i) % poolSize;
                const slotRef = slotRefs.current[idx];

                if (slotRef) {
                    const angle = (i / currentCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
                    const dist = 140 + Math.random() * 150;

                    slotRef.start({
                        vx: Math.cos(angle) * dist,
                        vy: Math.sin(angle) * dist,
                        rotations: (Math.random() > 0.5 ? 1 : -1) * (1 + Math.random() * 2),
                        x: x - 15,
                        y: y - 15
                    });
                }
            }

            slotIndex.current = (slotIndex.current + currentCount) % poolSize;
        }
    }));

    return (
        <View style={confettiStyles.container} pointerEvents="none">
            {slots.map((slot, index) => (
                <ParticleSlot
                    key={slot.id}
                    ref={el => setSlotRef(el, index)}
                    content={slot.content}
                />
            ))}
        </View>
    );
}));

const confettiStyles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 9999,
    },
    particle: {
        position: 'absolute',
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emoji: {
        fontSize: 24,
    },
});

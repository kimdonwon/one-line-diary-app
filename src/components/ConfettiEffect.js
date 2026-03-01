import React, { useState, useImperativeHandle, forwardRef, useEffect, useRef } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Reanimated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withDelay,
    runOnJS,
    Easing,
    interpolate,
    Extrapolation
} from 'react-native-reanimated';

/**
 * 🎉 팡 터지는 파티클 개별 컴포넌트 (Worklet 기반 물리 연산)
 */
const Particle = ({ p, originX, originY, onComplete }) => {
    // 0에서 1로 진행되는 단일 진행도 값
    const progress = useSharedValue(0);

    useEffect(() => {
        progress.value = 0;
        // 연타 시 부하 분산 및 리듬감을 위해 50ms의 미세한 딜레이 후 실행
        progress.value = withDelay(30, withTiming(1, { duration: 1500, easing: Easing.out(Easing.cubic) }, (finished) => {
            if (finished) runOnJS(onComplete)(p.id);
        }));
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
        const distance = p.distance;

        // X축: 선형 이동 (공기 저항으로 인해 진행도가 감속됨)
        const dx = Math.cos(p.angle) * distance * progress.value;

        // Y축: 위로 터졌다가 중력의 영향을 받아 아래로 떨어지는 포물선(Parabolic) 궤적
        // progress.value가 커질수록 y값에 제곱(중력)이 더해져 아래로 떨어짐
        const dy = Math.sin(p.angle) * distance * progress.value + (progress.value * progress.value * 250);

        // 크기(Scale): 팝! 하고 커졌다가 (0.1 시점), 서서히 작아지며 사라짐
        const scale = interpolate(progress.value, [0, 0.1, 0.7, 1], [0, 1.4, 0.8, 0], Extrapolation.CLAMP);

        // 투명도(Opacity): 후반부에만 페이드 아웃
        const opacity = interpolate(progress.value, [0.6, 1], [1, 0], Extrapolation.CLAMP);

        // 회전(Rotation): 랜덤 회전값 적용
        const rotate = progress.value * p.rotations * 360;

        return {
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
        <Reanimated.View
            style={[
                confettiStyles.particle,
                animatedStyle,
                { left: originX, top: originY }
            ]}
        >
            {p.renderContent}
        </Reanimated.View>
    );
};

/**
 * 🎉 팡 터지는 파티클 이펙트 컨테이너
 * Ref를 통해 burst(x, y)를 호출하면 즉시 터집니다.
 * 상위 컴포넌트의 리렌더링을 방지하기 위해 명령형 API(ref)를 사용합니다.
 */
export const ConfettiEffect = forwardRef(({
    renderItem, // 커스텀 렌더링 함수
    emojis,     // 텍스트 기반 이모지 배열
    particleCount = 18,
}, ref) => {
    const [particles, setParticles] = useState([]);
    const lastBurstTime = useRef(0);

    // 외부에서 호출할 수 있는 함수 노출
    useImperativeHandle(ref, () => ({
        burst: (x, y) => {
            const now = Date.now();
            const timeSinceLastBurst = now - lastBurstTime.current;

            // 1. 터치 쓰로틀링: 150ms 이내의 맹렬한 연타는 무시하여 기기 부하를 방어하고 박자감을 생성
            if (timeSinceLastBurst < 250) {
                return;
            }

            // 2. 피로도 시스템 (Adaptive Count): 500ms 이내 호출은 연타 콤보로 간주하여 파티클 수를 1/3로 다이어트
            const isRapidFire = timeSinceLastBurst < 500;
            const currentCount = isRapidFire ? Math.max(5, Math.floor(particleCount / 3)) : particleCount;

            lastBurstTime.current = now;

            // JS 스레드에서 생성할 초기 파라미터만 계산 후 배열에 넣습니다.
            const newParticles = Array.from({ length: currentCount }, (_, i) => ({
                id: now + i + Math.random(),
                // 사방으로 고르게 퍼지도록 각도를 currentCount로 나누어 계산
                angle: (i / currentCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.5,
                // 터져나가는 거리 (100 ~ 250 사이)
                distance: 100 + Math.random() * 150,
                // 회전수 (1바퀴 ~ 3바퀴, 좌우 랜덤)
                rotations: (Math.random() > 0.5 ? 1 : -1) * (1 + Math.random() * 2),
                originX: x - 15, // 아이콘 크기의 절반만큼 오프셋
                originY: y - 15,
                renderContent: renderItem ? renderItem(i) : <Text style={confettiStyles.emoji}>{emojis ? emojis[i % emojis.length] : '🎉'}</Text>
            }));

            // 너무 많이 쌓이지 않게 최대치 조절
            setParticles(prev => [...prev.slice(-30), ...newParticles]);
        }
    }));

    const removeParticle = (id) => {
        setParticles(prev => prev.filter(p => p.id !== id));
    };

    if (particles.length === 0) return null;

    return (
        <View style={confettiStyles.container} pointerEvents="none">
            {particles.map((p) => (
                <Particle
                    key={p.id}
                    p={p}
                    originX={p.originX}
                    originY={p.originY}
                    onComplete={removeParticle}
                />
            ))}
        </View>
    );
});

const confettiStyles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 9999, // 대시보드나 카드보다 무조건 위에
    },
    particle: {
        position: 'absolute',
        width: 30, // 컨텐츠 기준 중앙 정렬 보조
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emoji: {
        fontSize: 24,
    },
});

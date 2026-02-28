import React, { useState, useImperativeHandle, forwardRef, useCallback } from 'react';
import { View, Animated, StyleSheet, Text } from 'react-native';

/**
 * 🎉 팡 터지는 파티클 이펙트 컴포넌트
 * Ref를 통해 burst(x, y)를 호출하면 즉시 터집니다.
 * 상위 컴포넌트의 리렌더링을 방지하기 위해 명령형 API(ref)를 사용합니다.
 */
export const ConfettiEffect = forwardRef(({
    renderItem, // 커스텀 렌더링 함수
    emojis,     // 텍스트 기반 이모지 배열
    particleCount = 12,
}, ref) => {
    const [particles, setParticles] = useState([]);
    const [origin, setOrigin] = useState({ x: 0, y: 0 });

    // 외부에서 호출할 수 있는 함수 노출
    useImperativeHandle(ref, () => ({
        burst: (x, y) => {
            setOrigin({ x, y });
            spawnParticles(x, y);
        }
    }));

    const spawnParticles = (x, y) => {
        const newParticles = Array.from({ length: particleCount }, (_, i) => ({
            id: Date.now() + i + Math.random(),
            angle: (i / particleCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.4,
            translateX: new Animated.Value(0),
            translateY: new Animated.Value(0),
            scale: new Animated.Value(0),
            opacity: new Animated.Value(1),
            rotate: new Animated.Value(0),
            emoji: emojis ? emojis[i % emojis.length] : null
        }));

        setParticles(prev => [...prev.slice(-24), ...newParticles]); // 최대 개수 제한으로 메모리 보호

        newParticles.forEach((p) => {
            const distance = 120 + Math.random() * 100;
            const dx = Math.cos(p.angle) * distance;
            const dy = Math.sin(p.angle) * distance;

            Animated.parallel([
                Animated.sequence([
                    Animated.spring(p.scale, { toValue: 1.2, friction: 3, useNativeDriver: true }),
                    Animated.timing(p.scale, { toValue: 0, duration: 600, delay: 300, useNativeDriver: true }),
                ]),
                Animated.timing(p.translateX, { toValue: dx, duration: 1000, useNativeDriver: true }),
                Animated.timing(p.translateY, { toValue: dy, duration: 1000, useNativeDriver: true }),
                Animated.timing(p.rotate, { toValue: 1, duration: 1000, useNativeDriver: true }),
                Animated.timing(p.opacity, { toValue: 0, duration: 800, delay: 400, useNativeDriver: true }),
            ]).start(() => {
                setParticles(prev => prev.filter(pp => pp.id !== p.id));
            });
        });
    };

    if (particles.length === 0) return null;

    return (
        <View style={confettiStyles.container} pointerEvents="none">
            {particles.map((p) => (
                <Animated.View
                    key={p.id}
                    style={[
                        confettiStyles.particle,
                        {
                            left: origin.x,
                            top: origin.y,
                            opacity: p.opacity,
                            transform: [
                                { translateX: p.translateX },
                                { translateY: p.translateY },
                                { scale: p.scale },
                                { rotate: p.rotate.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] }) }
                            ],
                        },
                    ]}
                >
                    {renderItem ? renderItem(p.id) : <Text style={confettiStyles.emoji}>{p.emoji}</Text>}
                </Animated.View>
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
    },
    emoji: {
        fontSize: 24,
    },
});

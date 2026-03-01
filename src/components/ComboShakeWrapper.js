import React, { useRef, useEffect, useCallback } from 'react';
import { TouchableOpacity, Animated } from 'react-native';

/**
 * 💥 공통 콤보 연타 & 쉐이크 애니메이션 래퍼 컴포넌트
 * @param {React.ReactNode} children - 애니메이션을 적용할 대상 (SVG 캐릭터, 이미지 등)
 * @param {Function} onPress - 클릭 시 실행할 함수
 * @param {number} activeOpacity - 터치 시 투명도 (기본 0.9)
 * @param {Object} style - 터치 영역 스타일
 */
export function ComboShakeWrapper({
    children,
    onPress,
    activeOpacity = 1,
    style = {}
}) {
    const bounceScale = useRef(new Animated.Value(1)).current;
    const shakeRotate = useRef(new Animated.Value(0)).current;
    const comboScale = useRef(1);
    const comboTimer = useRef(null);

    const handlePressIn = useCallback(() => {
        if (comboTimer.current) clearTimeout(comboTimer.current);

        // 콤보 스케일 누적 (0.12씩 증가, 최대 1.8배)
        comboScale.current = Math.min(comboScale.current + 0.12, 1.8);

        // 이전 애니메이션 중지 및 즉시 초기화
        bounceScale.stopAnimation();
        shakeRotate.stopAnimation();
        shakeRotate.setValue(0);

        // 즉각적인 병렬 애니메이션 (Scale + Shake)
        Animated.parallel([
            Animated.spring(bounceScale, {
                toValue: comboScale.current,
                friction: 4,
                tension: 400,
                useNativeDriver: true
            }),
            Animated.sequence([
                Animated.timing(shakeRotate, { toValue: 1, duration: 40, useNativeDriver: true }),
                Animated.timing(shakeRotate, { toValue: -1, duration: 80, useNativeDriver: true }),
                Animated.timing(shakeRotate, { toValue: 1, duration: 80, useNativeDriver: true }),
                Animated.timing(shakeRotate, { toValue: 0, duration: 40, useNativeDriver: true }),
            ])
        ]).start();
    }, [bounceScale, shakeRotate]);

    const handlePressOut = useCallback(() => {
        // 손을 뗐을 때 쫀득하게 정중앙 복구
        Animated.parallel([
            Animated.spring(bounceScale, {
                toValue: 1,
                friction: 6,
                tension: 200,
                useNativeDriver: true
            }),
            Animated.spring(shakeRotate, {
                toValue: 0,
                friction: 5,
                tension: 250,
                useNativeDriver: true
            })
        ]).start();

        // 500ms 후 콤보 초기화
        comboTimer.current = setTimeout(() => {
            comboScale.current = 1;
        }, 500);
    }, [bounceScale, shakeRotate]);

    useEffect(() => {
        return () => { if (comboTimer.current) clearTimeout(comboTimer.current); };
    }, []);

    // 회전 값 보정 (-12deg ~ 12deg)
    const rotateStr = shakeRotate.interpolate({
        inputRange: [-1, 1],
        outputRange: ['-12deg', '12deg'],
    });

    return (
        <TouchableOpacity
            activeOpacity={activeOpacity}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={onPress}
            style={[style, { overflow: 'visible', zIndex: 10, justifyContent: 'center', alignItems: 'center' }]}
        >
            <Animated.View style={{
                overflow: 'visible',
                transform: [
                    { scale: bounceScale },
                    { rotate: rotateStr }
                ]
            }}>
                {children}
            </Animated.View>
        </TouchableOpacity>
    );
}

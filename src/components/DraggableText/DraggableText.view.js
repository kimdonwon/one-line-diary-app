import React, { useRef } from 'react';
import { View, Text, Animated, TouchableOpacity, PanResponder, Keyboard } from 'react-native';
import { styles } from './DraggableText.styles';
import { useDraggableTextLogic } from './DraggableText.logic';

// FONT_PRESETS 동일 설정 (WriteScreen과 매칭)
const FONT_PRESETS_MAP = {
    'basic': {
        fontFamily: 'GowunDodum_400Regular',
    },
    'diary': {
        fontFamily: 'NanumMyeongjo_400Regular',
        lineHeight: 28, // 명조체는 행간을 조금 더 넓게
    },
    'hand': {
        fontFamily: 'SingleDay_400Regular',
        fontSize: 22, // 펜글씨는 살짝 크게
    },
    'y2k': {
        fontFamily: 'NanumPenScript_400Regular',
        fontSize: 24, // 펜스크립트도 가독성을 위해 살짝 크게
    },
};

function RotationHandle({ containerRef, lastRotation, onRotate, onRotateEnd }) {
    const startInteraction = useRef({
        cx: 0,
        cy: 0,
        startAngle: 0,
        initialRotation: 0,
        ready: false
    });

    const handlePanResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onStartShouldSetPanResponderCapture: () => true,
            onMoveShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponderCapture: () => true,
            onPanResponderTerminationRequest: () => false,

            onPanResponderGrant: (e, gestureState) => {
                Keyboard.dismiss();
                const { x0, y0 } = gestureState;
                const initRot = lastRotation.current;

                startInteraction.current.ready = false;

                if (containerRef.current) {
                    containerRef.current.measureInWindow((x, y, w, h) => {
                        const cx = x + w / 2;
                        const cy = y + h / 2;
                        const dx = x0 - cx;
                        const dy = y0 - cy;
                        const startAngle = Math.atan2(dy, dx) * (180 / Math.PI);

                        startInteraction.current = { cx, cy, startAngle, initialRotation: initRot, ready: true };
                    });
                }
            },
            onPanResponderMove: (e, gestureState) => {
                if (!startInteraction.current.ready) return;

                const { cx, cy, startAngle, initialRotation } = startInteraction.current;
                const dx = gestureState.moveX - cx;
                const dy = gestureState.moveY - cy;

                const currentAngle = Math.atan2(dy, dx) * (180 / Math.PI);
                let delta = currentAngle - startAngle;

                if (delta > 180) delta -= 360;
                if (delta < -180) delta += 360;

                onRotate(initialRotation + delta);
            },
            onPanResponderRelease: () => {
                onRotateEnd();
            },
            onShouldBlockNativeResponder: () => true,
        })
    ).current;

    return (
        <View style={styles.rotationHandle} {...handlePanResponder.panHandlers}>
            <Text style={styles.rotationHandleIcon}>↻</Text>
        </View>
    );
}

export function DraggableText({
    id,
    text,
    fontId = 'basic',
    color = '#37352F',
    bgColor = 'transparent',
    initialX,
    initialY,
    initialRotation,
    onDelete,
    onDragEnd,
}) {
    const { pan, rotation, scale, panResponder, isSelected, lastRotation, handleRotation, handleRotationEnd } = useDraggableTextLogic({
        id,
        initialX,
        initialY,
        initialRotation,
        isEditing: false,
        onDelete,
        onDragEnd,
    });

    const containerRef = useRef(null);

    // 폰트 스타일 매핑
    const currentFontStyle = FONT_PRESETS_MAP[fontId] || FONT_PRESETS_MAP['basic'];

    return (
        <Animated.View
            ref={containerRef}
            {...panResponder.panHandlers}
            style={[
                styles.container,
                {
                    transform: [
                        { translateX: pan.x },
                        { translateY: pan.y },
                        {
                            rotate: rotation.interpolate({
                                inputRange: [-360, 360],
                                outputRange: ['-360deg', '360deg']
                            })
                        },
                        { scale }
                    ]
                },
                isSelected && styles.selected,
            ]}
        >
            <View pointerEvents="none" style={[styles.textWrapper, { backgroundColor: bgColor }]}>
                <Text style={[styles.textFormat, currentFontStyle, { color }]}>
                    {text}
                </Text>
            </View>

            {/* 🔄 회전 핸들 (선택 시에만 표시) */}
            {isSelected && (
                <RotationHandle
                    containerRef={containerRef}
                    lastRotation={lastRotation}
                    onRotate={handleRotation}
                    onRotateEnd={handleRotationEnd}
                />
            )}
        </Animated.View>
    );
}

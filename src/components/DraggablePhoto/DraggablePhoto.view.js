import React, { useRef } from 'react';
import { View, Text, Image, Animated, PanResponder, Keyboard } from 'react-native';

import { useDraggablePhotoLogic } from './DraggablePhoto.logic';
import { styles } from './DraggablePhoto.styles';

/**
 * 🔄 회전 핸들 컴포넌트 (DraggableSticker와 동일 패턴)
 */
function RotationHandle({ containerRef, currentRotation, onRotate, onRotateEnd }) {
    const startInteraction = useRef({
        cx: 0, cy: 0, startAngle: 0, initialRotation: 0, ready: false
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
                const initRot = currentRotation.current;
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

/**
 * 📷 폴라로이드 감성의 드래그 가능한 사진 컴포넌트
 * 스티커보다 아래(텍스트 위) 레이어에 배치됩니다.
 */
export function DraggablePhotoView({ photo, bounds, onDelete, onDragEnd }) {
    const {
        pan,
        rotation,
        currentRotation,
        panResponder,
        isDragging,
        isSelected,
        setMySize,
        handleRotation,
        handleRotationEnd,
    } = useDraggablePhotoLogic({ photo, bounds, onDelete, onDragEnd });

    const containerRef = useRef(null);

    const rotateStr = rotation.interpolate({
        inputRange: [-360, 360],
        outputRange: ['-360deg', '360deg'],
    });

    return (
        <Animated.View
            ref={containerRef}
            onLayout={(e) => {
                const { width, height } = e.nativeEvent.layout;
                setMySize({ width, height });
            }}
            style={[
                styles.container,
                {
                    transform: [
                        { translateX: pan.x },
                        { translateY: pan.y },
                        { rotate: rotateStr },
                    ]
                },
                isDragging && styles.dragging,
                isSelected && styles.selected,
            ]}
            {...panResponder.panHandlers}
        >
            {/* 폴라로이드 프레임 */}
            <View style={[
                styles.polaroidFrame,
                photo.frameType === 'black' && styles.polaroidFrameBlack,
                photo.frameType === 'pink' && styles.polaroidFramePink,
                photo.frameType === 'blue' && styles.polaroidFrameBlue,
                photo.frameType === 'mint' && styles.polaroidFrameMint,
            ]}>
                <Image
                    source={{ uri: photo.uri }}
                    style={styles.polaroidImage}
                    resizeMode="cover"
                />
                <View style={styles.polaroidBottom} />
            </View>

            {/* 🔄 회전 핸들 (선택 시만 표시) */}
            {isSelected && (
                <RotationHandle
                    containerRef={containerRef}
                    currentRotation={currentRotation}
                    onRotate={handleRotation}
                    onRotateEnd={handleRotationEnd}
                />
            )}
        </Animated.View>
    );
}

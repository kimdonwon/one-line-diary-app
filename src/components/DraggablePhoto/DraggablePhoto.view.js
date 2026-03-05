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
export default function DraggablePhoto({
    photo,
    bounds,
    onDelete,
    onDragEnd,
    isGhost = false, // 👻 고스트 모드: 터치 상호작용은 하지만 껍데기만 렌더링 (텍스트 뒤 사진 조작용)
    externalPan = null,
    externalRotation = null,
    style = null,
}) {
    const isSelectedFromProps = photo.isSelected; // Renamed to avoid conflict with logic's isSelected
    const isBlackFrame = photo.frameType === 'black'; // This variable is not used in the provided code, but kept as per instruction.

    const {
        pan,
        rotation,
        currentRotation,
        panResponder,
        isDragging,
        isSelected, // This is from useDraggablePhotoLogic, which might be different from isSelectedFromProps
        setMySize,
        handleRotation,
        handleRotationEnd,
    } = useDraggablePhotoLogic({ photo, bounds, onDelete, onDragEnd, externalPan, externalRotation });

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
                style, // 외부 주입 스타일
            ]}
            {...panResponder.panHandlers}
        >
            {/* 프레임 렌더링 (isGhost일 때는 시각적으로 숨김) */}
            <View
                style={[
                    styles.polaroidFrame,
                    photo.frameType === 'black' && styles.polaroidFrameBlack,
                    photo.frameType === 'pink' && styles.polaroidFramePink,
                    photo.frameType === 'blue' && styles.polaroidFrameBlue,
                    photo.frameType === 'mint' && styles.polaroidFrameMint,
                    photo.frameType === 'transparent_white' && styles.polaroidFrameTransparentWhite,
                    photo.frameType === 'transparent_gray' && styles.polaroidFrameTransparentGray,
                    isGhost && { opacity: 0 }, // 👻 터치용 고스트는 프레임 숨김
                ]}
                onLayout={(e) => {
                    const { width, height } = e.nativeEvent.layout;
                    // setMySize(width, height); // logic에서 제공하는 경우 사용
                }}
            >
                <Image
                    source={{ uri: photo.uri }}
                    style={[
                        styles.polaroidImage,
                        (photo.frameType === 'transparent_white' || photo.frameType === 'transparent_gray') && styles.transparentImage,
                        (photo.frameType === 'transparent_white' || photo.frameType === 'transparent_gray') && isSelected && styles.transparentImageSelected,
                    ]}
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

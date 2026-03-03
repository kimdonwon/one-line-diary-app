import React, { useRef } from 'react';
import { View, Text, Animated, PanResponder } from 'react-native';
import { getStickerComponent } from '../../constants/stickers';

import { useDraggableLogic } from './DraggableSticker.logic';
import { styles } from './DraggableSticker.styles';

/**
 * 🔄 회전 핸들 컴포넌트
 * 스티커 선택 시 우하단에 표시되며, 드래그로 회전 가능
 */
function RotationHandle({ stickerCenter, onRotate, onRotateEnd }) {
    const lastAngle = useRef(0);

    const handlePanResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: () => { },
            onPanResponderMove: (e, gestureState) => {
                // 핸들의 위치(dx, dy)로부터 중심 기준 각도를 계산
                const dx = gestureState.moveX - stickerCenter.current.x;
                const dy = gestureState.moveY - stickerCenter.current.y;
                const angle = Math.atan2(dy, dx) * (180 / Math.PI);
                onRotate(angle);
            },
            onPanResponderRelease: () => {
                onRotateEnd();
            },
        })
    ).current;

    return (
        <View
            style={styles.rotationHandle}
            {...handlePanResponder.panHandlers}
        >
            <Text style={styles.rotationHandleIcon}>↻</Text>
        </View>
    );
}

/**
 * 🎨 스티커 렌더링에만 초점을 맞춘 화면 분리 모듈입니다.
 * 핀치 회전 + 회전 핸들 지원
 */
export function DraggableStickerView({ sticker, bounds, onDelete, onDragEnd }) {
    // 내부 애니메이션 드래그 제스처 훅을 연결
    const {
        pan,
        rotation,
        currentRotation,
        panResponder,
        isDragging,
        isSelected,
        setMySize,
        mySize,
        handleRotation,
        handleRotationEnd,
    } = useDraggableLogic({
        sticker, bounds, onDelete, onDragEnd
    });

    // 스티커의 화면상 중심 좌표 (핸들 회전 계산에 사용)
    const stickerCenter = useRef({ x: 0, y: 0 });
    const containerRef = useRef(null);

    const renderContent = () => {
        if (sticker.isGraphic) {
            const GraphicComponent = getStickerComponent(sticker.type);
            if (GraphicComponent) {
                return <GraphicComponent size={29} />;
            }
        }
        return <Text style={styles.textSticker}>{sticker.type}</Text>;
    };

    // Animated interpolation: 숫자 → 'Xdeg' 문자열
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

                // 화면 기준 중심 좌표 측정 (회전 핸들용)
                if (containerRef.current) {
                    containerRef.current.measureInWindow((px, py, w, h) => {
                        stickerCenter.current = { x: px + w / 2, y: py + h / 2 };
                    });
                }
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
            <View pointerEvents="none">
                {renderContent()}
            </View>

            {/* 🔄 회전 핸들 (선택 시에만 표시) */}
            {isSelected && (
                <RotationHandle
                    stickerCenter={stickerCenter}
                    onRotate={handleRotation}
                    onRotateEnd={handleRotationEnd}
                />
            )}
        </Animated.View>
    );
}

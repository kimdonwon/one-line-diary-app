import React, { useRef } from 'react';
import { View, Text, Animated, PanResponder, Keyboard } from 'react-native';
import { getStickerComponent } from '../../constants/stickers';

import { useDraggableLogic } from './DraggableSticker.logic';
import { styles } from './DraggableSticker.styles';
import { RotationHandle } from '../RotationHandle';

/**
 * 🎨 스티커 렌더링에만 초점을 맞춘 화면 분리 모듈입니다.
 * 핀치 회전 + 회전 핸들 지원
 */
export const DraggableStickerView = React.memo(({ sticker, bounds, onDelete, onDragEnd, onInteractionStart, onInteractionEnd, onDragMove, onDragDrop, onSelect, isSelected: externalIsSelected }) => {
    const {
        pan,
        rotation,
        currentRotation,
        scale,
        currentTransformScale,
        panResponder,
        isDragging,
        isSelected,
        isLongPressActive,
        setMySize,
        mySize,
        handleRotateAndScale,
        handleRotationEnd,
    } = useDraggableLogic({
        sticker, bounds, onDelete, onDragEnd, onInteractionStart, onInteractionEnd, onDragMove, onDragDrop, onSelect, isSelected: externalIsSelected
    });

    const containerRef = useRef(null);

    const renderContent = () => {
        if (sticker.isGraphic) {
            const GraphicComponent = getStickerComponent(sticker.type);
            if (GraphicComponent) {
                return <GraphicComponent size={100} />;
            }
        }
        return <Text style={[styles.textSticker, { fontSize: 80, lineHeight: 90 }]} selectable={false}>{sticker.type}</Text>;
    };

    const rotateStr = rotation.interpolate({
        inputRange: [-360, 360],
        outputRange: ['-360deg', '360deg'],
    });

    const crispScale = Animated.multiply(scale, 0.35);

    // 💡 버튼 역보정: 1/x 곡선을 촘촘하게 근사하여 부모 크기에 상관없이 화면상 '절대 크기(43px)' 유지
    const handleScale = crispScale.interpolate({
        inputRange: [0.1, 0.2, 0.35, 0.5, 0.7, 1, 1.5, 2, 3, 5],
        outputRange: [10, 5, 2.857, 2, 1.428, 1, 0.666, 0.5, 0.333, 0.2],
    });

    // 💡 오프셋 역보정: 화면상에서 항상 테두리 밖 -24px 지점을 유지하도록 역산
    const handleOffset = crispScale.interpolate({
        inputRange: [0.1, 0.2, 0.35, 0.5, 0.7, 1, 1.5, 2, 3, 5],
        outputRange: [-240, -120, -68.57, -48, -34.28, -24, -16, -12, -8, -4.8],
    });
    const dragHandleOffset = crispScale.interpolate({
        inputRange: [0.1, 0.2, 0.35, 0.5, 0.7, 1, 1.5, 2, 3, 5],
        outputRange: [-360, -180, -102.85, -72, -51.42, -36, -24, -18, -12, -7.2],
    });

    return (
        <Animated.View
            ref={containerRef}
            onLayout={(e) => {
                const { width, height } = e.nativeEvent.layout;
                // 💡 crispScale은 Animated Value이므로 layout 시점의 실제 스케일 값을 반영하여 크기 보고
                const currentScale = currentTransformScale.current * 0.35;
                setMySize({ width: width * currentScale, height: height * currentScale });
            }}
            style={[
                styles.container,
                {
                    left: pan.x,
                    top: pan.y,
                    transform: [
                        { rotate: rotateStr },
                        { scale: crispScale }
                    ],
                    transformOrigin: ['0%', '0%', 0]
                },
                isLongPressActive && styles.dragging,
                isSelected && styles.selected,
            ]}
            {...panResponder.panHandlers}
        >
            <View pointerEvents="none" style={{ width: 100, height: 100, alignItems: 'center', justifyContent: 'center' }}>
                {renderContent()}
            </View>

            {/* 👆 드래그 막대 핸들 (선택 시 하단 중앙에 표시) */}
            {isSelected && (
                <Animated.View style={{
                    position: 'absolute',
                    bottom: dragHandleOffset,
                    left: '50%',
                    marginLeft: -20, // width 40의 절반 무조건 중앙 정렬
                    width: 40,
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: '#8B7E74',
                    transform: [{ scale: handleScale }]
                }} />
            )}

            {/* 🔄 회전 핸들 (선택 시에만 표시) */}
            {isSelected && (
                <RotationHandle
                    containerRef={containerRef}
                    currentRotation={currentRotation}
                    currentScale={currentTransformScale}
                    onRotateAndScale={handleRotateAndScale}
                    onRotateEnd={handleRotationEnd}
                    onInteractionStart={onInteractionStart}
                    onInteractionEnd={onInteractionEnd}
                    style={{
                        right: handleOffset,
                        bottom: handleOffset,
                        transform: [{ scale: handleScale }]
                    }}
                />
            )}
        </Animated.View>
    );
});

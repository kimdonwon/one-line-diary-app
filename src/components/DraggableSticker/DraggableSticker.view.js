import React, { useRef } from 'react';
import { View, Text, Animated, PanResponder, Keyboard } from 'react-native';
import { getStickerComponent } from '../../constants/stickers';

import { useDraggableLogic } from './DraggableSticker.logic';
import { styles } from './DraggableSticker.styles';


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
        isSelected,
        isLongPressActive,
        setMySize,
        mySize,
        handleRotateAndScale,
        handleRotationEnd,
        renderControls,
        visualScale,
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
                        { scale: visualScale }
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

            {/* 🕹️ 통합 조작 UI (드래그 막대, 회전 핸들 포함) */}
            {renderControls({ containerRef })}
        </Animated.View>
    );
});

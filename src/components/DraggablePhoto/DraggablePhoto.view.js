import React, { useRef } from 'react';
import { View, Text, Image, Animated, PanResponder, Keyboard } from 'react-native';

import { useDraggablePhotoLogic } from './DraggablePhoto.logic';
import { styles } from './DraggablePhoto.styles';
import { BasePhoto } from '../canvasElements/BasePhoto';

/**
 * 📷 폴라로이드 감성의 드래그 가능한 사진 컴포넌트
 * 스티커보다 아래(텍스트 위) 레이어에 배치됩니다.
 */
const DraggablePhoto = React.memo(({
    photo,
    bounds,
    onDelete,
    onDragEnd,
    isGhost = false,
    externalPan = null,
    externalRotation = null,
    style = null,
    onInteractionStart,
    onInteractionEnd,
    onDragMove,
    onDragDrop,
    onSelect,
    isSelected: externalIsSelected,
    onTap,
}) => {
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
        handleRotateAndScale,
        handleRotationEnd,
        renderControls
    } = useDraggablePhotoLogic({ photo, bounds, onDelete, onDragEnd, externalPan, externalRotation, onInteractionStart, onInteractionEnd, onDragMove, onDragDrop, onSelect, isSelected: externalIsSelected, onTap });

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
                setMySize({ width: width * currentTransformScale.current, height: height * currentTransformScale.current });
            }}
            style={[
                styles.container,
                {
                    left: pan.x,
                    top: pan.y,
                    transform: [
                        { rotate: rotateStr },
                        { scale }
                    ],
                    transformOrigin: ['0%', '0%', 0]
                },
                isLongPressActive && styles.dragging,
                isSelected && styles.selected,
                style,
            ]}
            {...panResponder.panHandlers}
        >
            {/* 📷 순수 시각 레이어 (BasePhoto) */}
            <BasePhoto photo={photo} isGhost={isGhost} isSelected={isSelected} />

            {/* 🕹️ 통합 조작 UI (드래그 막대, 회전 핸들 포함) */}
            {renderControls({ containerRef })}
        </Animated.View>
    );
});

export default DraggablePhoto;

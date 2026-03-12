import React, { useRef } from 'react';
import { View, Text, Image, Animated, PanResponder, Keyboard } from 'react-native';

import { useDraggablePhotoLogic } from './DraggablePhoto.logic';
import { styles } from './DraggablePhoto.styles';
import { RotationHandle } from '../RotationHandle';
import { CameraIcon } from '../../constants/icons';

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
        isDragging,
        isSelected,
        isLongPressActive,
        setMySize,
        handleRotateAndScale,
        handleRotationEnd,
    } = useDraggablePhotoLogic({ photo, bounds, onDelete, onDragEnd, externalPan, externalRotation, onInteractionStart, onInteractionEnd, onDragMove, onDragDrop, onSelect, isSelected: externalIsSelected, onTap });

    const containerRef = useRef(null);

    // 💡 버튼 역보정: 부모 스케일에 반비례하여 버튼 크기를 일정하게 유지 (1/x 곡선 근사)
    const handleScale = scale.interpolate({
        inputRange: [0.3, 0.5, 0.7, 1, 1.5, 2, 3, 5],
        outputRange: [3.33, 2, 1.428, 1, 0.666, 0.5, 0.333, 0.2],
    });

    const handleOffset = scale.interpolate({
        inputRange: [0.3, 0.5, 0.7, 1, 1.5, 2, 3, 5],
        outputRange: [-80, -48, -34.28, -24, -16, -12, -8, -4.8],
    });
    const dragHandleOffset = scale.interpolate({
        inputRange: [0.3, 0.5, 0.7, 1, 1.5, 2, 3, 5],
        outputRange: [-120, -72, -51.42, -36, -24, -18, -12, -7.2],
    });

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
            <View
                style={[
                    styles.polaroidFrame,
                    photo.frameType === 'black' && styles.polaroidFrameBlack,
                    photo.frameType === 'pink' && styles.polaroidFramePink,
                    photo.frameType === 'blue' && styles.polaroidFrameBlue,
                    photo.frameType === 'mint' && styles.polaroidFrameMint,
                    photo.frameType === 'gray' && styles.polaroidFrameGray,
                    photo.frameType === 'transparent_white' && styles.polaroidFrameTransparentWhite,
                    photo.frameType === 'transparent_gray' && styles.polaroidFrameTransparentGray,
                    isGhost && { opacity: 0, elevation: 0 },
                ]}
            >
                {photo.uri ? (
                    <Image
                        source={{ uri: photo.uri }}
                        style={[
                            styles.polaroidImage,
                            (photo.frameType === 'transparent_white' || photo.frameType === 'transparent_gray') && styles.transparentImage,
                            (photo.frameType === 'transparent_white' || photo.frameType === 'transparent_gray') && isSelected && styles.transparentImageSelected,
                        ]}
                        resizeMode="cover"
                    />
                ) : (
                    <View style={[
                        styles.polaroidImage,
                        styles.placeholderContainer,
                        (photo.frameType === 'transparent_white' || photo.frameType === 'transparent_gray') && styles.transparentImage
                    ]}>
                        <CameraIcon size={28} color="#C4C4C4" />
                        <Text style={styles.placeholderText}>사진 선택</Text>
                    </View>
                )}
                <View style={styles.polaroidBottom} />
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

            {/* 🔄 회전 핸들 (선택 시만 표시) */}
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

export default DraggablePhoto;

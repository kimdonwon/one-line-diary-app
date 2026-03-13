import React, { useRef } from 'react';
import { View, Text, Image, Animated, PanResponder, Keyboard } from 'react-native';

import { useDraggablePhotoLogic } from './DraggablePhoto.logic';
import { styles } from './DraggablePhoto.styles';
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

            {/* 🕹️ 통합 조작 UI (드래그 막대, 회전 핸들 포함) */}
            {renderControls({ containerRef })}
        </Animated.View>
    );
});

export default DraggablePhoto;

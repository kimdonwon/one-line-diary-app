import React, { useRef } from 'react';
import { View, Text, Image, Animated, PanResponder, Keyboard } from 'react-native';

import { useDraggablePhotoLogic } from './DraggablePhoto.logic';
import { styles } from './DraggablePhoto.styles';
import { RotationHandle } from '../RotationHandle';

/**
 * 📷 폴라로이드 감성의 드래그 가능한 사진 컴포넌트
 * 스티커보다 아래(텍스트 위) 레이어에 배치됩니다.
 */
const DraggablePhoto = React.memo(({
    photo,
    bounds,
    onDelete,
    onDragEnd,
    isGhost = false, // 👻 고스트 모드: 터치 상호작용은 하지만 껍데기만 렌더링 (텍스트 뒤 사진 조작용)
    externalPan = null,
    externalRotation = null,
    style = null,
    onInteractionStart,
    onInteractionEnd,
}) => {
    const isSelectedFromProps = photo.isSelected; // Renamed to avoid conflict with logic's isSelected
    const isBlackFrame = photo.frameType === 'black'; // This variable is not used in the provided code, but kept as per instruction.

    const {
        pan,
        rotation,
        currentRotation,
        scale,
        currentTransformScale,
        panResponder,
        isDragging,
        isSelected, // This is from useDraggablePhotoLogic, which might be different from isSelectedFromProps
        setMySize,
        handleRotateAndScale,
        handleRotationEnd,
    } = useDraggablePhotoLogic({ photo, bounds, onDelete, onDragEnd, externalPan, externalRotation, onInteractionStart, onInteractionEnd });

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
                        { scale }
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
                    isGhost && { opacity: 0, elevation: 0 }, // 👻 터치용 고스트는 프레임 숨김 + 그림자/레이어 제거
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
                    currentScale={currentTransformScale}
                    onRotateAndScale={handleRotateAndScale}
                    onRotateEnd={handleRotationEnd}
                    onInteractionStart={onInteractionStart}
                    onInteractionEnd={onInteractionEnd}
                />
            )}
        </Animated.View>
    );
});

export default DraggablePhoto;

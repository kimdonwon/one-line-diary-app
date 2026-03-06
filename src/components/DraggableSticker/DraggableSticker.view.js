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
export const DraggableStickerView = React.memo(({ sticker, bounds, onDelete, onDragEnd, onInteractionStart, onInteractionEnd }) => {
    // 내부 애니메이션 드래그 제스처 훅을 연결
    const {
        pan,
        rotation,
        currentRotation,
        scale,
        currentTransformScale,
        panResponder,
        isDragging,
        isSelected,
        setMySize,
        mySize,
        handleRotateAndScale,
        handleRotationEnd,
    } = useDraggableLogic({
        sticker, bounds, onDelete, onDragEnd, onInteractionStart, onInteractionEnd
    });

    const containerRef = useRef(null);

    const renderContent = () => {
        if (sticker.isGraphic) {
            const GraphicComponent = getStickerComponent(sticker.type);
            if (GraphicComponent) {
                // 🎨 화질 팁: 작은 사이즈(29)로 렌더링 후 키우면 비트맵 기반이라 깨짐.
                // 대신 크게(100) 렌더링하고 transform에서 줄여야 선명함 유지됨.
                return <GraphicComponent size={100} />;
            }
        }
        // 이모지도 폰트 크기를 키워서 선명도 확보
        return <Text style={[styles.textSticker, { fontSize: 80, lineHeight: 90 }]} selectable={false}>{sticker.type}</Text>;
    };

    // Animated interpolation: 숫자 → 'Xdeg' 문자열
    const rotateStr = rotation.interpolate({
        inputRange: [-360, 360],
        outputRange: ['-360deg', '360deg'],
    });

    // 🎨 화질 개선을 위한 보정 스케일 (100px로 렌더링했으므로 0.3을 곱해 기존 크기인 ~30px 유지)
    const crispScale = Animated.multiply(scale, 0.35);

    return (
        <Animated.View
            ref={containerRef}
            onLayout={(e) => {
                const { width, height } = e.nativeEvent.layout;
                // 실제 물리적 영역이 아닌 시각적 영역(scaled)을 mySize로 보고해야 경계선 계산이 정확함
                setMySize({ width: width * 0.35, height: height * 0.35 });
            }}
            style={[
                styles.container,
                {
                    transform: [
                        { translateX: pan.x },
                        { translateY: pan.y },
                        { rotate: rotateStr },
                        { scale: crispScale }
                    ]
                },
                isDragging && styles.dragging,
                isSelected && styles.selected,
            ]}
            {...panResponder.panHandlers}
        >
            <View pointerEvents="none" style={{ width: 100, height: 100, alignItems: 'center', justifyContent: 'center' }}>
                {renderContent()}
            </View>

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
                />
            )}
        </Animated.View>
    );
});

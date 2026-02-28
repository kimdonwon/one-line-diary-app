import React from 'react';
import { View, Text, Animated } from 'react-native';
import { getStickerComponent } from '../../constants/stickers';

import { useDraggableLogic } from './DraggableSticker.logic';
import { styles } from './DraggableSticker.styles';

/**
 * 🎨 스티커 렌더링에만 초점을 맞춘 화면 분리 모듈입니다.
 */
export function DraggableStickerView({ sticker, bounds, onDelete, onDragEnd }) {
    // 내부 애니메이션 드래그 제스처 훅을 연결
    const { pan, panResponder, isDragging, setMySize } = useDraggableLogic({
        sticker, bounds, onDelete, onDragEnd
    });

    const renderContent = () => {
        if (sticker.isGraphic) {
            const GraphicComponent = getStickerComponent(sticker.type);
            if (GraphicComponent) {
                return <GraphicComponent size={36} />;
            }
        }
        return <Text style={styles.textSticker}>{sticker.type}</Text>;
    };

    return (
        <Animated.View
            onLayout={(e) => {
                const { width, height } = e.nativeEvent.layout;
                setMySize({ width, height });
            }}
            style={[
                styles.container,
                {
                    transform: [
                        { translateX: pan.x },
                        { translateY: pan.y }
                    ]
                },
                isDragging && styles.dragging,
            ]}
            {...panResponder.panHandlers}
        >
            <View pointerEvents="none">
                {renderContent()}
            </View>
        </Animated.View>
    );
}

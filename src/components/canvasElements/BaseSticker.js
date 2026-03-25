import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getStickerComponent } from '../../constants/stickers';

/**
 * 🎨 BaseSticker (Pure Visual Component)
 * - 통제(Logic) 이벤트 없이 스티커의 시각적 형태만 렌더링합니다.
 * - 피드(Static)와 편집(Draggable) 양쪽 리스트에서 Source of Truth로 사용됩니다.
 */
export const BaseSticker = React.memo(({ sticker, isGhost = false }) => {
    if (!sticker) return null;

    const renderContent = () => {
        if (sticker.isGraphic) {
            const GraphicComponent = getStickerComponent(sticker.type);
            if (GraphicComponent) {
                return <GraphicComponent size={100} />;
            }
        }
        return <Text style={styles.textSticker} selectable={false}>{sticker.type}</Text>;
    };

    return (
        <View style={[styles.contentWrapper, isGhost && { opacity: 0 }]} pointerEvents="none">
            {renderContent()}
        </View>
    );
});

export const styles = StyleSheet.create({
    contentWrapper: {
        width: 100,
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textSticker: {
        fontSize: 80,
        lineHeight: 90,
    }
});

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FONT_PRESETS_MAP } from '../../constants/theme';

/**
 * 🎨 getTextStyle - 폰트 프리셋 ID로 통합 텍스트 스타일을 반환합니다.
 * DraggableText(TextInput)와 StaticText(Text) 양쪽에서 동일한 스타일을 보장합니다.
 */
export function getTextStyle(fontId, color = '#37352F') {
    const spec = FONT_PRESETS_MAP[fontId] || FONT_PRESETS_MAP['basic'];
    return {
        fontSize: spec.fontSize || 13,
        lineHeight: spec.lineHeight || 17,
        includeFontPadding: false,
        color,
        fontFamily: spec.fontFamily,
        letterSpacing: spec.letterSpacing || 0,
    };
}

/**
 * 📝 BaseText (Pure Visual Component)
 * - 통제(Logic) 이벤트 없이 텍스트 박스의 시각적 형태만 렌더링합니다.
 * - 피드(Static)와 편집(Draggable) 양쪽에서 Source of Truth로 사용됩니다.
 *
 * 사용법:
 *   Static 모드: <BaseText textNode={textNode} />
 *   Draggable 모드: <BaseText textNode={textNode}><TextInput .../></BaseText>
 */
export const BaseText = React.memo(({ textNode, children, style }) => {
    if (!textNode) return null;

    const isTransparent = textNode.bgColor === 'transparent';
    const textStyle = getTextStyle(textNode.fontId, textNode.color);

    return (
        <View style={[
            styles.textWrapper,
            {
                backgroundColor: isTransparent ? 'transparent' : (textNode.bgColor || 'transparent'),
            },
            style,
        ]}>
            {children || (
                <Text style={textStyle}>
                    {textNode.text}
                </Text>
            )}
        </View>
    );
});

export const styles = StyleSheet.create({
    textWrapper: {
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 6,
        minHeight: 30,
    },
});

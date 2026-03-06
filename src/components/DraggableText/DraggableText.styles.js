import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 8, // 터치 영역 확보
        maxWidth: '85%', // 카드 너비를 넘지 않도록 제한
    },
    textWrapper: {
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 6,
        minWidth: 60, // 최소 너비 (탭할 수 있도록)
        minHeight: 30, // 최소 높이
    },
    textFormat: {
        fontSize: 18,
        includeFontPadding: false,
        lineHeight: 24,
    },
    textInput: {
        padding: 0,
        margin: 0,
        minWidth: 120, // 편집 시 최소 너비
        textAlignVertical: 'top',
    },
    // 🔄 회전 핸들 스타일
    selected: {
        borderColor: 'rgba(232, 213, 204, 0.6)',
        borderWidth: 1.5,
        borderRadius: 4,
        borderStyle: 'dashed',
    },
});

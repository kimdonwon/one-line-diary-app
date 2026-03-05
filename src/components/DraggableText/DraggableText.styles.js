import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 8, // 터치 영역 확보
    },
    textWrapper: {
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    textFormat: {
        fontSize: 18,
        includeFontPadding: false,
    },
    // 🔄 회전 핸들 스타일
    selected: {
        borderColor: 'rgba(232, 213, 204, 0.6)',
        borderWidth: 1.5,
        borderRadius: 4,
        borderStyle: 'dashed',
    },
    rotationHandle: {
        position: 'absolute',
        right: -12,
        bottom: -12,
        width: 26,
        height: 26,
        borderRadius: 13,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderWidth: 1,
        borderColor: '#E2DED0',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    rotationHandleIcon: {
        fontSize: 14,
        color: '#9E8E82',
        fontWeight: '700',
    },
});

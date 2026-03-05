import { StyleSheet } from 'react-native';
import { SOFT_SHADOW } from '../../constants/theme';

/**
 * 🎨 다꾸(스티커) UI 전용 스타일 모듈입니다.
 */
export const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        zIndex: 10,
        padding: 4,
        borderWidth: 1,
        borderColor: 'transparent', // 고정 크기 유지를 위해 항상 테두리 영역 확보
    },
    dragging: {
        opacity: 0.8,
        zIndex: 20,
        ...SOFT_SHADOW.button,
    },
    selected: {
        borderColor: 'rgba(232, 213, 204, 0.6)',
        borderRadius: 4,
        borderStyle: 'dashed',
    },
    textSticker: {
        fontSize: 26,
        lineHeight: 31, // 텍스트 짤림 방지
    },

    // 🔄 회전 핸들 스타일
    rotationHandle: {
        position: 'absolute',
        right: -12,
        bottom: -12,
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderWidth: 1,
        borderColor: '#E2DED0',
        alignItems: 'center',
        justifyContent: 'center',
        ...SOFT_SHADOW.button,
    },
    rotationHandleIcon: {
        fontSize: 12,
        color: '#9E8E82',
        fontWeight: '700',
    },
});

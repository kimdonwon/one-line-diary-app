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
    },
    dragging: {
        opacity: 0.8,
        zIndex: 20,
        ...SOFT_SHADOW.button,
    },
    textSticker: {
        fontSize: 26,
        lineHeight: 31, // 텍스트 짤림 방지
    }
});

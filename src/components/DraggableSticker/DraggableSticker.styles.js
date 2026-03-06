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
        zIndex: 20,
        // 안드로이드에서 투명도+그림자 조합으로 인해 잔상(중복 요소)이 보이는 현상 방지
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

});

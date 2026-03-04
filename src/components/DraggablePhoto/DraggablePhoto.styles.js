import { StyleSheet } from 'react-native';
import { SOFT_SHADOW } from '../../constants/theme';

/**
 * 📷 폴라로이드 사진 전용 스타일 모듈
 */
export const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        zIndex: 5, // 스티커(10)보다 아래, 텍스트보다 위
        padding: 2,
    },
    dragging: {
        zIndex: 6,
        opacity: 0.9,
        ...SOFT_SHADOW.button,
    },
    selected: {
        borderWidth: 1.5,
        borderColor: 'rgba(232, 213, 204, 0.6)',
        borderRadius: 6,
        borderStyle: 'dashed',
    },

    // 폴라로이드 프레임
    polaroidFrame: {
        width: 126,
        height: 144,
        backgroundColor: '#FFFFFF',
        borderRadius: 4,
        paddingTop: 8,
        paddingHorizontal: 8,
        paddingBottom: 20, // 하단 넉넉한 여백 (폴라로이드 감성)

        // 사실적인 종이 그림자
        shadowColor: '#8B7E74',
        shadowOffset: { width: 1, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
        elevation: 4,

        // 미세한 테두리 (실제 사진 종이 느낌)
        borderWidth: 0.5,
        borderColor: 'rgba(200, 190, 180, 0.4)',
    },
    polaroidFrameBlack: {
        backgroundColor: '#1E1E1E',
        shadowColor: '#000000',
        borderColor: '#000000',
    },
    polaroidFramePink: {
        backgroundColor: '#FFD1DC',
        borderColor: 'rgba(255, 182, 193, 0.4)',
    },
    polaroidFrameBlue: {
        backgroundColor: '#D1E8FF',
        borderColor: 'rgba(173, 216, 230, 0.4)',
    },
    polaroidFrameMint: {
        backgroundColor: '#D1FFD7',
        borderColor: 'rgba(152, 251, 152, 0.4)',
    },
    polaroidImage: {
        width: 110,
        height: 110,
        borderRadius: 2,
        backgroundColor: '#F0ECE8', // 이미지 로딩 중 배경색
    },
    polaroidBottom: {
        height: 16, // 하단 여백 영역 (글씨를 쓸 수 있는 빈 칸 느낌)
    },

    // 🔄 회전 핸들 스타일 (스티커와 동일)
    rotationHandle: {
        position: 'absolute',
        right: -10,
        bottom: -10,
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

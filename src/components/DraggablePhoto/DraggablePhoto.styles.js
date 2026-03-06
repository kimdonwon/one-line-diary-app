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
        borderWidth: 1.5,
        borderColor: 'transparent',
        borderRadius: 6, // 미리 설정
    },
    dragging: {
        zIndex: 6,
        // 안드로이드에서 투명도+shadow 조합으로 인한 중복 렌더링(잔상) 방지
    },
    selected: {
        borderColor: 'rgba(232, 213, 204, 0.6)',
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
        backgroundColor: '#FFEBEF',
        borderColor: 'rgba(255, 217, 225, 0.4)',
    },
    polaroidFrameBlue: {
        backgroundColor: '#EBF4FF',
        borderColor: 'rgba(212, 232, 255, 0.4)',
    },
    polaroidFrameMint: {
        backgroundColor: '#EBFFF0',
        borderColor: 'rgba(212, 255, 224, 0.4)',
    },
    polaroidFrameGray: {
        backgroundColor: '#E0E0E0',
        borderColor: 'rgba(180, 180, 180, 0.5)',
        shadowColor: '#999999',
    },
    // ── 반투명 프레임 추가 (일반 폴라로이드와 동일한 크기 및 모양) ──
    polaroidFrameTransparentWhite: {
        backgroundColor: 'rgba(255, 255, 255, 0.88)',
        borderColor: 'rgba(220, 220, 218, 0.5)',
        shadowOpacity: 0.15,
        elevation: 0, // 텍스트 뒤에 위치하도록 elevation 제거
    },
    polaroidFrameTransparentGray: {
        backgroundColor: 'rgba(200, 200, 198, 0.82)',
        borderColor: 'rgba(180, 180, 178, 0.5)',
        shadowOpacity: 0.15,
        elevation: 0, // 텍스트 뒤에 위치하도록 elevation 제거
    },
    polaroidImage: {
        width: 110,
        height: 110,
        borderRadius: 2,
        backgroundColor: '#F0ECE8', // 이미지 로딩 중 배경색
    },
    transparentImage: {
        opacity: 0.35, // 글씨가 잘 보이도록 기본 투명도를 낮춤
    },
    transparentImageSelected: {
        opacity: 0.7, // 선택 시에는 위치 확인을 위해 조금 더 선명하게
    },
    polaroidBottom: {
        height: 16, // 하단 여백 영역 (글씨를 쓸 수 있는 빈 칸 느낌)
    },
});

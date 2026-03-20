import { StyleSheet } from 'react-native';
import { SOFT_SHADOW, PHOTO_FRAME_COLORS } from '../../constants/theme';

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
        zIndex: 999,
    },

    // 폴라로이드 프레임
    polaroidFrame: {
        width: 126,
        height: 144,
        backgroundColor: PHOTO_FRAME_COLORS.white,
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
        backgroundColor: PHOTO_FRAME_COLORS.black,
        shadowColor: '#000000',
        borderColor: '#000000',
    },
    polaroidFramePink: {
        backgroundColor: PHOTO_FRAME_COLORS.pink,
        borderColor: 'rgba(255, 217, 225, 0.4)',
    },
    polaroidFrameBlue: {
        backgroundColor: PHOTO_FRAME_COLORS.blue,
        borderColor: 'rgba(212, 232, 255, 0.4)',
    },
    polaroidFrameMint: {
        backgroundColor: PHOTO_FRAME_COLORS.mint,
        borderColor: 'rgba(212, 255, 224, 0.4)',
    },
    polaroidFrameGray: {
        backgroundColor: PHOTO_FRAME_COLORS.gray,
        borderColor: 'rgba(180, 180, 180, 0.5)',
        shadowColor: '#999999',
    },
    polaroidFrameMocha: {
        backgroundColor: PHOTO_FRAME_COLORS.mocha,
        borderColor: 'rgba(120, 80, 60, 0.4)',
    },
    polaroidFrameLavender: {
        backgroundColor: PHOTO_FRAME_COLORS.lavender,
        borderColor: 'rgba(180, 140, 220, 0.4)',
    },
    polaroidFrameLime: {
        backgroundColor: PHOTO_FRAME_COLORS.lime,
        borderColor: 'rgba(160, 200, 80, 0.4)',
    },
    polaroidFrameVintageCream: {
        backgroundColor: PHOTO_FRAME_COLORS.vintage_cream,
        borderColor: 'rgba(220, 210, 180, 0.4)',
    },
    polaroidFrameSodaBlue: {
        backgroundColor: PHOTO_FRAME_COLORS.soda_blue,
        borderColor: 'rgba(160, 200, 240, 0.4)',
    },
    polaroidFrameButterYellow: {
        backgroundColor: PHOTO_FRAME_COLORS.butter_yellow,
        borderColor: 'rgba(230, 200, 50, 0.4)',
    },
    // ── 반투명 프레임 추가 (일반 폴라로이드와 동일한 크기 및 모양) ──
    polaroidFrameTransparentWhite: {
        backgroundColor: PHOTO_FRAME_COLORS.transparent_white,
        borderColor: 'rgba(220, 220, 218, 0.5)',
        shadowOpacity: 0.15,
        elevation: 0, // 텍스트 뒤에 위치하도록 elevation 제거
    },
    polaroidFrameTransparentGray: {
        backgroundColor: PHOTO_FRAME_COLORS.transparent_gray,
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
    placeholderContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FAFAF9',
        borderWidth: 1.5,
        borderColor: '#D9D9D6',
        borderStyle: 'dashed',
    },
    placeholderText: {
        fontSize: 10,
        color: '#A0A09F',
        fontWeight: '600',
        marginTop: 4,
    },
    polaroidBottom: {
        height: 16, // 하단 여백 영역 (글씨를 쓸 수 있는 빈 칸 느낌)
    },
});

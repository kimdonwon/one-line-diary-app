import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { PHOTO_FRAME_COLORS } from '../../constants/theme';
import { CameraIcon } from '../../constants/icons';

/**
 * 📷 BasePhoto (Pure Visual Component)
 * - 통제(Logic) 없이 오직 폴라로이드의 시각적 형태만 렌더링합니다.
 * - 피드(Static)와 편집(Draggable) 양쪽 리스트에서 Source of Truth로 사용됩니다.
 */
export const BasePhoto = React.memo(({ photo, isGhost = false, isSelected = false }) => {
    if (!photo) return null;

    return (
        <View
            style={[
                styles.polaroidFrame,
                photo.frameType === 'black' && styles.polaroidFrameBlack,
                photo.frameType === 'pink' && styles.polaroidFramePink,
                photo.frameType === 'blue' && styles.polaroidFrameBlue,
                photo.frameType === 'mint' && styles.polaroidFrameMint,
                photo.frameType === 'gray' && styles.polaroidFrameGray,
                photo.frameType === 'mocha' && styles.polaroidFrameMocha,
                photo.frameType === 'lavender' && styles.polaroidFrameLavender,
                photo.frameType === 'lime' && styles.polaroidFrameLime,
                photo.frameType === 'vintage_cream' && styles.polaroidFrameVintageCream,
                photo.frameType === 'soda_blue' && styles.polaroidFrameSodaBlue,
                photo.frameType === 'butter_yellow' && styles.polaroidFrameButterYellow,
                photo.frameType === 'transparent_white' && styles.polaroidFrameTransparentWhite,
                photo.frameType === 'transparent_gray' && styles.polaroidFrameTransparentGray,
                isGhost && { opacity: 0, elevation: 0 },
            ]}
        >
            {photo.uri ? (
                <Image
                    source={{ uri: photo.uri }}
                    style={[
                        styles.polaroidImage,
                        (photo.frameType === 'transparent_white' || photo.frameType === 'transparent_gray') && styles.transparentImage,
                        (photo.frameType === 'transparent_white' || photo.frameType === 'transparent_gray') && isSelected && styles.transparentImageSelected,
                    ]}
                    resizeMode="cover"
                />
            ) : (
                <View style={[
                    styles.polaroidImage,
                    styles.placeholderContainer,
                    (photo.frameType === 'transparent_white' || photo.frameType === 'transparent_gray') && styles.transparentImage
                ]}>
                    <CameraIcon size={28} color="#C4C4C4" />
                    <Text style={styles.placeholderText}>사진 선택</Text>
                </View>
            )}
            <View style={styles.polaroidBottom} />
        </View>
    );
});

export const styles = StyleSheet.create({
    polaroidFrame: {
        width: 126,
        height: 144,
        backgroundColor: PHOTO_FRAME_COLORS.white,
        borderRadius: 4,
        paddingTop: 8,
        paddingHorizontal: 8,
        paddingBottom: 20, // 하단 넉넉한 여백

        // 사실적인 종이 그림자
        shadowColor: '#8B7E74',
        shadowOffset: { width: 1, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
        elevation: 4,

        // 미세한 테두리
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
    polaroidFrameTransparentWhite: {
        backgroundColor: PHOTO_FRAME_COLORS.transparent_white,
        borderColor: 'rgba(220, 220, 218, 0.5)',
        shadowOpacity: 0.15,
        elevation: 0,
    },
    polaroidFrameTransparentGray: {
        backgroundColor: PHOTO_FRAME_COLORS.transparent_gray,
        borderColor: 'rgba(180, 180, 178, 0.5)',
        shadowOpacity: 0.15,
        elevation: 0,
    },
    polaroidImage: {
        width: 110,
        height: 110,
        borderRadius: 2,
        backgroundColor: '#F0ECE8',
    },
    transparentImage: {
        opacity: 0.35, 
    },
    transparentImageSelected: {
        opacity: 0.7,
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
        height: 16,
    },
});

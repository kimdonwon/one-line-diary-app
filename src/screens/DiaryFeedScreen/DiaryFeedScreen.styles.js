/**
 * 🎨 DiaryFeedScreen 전용 스타일 시트
 * 인스타그램 피드 스타일 + 형광펜 드로잉 UI
 */

import { StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS, SOFT_SHADOW } from '../../constants/theme';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },

    // ─── 피드 스크롤 ───
    feedList: {
        flex: 1,
    },
    feedContent: {
        paddingHorizontal: SPACING.lg, // WriteScreen의 가로 여백과 완벽히 맞춤
        paddingTop: SPACING.md,
        paddingBottom: 140, // 하단바 + 여유공간
    },

    // ─── 일기 카드 (WriteScreen inputCard와 동일한 비율) ───
    diaryCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E9E9E7',
        marginBottom: SPACING.lg, // 카드 간격을 조금 넓힘
        overflow: 'hidden',
        ...SOFT_SHADOW.card,
    },
    diaryCardInner: {
        padding: SPACING.md,
        minHeight: 340, // WriteScreen 의 inputCard와 정확히 일치하는 높이 (280 + 60)
    },
    diaryContent: {
        fontSize: 14,
        fontWeight: '500',
        color: COLORS.text,
        lineHeight: 20,
    },
    stickerOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 5,
    },

    // ─── 일기 카드 하단 정보 ───
    diaryMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.md,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: '#F1F1F0',
        backgroundColor: '#FCFCFC',
    },
    diaryDateText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#666666',
        letterSpacing: 0.3,
    },
    diaryMoodWrap: {
        alignItems: 'center',
        justifyContent: 'center',
    },

    // ─── 댓글 버튼 ───
    diaryMetaRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    commentButton: {
        backgroundColor: '#F1F1F0',
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 8, // 조금 더 모던한 사각형 느낌 강화
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 12,
    },
    commentButtonText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#666666',
        marginLeft: 6,
    },

    // ─── 댓글 팝업 모달 (Notion Style) ───
    modalContainer: {
        justifyContent: 'center',
        margin: SPACING.xl,
    },
    popupModal: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        maxHeight: '70%',
        paddingVertical: 24,
        paddingHorizontal: SPACING.lg,
        ...SOFT_SHADOW.card,
    },
    sheetHeader: {
        fontSize: 18,
        fontWeight: '700',
        color: '#37352F',
        marginBottom: 20,
        textAlign: 'center',
    },
    commentsList: {
        flexGrow: 0, // Allows list to shrink if few items
    },
    commentItem: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E9E9E7',
        ...SOFT_SHADOW.card, // 노션 특유의 부드럽고 얕은 그림자
    },
    deleteCommentBtn: {
        position: 'absolute',
        top: 8,
        right: 8,
        padding: 8,
        backgroundColor: '#FCFCFC',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E9E9E7',
        ...SOFT_SHADOW.card,
    },
    commentDateText: {
        fontSize: 12,
        color: '#666666',
        marginBottom: 6,
        fontWeight: '600',
        letterSpacing: 0.3,
    },
    commentText: {
        fontSize: 14,
        color: '#37352F',
        lineHeight: 22,
    },
    emptyCommentWrap: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
    },
    emptyCommentText: {
        fontSize: 14,
        color: '#999999',
        fontWeight: '500',
        marginTop: 12,
    },
    commentInputWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#F1F1F0',
        backgroundColor: '#FFFFFF',
    },
    commentInput: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E9E9E7',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 14,
        color: '#37352F',
        ...SOFT_SHADOW.card,
    },
    commentSubmitBtn: {
        marginLeft: 12,
        backgroundColor: '#37352F', // 노션 블랙
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
        ...SOFT_SHADOW.card,
    },
    commentSubmitText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '700',
    },

    // ─── 빈 상태 ───
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 120,
    },
    emptyText: {
        fontSize: 16,
        fontWeight: '500',
        color: COLORS.textSecondary,
        marginTop: 12,
    },

    // ─── 서브타이틀 (연/월 터치 영역) ───
    subtitleTouchable: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    subtitleText: {
        fontSize: 16,
        color: COLORS.textSecondary,
        fontWeight: '600',
    },
    subtitleArrow: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginLeft: 4,
        marginTop: 1,
    },

    // ─── 연/월 피커 모달 ───
    pickerContent: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        paddingVertical: 24,
        paddingHorizontal: SPACING.lg,
        ...SOFT_SHADOW.card,
    },
    pickerYearRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    pickerYearText: {
        fontSize: 20,
        fontWeight: '700',
        color: '#37352F',
        marginHorizontal: 24,
    },
    pickerArrow: {
        fontSize: 28,
        fontWeight: '600',
        color: '#999999',
        paddingHorizontal: 8,
    },
    pickerMonthGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    pickerMonthCell: {
        width: '30%',
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        marginBottom: 10,
        backgroundColor: '#F7F7F5',
    },
    pickerMonthCellActive: {
        backgroundColor: '#37352F',
    },
    pickerMonthText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#666666',
    },
    pickerMonthTextActive: {
        color: '#FFFFFF',
    },

});

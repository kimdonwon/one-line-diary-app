/**
 * 🎨 DiaryFeedScreen 전용 스타일 시트
 * 인스타그램 피드 스타일 + 형광펜 드로잉 UI
 */

import { StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS, SOFT_SHADOW, DIARY_CARD_HEIGHT } from '../../constants/theme';

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
        minHeight: DIARY_CARD_HEIGHT, // WriteScreen 의 inputCard와 정확히 일치하는 높이 (280 + 60)
    },
    diaryContent: {
        fontSize: 14,
        fontWeight: '500',
        color: COLORS.text,
        lineHeight: 20,
        marginRight: 4, // TextInput 우측 여백과 똑같이 줄바꿈 시점을 강제 일치시키기 위함
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
    diaryMetaLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    diaryActivitiesWrap: {
        flex: 1, // 중앙 영역을 차지하도록 설정
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center', // 아이콘들을 중앙 정렬
        flexWrap: 'wrap', // 넘어가면 줄바꿈
        marginHorizontal: 8, // 날짜와 댓글 버튼 사이 간격 확보
        maxWidth: 110, // 폭을 늘려 아이콘 5개까지 한 줄에 보이게 함 (아이콘 16px + 마진 4px 기준)
    },
    diaryActivityIcon: {
        margin: 2, // 상하좌우 간격을 주어 줄바꿈 시에도 겹치지 않게 함
    },
    diaryMoodWrap: {
        alignItems: 'center',
        justifyContent: 'center',
    },

    // ─── 댓글 버튼 ───
    diaryMetaRight: {
        flex: 1, // 남은 공간을 모두 차지
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end', // 내용물은 오른쪽(댓글 버튼 쪽)으로 정렬
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
        fontSize: 16,
        fontWeight: '800',
        color: '#37352F',
        marginBottom: 24,
        textAlign: 'center',
        letterSpacing: -0.5,
    },
    modalHandle: {
        width: 40,
        height: 4,
        backgroundColor: '#E9E9E7',
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 16,
        marginTop: -8,
    },
    commentsList: {
        flexGrow: 0, // Allows list to shrink if few items
    },
    commentItemRow: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    commentAvatarWrap: {
        marginRight: 10,
        marginTop: 2,
    },
    commentAvatarInner: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#F7F7F5',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#E9E9E7',
    },
    commentBubbleWrap: {
        flex: 1,
    },
    commentHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
        paddingLeft: 4,
    },
    commentBubble: {
        backgroundColor: '#F7F7F5',
        borderRadius: 16,
        borderTopLeftRadius: 2,
        paddingHorizontal: 16,
        paddingVertical: 12,
        alignSelf: 'flex-start',
        maxWidth: '95%',
        position: 'relative',
    },
    commentDateText: {
        fontSize: 11,
        color: '#A1A19A',
        fontWeight: '600',
    },
    commentText: {
        fontSize: 14,
        color: '#37352F',
        lineHeight: 20,
        fontWeight: '500',
    },
    deleteCommentBtn: {
        position: 'absolute',
        top: -10,
        right: -10,
        zIndex: 10,
    },
    deleteIconBox: {
        backgroundColor: '#37352F',
        width: 20,
        height: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        ...SOFT_SHADOW.button,
    },
    emptyCommentWrap: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 50,
    },
    emptyCommentIconCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#F7F7F5',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E9E9E7',
    },
    emptyCommentText: {
        fontSize: 16,
        color: '#37352F',
        fontWeight: '700',
        marginBottom: 6,
    },
    emptyCommentSubText: {
        fontSize: 13,
        color: '#A1A19A',
        textAlign: 'center',
    },
    commentInputWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#F1F1F0',
    },
    commentInput: {
        flex: 1,
        backgroundColor: '#F7F7F5',
        borderRadius: 14,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 14,
        color: '#37352F',
        fontWeight: '500',
    },
    commentSubmitBtn: {
        marginLeft: 10,
        backgroundColor: '#37352F',
        borderRadius: 14,
        paddingHorizontal: 18,
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
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

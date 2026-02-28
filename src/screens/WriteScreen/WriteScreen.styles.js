import { StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS, SOFT_SHADOW } from '../../constants/theme';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: SPACING.lg,
        paddingBottom: 100,
    },
    sectionTitle: {
        ...FONTS.subtitle,
        fontSize: 18,
        color: COLORS.text,
        marginBottom: SPACING.md,
        marginTop: SPACING.lg,
    },
    moodRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SPACING.xl,
    },

    // ─── 스티커 서랍 ───
    stickerDrawer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12, // 노션 스타일의 적당한 라운딩
        borderWidth: 1,
        borderColor: '#E9E9E7', // 노션 선 색상
        marginBottom: SPACING.md,
        paddingHorizontal: SPACING.md, // 입역창 패딩(16px)과 일치시킴
        paddingVertical: 10,
        ...SOFT_SHADOW.card,
    },
    stickerDrawerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: 3,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F1F0', // 상단 구분선
        marginBottom: 8,
    },
    stickerDrawerTitleGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 3, // 입력창 텍스트 시작 위치와 시각적으로 더 정확히 맞추기 위해 살짝 밀어줌
    },
    stickerDrawerTitle: {
        fontSize: 13, // 주변 캡션 크기와 맞춤 (12 -> 13)
        fontWeight: '500',
        color: COLORS.text, // 활성화 시 다크 브라운
    },
    stickerDrawerTitleInactive: {
        color: COLORS.textSecondary, // 비활성화(닫힘) 시 희미한 색상
    },
    stickerManageButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    // ─── 서랍장 관리 모달 (Strict Notion Style) ───
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(55, 53, 47, 0.4)', // 노션 특유의 차콜 딤
        justifyContent: 'center', // 가운데 띄우기
        alignItems: 'center',
    },
    managerContainer: {
        width: '88%', // 좌우 여백 확보
        backgroundColor: '#FFFFFF',
        borderRadius: 16, // 사방 라운딩
        paddingTop: 8,
        paddingBottom: 24,
        maxHeight: '80%',
        borderWidth: 1,
        borderColor: '#E9E9E7',
        ...SOFT_SHADOW.card,
    },
    // ── 헤더
    managerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        marginTop: 16,
        marginBottom: 8,
    },
    managerTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: '#37352F',
    },
    managerCloseBtn: {
        backgroundColor: '#37352F', // 알림 모달과 통일된 노션 차콜
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 6,
    },
    managerCloseBtnText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    // ── 서브 설명
    managerDesc: {
        fontSize: 13,
        color: '#666666',
        paddingHorizontal: 24,
        marginBottom: 20,
        lineHeight: 18,
    },

    // ── 카테고리 리스트
    // ── 카테고리 카드 (그리드 레이아웃)
    managerGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
    },
    managerItem: {
        width: '31.3%', // 한 줄에 3개
        padding: 8,
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E9E9E7',
        marginBottom: 8,
    },
    managerItemGrabbing: {
        backgroundColor: '#F1F1F0',
        borderColor: '#37352F',
        borderWidth: 1.5,
        transform: [{ scale: 1.05 }],
    },
    managerItemDisabled: {
        backgroundColor: '#FAFAF9',
        borderColor: '#F1F1F0',
        opacity: 0.6,
    },
    // 상단 이름 태그 (스케치 반영)
    managerItemTag: {
        alignSelf: 'flex-start',
        backgroundColor: '#F1F1F0',
        paddingHorizontal: 4,
        paddingVertical: 1,
        borderRadius: 4,
        marginBottom: 8, // 줄과의 간격 조절
        borderWidth: 1,
        borderColor: '#E9E9E7',
    },
    managerItemInnerDivider: {
        height: 1,
        backgroundColor: '#F1F1F0', // 아주 연한 노션 스타일 실선
        marginBottom: 10, // 아래 스티커와의 간격
    },
    managerItemLabel: {
        fontSize: 8,
        fontWeight: '800',
        color: '#37352F',
    },
    // 하단 스티커 미리보기 3개
    managerItemPreviewRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    previewStickerWrap: {
        width: 18,
        height: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    previewEmoji: {
        fontSize: 12,
    },

    // ── 구분선
    managerDivider: {
        height: 1,
        backgroundColor: '#F1F1F0',
        marginHorizontal: 24,
        marginVertical: 16,
    },
    // ── 하단 상점 링크 (노션 블록 스타일)
    managerShopLink: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E9E9E7',
    },
    managerShopLinkText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#37352F',
        marginLeft: 8,
    },

    // 카테고리 탭 바
    categoryTabBar: {
        flexDirection: 'row',
        marginBottom: 6,
    },
    categoryTab: {
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 4, // 각진 느낌의 적은 라운딩
        backgroundColor: 'transparent',
        marginRight: 4,
    },
    categoryTabActive: {
        backgroundColor: '#F1F1F0', // 노션의 호버/활성 배경색
    },
    categoryTabText: {
        fontSize: 12,
        fontWeight: '500',
        color: '#37352F', // 노션 본문 텍스트 색상
    },
    categoryTabTextActive: {
        color: '#37352F',
        fontWeight: '600',
    },
    // 스티커 서랍 스크롤 영역
    stickerScrollArea: {
        height: 140,
    },
    // 스티커들이 담기는 컨텐츠 영역 (세로로 늘어남)
    stickerRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: SPACING.xs,
        paddingVertical: 6, // 10 -> 6으로 줄임
        justifyContent: 'center', // 왼쪽으로 치우치지 않게 중앙 정렬
        gap: 6, // marginRight 대신 gap 사용
    },
    stickerItem: {
        width: 38, // 44 -> 38로 축소하여 한 줄에 6개 배치
        height: 38,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 6,
    },
    stickerItemEmoji: {
        fontSize: 20,
    },
    stickerDrawerContent: {
        overflow: 'hidden',
    },

    // 활동 그리드
    activityGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8, // 또는 10
        justifyContent: 'flex-start', // 왼쪽부터 차례대로 정렬
        marginBottom: SPACING.xl,
    },
    activityChip: {
        width: '31.3%', // 한 줄에 3개씩 정확히 정렬 (오와열)
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center', // 칩 내부 아이콘과 글자를 가운데 정렬
        paddingVertical: 8,
        paddingHorizontal: 8,
        borderRadius: 8, // 노션 스타일의 작은 라운딩
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#E9E9E7',
    },
    activityChipSelected: {
        backgroundColor: '#F1F1F0', // 노션의 선택/활성 상태 배경색
        borderColor: '#D3D3D1',
    },
    activityIcon: {
        marginRight: 6,
    },
    activityLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#37352F', // 노션 본문 차콜 컬러
    },
    activityLabelSelected: {
        color: '#37352F',
        fontWeight: '700',
    },

    // 입력 창 (스티커 장식 레이어 포함)
    inputCard: {
        backgroundColor: COLORS.card,
        minHeight: 280,
        borderRadius: 12, // 노션 스타일의 라운딩
        padding: 0,
        overflow: 'hidden',
        borderWidth: 1,   // 얇은 실선 테두리
        borderColor: '#E9E9E7', // 노션 선 색상
        ...SOFT_SHADOW.card,
    },
    inputInnerPad: {
        padding: SPACING.md,
        flex: 1,
    },
    textInput: {
        flex: 1,
        fontSize: 14,
        fontWeight: '500',
        color: COLORS.text,
        lineHeight: 20,
    },
    inputFooter: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: SPACING.sm,
    },
    charCount: {
        fontSize: 12,
        color: COLORS.textSecondary,
    },

    // 활동별 노트 카드
    activityNoteCard: {
        marginTop: SPACING.md,
        backgroundColor: '#FFFFFF',
        padding: SPACING.md,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E9E9E7',
        ...SOFT_SHADOW.card,
    },
    activityNoteHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.sm,
    },
    activityNoteIcon: {
        marginRight: 6,
    },
    activityNoteLabel: {
        fontSize: 15,
        fontWeight: '700',
    },
    activityTitleInput: {
        fontSize: 15,
        fontWeight: '600',
        color: COLORS.text,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        paddingVertical: 4,
        marginBottom: 8,
    },
    activityNoteInput: {
        fontSize: 14,
        color: COLORS.textSecondary,
        paddingVertical: 4,
    },

    // 하단 바
    floatingTabBar: {
        position: 'absolute',
        bottom: 30,
        left: SPACING.lg,
        right: SPACING.lg,
        height: 64,
        backgroundColor: '#FFFFFF',
        borderRadius: RADIUS.full,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.md,
        ...SOFT_SHADOW.button,
    },
    fakeTabButton: {
        width: 48,
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
    },
    saveCircle: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: COLORS.happy,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: -30,
        ...SOFT_SHADOW.button,
    },
    bottomSpacer: {
        height: 120,
    },
});

import { StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS, SOFT_SHADOW, DIARY_CARD_HEIGHT } from '../../constants/theme';

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

    // ─── 📱 툴바 (Toggle & Floating Buttons) ───
    floatingToolbar: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.sm,
        gap: 10,
    },
    // 🎞️ 아이콘 버튼 컨테이너 (배경 카드 제거)
    pillToggleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    pillSegment: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
        borderRadius: 8,
    },
    pillSegmentActive: {
        backgroundColor: 'rgba(0, 0, 0, 0.05)', // 활성 상태일 때만 아주 미세한 하이라이트
    },
    pillSegmentText: {
        fontSize: 14,
        fontWeight: '500',
        color: COLORS.textSecondary,
    },
    pillSegmentTextActive: {
        color: '#37352F', // 노션 본문 차콜 컬러 (확실한 대비)
        fontWeight: '700', // 좀 더 강하게 강조
    },
    // 원래의 동그란 툴 버튼 (가챠 등)
    floatingToolBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#E9E9E7',
        ...SOFT_SHADOW.button,
    },
    floatingToolBtnActive: {
        backgroundColor: '#F1F1F0',
        borderColor: '#D3D3D1',
    },
    floatingToolEmoji: {
        fontSize: 18,
    },

    // ─── 🗂 바텀시트 (Bottom Sheet) 공통 ───
    stickerBottomSheet: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E9E9E7',
        paddingHorizontal: SPACING.md,
        paddingVertical: 10,
        marginBottom: SPACING.sm,
        ...SOFT_SHADOW.card,
    },

    // ─── 📷 사진 프레임 선택 바텀시트 영역 (MZ 폴꾸 테마) ───
    photoFrameContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        gap: 12,
        paddingVertical: 12,
        paddingHorizontal: 4,
    },
    frameOptionBtn: {
        alignItems: 'center',
        paddingVertical: 4,
    },
    framePreview: {
        width: 40,
        height: 48,
        borderRadius: 4,
        padding: 4,
        backgroundColor: '#FFFFFF',
        justifyContent: 'flex-start',
        borderWidth: 1,
        borderColor: 'rgba(232, 213, 204, 0.5)',
        ...SOFT_SHADOW.button,
    },
    // 프레임 내부 사진 영역 (실물 느낌)
    frameInnerPhoto: {
        width: '100%',
        aspectRatio: 1,
        borderRadius: 1,
        backgroundColor: 'rgba(0,0,0,0.05)',
    },
    framePreviewWhite: {
        backgroundColor: '#FFFFFF',
    },
    framePreviewBlack: {
        backgroundColor: '#1E1E1E',
        borderColor: '#000000',
    },
    framePreviewPink: {
        backgroundColor: '#FFDCE5',
        borderColor: '#FFC1CF',
    },
    framePreviewBlue: {
        backgroundColor: '#D6EFFF',
        borderColor: '#B9E1FF',
    },
    framePreviewMint: {
        backgroundColor: '#D9FFE9',
        borderColor: '#B8FFD6',
    },
    frameOptionText: {
        display: 'none', // 텍스트 제거 대응
    },
    lockOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
    },

    // (레거시 호환 — 사용하지 않지만 참조 에러 방지)
    drawerAndPhotoRow: { display: 'none' },
    stickerDrawer: { display: 'none' },
    stickerDrawerClosed: {},
    stickerDrawerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: 3,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F1F0', // 상단 구분선
        marginBottom: 8,
    },
    stickerDrawerHeaderClosed: {
        marginBottom: 0,
        borderBottomWidth: 0,
        paddingBottom: 0,
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

    drawerTab: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 6,
        marginRight: 8,
    },
    drawerTabActive: {
        backgroundColor: '#F1F1F0',
    },
    drawerTabText: {
        fontSize: 13,
        fontWeight: '500',
        color: COLORS.textSecondary,
    },
    drawerTabTextActive: {
        color: COLORS.text,
        fontWeight: '700',
    },
    bgDrawer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E9E9E7',
        paddingHorizontal: SPACING.md,
        paddingVertical: 10,
        marginBottom: SPACING.md,
        ...SOFT_SHADOW.card,
    },
    bgDrawerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: 3,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F1F0',
        marginBottom: 8,
    },
    bgDrawerTitleGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 3,
    },
    bgDrawerTitle: {
        fontSize: 13,
        fontWeight: '500',
        color: COLORS.text,
    },
    bgDrawerTitleInactive: {
        color: COLORS.textSecondary,
    },
    bgDrawerContent: {
        paddingHorizontal: 12, // stickerDrawer의 패딩(4)과 합쳐서 16px 맞춤
    },
    bgCategoryTabBar: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    bgCategoryTab: {
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 4,
        backgroundColor: 'transparent',
        marginRight: 4,
    },
    bgCategoryTabActive: {
        backgroundColor: '#F1F1F0',
    },
    bgCategoryTabText: {
        fontSize: 12,
        fontWeight: '500',
        color: '#37352F',
    },
    bgCategoryTabTextActive: {
        fontWeight: '600',
    },
    bgScrollArea: {
        // 가로 스크롤 영역
    },
    bgItemRow: {
        flexDirection: 'row',
        paddingVertical: 6,
        gap: 10,
    },
    bgItem: {
        width: 56,
        height: 70,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#E9E9E7',
        overflow: 'hidden',
    },
    bgItemSelected: {
        borderWidth: 2,
        borderColor: '#37352F',
    },
    bgItemColor: {
        width: '100%',
        height: 40,
    },
    bgItemLabel: {
        fontSize: 9,
        fontWeight: '600',
        color: '#37352F',
        marginTop: 4,
    },
    bgItemEmoji: {
        fontSize: 18,
        marginBottom: 2,
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

    // 스티커 바텀시트 헤더 (카테고리 탭 + 설정 버튼)
    stickerBottomSheetHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },

    // 카테고리 탭 바
    categoryTabBar: {
        flexDirection: 'row',
        flex: 1, // 버튼 옆자리 차지
        paddingRight: 8,
    },
    stickerManageBtnInside: {
        width: 28,
        height: 28,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent', // 배경 제거
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
        paddingHorizontal: 12, // stickerDrawer의 패딩(4)과 합쳐서 16px 맞춤
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
        height: DIARY_CARD_HEIGHT, // 기존 340에서 30% 늘림. (글이 길어져도 늘어나지 않음)
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
        padding: 0,  // Android의 기본 TextInput 패딩을 제거하여 Text 컴포넌트와 동일한 래핑 보장
        margin: 0,
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

    // ─── 멀티페이지 ───
    pageContainer: {
        overflow: 'hidden',
        borderRadius: 12,
    },
    // 📷 사진 추가 버튼 (서랍장 하단 단독 버튼)
    addPhotoButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E9E9E7',
        paddingVertical: 12,
        ...SOFT_SHADOW.card,
    },
    addPhotoButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#37352F',
        marginLeft: 8,
    },
    // ─── 📊 카드 내부 인디케이터 (피드 스타일) ───
    cardIndicatorWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        position: 'relative',
        zIndex: 20,
    },
    cardIndicatorDots: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
    },
    pageDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#D9D9D6',
    },
    pageDotActive: {
        width: 16,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#37352F',
    },
    cardDeleteBtn: {
        position: 'absolute',
        right: 16,
        padding: 4,
    },
    cardDeleteText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#D1D1D1',
    },

    // ─── 🧲 엣지 풀 '+' 카드 ───
    addPageCard: {
        height: DIARY_CARD_HEIGHT,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FAFAFA',
        borderStyle: 'dashed',
        borderColor: '#D3D3D1',
    },
    addPageIcon: {
        fontSize: 36,
        fontWeight: '300',
        color: '#C4C4C4',
        marginBottom: 4,
    },
    addPageText: {
        fontSize: 13,
        fontWeight: '500',
        color: '#ABABAB',
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

    // 하단 바 (App.js의 Notion 탭바 스타일과 완벽히 동기화)
    floatingTabBar: {
        position: 'absolute',
        bottom: 30, // insets.bottom 을 고려한 고정 여백
        left: 20,
        right: 20,
        height: 64,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E9E9E7',
        borderTopWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
    },
    fakeTabButton: {
        flex: 1,
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    saveWrap: {
        flex: 1,
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    saveCircle: {
        width: 56,
        height: 56,
        borderRadius: 16, // 노션의 스쿼클(Squircle) 스타일 중앙 버튼
        backgroundColor: COLORS.happy,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: -20, // App.js 중앙 버튼과 동일한 돌출
        borderWidth: 3,
        borderColor: '#FFFFFF', // 흰색 테두리
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
    },
    bottomSpacer: {
        height: 120,
    },
});

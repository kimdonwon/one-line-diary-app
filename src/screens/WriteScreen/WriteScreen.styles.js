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
        paddingBottom: 40,
    },
    sectionTitle: {
        ...FONTS.subtitle,
        fontSize: 18,
        color: COLORS.text,
        marginBottom: SPACING.md,
        marginTop: 16,
    },
    moodRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start', // 라벨 텍스트 높이 차이로 인한 뒤틀림 방지
        paddingHorizontal: 4,
        marginBottom: 26,
    },


    // ─── 🗂 도구 패널 (Bottom Sheet) ───
    floatingDockContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '26%', // 화면의 약 1/4 (25~30% 사이 적절한 크기)
        zIndex: 100,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        backgroundColor: '#FFFFFF',
        ...SOFT_SHADOW.card,
        borderWidth: 1,
        borderColor: '#E9E9E7',
        borderBottomWidth: 0,
        paddingTop: 8,
    },
    bottomSheetHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        height: 60,
        marginBottom: 8,
    },
    bottomSheetHandle: {
        position: 'absolute',
        top: 0,
        width: 36,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#E6E6E6',
        alignSelf: 'center',
    },
    bottomSheetTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#37352F',
    },
    // Morphing Pill Navigation
    pillNavContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginTop: 18, // 핸들 아래에 위치하도록 마진 추가
    },
    pillButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        backgroundColor: 'transparent',
    },
    pillButtonActiveSticker: {
        backgroundColor: '#E6F4EA', // 연녹색
    },
    pillButtonActivePhoto: {
        backgroundColor: '#FCE8E6', // 연분홍
    },
    pillButtonActiveText: {
        backgroundColor: '#FEF7E0', // 연노랑
    },
    pillIconText: {
        fontSize: 16,
    },
    pillLabel: {
        fontSize: 13,
        fontWeight: '700',
        marginLeft: 6,
    },
    pillLabelSticker: { color: '#0F7B6C' },
    pillLabelPhoto: { color: '#E03E3E' },
    pillLabelText: { color: '#D9730D' },
    floatingDockContent: {
        paddingHorizontal: SPACING.md,
        width: '100%',
        flex: 1,
    },
    stickerBottomSheet: {
        backgroundColor: 'transparent',
        paddingHorizontal: 0,
        paddingVertical: 0,
    },

    // ─── 📷 사진 프레임 선택 바텀시트 영역 (MZ 폴꾸 테마) ───
    photoFrameContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        gap: 12,
        paddingVertical: 6, // 12 -> 6 으로 컨테이너 상하 패딩 축소
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
        backgroundColor: '#FFEBEF',
        borderColor: '#FFD9E1',
    },
    framePreviewBlue: {
        backgroundColor: '#EBF4FF',
        borderColor: '#D4E8FF',
    },
    framePreviewMint: {
        backgroundColor: '#EBFFF0',
        borderColor: '#D4FFE0',
    },
    framePreviewGray: {
        backgroundColor: '#E5E5E5',
        borderColor: '#D1D1D1',
    },
    // ── 반투명 프레임 프리뷰 ──
    framePreviewTransparentWhite: {
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        borderColor: 'rgba(220, 220, 218, 0.6)',
        borderStyle: 'dashed',
    },
    framePreviewTransparentGray: {
        backgroundColor: 'rgba(200, 200, 198, 0.7)',
        borderColor: 'rgba(180, 180, 178, 0.6)',
        borderStyle: 'dashed',
    },
    transparentBadge: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        backgroundColor: 'rgba(55, 53, 47, 0.45)',
        paddingHorizontal: 3,
        paddingVertical: 1,
        borderRadius: 2,
    },
    transparentBadgeText: {
        fontSize: 6,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    frameOptionLabel: {
        fontSize: 10,
        fontWeight: '500',
        color: '#83837F',
        marginTop: 4,
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
    premiumTag: {
        position: 'absolute',
        top: 2,
        right: 4,
        zIndex: 5,
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
        backgroundColor: '#FBF8F4', // 종이 질감 느낌의 따뜻한 배경
        height: DIARY_CARD_HEIGHT,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        padding: 0,
        overflow: 'hidden',
        // 통합 카드 내부에 위치하므로 자체 테두리와 그림자는 제거
    },
    // 📝 탭 투 라이트 캔버스 레이어
    canvasLayer: {
        ...StyleSheet.absoluteFillObject,
    },
    // 빈 캔버스 안내 텍스트
    canvasGuide: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.4,
    },
    canvasGuideEmoji: {
        fontSize: 32,
        marginBottom: 8,
    },
    canvasGuideText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#9E8E82',
        textAlign: 'center',
    },

    // ─── 멀티페이지 ───
    integratedDiaryCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E9E9E7',
        overflow: 'hidden',
        marginTop: 20, // 날짜와 캔버스 사이 마진 추가
        ...SOFT_SHADOW.card,
    },
    integratedDiaryMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FCFCFC',
        borderTopWidth: 1,
        borderTopColor: '#F1F1F0',
    },
    pageContainer: {
        overflow: 'hidden',
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
        zIndex: 8, // 사진(5)보다 위, 스티커(10)보다는 아래
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
        borderWidth: 1,
        borderColor: '#D3D3D1',
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
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

    // ─── ✏️ 텍스트 추가 서랍 스타일 ───
    textDrawerWrap: {
        paddingHorizontal: 20,
        paddingTop: 8, // 16 -> 8 로 상단 여백 축소
        paddingBottom: 12, // 24 -> 12 로 하단 여백 축소
        alignItems: 'stretch',
    },
    textInputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    textCustomInput: {
        flex: 1,
        height: 64, // 2줄 정도의 높이
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingTop: 10,
        paddingBottom: 10,
        fontSize: 15,
        color: '#37352F',
        marginRight: 8,
        textAlignVertical: 'top', // 멀티라인 시 텍스트를 상단으로 정렬
        borderWidth: 1,
        borderColor: '#F1F1F0', // 연한 보더 추가
    },
    textAddBtn: {
        backgroundColor: '#37352F',
        height: 44,
        paddingHorizontal: 16,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textAddBtnText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 14,
    },
    textSectionTitle: {
        fontSize: 13,
        fontWeight: '600',
        color: '#83837F',
        marginBottom: 8,
        marginTop: 8,
    },
    colorScrollWrap: {
        borderRadius: 8,
        paddingVertical: 6, // 10 -> 6 으로 압축
        paddingHorizontal: 0,
        marginBottom: 8, // 16 -> 8 로 폰트 그리드와의 간격 축소
    },
    colorScrollContent: {
        alignItems: 'flex-start',
    },
    colorRowsContainer: {
        flexDirection: 'column',
        gap: 10, // 14 -> 10 으로 두 줄 사이 간격 축소
    },
    colorRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    colorBtn: {
        width: 38,
        height: 38,
        borderRadius: 19,
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#EFEFEF', // 투명/흰색 구분을 위한 기본 연한 테두리
    },
    colorBtnActive: {
        borderWidth: 2,
        borderColor: '#EFEFEF', // 활성 시 약간의 시각적 강조 피드백
        transform: [{ scale: 1.1 }], // 선택 시 직관적으로 크기 키움
    },
    checkIconOverlay: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    colorDivider: {
        width: 1,
        height: 24,
        backgroundColor: '#D1D5DB',
        marginHorizontal: 12, // 간격 조절
    },
    transparentSlash: {
        position: 'absolute',
        width: 1.5,
        height: '140%',
        backgroundColor: '#D1D5DB',
        transform: [{ rotate: '45deg' }],
    },

    // ─── 텍스트 탭 폰트 (3열 그리드) ───
    fontGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        rowGap: 8,
    },
    fontGridItem: {
        width: '32%', // 3열 배치
        aspectRatio: 1.8, // 살짝 더 직사각형
        borderRadius: 6, // 각진 노션 스타일
        justifyContent: 'center',
        alignItems: 'center',
        padding: 4,
        borderWidth: 1,
        borderColor: 'transparent', // 비활성 상태에서는 투명 테두리
    },
    fontGridItemActive: {
        backgroundColor: 'transparent',
        borderColor: COLORS.soso, // 우리 스타일의 파스텔 그레이
        borderWidth: 2,
    },
    fontGridItemText: {
        color: '#111827',
        fontSize: 15,
        textAlign: 'center',
    },
    fontGridItemTextActive: {
        color: '#111827',
        fontWeight: 'bold',
    },

    // ─── 🗑️ 인스타그램 스타일 다크 펄스 쓰레기통 ───
    trashZone: {
        position: 'absolute',
        bottom: 110,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        width: 64,
        height: 64,
        borderRadius: 32, // 완벽한 원형
        backgroundColor: 'rgba(0, 0, 0, 0.45)', // 인스타 스타일 다크 반투명
        zIndex: 9999,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    trashZoneActive: {
        backgroundColor: 'rgba(235, 87, 87, 0.95)', // 강렬한 빨강 피드백
        transform: [{ scale: 1.25 }], // 화끈하게 커짐
        shadowOpacity: 0.4,
        shadowColor: '#EB5757',
    },
    trashIconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    trashText: {
        display: 'none', // 인스타 스타일은 텍스트 없이 아이콘만 표시
    },
    trashTextActive: {
        display: 'none',
    },

    // 세그먼트 컨트롤 삭제됨
    textPanelFooter: {
        marginTop: 12, // 20 -> 12 로 축소
        alignItems: 'center',
        paddingTop: 8, // 12 -> 8 로 축소
        borderTopWidth: 1,
        borderTopColor: '#F1F1F0',
    },
    textPanelHelp: {
        fontSize: 12,
        color: '#A1A19F',
        fontWeight: '500',
    },

    // ─── 🚀 하단 탭바 (App.js MainTabs 스타일 복제) ───
    bottomTabBar: {
        position: 'absolute',
        bottom: 16, // + insets.bottom
        left: 20,
        right: 20,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,   // 노션 컨테이너 라운딩
        borderWidth: 1,
        borderColor: '#E9E9E7', // 노션 테두리 실선
        borderTopWidth: 1, // App.js와 동일한 상단 보더
        height: 64, // 약간 더 슬림하게 (App.js 크기와 일치)
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
    },
    navTabContainer: {
        flex: 1,
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    centerCheckButton: {
        width: 56,
        height: 56,
        borderRadius: 16, // 노션의 스쿼클(Squircle) 스타일
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: -20, // 살짝 떠있도록
        borderWidth: 3,
        borderColor: '#FFFFFF', // 흰색 테두리
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
    },
});

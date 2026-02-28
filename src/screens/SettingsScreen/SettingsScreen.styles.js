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
        padding: SPACING.lg,
        paddingBottom: 100,
    },
    sectionHeader: {
        ...FONTS.subtitle,
        fontSize: 16,
        color: '#666666', // 노션 보조 컬러
        marginBottom: SPACING.sm,
        marginLeft: 4,
    },
    settingCard: {
        padding: 0,
        overflow: 'hidden',
        marginBottom: 30,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: SPACING.lg,
        borderBottomWidth: 1,
        borderBottomColor: '#E9E9E7', // 노션 스타일 분리선
    },
    settingLabel: {
        ...FONTS.subtitle,
        fontSize: 18,
        color: '#37352F', // 노션 타이틀 컬러
    },
    settingDesc: {
        ...FONTS.body,
        fontSize: 13,
        color: '#666666', // 노션 보조 컬러
        marginTop: 2,
    },
    actionButton: {
        padding: SPACING.md,
        alignItems: 'center',
        backgroundColor: COLORS.card,
    },
    actionButtonText: {
        ...FONTS.body,
        fontSize: 15,
        color: '#37352F', // 노션 액션 텍스트 (다크 차콜)
        fontWeight: '600',
    },
    premiumContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12, // 노션 스타일 라운딩
        padding: SPACING.xl,
        borderWidth: 1,
        borderColor: '#E9E9E7',
        ...SOFT_SHADOW.card,
    },
    premiumHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    premiumTitle: {
        fontSize: 18,
        fontWeight: '700', // 너무 무겁지 않게
        color: '#37352F', // 차콜
    },
    premiumBadge: {
        backgroundColor: '#FFEB3B',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    premiumBadgeText: {
        fontSize: 11,
        fontWeight: '800',
        color: '#D84315',
    },
    premiumPrice: {
        fontSize: 28,
        fontWeight: '700',
        color: '#37352F',
        marginBottom: 20,
    },
    premiumPriceUnit: {
        fontSize: 14,
        fontWeight: '500',
        color: '#666666',
    },
    premiumBenefits: {
        marginBottom: 24,
    },
    premiumBenefitItem: {
        fontSize: 14,
        fontWeight: '500',
        color: '#666666', // 노션 보조 텍스트
        lineHeight: 22,
        marginBottom: 6,
    },
    premiumSubscribeButton: {
        backgroundColor: '#1F1F1F',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 12,
    },
    premiumSubscribeButtonActive: {
        backgroundColor: '#999999',
    },
    premiumSubscribeText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    premiumSubText: {
        fontSize: 12,
        color: '#999999',
        textAlign: 'center',
    },
    sectionHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingRight: 8,
    },
    sectionHeaderCaret: {
        fontSize: 12,
        color: '#999999',
        marginBottom: SPACING.sm,
    },

    // ─── 스티커 상점 (Notion Style) ───
    // ─── 스티커 상점 (Skill-based Card Grid) ───
    shopContainer: {
        padding: 0,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E9E9E7',
        marginBottom: 30,
        overflow: 'hidden',
        ...SOFT_SHADOW.card,
    },
    shopGridWrapper: {
        padding: SPACING.lg,
        paddingBottom: SPACING.lg - 8,
    },
    shopGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    shopCard: {
        width: '31.3%',
        padding: 8,
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E9E9E7',
        marginBottom: 8,
        ...SOFT_SHADOW.card,
        shadowOpacity: 0.05,
    },
    shopCardGrabbing: {
        borderColor: '#37352F',
        borderWidth: 1.5,
    },
    // 상단 이름 태그
    shopCardTag: {
        alignSelf: 'flex-start',
        backgroundColor: '#F1F1F0',
        paddingHorizontal: 4,
        paddingVertical: 1,
        borderRadius: 4,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#E9E9E7',
    },
    shopCardLabel: {
        fontSize: 8,
        fontWeight: '800',
        color: '#37352F',
    },
    // 중간 구분선
    shopCardDivider: {
        height: 1,
        backgroundColor: '#F1F1F0',
        marginBottom: 10,
    },
    // 하단 스티커 미리보기 3개
    shopCardPreviewRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 6,
    },
    shopPreviewWrap: {
        width: 18,
        height: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    shopPreviewEmoji: {
        fontSize: 12,
    },
    // 하단 가격/상태 표시줄
    shopCardStatus: {
        borderTopWidth: 1,
        borderTopColor: '#F1F1F0',
        paddingTop: 6,
        alignItems: 'center',
    },
    shopCardPrice: {
        fontSize: 9,
        fontWeight: '700',
        color: '#D84315', // 포인트 컬러
    },
    shopCardOwned: {
        fontSize: 9,
        fontWeight: '600',
        color: '#999999',
    },


    // ─── 미리보기 모달 (Notion Style) ───
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    previewContainer: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 24,
        ...SOFT_SHADOW.card,
    },
    previewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    previewTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#37352F',
    },
    previewClose: {
        fontSize: 24,
        color: '#999999',
        padding: 4,
    },
    previewGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    previewItem: {
        width: '16%', // 6개씩 배치
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        backgroundColor: '#F7F7F5',
        borderRadius: 8,
    },
    previewEmoji: {
        fontSize: 24,
    },
    previewUnlockButton: {
        backgroundColor: '#1F1F1F',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    previewUnlockText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '600',
    },
    previewOwnedBadge: {
        backgroundColor: '#F0F9F4',
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
    },
    previewOwnedText: {
        color: '#219653',
        fontSize: 14,
        fontWeight: '600',
    },

    footer: {
        alignItems: 'center',
        marginTop: 'auto',
        paddingBottom: 40,
    },
    versionText: {
        ...FONTS.caption,
        marginTop: 10,
        color: COLORS.textSecondary,
    }
});

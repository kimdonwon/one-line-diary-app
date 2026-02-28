import { StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS, SOFT_SHADOW } from '../../constants/theme';

/**
 * 🎨 메인(홈) 화면 전용 스타일 시트
 */
export const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    scrollView: { flex: 1 },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 54,
        paddingBottom: SPACING.sm,
        paddingHorizontal: SPACING.lg,
        backgroundColor: COLORS.background,
    },
    headerLeft: {
        flexDirection: 'column',
    },
    headerTitle: {
        ...FONTS.subtitle,
        fontSize: 26,
    },
    headerSmallCharWrap: {
        marginLeft: 8,
    },
    headerBadge: {
        marginTop: 4,
    },
    headerBadgeText: {
        fontSize: 16,
        color: COLORS.textSecondary,
        fontWeight: '600',
    },

    // Calendar card (Notion Style)
    calendarCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12, // 노션 스타일 라운딩
        borderWidth: 1,
        borderColor: '#E9E9E7', // 노션 스타일 실선
        marginHorizontal: SPACING.md,
        marginTop: SPACING.md,
        paddingBottom: SPACING.md,
        ...SOFT_SHADOW.card,
    },

    // Month nav
    monthNav: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        paddingTop: SPACING.lg, paddingBottom: SPACING.sm,
    },
    navArrow: {
        fontSize: 28, fontWeight: '300', color: '#666666', // 노션 보조 컬러
        paddingHorizontal: SPACING.lg,
    },
    monthTitle: { ...FONTS.subtitle, fontSize: 22, color: '#37352F' }, // 노션 차콜 컬러

    // Day headers
    dayHeaderRow: { flexDirection: 'row', paddingHorizontal: SPACING.sm, marginTop: SPACING.sm },
    dayHeaderCell: { flex: 1, alignItems: 'center', paddingVertical: SPACING.xs },
    dayHeaderText: { ...FONTS.calendarHeader, color: '#666666' }, // 노션 보조 컬러

    // Calendar grid
    calendarGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: SPACING.sm },
    dayCell: { width: `${100 / 7}%`, alignItems: 'center', paddingVertical: SPACING.sm, minHeight: 65 },
    dayCellInner: { alignItems: 'center', borderRadius: RADIUS.sm, padding: 2 },
    dayNumberWrap: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
    dayNumber: { ...FONTS.calendarDay, color: '#37352F' }, // 노션 본문 컬러
    todayCircle: { backgroundColor: COLORS.todayHighlight },
    todayText: { color: '#FFFFFF', fontWeight: '800' },
    dayMoodWrap: { marginTop: 3 },

    // ─── 월간 요약 (인라인) ───
    summarySection: {
        paddingHorizontal: SPACING.md,
        paddingTop: SPACING.lg,
    },
    sectionRow: {
        flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.md,
    },
    sectionTitle: {
        ...FONTS.subtitle, fontSize: 18,
    },
    chartCard: { marginBottom: SPACING.lg },
    topMoodBanner: {
        padding: SPACING.md, borderRadius: 12, alignItems: 'center', marginTop: SPACING.sm,
        borderWidth: 1, borderColor: '#E9E9E7',
        overflow: 'visible', position: 'relative',
        zIndex: 10,
    },
    topMoodRow: { flexDirection: 'row', alignItems: 'center' },
    topMoodText: { fontSize: 16, fontWeight: '600', color: '#37352F' }, // 노션 본문 차콜 컬러
    emptyCard: { alignItems: 'center', paddingVertical: SPACING.xl },
    emptyText: { ...FONTS.body, color: COLORS.textSecondary },

    // 활동 바
    actBarRow: {
        flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.sm,
    },
    actBarIcon: { fontSize: 18, width: 28 },
    actBarLabel: { fontSize: 13, fontWeight: '700', color: COLORS.text, width: 44 },
    actBarTrack: {
        flex: 1, height: 18, backgroundColor: '#FFF5F5',
        borderRadius: RADIUS.full, overflow: 'hidden',
        borderWidth: 1, borderColor: COLORS.border,
        marginHorizontal: SPACING.sm,
    },
    actBarFill: { height: '100%', borderRadius: RADIUS.full },
    actBarCount: { width: 24, textAlign: 'right', fontSize: 14, fontWeight: '700', color: COLORS.text },

    bottomSpacer: { height: 130 }
});

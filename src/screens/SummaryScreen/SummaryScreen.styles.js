import { StyleSheet, Dimensions } from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS, SOFT_SHADOW } from '../../constants/theme';

const SCREEN_WIDTH = Dimensions.get('window').width;

export const chartConstants = {
    SCREEN_WIDTH,
    chartW: SCREEN_WIDTH - 80,
    chartH: 160,
    pLeft: 0,
    pTop: 10,
    pBot: 25,
};

export const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },

    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingTop: 50, paddingBottom: SPACING.sm, paddingHorizontal: SPACING.md,
        backgroundColor: COLORS.background,
    },
    backCircle: {
        width: 36, height: 36, borderRadius: 18,
        backgroundColor: '#FFFFFF',
        alignItems: 'center', justifyContent: 'center',
        ...SOFT_SHADOW.card,
    },
    backIcon: { fontSize: 22, color: COLORS.text, marginLeft: -2, lineHeight: 24 },
    headerTitle: { ...FONTS.subtitle },
    headerSpacer: { width: 40 },

    // 페이지 인디케이터 (탭) - Doodle Flash 스타일 🎨
    pageIndicator: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingBottom: SPACING.md,
        gap: 16,
    },
    pageTab: {
        paddingVertical: 8,
        paddingHorizontal: 24,
        borderRadius: RADIUS.full,
        backgroundColor: '#FFFFFF',
    },
    pageTabActive: {
        backgroundColor: '#FF7474',
    },
    pageTabText: {
        fontSize: 16,
        fontWeight: '800',
        color: '#CB9D6C', // 부드러운 쿠키 반죽 색상으로 디폴트 텍스트 처리
    },
    pageTabTextActive: {
        color: '#FFFFFF',
    },

    scrollView: { flex: 1 },
    pageScrollView: { width: SCREEN_WIDTH },
    scrollContent: { padding: SPACING.md, paddingBottom: 40 },

    heroBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.lg,
        borderRadius: RADIUS.lg,
        marginBottom: SPACING.lg,
        ...SOFT_SHADOW.button,
    },
    heroTextWrap: { flex: 1, marginLeft: SPACING.md },
    heroLabel: { fontSize: 13, fontWeight: '600', color: '#FFFFFF', opacity: 0.85 },
    heroTitle: { fontSize: 28, fontWeight: '700', color: '#FFFFFF', marginVertical: 2 },
    heroSub: { fontSize: 14, fontWeight: '500', color: '#FFFFFF', opacity: 0.9 },

    emptyCard: { alignItems: 'center', paddingVertical: SPACING.xl },
    emptyTitle: { ...FONTS.subtitle, fontSize: 18, marginTop: SPACING.md, marginBottom: SPACING.xs },
    emptyText: { ...FONTS.body, color: COLORS.textSecondary },

    sectionRow: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.md },
    sectionTitle: { ...FONTS.subtitle, fontSize: 18 },
    chartCard: { marginBottom: SPACING.lg },

    monthlyCard: { marginBottom: SPACING.lg },
    monthlyGrid: {
        flexDirection: 'row', justifyContent: 'space-between',
        alignItems: 'flex-end', height: 130,
    },
    monthlyItem: { flex: 1, alignItems: 'center' },
    monthlyBarWrap: {
        width: 14, height: 80, backgroundColor: COLORS.border,
        borderRadius: 7, overflow: 'hidden', justifyContent: 'flex-end', marginBottom: 4,
    },
    monthlyBar: { width: '100%', borderRadius: 7 },
    monthlyLabel: { fontSize: 10, fontWeight: '700', color: COLORS.textSecondary, marginBottom: 2 },

    // 꺾은선 그래프
    lineChartLabels: {
        flexDirection: 'row', justifyContent: 'space-between',
        paddingHorizontal: 0, marginTop: -4,
    },
    lineChartLabel: { fontSize: 10, fontWeight: '700', color: COLORS.textSecondary, textAlign: 'center', width: chartConstants.chartW / 12 },

    legendRow: {
        flexDirection: 'row', justifyContent: 'center',
        flexWrap: 'wrap', marginTop: SPACING.md, gap: 12,
    },
    legendItem: { flexDirection: 'row', alignItems: 'center', gap: 3 },
    legendText: { fontSize: 11, fontWeight: '700' },

    // 활동 바
    activityBarRow: {
        flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.sm + 2,
    },
    activityBarIcon: { fontSize: 18, width: 28 },
    activityBarLabel: { fontSize: 13, fontWeight: '700', color: COLORS.text, width: 44 },
    activityBarTrack: {
        flex: 1, height: 20, backgroundColor: '#FFF5F5',
        borderRadius: RADIUS.full, overflow: 'hidden',
        borderWidth: 1, borderColor: COLORS.border,
        marginHorizontal: SPACING.sm,
    },
    activityBarFill: { height: '100%', borderRadius: RADIUS.full },
    activityBarCount: { width: 28, textAlign: 'right', fontSize: 14, fontWeight: '700', color: COLORS.text },

    // 활동 그리드 버튼
    activityGridContainer: {
        flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, justifyContent: 'flex-start',
    },
    activityGridButton: {
        width: '31%',
        backgroundColor: '#FFFFFF',
        borderRadius: RADIUS.md,
        paddingVertical: 14,
        alignItems: 'center', justifyContent: 'center',
        borderWidth: 1, borderColor: '#F0EBE6',
    },
    activityGridIconWrap: { marginBottom: 6 },
    activityGridLabel: { fontSize: 13, fontWeight: '700', color: COLORS.text },

    // 유틸
    flexRow: { flexDirection: 'row', alignItems: 'center' },
    flexOne: { flex: 1 },
    spacer40: { height: 40 },
    chartContainer: { alignSelf: 'center' },
    legendWrapRow: { flexWrap: 'wrap' },
    legendMarginBottom: { marginBottom: 4 },
    navIconArrow: { fontSize: 16, color: COLORS.border, marginLeft: 4, marginBottom: 8 },
    activityNavIconArrow: { fontSize: 16, color: COLORS.border, marginLeft: 4 },
});

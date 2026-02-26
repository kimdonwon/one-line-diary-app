import { StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS, SOFT_SHADOW } from '../../constants/theme';

/**
 * 🎨 일기 작성 화면 전용 스타일 시트입니다.
 * 폼(Form), 버튼, 모달, 다꾸(스티커) 영역 등에 대한 모든 디자인 요소를 정의합니다.
 */
export const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },

    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingTop: 54, paddingBottom: SPACING.md, paddingHorizontal: SPACING.md,
        backgroundColor: COLORS.background,
    },
    backCircle: {
        width: 36, height: 36, borderRadius: 18,
        backgroundColor: '#FFFFFF',
        alignItems: 'center', justifyContent: 'center',
        ...SOFT_SHADOW.card,
    },
    backIcon: { fontSize: 22, color: COLORS.text, marginLeft: -2, lineHeight: 24 },
    headerCenter: { alignItems: 'center' },
    headerDate: { ...FONTS.subtitle, fontSize: 18 },
    headerMoodLabel: { fontSize: 13, fontWeight: '600', marginTop: 2 },
    headerSpacer: { width: 36 },

    scrollView: { flex: 1 },
    scrollContent: { padding: SPACING.md, paddingBottom: 100 },

    sectionTitle: { ...FONTS.subtitle, fontSize: 20, marginBottom: SPACING.md, textAlign: 'center' },

    moodRow: {
        flexDirection: 'row', justifyContent: 'space-between',
        paddingHorizontal: SPACING.xs, paddingBottom: SPACING.lg, width: '100%',
    },

    inputCard: {
        marginBottom: SPACING.lg,
        minHeight: 220, // 🌟 다꾸를 위해 세로 공간 대폭 확장 
        position: 'relative', // 자식 absolute positioning을 위해
        borderWidth: 2, // 🚧 디버깅 및 경계 확인용 벽(검은선)
        borderColor: '#000000',
        padding: 0,
    },
    inputInnerPad: { padding: SPACING.md, flex: 1 },
    textInput: { ...FONTS.body, fontSize: 16, lineHeight: 26, minHeight: 180 },
    inputFooter: {
        flexDirection: 'row', justifyContent: 'space-between',
        alignItems: 'center', marginTop: SPACING.sm, marginBottom: SPACING.md,
    },
    lineCount: { ...FONTS.caption, fontWeight: '600' },
    charCount: { ...FONTS.caption, color: COLORS.textSecondary },

    // 다꾸 스티커 토글 및 바
    stickerHeaderWrapper: {
        alignItems: 'flex-start',
        marginBottom: SPACING.xs,
        paddingHorizontal: SPACING.xs,
    },
    stickerToggleButton: {
        paddingVertical: 6,
        paddingHorizontal: 10,
        backgroundColor: '#FFF8F0',
        borderRadius: RADIUS.full,
        ...SOFT_SHADOW.button,
    },
    stickerToggleText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#D49A89',
    },
    stickerContainer: {
        marginBottom: SPACING.sm,
    },
    stickerScroll: {
        flexDirection: 'row',
        paddingHorizontal: SPACING.xs,
        paddingVertical: 2,
    },
    stickerScrollOffset: {
        flexDirection: 'row',
        paddingHorizontal: SPACING.xs,
        paddingVertical: 2,
        marginTop: -4
    },
    stickerButton: {
        paddingHorizontal: 8,
        paddingVertical: 8,
        marginRight: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    stickerText: {
        fontSize: 16,
        color: COLORS.text,
    },

    // 활동 그리드
    activityGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 10,
        marginBottom: SPACING.lg,
    },
    activityChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.card,
        borderRadius: RADIUS.full,
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderWidth: 1.5,
        borderColor: COLORS.border,
        ...SOFT_SHADOW.card,
    },
    activityChipSelected: {
        // backgroundColor와 borderColor는 인라인에서 주입됨
    },
    activityIcon: { fontSize: 16, marginRight: 4 },
    activityLabel: {
        fontSize: 13, fontWeight: '600', color: COLORS.text,
    },
    activityLabelSelected: { color: '#FFFFFF', fontWeight: '700' },

    // 활동 느낀점 카드
    activityNoteCard: {
        marginBottom: SPACING.sm,
        paddingVertical: SPACING.sm,
    },
    activityNoteHeader: {
        flexDirection: 'row', alignItems: 'center', marginBottom: 6,
    },
    activityNoteIcon: { fontSize: 16, marginRight: 6 },
    activityNoteLabel: { fontSize: 14, fontWeight: '700' },
    activityTitleInput: {
        ...FONTS.body,
        fontSize: 15,
        fontWeight: '600',
        borderBottomWidth: 1.5,
        borderBottomColor: COLORS.border,
        paddingVertical: 6,
        marginBottom: 4,
        color: COLORS.text,
    },
    activityNoteInput: {
        ...FONTS.body,
        fontSize: 14,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        paddingVertical: 4,
    },
    bottomSpacer: { height: 80 },

    // 저장 플로팅
    saveCircle: {
        position: 'absolute',
        bottom: 32,
        right: 24,
        width: 62,
        height: 62,
        borderRadius: 31,
        alignItems: 'center',
        justifyContent: 'center',
        ...SOFT_SHADOW.button,
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 6,
    },
});

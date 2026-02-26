import { StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING } from '../../constants/theme';

/**
 * 🎨 기분별 기록 목록 화면의 전용 스타일 시트
 * 화면의 모든 여백, 색상, 타이포그래피 요소들을 모듈화합니다.
 */
export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 50,
        paddingBottom: SPACING.md,
        paddingHorizontal: SPACING.md,
    },
    headerTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerIconWrapper: {
        marginRight: 8,
    },
    headerTitle: {
        ...FONTS.subtitle
    },
    spacer: {
        width: 40
    },
    centerBox: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    loadingText: {
        color: COLORS.textSecondary,
        fontSize: 16
    },
    emptyText: {
        color: COLORS.textSecondary,
        fontSize: 16
    },
    listContent: {
        padding: SPACING.md,
        paddingBottom: 40,
    }
});

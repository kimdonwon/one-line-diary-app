import { StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING, SOFT_SHADOW } from '../../constants/theme';

/**
 * 🎨 활동 리스트 화면 모듈의 스타일 시트 (Modular UI Developer)
 * UI 컴포넌트 파일의 가독성을 높이기 위해 모든 디자인 수치와 컬러는 이 파일에서 관리합니다.
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
    backCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        ...SOFT_SHADOW.card,
    },
    backIcon: {
        fontSize: 22,
        color: COLORS.text,
        marginLeft: -2,
        lineHeight: 24
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

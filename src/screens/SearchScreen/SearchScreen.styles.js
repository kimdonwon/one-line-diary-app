import { StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS } from '../../constants/theme';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background, // 앱 공통 배경색 (라벤더 핑크 계열) 적용
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 50,
        paddingBottom: SPACING.sm,
        paddingHorizontal: SPACING.md,
    },
    headerTitle: {
        ...FONTS.subtitle,
    },
    headerSpacer: { width: 40 },
    searchHeaderWrapper: {
        paddingTop: SPACING.md,
        paddingHorizontal: SPACING.md,
        paddingBottom: SPACING.sm,
    },
    scrollView: {
        flex: 1,
    },
    searchResultsContainer: {
        paddingHorizontal: SPACING.md,
    },
    chartCard: {
        marginBottom: SPACING.lg,
        padding: SPACING.lg,
        backgroundColor: '#FFFFFF',
        borderRadius: 12, // 노션 스타일 라운딩
        borderWidth: 1,
        borderColor: '#E9E9E7',
    },
    sectionTitle: {
        ...FONTS.subtitle,
        fontSize: 16,
        color: '#666666', // 노션 보조 컬러
        marginBottom: SPACING.xs,
        paddingLeft: 4,
    },
    spacer: {
        height: SPACING.sm,
    },
    emptyCard: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12, // 노션 스타일
        borderWidth: 1,
        borderColor: '#E9E9E7',
        paddingVertical: 50,
        marginTop: SPACING.md,
    },
    emptyText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#666666',
    },
    bottomPadding: {
        height: 120, // 하단 탭바를 가리지 않기 위한 여백
    }
});

import { StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING } from '../../constants/theme';

/**
 * 🎨 검색 화면 전용 스타일 시트입니다.
 * 인라인 스타일을 배제하고 모든 디자인 요소(여백, 색상, 타이포그래피)를 이 파일에서 중앙 통제합니다.
 */
export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background, // 앱 공통 배경색 (라벤더 핑크 계열) 적용
    },
    header: {
        paddingTop: 54, // 상단 상태바 영역 확보를 위한 패딩
        paddingBottom: SPACING.sm,
        paddingHorizontal: SPACING.lg,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: COLORS.text,     // 주요 텍스트 컬러 통일
        letterSpacing: -0.5,
    },
    searchHeaderWrapper: {
        paddingHorizontal: SPACING.md,
        paddingBottom: SPACING.md,
    },
    scrollView: {
        flex: 1,
    },
    searchResultsContainer: {
        paddingHorizontal: SPACING.md,
    },
    chartCard: {
        marginBottom: SPACING.sm, // 리스트 내 카드 요소 간의 간격
    },
    sectionTitle: {
        ...FONTS.subtitle,
        fontSize: 18,
    },
    spacer: {
        height: SPACING.md,
    },
    emptyCard: {
        alignItems: 'center',
        paddingVertical: SPACING.xl, // 내용이 없을 때 중앙에 크게 보여주기 위해 넉넉한 상하 여백 적용
    },
    emptyText: {
        ...FONTS.body,
        color: COLORS.textSecondary, // 중요도가 낮은 안내 텍스트
    },
    bottomPadding: {
        height: 100, // 하단 탭바(BottomNavigation)를 가리지 않기 위한 여백
    }
});

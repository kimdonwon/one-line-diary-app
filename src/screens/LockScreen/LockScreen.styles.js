import { StyleSheet, Dimensions } from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS, SOFT_SHADOW } from '../../constants/theme';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background, // 앱 공통 배경색
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: SPACING.xl,
    },
    headerWrap: {
        alignItems: 'center',
        marginBottom: 40,
    },
    title: {
        ...FONTS.title,
        fontSize: 24,
        color: COLORS.text,
        marginTop: 16,
    },
    subtitle: {
        ...FONTS.body,
        fontSize: 14,
        color: COLORS.textSecondary,
        marginTop: 8,
    },

    // ⚪️⚪️⚪️⚪️ 도트 표시
    dotsRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 60,
        gap: 20,
    },
    dot: {
        width: 18,
        height: 18,
        borderRadius: 9,
        borderWidth: 2,
        borderColor: COLORS.text,
        backgroundColor: 'transparent',
    },
    dotFilled: {
        backgroundColor: COLORS.happy, // 포인트 컬러 (노랑/오렌지 계열)
    },

    // 🔢 숫자 패드
    numpad: {
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 15,
    },
    numButton: {
        width: (width - 120) / 3,
        aspectRatio: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        borderWidth: 3,
        borderColor: COLORS.text,
        alignItems: 'center',
        justifyContent: 'center',
        ...SOFT_SHADOW.card,
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
        shadowColor: COLORS.text, // 하드 쉐도우
    },
    numText: {
        ...FONTS.subtitle,
        fontSize: 26,
        color: COLORS.text,
    },
    emptyButton: {
        width: (width - 120) / 3,
        aspectRatio: 1,
        backgroundColor: 'transparent',
    }
});

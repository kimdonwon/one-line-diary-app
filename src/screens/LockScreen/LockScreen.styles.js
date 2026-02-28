import { StyleSheet, Dimensions } from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS, SOFT_SHADOW } from '../../constants/theme';

const { width } = Dimensions.get('window');
const BTN_SIZE = (width - 100) / 3;

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: SPACING.xl,
    },

    // ✦ 반짝이 데코 (Doodle Flash 장식)
    deco1: {
        position: 'absolute',
        top: 80,
        left: 40,
        fontSize: 18,
        color: COLORS.happy,
        opacity: 0.5,
    },
    deco2: {
        position: 'absolute',
        top: 110,
        right: 50,
        fontSize: 22,
        color: COLORS.surprised,
        opacity: 0.4,
    },
    deco3: {
        position: 'absolute',
        top: 170,
        left: 70,
        fontSize: 14,
        color: COLORS.embarrassed,
        opacity: 0.4,
    },

    // 상단 헤더
    headerWrap: {
        alignItems: 'center',
        marginBottom: 32,
    },
    lockIconCircle: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: '#E8F8EE',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    title: {
        ...FONTS.title,
        fontSize: 22,
        color: COLORS.text,
        marginTop: 8,
    },
    subtitle: {
        ...FONTS.body,
        fontSize: 14,
        color: COLORS.textSecondary,
        marginTop: 6,
    },
    errorSubtitle: {
        color: COLORS.embarrassed,
        fontWeight: '700',
    },

    // 도트 표시 (Doodle Flash: 외곽선 없는 면 기반)
    dotsRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 40,
        gap: 20,
    },
    dotOuter: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#F0E6EB',
        alignItems: 'center',
        justifyContent: 'center',
    },
    dotInner: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: COLORS.happy,
    },

    // 숫자 패드 (Doodle Flash: 외곽선 제거, 파스텔 면)
    numpad: {
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 12,
    },
    numButton: {
        width: BTN_SIZE,
        height: BTN_SIZE,
        backgroundColor: '#FFFFFF',
        borderRadius: BTN_SIZE / 2,
        alignItems: 'center',
        justifyContent: 'center',
        ...SOFT_SHADOW.card,
    },
    numText: {
        ...FONTS.subtitle,
        fontSize: 24,
        color: COLORS.text,
    },
    emptyButton: {
        width: BTN_SIZE,
        height: BTN_SIZE,
        backgroundColor: 'transparent',
    },

    // 생체인증 버튼
    biometricButton: {
        width: BTN_SIZE,
        height: BTN_SIZE,
        backgroundColor: '#E8F8EE',
        borderRadius: BTN_SIZE / 2,
        alignItems: 'center',
        justifyContent: 'center',
        ...SOFT_SHADOW.card,
    },

    // 생체인증 안내
    biometricHint: {
        marginTop: 24,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    biometricHintText: {
        ...FONTS.caption,
        color: COLORS.happy,
        fontSize: 14,
        fontWeight: '600',
    },
});

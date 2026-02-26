import { StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../../constants/theme';

/**
 * 🎨 캘린더 화면의 스타일 모듈입니다.
 */
export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        ...FONTS.subtitle,
        marginTop: 20,
        marginBottom: 8,
    },
    subtitle: {
        ...FONTS.body,
        color: COLORS.textSecondary,
    }
});

import { StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../../constants/theme';

/**
 * 🎨 설정 화면의 스타일 시트 모듈입니다.
 * 앱 전체 설정에 필요한 UI 요소들의 크기와 색상을 정의합니다.
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

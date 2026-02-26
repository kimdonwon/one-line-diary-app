import { StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS } from '../../constants/theme';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    content: {
        flex: 1,
        padding: SPACING.lg,
    },
    sectionHeader: {
        ...FONTS.subtitle,
        fontSize: 16,
        color: COLORS.textSecondary,
        marginBottom: SPACING.sm,
        marginLeft: 4,
    },
    settingCard: {
        padding: 0,
        overflow: 'hidden',
        marginBottom: 30,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: SPACING.lg,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    settingLabel: {
        ...FONTS.subtitle,
        fontSize: 18,
        color: COLORS.text,
    },
    settingDesc: {
        ...FONTS.body,
        fontSize: 13,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    actionButton: {
        padding: SPACING.md,
        alignItems: 'center',
        backgroundColor: COLORS.card,
    },
    actionButtonText: {
        ...FONTS.body,
        fontSize: 15,
        color: COLORS.happy,
        fontWeight: '700',
    },
    footer: {
        alignItems: 'center',
        marginTop: 'auto',
        paddingBottom: 40,
    },
    versionText: {
        ...FONTS.caption,
        marginTop: 10,
        color: COLORS.textSecondary,
    }
});

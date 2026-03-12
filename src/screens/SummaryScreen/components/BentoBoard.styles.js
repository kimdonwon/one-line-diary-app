/**
 * 🍱 벤토 보드 스타일 — Bento Grid 레이아웃
 * 
 * 매거진 스타일의 타일 레이아웃을 위한 스타일 정의입니다.
 * Flexbox 기반으로 CSS Grid 효과를 재현합니다.
 * 
 * 참고 스킬: Modular UI Developer, Notion Style Designer
 */

import { StyleSheet, Dimensions } from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS, SOFT_SHADOW } from '../../../constants/theme';

const SCREEN_WIDTH = Dimensions.get('window').width;
const GRID_GAP = 10;
const GRID_PADDING = SPACING.md;
const TILE_HALF_WIDTH = (SCREEN_WIDTH - GRID_PADDING * 2 - GRID_GAP) / 2;

export const bentoStyles = StyleSheet.create({
    // ─── 컨테이너 ───
    container: {
        marginBottom: SPACING.lg,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.md,
        paddingHorizontal: 4,
    },
    sectionEmoji: {
        fontSize: 18,
        marginRight: 6,
    },
    sectionTitle: {
        ...FONTS.subtitle,
        fontSize: 18,
        color: '#37352F',
    },

    // ─── Bento Grid ───
    grid: {
        gap: GRID_GAP,
    },
    gridRow: {
        flexDirection: 'row',
        gap: GRID_GAP,
    },

    // ─── Main Tile (2열 너비) — 키워드 ───
    mainTile: {
        backgroundColor: '#37352F',
        borderRadius: 20,
        padding: SPACING.lg,
        minHeight: 140,
        justifyContent: 'space-between',
        overflow: 'hidden',
    },
    mainTileLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.55)',
        letterSpacing: 1,
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    mainTileWord: {
        fontSize: 34,
        fontWeight: '800',
        color: '#FFFFFF',
        lineHeight: 42,
    },
    mainTileSubWords: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
        marginTop: SPACING.sm,
    },
    subWordChip: {
        backgroundColor: 'rgba(255,255,255,0.12)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
    },
    subWordText: {
        fontSize: 12,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.7)',
    },

    // ─── Status Tile — 작성일수 & 연속 기록 ───
    statusTile: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: SPACING.md,
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#E9E9E7',
        minHeight: 130,
    },
    statusTileLabel: {
        fontSize: 11,
        fontWeight: '600',
        color: '#9E8E82',
        marginBottom: 2,
    },
    statusTileValue: {
        fontSize: 36,
        fontWeight: '800',
        color: '#37352F',
        lineHeight: 42,
    },
    statusTileUnit: {
        fontSize: 14,
        fontWeight: '600',
        color: '#9E8E82',
    },
    streakBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF8E7',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        alignSelf: 'flex-start',
        gap: 4,
    },
    streakBadgeText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#E8A838',
    },

    // ─── Activity Tile — 최다 활동 ───
    activityTile: {
        flex: 1,
        borderRadius: 20,
        padding: SPACING.md,
        justifyContent: 'space-between',
        minHeight: 130,
        overflow: 'hidden',
    },
    activityTileLabel: {
        fontSize: 11,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.7)',
    },
    activityTileName: {
        fontSize: 20,
        fontWeight: '800',
        color: '#FFFFFF',
        marginTop: 4,
    },
    activityTileCount: {
        fontSize: 12,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.8)',
    },
    activityIconWrap: {
        position: 'absolute',
        right: 12,
        bottom: 12,
        opacity: 0.3,
    },

    // ─── Mood Tile — 지배적 감정 ───
    moodTile: {
        flex: 1,
        borderRadius: 20,
        padding: SPACING.md,
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 130,
        overflow: 'hidden',
    },
    moodTileLabel: {
        fontSize: 11,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.7)',
        marginTop: SPACING.sm,
    },
    moodTileName: {
        fontSize: 18,
        fontWeight: '800',
        color: '#FFFFFF',
        marginTop: 2,
    },

    // ─── 분석 중 오버레이 ───
    analyzingOverlay: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(255,255,255,0.6)',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    analyzingText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#9E8E82',
        marginTop: 4,
    },

    // ─── 빈 상태 ───
    emptyMainTile: {
        backgroundColor: '#F7F3F0',
        borderWidth: 1,
        borderColor: '#E9E9E7',
        borderRadius: 20,
        padding: SPACING.lg,
        minHeight: 120,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#9E8E82',
        textAlign: 'center',
    },
});

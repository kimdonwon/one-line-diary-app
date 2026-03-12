/**
 * 🍱 연간 모먼트 벤토 보드 (Annual Bento Board)
 * 참고 스킬: Modular UI Developer, Notion Style Designer
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../../../components';

/**
 * 🍱 벤토 보드 메인 뷰
 */
export const BentoBoard = React.memo(({
    topWords = [],
    maxStreak = 0,
    totalEntries = 0,
    goldenHour = null,
    activityStats = [],
    isAnalyzing = false,
    year,
}) => {
    const hasWords = topWords && topWords.length > 0;
    const topWord = hasWords ? topWords[0].word : null;

    return (
        <Card style={localStyles.container}>
            {/* 섹션 헤더 */}
            <View style={localStyles.sectionHeader}>

                <Text style={localStyles.sectionTitle}>올해의 패턴</Text>
            </View>

            {/* Row 1: 키워드 */}
            {hasWords ? (
                <View style={localStyles.mainTile}>
                    <Text style={localStyles.mainTileLabel}>올해의 단어</Text>
                    <Text style={localStyles.mainTileWord}>"{topWord}"</Text>
                    {topWords.length > 1 && (
                        <View style={localStyles.subRow}>
                            {topWords.slice(1, 5).map((w, i) => (
                                <View key={i} style={localStyles.chip}>
                                    <Text style={localStyles.chipText}>#{w.word}</Text>
                                </View>
                            ))}
                        </View>
                    )}
                </View>
            ) : (
                <View style={localStyles.emptyTile}>
                    <Text style={localStyles.emptyText}>
                        {isAnalyzing ? '키워드 분석 중...' : '일기를 쓰면 키워드가 나타나요 ✏️'}
                    </Text>
                </View>
            )}

            {/* Row 2: 작성일 + 황금 시간대 */}
            <View style={localStyles.row}>
                {/* 작성일 */}
                <View style={localStyles.halfTile}>
                    <Text style={localStyles.halfLabel}>총 작성일</Text>
                    <Text style={localStyles.halfValue}>{totalEntries}<Text style={localStyles.halfUnit}> 일</Text></Text>
                    {maxStreak > 0 && (
                        <View style={localStyles.badge}>
                            <Text style={localStyles.badgeText}>🔥 {maxStreak}일 연속</Text>
                        </View>
                    )}
                </View>

                {/* 황금 시간대 or 가장 활발한 달 */}
                {goldenHour ? (
                    <View style={[localStyles.halfTile, localStyles.goldenTile]}>
                        <Text style={localStyles.goldenLabel}>
                            {goldenHour.type === 'time' ? '기록 시간대' : '가장 활발한 달'}
                        </Text>
                        <Text style={localStyles.goldenEmoji}>{goldenHour.emoji}</Text>
                        <Text style={localStyles.goldenTime}>{goldenHour.label}</Text>
                        <Text style={localStyles.goldenSub}>{goldenHour.count}번 기록</Text>
                    </View>
                ) : (
                    <View style={localStyles.halfTile}>
                        <Text style={localStyles.halfLabel}>기록 시간대</Text>
                        <Text style={localStyles.emptyText}>일기를 쓰면{'\n'}분석돼요 ✏️</Text>
                    </View>
                )}
            </View>
        </Card>
    );
});

const localStyles = StyleSheet.create({
    container: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        paddingHorizontal: 4,
    },
    sectionEmoji: { fontSize: 18, marginRight: 6 },
    sectionTitle: { fontSize: 18, fontWeight: '700', color: '#37352F' },

    // Main Tile (Neutral Pastel Emerald/Sage)
    mainTile: {
        backgroundColor: '#ECFDF5', // Lighter Soft Mint/Emerald
        borderRadius: 20,
        padding: 20,
        minHeight: 120,
        marginBottom: 10,
    },
    mainTileLabel: {
        fontSize: 12, fontWeight: '700', color: '#047857', // Text Emerald
        letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4, opacity: 0.8,
    },
    mainTileWord: {
        fontSize: 32, fontWeight: '800', color: '#064E3B', lineHeight: 40,
    },
    subRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 12 },
    chip: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20,
        borderWidth: 1, borderColor: '#D1FAE5',
    },
    chipText: { fontSize: 12, fontWeight: '700', color: '#047857' },

    // Empty
    emptyTile: {
        backgroundColor: '#F7F3F0', borderWidth: 1, borderColor: '#E9E9E7',
        borderRadius: 20, padding: 20, minHeight: 100,
        justifyContent: 'center', alignItems: 'center', marginBottom: 10,
    },
    emptyText: { fontSize: 14, fontWeight: '500', color: '#9E8E82', textAlign: 'center' },

    // Row
    row: { flexDirection: 'row', gap: 10 },

    // Half Tile
    halfTile: {
        flex: 1, backgroundColor: '#FFFFFF', borderRadius: 20,
        padding: 16, minHeight: 120, borderWidth: 1, borderColor: '#E9E9E7',
        justifyContent: 'space-between',
    },
    halfLabel: { fontSize: 11, fontWeight: '600', color: '#9E8E82', marginBottom: 2 },
    halfValue: { fontSize: 34, fontWeight: '800', color: '#37352F', lineHeight: 40 },
    halfUnit: { fontSize: 14, fontWeight: '600', color: '#9E8E82' },
    badge: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#FFF8E7', paddingHorizontal: 8, paddingVertical: 4,
        borderRadius: 12, alignSelf: 'flex-start',
    },
    badgeText: { fontSize: 11, fontWeight: '700', color: '#E8A838' },

    // Golden Hour (Soft Lavender/Blue)
    goldenTile: {
        backgroundColor: '#EEF2FF', // Lighter Soft Indigo
        borderColor: '#EEF2FF',
    },
    goldenLabel: { fontSize: 11, fontWeight: '700', color: '#3730A3', opacity: 0.7 },
    goldenEmoji: { fontSize: 28, marginTop: 4 },
    goldenTime: { fontSize: 20, fontWeight: '800', color: '#312E81', marginTop: 2 },
    goldenSub: { fontSize: 12, fontWeight: '600', color: '#3730A3', opacity: 0.8 },
});

import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Svg, { Path, Polyline, Circle as SvgCircle } from 'react-native-svg';

import { COLORS } from '../../constants/theme';
import { Card, MoodBar } from '../../components';
import { MoodCharacter } from '../../constants/MoodCharacters';
import { ActivityIcon } from '../../constants/ActivityIcons';

import { useSummaryLogic, MONTH_NAMES } from './SummaryScreen.logic';
import { styles, chartConstants } from './SummaryScreen.styles';

export function SummaryScreenView({ route, navigation }) {
    const scrollRef = useRef(null);
    const {
        year, pageIndex, totalEntries, maxCount, topMoodData, allMoodStats,
        monthlyEntryCounts, maxMonthlyCount, monthlyTopMoods,
        moodLineData, maxLineValue, activityStats, maxActivityCount,
        maxActivityLineValue, activityLineData,
        onPageScroll, handleTabPress, handleGoBack, handleMoodPress,
        handleActivityPress, getActivityByKey
    } = useSummaryLogic(route, navigation, scrollRef);

    const renderMoodLineChart = () => (
        <View style={styles.chartContainer}>
            <Svg width={chartConstants.chartW} height={chartConstants.chartH}>
                {moodLineData.map((d, index) => {
                    const points = d.values.map((v, i) => {
                        const x = (i / (MONTH_NAMES.length - 1)) * chartConstants.chartW;
                        const y = chartConstants.chartH - chartConstants.pBot - (v / maxLineValue) * (chartConstants.chartH - chartConstants.pTop - chartConstants.pBot);
                        return `${x},${y}`;
                    }).join(' ');
                    return (
                        <React.Fragment key={d.key}>
                            <Polyline points={points} fill="none" stroke={d.color} strokeWidth="2.5" />
                            {d.values.map((v, i) => {
                                const x = (i / (MONTH_NAMES.length - 1)) * chartConstants.chartW;
                                const y = chartConstants.chartH - chartConstants.pBot - (v / maxLineValue) * (chartConstants.chartH - chartConstants.pTop - chartConstants.pBot);
                                return <SvgCircle key={i} cx={x} cy={y} r="3" fill={d.color} />;
                            })}
                        </React.Fragment>
                    );
                })}
            </Svg>
            <View style={styles.lineChartLabels}>
                {MONTH_NAMES.map((name, i) => (
                    <Text key={i} style={styles.lineChartLabel}>{name.replace('월', '')}</Text>
                ))}
            </View>
        </View>
    );

    const renderActivityLineChart = () => (
        <View style={styles.chartContainer}>
            <Svg width={chartConstants.chartW} height={chartConstants.chartH}>
                {activityLineData.map((d, index) => {
                    const points = d.values.map((v, i) => {
                        const x = (i / (MONTH_NAMES.length - 1)) * chartConstants.chartW;
                        const y = chartConstants.chartH - chartConstants.pBot - (v / maxActivityLineValue) * (chartConstants.chartH - chartConstants.pTop - chartConstants.pBot);
                        return `${x},${y}`;
                    }).join(' ');
                    return (
                        <React.Fragment key={d.key}>
                            <Polyline points={points} fill="none" stroke={d.color} strokeWidth="2.5" />
                            {d.values.map((v, i) => {
                                const x = (i / (MONTH_NAMES.length - 1)) * chartConstants.chartW;
                                const y = chartConstants.chartH - chartConstants.pBot - (v / maxActivityLineValue) * (chartConstants.chartH - chartConstants.pTop - chartConstants.pBot);
                                return <SvgCircle key={i} cx={x} cy={y} r="3" fill={d.color} />;
                            })}
                        </React.Fragment>
                    );
                })}
            </Svg>
            <View style={styles.lineChartLabels}>
                {MONTH_NAMES.map((name, i) => (
                    <Text key={i} style={styles.lineChartLabel}>{name.replace('월', '')}</Text>
                ))}
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />

            <View style={styles.header}>
                <TouchableOpacity style={styles.backCircle} onPress={handleGoBack}>
                    <Text style={styles.backIcon}>‹</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{year}년 기록</Text>
                <View style={styles.headerSpacer} />
            </View>

            <View style={styles.pageIndicator}>
                <TouchableOpacity style={[styles.pageTab, pageIndex === 0 && styles.pageTabActive]} onPress={() => handleTabPress(0)}>
                    <Text style={[styles.pageTabText, pageIndex === 0 && styles.pageTabTextActive]}>기분</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.pageTab, pageIndex === 1 && styles.pageTabActive]} onPress={() => handleTabPress(1)}>
                    <Text style={[styles.pageTabText, pageIndex === 1 && styles.pageTabTextActive]}>활동</Text>
                </TouchableOpacity>
            </View>

            <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} ref={scrollRef} onScroll={onPageScroll} scrollEventThrottle={16}>

                {/* ─── 페이지 1: 기분 통계 ─── */}
                <View style={styles.pageScrollView}>
                    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                        {totalEntries > 0 ? (
                            <>
                                <View style={[styles.heroBanner, { backgroundColor: topMoodData ? topMoodData.color : COLORS.text }]}>
                                    <View style={styles.heroTextWrap}>
                                        <Text style={styles.heroLabel}>올해의 핵심 기분</Text>
                                        <Text style={styles.heroTitle}>"{topMoodData ? topMoodData.label : '기록이 없어요'}"</Text>
                                        <Text style={styles.heroSub}>총 {totalEntries}번의 하루를 남겼어요!</Text>
                                    </View>
                                    {topMoodData && (
                                        <MoodCharacter character={topMoodData.character} size={70} />
                                    )}
                                </View>

                                <Card style={styles.chartCard}>
                                    <View style={styles.sectionRow}>
                                        <Text style={styles.sectionTitle}>전체 밸런스</Text>
                                    </View>
                                    {allMoodStats.map((mood) => (
                                        <TouchableOpacity key={mood.key} onPress={() => handleMoodPress(mood.key)}>
                                            <MoodBar mood={mood} count={mood.count} maxCount={maxCount} color={mood.color} />
                                            <Text style={styles.navIconArrow}>› 자세히</Text>
                                        </TouchableOpacity>
                                    ))}
                                </Card>

                                <Card style={styles.monthlyCard}>
                                    <View style={styles.sectionRow}>
                                        <Text style={styles.sectionTitle}>기분 흐름도</Text>
                                    </View>
                                    {renderMoodLineChart()}
                                </Card>

                            </>
                        ) : (
                            <Card style={styles.emptyCard}>
                                <Text style={styles.emptyTitle}>올해의 일기가 없어요</Text>
                                <Text style={styles.emptyText}>소중한 하루를 기록해보세요 ✧</Text>
                            </Card>
                        )}
                        <View style={styles.spacer40} />
                    </ScrollView>
                </View>

                {/* ─── 페이지 2: 활동 통계 ─── */}
                <View style={styles.pageScrollView}>
                    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                        {activityStats.length > 0 ? (
                            <>
                                <View style={[styles.heroBanner, { backgroundColor: '#5776DB' }]}>
                                    <View style={styles.heroTextWrap}>
                                        <Text style={styles.heroLabel}>올해의 최다 활동</Text>
                                        <Text style={styles.heroTitle}>{getActivityByKey(activityStats[0].activity)?.label || '기록 없음'}</Text>
                                        <Text style={styles.heroSub}>총 {activityStats.reduce((sum, a) => sum + a.count, 0)}번의 활동을 남겼어요!</Text>
                                    </View>
                                    <View style={{ backgroundColor: '#FFFFFF', padding: 12, borderRadius: 40 }}>
                                        <ActivityIcon type={activityStats[0].activity} size={40} />
                                    </View>
                                </View>

                                <Card style={styles.chartCard}>
                                    <View style={styles.sectionRow}>
                                        <Text style={styles.sectionTitle}>활동 분야별 요약</Text>
                                    </View>
                                    <View style={styles.activityGridContainer}>
                                        {activityStats.map((stat) => {
                                            const act = getActivityByKey(stat.activity);
                                            return (
                                                <TouchableOpacity key={stat.activity} style={styles.activityGridButton} onPress={() => handleActivityPress(stat.activity)}>
                                                    <View style={styles.activityGridIconWrap}>
                                                        <ActivityIcon type={act.key} size={28} />
                                                    </View>
                                                    <Text style={styles.activityGridLabel}>{act.label}</Text>
                                                </TouchableOpacity>
                                            );
                                        })}
                                    </View>
                                    <View style={styles.spacer40} />
                                </Card>

                                <Card style={styles.monthlyCard}>
                                    <View style={styles.sectionRow}>
                                        <Text style={styles.sectionTitle}>활동 흐름도</Text>
                                    </View>
                                    {renderActivityLineChart()}
                                </Card>
                            </>
                        ) : (
                            <Card style={styles.emptyCard}>
                                <Text style={styles.emptyTitle}>올해 기록된 활동이 없어요</Text>
                                <Text style={styles.emptyText}>다양한 일상을 남겨보세요 ✧</Text>
                            </Card>
                        )}
                        <View style={styles.spacer40} />
                    </ScrollView>
                </View>

            </ScrollView>
        </View>
    );
}

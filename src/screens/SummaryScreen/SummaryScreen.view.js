import React, { useRef, useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import Svg, { Path, Polyline, Circle as SvgCircle } from 'react-native-svg';

import { COLORS } from '../../constants/theme';
import { Card, MoodBar, Header } from '../../components';
import { MoodCharacter } from '../../constants/MoodCharacters';
import { ActivityIcon } from '../../constants/ActivityIcons';
import { ConfettiEffect } from '../../components/ConfettiEffect';

import { useSummaryLogic, MONTH_NAMES } from './SummaryScreen.logic';
import { styles, chartConstants } from './SummaryScreen.styles';

/**
 * 📊 애니메이션 활동 바 (외부 추출)
 */
const AnimatedActivityBar = React.memo(({ stat, maxActCount, triggerKey, getActivityByKey, handleActivityPress }) => {
    const act = getActivityByKey(stat.activity);
    const ratio = stat.count / maxActCount;
    const widthAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        widthAnim.setValue(0);
        Animated.timing(widthAnim, {
            toValue: Math.max(ratio * 100, 10),
            duration: 600,
            delay: 100,
            useNativeDriver: false,
        }).start();
    }, [triggerKey]);

    const animatedWidth = widthAnim.interpolate({
        inputRange: [0, 100],
        outputRange: ['0%', '100%'],
    });

    return (
        <TouchableOpacity style={styles.activityBarRow} onPress={() => handleActivityPress(stat.activity)}>
            <View style={styles.activityBarIcon}>
                <ActivityIcon type={act.key} size={20} />
            </View>
            <Text style={styles.activityBarLabel}>{act.label}</Text>
            <View style={styles.activityBarTrack}>
                <Animated.View style={[
                    styles.activityBarFill,
                    {
                        width: animatedWidth,
                        backgroundColor: act.color,
                    },
                ]} />
            </View>
            <Text style={styles.activityBarCount}>{stat.count}</Text>
        </TouchableOpacity>
    );
});

export function SummaryScreenView({ route, navigation }) {
    const scrollRef = useRef(null);
    const {
        year, pageIndex, totalEntries, maxCount, topMoodData, topMoodCount, allMoodStats,
        moodLineData, maxLineValue, activityStats, maxActivityCount,
        maxActivityLineValue, activityLineData,
        onPageScroll, onMomentumScrollEnd, handleTabPress, handleGoBack, handleMoodPress,
        handleActivityPress, getActivityByKey
    } = useSummaryLogic(route, navigation, scrollRef);

    const moodConfettiRef = useRef(null);
    const activityConfettiRef = useRef(null);
    const [animKey, setAnimKey] = useState(0);

    useFocusEffect(
        useCallback(() => {
            setAnimKey(p => p + 1);
        }, [])
    );

    const handleMoodHeroPress = (evt) => {
        const { pageX, pageY } = evt.nativeEvent;
        moodConfettiRef.current?.burst(pageX, pageY);
    };

    const handleActivityHeroPress = (evt) => {
        const { pageX, pageY } = evt.nativeEvent;
        activityConfettiRef.current?.burst(pageX, pageY);
    };



    const renderMoodLineChart = () => (
        <View style={styles.chartContainer}>
            <Svg width={chartConstants.chartW} height={chartConstants.chartH}>
                {moodLineData.map((d) => {
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
                {MONTH_NAMES.map((name, i) => <Text key={i} style={styles.lineChartLabel}>{name.replace('월', '')}</Text>)}
            </View>
        </View>
    );

    const renderActivityLineChart = () => (
        <View style={styles.chartContainer}>
            <Svg width={chartConstants.chartW} height={chartConstants.chartH}>
                {activityLineData.map((d) => {
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
                {MONTH_NAMES.map((name, i) => <Text key={i} style={styles.lineChartLabel}>{name.replace('월', '')}</Text>)}
            </View>
        </View>
    );

    // 💡 초기 진입 시 페이지가 더 있음을 알려주는 '넛지' 효과
    useEffect(() => {
        const timer = setTimeout(() => {
            if (scrollRef.current) {
                // 살짝 오른쪽으로 밀었다가 (60px) 돌아오기
                scrollRef.current.scrollTo({ x: 60, animated: true });
                setTimeout(() => {
                    scrollRef.current?.scrollTo({ x: 0, animated: true });
                }, 400);
            }
        }, 600);
        return () => clearTimeout(timer);
    }, []);

    const moodActiveColor = topMoodData?.color || COLORS.happy;
    const activityActiveColor = '#5776DB';

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />
            <Header title={`${year}년 기록`} />

            <View style={styles.pageIndicator}>
                <View style={[
                    styles.dot,
                    pageIndex === 0 && [styles.dotActive, { backgroundColor: moodActiveColor }]
                ]} />
                <View style={[
                    styles.dot,
                    pageIndex === 1 && [styles.dotActive, { backgroundColor: activityActiveColor }]
                ]} />
            </View>

            <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} ref={scrollRef} onScroll={onPageScroll} onMomentumScrollEnd={onMomentumScrollEnd} scrollEventThrottle={16}>
                <View style={styles.pageScrollView}>
                    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                        {totalEntries > 0 ? (
                            <>
                                <TouchableOpacity style={[styles.heroBanner, { backgroundColor: topMoodData ? topMoodData.color : COLORS.happy }]} onPress={handleMoodHeroPress} activeOpacity={0.8}>
                                    <View style={styles.heroTextWrap}>
                                        <Text style={styles.heroLabel}>올해 가장 많이 느낀 기분</Text>
                                        <Text style={styles.heroTitle}>"{topMoodData ? topMoodData.label : '기록 없음'}"</Text>
                                        <Text style={styles.heroSub}>{topMoodCount}일의 기록이 쌓였어요</Text>
                                    </View>
                                    {topMoodData && <MoodCharacter character={topMoodData.character} size={70} />}
                                </TouchableOpacity>
                                <Card style={styles.chartCard}>
                                    <View style={styles.sectionRow}><Text style={styles.sectionTitle}>기분 비율</Text></View>
                                    {allMoodStats.map((mood) => (
                                        <TouchableOpacity key={mood.key} onPress={() => handleMoodPress(mood.key)}>
                                            <MoodBar mood={mood} count={mood.count} maxCount={maxCount} color={mood.color} animKey={animKey} />
                                        </TouchableOpacity>
                                    ))}
                                </Card>
                                <Card style={styles.monthlyCard}>
                                    <View style={styles.sectionRow}><Text style={styles.sectionTitle}>월별 기분 흐름</Text></View>
                                    {renderMoodLineChart()}
                                </Card>
                            </>
                        ) : (
                            <Card style={styles.emptyCard}>
                                <Text style={styles.emptyTitle}>올해 작성한 일기가 없어요</Text>
                                <Text style={styles.emptyText}>첫 번째 하루를 기록해보세요 ✧</Text>
                            </Card>
                        )}
                        <View style={styles.spacer40} />
                    </ScrollView>
                </View>

                <View style={styles.pageScrollView}>
                    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                        {activityStats.length > 0 ? (
                            <>
                                <TouchableOpacity style={[styles.heroBanner, { backgroundColor: '#5776DB' }]} onPress={handleActivityHeroPress} activeOpacity={0.8}>
                                    <View style={styles.heroTextWrap}>
                                        <Text style={styles.heroLabel}>올해 가장 많이 한 활동</Text>
                                        <Text style={styles.heroTitle}>{getActivityByKey(activityStats[0].activity)?.label || '기록 없음'}</Text>
                                        <Text style={styles.heroSub}>{activityStats[0].count}번 기록했어요</Text>
                                    </View>
                                    <View style={{ backgroundColor: '#FFFFFF', padding: 12, borderRadius: 40 }}><ActivityIcon type={activityStats[0].activity} size={40} /></View>
                                </TouchableOpacity>
                                <Card style={styles.chartCard}>
                                    <View style={styles.sectionRow}><Text style={styles.sectionTitle}>활동별 기록</Text></View>
                                    {activityStats.map((stat) => (
                                        <AnimatedActivityBar
                                            key={stat.activity}
                                            stat={stat}
                                            maxActCount={activityStats[0]?.count || 1}
                                            triggerKey={animKey}
                                            getActivityByKey={getActivityByKey}
                                            handleActivityPress={handleActivityPress}
                                        />
                                    ))}
                                </Card>
                                <Card style={styles.monthlyCard}>
                                    <View style={styles.sectionRow}><Text style={styles.sectionTitle}>월별 활동 흐름</Text></View>
                                    {renderActivityLineChart()}
                                </Card>
                            </>
                        ) : (
                            <Card style={styles.emptyCard}>
                                <Text style={styles.emptyTitle}>올해 기록한 활동이 없어요</Text>
                                <Text style={styles.emptyText}>어떤 하루를 보냈는지 남겨봐요 ✧</Text>
                            </Card>
                        )}
                        <View style={styles.spacer40} />
                    </ScrollView>
                </View>
            </ScrollView>

            {/* 화면 전체를 덮는 절대 좌표 기준 폭죽 효과 (Ref 사용으로 리렌더링 방지) */}
            <ConfettiEffect
                ref={moodConfettiRef}
                renderItem={() => <MoodCharacter character={topMoodData?.character} size={30} />}
            />
            <ConfettiEffect
                ref={activityConfettiRef}
                renderItem={() => <ActivityIcon type={activityStats[0]?.activity} size={30} />}
            />
        </View>
    );
}

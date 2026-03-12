import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Animated, PanResponder } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { COLORS } from '../../constants/theme';
import { Card, MoodBar, Header, SoftAlertModal, ComboShakeMoodCharacter } from '../../components';
import { SearchIcon, TrashIcon } from '../../constants/icons';
import { MoodCharacter } from '../../constants/MoodCharacters';
import { ActivityIcon } from '../../constants/ActivityIcons';
import { getMoodByKey } from '../../constants/mood';
import { getActivityByKey } from '../../constants/activities';
import { ConfettiEffect } from '../../components/ConfettiEffect';
import Svg, { Polyline, Circle as SvgCircle } from 'react-native-svg';

import {
    useMainLogic,
    DAY_NAMES,
    formatDate
} from './MainScreen.logic';
import { styles, chartConstants } from './MainScreen.styles';
import { useGlobalWeeklyMood } from '../../context/MoodContext';

/**
 * 📅 캘린더 셀 컴포넌트 (외부 추출로 re-mount 방지)
 */
const CalendarCell = ({ day, year, month, diaryMap, isToday, getWeekMoodColor, onDayPress, onDayLongPress }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const flashAnim = useRef(new Animated.Value(0)).current;

    const date = formatDate(year, month, day);
    const diary = diaryMap[date];
    const mood = diary ? getMoodByKey(diary.mood) : null;
    const todayFlag = isToday(day);
    const weekColor = getWeekMoodColor(day);

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.85,
            friction: 4,
            useNativeDriver: false, // JS 드라이버 사용 (안정성)
        }).start();

        flashAnim.setValue(0);
        Animated.sequence([
            Animated.timing(flashAnim, { toValue: 1, duration: 150, useNativeDriver: false }),
            Animated.timing(flashAnim, { toValue: 0, duration: 400, useNativeDriver: false }),
        ]).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 4,
            useNativeDriver: false,
        }).start();
    };

    const flashBgColor = flashAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['transparent', weekColor + '40'],
    });

    return (
        <TouchableOpacity
            style={styles.dayCell}
            onPress={() => onDayPress(day)}
            onLongPress={() => onDayLongPress(day)}
            delayLongPress={400}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={1}
        >
            <Animated.View style={[
                styles.dayCellInner,
                {
                    backgroundColor: flashBgColor,
                    transform: [{ scale: scaleAnim }],
                }
            ]}>
                <View style={[styles.dayNumberWrap, todayFlag && styles.todayCircle]}>
                    <Text style={[styles.dayNumber, todayFlag && styles.todayText]}>{day}</Text>
                </View>
                {mood && (
                    <View style={styles.dayMoodWrap}>
                        <MoodCharacter character={mood.character} size={20} />
                    </View>
                )}
            </Animated.View>
        </TouchableOpacity>
    );
};

/**
 * 📊 애니메이션 활동 바 (외부 추출)
 */
const AnimatedActivityBar = ({ stat, maxActCount, onPress }) => {
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
    }, [ratio]);

    const animatedWidth = widthAnim.interpolate({
        inputRange: [0, 100],
        outputRange: ['0%', '100%'],
    });

    return (
        <TouchableOpacity style={styles.actBarRow} onPress={onPress}>
            <View style={styles.actBarIcon}>
                <ActivityIcon type={act.key} size={20} />
            </View>
            <Text style={styles.actBarLabel}>{act.label}</Text>
            <View style={styles.actBarTrack}>
                <Animated.View style={[
                    styles.actBarFill,
                    {
                        width: animatedWidth,
                        backgroundColor: act.color,
                    },
                ]} />
            </View>
            <Text style={styles.actBarCount}>{stat.count}</Text>
        </TouchableOpacity>
    );
};

export function MainScreenView({ navigation }) {
    const {
        year, month, diaries, activityStats, diaryMap,
        firstDay, daysInMonth, topMoodData, allMoodStats, maxCount, dailyMoodFlow,
        showAlert, alertConfig,
        isToday, goToPrevMonth, goToNextMonth, onDayPress, onDayLongPress, onMoodPress, onActivityPress, setShowAlert
    } = useMainLogic(navigation);

    const weeklyMood = useGlobalWeeklyMood();
    const currentHeaderMood = weeklyMood || getMoodByKey('HAPPY');

    const confettiRef = useRef(null);

    const handleTopMoodPress = (evt) => {
        if (topMoodData) {
            const { pageX, pageY } = evt.nativeEvent;
            confettiRef.current?.burst(pageX, pageY);
        }
    };

    const goToPrevRef = useRef(goToPrevMonth);
    const goToNextRef = useRef(goToNextMonth);
    useEffect(() => {
        goToPrevRef.current = goToPrevMonth;
        goToNextRef.current = goToNextMonth;
    }, [goToPrevMonth, goToNextMonth]);

    const slideAnim = useRef(new Animated.Value(0)).current;

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (evt, gs) => Math.abs(gs.dx) > 30 && Math.abs(gs.dy) < 50,
            onPanResponderMove: (evt, gs) => {
                slideAnim.setValue(gs.dx * 0.4);
            },
            onPanResponderRelease: (evt, gs) => {
                if (gs.dx > 70) {
                    Animated.timing(slideAnim, {
                        toValue: 200,
                        duration: 200,
                        useNativeDriver: false,
                    }).start(() => {
                        slideAnim.setValue(0);
                        goToPrevRef.current();
                    });
                } else if (gs.dx < -70) {
                    Animated.timing(slideAnim, {
                        toValue: -200,
                        duration: 200,
                        useNativeDriver: false,
                    }).start(() => {
                        slideAnim.setValue(0);
                        goToNextRef.current();
                    });
                } else {
                    Animated.spring(slideAnim, {
                        toValue: 0,
                        friction: 7,
                        useNativeDriver: false,
                    }).start();
                }
            },
        })
    ).current;

    const getWeekMoodColor = useCallback((day) => {
        const dayDate = new Date(year, month - 1, day);
        const dayOfWeek = dayDate.getDay();
        const weekStart = day - dayOfWeek;
        const weekEnd = weekStart + 6;
        const moodCounts = {};
        for (let d = Math.max(1, weekStart); d <= Math.min(daysInMonth, weekEnd); d++) {
            const date = formatDate(year, month, d);
            const diary = diaryMap[date];
            if (diary?.mood) moodCounts[diary.mood] = (moodCounts[diary.mood] || 0) + 1;
        }
        const entries = Object.entries(moodCounts);
        if (entries.length === 0) return COLORS.happy;
        const topMoodKey = entries.reduce((a, b) => b[1] > a[1] ? b : a)[0];
        return getMoodByKey(topMoodKey)?.color || COLORS.happy;
    }, [year, month, daysInMonth, diaryMap]);

    /**
     * 📈 일별 기분 흐름 차트 렌더링 (단일 궤적 스타일)
     */
    const renderDailyMoodFlow = () => {
        // 기록이 있는 날들만 추출해서 선으로 잇기
        const existingEntries = dailyMoodFlow.filter(d => d.score !== null);

        const getY = (score) => {
            // score 1(Sad) -> 5(Happy)를 차트 안의 Y 좌표로 변환
            const availableH = chartConstants.chartH - chartConstants.pTop - chartConstants.pBot;
            return chartConstants.pTop + (availableH - ((score - 1) / 4) * availableH);
        };

        const getX = (itemDay) => ((itemDay - 1) / (daysInMonth - 1)) * (chartConstants.chartW - 45) + 35;

        const points = existingEntries.map((d) => `${getX(d.day)},${getY(d.score)}`).join(' ');

        return (
            <View style={styles.chartContainer}>
                {/* Y축 기분 아이콘 라벨 */}
                <View style={{ position: 'absolute', left: 5, top: chartConstants.pTop - 8, height: chartConstants.chartH - chartConstants.pBot - chartConstants.pTop + 16, justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
                    <MoodCharacter character="frog" size={18} />
                    <MoodCharacter character="cat" size={18} />
                </View>

                <Svg width={chartConstants.chartW} height={chartConstants.chartH}>
                    {/* 가이드 라인 (3점 중심선 강조) */}
                    {[1, 2, 3, 4, 5].map((s) => {
                        const isMiddle = s === 3;
                        return (
                            <Polyline
                                key={s}
                                points={`35,${getY(s)} ${chartConstants.chartW},${getY(s)}`}
                                fill="none"
                                stroke={isMiddle ? "#E0E0DE" : "#F0F0EE"}
                                strokeWidth={isMiddle ? "2" : "1"}
                                strokeDasharray={isMiddle ? "none" : "4,4"}
                            />
                        );
                    })}

                    {/* 기분 흐름 선 */}
                    {existingEntries.length > 1 && (
                        <Polyline
                            points={points}
                            fill="none"
                            stroke="#E9E9E7"
                            strokeWidth="2"
                        />
                    )}

                    {/* 기록 점 */}
                    {existingEntries.map((d) => (
                        <SvgCircle
                            key={d.day}
                            cx={getX(d.day)}
                            cy={getY(d.score)}
                            r="4.5"
                            fill={d.color}
                            stroke="#FFFFFF"
                            strokeWidth="2"
                        />
                    ))}
                </Svg>

                <View style={[styles.lineChartLabels, { paddingLeft: 35 }]}>
                    {[1, 10, 20, daysInMonth].map((day) => (
                        <Text key={day} style={[styles.lineChartLabel, { width: 30 }]}>{day}일</Text>
                    ))}
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />
            <Header
                title="오늘조각"
                subtitle={`${year}년 ${month}월`}
                titleIcon={<ComboShakeMoodCharacter character={currentHeaderMood.character} size={28} />}
                rightButton={
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Search')}
                        style={{ padding: 8 }}
                        activeOpacity={0.7}
                    >
                        <SearchIcon size={22} color="#37352F" />
                    </TouchableOpacity>
                }
            />
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>


                <Animated.View
                    style={[styles.calendarCard, { transform: [{ translateX: slideAnim }] }]}
                    {...panResponder.panHandlers}
                >
                    <View style={styles.monthNav}>
                        <TouchableOpacity onPress={goToPrevMonth} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                            <Text style={styles.navArrow}>‹</Text>
                        </TouchableOpacity>
                        <Text style={styles.monthTitle}>{month}월</Text>
                        <TouchableOpacity onPress={goToNextMonth} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                            <Text style={styles.navArrow}>›</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.dayHeaderRow}>
                        {DAY_NAMES.map((name, i) => (
                            <View key={name} style={styles.dayHeaderCell}>
                                <Text style={[
                                    styles.dayHeaderText,
                                    i === 0 && { color: COLORS.todayHighlight },
                                    i === 6 && { color: COLORS.sad },
                                ]}>{name}</Text>
                            </View>
                        ))}
                    </View>

                    <View style={styles.calendarGrid}>
                        {Array.from({ length: firstDay }).map((_, i) => (
                            <View key={`empty-${i}`} style={styles.dayCell} />
                        ))}
                        {Array.from({ length: daysInMonth }).map((_, i) => (
                            <CalendarCell
                                key={i + 1}
                                day={i + 1}
                                year={year}
                                month={month}
                                diaryMap={diaryMap}
                                isToday={isToday}
                                getWeekMoodColor={getWeekMoodColor}
                                onDayPress={onDayPress}
                                onDayLongPress={onDayLongPress}
                            />
                        ))}
                    </View>
                </Animated.View>

                <View style={styles.summarySection}>
                    {diaries.length > 0 ? (
                        <>
                            <Card style={styles.chartCard}>
                                <View style={styles.sectionRow}>
                                    <Text style={styles.sectionTitle}>{month}월 기분</Text>
                                </View>
                                {allMoodStats.map((mood) => (
                                    <TouchableOpacity key={mood.key} onPress={() => onMoodPress(mood.key)} activeOpacity={0.7}>
                                        <MoodBar mood={mood} count={mood.count} maxCount={maxCount} color={mood.color} />
                                    </TouchableOpacity>
                                ))}
                                {topMoodData && (
                                    <TouchableOpacity
                                        style={[styles.topMoodBanner, { backgroundColor: topMoodData.bgColor }]}
                                        onPress={handleTopMoodPress}
                                        activeOpacity={0.7}
                                    >
                                        <View style={styles.topMoodRow}>
                                            <Text style={styles.topMoodText}>이번 달 주인공: </Text>
                                            <MoodCharacter character={topMoodData.character} size={28} />
                                            <Text style={styles.topMoodText}> {topMoodData.label}!</Text>
                                        </View>
                                    </TouchableOpacity>
                                )}
                            </Card>

                            {activityStats.length > 0 && (
                                <Card style={styles.chartCard}>
                                    <View style={styles.sectionRow}>
                                        <Text style={styles.sectionTitle}>{month}월 활동</Text>
                                    </View>
                                    {activityStats.map((stat) => (
                                        <AnimatedActivityBar
                                            key={stat.activity}
                                            stat={stat}
                                            maxActCount={activityStats[0].count}
                                            onPress={() => onActivityPress(stat.activity)}
                                        />
                                    ))}
                                </Card>
                            )}

                            <Card style={styles.chartCard}>
                                <View style={styles.sectionRow}>
                                    <Text style={styles.sectionTitle}>{month}월 기분 흐름</Text>
                                </View>
                                {renderDailyMoodFlow()}
                            </Card>

                            {/* 일기 목록 카드 제거됨 */}
                        </>
                    ) : (
                        <Card style={styles.emptyCard}>
                            <Text style={styles.emptyText}>아직 작성된 일기가 없어요 ✧</Text>
                        </Card>
                    )}
                </View>
                <View style={styles.bottomSpacer} />
            </ScrollView>

            {/* 화면 전체를 덮는 절대 좌표 기준 폭죽 효과 (Ref 사용으로 렉 방지) */}
            <ConfettiEffect
                ref={confettiRef}
                renderItem={() => <MoodCharacter character={topMoodData?.character} size={24} />}
            />
            
            <SoftAlertModal
                isVisible={showAlert}
                title={alertConfig.title}
                message={alertConfig.message}
                confirmText={alertConfig.confirmText}
                onConfirm={alertConfig.onConfirm}
                secondaryText={alertConfig.secondaryText}
                onSecondaryConfirm={alertConfig.onSecondaryConfirm}
            />
        </View>
    );
}

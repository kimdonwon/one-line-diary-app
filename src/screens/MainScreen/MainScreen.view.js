import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { COLORS } from '../../constants/theme';
import { Card, MoodBar, DiaryListItem } from '../../components';
import { MoodCharacter } from '../../constants/MoodCharacters';
import { ActivityIcon } from '../../constants/ActivityIcons';
import { getMoodByKey } from '../../constants/mood';
import { getActivityByKey } from '../../constants/activities';

import {
    useMainLogic,
    DAY_NAMES,
    formatDate
} from './MainScreen.logic';
import { styles } from './MainScreen.styles';

/**
 * 🎨 화면 렌더링을 담당하는 뷰 모듈
 */
export function MainScreenView({ navigation }) {
    const {
        year, month,
        diaries, activityStats, diaryMap,
        firstDay, daysInMonth, topMoodData, allMoodStats, headerMood, maxCount,
        isToday,
        goToPrevMonth, goToNextMonth, onDayPress, onDiaryPress
    } = useMainLogic(navigation);

    /**
     * 📅 캘린더 그리드 블록을 렌더링하는 헬퍼 함수
     */
    const renderCalendar = () => {
        const cells = [];
        // 공백 셀 처리
        for (let i = 0; i < firstDay; i++) {
            cells.push(<View key={`empty-${i}`} style={styles.dayCell} />);
        }
        // 각 날짜 셀 삽입
        for (let day = 1; day <= daysInMonth; day++) {
            const date = formatDate(year, month, day);
            const diary = diaryMap[date];
            const mood = diary ? getMoodByKey(diary.mood) : null;
            const todayFlag = isToday(day);

            cells.push(
                <TouchableOpacity
                    key={day}
                    style={styles.dayCell}
                    onPress={() => onDayPress(day)}
                    activeOpacity={0.3}
                >
                    <View style={[styles.dayNumberWrap, todayFlag && styles.todayCircle]}>
                        <Text style={[styles.dayNumber, todayFlag && styles.todayText]}>{day}</Text>
                    </View>
                    {mood && (
                        <View style={styles.dayMoodWrap}>
                            <MoodCharacter character={mood.character} size={20} />
                        </View>
                    )}
                </TouchableOpacity>
            );
        }
        return cells;
    };

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Header Area */}
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.headerTitle}>한줄일기</Text>
                            <View style={styles.headerSmallCharWrap}>
                                <MoodCharacter character={headerMood.character} size={28} />
                            </View>
                        </View>
                        <View style={styles.headerBadge}>
                            <Text style={styles.headerBadgeText}>{year}년 {month}월</Text>
                        </View>
                    </View>
                </View>

                {/* 캘린더 카드 영역 */}
                <View style={styles.calendarCard}>
                    {/* 달 내비게이터 */}
                    <View style={styles.monthNav}>
                        <TouchableOpacity onPress={goToPrevMonth} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
                            <Text style={styles.navArrow}>‹</Text>
                        </TouchableOpacity>
                        <Text style={styles.monthTitle}>{month}월</Text>
                        <TouchableOpacity onPress={goToNextMonth} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
                            <Text style={styles.navArrow}>›</Text>
                        </TouchableOpacity>
                    </View>

                    {/* 요일 헤더 */}
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

                    {/* 일수 렌더 영역 */}
                    <View style={styles.calendarGrid}>
                        {renderCalendar()}
                    </View>
                </View>

                {/* ─── 월간 요약 (인라인 렌더링) ─── */}
                <View style={styles.summarySection}>
                    {diaries.length > 0 ? (
                        <>
                            <Card style={styles.chartCard}>
                                <View style={styles.sectionRow}>
                                    <Text style={styles.sectionTitle}>{month}월 기분</Text>
                                </View>
                                {allMoodStats.map((mood) => (
                                    <MoodBar
                                        key={mood.key}
                                        mood={mood}
                                        count={mood.count}
                                        maxCount={maxCount}
                                        color={mood.color}
                                    />
                                ))}

                                {topMoodData && (
                                    <View style={[styles.topMoodBanner, { backgroundColor: topMoodData.bgColor }]}>
                                        <View style={styles.topMoodRow}>
                                            <Text style={styles.topMoodText}>✨ 이번 달 주인공: </Text>
                                            <MoodCharacter character={topMoodData.character} size={28} />
                                            <Text style={styles.topMoodText}> {topMoodData.label}!</Text>
                                        </View>
                                    </View>
                                )}
                            </Card>

                            <Card style={styles.chartCard}>
                                <View style={styles.sectionRow}>
                                    <Text style={styles.sectionTitle}>✎ 일기 목록</Text>
                                </View>
                                {diaries.map((diary) => (
                                    <DiaryListItem
                                        key={diary.id}
                                        diary={diary}
                                        mood={getMoodByKey(diary.mood)}
                                        onPress={() => onDiaryPress(diary)}
                                    />
                                ))}
                            </Card>

                            {activityStats.length > 0 && (
                                <Card style={styles.chartCard}>
                                    <View style={styles.sectionRow}>
                                        <Text style={styles.sectionTitle}>🏃 {month}월 활동</Text>
                                    </View>
                                    {activityStats.map((stat) => {
                                        const act = getActivityByKey(stat.activity);
                                        const maxActCount = activityStats[0].count;
                                        const ratio = stat.count / maxActCount;
                                        return (
                                            <View key={stat.activity} style={styles.actBarRow}>
                                                <View style={styles.actBarIcon}>
                                                    <ActivityIcon type={act.key} size={20} />
                                                </View>
                                                <Text style={styles.actBarLabel}>{act.label}</Text>
                                                <View style={styles.actBarTrack}>
                                                    <View style={[
                                                        styles.actBarFill,
                                                        {
                                                            width: `${Math.max(ratio * 100, 10)}%`,
                                                            backgroundColor: act.color,
                                                        },
                                                    ]} />
                                                </View>
                                                <Text style={styles.actBarCount}>{stat.count}</Text>
                                            </View>
                                        );
                                    })}
                                </Card>
                            )}
                        </>
                    ) : (
                        <Card style={styles.emptyCard}>
                            <Text style={styles.emptyText}>아직 작성된 일기가 없어요 ✧</Text>
                        </Card>
                    )}
                </View>

                <View style={styles.bottomSpacer} />
            </ScrollView>
        </View>
    );
}

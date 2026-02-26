import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { getMoodByKey, MOOD_LIST } from '../../constants/mood';
import { ACTIVITIES, getActivityByKey } from '../../constants/activities';
import {
    useYearMoodStats,
    useDiariesForYear,
    useYearMonthlyStats,
    useYearActivityStats,
    useYearMonthlyActivitiesStats
} from '../../hooks/useDiary';
import { chartConstants } from './SummaryScreen.styles';

export const MONTH_NAMES = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

/**
 * ⚙️ 연간 요약 화면의 비즈니스 로직과 데이터 가공을 담당하는 훅입니다.
 */
export function useSummaryLogic(route, navigation, scrollRef) {
    const year = route?.params?.year || new Date().getFullYear();
    const [pageIndex, setPageIndex] = useState(0);

    const { diaries, reload: reloadDiaries } = useDiariesForYear(year);
    const { stats, reload: reloadStats } = useYearMoodStats(year);
    const { monthlyStats, reload: reloadMonthly } = useYearMonthlyStats(year);
    const { activityStats, reload: reloadActivities } = useYearActivityStats(year);
    const { monthlyActivityStats, reload: reloadMonthlyActivity } = useYearMonthlyActivitiesStats(year);

    useFocusEffect(
        useCallback(() => {
            reloadDiaries();
            reloadStats();
            reloadMonthly();
            reloadActivities();
            reloadMonthlyActivity();
        }, [reloadDiaries, reloadStats, reloadMonthly, reloadActivities, reloadMonthlyActivity])
    );

    const maxCount = stats.reduce((max, s) => Math.max(max, s.count), 0);
    const totalEntries = diaries.length;

    const topMood = stats.length > 0
        ? stats.reduce((top, s) => (s.count > top.count ? s : top), stats[0])
        : null;
    const topMoodData = topMood ? getMoodByKey(topMood.mood) : null;

    const allMoodStats = MOOD_LIST.map((mood) => {
        const stat = stats.find((s) => s.mood === mood.key);
        return { ...mood, count: stat ? stat.count : 0 };
    });

    const monthlyEntryCounts = MONTH_NAMES.map((name, i) => {
        const monthKey = `${year}-${String(i + 1).padStart(2, '0')}`;
        const count = monthlyStats
            .filter((s) => s.month === monthKey)
            .reduce((sum, s) => sum + s.count, 0);
        return { name, count };
    });
    const maxMonthlyCount = Math.max(...monthlyEntryCounts.map(m => m.count), 1);

    const monthlyTopMoods = MONTH_NAMES.map((name, i) => {
        const monthKey = `${year}-${String(i + 1).padStart(2, '0')}`;
        const monthData = monthlyStats.filter((s) => s.month === monthKey);
        if (monthData.length === 0) return { name, mood: null };
        const top = monthData.reduce((t, s) => (s.count > t.count ? s : t), monthData[0]);
        return { name, mood: getMoodByKey(top.mood) };
    });

    // 기분 꺾은선 그래프 데이터
    const moodLineData = MOOD_LIST.map((mood) => {
        const monthlyValues = MONTH_NAMES.map((_, i) => {
            const monthKey = `${year}-${String(i + 1).padStart(2, '0')}`;
            const stat = monthlyStats.find(s => s.month === monthKey && s.mood === mood.key);
            return stat ? stat.count : 0;
        });
        return { ...mood, values: monthlyValues };
    });
    const maxLineValue = Math.max(...moodLineData.flatMap(m => m.values), 1);

    // 활동 통계
    const maxActivityCount = activityStats.length > 0
        ? Math.max(...activityStats.map(a => a.count))
        : 1;

    const onPageScroll = (e) => {
        const page = Math.round(e.nativeEvent.contentOffset.x / (chartConstants.SCREEN_WIDTH - 32));
        setPageIndex(page);
    };

    // 활동 꺾은선 그래프 데이터
    const activityLineData = ACTIVITIES.filter(act =>
        activityStats.some(s => s.activity === act.key)
    ).map(act => {
        const monthlyValues = MONTH_NAMES.map((_, i) => {
            const monthKey = `${year}-${String(i + 1).padStart(2, '0')}`;
            const stat = monthlyActivityStats.find(s => s.month === monthKey && s.activity === act.key);
            return stat ? stat.count : 0;
        });
        return { ...act, values: monthlyValues };
    });
    const maxActivityLineValue = Math.max(...activityLineData.flatMap(a => a.values), 1);

    const handleTabPress = (i) => {
        scrollRef.current?.scrollTo({ x: i * (chartConstants.SCREEN_WIDTH - 32), animated: true });
        setPageIndex(i);
    };

    const handleGoBack = () => navigation.goBack();
    const handleMoodPress = (moodKey) => navigation.navigate('MoodList', { year, moodKey });
    const handleActivityPress = (activityKey) => navigation.navigate('ActivityList', { year, activityKey });

    return {
        year,
        pageIndex,
        totalEntries,
        maxCount,
        topMoodData,
        allMoodStats,
        monthlyEntryCounts,
        maxMonthlyCount,
        monthlyTopMoods,
        moodLineData,
        maxLineValue,
        activityStats,
        maxActivityCount,
        maxActivityLineValue,
        activityLineData,
        onPageScroll,
        handleTabPress,
        handleGoBack,
        handleMoodPress,
        handleActivityPress,
        getActivityByKey
    };
}

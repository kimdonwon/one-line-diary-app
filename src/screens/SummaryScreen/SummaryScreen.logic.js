import { useState, useCallback, useRef, useMemo } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { getMoodByKey, MOOD_LIST } from '../../constants/mood';
import { ACTIVITIES, getActivityByKey } from '../../constants/activities';
import {
    useYearMoodStats,
    useDiariesForYear,
    useYearMonthlyStats,
    useYearActivityStats,
    useYearMonthlyActivitiesStats,
    useYearAllActivities
} from '../../hooks/useDiary';
import { chartConstants } from './SummaryScreen.styles';

const MOOD_SCORE = {
    HAPPY: 5,
    SOSO: 4,
    EMBARRASSED: 3,
    ANGRY: 2,
    SAD: 1
};

export const MONTH_NAMES = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

/**
 * ⚙️ 연간 요약 화면의 비즈니스 로직과 데이터 가공을 담당하는 훅입니다.
 */
export function useSummaryLogic(route, navigation, scrollRef) {
    const [year, setYear] = useState(route?.params?.year || new Date().getFullYear());
    const [pageIndex, setPageIndex] = useState(0);

    const { diaries, reload: reloadDiaries } = useDiariesForYear(year);
    const { stats, reload: reloadStats } = useYearMoodStats(year);
    const { monthlyStats, reload: reloadMonthly } = useYearMonthlyStats(year);
    const { activityStats, reload: reloadActivities } = useYearActivityStats(year);
    const { monthlyActivityStats, reload: reloadMonthlyActivity } = useYearMonthlyActivitiesStats(year);
    const { activities, reload: reloadAllActivities } = useYearAllActivities(year);

    useFocusEffect(
        useCallback(() => {
            reloadDiaries();
            reloadStats();
            reloadMonthly();
            reloadActivities();
            reloadMonthlyActivity();
            reloadAllActivities();
        }, [reloadDiaries, reloadStats, reloadMonthly, reloadActivities, reloadMonthlyActivity, reloadAllActivities])
    );

    // ─── 🔍 1. 기분 x 활동 상관관계 계산 ───
    const moodActivityCorrelation = useMemo(() => {
        if (!diaries.length || !activities.length) return [];

        const diaryMap = {};
        diaries.forEach(d => { diaryMap[d.date] = MOOD_SCORE[d.mood] || 3; });

        const actScores = {}; // activityKey -> totalScore, count
        activities.forEach(act => {
            const score = diaryMap[act.date];
            if (score) {
                if (!actScores[act.activity]) actScores[act.activity] = { total: 0, count: 0 };
                actScores[act.activity].total += score;
                actScores[act.activity].count += 1;
            }
        });

        return Object.keys(actScores).map(key => ({
            key,
            avg: actScores[key].total / actScores[key].count,
            act: getActivityByKey(key)
        })).sort((a, b) => b.avg - a.avg);
    }, [diaries, activities]);

    // ─── 🎨 3. 스티커 통계 계산 ───
    const stickerStats = useMemo(() => {
        const counts = {};
        diaries.forEach(d => {
            try {
                const stickers = JSON.parse(d.stickers || '[]');
                stickers.forEach(s => {
                    const type = s.type;
                    if (type) counts[type] = (counts[type] || 0) + 1;
                });
            } catch (e) { }
        });

        return Object.entries(counts)
            .map(([type, count]) => ({ type, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 3);
    }, [diaries]);

    const maxCount = stats.reduce((max, s) => Math.max(max, s.count), 0);
    const totalEntries = diaries.length;

    const topMood = stats.length > 0
        ? stats.reduce((top, s) => (s.count > top.count ? s : top), stats[0])
        : null;
    const topMoodData = topMood ? getMoodByKey(topMood.mood) : null;
    const topMoodCount = topMood ? topMood.count : 0;

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

    // 프로그래밍 방식 스크롤 중인지 추적하는 플래그 (탭 버튼 클릭 시)
    const isProgrammaticScroll = useRef(false);

    const onPageScroll = (e) => {
        // 탭 버튼으로 트리거된 스크롤 중이면 pageIndex 업데이트 무시
        if (isProgrammaticScroll.current) return;
        const page = Math.round(e.nativeEvent.contentOffset.x / (chartConstants.SCREEN_WIDTH - 32));
        if (page >= 0 && page <= 1) setPageIndex(page);
    };

    // 스크롤이 완전히 멈춘 뒤에만 최종 페이지 확정
    const onMomentumScrollEnd = (e) => {
        isProgrammaticScroll.current = false;
        const page = Math.round(e.nativeEvent.contentOffset.x / (chartConstants.SCREEN_WIDTH - 32));
        if (page >= 0 && page <= 1) setPageIndex(page);
    };

    const handleTabPress = (i) => {
        isProgrammaticScroll.current = true; // 스크롤 이벤트 차단
        setPageIndex(i); // 즉시 탭 UI 반영
        scrollRef.current?.scrollTo({ x: i * (chartConstants.SCREEN_WIDTH - 32), animated: true });
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

    const handleGoBack = () => navigation.goBack();
    const handleMoodPress = (moodKey) => navigation.navigate('MoodList', { year, moodKey });
    const handleActivityPress = (activityKey) => navigation.navigate('ActivityList', { year, activityKey });

    return {
        year,
        pageIndex,
        totalEntries,
        maxCount,
        topMoodData,
        topMoodCount,
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
        moodActivityCorrelation,
        stickerStats,
        onPageScroll,
        onMomentumScrollEnd,
        handleTabPress,
        handleGoBack,
        handleMoodPress,
        handleActivityPress,
        getActivityByKey,
        setYear
    };
}

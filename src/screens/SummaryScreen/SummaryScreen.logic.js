import { useState, useCallback, useRef, useMemo } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { InteractionManager } from 'react-native';
import { getMoodByKey, MOOD_LIST } from '../../constants/mood';
import { ACTIVITIES, getActivityByKey } from '../../constants/activities';
import {
    getYearDiaries,
    getYearMoodStats,
    getYearMonthlyStats,
    getYearActivities,
    getYearMonthlyActivities,
    getYearAllActivities,
} from '../../database/db';
import { chartConstants } from './SummaryScreen.styles';
import { useBentoBoard } from '../../hooks/useBentoBoard';

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
 * v2.0: 6개 개별 DB 훅 → Promise.all 통합 로딩 (리렌더링 6회→1회 압축)
 */
export function useSummaryLogic(route, navigation, scrollRef) {
    const [year, setYear] = useState(route?.params?.year || new Date().getFullYear());
    const [pageIndex, setPageIndex] = useState(0);

    // ─── 통합 데이터 로딩 (6회 리렌더링 → 1회 압축) ───
    const [rawData, setRawData] = useState({
        diaries: [], stats: [], monthlyStats: [],
        activityStats: [], monthlyActivityStats: [], activities: [],
    });

    const reload = useCallback(async () => {
        if (!year) return;
        const y = String(year);
        try {
            const [diaries, stats, monthlyStats, activityStats, monthlyActivityStats, activities] =
                await Promise.all([
                    getYearDiaries(y),
                    getYearMoodStats(y),
                    getYearMonthlyStats(y),
                    getYearActivities(y),
                    getYearMonthlyActivities(y),
                    getYearAllActivities(y),
                ]);
            setRawData({ diaries, stats, monthlyStats, activityStats, monthlyActivityStats, activities });
        } catch (e) {
            console.error('[SummaryLogic] Data load failed:', e);
        }
    }, [year]);

    useFocusEffect(
        useCallback(() => {
            const handle = InteractionManager.runAfterInteractions(() => {
                reload();
            });
            return () => handle.cancel();
        }, [reload])
    );

    const { diaries, stats, monthlyStats, activityStats, monthlyActivityStats, activities } = rawData;

    // ─── 🍱 벤토 보드 데이터 ───
    const bentoData = useBentoBoard(year, diaries);

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
                const stickersRaw = JSON.parse(d.stickers || '[]');
                
                // 멀티페이지(2차원 배열) 대응을 위해 1차원으로 병합(Flatten)
                const stickers = stickersRaw.reduce((acc, val) => 
                    Array.isArray(val) ? acc.concat(val) : acc.concat([val])
                , []);

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

    const totalEntries = diaries.length;

    // ─── 📊 기분 통계 (stats 변경 시에만 재계산) ───
    const { maxCount, topMoodData, topMoodCount, allMoodStats } = useMemo(() => {
        const _maxCount = stats.reduce((max, s) => Math.max(max, s.count), 0);
        const topMood = stats.length > 0
            ? stats.reduce((top, s) => (s.count > top.count ? s : top), stats[0])
            : null;
        const _topMoodData = topMood ? getMoodByKey(topMood.mood) : null;
        const _topMoodCount = topMood ? topMood.count : 0;
        const _allMoodStats = MOOD_LIST.map((mood) => {
            const stat = stats.find((s) => s.mood === mood.key);
            return { ...mood, count: stat ? stat.count : 0 };
        });
        return { maxCount: _maxCount, topMoodData: _topMoodData, topMoodCount: _topMoodCount, allMoodStats: _allMoodStats };
    }, [stats]);

    // ─── 📈 월별 통계 (monthlyStats 변경 시에만 재계산) ───
    const { monthlyEntryCounts, maxMonthlyCount, monthlyTopMoods, moodLineData, maxLineValue } = useMemo(() => {
        const _monthlyEntryCounts = MONTH_NAMES.map((name, i) => {
            const monthKey = `${year}-${String(i + 1).padStart(2, '0')}`;
            const count = monthlyStats
                .filter((s) => s.month === monthKey)
                .reduce((sum, s) => sum + s.count, 0);
            return { name, count };
        });
        const _maxMonthlyCount = Math.max(..._monthlyEntryCounts.map(m => m.count), 1);

        const _monthlyTopMoods = MONTH_NAMES.map((name, i) => {
            const monthKey = `${year}-${String(i + 1).padStart(2, '0')}`;
            const monthData = monthlyStats.filter((s) => s.month === monthKey);
            if (monthData.length === 0) return { name, mood: null };
            const top = monthData.reduce((t, s) => (s.count > t.count ? s : t), monthData[0]);
            return { name, mood: getMoodByKey(top.mood) };
        });

        // 기분 꺾은선 그래프 데이터
        const _moodLineData = MOOD_LIST.map((mood) => {
            const monthlyValues = MONTH_NAMES.map((_, i) => {
                const monthKey = `${year}-${String(i + 1).padStart(2, '0')}`;
                const stat = monthlyStats.find(s => s.month === monthKey && s.mood === mood.key);
                return stat ? stat.count : 0;
            });
            return { ...mood, values: monthlyValues };
        });
        const _maxLineValue = Math.max(..._moodLineData.flatMap(m => m.values), 1);

        return {
            monthlyEntryCounts: _monthlyEntryCounts,
            maxMonthlyCount: _maxMonthlyCount,
            monthlyTopMoods: _monthlyTopMoods,
            moodLineData: _moodLineData,
            maxLineValue: _maxLineValue,
        };
    }, [year, monthlyStats]);

    // 활동 통계
    const maxActivityCount = useMemo(() => {
        return activityStats.length > 0
            ? Math.max(...activityStats.map(a => a.count))
            : 1;
    }, [activityStats]);

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
    const { activityLineData, maxActivityLineValue } = useMemo(() => {
        const _activityLineData = ACTIVITIES.filter(act =>
            activityStats.some(s => s.activity === act.key)
        ).map(act => {
            const monthlyValues = MONTH_NAMES.map((_, i) => {
                const monthKey = `${year}-${String(i + 1).padStart(2, '0')}`;
                const stat = monthlyActivityStats.find(s => s.month === monthKey && s.activity === act.key);
                return stat ? stat.count : 0;
            });
            return { ...act, values: monthlyValues };
        });
        const _maxActivityLineValue = Math.max(..._activityLineData.flatMap(a => a.values), 1);
        return { activityLineData: _activityLineData, maxActivityLineValue: _maxActivityLineValue };
    }, [year, activityStats, monthlyActivityStats]);

    const handleGoBack = () => navigation.goBack();
    const handleMoodPress = (moodKey) => {
        requestAnimationFrame(() => navigation.navigate('MoodList', { year, moodKey }));
    };
    const handleActivityPress = (activityKey) => {
        requestAnimationFrame(() => navigation.navigate('ActivityList', { year, activityKey }));
    };

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
        bentoData,
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

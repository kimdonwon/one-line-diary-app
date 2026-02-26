import { useState, useMemo, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { getMoodByKey, MOOD_LIST } from '../../constants/mood';
import { useDiariesForMonth, useMoodStats, useMonthActivityStats } from '../../hooks/useDiary';

// 유틸리티 함수 모음
export const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'];

export function getMonthData(year, month) {
    const firstDay = new Date(year, month - 1, 1).getDay();
    const daysInMonth = new Date(year, month, 0).getDate();
    return { firstDay, daysInMonth };
}

export function formatYearMonth(year, month) {
    return `${year}-${String(month).padStart(2, '0')}`;
}

export function formatDate(year, month, day) {
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

/**
 * ⚙️ 메인 화면(홈 캘린더 및 요약)의 상태와 비즈니스 로직을 서포트하는 훅입니다.
 */
export function useMainLogic(navigation) {
    const today = new Date();
    const [year, setYear] = useState(today.getFullYear());
    const [month, setMonth] = useState(today.getMonth() + 1);

    const yearMonth = formatYearMonth(year, month);

    // 데이터 페칭(fetching)
    const { diaries, reload } = useDiariesForMonth(yearMonth);
    const { stats, reload: reloadStats } = useMoodStats(yearMonth);
    const { activityStats, reload: reloadActivities } = useMonthActivityStats(yearMonth);

    // 💡 화면 재 진입 시 최신 상태로 동기화
    useFocusEffect(
        useCallback(() => {
            reload();
            reloadStats();
            reloadActivities();
        }, [reload, reloadStats, reloadActivities])
    );

    // 맵 캐싱으로 날짜 기준 빠른 조회 가능하도록 지원
    const diaryMap = useMemo(() => {
        const map = {};
        diaries.forEach((d) => { map[d.date] = d; });
        return map;
    }, [diaries]);

    const { firstDay, daysInMonth } = getMonthData(year, month);

    const isToday = (day) =>
        today.getFullYear() === year &&
        today.getMonth() + 1 === month &&
        today.getDate() === day;

    const goToPrevMonth = () => {
        if (month === 1) {
            setYear(year - 1);
            setMonth(12);
        } else {
            setMonth(month - 1);
        }
    };

    const goToNextMonth = () => {
        if (month === 12) {
            setYear(year + 1);
            setMonth(1);
        } else {
            setMonth(month + 1);
        }
    };

    // 내비게이션 헨들러
    const onDayPress = (day) => {
        navigation.navigate('Write', { date: formatDate(year, month, day) });
    };

    const onSummaryPress = () => {
        navigation.navigate('Summary', { year });
    };

    const onTodayWrite = () => {
        const date = formatDate(today.getFullYear(), today.getMonth() + 1, today.getDate());
        navigation.navigate('Write', { date });
    };

    const onDiaryPress = (diary) => {
        navigation.navigate('Write', { date: diary.date });
    };

    // 요약 데이터 가공 (Formatting Data)
    const maxCount = stats.reduce((max, s) => Math.max(max, s.count), 0);
    const topMood = stats.length > 0
        ? stats.reduce((top, s) => (s.count > top.count ? s : top), stats[0])
        : null;
    const topMoodData = topMood ? getMoodByKey(topMood.mood) : null;

    const allMoodStats = MOOD_LIST.map((mood) => {
        const stat = stats.find((s) => s.mood === mood.key);
        return { ...mood, count: stat ? stat.count : 0 };
    });

    /**
     * 이번 주 가장 많은 기분 캐릭터를 뽑아내는 로직 (헤더 장식용)
     */
    const headerMood = useMemo(() => {
        if (diaries.length === 0) return getMoodByKey('HAPPY');

        // 이번 주 단위 계산
        const now = new Date();
        const dayOfWeek = now.getDay();
        const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        const monday = new Date(now);
        monday.setDate(now.getDate() + mondayOffset);
        monday.setHours(0, 0, 0, 0);

        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);
        sunday.setHours(23, 59, 59, 999);

        const fmt = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        const monStr = fmt(monday);
        const sunStr = fmt(sunday);

        const weekDiaries = diaries.filter((d) => d.date >= monStr && d.date <= sunStr);
        if (weekDiaries.length === 0) return getMoodByKey('HAPPY');

        const counts = {};
        weekDiaries.forEach((d) => {
            counts[d.mood] = (counts[d.mood] || 0) + 1;
        });

        const entries = Object.entries(counts);
        if (entries.length === 0) return getMoodByKey('HAPPY');

        const topKey = entries.reduce((a, b) => b[1] > a[1] ? b : a)[0];
        return getMoodByKey(topKey);
    }, [diaries]);

    return {
        // Properties
        year, month,
        diaries, stats, activityStats, diaryMap,
        firstDay, daysInMonth, topMoodData, allMoodStats, headerMood, maxCount,

        // Settings/Check
        isToday,

        // Handlers
        goToPrevMonth, goToNextMonth, onDayPress, onSummaryPress, onTodayWrite, onDiaryPress
    };
}

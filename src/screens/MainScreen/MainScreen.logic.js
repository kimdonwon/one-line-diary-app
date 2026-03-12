import { useState, useMemo, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { getMoodByKey, MOOD_LIST } from '../../constants/mood';
import { useDiariesForMonth, useMoodStats, useMonthActivityStats, deleteDiaryAndActivities } from '../../hooks/useDiary';

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

    const [showAlert, setShowAlert] = useState(false);
    const [alertConfig, setAlertConfig] = useState({});

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

    const onDayLongPress = (day) => {
        const date = formatDate(year, month, day);
        const diary = diaryMap[date];

        if (diary) {
            setAlertConfig({
                title: '일기 삭제',
                message: `${month}월 ${day}일의 조각을 비울까요?\n지워진 조각은 다시 주워담을 수 없어요.`,
                confirmText: '삭제하기',
                onConfirm: async () => {
                    await deleteDiaryAndActivities(date);
                    setShowAlert(false);
                    reload();
                    reloadStats();
                    reloadActivities();
                },
                secondaryText: '취소',
                onSecondaryConfirm: () => setShowAlert(false)
            });
            setShowAlert(true);
        }
    };

    const onSummaryPress = () => {
        navigation.navigate('Summary', { year });
    };

    const onTodayWrite = () => {
        const date = formatDate(today.getFullYear(), today.getMonth() + 1, today.getDate());
        navigation.navigate('Write', { date });
    };


    const onMoodPress = (moodKey) => {
        navigation.navigate('MoodList', { year, month, moodKey });
    };

    const onActivityPress = (activityKey) => {
        navigation.navigate('ActivityList', { year, month, activityKey });
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

    // 기분별 가중치 (Y축 높이 결정)
    const MOOD_SCORE = {
        HAPPY: 5,
        SOSO: 4,
        EMBARRASSED: 3,
        ANGRY: 2,
        SAD: 1
    };

    // 일별 기분 흐름 데이터 (단일 궤적 그래프용)
    const dailyMoodFlow = Array.from({ length: daysInMonth }).map((_, i) => {
        const date = formatDate(year, month, i + 1);
        const diary = diaryMap[date];
        if (diary) {
            const mood = getMoodByKey(diary.mood);
            return {
                day: i + 1,
                score: MOOD_SCORE[diary.mood] || 3,
                color: mood.color,
                moodKey: diary.mood
            };
        }
        return { day: i + 1, score: null }; // 기록 없는 날
    });



    return {
        // Properties
        year, month,
        diaries, stats, activityStats, diaryMap,
        firstDay, daysInMonth, topMoodData, allMoodStats, maxCount, dailyMoodFlow,
        showAlert, alertConfig,

        // Settings/Check
        isToday,

        // Handlers
        goToPrevMonth, goToNextMonth, onDayPress, onDayLongPress, onSummaryPress, onTodayWrite, onMoodPress, onActivityPress, setShowAlert
    };
}

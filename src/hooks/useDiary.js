// ⚙️ 커스텀 Hook - 순수 로직 영역
// DB 연동 함수를 래핑, 디자인 정보 없음

import { useState, useEffect, useCallback } from 'react';
import {
    saveDiary as dbSaveDiary,
    getDiary,
    getMonthDiaries,
    getMoodStats,
    getYearDiaries,
    getYearMoodStats,
    getYearMonthlyStats,
    saveActivities as dbSaveActivities,
    getActivities as dbGetActivities,
    getYearActivities,
    getYearMonthlyActivities,
    getMonthActivities,
    getYearSpecificActivities,
    getMoodStatsByDateRange,
} from '../database/db';
import { DeviceEventEmitter } from 'react-native';
import { getMoodByKey } from '../constants/mood';

export function useDiaryForDate(date) {
    const [diary, setDiary] = useState(null);
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {
        if (!date) return;
        setLoading(true);
        try {
            const result = await getDiary(date);
            setDiary(result);
        } catch (e) {
            console.error('Failed to load diary:', e);
        } finally {
            setLoading(false);
        }
    }, [date]);

    useEffect(() => {
        load();
    }, [load]);

    return { diary, loading, reload: load };
}

export function useDiariesForMonth(yearMonth) {
    const [diaries, setDiaries] = useState([]);
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {
        if (!yearMonth) return;
        setLoading(true);
        try {
            const results = await getMonthDiaries(yearMonth);
            setDiaries(results);
        } catch (e) {
            console.error('Failed to load month diaries:', e);
        } finally {
            setLoading(false);
        }
    }, [yearMonth]);

    useEffect(() => {
        load();
    }, [load]);

    return { diaries, loading, reload: load };
}

export function useMoodStats(yearMonth) {
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {
        if (!yearMonth) return;
        setLoading(true);
        try {
            const results = await getMoodStats(yearMonth);
            setStats(results);
        } catch (e) {
            console.error('Failed to load mood stats:', e);
        } finally {
            setLoading(false);
        }
    }, [yearMonth]);

    useEffect(() => {
        load();
    }, [load]);

    return { stats, loading, reload: load };
}

// ─── 연간 훅들 ───

export function useDiariesForYear(year) {
    const [diaries, setDiaries] = useState([]);
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {
        if (!year) return;
        setLoading(true);
        try {
            const results = await getYearDiaries(String(year));
            setDiaries(results);
        } catch (e) {
            console.error('Failed to load year diaries:', e);
        } finally {
            setLoading(false);
        }
    }, [year]);

    useEffect(() => {
        load();
    }, [load]);

    return { diaries, loading, reload: load };
}

export function useYearMoodStats(year) {
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {
        if (!year) return;
        setLoading(true);
        try {
            const results = await getYearMoodStats(String(year));
            setStats(results);
        } catch (e) {
            console.error('Failed to load year mood stats:', e);
        } finally {
            setLoading(false);
        }
    }, [year]);

    useEffect(() => {
        load();
    }, [load]);

    return { stats, loading, reload: load };
}

export function useYearMonthlyStats(year) {
    const [monthlyStats, setMonthlyStats] = useState([]);
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {
        if (!year) return;
        setLoading(true);
        try {
            const results = await getYearMonthlyStats(String(year));
            setMonthlyStats(results);
        } catch (e) {
            console.error('Failed to load year monthly stats:', e);
        } finally {
            setLoading(false);
        }
    }, [year]);

    useEffect(() => {
        load();
    }, [load]);

    return { monthlyStats, loading, reload: load };
}

// ─── 활동 훅들 ───

export function useActivitiesForDate(date) {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {
        if (!date) return;
        setLoading(true);
        try {
            const result = await dbGetActivities(date);
            setActivities(result);
        } catch (e) {
            console.error('Failed to load activities:', e);
        } finally {
            setLoading(false);
        }
    }, [date]);

    useEffect(() => {
        load();
    }, [load]);

    return { activities, loading, reload: load };
}

export function useYearActivityStats(year) {
    const [activityStats, setActivityStats] = useState([]);
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {
        if (!year) return;
        setLoading(true);
        try {
            const results = await getYearActivities(String(year));
            setActivityStats(results);
        } catch (e) {
            console.error('Failed to load year activity stats:', e);
        } finally {
            setLoading(false);
        }
    }, [year]);

    useEffect(() => {
        load();
    }, [load]);

    return { activityStats, loading, reload: load };
}

export function useYearMonthlyActivitiesStats(year) {
    const [monthlyActivityStats, setMonthlyActivityStats] = useState([]);
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {
        if (!year) return;
        setLoading(true);
        try {
            const results = await getYearMonthlyActivities(String(year));
            setMonthlyActivityStats(results);
        } catch (e) {
            console.error('Failed to load year monthly activity stats:', e);
        } finally {
            setLoading(false);
        }
    }, [year]);

    useEffect(() => {
        load();
    }, [load]);

    return { monthlyActivityStats, loading, reload: load };
}

export async function saveDiary(date, content, mood, stickers = '[]') {
    await dbSaveDiary(date, content, mood, stickers);
    DeviceEventEmitter.emit('DIARY_UPDATED');
}

export async function saveActivities(date, activities) {
    await dbSaveActivities(date, activities);
    DeviceEventEmitter.emit('DIARY_UPDATED');
}

export function useMonthActivityStats(yearMonth) {
    const [activityStats, setActivityStats] = useState([]);
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {
        if (!yearMonth) return;
        setLoading(true);
        try {
            const results = await getMonthActivities(yearMonth);
            setActivityStats(results);
        } catch (e) {
            console.error('Failed to load month activity stats:', e);
        } finally {
            setLoading(false);
        }
    }, [yearMonth]);

    useEffect(() => {
        load();
    }, [load]);

    return { activityStats, loading, reload: load };
}

export function useYearSpecificActivities(year, activity, skip = false) {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {
        if (!year || !activity || skip) return;
        setLoading(true);
        try {
            const results = await getYearSpecificActivities(year, activity);
            setActivities(results);
        } catch (e) {
            console.error('Failed to load specific activities:', e);
        } finally {
            setLoading(false);
        }
    }, [year, activity, skip]);

    useEffect(() => {
        if (!skip) {
            load();
        }
    }, [load, skip]);

    return { activities, loading, reload: load };
}

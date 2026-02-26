import { useState, useEffect, useCallback, useMemo } from 'react';
import { getYearDiaries, getYearAllActivities } from '../database/db';
import { getActivityByKey } from '../constants/activities';

export function useSearchLogic(year) {
    const [searchQuery, setSearchQuery] = useState('');
    const [allDiaries, setAllDiaries] = useState([]);
    const [allActivities, setAllActivities] = useState([]);
    const [loading, setLoading] = useState(false);

    const loadAllData = useCallback(async () => {
        if (!year) return;
        setLoading(true);
        try {
            const [diaries, activities] = await Promise.all([
                getYearDiaries(String(year)),
                getYearAllActivities(String(year))
            ]);
            setAllDiaries(diaries);
            setAllActivities(activities);
        } catch (e) {
            console.error('Search data load error:', e);
        } finally {
            setLoading(false);
        }
    }, [year]);

    useEffect(() => {
        loadAllData();
    }, [loadAllData]);

    const filteredResults = useMemo(() => {
        if (!searchQuery.trim()) return [];

        const query = searchQuery.toLowerCase();

        // 1. 활동 조건에서 매칭되는 날짜 추출
        const matchedActivities = allActivities.filter(a => {
            const actLabel = getActivityByKey(a.activity)?.label || '';
            return (
                (a.title && a.title.toLowerCase().includes(query)) ||
                (a.note && a.note.toLowerCase().includes(query)) ||
                (actLabel.toLowerCase().includes(query))
            );
        });
        const matchedActivityDates = new Set(matchedActivities.map(a => a.date));

        // 2. 다이어리 본문 내용 혹은 '활동이 매칭된 날짜'에 해당하는 일기 필터링
        const results = allDiaries.filter(d =>
            d.content.toLowerCase().includes(query) || matchedActivityDates.has(d.date)
        ).map(d => ({
            ...d,
            type: 'mood'
        }));

        // 날짜순 내림차순 정렬
        return results.sort((a, b) => b.date.localeCompare(a.date));

    }, [searchQuery, allDiaries, allActivities]);

    const clearSearch = () => {
        setSearchQuery('');
    };

    return {
        searchQuery,
        setSearchQuery,
        filteredResults,
        loading,
        clearSearch,
        reload: loadAllData
    };
}

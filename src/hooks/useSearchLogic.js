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
        const results = allDiaries.filter(d => {
            // 멀티페이지 content 처리: JSON 배열이면 모든 페이지에서 검색
            let searchableContent = d.content || '';
            try {
                const parsed = JSON.parse(d.content);
                if (Array.isArray(parsed)) {
                    searchableContent = parsed.join(' ');
                }
            } catch (e) {
                // 단일 문자열 그대로 사용
            }
            return searchableContent.toLowerCase().includes(query) || matchedActivityDates.has(d.date);
        }).map(d => ({
            ...d,
            type: 'mood'
        }));

        // 날짜순 내림차순 정렬
        return results.sort((a, b) => b.date.localeCompare(a.date));

    }, [searchQuery, allDiaries, allActivities]);

    // 날짜별 활동 맵핑 추가 (DiaryEntryCard용)
    const activitiesMap = useMemo(() => {
        const map = {};
        allActivities.forEach(act => {
            if (!map[act.date]) map[act.date] = [];
            map[act.date].push(act);
        });
        return map;
    }, [allActivities]);

    const clearSearch = () => {
        setSearchQuery('');
    };

    return {
        searchQuery,
        setSearchQuery,
        filteredResults,
        activitiesMap,
        loading,
        clearSearch,
        reload: loadAllData
    };
}

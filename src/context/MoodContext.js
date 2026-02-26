import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { DeviceEventEmitter } from 'react-native';
import { getMoodByKey } from '../constants/mood';
import { getMoodStatsByDateRange } from '../database/db';

const MoodContext = createContext();

export function MoodProvider({ children }) {
    // 디폴트 기분: 작성된 기록이 없을 땐 'SOSO' (곰돌이, 베이지색)
    const [weeklyMood, setWeeklyMood] = useState(getMoodByKey('SOSO'));

    const loadWeeklyMood = useCallback(async () => {
        try {
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

            const stats = await getMoodStatsByDateRange(fmt(monday), fmt(sunday));

            if (stats && stats.length > 0) {
                // 이번 주 통계 중 가장 많은 횟수의 기분을 추출
                const top = stats.reduce((prev, current) => (prev.count > current.count) ? prev : current);
                setWeeklyMood(getMoodByKey(top.mood));
            } else {
                setWeeklyMood(getMoodByKey('SOSO'));
            }
        } catch (e) {
            console.log('Failed to load weekly mood app-wide:', e);
        }
    }, []);

    useEffect(() => {
        loadWeeklyMood();
        // 새 일기가 등록되거나 앱에 변경사항이 있을 때 재계산 (동기화)
        const sub = DeviceEventEmitter.addListener('DIARY_UPDATED', loadWeeklyMood);
        return () => sub.remove();
    }, [loadWeeklyMood]);

    return (
        <MoodContext.Provider value={weeklyMood}>
            {children}
        </MoodContext.Provider>
    );
}

export function useGlobalWeeklyMood() {
    return useContext(MoodContext);
}

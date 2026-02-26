import { useState, useEffect, useMemo } from 'react';
import { InteractionManager } from 'react-native';
import { getMoodByKey } from '../../constants/mood';
import { useDiariesForYear } from '../../hooks/useDiary';

/**
 * ⚙️ 연도 및 기분 바탕으로 일기 데이터를 로딩하고 필터링하는 로직 훅입니다.
 */
export function useMoodListLogic(route, navigation) {
    const { year, month, moodKey } = route.params;
    const mood = getMoodByKey(moodKey);

    /**
     * 화면 이동 중 데이터 페칭(fetching)으로 인한 애니메이션 끊김 현상을 방지
     */
    const [ready, setReady] = useState(false);

    // 연도별 일기 데이터를 로딩하는 커스텀 훅 (ready가 true일 때만 요청)
    const { diaries, loading: loadingDiaries } = useDiariesForYear(ready ? year : null);

    // 전체 로딩 상태 산출
    const loading = !ready || loadingDiaries;

    useEffect(() => {
        // 인터랙션(애니메이션 등)이 끝난 직후 콜백을 실행하여 ready 상태로 전환합니다.
        const task = InteractionManager.runAfterInteractions(() => {
            setReady(true);
        });
        return () => task.cancel();
    }, []);

    /**
     * 📊 일기 목록 중 해당 기분 코드(moodKey)와 일치하는 것들만 필터링합니다.
     * month 파라미터가 있을 경우 해당 월만 필터링합니다.
     */
    const filteredDiaries = useMemo(() => {
        let result = diaries.filter(d => d.mood === moodKey);
        if (month) {
            const monthPrefix = `${year}-${String(month).padStart(2, '0')}`;
            result = result.filter(d => d.date.startsWith(monthPrefix));
        }
        return result.sort((a, b) => b.date.localeCompare(a.date));
    }, [diaries, moodKey, year, month]);

    /**
     * 뒤로 가기 네비게이션 액션
     */
    const handleGoBack = () => {
        navigation.goBack();
    };

    /**
     * 선택된 날짜의 일기 상세/작성 화면으로 이동
     * @param {string} date - 일기 작성 날짜 ('YYYY-MM-DD' 형식)
     */
    const handleDiaryPress = (date) => {
        navigation.navigate('Write', { date });
    };

    return {
        year,
        month,
        mood,
        loading,
        filteredDiaries,
        handleGoBack,
        handleDiaryPress
    };
}

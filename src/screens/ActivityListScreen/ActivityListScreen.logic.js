import { useState, useEffect, useMemo } from 'react';
import { InteractionManager } from 'react-native';
import { getActivityByKey } from '../../constants/activities';
import { useYearSpecificActivities, useDiariesForYear } from '../../hooks/useDiary';

/**
 * ⚙️ 해당 연도의 특정 활동과 연계된 일기 목록을 필터링하고 가져오는 비즈니스 로직 훅입니다.
 */
export function useActivityListLogic(route, navigation) {
    const { year, activityKey } = route.params;
    const act = getActivityByKey(activityKey);

    /**
     * 애니메이션 렌더링 프레임 드롭을 방지하기 위한 지연(Lazy) 로딩 상태입니다.
     * 화면 이동 애니메이션 직후에 무거운 데이터 연산이 수행되도록 조절합니다.
     */
    const [ready, setReady] = useState(false);

    // 데이터 로드 훅 (ready 상태에 맞춰서 Fetch 조건을 제어)
    const { activities, loading: loadingActs } = useYearSpecificActivities(year, activityKey, !ready);
    const { diaries, loading: loadingDiaries } = useDiariesForYear(ready ? year : null);

    // 통합 로딩 상태
    const loading = !ready || loadingActs || loadingDiaries;

    // InteractionManager를 활용해 UI 스레드가 네비게이션 애니메이션을 완전히 끝낼 때까지 기다립니다.
    useEffect(() => {
        const task = InteractionManager.runAfterInteractions(() => {
            setReady(true);
        });
        return () => task.cancel();
    }, []);

    /**
     * 📊 해당 연도의 기록들 중에서 특정 활동 코드가 매칭되는 날짜의 일기만 필터링합니다.
     * 퍼포먼스 최적화를 위해 Set 객체 캐싱과 useMemo를 동원합니다.
     */
    const filteredDiaries = useMemo(() => {
        const activityDates = new Set(activities.map(a => a.date));
        const matched = diaries.filter(d => activityDates.has(d.date));
        // 최근 날짜가 상단에 배치되도록 내림차순 정렬
        return matched.sort((a, b) => b.date.localeCompare(a.date));
    }, [activities, diaries]);

    /**
     * 뒤로가기 액션
     */
    const handleGoBack = () => {
        navigation.goBack();
    };

    /**
     * 일기 클릭 시 작성/수정(Write) 화면으로 이동
     */
    const handleDiaryPress = (date) => {
        navigation.navigate('Write', { date });
    };

    return {
        year,
        act,
        loading,
        filteredDiaries,
        handleGoBack,
        handleDiaryPress
    };
}

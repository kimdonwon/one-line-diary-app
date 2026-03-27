import { useState, useEffect, useMemo } from 'react';
import { Animated } from 'react-native';
import { getActivityByKey } from '../../constants/activities';
import { useYearSpecificActivities, useDiariesForYear, useYearAllActivities, useAllCommentCounts } from '../../hooks/useDiary';

/**
 * ⚙️ 해당 연도의 특정 활동과 연계된 일기 목록을 필터링하고 가져오는 비즈니스 로직 훅입니다.
 */
export function useActivityListLogic(route, navigation) {
    const { year, month, activityKey } = route.params;
    const act = getActivityByKey(activityKey);

    /**
     * 애니메이션 렌더링 프레임 드롭을 방지하기 위한 지연(Lazy) 로딩 상태입니다.
     * 화면 이동 애니메이션 직후에 무거운 데이터 연산이 수행되도록 조절합니다.
     */
    const [ready, setReady] = useState(false);

    // 데이터 로드 훅 (ready 상태에 맞춰서 Fetch 조건을 제어)
    const { activities: specificActs, loading: loadingActs } = useYearSpecificActivities(year, activityKey, !ready);
    const { diaries, loading: loadingDiaries } = useDiariesForYear(ready ? year : null);
    const { activities: allActivities, loading: loadingAllActivities } = useYearAllActivities(ready ? year : null);
    const { commentCounts } = useAllCommentCounts(ready);

    // Fade-in 애니메이션 상태
    const [fadeAnim] = useState(() => new Animated.Value(0));

    // 통합 로딩 상태
    const loading = !ready || loadingActs || loadingDiaries || loadingAllActivities;

    // 애니메이션이 완전히 끝날 때까지 기다립니다.
    useEffect(() => {
        const unsubscribe = navigation.addListener('transitionEnd', () => {
            setReady(true);
        });
        
        // 안전장치
        const fallbackTimer = setTimeout(() => {
            setReady(true);
        }, 400);

        return () => {
            unsubscribe();
            clearTimeout(fallbackTimer);
        };
    }, [navigation]);

    // 로딩이 끝나면 리스트를 부드럽게 띄움
    useEffect(() => {
        if (!loading && ready) {
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }, [loading, ready, fadeAnim]);

    /**
     * 📊 해당 연도의 기록들 중에서 특정 활동 코드가 매칭되는 날짜의 일기만 필터링합니다.
     * month 파라미터가 있을 경우 해당 월만 필터링합니다.
     */
    const filteredDiaries = useMemo(() => {
        const activityDates = new Set(specificActs.map(a => a.date));
        let matched = diaries.filter(d => activityDates.has(d.date));
        if (month) {
            const monthPrefix = `${year}-${String(month).padStart(2, '0')}`;
            matched = matched.filter(d => d.date.startsWith(monthPrefix));
        }
        // 최근 날짜가 상단에 배치되도록 내림차순 정렬
        return matched.sort((a, b) => b.date.localeCompare(a.date));
    }, [specificActs, diaries, year, month]);

    // 날짜별 활동 맵핑
    const activitiesMap = useMemo(() => {
        const map = {};
        allActivities.forEach(act => {
            if (!map[act.date]) map[act.date] = [];
            map[act.date].push(act);
        });
        return map;
    }, [allActivities]);

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
        month,
        act,
        loading,
        filteredDiaries,
        activitiesMap,
        commentCounts,
        handleGoBack,
        handleDiaryPress,
        fadeAnim
    };
}

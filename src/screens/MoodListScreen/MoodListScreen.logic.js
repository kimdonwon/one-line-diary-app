import { useState, useEffect, useMemo } from 'react';
import { Animated } from 'react-native';
import { getMoodByKey } from '../../constants/mood';
import { useDiariesForYear, useYearAllActivities, useAllCommentCounts } from '../../hooks/useDiary';

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

    const { diaries, loading: loadingDiaries } = useDiariesForYear(ready ? year : null);
    const { activities, loading: loadingActivities } = useYearAllActivities(ready ? year : null);
    const { commentCounts } = useAllCommentCounts(ready);

    // Fade-in 애니메이션을 위한 상태
    const [fadeAnim] = useState(() => new Animated.Value(0));

    // 전체 로딩 상태 산출 (데이터 모두 들어왔을 때 false)
    const loading = !ready || loadingDiaries || loadingActivities;

    // 날짜별 활동 맵핑
    const activitiesMap = useMemo(() => {
        const map = {};
        activities.forEach(act => {
            if (!map[act.date]) map[act.date] = [];
            map[act.date].push(act);
        });
        return map;
    }, [activities]);

    useEffect(() => {
        // 네비게이션 애니메이션(1번 아이디어)이 완전히 끝난 후 데이터 페칭 시작
        const unsubscribe = navigation.addListener('transitionEnd', () => {
            setReady(true);
        });

        // 애니메이션 이벤트 유실 방지(안전장치)
        const fallbackTimer = setTimeout(() => {
            setReady(true);
        }, 400);

        return () => {
            unsubscribe();
            clearTimeout(fallbackTimer);
        };
    }, [navigation]);

    // 데이터 로딩이 완료(loading === false)되면 리스트를 부드럽게 Fade-in (2번 아이디어 접목)
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
        activitiesMap,
        commentCounts,
        handleGoBack,
        handleDiaryPress,
        fadeAnim,
    };
}

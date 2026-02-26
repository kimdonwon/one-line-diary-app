import { useState, useCallback } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useSearchLogic } from '../../hooks/useSearchLogic';

/**
 * 🔍 검색 화면의 비즈니스 로직을 담당하는 커스텀 훅입니다.
 * UI 코드와 상태/서버 통신 로직을 완벽하게 분리하여 유지보수성을 극대화합니다.
 */
export function useSearchScreenLogic() {
    const navigation = useNavigation();

    // 현재 연도를 상태로 관리 (검색 필터 등 확장을 위해 유지)
    const [year, setYear] = useState(new Date().getFullYear());

    // 외부 훅 (검색 엔진)에서 핵심 검색 로직 상태를 가져옵니다.
    const { searchQuery, setSearchQuery, filteredResults, reload: reloadSearchData } = useSearchLogic(year);

    // 💡 화면이 포커스 될 때마다 최신 검색 데이터를 다시 불러옵니다.
    // 사용자가 다른 화면에서 일기를 작성하거나 수정하고 돌아왔을 때 즉각 반영하기 위함입니다.
    useFocusEffect(
        useCallback(() => {
            reloadSearchData();
        }, [reloadSearchData])
    );

    /**
     * 📖 특정 일기 카드를 눌렀을 때 작성 화면으로 이동하는 내비게이션 메서드입니다.
     * @param {Object} diary - 선택된 일기 데이터 객체
     */
    const handleDiaryPress = (diary) => {
        navigation.navigate('Write', { date: diary.date });
    };

    /**
     * ❌ 검색어 입력란 우측의 '취소' 또는 'X' 버튼을 눌렀을 때 검색 필드를 초기화합니다.
     */
    const handleClearSearch = () => {
        setSearchQuery('');
    };

    // UI 컴포넌트(View)에 전달할 상태와 액션들만 반환합니다.
    return {
        // Properties (상태)
        searchQuery,
        filteredResults,

        // Actions (행동/메서드)
        setSearchQuery,
        handleClearSearch,
        handleDiaryPress,
    };
}

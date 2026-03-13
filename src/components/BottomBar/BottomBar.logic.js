import { useMemo } from 'react';
import { useGlobalWeeklyMood } from '../../context/MoodContext';
import { COLORS } from '../../constants/theme';

export function useBottomBarLogic(props) {
    const {
        mode = 'nav',
        activeTab: manualActiveTab,
        onCenterPress,
        navigation,
        state,
        selectedMoodColor
    } = props;

    const weeklyMood = useGlobalWeeklyMood();

    // 🌈 중앙 버튼 색상 결정
    const activeColor = useMemo(() => {
        if (mode === 'action' && selectedMoodColor) {
            return selectedMoodColor;
        }
        return weeklyMood ? weeklyMood.color : COLORS.happy;
    }, [mode, selectedMoodColor, weeklyMood]);

    // 🎯 활성 탭 결정
    const currentActiveTab = useMemo(() => {
        if (state) {
            const routeName = state.routeNames[state.index];
            if (routeName?.toLowerCase().includes('home')) return 'home';
            if (routeName?.toLowerCase().includes('diary')) return 'diary';
            if (routeName?.toLowerCase().includes('summary')) return 'summary';
            if (routeName?.toLowerCase().includes('settings')) return 'settings';
        }
        return manualActiveTab;
    }, [state, manualActiveTab]);

    // 🚀 중앙 버튼 클릭 핸들러
    const handleCenterPress = () => {
        if (onCenterPress) {
            onCenterPress();
        } else if (navigation) {
            navigation.navigate('Write');
        }
    };

    // 탭 이동 핸들러
    const handleTabPress = (tabName) => {
        if (navigation) {
            const routeMapping = {
                home: 'HomeTab',
                diary: 'DiaryTab',
                summary: 'SummaryTab',
                settings: 'SettingsTab'
            };
            const targetRoute = routeMapping[tabName] || tabName;

            if (state) {
                navigation.navigate(targetRoute);
            } else {
                navigation.navigate('MainTabs', { screen: targetRoute });
            }
        }
    };

    return {
        activeTab: currentActiveTab,
        activeColor,
        handleCenterPress,
        handleTabPress,
    };
}

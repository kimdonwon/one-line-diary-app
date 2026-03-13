import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import {
    HomeTabIcon, SelectedHomeTabIcon,
    DiaryTabIcon, SelectedDiaryTabIcon,
    SummaryTabIcon, SelectedSummaryTabIcon,
    SettingsTabIcon, SelectedSettingsTabIcon,
    PlusButtonIcon
} from '../../constants/icons';
import { useBottomBarLogic } from './BottomBar.logic';
import { styles } from './BottomBar.styles';

/**
 * ✅ 저장 확인(V) 아이콘 - 내부용
 */
function CheckIcon({ size = 24, color = '#FFFFFF' }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
            <Path
                d="M5 13l4 4L19 7"
                fill="none"
                stroke={color}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}

export function BottomBarView(props) {
    const { mode, containerStyle } = props;
    const insets = useSafeAreaInsets();
    const { activeTab, activeColor, handleCenterPress, handleTabPress } = useBottomBarLogic(props);

    // 렌더링 헬퍼: 탭 아이콘 결정
    const renderTabIcon = (tabName, Icon, SelectedIcon) => {
        const isActive = activeTab === tabName;
        const color = isActive ? activeColor : '#999999';
        return isActive ? <SelectedIcon size={24} color={color} /> : <Icon size={24} color={color} />;
    };

    return (
        <View style={[
            styles.bottomTabBar,
            { bottom: 16 + (props.ignoreInsets ? 0 : insets.bottom) },
            containerStyle
        ]}>
            {/* 홈 */}
            <TouchableOpacity
                style={styles.navTabContainer}
                onPress={() => handleTabPress('HomeTab')}
                activeOpacity={0.7}
            >
                {renderTabIcon('home', HomeTabIcon, SelectedHomeTabIcon)}
            </TouchableOpacity>

            {/* 일기 목록 */}
            <TouchableOpacity
                style={styles.diaryContainer}
                onPress={() => handleTabPress('DiaryTab')}
                activeOpacity={0.7}
            >
                {renderTabIcon('diary', DiaryTabIcon, SelectedDiaryTabIcon)}
            </TouchableOpacity>

            {/* 중앙 액션 버튼 (글쓰기 또는 저장) */}
            <View style={styles.navTabContainer}>
                <TouchableOpacity
                    style={[styles.centerButton, { backgroundColor: activeColor }]}
                    onPress={handleCenterPress}
                    activeOpacity={0.8}
                >
                    {mode === 'action' ? <CheckIcon /> : <PlusButtonIcon />}
                </TouchableOpacity>
            </View>

            {/* 요약 */}
            <TouchableOpacity
                style={styles.summaryContainer}
                onPress={() => handleTabPress('SummaryTab')}
                activeOpacity={0.7}
            >
                {renderTabIcon('summary', SummaryTabIcon, SelectedSummaryTabIcon)}
            </TouchableOpacity>

            {/* 설정 */}
            <TouchableOpacity
                style={styles.navTabContainer}
                onPress={() => handleTabPress('SettingsTab')}
                activeOpacity={0.7}
            >
                {renderTabIcon('settings', SettingsTabIcon, SelectedSettingsTabIcon)}
            </TouchableOpacity>
        </View>
    );
}

import React from 'react';
import { View, Text, FlatList, StatusBar } from 'react-native';

import { DiaryListItem } from '../../components';
import { MoodCharacter } from '../../constants/MoodCharacters';
import { getMoodByKey } from '../../constants/mood';

import { useMoodListLogic } from './MoodListScreen.logic';
import { styles } from './MoodListScreen.styles';

/**
 * 🎨 기분별 기록 화면의 UI 렌더링을 관장하는 View 컴포넌트입니다.
 * 내비게이션, 상태 관리 등의 복잡한 비즈니스 로직은 순수 훅 분리를 통해 이 공간에서 완전히 제거했습니다.
 */
export function MoodListScreenView({ route, navigation }) {
    // 로직 전담 훅 호출
    const {
        year,
        month,
        mood,
        loading,
        filteredDiaries,
        handleGoBack,
        handleDiaryPress
    } = useMoodListLogic(route, navigation);

    // List 렌더링 부분 캡슐화
    const renderItem = ({ item }) => {
        return (
            <DiaryListItem
                diary={item}
                mood={getMoodByKey(item.mood)}
                onPress={() => handleDiaryPress(item.date)}
            />
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />

            <View style={styles.header}>
                <View style={styles.headerTitleContainer}>
                    <View style={styles.headerIconWrapper}>
                        <MoodCharacter character={mood.character} size={28} />
                    </View>
                    <Text style={styles.headerTitle}>{year}년{month ? ` ${month}월` : ''}의 {mood.label}</Text>
                </View>

                <View style={styles.spacer} />
            </View>

            {loading ? (
                <View style={styles.centerBox}>
                    <Text style={styles.loadingText}>기록을 불러오는 중...</Text>
                </View>
            ) : filteredDiaries.length === 0 ? (
                <View style={styles.centerBox}>
                    <Text style={styles.emptyText}>'{mood.label}' 관련 기록이 없어요.</Text>
                </View>
            ) : (
                <FlatList
                    data={filteredDiaries}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
}

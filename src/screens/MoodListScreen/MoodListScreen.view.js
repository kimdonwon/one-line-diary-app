import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StatusBar, Animated } from 'react-native';

import { Header } from '../../components';
import { DiaryEntryCard } from '../../components/DiaryEntryCard';
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
        activitiesMap,
        commentCounts,
        handleGoBack,
        handleDiaryPress,
        fadeAnim
    } = useMoodListLogic(route, navigation);

    // List 렌더링 부분 캡슐화
    const renderItem = ({ item }) => {
        return (
            <DiaryEntryCard
                diary={item}
                activities={activitiesMap[item.date] || []}
                commentCount={commentCounts[item.date] || 0}
                onPress={() => handleDiaryPress(item.date)}
            />
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />

            <Header
                title={`${year}년${month ? ` ${month}월` : ''}의 ${mood.label}`}
                leftButton={
                    <TouchableOpacity onPress={handleGoBack} style={{ marginRight: 8 }}>
                        <Text style={{ fontSize: 28, color: '#4A3728' }}>‹</Text>
                    </TouchableOpacity>
                }
            />

            {loading ? (
                <View style={styles.centerBox}>
                    <View style={{ marginBottom: 16 }}>
                        <MoodCharacter character="rabbit" size={80} />
                    </View>
                    <Text style={styles.loadingText}>기록을 불러오는 중...</Text>
                </View>
            ) : filteredDiaries.length === 0 ? (
                <Animated.View style={[styles.centerBox, { opacity: fadeAnim }]}>
                    <Text style={styles.emptyText}>'{mood.label}' 관련 기록이 없어요.</Text>
                </Animated.View>
            ) : (
                <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
                    <FlatList
                        data={filteredDiaries}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderItem}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                    />
                </Animated.View>
            )}
        </View>
    );
}

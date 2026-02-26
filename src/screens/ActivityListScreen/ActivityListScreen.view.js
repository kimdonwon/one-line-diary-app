import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StatusBar } from 'react-native';
import { Card, DiaryListItem } from '../../components';
import { ActivityIcon } from '../../constants/ActivityIcons';
import { getMoodByKey } from '../../constants/mood';

import { useActivityListLogic } from './ActivityListScreen.logic';
import { styles } from './ActivityListScreen.styles';

/**
 * 🎨 활동 내역 화면의 UI 렌더링을 전담하는 View 컴포넌트입니다.
 * 비즈니스 로직 훅에서 반환받은 상태를 바탕으로 데이터 매핑과 레이아웃 배치만을 수행합니다.
 */
export function ActivityListScreenView({ route, navigation }) {
    // 뷰(UI 로직)와 비즈니스/통신 로직을 철저히 분리(Decoupling)했습니다.
    const {
        year,
        act,
        loading,
        filteredDiaries,
        handleGoBack,
        handleDiaryPress
    } = useActivityListLogic(route, navigation);

    /**
     * 리스트 아이템 렌더링 내부 함수 (UI 코드 내 응집도를 높임)
     */
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
                {/* 상단 뒤로가기 버튼 */}
                <TouchableOpacity
                    style={styles.backCircle}
                    onPress={handleGoBack}
                    activeOpacity={0.7}
                >
                    <Text style={styles.backIcon}>‹</Text>
                </TouchableOpacity>

                {/* 화면 제목 중앙 정렬 래퍼 */}
                <View style={styles.headerTitleContainer}>
                    <View style={styles.headerIconWrapper}>
                        <ActivityIcon type={act.key} size={24} />
                    </View>
                    <Text style={styles.headerTitle}>{year}년의 {act.label} 기록</Text>
                </View>

                {/* 우측 공백 스페이서 (타이틀을 정중앙에 고정하기 위한 목적) */}
                <View style={styles.spacer} />
            </View>

            {loading ? (
                // 로딩 레이어 출력
                <View style={styles.centerBox}>
                    <Text style={styles.loadingText}>기록을 불러오는 중...</Text>
                </View>
            ) : filteredDiaries.length === 0 ? (
                // 빈 결과 레이어 출력
                <View style={styles.centerBox}>
                    <Text style={styles.emptyText}>'{act.label}' 관련 기록이 없어요.</Text>
                </View>
            ) : (
                // 필터링된 데이터 출력
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

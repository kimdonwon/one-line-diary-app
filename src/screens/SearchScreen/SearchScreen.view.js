import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';

// 디자인 시스템 및 공통 뷰 컴포넌트 임포트
import { Card, DiaryListItem } from '../../components';
import { SearchBar } from '../../components/SearchLayer';
import { getMoodByKey } from '../../constants/mood';

// 로직 처리 훅과 분리된 스타일 시트 임포트 (Modular UI 원칙 준수)
import { useSearchScreenLogic } from './SearchScreen.logic';
import { styles } from './SearchScreen.styles';

/**
 * 🎨 화면에 UI 그래픽 요소만 렌더링하는 View 컴포넌트입니다.
 * 비즈니스 논리나 이벤트 핸들링 훅은 로직 파일에서 모듈로 호출하여 결합도를 낮췄습니다.
 */
export function SearchScreenView() {
    // 로직 훅에서 필요한 상태와 메서드들을 분해 구조 할당으로 로드합니다.
    const {
        searchQuery,
        filteredResults,
        setSearchQuery,
        handleClearSearch,
        handleDiaryPress
    } = useSearchScreenLogic();

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />

            <View style={styles.header}>
                <Text style={styles.headerTitle}>검색</Text>
            </View>

            <View style={styles.searchHeaderWrapper}>
                <SearchBar
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    onClear={handleClearSearch}
                    onCancel={handleClearSearch}
                />
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.searchResultsContainer}>
                    {searchQuery ? (
                        filteredResults.length > 0 ? (
                            <Card style={styles.chartCard}>
                                <Text style={styles.sectionTitle}>검색 결과 {filteredResults.length}건</Text>
                                {/* 인라인 스타일을 배제하고 스타일 시트에 정의된 spacer를 사용 */}
                                <View style={styles.spacer} />
                                {filteredResults.map((item, index) => (
                                    <DiaryListItem
                                        key={item.id ? item.id : `search-${index}`}
                                        diary={item}
                                        mood={getMoodByKey(item.mood)}
                                        onPress={() => handleDiaryPress(item)}
                                    />
                                ))}
                            </Card>
                        ) : (
                            <Card style={styles.emptyCard}>
                                <Text style={styles.emptyText}>검색 결과가 없어요 🥲</Text>
                            </Card>
                        )
                    ) : (
                        <Card style={styles.emptyCard}>
                            <Text style={styles.emptyText}>검색어를 입력해보세요 🔍</Text>
                        </Card>
                    )}
                </View>
                {/* 탭바 간섭 방지 하단 패딩 (인라인 제거) */}
                <View style={styles.bottomPadding} />
            </ScrollView>
        </View>
    );
}

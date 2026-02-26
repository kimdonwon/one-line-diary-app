import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { Card, DiaryListItem } from '../../components';
import { SearchBar } from '../../components/SearchLayer';
import { getMoodByKey } from '../../constants/mood';
import { MoodCharacter } from '../../constants/MoodCharacters';

import { useSearchScreenLogic } from './SearchScreen.logic';
import { styles } from './SearchScreen.styles';

export function SearchScreenView() {
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
                <Text style={styles.headerTitle}>기록 찾기</Text>
                <View style={styles.headerSpacer} />
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
                            <View style={styles.chartCard}>
                                <Text style={styles.sectionTitle}>찾아보니까 {filteredResults.length}개 있어요! ✧</Text>
                                <View style={styles.spacer} />
                                {filteredResults.map((item, index) => (
                                    <DiaryListItem
                                        key={item.id ? item.id : `search-${index}`}
                                        diary={item}
                                        mood={getMoodByKey(item.mood)}
                                        onPress={() => handleDiaryPress(item)}
                                    />
                                ))}
                            </View>
                        ) : (
                            <View style={styles.emptyCard}>
                                <MoodCharacter character="cloud" size={80} />
                                <View style={styles.spacer} />
                                <Text style={styles.emptyText}>아무리 찾아도 없네요!</Text>
                            </View>
                        )
                    ) : (
                        <View style={styles.emptyCard}>
                            <MoodCharacter character="frog" size={80} />
                            <View style={styles.spacer} />
                            <Text style={styles.emptyText}>어떤 하루를 찾을까요?</Text>
                        </View>
                    )}
                </View>
                <View style={styles.bottomPadding} />
            </ScrollView>
        </View>
    );
}

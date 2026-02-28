import React, { useRef } from 'react';
import { View, Text, ScrollView, Animated, Pressable } from 'react-native';
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

    const bounceScale = useRef(new Animated.Value(1)).current;
    const shakeRotate = useRef(new Animated.Value(0)).current;
    const comboScale = useRef(1); // 누적 스케일 관리
    const comboTimer = useRef(null); // 콤보 초기화 타이머

    const handleEmojiPressIn = () => {
        // 타이머 취소 (연타 중)
        if (comboTimer.current) clearTimeout(comboTimer.current);

        // 누를 때마다 0.15씩 증가, 최대 2.5배까지
        comboScale.current = Math.min(comboScale.current + 0.15, 2.5);

        bounceScale.stopAnimation();
        shakeRotate.stopAnimation();
        shakeRotate.setValue(0);

        Animated.parallel([
            Animated.spring(bounceScale, {
                toValue: comboScale.current,
                friction: 4,
                tension: 400,
                useNativeDriver: true
            }),
            Animated.sequence([
                Animated.timing(shakeRotate, { toValue: 1, duration: 40, useNativeDriver: true }),
                Animated.timing(shakeRotate, { toValue: -1, duration: 80, useNativeDriver: true }),
                Animated.timing(shakeRotate, { toValue: 1, duration: 80, useNativeDriver: true }),
                Animated.timing(shakeRotate, { toValue: 0, duration: 40, useNativeDriver: true }),
            ])
        ]).start();
    };

    const handleEmojiPressOut = () => {
        // 스프링으로 쫀득하게 복귀
        Animated.parallel([
            Animated.spring(bounceScale, { toValue: 1, friction: 6, tension: 200, useNativeDriver: true }),
            Animated.spring(shakeRotate, { toValue: 0, friction: 5, tension: 250, useNativeDriver: true })
        ]).start();

        // 500ms 동안 추가 입력이 없으면 콤보 수치 초기화
        comboTimer.current = setTimeout(() => {
            comboScale.current = 1;
        }, 500);
    };

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
                            <Pressable
                                onPressIn={handleEmojiPressIn}
                                onPressOut={handleEmojiPressOut}
                            >
                                <Animated.View style={{
                                    transform: [
                                        { scale: bounceScale },
                                        {
                                            rotate: shakeRotate.interpolate({
                                                inputRange: [-1, 1],
                                                outputRange: ['-15deg', '15deg']
                                            })
                                        }
                                    ]
                                }}>
                                    <MoodCharacter character="frog" size={80} />
                                </Animated.View>
                            </Pressable>
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

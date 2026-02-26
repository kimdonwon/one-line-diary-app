import React, { useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Svg, { Path } from 'react-native-svg';

import { COLORS, SOFT_SHADOW } from '../../constants/theme';
import { Card, MoodCard, SoftAlertModal } from '../../components';
import { MOOD_LIST } from '../../constants/mood';
import { ACTIVITIES } from '../../constants/activities';
import { TEXT_STICKERS, GRAPHIC_STICKERS } from '../../constants/stickers';
import { ActivityIcon } from '../../constants/ActivityIcons';
import { MoodCharacter } from '../../constants/MoodCharacters';
import { DraggableSticker } from '../../components/DraggableSticker';
import {
    HomeTabIcon,
    StatsTabIcon,
    SearchIcon,
    SettingsTabIcon
} from '../../constants/icons';

import { useWriteLogic } from './WriteScreen.logic';
import { styles } from './WriteScreen.styles';

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

/**
 * 🎨 화면 렌더링에 필요한 UI 코드만 모아둔 모듈입니다 (Modular UI Developer 준수)
 * 상태(Sticker, Form) 관련 모든 함수/이벤트는 로직 훅에서 관리합니다.
 */
export function WriteScreenView({ route, navigation }) {
    const scrollRef = useRef(null);

    // 데이터 패칭 로직과 UI 상태(이벤트 헨들러 등)를 분해하여 가져옵니다.
    const {
        formattedDate,
        selectedMood,
        activeMood,
        safeContent,
        lineCount,
        showStickers,
        stickers,
        inputBoxBounds,
        isStickerLimitModalVisible,
        activityStates,

        setSelectedMood,
        setShowStickers,
        setInputBoxBounds,
        setStickerLimitModalVisible,

        handleContentChange,
        handleStickerPress,
        handleDeleteSticker,
        handleDragEnd,
        toggleActivity,
        setActivityTitle,
        setActivityNote,
        handleSave,
        slideToBottom
    } = useWriteLogic(route, navigation, scrollRef);

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />



            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                <ScrollView
                    ref={scrollRef}
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <Text style={styles.sectionTitle}>오늘의 기분은?</Text>

                    <View style={styles.moodRow}>
                        {MOOD_LIST.map((mood) => (
                            <MoodCard
                                key={mood.key}
                                mood={mood}
                                selected={selectedMood === mood.key}
                                onPress={() => setSelectedMood(mood.key)}
                            />
                        ))}
                    </View>

                    {/* ─── MZ 다꾸 스티커 토글 ─── */}
                    <View style={styles.stickerHeaderWrapper}>
                        <TouchableOpacity
                            style={styles.stickerToggleButton}
                            onPress={() => setShowStickers(prev => !prev)}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.stickerToggleText}>
                                {showStickers ? '스티커 숨기기 ▴' : '✨ 스티커 꺼내기 ▾'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {showStickers && (
                        <View style={styles.stickerContainer}>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                keyboardShouldPersistTaps="always"
                                style={styles.stickerScroll}
                            >
                                {TEXT_STICKERS.map((sticker, idx) => (
                                    <TouchableOpacity
                                        key={`text-${idx}`}
                                        style={styles.stickerButton}
                                        onPress={() => handleStickerPress(sticker, false)}
                                    >
                                        <Text style={styles.stickerText}>{sticker}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>

                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                keyboardShouldPersistTaps="always"
                                style={styles.stickerScrollOffset}
                            >
                                {GRAPHIC_STICKERS.map((item) => (
                                    <TouchableOpacity
                                        key={item.key}
                                        style={styles.stickerButton}
                                        onPress={() => handleStickerPress(item.key, true)}
                                    >
                                        <item.Component size={28} />
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    )}

                    <Card style={styles.inputCard}>
                        {/* 🌟 다꾸 스티커 영역 (오버레이) */}
                        <View
                            style={[StyleSheet.absoluteFill, { zIndex: 10 }]}
                            pointerEvents="box-none"
                            onLayout={(e) => {
                                const { width, height, x, y } = e.nativeEvent.layout;
                                setInputBoxBounds({ width, height, x, y });
                            }}
                        >
                            {stickers.map(sticker => (
                                <DraggableSticker
                                    key={sticker.id}
                                    sticker={sticker}
                                    bounds={inputBoxBounds}
                                    onDelete={handleDeleteSticker}
                                    onDragEnd={handleDragEnd}
                                />
                            ))}
                        </View>

                        <View style={styles.inputInnerPad}>
                            <TextInput
                                style={styles.textInput}
                                placeholder="오늘 하루를 짧게 적어보세요..."
                                placeholderTextColor={COLORS.textSecondary}
                                multiline
                                maxLength={500}
                                value={safeContent}
                                onChangeText={handleContentChange}
                                textAlignVertical="top"
                            />
                            <View style={styles.inputFooter}>
                                <Text style={[
                                    styles.lineCount,
                                    lineCount >= 5 && { color: COLORS.todayHighlight },
                                ]}>
                                    {lineCount}/5줄
                                </Text>
                                <Text style={styles.charCount}>
                                    {safeContent.length}/500
                                </Text>
                            </View>
                        </View>
                    </Card>

                    {/* ─── 활동 기록 ─── */}
                    <Text style={styles.sectionTitle}>오늘 뭐 했어?</Text>

                    <View style={styles.activityGrid}>
                        {ACTIVITIES.map((act) => {
                            const state = activityStates.find(a => a.key === act.key);
                            const isSelected = state?.selected;
                            return (
                                <TouchableOpacity
                                    key={act.key}
                                    style={[
                                        styles.activityChip,
                                        isSelected && {
                                            backgroundColor: act.color,
                                            borderColor: act.color,
                                        },
                                    ]}
                                    onPress={() => toggleActivity(act.key)}
                                    activeOpacity={0.7}
                                >
                                    <View style={styles.activityIcon}>
                                        <ActivityIcon type={act.key} size={22} />
                                    </View>
                                    <Text style={[
                                        styles.activityLabel,
                                        isSelected && styles.activityLabelSelected,
                                    ]}>
                                        {act.label}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    {/* 선택된 활동별 한줄 느낀점 서술부 */}
                    {activityStates.filter(a => a.selected).map((state) => {
                        const act = ACTIVITIES.find(a => a.key === state.key);
                        return (
                            <Card key={state.key} style={styles.activityNoteCard}>
                                <View style={styles.activityNoteHeader}>
                                    <View style={styles.activityNoteIcon}>
                                        <ActivityIcon type={act.key} size={20} />
                                    </View>
                                    <Text style={[styles.activityNoteLabel, { color: act.color }]}>
                                        {act.label}
                                    </Text>
                                </View>
                                {act.hasTitle && (
                                    <TextInput
                                        style={styles.activityTitleInput}
                                        placeholder={act.titlePlaceholder}
                                        placeholderTextColor={COLORS.textSecondary}
                                        value={state.title}
                                        onChangeText={(text) => setActivityTitle(state.key, text)}
                                        onFocus={slideToBottom}
                                        maxLength={30}
                                    />
                                )}
                                <TextInput
                                    style={styles.activityNoteInput}
                                    placeholder={`${act.label}하면서 느낀 점...`}
                                    placeholderTextColor={COLORS.textSecondary}
                                    value={state.note}
                                    onChangeText={(text) => setActivityNote(state.key, text)}
                                    onFocus={slideToBottom}
                                    maxLength={50}
                                />
                            </Card>
                        );
                    })}

                    <View style={styles.bottomSpacer} />
                </ScrollView>
            </KeyboardAvoidingView>

            {/* 하단 플로팅 탭바 (홈 화면의 하단 탭바와 똑같은 생김새 유지) */}
            <View style={styles.floatingTabBar}>
                <TouchableOpacity
                    style={styles.fakeTabButton}
                    onPress={() => { navigation.goBack(); navigation.navigate('HomeTab'); }}
                    activeOpacity={0.7}
                >
                    <HomeTabIcon size={24} color={COLORS.textSecondary} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.fakeTabButton}
                    onPress={() => { navigation.goBack(); navigation.navigate('StatsTab'); }}
                    activeOpacity={0.7}
                >
                    <StatsTabIcon size={24} color={COLORS.textSecondary} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.saveCircle,
                        {
                            backgroundColor: activeMood ? activeMood.color : COLORS.soso,
                            shadowColor: activeMood ? activeMood.color : COLORS.soso,
                        },
                    ]}
                    onPress={handleSave}
                    activeOpacity={0.7}
                >
                    <CheckIcon size={26} color="#FFFFFF" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.fakeTabButton}
                    onPress={() => { navigation.goBack(); navigation.navigate('SearchTab'); }}
                    activeOpacity={0.7}
                >
                    <SearchIcon size={24} color={COLORS.textSecondary} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.fakeTabButton}
                    onPress={() => { navigation.goBack(); navigation.navigate('SettingsTab'); }}
                    activeOpacity={0.7}
                >
                    <SettingsTabIcon size={24} color={COLORS.textSecondary} />
                </TouchableOpacity>
            </View>

            <SoftAlertModal
                isVisible={isStickerLimitModalVisible}
                title="스티커 제한 안내"
                message="무료 버전에서는 스티커를 5개까지만 붙일 수 있어요!"
                onConfirm={() => setStickerLimitModalVisible(false)}
            />
        </View>
    );
}

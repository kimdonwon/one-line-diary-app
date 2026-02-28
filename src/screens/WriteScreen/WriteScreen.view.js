import React, { useRef, useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Animated, Modal, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Svg, { Path } from 'react-native-svg';

import { COLORS, SOFT_SHADOW } from '../../constants/theme';
import { Card, MoodCard, SoftAlertModal, Header } from '../../components';
import { MOOD_LIST } from '../../constants/mood';
import { ACTIVITIES } from '../../constants/activities';
import { STICKER_CATEGORIES, CATEGORIZED_STICKERS } from '../../constants/stickers';
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
 * 🧸 스티커 아이템 (Combo Tap & Shake 적용)
 */
const AnimatedStickerItem = ({ children, onPress }) => {
    const bounceScale = useRef(new Animated.Value(1)).current;
    const shakeRotate = useRef(new Animated.Value(0)).current;
    const comboScale = useRef(1);
    const comboTimer = useRef(null);

    const handlePressIn = () => {
        if (comboTimer.current) clearTimeout(comboTimer.current);
        comboScale.current = Math.min(comboScale.current + 0.12, 1.8);

        bounceScale.stopAnimation();
        shakeRotate.stopAnimation();
        shakeRotate.setValue(0);

        Animated.parallel([
            Animated.spring(bounceScale, { toValue: comboScale.current, friction: 4, tension: 400, useNativeDriver: true }),
            Animated.sequence([
                Animated.timing(shakeRotate, { toValue: 1, duration: 40, useNativeDriver: true }),
                Animated.timing(shakeRotate, { toValue: -1, duration: 80, useNativeDriver: true }),
                Animated.timing(shakeRotate, { toValue: 1, duration: 80, useNativeDriver: true }),
                Animated.timing(shakeRotate, { toValue: 0, duration: 40, useNativeDriver: true }),
            ])
        ]).start();
    };

    const handlePressOut = () => {
        Animated.parallel([
            Animated.spring(bounceScale, { toValue: 1, friction: 6, tension: 200, useNativeDriver: true }),
            Animated.spring(shakeRotate, { toValue: 0, friction: 5, tension: 250, useNativeDriver: true })
        ]).start();

        comboTimer.current = setTimeout(() => {
            comboScale.current = 1;
        }, 500);
    };

    return (
        <TouchableOpacity
            style={styles.stickerItem}
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={0.9}
        >
            <Animated.View style={{
                transform: [
                    { scale: bounceScale },
                    {
                        rotate: shakeRotate.interpolate({
                            inputRange: [-1, 1],
                            outputRange: ['-12deg', '12deg']
                        })
                    }
                ]
            }}>
                {children}
            </Animated.View>
        </TouchableOpacity>
    );
};

/**
 * 🎨 화면 렌더링에 필요한 UI 코드만 모아둔 모듈입니다 (Modular UI Developer 준수)
 * 상태(Sticker, Form) 관련 모든 함수/이벤트는 로직 훅에서 관리합니다.
 */
export function WriteScreenView({ route, navigation }) {
    const scrollRef = useRef(null);
    const [activeCategoryId, setActiveCategoryId] = useState(STICKER_CATEGORIES[0].id);

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
        slideToBottom,

        enabledCatIds,
        showManager,
        setShowManager,
        toggleCategory,
        catOrder,
        moveCategory,
        swapCategory,
        showAlert,
        setShowAlert,
        alertConfig,
    } = useWriteLogic(route, navigation, scrollRef);

    const [selectedForReorder, setSelectedForReorder] = useState(null);

    // catOrder 순서대로 활성화된 카테고리만 표시
    const orderedCategories = catOrder
        .map(id => STICKER_CATEGORIES.find(c => c.id === id))
        .filter(Boolean);
    const visibleCategories = orderedCategories.filter(cat => enabledCatIds.includes(cat.id));

    // 현재 선택된 카테고리가 비활성화되었으면 활성화된 첫 번째 카테고리로 강제 이동
    useEffect(() => {
        if (!enabledCatIds.includes(activeCategoryId) && visibleCategories.length > 0) {
            setActiveCategoryId(visibleCategories[0].id);
        }
    }, [enabledCatIds]);

    const currentStickers = CATEGORIZED_STICKERS[activeCategoryId] ?? [];
    const isEmojiCategory = activeCategoryId === 'emoji';

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />
            <Header
                title={formattedDate}
            />

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

                    {/* ─── 스티커 서랍 ─── */}
                    <View style={styles.stickerDrawer}>
                        <View style={styles.stickerDrawerHeader}>
                            <TouchableOpacity
                                style={styles.stickerDrawerTitleGroup}
                                onPress={() => setShowStickers(!showStickers)}
                                activeOpacity={0.7}
                            >
                                <Text style={[
                                    styles.stickerDrawerTitle,
                                    !showStickers && styles.stickerDrawerTitleInactive
                                ]}>스티커 서랍장</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.stickerManageButton}
                                onPress={() => setShowManager(true)}
                                activeOpacity={0.7}
                            >
                                <SettingsTabIcon size={16} color="#666666" />
                            </TouchableOpacity>
                        </View>

                        {showStickers && (
                            <View style={styles.stickerDrawerContent}>
                                {/* 카테고리 탭 바 */}
                                <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    style={styles.categoryTabBar}
                                    keyboardShouldPersistTaps="always"
                                >
                                    {visibleCategories.map((cat) => (
                                        <TouchableOpacity
                                            key={cat.id}
                                            style={[
                                                styles.categoryTab,
                                                activeCategoryId === cat.id && styles.categoryTabActive,
                                            ]}
                                            onPress={() => setActiveCategoryId(cat.id)}
                                            activeOpacity={0.7}
                                        >
                                            <Text style={[
                                                styles.categoryTabText,
                                                activeCategoryId === cat.id && styles.categoryTabTextActive,
                                            ]}>
                                                {cat.label}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>

                                {/* 스티커 목록 */}
                                <ScrollView
                                    style={styles.stickerScrollArea}
                                    showsVerticalScrollIndicator={true}
                                    keyboardShouldPersistTaps="always"
                                    contentContainerStyle={styles.stickerRow}
                                >
                                    {isEmojiCategory
                                        ? currentStickers.map((emoji, idx) => (
                                            <AnimatedStickerItem
                                                key={`emoji-${idx}`}
                                                onPress={() => handleStickerPress(emoji, false)}
                                            >
                                                <Text style={styles.stickerItemEmoji}>{emoji}</Text>
                                            </AnimatedStickerItem>
                                        ))
                                        : currentStickers.map((item) => (
                                            <AnimatedStickerItem
                                                key={item.key}
                                                onPress={() => handleStickerPress(item.key, true)}
                                            >
                                                <item.Component size={28} />
                                            </AnimatedStickerItem>
                                        ))
                                    }
                                </ScrollView>
                            </View>
                        )}
                    </View>

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
                                maxLength={300}
                                value={safeContent}
                                onChangeText={handleContentChange}
                                textAlignVertical="top"
                            />
                            <View style={styles.inputFooter}>
                                <Text style={styles.charCount}>
                                    {safeContent.length}/300
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

            {/* ─── 서랍장 관리 모달 ─── */}
            <Modal
                visible={showManager}
                transparent={true}
                animationType="fade"
                onRequestClose={() => { setSelectedForReorder(null); setShowManager(false); }}
            >
                <Pressable
                    style={styles.modalOverlay}
                    onPress={() => { setSelectedForReorder(null); setShowManager(false); }}
                >
                    <Pressable style={styles.managerContainer} onPress={e => e.stopPropagation()}>
                        {/* 헤더 */}
                        <View style={styles.managerHeader}>
                            <Text style={styles.managerTitle}>서랍장 관리</Text>
                            <TouchableOpacity
                                style={styles.managerCloseBtn}
                                onPress={() => { setSelectedForReorder(null); setShowManager(false); }}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.managerCloseBtnText}>완료</Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.managerDesc}>
                            {selectedForReorder
                                ? '이동할 위치를 눌러주세요'
                                : '꾹 눌러서 순서를 바꿀 수 있어요'}
                        </Text>



                        {/* 카테고리 탭 (그리드 레이아웃) */}
                        <ScrollView
                            style={{ maxHeight: 320 }}
                            contentContainerStyle={styles.managerGrid}
                            showsVerticalScrollIndicator={false}
                        >
                            {orderedCategories.map((cat) => {
                                const isEnabled = enabledCatIds.includes(cat.id);
                                const isGrabbed = selectedForReorder === cat.id;
                                const previewStickers = CATEGORIZED_STICKERS[cat.id]?.slice(0, 3) || [];

                                return (
                                    <TouchableOpacity
                                        key={cat.id}
                                        activeOpacity={0.8}
                                        delayLongPress={300}
                                        onLongPress={() => setSelectedForReorder(cat.id)}
                                        onPress={() => {
                                            if (selectedForReorder) {
                                                if (selectedForReorder !== cat.id) {
                                                    swapCategory(selectedForReorder, cat.id);
                                                }
                                                setSelectedForReorder(null);
                                            } else {
                                                toggleCategory(cat.id); // 일반 탭 시 ON/OFF 토글
                                            }
                                        }}
                                        style={[
                                            styles.managerItem,
                                            !isEnabled && styles.managerItemDisabled,
                                            isGrabbed && styles.managerItemGrabbing,
                                        ]}
                                    >
                                        {/* 상단 팩 이름 태그 */}
                                        <View style={styles.managerItemTag}>
                                            <Text style={styles.managerItemLabel}>{cat.label}</Text>
                                        </View>

                                        {/* 중간 구분선 (스케치 반영) */}
                                        <View style={styles.managerItemInnerDivider} />

                                        {/* 하단 대표 스티커 3개 */}
                                        <View style={styles.managerItemPreviewRow}>
                                            {previewStickers.map((sticker, idx) => {
                                                if (typeof sticker === 'string') {
                                                    return (
                                                        <View key={idx} style={styles.previewStickerWrap}>
                                                            <Text style={styles.previewEmoji}>{sticker}</Text>
                                                        </View>
                                                    );
                                                } else if (sticker.Component) {
                                                    const PreviewComp = sticker.Component;
                                                    return (
                                                        <View key={idx} style={styles.previewStickerWrap}>
                                                            <PreviewComp size={14} />
                                                        </View>
                                                    );
                                                }
                                                return null;
                                            })}
                                        </View>
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>

                        {/* 구분선 + 상점 링크 */}
                        <View style={styles.managerDivider} />
                        <TouchableOpacity
                            style={styles.managerShopLink}
                            onPress={() => {
                                setSelectedForReorder(null);
                                setShowManager(false);
                                navigation.navigate('SettingsTab');
                            }}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.managerShopLinkText}>스티커 상점 구경하기</Text>
                        </TouchableOpacity>
                    </Pressable>
                </Pressable>
            </Modal>

            <SoftAlertModal
                isVisible={isStickerLimitModalVisible}
                title="스티커 제한 안내"
                message="무료 버전에서는 스티커를 5개까지만 붙일 수 있어요!"
                onConfirm={() => setStickerLimitModalVisible(false)}
            />

            <SoftAlertModal
                isVisible={showAlert}
                title={alertConfig.title}
                message={alertConfig.message}
                onConfirm={() => setShowAlert(false)}
            />
        </View>
    );
}

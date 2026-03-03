import React, { useRef, useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Animated, Modal, Pressable, FlatList, Dimensions, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Svg, { Path } from 'react-native-svg';
import Sortable from 'react-native-sortables';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

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
    DiaryTabIcon,
    SummaryTabIcon,
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
    const pageFlatListRef = useRef(null);
    const [activeCategoryId, setActiveCategoryId] = useState(STICKER_CATEGORIES[0].id);
    const [pageCardWidth, setPageCardWidth] = useState(0);

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

        // 멀티페이지
        pages,
        pageStickers,
        currentPageIndex,
        MAX_PAGES,
        addPage,
        deletePage,
        handlePageDeleteTrigger,
        goToPage,

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
        reorderCategories,
        isPremium,

        showAlert,
        setShowAlert,
        alertConfig,

        // Ad
        adBonusStickers,
        handleAdReward,
    } = useWriteLogic(route, navigation, scrollRef);

    const insets = useSafeAreaInsets();

    // catOrder 순서대로 활성화된 카테고리만 표시
    const orderedCategories = catOrder
        .map(id => STICKER_CATEGORIES.find(c => c.id === id))
        .filter(Boolean);
    const limit = isPremium ? 6 : 3;
    const visibleCategories = orderedCategories
        .filter(cat => enabledCatIds.includes(cat.id))
        .slice(0, limit);

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

                    {/* ─── 멀티페이지 입력 영역 (가로 스와이프) ─── */}
                    <View
                        style={styles.pageContainer}
                        onLayout={(e) => {
                            const w = e.nativeEvent.layout.width;
                            if (w > 0) setPageCardWidth(w);
                        }}
                    >
                        {pageCardWidth > 0 && (
                            <FlatList
                                ref={pageFlatListRef}
                                data={pages}
                                horizontal
                                pagingEnabled
                                showsHorizontalScrollIndicator={false}
                                keyExtractor={(_, idx) => `page-${idx}`}
                                onMomentumScrollEnd={(e) => {
                                    const idx = Math.round(e.nativeEvent.contentOffset.x / pageCardWidth);
                                    goToPage(idx);
                                }}
                                getItemLayout={(_, index) => ({
                                    length: pageCardWidth,
                                    offset: pageCardWidth * index,
                                    index,
                                })}
                                renderItem={({ item: pageContent, index: pageIdx }) => (
                                    <Card style={[styles.inputCard, { width: pageCardWidth }]}>
                                        {/* 🌟 다꾸 스티커 영역 (오버레이) */}
                                        <View
                                            style={[StyleSheet.absoluteFill, { zIndex: 10 }]}
                                            pointerEvents="box-none"
                                            onLayout={(e) => {
                                                if (pageIdx === currentPageIndex) {
                                                    const { width, height, x, y } = e.nativeEvent.layout;
                                                    setInputBoxBounds({ width, height, x, y });
                                                }
                                            }}
                                        >
                                            {(pageStickers[pageIdx] || []).map(sticker => (
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
                                                maxLength={260}
                                                value={pageContent || ''}
                                                onChangeText={(text) => {
                                                    handleContentChange(text, pageIdx);
                                                }}
                                                textAlignVertical="top"
                                                onFocus={() => goToPage(pageIdx)}
                                            />
                                            <View style={styles.inputFooter}>
                                                <Text style={styles.charCount}>
                                                    {(pageContent || '').length}/260
                                                </Text>
                                            </View>
                                        </View>
                                    </Card>
                                )}
                            />
                        )}
                    </View>

                    {/* ─── 페이지 네비게이션 바 (플로팅 필) ─── */}
                    <View style={styles.pageNavBarWrapper}>
                        <View style={styles.pageNavBar}>
                            {/* 삭제 버튼 (페이지가 2개 이상일 때만) */}
                            {pages.length > 1 ? (
                                <TouchableOpacity
                                    style={styles.pageDeleteButton}
                                    onPress={() => {
                                        handlePageDeleteTrigger(currentPageIndex, (nextIdx) => {
                                            setTimeout(() => {
                                                pageFlatListRef.current?.scrollToIndex({ index: nextIdx, animated: true });
                                            }, 100);
                                        });
                                    }}
                                    activeOpacity={0.7}
                                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                >
                                    <Text style={styles.pageDeleteButtonText}>✕</Text>
                                </TouchableOpacity>
                            ) : <View style={{ width: 14 }} />}

                            {/* 페이지 인디케이터 (Dots) */}
                            <View style={styles.pageIndicatorRow}>
                                {pages.map((_, idx) => (
                                    <TouchableOpacity
                                        key={`dot-${idx}`}
                                        onPress={() => {
                                            goToPage(idx);
                                            pageFlatListRef.current?.scrollToIndex({ index: idx, animated: true });
                                        }}
                                        activeOpacity={0.7}
                                        hitSlop={{ top: 10, bottom: 10, left: 5, right: 5 }}
                                    >
                                        <View style={idx === currentPageIndex ? styles.pageDotActive : styles.pageDot} />
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {/* 페이지 추가 버튼 */}
                            <TouchableOpacity
                                style={styles.pageAddButton}
                                onPress={() => {
                                    addPage();
                                    // 새 페이지 추가 후 바로 스크롤 이동
                                    setTimeout(() => {
                                        pageFlatListRef.current?.scrollToEnd({ animated: true });
                                    }, 100);
                                }}
                                activeOpacity={0.7}
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            >
                                <Text style={styles.pageAddButtonText}>+</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

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
            <View style={[styles.floatingTabBar, { bottom: 16 + insets.bottom }]}>
                <TouchableOpacity
                    style={styles.fakeTabButton}
                    onPress={() => { navigation.goBack(); navigation.navigate('HomeTab'); }}
                    activeOpacity={0.7}
                >
                    <HomeTabIcon size={24} color={COLORS.textSecondary} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.fakeTabButton}
                    onPress={() => { navigation.goBack(); navigation.navigate('DiaryTab'); }}
                    activeOpacity={0.7}
                >
                    <DiaryTabIcon size={24} color={COLORS.textSecondary} />
                </TouchableOpacity>

                <View style={styles.saveWrap}>
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
                </View>

                <TouchableOpacity
                    style={styles.fakeTabButton}
                    onPress={() => { navigation.goBack(); navigation.navigate('SummaryTab'); }}
                    activeOpacity={0.7}
                >
                    <SummaryTabIcon size={24} color={COLORS.textSecondary} />
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
                animationType="slide"
                onRequestClose={() => { setShowManager(false); }}
            >
                <GestureHandlerRootView style={styles.modalOverlay}>
                    <Pressable
                        style={[StyleSheet.absoluteFill]} // 빈 공간 탭 막기 위해 전체 덮음
                        onPress={() => setShowManager(false)}
                    />
                    <Pressable style={styles.managerContainer} onPress={e => e.stopPropagation()}>
                        {/* 핸들 바 */}
                        <View style={styles.managerHandle} />

                        {/* 헤더 */}
                        <View style={styles.managerHeader}>
                            <Text style={styles.managerTitle}>서랍장 관리</Text>
                            <TouchableOpacity
                                style={styles.managerCloseBtn}
                                onPress={() => { setShowManager(false); }}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.managerCloseBtnText}>완료</Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.managerDesc}>
                            꾹 눌러서 순서를 바꿀 수 있어요
                        </Text>

                        {/* 카테고리 리스트 (Sortable Grid) */}
                        <View style={{ paddingHorizontal: 24 }}>
                            <Sortable.Grid
                                columns={3}
                                data={orderedCategories}
                                keyExtractor={(item) => item.id}
                                columnGap={10}
                                rowGap={10}
                                onDragEnd={({ data }) => {
                                    reorderCategories(data.map(cat => cat.id));
                                }}
                                renderItem={({ item: cat }) => {
                                    const isEnabled = enabledCatIds.includes(cat.id);
                                    const previewStickers = CATEGORIZED_STICKERS[cat.id]?.slice(0, 3) || [];

                                    return (
                                        <TouchableOpacity
                                            activeOpacity={0.8}
                                            onPress={() => toggleCategory(cat.id)}
                                            style={[
                                                styles.managerItem,
                                                !isEnabled && styles.managerItemDisabled,
                                                { width: '100%' } // Sortable.Grid 가 width를 제어하도록 100% 처리
                                            ]}
                                        >
                                            <View style={styles.managerItemTag}>
                                                <Text style={styles.managerItemLabel}>{cat.label}</Text>
                                            </View>
                                            <View style={styles.managerItemInnerDivider} />

                                            <View style={styles.managerItemPreviewRow}>
                                                {previewStickers.map((sticker, idx) => (
                                                    <View key={idx} style={styles.previewStickerWrap}>
                                                        {typeof sticker === 'string' ? (
                                                            <Text style={styles.previewEmoji}>{sticker}</Text>
                                                        ) : sticker.Component ? (
                                                            <sticker.Component size={16} />
                                                        ) : null}
                                                    </View>
                                                ))}
                                            </View>
                                        </TouchableOpacity>
                                    );
                                }}
                            />
                        </View>

                        {/* 구분선 + 상점 링크 */}
                        <View style={styles.managerDivider} />
                        <TouchableOpacity
                            style={styles.managerShopLink}
                            onPress={() => {
                                setShowManager(false);
                                navigation.navigate('SettingsTab');
                            }}
                            activeOpacity={0.7}
                        >
                            <Text style={{ fontSize: 15 }}>🛍️</Text>
                            <Text style={styles.managerShopLinkText}>스티커 상점 구경하기</Text>
                        </TouchableOpacity>
                    </Pressable>
                </GestureHandlerRootView>
            </Modal>

            <SoftAlertModal
                isVisible={isStickerLimitModalVisible}
                title="스티커 제한 안내 🧸"
                message={(isPremium || (3 + adBonusStickers) >= 15)
                    ? `일기 전체에 스티커는 최대 15개까지만 붙일 수 있어요! (현재 ${pageStickers.reduce((acc, cur) => acc + (cur?.length || 0), 0)}개 부착) ✨`
                    : `무료 버전에서는 일기 전체에 스티커를 ${3 + adBonusStickers}개까지만 붙일 수 있어요! (현재 ${pageStickers.reduce((acc, cur) => acc + (cur?.length || 0), 0)}개 부착)`}
                onConfirm={() => setStickerLimitModalVisible(false)}
                secondaryText={(!isPremium && (3 + adBonusStickers) < 15) ? "광고 보고 2개 더 붙이기 📺" : null}
                onSecondaryConfirm={handleAdReward}
            />

            <SoftAlertModal
                isVisible={showAlert}
                title={alertConfig.title}
                message={alertConfig.message}
                confirmText={alertConfig.confirmText || "확인"}
                onConfirm={alertConfig.onConfirm || (() => setShowAlert(false))}
                secondaryText={alertConfig.secondaryText}
                onSecondaryConfirm={alertConfig.onSecondaryConfirm}
            />
        </View>
    );
}

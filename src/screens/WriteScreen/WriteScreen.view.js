import React, { useRef, useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Animated, Modal, Pressable, FlatList, Dimensions, Alert, LayoutAnimation } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import RNModal from 'react-native-modal';
import Svg, { Path } from 'react-native-svg';
import Sortable from 'react-native-sortables';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BlurView } from 'expo-blur';

import { COLORS, SOFT_SHADOW } from '../../constants/theme';
import { Card, MoodCard, SoftAlertModal, Header } from '../../components';
import { MOOD_LIST } from '../../constants/mood';
import { ACTIVITIES } from '../../constants/activities';
import { STICKER_CATEGORIES, CATEGORIZED_STICKERS } from '../../constants/stickers';
import { ActivityIcon } from '../../constants/ActivityIcons';
import { MoodCharacter } from '../../constants/MoodCharacters';
import { DraggableSticker } from '../../components/DraggableSticker';
import { DraggablePhoto } from '../../components/DraggablePhoto';
import { DraggableText } from '../../components/DraggableText';
import { BACKGROUNDS, BG_CATEGORIES, getBackgroundById, getBackgroundsByCategory } from '../../constants/backgrounds';
import {
    HomeTabIcon,
    DiaryTabIcon,
    SummaryTabIcon,
    SettingsTabIcon,
    CameraIcon,
    StickerIcon,
    TextIcon
} from '../../constants/icons';

import { useWriteLogic } from './WriteScreen.logic';
import { styles } from './WriteScreen.styles';

const FONT_PRESETS = [
    { id: 'basic', label: 'BASIC' },
    { id: 'diary', label: 'DIARY' },
    { id: 'hand', label: 'HAND' },
    { id: 'y2k', label: 'Y2K' },
    { id: 'bebas', label: 'BEBAS' },
    { id: 'dmsans', label: 'DMSANS' },
];
const TEXT_COLORS = ['#37352F', '#E03E3E', '#0B6E99', '#D9730D', '#0F7B6C', '#F4A261', '#E9CECD', '#A3C4BC', '#B4A1D2'];
const HIGHLIGHTER_COLORS = ['transparent', 'rgba(255, 226, 221, 0.8)', 'rgba(253, 236, 200, 0.8)', 'rgba(211, 229, 239, 0.8)', 'rgba(219, 237, 219, 0.8)'];


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
 * 🗑️ 프리미엄 쓰레기통 아이콘
 */
function TrashIcon({ size = 20, color = '#83837F' }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Path
                d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6"
                stroke={color}
                strokeWidth="2"
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

// 💡 세션 내 넛지 애니메이션 실행 여부 추적
let WriteScreenNudged = false;

/**
 * 🎨 화면 렌더링에 필요한 UI 코드만 모아둔 모듈입니다 (Modular UI Developer 준수)
 * 상태(Sticker, Form) 관련 모든 함수/이벤트는 로직 훅에서 관리합니다.
 */
export function WriteScreenView({ route, navigation }) {
    const scrollRef = useRef(null);
    const pageFlatListRef = useRef(null);
    const [activeCategoryId, setActiveCategoryId] = useState(STICKER_CATEGORIES[0].id);
    const [pageCardWidth, setPageCardWidth] = useState(0);
    const [photoFrameTab, setPhotoFrameTab] = useState('polaroid'); // 'polaroid' | 'transparent' (탭은 유지하되 UI는 하나)
    const [textColorMode, setTextColorMode] = useState('text'); // 'text' | 'highlight'

    const {
        isMoodModalVisible,
        setMoodModalVisible,
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
        pagePhotos,
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

        // ✏️ Text
        pageTexts,
        showTexts,
        setShowTexts,
        handleAddText,
        handleDeleteText,
        handleTextDragEnd,
        handleCanvasTap,
        handleUpdateText,

        handleContentChange,
        handleStickerPress,
        handleDeleteSticker,
        handleDragEnd,
        toggleActivity,
        setActivityTitle,
        setActivityNote,
        handleSave,
        slideToBottom,

        // 📷 Photo
        showPhotos,
        setShowPhotos,
        handleAddPhoto,
        handleDeletePhoto,
        handlePhotoDragEnd,

        // 🎨 Background
        pageBackgrounds,
        showBackgrounds,
        setShowBackgrounds,
        handleChangeBackground,

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
        setAlertConfig,

        // Ad
        adBonusStickers,
        handleAdReward,

        // 🪄 Magic Decorate
        handleMagicDecorate,
        handleMoodPress,
        handleSubmit,
        isInteracting,
        handleInteractionStart,
        handleInteractionEnd,

        // 🗑️ Trash Zone
        isDraggingAny,
        isOverTrash,
        handleStickerDragMove,
        handleStickerDragDrop,
        handlePhotoDragMove,
        handlePhotoDragDrop,
        handleTextDragMove,
        handleTextDragDrop,

        // ✏️ Text Presets
        nextTextFont,
        setNextTextFont,
        nextTextColor,
        setNextTextColor,
        nextTextBgColor,
        setNextTextBgColor,

        // 🎯 Selection
        selectedItemId,
        handleSelect,
        handleClearSelection,
    } = useWriteLogic(route, navigation, scrollRef);

    // ✏️ 텍스트 패널 — 프리셋만 (문구 입력 제거됨, 로직의 nextText* 상태 사용)

    // 📷 사진용 공유 애니메이션 관리 (반투명 사진 실시간 동기화용)
    const photoAnimations = useRef({});

    // 사진 목록이 바뀔 때 없는 ID 정리 (메모리 누수 방지)
    useEffect(() => {
        const allPhotoIds = new Set(pagePhotos.flat().map(p => p.id));
        Object.keys(photoAnimations.current).forEach(id => {
            if (!allPhotoIds.has(id)) {
                delete photoAnimations.current[id];
            }
        });
    }, [pagePhotos]);

    // 특정 사진의 애니메이션 객체를 가져오거나 생성
    const getPhotoAnimation = useCallback((photo) => {
        if (!photoAnimations.current[photo.id]) {
            photoAnimations.current[photo.id] = {
                pan: new Animated.ValueXY({ x: photo.x, y: photo.y }),
                rotation: new Animated.Value(photo.rotation || 0)
            };
        }
        return photoAnimations.current[photo.id];
    }, []);

    const insets = useSafeAreaInsets();
    // 💡 화면 진입 시 페이지를 추가할 수 있음을 알려주는 '넛지' 효과 (세션당 1회)
    useEffect(() => {
        if (pageCardWidth > 0 && !WriteScreenNudged) {
            const timer = setTimeout(() => {
                if (pageFlatListRef.current) {
                    // 살짝 왼쪽으로 밀어 (24px) 새 페이지 카드가 보이게 함
                    pageFlatListRef.current.scrollToOffset({
                        offset: 24,
                        animated: true
                    });

                    setTimeout(() => {
                        pageFlatListRef.current?.scrollToOffset({
                            offset: 0,
                            animated: true
                        });
                        WriteScreenNudged = true;
                    }, 400);
                }
            }, 800);
            return () => clearTimeout(timer);
        }
    }, [pageCardWidth]);

    // catOrder 순서대로 활성화된 카테고리만 표시
    const orderedCategories = catOrder
        .map(id => STICKER_CATEGORIES.find(c => c.id === id))
        .filter(Boolean);
    const limit = 6; // 스티커 서랍장 카테고리 제한 해제 (무료/유료 상관없이 6개)
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
                rightButton={
                    <TouchableOpacity
                        style={{
                            backgroundColor: activeMood ? activeMood.color : COLORS.soso, // 기분 색상 적용
                            paddingHorizontal: 8,
                            paddingVertical: 6,
                            borderRadius: 6, // 둥글지 않은 노션 특유의 작은 라운딩
                            alignItems: 'center',
                            justifyContent: 'center',
                            minWidth: 40,
                            ...SOFT_SHADOW.button,
                        }}
                        onPress={handleSave}
                        activeOpacity={0.8}
                    >
                        <CheckIcon size={20} color="#FFFFFF" />
                    </TouchableOpacity>
                }
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
                    nestedScrollEnabled={true}
                    scrollEnabled={!isInteracting}
                >


                    {/* ─── 🌈 통합 다이어리 카드 영역 (캔버스 + 하단 메타) ─── */}
                    <View style={[styles.integratedDiaryCard, isDraggingAny && { overflow: 'visible' }]}>
                        {/* 멀티페이지 캔버스 영역 (가로 스와이프 + 엣지 풀 추가) */}
                        <View
                            style={[styles.pageContainer, isDraggingAny && { overflow: 'visible' }]}
                            onLayout={(e) => {
                                const w = e.nativeEvent.layout.width;
                                if (w > 0) setPageCardWidth(w);
                            }}
                        >
                            {pageCardWidth > 0 && (
                                <FlatList
                                    ref={pageFlatListRef}
                                    data={[...pages, '__ADD_PAGE__']}
                                    horizontal
                                    pagingEnabled
                                    showsHorizontalScrollIndicator={false}
                                    scrollEnabled={!isInteracting}
                                    contentContainerStyle={isDraggingAny && { overflow: 'visible' }}
                                    style={isDraggingAny && { overflow: 'visible' }}
                                    keyExtractor={(_, idx) => `page-${idx}`}
                                    onMomentumScrollEnd={(e) => {
                                        const idx = Math.round(e.nativeEvent.contentOffset.x / pageCardWidth);
                                        if (idx >= pages.length) {
                                            // 🧲 엣지 풀 트리거: 마지막 '+' 카드에 도달하면 페이지 자동 추가
                                            addPage();
                                            setTimeout(() => {
                                                pageFlatListRef.current?.scrollToIndex({ index: pages.length, animated: true });
                                            }, 100);
                                        } else {
                                            goToPage(idx);
                                        }
                                    }}
                                    getItemLayout={(_, index) => ({
                                        length: pageCardWidth,
                                        offset: pageCardWidth * index,
                                        index,
                                    })}
                                    renderItem={({ item: pageContent, index: pageIdx }) => {
                                        // ─── 🧲 마지막 '+' 카드 (엣지 풀 트리거) ───
                                        if (pageContent === '__ADD_PAGE__') {
                                            return (
                                                <TouchableOpacity
                                                    activeOpacity={0.6}
                                                    onPress={() => {
                                                        addPage();
                                                        setTimeout(() => {
                                                            pageFlatListRef.current?.scrollToIndex({ index: pages.length, animated: true });
                                                        }, 100);
                                                    }}
                                                    style={[styles.inputCard, styles.addPageCard, { width: pageCardWidth }]}
                                                >
                                                    <Text style={styles.addPageIcon}>+</Text>
                                                    <Text style={styles.addPageText}>새 페이지</Text>
                                                </TouchableOpacity>
                                            );
                                        }

                                        const bgData = getBackgroundById(pageBackgrounds[pageIdx] || 'default');
                                        return (
                                            <Card style={[styles.inputCard, { width: pageCardWidth, backgroundColor: bgData.backgroundColor }, isDraggingAny && { overflow: 'visible' }]}>
                                                {/* [층0] 📝 빈 공간 롱탭 전용 배경 (텍스트 생성용) */}
                                                <Pressable
                                                    style={StyleSheet.absoluteFill}
                                                    onPress={handleClearSelection}
                                                    onLongPress={(e) => {
                                                        if (pageIdx === currentPageIndex) {
                                                            const { locationX, locationY } = e.nativeEvent;
                                                            handleCanvasTap(locationX, locationY);
                                                        }
                                                    }}
                                                    delayLongPress={400}
                                                />
                                                {/* [층0.5] 반투명 프레임 사진 시각 레이어 (텍스트 뒤, 터치 불가) */}
                                                <View
                                                    style={[StyleSheet.absoluteFill, { zIndex: 1, elevation: 0 }]}
                                                    pointerEvents="none"
                                                >
                                                    {(pagePhotos[pageIdx] || []).filter(p => p.frameType === 'transparent_white' || p.frameType === 'transparent_gray').map(photo => {
                                                        const anim = getPhotoAnimation(photo);
                                                        return (
                                                            <DraggablePhoto
                                                                key={`vis-${photo.id}`}
                                                                photo={photo}
                                                                bounds={inputBoxBounds}
                                                                externalPan={anim.pan}
                                                                externalRotation={anim.rotation}
                                                                onDelete={handleDeletePhoto}
                                                                onDragEnd={handlePhotoDragEnd}
                                                                onInteractionStart={handleInteractionStart}
                                                                onInteractionEnd={handleInteractionEnd}
                                                                onDragMove={handlePhotoDragMove}
                                                                onDragDrop={handlePhotoDragDrop}
                                                                onSelect={handleSelect}
                                                                isSelected={selectedItemId === photo.id}
                                                            />
                                                        );
                                                    })}
                                                </View>

                                                {/* [층1] 📝 빈 캔버스 안내 레이어 (시각 전용, 터치 불가) */}
                                                <View
                                                    style={[StyleSheet.absoluteFill, { zIndex: 2 }]}
                                                    pointerEvents="none"
                                                >
                                                    {(pageTexts[pageIdx] || []).length === 0 && (pagePhotos[pageIdx] || []).length === 0 && (pageStickers[pageIdx] || []).length === 0 && (
                                                        <View style={styles.canvasGuide}>

                                                            <Text style={styles.canvasGuideText}>
                                                                화면을 꾹 눌러서 일기를 써보세요.
                                                            </Text>
                                                        </View>
                                                    )}
                                                </View>

                                                {/* [층1.5] 👻 반투명 프레임 사진 터치 레이어 (텍스트 위, 보이지 않음) */}
                                                <View
                                                    style={[StyleSheet.absoluteFill, { zIndex: 4 }]}
                                                    pointerEvents="box-none"
                                                >
                                                    {(pagePhotos[pageIdx] || []).filter(p => p.frameType === 'transparent_white' || p.frameType === 'transparent_gray').map(photo => {
                                                        const anim = getPhotoAnimation(photo);
                                                        return (
                                                            <DraggablePhoto
                                                                key={`ghost-${photo.id}`}
                                                                isGhost={true}
                                                                photo={photo}
                                                                bounds={inputBoxBounds}
                                                                externalPan={anim.pan}
                                                                externalRotation={anim.rotation}
                                                                onDelete={handleDeletePhoto}
                                                                onDragEnd={handlePhotoDragEnd}
                                                                onInteractionStart={handleInteractionStart}
                                                                onInteractionEnd={handleInteractionEnd}
                                                                onDragMove={handlePhotoDragMove}
                                                                onDragDrop={handlePhotoDragDrop}
                                                                onSelect={handleSelect}
                                                                isSelected={selectedItemId === photo.id}
                                                            />
                                                        );
                                                    })}
                                                </View>

                                                {/* ─── 📊 카드 내부 인디케이터 (피드 스타일) ─── */}
                                                {pages.length > 1 && (
                                                    <View style={styles.cardIndicatorWrap} pointerEvents="box-none">
                                                        <View style={styles.cardIndicatorDots}>
                                                            {pages.map((_, dotIdx) => (
                                                                <View
                                                                    key={`dot-${dotIdx}`}
                                                                    style={dotIdx === pageIdx ? styles.pageDotActive : styles.pageDot}
                                                                />
                                                            ))}
                                                        </View>
                                                        <TouchableOpacity
                                                            onPress={() => {
                                                                handlePageDeleteTrigger(pageIdx, (nextIdx) => {
                                                                    setTimeout(() => {
                                                                        pageFlatListRef.current?.scrollToIndex({ index: nextIdx, animated: true });
                                                                    }, 100);
                                                                });
                                                            }}
                                                            activeOpacity={0.6}
                                                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                                            style={styles.cardDeleteBtn}
                                                        >
                                                            <Text style={styles.cardDeleteText}>✕</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                )}

                                                {/* [층2] 📷 폴라로이드 사진 레이어 (반투명 프레임 제외) */}
                                                <View
                                                    style={[StyleSheet.absoluteFill, { zIndex: 5, elevation: 5 }]}
                                                    pointerEvents="box-none"
                                                >
                                                    {(pagePhotos[pageIdx] || []).filter(p => p.frameType !== 'transparent_white' && p.frameType !== 'transparent_gray').map(photo => (
                                                        <DraggablePhoto
                                                            key={photo.id}
                                                            photo={photo}
                                                            bounds={inputBoxBounds}
                                                            onDelete={handleDeletePhoto}
                                                            onDragEnd={handlePhotoDragEnd}
                                                            onInteractionStart={handleInteractionStart}
                                                            onInteractionEnd={handleInteractionEnd}
                                                            onDragMove={handlePhotoDragMove}
                                                            onDragDrop={handlePhotoDragDrop}
                                                            onSelect={handleSelect}
                                                            isSelected={selectedItemId === photo.id}
                                                        />
                                                    ))}
                                                </View>

                                                {/* [층2.5] ✏️ 텍스트 스티커 영역 */}
                                                <View
                                                    style={[StyleSheet.absoluteFill, { zIndex: 8, elevation: 8 }]}
                                                    pointerEvents="box-none"
                                                >
                                                    {(pageTexts[pageIdx] || []).map(textNode => (
                                                        <DraggableText
                                                            key={`txt-${textNode.id}`}
                                                            id={textNode.id}
                                                            text={textNode.text}
                                                            fontId={textNode.fontId}
                                                            color={textNode.color}
                                                            bgColor={textNode.bgColor}
                                                            initialX={textNode.x}
                                                            initialY={textNode.y}
                                                            initialRotation={textNode.rotation}
                                                            initialScale={textNode.scale}
                                                            onDelete={handleDeleteText}
                                                            onDragEnd={handleTextDragEnd}
                                                            onTextChange={handleUpdateText}
                                                            onInteractionStart={handleInteractionStart}
                                                            onInteractionEnd={handleInteractionEnd}
                                                            onDragMove={handleTextDragMove}
                                                            onDragDrop={handleTextDragDrop}
                                                            onSelect={handleSelect}
                                                            isSelected={selectedItemId === textNode.id}
                                                            autoFocus={textNode.autoFocus || false}
                                                        />
                                                    ))}
                                                </View>

                                                {/* [층3] 🌟 다꾸 스티커 영역 (최상위) */}
                                                <View
                                                    style={[StyleSheet.absoluteFill, { zIndex: 10, elevation: 10 }]}
                                                    pointerEvents="box-none"
                                                    onLayout={(e) => {
                                                        if (pageIdx === currentPageIndex) {
                                                            const { width, height, x, y } = e.nativeEvent.layout;
                                                            if (width !== inputBoxBounds.width || height !== inputBoxBounds.height) {
                                                                setInputBoxBounds({ width, height, x, y });
                                                            }
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
                                                            onInteractionStart={handleInteractionStart}
                                                            onInteractionEnd={handleInteractionEnd}
                                                            onDragMove={handleStickerDragMove}
                                                            onDragDrop={handleStickerDragDrop}
                                                            onSelect={handleSelect}
                                                            isSelected={selectedItemId === sticker.id}
                                                        />
                                                    ))}
                                                </View>
                                            </Card>
                                        );
                                    }}
                                />
                            )}

                        </View>

                        {/* ─── 🚀 플로팅 글래스 아일랜드 (Seamless Morphing Dock) ─── */}
                        {(showTexts || showPhotos || showStickers) && (
                            <View style={styles.floatingDockContainer}>
                                <BlurView intensity={75} tint="light" style={styles.floatingDockBlur} />

                                <View style={styles.floatingDockContent}>
                                    {/* ─── 🗂 ✏️ 텍스트 프리셋 패널 (Stitch v2: 프리미엄 디자인) ─── */}
                                    {showTexts && (
                                        <View style={[styles.textDrawerWrap, { backgroundColor: 'transparent' }]}>
                                            {/*  색상 선택 (2줄: 위 문자색, 아래 하이라이트색) */}
                                            <View style={styles.colorScrollWrap}>
                                                <View style={styles.colorRowsContainer}>
                                                    {/* 첫 번째 줄: 문자 색상 */}
                                                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.colorScrollContent}>
                                                        <View style={styles.colorRow}>
                                                            {TEXT_COLORS.map(color => {
                                                                const isSelected = nextTextColor === color;
                                                                return (
                                                                    <TouchableOpacity
                                                                        key={`txt-${color}`}
                                                                        style={[
                                                                            styles.colorBtn,
                                                                            { backgroundColor: color },
                                                                            isSelected && styles.colorBtnActive
                                                                        ]}
                                                                        onPress={() => setNextTextColor(color)}
                                                                        activeOpacity={0.8}
                                                                    >
                                                                        {isSelected && <CheckIcon size={20} color={color === '#FFFFFF' || color === 'transparent' ? '#37352F' : '#FFF'} />}
                                                                    </TouchableOpacity>
                                                                );
                                                            })}
                                                        </View>
                                                    </ScrollView>

                                                    {/* 두 번째 줄: 하이라이트(배경) 색상 */}
                                                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.colorScrollContent}>
                                                        <View style={styles.colorRow}>
                                                            {HIGHLIGHTER_COLORS.map((color, idx) => {
                                                                const isSelected = nextTextBgColor === color;
                                                                // 투명일 경우 표시용 흰색 배경 적용
                                                                const displayColor = color === 'transparent' ? '#FFF' : color;
                                                                return (
                                                                    <TouchableOpacity
                                                                        key={`bg-${idx}`}
                                                                        style={[
                                                                            styles.colorBtn,
                                                                            { backgroundColor: displayColor },
                                                                            isSelected && styles.colorBtnActive
                                                                        ]}
                                                                        onPress={() => setNextTextBgColor(color)}
                                                                        activeOpacity={0.8}
                                                                    >
                                                                        {color === 'transparent' && <View style={styles.transparentSlash} />}
                                                                        {isSelected && (
                                                                            <View style={styles.checkIconOverlay}>
                                                                                <CheckIcon size={20} color={color === 'transparent' ? '#37352F' : '#FFF'} />
                                                                            </View>
                                                                        )}
                                                                    </TouchableOpacity>
                                                                );
                                                            })}
                                                        </View>
                                                    </ScrollView>
                                                </View>
                                            </View>

                                            {/* 폰트 (그리드) */}
                                            <View style={styles.fontGrid}>
                                                {FONT_PRESETS.map(font => {
                                                    const previewStyle = {};
                                                    if (font.id === 'basic') previewStyle.fontFamily = 'GowunDodum_400Regular';
                                                    else if (font.id === 'diary') previewStyle.fontFamily = 'NanumMyeongjo_400Regular';
                                                    else if (font.id === 'hand') previewStyle.fontFamily = 'SingleDay_400Regular';
                                                    else if (font.id === 'y2k') previewStyle.fontFamily = 'NanumPenScript_400Regular';
                                                    else if (font.id === 'bebas') { previewStyle.fontFamily = 'BebasNeue_400Regular'; previewStyle.letterSpacing = 1.5; previewStyle.fontSize = 17; }
                                                    else if (font.id === 'dmsans') { previewStyle.fontFamily = 'DMSans_400Regular'; previewStyle.fontSize = 12; }

                                                    const isLocked = !isPremium && font.id !== 'basic' && font.id !== 'diary';
                                                    const isActive = nextTextFont === font.id;
                                                    return (
                                                        <TouchableOpacity
                                                            key={font.id}
                                                            style={[styles.fontGridItem, isActive && styles.fontGridItemActive]}
                                                            onPress={() => {
                                                                if (isLocked) {
                                                                    setAlertConfig({
                                                                        title: '프리미엄 전용 폰트 ✨',
                                                                        message: '다양한 폰트는 프리미엄 버전에서\n무제한으로 사용할 수 있어요!'
                                                                    });
                                                                    setShowAlert(true);
                                                                    return;
                                                                }
                                                                setNextTextFont(font.id);
                                                            }}
                                                            activeOpacity={0.8}
                                                        >
                                                            <Text style={[styles.fontGridItemText, isActive && styles.fontGridItemTextActive, previewStyle, isLocked && { opacity: 0.6 }]}>
                                                                {font.label}
                                                            </Text>
                                                            {isLocked && (
                                                                <View style={styles.premiumTag}>
                                                                    <Text style={{ fontSize: 8 }}>✨</Text>
                                                                </View>
                                                            )}
                                                        </TouchableOpacity>
                                                    );
                                                })}
                                            </View>
                                        </View>
                                    )}

                                    {/* ─── 🗂 📷 사진 프레임 바텀시트 (Bottom Sheet) ─── */}
                                    {showPhotos && (
                                        <View style={styles.stickerBottomSheet}>
                                            {/* 바텀시트 상단 헤더 (탭 구조 유지) */}
                                            <View style={styles.stickerBottomSheetHeader}>
                                                <View style={styles.categoryTabBar}>
                                                    <TouchableOpacity
                                                        style={[styles.categoryTab, styles.categoryTabActive]}
                                                        activeOpacity={1}
                                                    >
                                                        <Text style={[styles.categoryTabText, styles.categoryTabTextActive]}>프레임</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>

                                            <ScrollView
                                                horizontal
                                                showsHorizontalScrollIndicator={false}
                                                contentContainerStyle={styles.photoFrameContainer}
                                            >
                                                <TouchableOpacity
                                                    style={styles.frameOptionBtn}
                                                    onPress={() => handleAddPhoto('white')}
                                                    activeOpacity={0.7}
                                                >
                                                    <View style={[styles.framePreview, styles.framePreviewWhite]}>
                                                        <View style={styles.frameInnerPhoto} />
                                                    </View>
                                                </TouchableOpacity>

                                                <TouchableOpacity
                                                    style={styles.frameOptionBtn}
                                                    onPress={() => handleAddPhoto('black')}
                                                    activeOpacity={0.7}
                                                >
                                                    <View style={[styles.framePreview, styles.framePreviewBlack]}>
                                                        <View style={[styles.frameInnerPhoto, { backgroundColor: 'rgba(255,255,255,0.1)' }]} />
                                                    </View>
                                                </TouchableOpacity>

                                                <TouchableOpacity
                                                    style={styles.frameOptionBtn}
                                                    onPress={() => handleAddPhoto('gray')}
                                                    activeOpacity={0.7}
                                                >
                                                    <View style={[styles.framePreview, styles.framePreviewGray]}>
                                                        <View style={styles.frameInnerPhoto} />
                                                    </View>
                                                </TouchableOpacity>

                                                <TouchableOpacity
                                                    style={styles.frameOptionBtn}
                                                    onPress={() => {
                                                        if (isPremium) {
                                                            handleAddPhoto('pink');
                                                        } else {
                                                            Alert.alert('프리미엄 전용 💎', '파스텔 프레임은 프리미엄 회원만 사용할 수 있어요.');
                                                        }
                                                    }}
                                                    activeOpacity={0.7}
                                                >
                                                    <View style={[styles.framePreview, styles.framePreviewPink, !isPremium && { opacity: 0.8 }]}>
                                                        <View style={styles.frameInnerPhoto} />
                                                        {!isPremium && <View style={styles.premiumTag}><Text style={{ fontSize: 8 }}>✨</Text></View>}
                                                    </View>
                                                </TouchableOpacity>

                                                <TouchableOpacity
                                                    style={styles.frameOptionBtn}
                                                    onPress={() => {
                                                        if (isPremium) {
                                                            handleAddPhoto('blue');
                                                        } else {
                                                            Alert.alert('프리미엄 전용 💎', '파스텔 프레임은 프리미엄 회원만 사용할 수 있어요.');
                                                        }
                                                    }}
                                                    activeOpacity={0.7}
                                                >
                                                    <View style={[styles.framePreview, styles.framePreviewBlue, !isPremium && { opacity: 0.8 }]}>
                                                        <View style={styles.frameInnerPhoto} />
                                                        {!isPremium && <View style={styles.premiumTag}><Text style={{ fontSize: 8 }}>✨</Text></View>}
                                                    </View>
                                                </TouchableOpacity>

                                                <TouchableOpacity
                                                    style={styles.frameOptionBtn}
                                                    onPress={() => {
                                                        if (isPremium) {
                                                            handleAddPhoto('mint');
                                                        } else {
                                                            Alert.alert('프리미엄 전용 💎', '파스텔 프레임은 프리미엄 회원만 사용할 수 있어요.');
                                                        }
                                                    }}
                                                    activeOpacity={0.7}
                                                >
                                                    <View style={[styles.framePreview, styles.framePreviewMint, !isPremium && { opacity: 0.8 }]}>
                                                        <View style={styles.frameInnerPhoto} />
                                                        {!isPremium && <View style={styles.premiumTag}><Text style={{ fontSize: 8 }}>✨</Text></View>}
                                                    </View>
                                                </TouchableOpacity>
                                            </ScrollView>
                                        </View>
                                    )}

                                    {/* ─── 🗂 ✨ 스티커 바텀시트 (Bottom Sheet) ─── */}
                                    {showStickers && (
                                        <View style={styles.stickerBottomSheet}>
                                            {/* 바텀시트 상단 헤더 (카테고리 탭 + 설정 버튼) */}
                                            <View style={styles.stickerBottomSheetHeader}>
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

                                                {/* ⚙️ 스티커 관리 버튼 */}
                                                <TouchableOpacity
                                                    style={styles.stickerManageBtnInside}
                                                    onPress={() => setShowManager(true)}
                                                    activeOpacity={0.7}
                                                >
                                                    <SettingsTabIcon size={16} color="#999" />
                                                </TouchableOpacity>
                                            </View>

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
                            </View>
                        )}


                        {/* ─── 📊 피드 레이아웃의 하단 메타 정보 영역 ─── */}
                        <View style={styles.integratedDiaryMeta}>
                            {/* 🛠️ 좌측 도구 버튼 영역 (스티커, 카메라, 텍스트) */}
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                                <TouchableOpacity
                                    onPress={() => {
                                        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                                        setShowStickers(!showStickers);
                                        setShowPhotos(false);
                                        setShowBackgrounds(false);
                                        setShowTexts(false);
                                    }}
                                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                >
                                    <StickerIcon size={24} active={showStickers} />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {
                                        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                                        setShowPhotos(!showPhotos);
                                        setShowStickers(false);
                                        setShowBackgrounds(false);
                                        setShowTexts(false);
                                    }}
                                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                >
                                    <CameraIcon size={24} color={showPhotos ? "#2D1E16" : "#8B7E74"} />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {
                                        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                                        setShowTexts(!showTexts);
                                        setShowStickers(false);
                                        setShowPhotos(false);
                                        setShowBackgrounds(false);
                                    }}
                                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                >
                                    <TextIcon size={24} active={showTexts} color={showTexts ? "#2D1E16" : "#8B7E74"} />
                                </TouchableOpacity>
                            </View>

                            {/* 우측 활동 및 기분 아이콘 영역 (모달 트리거) */}
                            <TouchableOpacity
                                style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginLeft: 16 }}
                                onPress={() => setMoodModalVisible(true)}
                                activeOpacity={0.8}
                                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                            >
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', flexWrap: 'wrap', marginRight: 8, maxWidth: 110 }}>
                                    {activityStates.filter(a => a.selected).map(act => (
                                        <View key={`meta-act-${act.key}`} style={{ margin: 2 }}>
                                            <ActivityIcon type={act.key} size={16} />
                                        </View>
                                    ))}
                                </View>
                                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                    {activeMood ? (
                                        <MoodCharacter character={activeMood.character} size={36} />
                                    ) : (
                                        <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#E9E9E7', alignItems: 'center', justifyContent: 'center' }}>
                                            <Text style={{ fontSize: 18 }}>?</Text>
                                        </View>
                                    )}
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>

            {/* 🗑️ 인스타그램 스타일 다크 펄스 쓰레기통 (드래그 중에만 표시) */}
            {isDraggingAny && (
                <View style={[
                    styles.trashZone,
                    isOverTrash && styles.trashZoneActive,
                ]} pointerEvents="none">
                    <View style={styles.trashIconContainer}>
                        <TrashIcon
                            size={24}
                            color="#FFFFFF"
                        />
                    </View>
                </View>
            )}



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
                message={(() => {
                    const currentPageStickers = pageStickers[currentPageIndex]?.length || 0;
                    const baseLimit = 3 + adBonusStickers;
                    const effectiveLimit = Math.max(baseLimit, currentPageStickers);

                    if (isPremium || effectiveLimit >= 15) {
                        return `이 페이지에 스티커는 최대 15개까지만 붙일 수 있어요! (현재 ${currentPageStickers}개 부착) ✨`;
                    }
                    return `무료 버전에서는 이 페이지에 스티커를 ${effectiveLimit}개까지만 붙일 수 있어요! (현재 ${currentPageStickers}개 부착)`;
                })()}
                onConfirm={() => setStickerLimitModalVisible(false)}
                secondaryText={(!isPremium && (3 + adBonusStickers) < 15) ? "광고 보고 2개 더 붙이기 📺" : null}
                onSecondaryConfirm={handleAdReward}
            />
            {/* 🛑 알림 모달 */}
            <SoftAlertModal
                isVisible={showAlert}
                title={alertConfig.title}
                message={alertConfig.message}
                confirmText={alertConfig.confirmText}
                onConfirm={alertConfig.onConfirm || (() => setShowAlert(false))}
                secondaryText={alertConfig.secondaryText}
                onSecondaryConfirm={alertConfig.onSecondaryConfirm}
                onClose={() => setShowAlert(false)}
            />

            {/* 🚪 기분/활동 팝업 모달 */}
            <RNModal
                isVisible={isMoodModalVisible}
                onBackdropPress={() => setMoodModalVisible(false)}
                onSwipeComplete={() => setMoodModalVisible(false)}
                swipeDirection="down"
                style={{ justifyContent: 'flex-end', margin: 0 }}
                propagateSwipe={true}
                avoidKeyboard={true}
                backdropOpacity={0.5}
            >
                <View style={{
                    backgroundColor: '#FAFAF9',
                    borderTopLeftRadius: 24,
                    borderTopRightRadius: 24,
                    padding: 24,
                    paddingBottom: insets.bottom + 24,
                    maxHeight: '90%'
                }}>
                    <View style={{ width: 40, height: 5, backgroundColor: '#D9D9D6', borderRadius: 3, alignSelf: 'center', marginBottom: 20 }} />
                    <ScrollView showsVerticalScrollIndicator={false}>

                        {/* 오늘의 기분 영역 */}
                        <Text style={[styles.sectionTitle, { marginTop: 0 }]}>오늘의 기분은?</Text>
                        <View style={styles.moodRow}>
                            {MOOD_LIST.map((mood) => (
                                <MoodCard
                                    key={`modal-${mood.key}`}
                                    mood={mood}
                                    selected={selectedMood === mood.key}
                                    onPress={() => setSelectedMood(mood.key)}
                                />
                            ))}
                        </View>

                        {/* 오늘의 활동 영역 */}
                        <Text style={[styles.sectionTitle, { marginTop: 32 }]}>오늘 뭐 했어?</Text>
                        <View style={styles.activityGrid}>
                            {ACTIVITIES.map((act) => {
                                const state = activityStates.find(a => a.key === act.key);
                                const isSelected = state?.selected;
                                return (
                                    <TouchableOpacity
                                        key={`modal-act-${act.key}`}
                                        style={[
                                            styles.activityChip,
                                            isSelected && { backgroundColor: act.color },
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

                        {/* 완료 버튼 */}
                        <TouchableOpacity
                            style={{
                                marginTop: 32,
                                backgroundColor: activeMood ? activeMood.color : COLORS.soso,
                                borderRadius: 16,
                                paddingVertical: 16,
                                alignItems: 'center',
                                ...SOFT_SHADOW.card
                            }}
                            onPress={() => setMoodModalVisible(false)}
                            activeOpacity={0.8}
                        >
                            <Text style={{ fontSize: 16, fontWeight: '700', color: '#FFF' }}>선택하기</Text>
                        </TouchableOpacity>

                    </ScrollView>
                </View>
            </RNModal>

        </View >
    );
}

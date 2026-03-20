import React, { useRef, useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Animated, Modal, Pressable, FlatList, Dimensions, Alert, LayoutAnimation, Keyboard } from 'react-native';
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
import { SYSTEM_LIMITS } from '../../constants/limits';
import { STICKER_CATEGORIES, CATEGORIZED_STICKERS } from '../../constants/stickers';
import { ActivityIcon } from '../../constants/ActivityIcons';
import { MoodCharacter } from '../../constants/MoodCharacters';
import { DraggableSticker } from '../../components/DraggableSticker';
import { DraggablePhoto } from '../../components/DraggablePhoto';
import { DraggableText } from '../../components/DraggableText';
import { BACKGROUNDS, BG_CATEGORIES, getBackgroundById, getBackgroundsByCategory } from '../../constants/backgrounds';
import {
    CameraIcon,
    StickerIcon,
    TextIcon,
    SettingsTabIcon
} from '../../constants/icons';
import { BottomBar } from '../../components/BottomBar';

// ✅ 저장 확인(V) 아이콘 - 내부용 (텍스트 컬러 선택기 등에서 사용)
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

import { useWriteLogic } from './WriteScreen.logic';
import { styles } from './WriteScreen.styles';
import { useGlobalWeeklyMood } from '../../context/MoodContext';

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


// CheckIcon은 이제 공통 BottomBar 내부에서 처리되므로 외부 정의를 삭제했습니다.

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


/**
 * 🎨 화면 렌더링에 필요한 UI 코드만 모아둔 모듈입니다 (Modular UI Developer 준수)
 * 상태(Sticker, Form) 관련 모든 함수/이벤트는 로직 훅에서 관리합니다.
 */
export function WriteScreenView({ route, navigation }) {
    const scrollRef = useRef(null);
    const pageFlatListRef = useRef(null);
    const bottomSheetScrollRef = useRef(null);
    const stickerPackScrollRef = useRef(null);
    const categoryTabScrollRef = useRef(null);
    const categoryTabRefs = useRef({}); // 각 탭의 위치를 저장하기 위한 ref
    const isFirstStickerLoad = useRef(true);
    const windowWidth = Dimensions.get('window').width;
    const [activeCategoryId, setActiveCategoryId] = useState('');
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
        
        isTextLimitModalVisible,
        setTextLimitModalVisible,
        adBonusTexts,
        handleAdRewardForText,

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

        // 🔮 Mood Modal
        openMoodModal,
        handleMoodModalDismiss,
        handleMoodModalConfirm,
    } = useWriteLogic(route, navigation, scrollRef);

    // 🎨 현재 페이지의 배경색 동기화 (인디케이터 영역 포함)
    const currentBgId = pageBackgrounds[currentPageIndex] || 'default';
    const currentBgData = getBackgroundById(currentBgId);
    const dynamicCanvasColor = currentBgData.backgroundColor;

    // 💡 중앙 확인 버튼 색상: 오늘 선택한 기분 색상을 최우선으로, 없으면 주간 기분 색상 적용
    const weeklyMood = useGlobalWeeklyMood();
    const activeColor = activeMood ? activeMood.color : (weeklyMood ? weeklyMood.color : COLORS.soso);

    // ✏️ 텍스트 패널 — 프리셋만 (문구 입력 제거됨, 로직의 nextText* 상태 사용)

    // ─── 🚀 바텀시트 페이징 스크롤 자동 동기화 ───
    // 🚀 스티커팩 페이징 스크롤 동기화
    useEffect(() => {
        if (!showStickers) {
            isFirstStickerLoad.current = true;
            return;
        }
        if (!stickerPackScrollRef.current) return;

        const idx = visibleCategories.findIndex(cat => cat.id === activeCategoryId);
        if (idx !== -1) {
            // 처음 서랍이 열릴 때는 애니메이션 없이 위치만 잡고, 이후 전환 시에만 애니메이션 적용
            stickerPackScrollRef.current.scrollTo({
                x: idx * (windowWidth - 32),
                animated: !isFirstStickerLoad.current
            });
            isFirstStickerLoad.current = false;
        }
    }, [activeCategoryId, showStickers, windowWidth]);

    const prevBottomSheetOpen = useRef(false);
    useEffect(() => {
        const isOpen = showStickers || showPhotos || showTexts;
        if (!isOpen) {
            // 🚀 서랍이 닫힐 때 카테고리 상태와 스크롤 위치 초기화 기록
            if (prevBottomSheetOpen.current) {
                setActiveCategoryId('');
                isFirstStickerLoad.current = true;
            }
            prevBottomSheetOpen.current = false;
            return;
        }

        // 🚀 스티커 서랍이 처음 열릴 때, 순서상 가장 처음에 있는 카테고리를 즉시 선택
        if (showStickers && !prevBottomSheetOpen.current && visibleCategories.length > 0) {
            const firstCatId = visibleCategories[0].id;
            setActiveCategoryId(firstCatId);
            // Ref를 통해 즉시 스크롤 위치를 0으로 고정 (상태 업데이트보다 빠름)
            stickerPackScrollRef.current?.scrollTo({ x: 0, animated: false });
        }

        if (!bottomSheetScrollRef.current) return;

        let x = 0;
        if (showPhotos) x = windowWidth;
        else if (showTexts) x = windowWidth * 2;

        // 처음 열릴 때는 애니메이션 없이, 이미 열려있는 상태에서 탭 전환 시에만 애니메이션 적용
        bottomSheetScrollRef.current.scrollTo({ x, animated: prevBottomSheetOpen.current });
        prevBottomSheetOpen.current = true;
    }, [showStickers, showPhotos, showTexts, windowWidth]);

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
                    scrollEnabled={!isDraggingAny}
                >


                    {/* ─── 🌈 통합 다이어리 카드 영역 (캔버스 + 하단 메타) ─── */}
                    <View style={[styles.integratedDiaryCard, { backgroundColor: dynamicCanvasColor }, isDraggingAny]}>
                        {/* 멀티페이지 캔버스 영역 (가로 스와이프 + 엣지 풀 추가) */}
                        <View
                            style={[styles.pageContainer, isDraggingAny && { overflow: 'visible' }]}
                            pointerEvents="box-none"
                            onLayout={(e) => {
                                const w = e.nativeEvent.layout.width;
                                if (w > 0) setPageCardWidth(w);
                            }}
                        >
                            {pageCardWidth > 0 && (
                                <>
                                    {/* ─── 📊 카드 내부 인디케이터 (피드 스타일) 위로 분리 ─── */}
                                    <View style={[styles.cardIndicatorWrap, { backgroundColor: dynamicCanvasColor }]} pointerEvents="box-none">
                                        <View style={styles.cardIndicatorDots}>
                                            {pages.map((_, dotIdx) => (
                                                <View
                                                    key={`dot-${dotIdx}`}
                                                    style={dotIdx === currentPageIndex ? styles.pageDotActive : styles.pageDot}
                                                />
                                            ))}
                                        </View>
                                        <TouchableOpacity
                                            onPress={() => {
                                                handlePageDeleteTrigger(currentPageIndex, (nextIdx) => {
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

                                    <FlatList
                                        ref={pageFlatListRef}
                                        data={[...pages, '__ADD_PAGE__']}
                                        horizontal
                                        pagingEnabled={!isDraggingAny && !selectedItemId}
                                        showsHorizontalScrollIndicator={false}
                                        scrollEnabled={!isDraggingAny && !selectedItemId}
                                        disableIntervalMomentum={true}
                                        disableScrollViewPanResponder={true}
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
                                                                bounds={inputBoxBounds}
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
                                </>)}

                        </View>




                        {/* ─── 📊 피드 레이아웃의 하단 메타 정보 영역 ─── */}
                        <View style={styles.integratedDiaryMeta}>
                            {/* 🛠️ 좌측 도구 버튼 영역 (스티커, 카메라, 텍스트) */}
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                                <TouchableOpacity
                                    onPress={() => {
                                        Keyboard.dismiss();
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
                                        Keyboard.dismiss();
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
                                        Keyboard.dismiss();
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
                                onPress={openMoodModal}
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

            {/* ─── 🚀 공통 바텀바 적용 (이원화 해소 및 코드 통합) ─── */}
            <BottomBar
                mode="action"
                activeTab="none"
                navigation={navigation}
                onCenterPress={handleSave}
                selectedMoodColor={activeColor}
            />
            {/* ─── 🚀 닫기용 투명 오버레이 ─── */}
            {(showTexts || showPhotos || showStickers) && !isDraggingAny && (
                <Pressable
                    style={[StyleSheet.absoluteFill, { zIndex: 999 }]}
                    onPress={() => {
                        setShowStickers(false);
                        setShowPhotos(false);
                        setShowTexts(false);
                    }}
                />
            )}

            {/* ─── 🚀 플로팅 글래스 아일랜드 (Seamless Morphing Dock) ─── */}
            {(showTexts || showPhotos || showStickers) && (
                <View style={[styles.floatingDockContainer, {
                    paddingBottom: insets.bottom + 8,
                    height: 280 + insets.bottom,
                    zIndex: 1000,
                    opacity: isDraggingAny ? 0 : 1
                }]} pointerEvents={isDraggingAny ? 'none' : 'auto'}>
                    <BlurView intensity={75} tint="light" style={styles.floatingDockBlur} />

                    <View style={[styles.floatingDockContent, { paddingHorizontal: 0, paddingBottom: 0 }]}>
                        <View style={styles.bottomSheetHeader}>
                            <View style={styles.bottomSheetHandle} />

                            {/* 🚀 무빙 캡슐 (Morphing Pill) 타이틀 영역 */}
                            <View style={styles.pillNavContainer}>
                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    style={[styles.pillButton, showStickers && styles.pillButtonActiveSticker]}
                                    onPress={() => {
                                        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                                        setShowStickers(true); setShowPhotos(false); setShowTexts(false);
                                    }}
                                >
                                    <StickerIcon size={24} active={showStickers} />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    style={[styles.pillButton, showPhotos && styles.pillButtonActivePhoto]}
                                    onPress={() => {
                                        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                                        setShowStickers(false); setShowPhotos(true); setShowTexts(false);
                                    }}
                                >
                                    <CameraIcon size={24} color={showPhotos ? "#2D1E16" : "#8B7E74"} />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    style={[styles.pillButton, showTexts && styles.pillButtonActiveText]}
                                    onPress={() => {
                                        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                                        setShowStickers(false); setShowPhotos(false); setShowTexts(true);
                                    }}
                                >
                                    <TextIcon size={24} active={showTexts} color={showTexts ? "#2D1E16" : "#8B7E74"} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <ScrollView
                            ref={bottomSheetScrollRef}
                            horizontal
                            pagingEnabled
                            scrollEnabled={false}
                            showsHorizontalScrollIndicator={false}
                            keyboardShouldPersistTaps="always"
                            contentOffset={{ x: showPhotos ? windowWidth : (showTexts ? windowWidth * 2 : 0), y: 0 }}
                        >
                            {/* [Page 1] Stickers */}
                            <View style={{ width: windowWidth }}>
                                <View style={[styles.stickerBottomSheet, { paddingHorizontal: 16 }]}>
                                    <View style={styles.stickerBottomSheetHeader}>
                                        <ScrollView
                                            ref={categoryTabScrollRef}
                                            horizontal
                                            showsHorizontalScrollIndicator={false}
                                            style={styles.categoryTabBar}
                                            keyboardShouldPersistTaps="always"
                                        >
                                            {visibleCategories.map((cat) => (
                                                <TouchableOpacity
                                                    key={cat.id}
                                                    onLayout={(e) => {
                                                        categoryTabRefs.current[cat.id] = e.nativeEvent.layout.x;
                                                    }}
                                                    style={[styles.categoryTab, activeCategoryId === cat.id && styles.categoryTabActive]}
                                                    onPress={() => {
                                                        setActiveCategoryId(cat.id);
                                                        // 카테고리 탭 자동 스크롤
                                                        categoryTabScrollRef.current?.scrollTo({
                                                            x: Math.max(0, categoryTabRefs.current[cat.id] - 40),
                                                            animated: true
                                                        });
                                                    }}
                                                    activeOpacity={0.7}
                                                >
                                                    <Text style={[styles.categoryTabText, activeCategoryId === cat.id && styles.categoryTabTextActive]}>
                                                        {cat.label}
                                                    </Text>
                                                </TouchableOpacity>
                                            ))}
                                        </ScrollView>
                                        <TouchableOpacity style={styles.stickerManageBtnInside} onPress={() => setShowManager(true)} activeOpacity={0.7}>
                                            <SettingsTabIcon size={16} color="#999" />
                                        </TouchableOpacity>
                                    </View>

                                    <ScrollView
                                        ref={stickerPackScrollRef}
                                        horizontal
                                        pagingEnabled
                                        showsHorizontalScrollIndicator={false}
                                        contentOffset={{ x: 0, y: 0 }} // 🚀 항상 0점에서 시작하도록 강제
                                        onMomentumScrollEnd={(e) => {
                                            const idx = Math.round(e.nativeEvent.contentOffset.x / (windowWidth - 32));
                                            const cat = visibleCategories[idx];
                                            if (cat && cat.id !== activeCategoryId) {
                                                setActiveCategoryId(cat.id);
                                                // 탭 바도 동기화
                                                categoryTabScrollRef.current?.scrollTo({
                                                    x: Math.max(0, categoryTabRefs.current[cat.id] - 40),
                                                    animated: true
                                                });
                                            }
                                        }}
                                    >
                                        {visibleCategories.map((cat) => {
                                            const catStickers = CATEGORIZED_STICKERS[cat.id] ?? [];
                                            const isEmoji = cat.id === 'emoji';
                                            return (
                                                <View key={cat.id} style={[styles.stickerRow, { width: windowWidth - 32, height: 140, flexWrap: 'wrap' }]}>
                                                    {isEmoji
                                                        ? catStickers.map((emoji, idx) => (
                                                            <AnimatedStickerItem key={`emoji-${idx}`} onPress={() => handleStickerPress(emoji, false)}>
                                                                <Text style={styles.stickerItemEmoji}>{emoji}</Text>
                                                            </AnimatedStickerItem>
                                                        ))
                                                        : catStickers.map((item) => (
                                                            <AnimatedStickerItem key={item.key} onPress={() => handleStickerPress(item.key, true)}>
                                                                <item.Component size={28} />
                                                            </AnimatedStickerItem>
                                                        ))
                                                    }
                                                </View>
                                            );
                                        })}
                                    </ScrollView>
                                </View>
                            </View>

                            {/* [Page 2] Photos */}
                            <View style={{ width: windowWidth, paddingHorizontal: 16 }}>
                                <View style={styles.stickerBottomSheet}>
                                    <View style={styles.stickerBottomSheetHeader}>
                                        <View style={styles.categoryTabBar}>
                                            <TouchableOpacity style={[styles.categoryTab, styles.categoryTabActive]} activeOpacity={1}>
                                                <Text style={[styles.categoryTabText, styles.categoryTabTextActive]}>프레임</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.photoFrameContainer}>
                                        <TouchableOpacity style={styles.frameOptionBtn} onPress={() => handleAddPhoto('white')} activeOpacity={0.7}>
                                            <View style={[styles.framePreview, styles.framePreviewWhite]}><View style={styles.frameInnerPhoto} /></View>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.frameOptionBtn} onPress={() => handleAddPhoto('black')} activeOpacity={0.7}>
                                            <View style={[styles.framePreview, styles.framePreviewBlack]}><View style={[styles.frameInnerPhoto, { backgroundColor: 'rgba(255,255,255,0.1)' }]} /></View>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.frameOptionBtn} onPress={() => handleAddPhoto('gray')} activeOpacity={0.7}>
                                            <View style={[styles.framePreview, styles.framePreviewGray]}><View style={styles.frameInnerPhoto} /></View>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.frameOptionBtn} onPress={() => isPremium ? handleAddPhoto('pink') : Alert.alert('프리미엄 전용 💎', '파스텔 프레임은 프리미엄 회원만 사용할 수 있어요.')} activeOpacity={0.7}>
                                            <View style={[styles.framePreview, styles.framePreviewPink, !isPremium && { opacity: 0.8 }]}><View style={styles.frameInnerPhoto} />{!isPremium && <View style={styles.premiumTag}><Text style={{ fontSize: 8 }}>✨</Text></View>}</View>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.frameOptionBtn} onPress={() => isPremium ? handleAddPhoto('blue') : Alert.alert('프리미엄 전용 💎', '파스텔 프레임은 프리미엄 회원만 사용할 수 있어요.')} activeOpacity={0.7}>
                                            <View style={[styles.framePreview, styles.framePreviewBlue, !isPremium && { opacity: 0.8 }]}><View style={styles.frameInnerPhoto} />{!isPremium && <View style={styles.premiumTag}><Text style={{ fontSize: 8 }}>✨</Text></View>}</View>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.frameOptionBtn} onPress={() => isPremium ? handleAddPhoto('mint') : Alert.alert('프리미엄 전용 💎', '파스텔 프레임은 프리미엄 회원만 사용할 수 있어요.')} activeOpacity={0.7}>
                                            <View style={[styles.framePreview, styles.framePreviewMint, !isPremium && { opacity: 0.8 }]}><View style={styles.frameInnerPhoto} />{!isPremium && <View style={styles.premiumTag}><Text style={{ fontSize: 8 }}>✨</Text></View>}</View>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.frameOptionBtn} onPress={() => isPremium ? handleAddPhoto('mocha') : Alert.alert('프리미엄 전용 💎', '모카 무스 프레임은 프리미엄 회원만 사용할 수 있어요.')} activeOpacity={0.7}>
                                            <View style={[styles.framePreview, styles.framePreviewMocha, !isPremium && { opacity: 0.8 }]}><View style={styles.frameInnerPhoto} />{!isPremium && <View style={styles.premiumTag}><Text style={{ fontSize: 8 }}>✨</Text></View>}</View>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.frameOptionBtn} onPress={() => isPremium ? handleAddPhoto('lavender') : Alert.alert('프리미엄 전용 💎', '라벤더 팝 프레임은 프리미엄 회원만 사용할 수 있어요.')} activeOpacity={0.7}>
                                            <View style={[styles.framePreview, styles.framePreviewLavender, !isPremium && { opacity: 0.8 }]}><View style={styles.frameInnerPhoto} />{!isPremium && <View style={styles.premiumTag}><Text style={{ fontSize: 8 }}>✨</Text></View>}</View>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.frameOptionBtn} onPress={() => isPremium ? handleAddPhoto('lime') : Alert.alert('프리미엄 전용 💎', '라임 크림 프레임은 프리미엄 회원만 사용할 수 있어요.')} activeOpacity={0.7}>
                                            <View style={[styles.framePreview, styles.framePreviewLime, !isPremium && { opacity: 0.8 }]}><View style={styles.frameInnerPhoto} />{!isPremium && <View style={styles.premiumTag}><Text style={{ fontSize: 8 }}>✨</Text></View>}</View>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.frameOptionBtn} onPress={() => isPremium ? handleAddPhoto('vintage_cream') : Alert.alert('프리미엄 전용 💎', '빈티지 크림 프레임은 프리미엄 회원만 사용할 수 있어요.')} activeOpacity={0.7}>
                                            <View style={[styles.framePreview, styles.framePreviewVintageCream, !isPremium && { opacity: 0.8 }]}><View style={styles.frameInnerPhoto} />{!isPremium && <View style={styles.premiumTag}><Text style={{ fontSize: 8 }}>✨</Text></View>}</View>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.frameOptionBtn} onPress={() => isPremium ? handleAddPhoto('soda_blue') : Alert.alert('프리미엄 전용 💎', '소다 블루 프레임은 프리미엄 회원만 사용할 수 있어요.')} activeOpacity={0.7}>
                                            <View style={[styles.framePreview, styles.framePreviewSodaBlue, !isPremium && { opacity: 0.8 }]}><View style={styles.frameInnerPhoto} />{!isPremium && <View style={styles.premiumTag}><Text style={{ fontSize: 8 }}>✨</Text></View>}</View>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.frameOptionBtn} onPress={() => isPremium ? handleAddPhoto('butter_yellow') : Alert.alert('프리미엄 전용 💎', '버터 옐로우 프레임은 프리미엄 회원만 사용할 수 있어요.')} activeOpacity={0.7}>
                                            <View style={[styles.framePreview, styles.framePreviewButterYellow, !isPremium && { opacity: 0.8 }]}><View style={styles.frameInnerPhoto} />{!isPremium && <View style={styles.premiumTag}><Text style={{ fontSize: 8 }}>✨</Text></View>}</View>
                                        </TouchableOpacity>
                                    </ScrollView>
                                </View>
                            </View>

                            {/* [Page 3] Text Styles */}
                            <View style={{ width: windowWidth, paddingHorizontal: 16 }}>
                                <View style={[styles.textDrawerWrap, { backgroundColor: 'transparent' }]}>
                                    <View style={styles.colorScrollWrap}>
                                        <View style={styles.colorRowsContainer}>
                                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.colorScrollContent}>
                                                <View style={styles.colorRow}>
                                                    {TEXT_COLORS.map(color => (
                                                        <TouchableOpacity key={`txt-${color}`} style={[styles.colorBtn, { backgroundColor: color }, nextTextColor === color && styles.colorBtnActive]} onPress={() => setNextTextColor(color)} activeOpacity={0.8}>
                                                            {nextTextColor === color && <CheckIcon size={20} color={color === '#FFFFFF' || color === 'transparent' ? '#37352F' : '#FFF'} />}
                                                        </TouchableOpacity>
                                                    ))}
                                                </View>
                                            </ScrollView>
                                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.colorScrollContent}>
                                                <View style={styles.colorRow}>
                                                    {HIGHLIGHTER_COLORS.map((color, idx) => {
                                                        const isSelected = nextTextBgColor === color;
                                                        const displayColor = color === 'transparent' ? '#FFF' : color;
                                                        return (
                                                            <TouchableOpacity key={`bg-${idx}`} style={[styles.colorBtn, { backgroundColor: displayColor }, isSelected && styles.colorBtnActive]} onPress={() => setNextTextBgColor(color)} activeOpacity={0.8}>
                                                                {color === 'transparent' && <View style={styles.transparentSlash} />}
                                                                {isSelected && <View style={styles.checkIconOverlay}><CheckIcon size={20} color="#37352F" /></View>}
                                                            </TouchableOpacity>
                                                        );
                                                    })}
                                                </View>
                                            </ScrollView>
                                        </View>
                                    </View>
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
                                                <TouchableOpacity key={font.id} style={[styles.fontGridItem, isActive && styles.fontGridItemActive]} onPress={() => isLocked ? (setAlertConfig({ title: '프리미엄 전용 폰트 ✨', message: '다양한 폰트는 프리미엄 버전에서\n무제한으로 사용할 수 있어요!' }), setShowAlert(true)) : setNextTextFont(font.id)} activeOpacity={0.8}>
                                                    <Text style={[styles.fontGridItemText, isActive && styles.fontGridItemTextActive, previewStyle, isLocked && { opacity: 0.6 }]}>{font.label}</Text>
                                                    {isLocked && <View style={styles.premiumTag}><Text style={{ fontSize: 8 }}>✨</Text></View>}
                                                </TouchableOpacity>
                                            );
                                        })}
                                    </View>
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            )}


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
                    const baseLimit = SYSTEM_LIMITS.FREE_TIER.MAX_STICKERS + adBonusStickers;
                    const effectiveLimit = Math.max(baseLimit, currentPageStickers);

                    if (isPremium || effectiveLimit >= SYSTEM_LIMITS.PREMIUM_TIER.MAX_STICKERS) {
                        return `이 페이지에 스티커는 최대 ${SYSTEM_LIMITS.PREMIUM_TIER.MAX_STICKERS}개까지만 붙일 수 있어요! (현재 ${currentPageStickers}개 부착) ✨`;
                    }
                    return `무료 버전에서는 이 페이지에 스티커를 ${effectiveLimit}개까지만 붙일 수 있어요! (현재 ${currentPageStickers}개 부착)`;
                })()}
                onConfirm={() => setStickerLimitModalVisible(false)}
                secondaryText={(!isPremium && (SYSTEM_LIMITS.FREE_TIER.MAX_STICKERS + adBonusStickers) < SYSTEM_LIMITS.PREMIUM_TIER.MAX_STICKERS) ? "광고 보고 2개 더 붙이기 📺" : null}
                onSecondaryConfirm={handleAdReward}
            />

            {/* 🛑 텍스트 박스 제한 알림 모달 */}
            <SoftAlertModal
                isVisible={isTextLimitModalVisible}
                title="텍스트 박스 제한 안내 ✏️"
                message={(() => {
                    const currentPageTexts = pageTexts[currentPageIndex]?.length || 0;
                    const baseLimit = SYSTEM_LIMITS.FREE_TIER.MAX_TEXTS + adBonusTexts;
                    const effectiveLimit = Math.max(baseLimit, currentPageTexts);

                    if (isPremium || effectiveLimit >= SYSTEM_LIMITS.PREMIUM_TIER.MAX_TEXTS) {
                        return `이 페이지에 텍스트 박스는 최대 ${SYSTEM_LIMITS.PREMIUM_TIER.MAX_TEXTS}개까지만 넣을 수 있어요! (현재 ${currentPageTexts}개 부착) ✨`;
                    }
                    return `무료 버전에서는 이 페이지에 텍스트 박스를 ${effectiveLimit}개까지만 넣을 수 있어요! (현재 ${currentPageTexts}개 부착)`;
                })()}
                onConfirm={() => setTextLimitModalVisible(false)}
                secondaryText={(!isPremium && (SYSTEM_LIMITS.FREE_TIER.MAX_TEXTS + adBonusTexts) < SYSTEM_LIMITS.PREMIUM_TIER.MAX_TEXTS) ? "광고 보고 2개 더 붙이기 📺" : null}
                onSecondaryConfirm={handleAdRewardForText}
            />

            {/* 🛑 공통 알림 모달 */}
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
                onBackdropPress={handleMoodModalDismiss}
                onSwipeComplete={handleMoodModalDismiss}
                onBackButtonPress={handleMoodModalDismiss}
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
                            onPress={handleMoodModalConfirm}
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

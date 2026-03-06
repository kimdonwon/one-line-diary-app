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
    { id: 'basic', label: '단정 고딕' },
    { id: 'diary', label: '감성 명조' },
    { id: 'hand', label: '삐뚤빼뚤' },
    { id: 'y2k', label: '도트체' },
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
    const [photoFrameTab, setPhotoFrameTab] = useState('polaroid'); // 'polaroid' | 'transparent'

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
    } = useWriteLogic(route, navigation, scrollRef);

    // ✏️ 텍스트 패널 로컬 상태
    const [tempTextValue, setTempTextValue] = useState('');
    const [selectedFont, setSelectedFont] = useState('basic');
    const [selectedTextColor, setSelectedTextColor] = useState('#37352F');
    const [selectedBgColor, setSelectedBgColor] = useState('transparent');

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
    const hasNudgedRef = useRef(false); // 최초 1회 실행 여부

    // 💡 화면 진입 시 페이지를 추가할 수 있음을 알려주는 '넛지' 효과 (최초 1회)
    useEffect(() => {
        if (pageCardWidth > 0 && !hasNudgedRef.current) {
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
                        hasNudgedRef.current = true;
                    }, 400);
                }
            }, 600);
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

                    <Text style={styles.sectionTitle}>다이어리</Text>

                    {/* ─── 멀티페이지 입력 영역 (가로 스와이프 + 엣지 풀 추가) ─── */}
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
                                data={[...pages, '__ADD_PAGE__']}
                                horizontal
                                pagingEnabled
                                showsHorizontalScrollIndicator={false}
                                scrollEnabled={!isInteracting}
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
                                        <Card style={[styles.inputCard, { width: pageCardWidth, backgroundColor: bgData.backgroundColor }]}>
                                            {/* [층0] 📝 빈 공간 롱탭 전용 배경 (텍스트 생성용) */}
                                            <Pressable
                                                style={StyleSheet.absoluteFill}
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
                                                        <Text style={styles.canvasGuideEmoji}>✏️</Text>
                                                        <Text style={styles.canvasGuideText}>
                                                            화면을 꾹 눌러서 일기를 써보세요
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
                                                    />
                                                ))}
                                            </View>
                                        </Card>
                                    );
                                }}
                            />
                        )}

                    </View>

                    {/* ─── 📱 툴바 (Toggle & Floating Tools) ─── */}
                    <View style={styles.floatingToolbar}>
                        {/* 🎞️ 필름 토글 (아이폰 제어센터 스위치) */}
                        <View style={styles.pillToggleContainer}>
                            <TouchableOpacity
                                style={[styles.pillSegment, showStickers && styles.pillSegmentActive]}
                                onPress={() => {
                                    setShowStickers(!showStickers);
                                    setShowPhotos(false);
                                    setShowBackgrounds(false);
                                    setShowTexts(false);
                                }}
                                activeOpacity={0.8}
                            >
                                <StickerIcon size={32} active={showStickers} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.pillSegment, showPhotos && styles.pillSegmentActive]}
                                onPress={() => {
                                    setShowPhotos(!showPhotos);
                                    setShowStickers(false);
                                    setShowBackgrounds(false);
                                    setShowTexts(false);
                                }}
                                activeOpacity={0.8}
                            >
                                <CameraIcon size={28} color={showPhotos ? "#37352F" : "#83837F"} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.pillSegment, showTexts && styles.pillSegmentActive]}
                                onPress={() => {
                                    setShowTexts(!showTexts);
                                    setShowStickers(false);
                                    setShowPhotos(false);
                                    setShowBackgrounds(false);
                                }}
                                activeOpacity={0.8}
                            >
                                <TextIcon size={28} active={showTexts} color={showTexts ? "#37352F" : "#83837F"} />
                            </TouchableOpacity>
                        </View>

                        {/* 🪄 다꾸 가챠 */}
                        <TouchableOpacity
                            style={styles.floatingToolBtn}
                            onPress={handleMagicDecorate}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.floatingToolEmoji}>🪄</Text>
                        </TouchableOpacity>

                    </View>

                    {/* ─── 🗂 ✏️ 텍스트 추가 바텀시트 ─── */}
                    {showTexts && (
                        <View style={styles.stickerBottomSheet}>
                            <View style={styles.textDrawerWrap}>
                                <View style={styles.textInputRow}>
                                    <TextInput
                                        style={styles.textCustomInput}
                                        placeholder="어떤 문구를 넣을까요?"
                                        placeholderTextColor="#83837F"
                                        value={tempTextValue}
                                        onChangeText={setTempTextValue}
                                        maxLength={60} // 글자 수도 좀 더 여유 있게
                                        multiline={true}
                                        numberOfLines={2}
                                    />
                                    <TouchableOpacity
                                        style={styles.textAddBtn}
                                        onPress={() => {
                                            if (!tempTextValue) return;
                                            handleAddText(tempTextValue, selectedFont, selectedTextColor, selectedBgColor);
                                            setTempTextValue('');
                                        }}
                                        activeOpacity={0.8}
                                    >
                                        <Text style={styles.textAddBtnText}>추가</Text>
                                    </TouchableOpacity>
                                </View>

                                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetRow}>
                                    <Text style={[styles.textSectionTitle, { marginRight: 10 }]}>폰트</Text>
                                    {FONT_PRESETS.map(font => {
                                        // 현재 폰트 스타일 미리보기용 스타일 계산
                                        const previewStyle = {};
                                        if (font.id === 'basic') {
                                            previewStyle.fontFamily = 'GowunDodum_400Regular';
                                        } else if (font.id === 'diary') {
                                            previewStyle.fontFamily = 'NanumMyeongjo_400Regular';
                                            previewStyle.fontSize = 15;
                                        } else if (font.id === 'hand') {
                                            previewStyle.fontFamily = 'SingleDay_400Regular';
                                            previewStyle.fontSize = 18;
                                        } else if (font.id === 'y2k') {
                                            previewStyle.fontFamily = 'NanumPenScript_400Regular';
                                            previewStyle.fontSize = 18;
                                        }

                                        return (
                                            <TouchableOpacity
                                                key={font.id}
                                                style={[styles.presetBtn, selectedFont === font.id && styles.presetBtnActive]}
                                                onPress={() => setSelectedFont(font.id)}
                                                activeOpacity={0.8}
                                            >
                                                <Text style={[styles.presetBtnText, previewStyle]}>{font.label}</Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </ScrollView>

                                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetRow} contentContainerStyle={{ alignItems: 'center' }}>
                                    <Text style={[styles.textSectionTitle, { marginRight: 10, marginBottom: 0, marginTop: 0 }]}>색상</Text>
                                    {TEXT_COLORS.map(color => (
                                        <TouchableOpacity
                                            key={`txt-${color}`}
                                            style={[styles.colorBtn, { backgroundColor: color }, selectedTextColor === color && styles.colorBtnActive]}
                                            onPress={() => setSelectedTextColor(color)}
                                        />
                                    ))}
                                    <View style={{ width: 1, backgroundColor: '#E9E9E7', height: 20, marginHorizontal: 8 }} />
                                    {HIGHLIGHTER_COLORS.map((color, idx) => (
                                        <TouchableOpacity
                                            key={`bg-${idx}`}
                                            style={[styles.colorBtn, { backgroundColor: color === 'transparent' ? '#FFF' : color }, selectedBgColor === color && styles.colorBtnActive]}
                                            onPress={() => setSelectedBgColor(color)}
                                        >
                                            {color === 'transparent' && <Text style={{ color: '#E9E9E7', fontSize: 10 }}>✕</Text>}
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>
                        </View>
                    )}

                    {/* ─── 🗂 📷 사진 프레임 바텀시트 (Bottom Sheet) ─── */}
                    {showPhotos && (
                        <View style={styles.stickerBottomSheet}>
                            {/* 바텀시트 상단 헤더 (탭 전환: 폴라로이드 색상 / 반투명 프레임) */}
                            <View style={styles.stickerBottomSheetHeader}>
                                <View style={styles.categoryTabBar}>
                                    <TouchableOpacity
                                        style={[styles.categoryTab, photoFrameTab === 'polaroid' && styles.categoryTabActive]}
                                        onPress={() => setPhotoFrameTab('polaroid')}
                                        activeOpacity={0.7}
                                    >
                                        <Text style={[styles.categoryTabText, photoFrameTab === 'polaroid' && styles.categoryTabTextActive]}>폴라로이드 색상</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.categoryTab, photoFrameTab === 'transparent' && styles.categoryTabActive]}
                                        onPress={() => setPhotoFrameTab('transparent')}
                                        activeOpacity={0.7}
                                    >
                                        <Text style={[styles.categoryTabText, photoFrameTab === 'transparent' && styles.categoryTabTextActive]}>반투명 프레임</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* ── 폴라로이드 색상 탭 ── */}
                            {photoFrameTab === 'polaroid' && (
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
                                        onPress={() => {
                                            if (isPremium) {
                                                handleAddPhoto('pink');
                                            } else {
                                                Alert.alert('프리미엄 전용 💎', '파스텔 프레임은 프리미엄 회원만 사용할 수 있어요.');
                                            }
                                        }}
                                        activeOpacity={0.7}
                                    >
                                        <View style={[styles.framePreview, styles.framePreviewPink]}>
                                            <View style={styles.frameInnerPhoto} />
                                            {!isPremium && <View style={styles.lockOverlay}><Text style={{ fontSize: 10 }}>🔒</Text></View>}
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
                                        <View style={[styles.framePreview, styles.framePreviewBlue]}>
                                            <View style={styles.frameInnerPhoto} />
                                            {!isPremium && <View style={styles.lockOverlay}><Text style={{ fontSize: 10 }}>🔒</Text></View>}
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
                                        <View style={[styles.framePreview, styles.framePreviewMint]}>
                                            <View style={styles.frameInnerPhoto} />
                                            {!isPremium && <View style={styles.lockOverlay}><Text style={{ fontSize: 10 }}>🔒</Text></View>}
                                        </View>
                                    </TouchableOpacity>
                                </ScrollView>
                            )}

                            {/* ── 반투명 프레임 탭 ── */}
                            {photoFrameTab === 'transparent' && (
                                <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={styles.photoFrameContainer}
                                >
                                    <TouchableOpacity
                                        style={styles.frameOptionBtn}
                                        onPress={() => handleAddPhoto('transparent_white')}
                                        activeOpacity={0.7}
                                    >
                                        <View style={[styles.framePreview, styles.framePreviewTransparentWhite]}>
                                            <View style={styles.frameInnerPhoto} />
                                            <View style={styles.transparentBadge}>
                                                <Text style={styles.transparentBadgeText}>반투명</Text>
                                            </View>
                                        </View>
                                        <Text style={styles.frameOptionLabel}>흰색</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.frameOptionBtn}
                                        onPress={() => handleAddPhoto('transparent_gray')}
                                        activeOpacity={0.7}
                                    >
                                        <View style={[styles.framePreview, styles.framePreviewTransparentGray]}>
                                            <View style={styles.frameInnerPhoto} />
                                            <View style={styles.transparentBadge}>
                                                <Text style={styles.transparentBadgeText}>반투명</Text>
                                            </View>
                                        </View>
                                        <Text style={styles.frameOptionLabel}>회색</Text>
                                    </TouchableOpacity>
                                </ScrollView>
                            )}
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

            <SoftAlertModal
                isVisible={showAlert}
                title={alertConfig.title}
                message={alertConfig.message}
                confirmText={alertConfig.confirmText || "확인"}
                onConfirm={alertConfig.onConfirm || (() => setShowAlert(false))}
                secondaryText={alertConfig.secondaryText}
                onSecondaryConfirm={alertConfig.onSecondaryConfirm}
            />
        </View >
    );
}

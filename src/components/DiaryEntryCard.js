/**
 * 📄 공통 일기 카드 컴포넌트 (멀티페이지 지원)
 * - DiaryFeedScreen, MoodListScreen, ActivityListScreen에서 재사용
 * - 멀티페이지 일기의 경우 인스타그램 스타일 가로 스와이프 + 도트 인디케이터 제공
 */

import React, { useState, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Dimensions } from 'react-native';

import { COLORS, SPACING, SOFT_SHADOW } from '../constants/theme';
import { StaticSticker, ComboShakeMoodCharacter } from '../components';
import { MessageCircleIcon } from '../constants/icons';
import { ActivityIcon } from '../constants/ActivityIcons';
import { getMoodByKey } from '../constants/mood';

/**
 * content/stickers를 멀티페이지 형태로 파싱하는 유틸
 */
function parseMultiPageData(rawContent, rawStickers) {
    let pages = [''];
    let stickersPerPage = [[]];

    // ── content 파싱 ──
    try {
        const parsed = JSON.parse(rawContent);
        if (Array.isArray(parsed)) {
            pages = parsed;
        } else {
            pages = [rawContent || ''];
        }
    } catch (e) {
        pages = [rawContent || ''];
    }

    // ── stickers 파싱 ──
    try {
        const raw = JSON.parse(rawStickers || '[]');
        if (Array.isArray(raw) && raw.length > 0) {
            if (Array.isArray(raw[0])) {
                stickersPerPage = raw; // 이미 2차원 (멀티페이지)
            } else {
                stickersPerPage = [raw]; // 레거시 1차원
            }
        }
    } catch (e) {
        stickersPerPage = [[]];
    }

    // 페이지 수에 맞춰 빈 스티커 배열 패딩
    while (stickersPerPage.length < pages.length) {
        stickersPerPage.push([]);
    }

    return { pages, stickersPerPage, isMultiPage: pages.length > 1 };
}

/**
 * 단일 페이지 렌더링 컴포넌트
 */
const SinglePageContent = React.memo(({ content, stickers, cardWidth }) => (
    <View style={[cardStyles.diaryCardInner, cardWidth ? { width: cardWidth } : null]}>
        {/* 스티커 오버레이 */}
        <View style={cardStyles.stickerOverlay} pointerEvents="none">
            {stickers.map((sticker, idx) => (
                <StaticSticker
                    key={`sticker-${idx}`}
                    sticker={sticker}
                    bounds={{ width: cardWidth || 300 }}
                />
            ))}
        </View>

        {/* 텍스트 */}
        <Text style={cardStyles.diaryContent}>{content}</Text>
    </View>
));

export const DiaryEntryCard = React.memo(({ diary, activities = [], commentCount = 0, onOpenComment, onPress }) => {
    const mood = getMoodByKey(diary.mood);
    const { pages, stickersPerPage, isMultiPage } = parseMultiPageData(diary.content, diary.stickers);

    const [activePageIndex, setActivePageIndex] = useState(0);
    const [cardWidth, setCardWidth] = useState(0);

    // 카드 너비 측정
    const onCardLayout = useCallback((e) => {
        setCardWidth(e.nativeEvent.layout.width);
    }, []);

    // 스크롤 시 현재 페이지 인덱스 계산
    const onMomentumScrollEnd = useCallback((e) => {
        if (cardWidth > 0) {
            const idx = Math.round(e.nativeEvent.contentOffset.x / cardWidth);
            setActivePageIndex(idx);
        }
    }, [cardWidth]);

    // 날짜 포맷
    const d = new Date(diary.date);
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const dateStr = `${month}월 ${day}일`;

    const renderPageItem = useCallback(({ item, index }) => (
        <SinglePageContent
            content={item}
            stickers={stickersPerPage[index] || []}
            cardWidth={cardWidth}
        />
    ), [stickersPerPage, cardWidth]);

    const pageKeyExtractor = useCallback((_, index) => `page-${index}`, []);

    return (
        <View
            style={cardStyles.diaryCard}
            onLayout={onCardLayout}
        >
            {/* 일기 본문 영역 */}
            {isMultiPage && cardWidth > 0 ? (
                <View>
                    <FlatList
                        data={pages}
                        renderItem={renderPageItem}
                        keyExtractor={pageKeyExtractor}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onMomentumScrollEnd={onMomentumScrollEnd}
                        nestedScrollEnabled
                        getItemLayout={(_, index) => ({
                            length: cardWidth,
                            offset: cardWidth * index,
                            index,
                        })}
                    />
                    {/* 페이지 인디케이터 (Dots) */}
                    <View style={cardStyles.pageIndicatorWrap}>
                        {pages.map((_, idx) => (
                            <View
                                key={`dot-${idx}`}
                                style={idx === activePageIndex ? cardStyles.pageDotActive : cardStyles.pageDot}
                            />
                        ))}
                    </View>
                </View>
            ) : (
                <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
                    <SinglePageContent
                        content={pages[0]}
                        stickers={stickersPerPage[0] || []}
                        cardWidth={cardWidth || undefined}
                    />
                </TouchableOpacity>
            )}

            {/* 하단 메타 정보 */}
            <TouchableOpacity
                style={cardStyles.diaryMeta}
                onPress={onPress}
                activeOpacity={0.9}
            >
                <View style={cardStyles.diaryMetaLeft}>
                    <Text style={cardStyles.diaryDateText}>{dateStr}</Text>
                </View>

                <View style={cardStyles.diaryMetaRight}>
                    {/* 활동 아이콘 */}
                    <View style={cardStyles.diaryActivitiesWrap}>
                        {activities.map((act, idx) => (
                            <View key={`act-${idx}`} style={cardStyles.diaryActivityIcon}>
                                <ActivityIcon type={act.activity} size={16} />
                            </View>
                        ))}
                    </View>

                    {/* 댓글 버튼 (있을 때만) */}
                    {onOpenComment && (
                        <TouchableOpacity
                            style={cardStyles.commentButton}
                            activeOpacity={0.7}
                            onPress={() => onOpenComment(diary)}
                        >
                            <MessageCircleIcon size={16} color="#666666" />
                            <Text style={cardStyles.commentButtonText}>{commentCount}</Text>
                        </TouchableOpacity>
                    )}

                    <View style={cardStyles.diaryMoodWrap}>
                        <ComboShakeMoodCharacter character={mood.character} size={36} />
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
});

export const cardStyles = StyleSheet.create({
    diaryCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E9E9E7',
        marginBottom: SPACING.lg,
        overflow: 'hidden',
        ...SOFT_SHADOW.card,
    },
    diaryCardInner: {
        padding: SPACING.md,
        minHeight: 340,
    },
    diaryContent: {
        fontSize: 14,
        fontWeight: '500',
        color: COLORS.text,
        lineHeight: 20,
    },
    stickerOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 5,
    },

    // ── 멀티페이지 인디케이터 ──
    pageIndicatorWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        gap: 6,
    },
    pageDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#D9D9D6',
    },
    pageDotActive: {
        width: 16,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#37352F',
    },

    diaryMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.md,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: '#F1F1F0',
        backgroundColor: '#FCFCFC',
    },
    diaryDateText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#666666',
        letterSpacing: 0.3,
    },
    diaryMetaLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    diaryActivitiesWrap: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
        marginHorizontal: 8,
        maxWidth: 110,
    },
    diaryActivityIcon: {
        margin: 2,
    },
    diaryMoodWrap: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    diaryMetaRight: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    commentButton: {
        backgroundColor: '#F1F1F0',
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 12,
    },
    commentButtonText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#666666',
        marginLeft: 6,
    },
});

/**
 * 📖 DiaryFeedScreen - 인스타 피드 스타일 다이어리 뷰
 *
 * 특징:
 * - 선택된 연/월의 일기만 표시
 * - 연/월 선택 피커 (subtitle 터치)
 * - 최신 일기가 아래에, 위로 올릴수록 예전 일기
 * - 일기 입력 박스와 동일한 크기 + 스티커 표시
 */

import React, { useRef, useCallback, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Animated, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import Modal from 'react-native-modal';

import { COLORS } from '../../constants/theme';
import { Header, StaticSticker, ComboShakeMoodCharacter } from '../../components';
import { DiaryEntryCard } from '../../components/DiaryEntryCard';
import { MessageCircleIcon, XIcon } from '../../constants/icons';
import { ActivityIcon } from '../../constants/ActivityIcons';
import { MoodCharacter } from '../../constants/MoodCharacters';
import { getMoodByKey } from '../../constants/mood';

import { useDiaryFeedLogic } from './DiaryFeedScreen.logic';
import { styles } from './DiaryFeedScreen.styles';



/**
 * 💬 개별 댓글 아이템 (길게 눌렀을 때 삭제 버튼 표시)
 */
const CommentItem = React.memo(({ item, onDelete }) => {
    const [showDelete, setShowDelete] = useState(false);
    const deleteOp = useRef(new Animated.Value(0)).current;

    const cDate = new Date(item.created_at);
    const fDate = `${cDate.getMonth() + 1}월 ${cDate.getDate()}일`;

    const handleLongPress = () => {
        setShowDelete(true);
        Animated.timing(deleteOp, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
        }).start();

        // 3초 뒤에 삭제 버튼 숨기기
        setTimeout(() => {
            Animated.timing(deleteOp, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }).start(() => setShowDelete(false));
        }, 3000);
    };

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onLongPress={handleLongPress}
            delayLongPress={300}
            style={styles.commentItem}
        >
            <View>
                <Text style={styles.commentDateText}>{fDate}</Text>
                <Text style={styles.commentText}>{item.content}</Text>
            </View>

            {showDelete && (
                <Animated.View style={[styles.deleteCommentBtn, { opacity: deleteOp }]}>
                    <TouchableOpacity onPress={() => onDelete(item.id)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                        <XIcon size={16} color="#FF6B6B" />
                    </TouchableOpacity>
                </Animated.View>
            )}
        </TouchableOpacity>
    );
});

/**
 * 📅 연/월 피커 컴포넌트
 */
const MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const YearMonthPicker = React.memo(({ selectedYear, selectedMonth, onSelect, onClose }) => {
    const [tempYear, setTempYear] = useState(selectedYear);

    return (
        <View style={styles.pickerContent}>
            {/* 연도 선택 헤더 */}
            <View style={styles.pickerYearRow}>
                <TouchableOpacity onPress={() => setTempYear(y => y - 1)} activeOpacity={0.6} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <Text style={styles.pickerArrow}>‹</Text>
                </TouchableOpacity>
                <Text style={styles.pickerYearText}>{tempYear}년</Text>
                <TouchableOpacity onPress={() => setTempYear(y => y + 1)} activeOpacity={0.6} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <Text style={styles.pickerArrow}>›</Text>
                </TouchableOpacity>
            </View>

            {/* 월 그리드 (3x4) */}
            <View style={styles.pickerMonthGrid}>
                {MONTHS.map(month => {
                    const isSelected = tempYear === selectedYear && month === selectedMonth;
                    return (
                        <TouchableOpacity
                            key={month}
                            style={[styles.pickerMonthCell, isSelected && styles.pickerMonthCellActive]}
                            onPress={() => onSelect(tempYear, month)}
                            activeOpacity={0.7}
                        >
                            <Text style={[styles.pickerMonthText, isSelected && styles.pickerMonthTextActive]}>
                                {month}월
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
});

export function DiaryFeedScreenView({ navigation }) {
    const {
        selectedYear,
        selectedMonth,
        isYearMonthPickerVisible,
        diaries,
        loading,
        activitiesMap,
        commentCounts,
        isCommentModalVisible,
        selectedDiary,
        comments,
        commentText,
        isKeyboardVisible,
        setCommentText,
        openYearMonthPicker,
        closeYearMonthPicker,
        changeYearMonth,
        goToPrevMonth,
        goToNextMonth,
        openCommentModal,
        closeCommentModal,
        submitComment,
        handleDeleteComment,
        handleNavigateToWrite
    } = useDiaryFeedLogic(navigation);

    const flatListRef = useRef(null);
    const hasInitialScrolled = useRef(false);
    const prevYearMonthRef = useRef(`${selectedYear}-${selectedMonth}`);

    // 각 카드의 대략적인 높이를 계산하여 스크롤 성능 향상 (뚝뚝 끊김 방지)
    const getItemLayout = useCallback((data, index) => ({
        length: 925, // diaryCardInner(340) + diaryMeta(65) + marginBottom(20) 대략적인 합산
        offset: 425 * index,
        index,
    }), []);

    // 연/월이 바뀌면 스크롤 초기화
    const currentYearMonth = `${selectedYear}-${selectedMonth}`;
    if (prevYearMonthRef.current !== currentYearMonth) {
        hasInitialScrolled.current = false;
        prevYearMonthRef.current = currentYearMonth;
    }

    // 첫 로드 시 최하단으로 스크롤
    const onContentSizeChange = useCallback(() => {
        if (diaries.length > 0 && flatListRef.current && !hasInitialScrolled.current) {
            const timer = setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
                hasInitialScrolled.current = true;
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [diaries.length]);

    const renderDiaryItem = useCallback(({ item }) => (
        <DiaryEntryCard
            diary={item}
            activities={activitiesMap[item.date] || []}
            commentCount={commentCounts[item.date] || 0}
            onOpenComment={openCommentModal}
            onPress={() => handleNavigateToWrite(item.date)}
        />
    ), [commentCounts, activitiesMap, openCommentModal, handleNavigateToWrite]);

    const keyExtractor = useCallback((item) => String(item.id), []);

    // subtitle에 표시할 연/월 텍스트
    const subtitleText = `${selectedYear}년 ${selectedMonth}월`;

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />
            <Header
                title="다이어리"
                subtitle={
                    <TouchableOpacity
                        onPress={openYearMonthPicker}
                        activeOpacity={0.6}
                        style={styles.subtitleTouchable}
                    >
                        <Text style={styles.subtitleText}>{subtitleText}</Text>
                        <Text style={styles.subtitleArrow}>▾</Text>
                    </TouchableOpacity>
                }
            />

            {/* 일기 피드 (선택된 월만 표시) */}
            {diaries.length > 0 ? (
                <FlatList
                    ref={flatListRef}
                    data={diaries}
                    renderItem={renderDiaryItem}
                    keyExtractor={keyExtractor}
                    style={styles.feedList}
                    contentContainerStyle={styles.feedContent}
                    showsVerticalScrollIndicator={false}
                    onContentSizeChange={onContentSizeChange}
                    getItemLayout={getItemLayout}
                    initialNumToRender={10}
                />
            ) : (
                <View style={styles.emptyContainer}>
                    <ComboShakeMoodCharacter character="bear" size={80} />
                    <Text style={styles.emptyText}>{selectedMonth}월에 작성된 일기가 없어요 ✧</Text>
                </View>
            )}

            {/* 연/월 피커 모달 */}
            <Modal
                isVisible={isYearMonthPickerVisible}
                onBackdropPress={closeYearMonthPicker}
                style={styles.modalContainer}
                animationIn="zoomIn"
                animationOut="zoomOut"
                backdropOpacity={0.4}
            >
                <YearMonthPicker
                    selectedYear={selectedYear}
                    selectedMonth={selectedMonth}
                    onSelect={changeYearMonth}
                    onClose={closeYearMonthPicker}
                />
            </Modal>

            {/* 댓글 팝업 모달 */}
            <Modal
                isVisible={isCommentModalVisible}
                onBackdropPress={closeCommentModal}
                style={styles.modalContainer}
                propagateSwipe={true}
                animationIn="zoomIn"
                animationOut="zoomOut"
                backdropOpacity={0.4}
            >
                <View style={styles.popupModal}>
                    <Text style={styles.sheetHeader}>추신</Text>

                    {/* 키보드가 올라오면 댓글 리스트를 숨기고 입력 박스만 노출 */}
                    {!isKeyboardVisible && (
                        comments.length > 0 ? (
                            <FlatList
                                data={comments}
                                keyExtractor={item => String(item.id)}
                                showsVerticalScrollIndicator={false}
                                style={styles.commentsList}
                                contentContainerStyle={{ paddingBottom: 16 }}
                                renderItem={({ item }) => <CommentItem item={item} onDelete={handleDeleteComment} />}
                            />
                        ) : (
                            <View style={styles.emptyCommentWrap}>
                                <ComboShakeMoodCharacter character="octopus" size={56} />
                                <Text style={styles.emptyCommentText}>과거의 나에게 추신을 남겨보세요.</Text>
                            </View>
                        )
                    )}

                    {/* 댓글 입력창 */}
                    <View style={styles.commentInputWrap}>
                        <TextInput
                            style={styles.commentInput}
                            placeholder="내용을 입력하세요..."
                            placeholderTextColor="#999999"
                            value={commentText}
                            onChangeText={setCommentText}
                            onSubmitEditing={submitComment}
                            returnKeyType="send"
                        />
                        <TouchableOpacity style={styles.commentSubmitBtn} onPress={submitComment} activeOpacity={0.8}>
                            <Text style={styles.commentSubmitText}>등록</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

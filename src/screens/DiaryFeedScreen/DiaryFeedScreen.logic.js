/**
 * ⚙️ DiaryFeedScreen 로직 훅
 * - 선택된 연/월의 일기만 로딩
 * - 연/월 피커 상태 관리
 * - 댓글 CRUD + 키보드 상태 추적
 */

import { useState, useCallback, useEffect, useMemo } from 'react';
import { Keyboard } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useDiariesForMonth, useAllCommentCounts, useCommentsForDiary, saveComment, deleteCommentById, useMonthAllActivities } from '../../hooks/useDiary';

// ─── 현재 날짜 기준 초기값 ───
const now = new Date();
const INITIAL_YEAR = now.getFullYear();
const INITIAL_MONTH = now.getMonth() + 1; // 1~12

export function useDiaryFeedLogic(navigation) {
    // ─── 연/월 선택 상태 ───
    const [selectedYear, setSelectedYear] = useState(INITIAL_YEAR);
    const [selectedMonth, setSelectedMonth] = useState(INITIAL_MONTH);
    const [isYearMonthPickerVisible, setIsYearMonthPickerVisible] = useState(false);

    // yearMonth 형식 생성 (예: "2026-03")
    const yearMonth = useMemo(() => {
        return `${selectedYear}-${String(selectedMonth).padStart(2, '0')}`;
    }, [selectedYear, selectedMonth]);

    // ─── 해당 월의 일기 및 활동 로딩 ───
    const { diaries, loading, reload } = useDiariesForMonth(yearMonth);
    const { activities } = useMonthAllActivities(yearMonth);
    const { commentCounts } = useAllCommentCounts();

    // 날짜별 활동 맵핑
    const activitiesMap = useMemo(() => {
        const map = {};
        activities.forEach(act => {
            if (!map[act.date]) map[act.date] = [];
            map[act.date].push(act);
        });
        return map;
    }, [activities]);

    // ─── 댓글 관련 상태 ───
    const [selectedDiary, setSelectedDiary] = useState(null);
    const [isCommentModalVisible, setIsCommentModalVisible] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

    // 키보드 표시 상태 추적
    useEffect(() => {
        const showSub = Keyboard.addListener('keyboardDidShow', () => setIsKeyboardVisible(true));
        const hideSub = Keyboard.addListener('keyboardDidHide', () => setIsKeyboardVisible(false));
        return () => { showSub.remove(); hideSub.remove(); };
    }, []);

    const { comments, reload: reloadComments } = useCommentsForDiary(selectedDiary?.date);

    // 화면 재진입 시 최신 데이터 로드
    useFocusEffect(
        useCallback(() => {
            reload();
        }, [reload])
    );

    // ─── 연/월 피커 액션 ───
    const openYearMonthPicker = useCallback(() => {
        setIsYearMonthPickerVisible(true);
    }, []);

    const closeYearMonthPicker = useCallback(() => {
        setIsYearMonthPickerVisible(false);
    }, []);

    const changeYearMonth = useCallback((year, month) => {
        setSelectedYear(year);
        setSelectedMonth(month);
        setIsYearMonthPickerVisible(false);
    }, []);

    // 이전/다음 월 이동
    const goToPrevMonth = useCallback(() => {
        setSelectedMonth(prev => {
            if (prev === 1) {
                setSelectedYear(y => y - 1);
                return 12;
            }
            return prev - 1;
        });
    }, []);

    const goToNextMonth = useCallback(() => {
        setSelectedMonth(prev => {
            if (prev === 12) {
                setSelectedYear(y => y + 1);
                return 1;
            }
            return prev + 1;
        });
    }, []);

    // ─── 댓글 액션 ───
    const openCommentModal = useCallback((diary) => {
        setSelectedDiary(diary);
        setIsCommentModalVisible(true);
    }, []);

    const closeCommentModal = useCallback(() => {
        setIsCommentModalVisible(false);
        setTimeout(() => setSelectedDiary(null), 300);
        setCommentText('');
    }, []);

    const submitComment = useCallback(async () => {
        if (!selectedDiary || !commentText.trim()) return;

        await saveComment(selectedDiary.date, commentText.trim());
        setCommentText('');
        Keyboard.dismiss();
        reloadComments();
    }, [selectedDiary, commentText, reloadComments]);

    const handleDeleteComment = useCallback(async (commentId) => {
        await deleteCommentById(commentId);
        reloadComments();
    }, [reloadComments]);

    return {
        // 연/월 데이터
        selectedYear,
        selectedMonth,
        isYearMonthPickerVisible,

        // 일기 데이터
        diaries,
        loading,
        reload,
        activitiesMap,
        commentCounts,

        // 모달/댓글 상태
        isCommentModalVisible,
        selectedDiary,
        comments,
        commentText,
        isKeyboardVisible,
        setCommentText,

        // 연/월 액션
        openYearMonthPicker,
        closeYearMonthPicker,
        changeYearMonth,
        goToPrevMonth,
        goToNextMonth,

        // 댓글 액션
        openCommentModal,
        closeCommentModal,
        submitComment,
        handleDeleteComment,

        // 네비게이션
        handleNavigateToWrite: (date) => navigation.navigate('Write', { date })
    };
}

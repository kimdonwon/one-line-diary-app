import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { MOOD_LIST } from '../../constants/mood';
import { ACTIVITIES } from '../../constants/activities';
import { useDiaryForDate, useActivitiesForDate, saveDiary, saveActivities } from '../../hooks/useDiary';

/**
 * ⚙️ 작성(Write) 화면의 모든 비즈니스 로직과 폼 상태 관리를 담당하는 커스텀 훅입니다.
 */
export function useWriteLogic(route, navigation, scrollRef) {
    const today = new Date();
    const defaultDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const date = route?.params?.date || defaultDate;

    // 데이터 페칭(fetching) 훅 호출
    const { diary, loading } = useDiaryForDate(date);
    const { activities: savedActivities } = useActivitiesForDate(date);

    // 폼(Form) 주요 상태
    const [selectedMood, setSelectedMood] = useState(null);
    const [content, setContent] = useState('');
    const [showStickers, setShowStickers] = useState(false);

    // 다꾸 스티커 관리를 위한 상태
    // stickers: { id: string, type: string, isGraphic: boolean, x: number, y: number } 배열
    const [stickers, setStickers] = useState([]);
    const [inputBoxBounds, setInputBoxBounds] = useState({ width: 0, height: 0, x: 0, y: 0 });
    const [isStickerLimitModalVisible, setStickerLimitModalVisible] = useState(false);

    // 활동 선택 및 서술 관리를 위한 상태 (메타데이터 배열)
    const [activityStates, setActivityStates] = useState(
        ACTIVITIES.map(a => ({ key: a.key, selected: false, title: '', note: '' }))
    );

    /**
     * 기존 일기 데이터가 있으면 폼 상태를 복원합니다.
     */
    useEffect(() => {
        if (diary) {
            setSelectedMood(diary.mood);
            setContent(diary.content || '');
            try {
                if (diary.stickers) {
                    setStickers(JSON.parse(diary.stickers));
                }
            } catch (e) {
                console.log("Failed to parse stickers", e);
            }
        }
    }, [diary]);

    /**
     * 기존에 저장된 활동 기록(Activities)이 있다면 상태를 복원합니다.
     */
    useEffect(() => {
        if (savedActivities && savedActivities.length > 0) {
            setActivityStates(prev =>
                prev.map(a => {
                    const saved = savedActivities.find(s => s.activity === a.key);
                    return saved ? { ...a, selected: true, title: saved.title || '', note: saved.note || '' } : a;
                })
            );
        }
    }, [savedActivities]);

    const safeContent = content || '';
    const lineCount = safeContent.split('\n').length;

    /**
     * 📖 일기 본문 입력 헨들러 (최대 5줄 제한 적용)
     */
    const handleContentChange = (text) => {
        const safeText = text || '';
        if (safeText.split('\n').length > 5) return;
        setContent(safeText);
    };

    /**
     * 🌸 새 스티커를 일기장에 부착합니다.
     * 스티커는 최대 5개까지만 부착 가능하며, 초과 시 모달을 띄웁니다.
     * @param {string} stickerId - 텍스트(이모지) 스티커, 혹은 그래픽 SVG 식별코드
     * @param {boolean} isGraphic - 그래픽 스티커 여부 판별 플래그
     */
    const handleStickerPress = (stickerId, isGraphic = false) => {
        if (stickers.length >= 5) {
            setStickerLimitModalVisible(true);
            return;
        }
        // 화면 정중앙 혹은 고정 위치에 스폰(생성)
        const spawnX = inputBoxBounds.width > 0 ? inputBoxBounds.width / 2 - 20 : 100;
        const spawnY = inputBoxBounds.height > 0 ? inputBoxBounds.height / 2 - 20 : 80;

        const newSticker = {
            id: Date.now().toString() + Math.random().toString(36).substring(7),
            type: stickerId,
            isGraphic,
            x: spawnX,
            y: spawnY,
        };
        setStickers([...stickers, newSticker]);
    };

    const handleDeleteSticker = (id) => {
        setStickers(prev => prev.filter(s => s.id !== id));
    };

    const handleDragEnd = (id, newX, newY) => {
        setStickers(prev => prev.map(s =>
            s.id === id ? { ...s, x: newX, y: newY } : s
        ));
    };

    const toggleActivity = (key) => {
        setActivityStates(prev =>
            prev.map(a => a.key === key ? { ...a, selected: !a.selected } : a)
        );
    };

    const setActivityTitle = (key, title) => {
        setActivityStates(prev =>
            prev.map(a => a.key === key ? { ...a, title } : a)
        );
    };

    const setActivityNote = (key, note) => {
        setActivityStates(prev =>
            prev.map(a => a.key === key ? { ...a, note } : a)
        );
    };

    /**
     * 💾 작성된 전체 폼 데이터를 데이터베이스에 기록합니다.
     */
    const handleSave = async () => {
        if (!selectedMood) {
            Alert.alert('알림', '기분을 선택해주세요!');
            return;
        }
        if (!content.trim()) {
            Alert.alert('알림', '일기를 작성해주세요!');
            return;
        }

        try {
            await saveDiary(date, content.trim(), selectedMood, JSON.stringify(stickers));
            await saveActivities(date, activityStates);
            navigation.goBack(); // 저장 후 목록으로 이동
        } catch (e) {
            console.error('Failed to save diary:', e);
            Alert.alert('오류', '저장에 실패했어요');
        }
    };

    const formattedDate = date.replace(/-/g, '.');
    const activeMood = selectedMood ? MOOD_LIST.find(m => m.key === selectedMood) : null;

    /**
     * 키보드가 올라올 때 자동 스크롤 하단 포커싱 지원 함수
     */
    const slideToBottom = () => {
        setTimeout(() => {
            scrollRef.current?.scrollToEnd({ animated: true });
        }, 300);
    };

    return {
        // Properties
        date,
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

        // Settings
        setSelectedMood,
        setShowStickers,
        setInputBoxBounds,
        setStickerLimitModalVisible,

        // Handlers
        handleContentChange,
        handleStickerPress,
        handleDeleteSticker,
        handleDragEnd,
        toggleActivity,
        setActivityTitle,
        setActivityNote,
        handleSave,
        slideToBottom
    };
}

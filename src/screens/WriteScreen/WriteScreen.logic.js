import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { MOOD_LIST } from '../../constants/mood';
import { ACTIVITIES } from '../../constants/activities';
import { STICKER_CATEGORIES, STICKER_PACK_DATA } from '../../constants/stickers';
import { useDiaryForDate, useActivitiesForDate, saveDiary, saveActivities } from '../../hooks/useDiary';
import { getSetting, saveSetting } from '../../database/db';

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
    const [showStickers, setShowStickers] = useState(false);

    // ─── 멀티페이지 상태 ───
    // pages: 각 페이지의 content 문자열 배열
    // pageStickers: 각 페이지의 스티커 배열 (2차원 배열)
    const MAX_PAGES = 5;
    const [pages, setPages] = useState(['']);
    const [pageStickers, setPageStickers] = useState([[]]);
    const [currentPageIndex, setCurrentPageIndex] = useState(0);

    // 현재 페이지의 content와 stickers (편의용 alias)
    const content = pages[currentPageIndex] || '';
    const stickers = pageStickers[currentPageIndex] || [];

    const [inputBoxBounds, setInputBoxBounds] = useState({ width: 0, height: 0, x: 0, y: 0 });
    const [isStickerLimitModalVisible, setStickerLimitModalVisible] = useState(false);

    // 🔔 커스텀 알림 상태 추가
    const [showAlert, setShowAlert] = useState(false);
    const [alertConfig, setAlertConfig] = useState({ title: '', message: '' });

    // 프리미엄 상태
    const [isPremium, setIsPremium] = useState(false);

    // 스티커 서랍 관리 상태
    const defaultCats = STICKER_PACK_DATA.filter(p => p.isDefault).map(p => p.catId);
    const [enabledCatIds, setEnabledCatIds] = useState(defaultCats);
    const [showManager, setShowManager] = useState(false);

    // 📺 광고 보상 추가 스티커 수
    const [adBonusStickers, setAdBonusStickers] = useState(0);

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

            // ── content 마이그레이션: 기존 단일 문자열 → 배열 변환 ──
            let parsedPages = [''];
            try {
                const parsed = JSON.parse(diary.content);
                if (Array.isArray(parsed)) {
                    parsedPages = parsed;
                } else {
                    parsedPages = [diary.content || ''];
                }
            } catch (e) {
                // JSON이 아니면 기존 단일 문자열
                parsedPages = [diary.content || ''];
            }
            setPages(parsedPages);

            // ── stickers 마이그레이션: 기존 1차원 배열 → 2차원 배열 변환 ──
            let parsedStickers = [[]];
            try {
                if (diary.stickers) {
                    const raw = JSON.parse(diary.stickers);
                    if (Array.isArray(raw) && raw.length > 0) {
                        // 첫 원소가 배열이면 이미 2차원 (새 형식)
                        if (Array.isArray(raw[0])) {
                            parsedStickers = raw;
                        } else {
                            // 1차원 배열 → 첫 페이지 스티커로 변환 (레거시)
                            parsedStickers = [raw];
                        }
                    }
                }
            } catch (e) {
                console.log('Failed to parse stickers', e);
            }
            // 페이지 수에 맞춰 빈 스티커 배열 패딩
            while (parsedStickers.length < parsedPages.length) {
                parsedStickers.push([]);
            }
            setPageStickers(parsedStickers);
            setCurrentPageIndex(0);
        }
    }, [diary]);

    // 프리미엄 상태 및 스티커 설정 로드
    useEffect(() => {
        (async () => {
            try {
                const premiumVal = await getSetting('isPremium');
                setIsPremium(premiumVal === 'true');

                const enabledVal = await getSetting('enabledStickerCats');
                if (enabledVal) {
                    setEnabledCatIds(JSON.parse(enabledVal));
                }
            } catch (e) {
                console.log('Failed to load settings in WriteScreen:', e);
            }
        })();
    }, []);

    const toggleCategory = async (catId) => {
        const isAlreadyEnabled = enabledCatIds.includes(catId);

        // 🚫 무료 버전 3개 제한 로직 추가
        if (!isPremium && !isAlreadyEnabled && enabledCatIds.length >= 3) {
            setAlertConfig({
                title: '스티커 팩 제한 🔒',
                message: '무료 버전에서는 최대 3개의 스티커 팩만 동시에 꺼내둘 수 있어요. 프리미엄으로 무제한 사용해 보세요! ✨'
            });
            setShowAlert(true);
            return;
        }

        const nextIds = isAlreadyEnabled
            ? enabledCatIds.filter(id => id !== catId)
            : [...enabledCatIds, catId];

        // 최소 하나의 카테고리는 남겨둠
        if (nextIds.length === 0) return;

        setEnabledCatIds(nextIds);
        await saveSetting('enabledStickerCats', JSON.stringify(nextIds));
    };

    // 카테고리 순서 (전체 팩 순서 관리)
    const [catOrder, setCatOrder] = useState(defaultCats);

    useEffect(() => {
        (async () => {
            const orderVal = await getSetting('stickerCatOrder');
            if (orderVal) setCatOrder(JSON.parse(orderVal));
        })();
    }, []);

    const reorderCategories = async (newOrder) => {
        setCatOrder([...newOrder]);
        await saveSetting('stickerCatOrder', JSON.stringify(newOrder));
    };

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
     * 📖 일기 본문 입력 헨들러 (특정 페이지에 적용, 미지정 시 현재 페이지)
     */
    const handleContentChange = (text, pageIdx) => {
        const targetIdx = pageIdx !== undefined ? pageIdx : currentPageIndex;
        setPages(prev => {
            const next = [...prev];
            next[targetIdx] = text || '';
            return next;
        });
    };

    /**
     * 📄 페이지 추가 (최대 MAX_PAGES까지)
     */
    const addPage = () => {
        if (pages.length >= MAX_PAGES) {
            setAlertConfig({ title: '페이지 제한', message: `일기는 최대 ${MAX_PAGES}페이지까지 추가할 수 있어요 ✧` });
            setShowAlert(true);
            return;
        }
        setPages(prev => [...prev, '']);
        setPageStickers(prev => [...prev, []]);
        setCurrentPageIndex(pages.length); // 새 페이지로 이동
    };

    /**
     * 🗑️ 현재 페이지 삭제 (최소 1페이지는 유지)
     */
    const deletePage = (index) => {
        if (pages.length <= 1) return;

        const newPages = pages.filter((_, i) => i !== index);
        const newPageStickers = pageStickers.filter((_, i) => i !== index);

        setPages(newPages);
        setPageStickers(newPageStickers);

        // 삭제 후 이동할 인덱스: 현재 인덱스가 마지막이었으면 이전으로, 아니면 현재 인덱스 유지
        const nextIdx = index >= newPages.length ? Math.max(0, newPages.length - 1) : index;
        setCurrentPageIndex(nextIdx);

        return nextIdx; // view에서 스크롤 처리를 위해 반환
    };

    /**
     * 🗑️ 페이지 삭제 트리거 (사용자 확인 절차 포함)
     */
    const handlePageDeleteTrigger = (index, onFinish) => {
        setAlertConfig({
            title: '페이지 삭제',
            message: '정말 이 페이지를 삭제할까요?\n작성된 내용은 복구되지 않아요 ✧',
            confirmText: '삭제하기',
            onConfirm: () => {
                const nextIdx = deletePage(index);
                setShowAlert(false);
                if (onFinish) onFinish(nextIdx);
            },
            secondaryText: '취소',
            onSecondaryConfirm: () => setShowAlert(false)
        });
        setShowAlert(true);
    };

    /**
     * 페이지 이동
     */
    const goToPage = (index) => {
        if (index >= 0 && index < pages.length) {
            setCurrentPageIndex(index);
        }
    };

    /**
     * 🌸 새 스티커를 일기장에 부착합니다.
     * 스티커는 최대 5개까지만 부착 가능하며, 초과 시 모달을 띄웁니다.
     * @param {string} stickerId - 텍스트(이모지) 스티커, 혹은 그래픽 SVG 식별코드
     * @param {boolean} isGraphic - 그래픽 스티커 여부 판별 플래그
     */
    const handleStickerPress = (stickerId, isGraphic = false) => {
        const baseLimit = isPremium ? 15 : 3;
        // 🚫 결국 어떤 경우에도 최대 15개까지만 허용
        const totalLimit = Math.min(baseLimit + adBonusStickers, 15);

        // 🚨 모든 페이지의 스티커 개수 합산
        const totalCurrentStickers = pageStickers.reduce((acc, current) => acc + (current?.length || 0), 0);

        if (totalCurrentStickers >= totalLimit) {
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
        setPageStickers(prev => {
            const next = [...prev];
            next[currentPageIndex] = [...(next[currentPageIndex] || []), newSticker];
            return next;
        });
    };

    const handleAdReward = () => {
        // 실제로는 여기서 광고 SDK 호출
        setAdBonusStickers(prev => prev + 2);
        setStickerLimitModalVisible(false);

        setAlertConfig({
            title: '광고 보상 🎁',
            message: '보너스 스티커 2개가 추가되었습니다! 마음껏 붙여보세요 ✨'
        });
        setTimeout(() => setShowAlert(true), 500);
    };

    const handleDeleteSticker = (id) => {
        setPageStickers(prev => {
            const next = [...prev];
            next[currentPageIndex] = (next[currentPageIndex] || []).filter(s => s.id !== id);
            return next;
        });
    };

    const handleDragEnd = (id, newX, newY, newRotation) => {
        setPageStickers(prev => {
            const next = [...prev];
            next[currentPageIndex] = (next[currentPageIndex] || []).map(s =>
                s.id === id ? { ...s, x: newX, y: newY, rotation: newRotation !== undefined ? newRotation : (s.rotation || 0) } : s
            );
            return next;
        });
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
            setAlertConfig({ title: '기분을 정해주세요!', message: '오늘의 조각을 완성하려면\n기분 선택이 필요해요 ✨' });
            setShowAlert(true);
            return;
        }


        try {
            // 멀티페이지: pages 배열과 pageStickers 2차원 배열을 JSON으로 저장
            const trimmedPages = pages.map(p => (p || '').trim());
            // 빈 후행 페이지 제거 (마지막 빈 페이지들 정리)
            while (trimmedPages.length > 1 && trimmedPages[trimmedPages.length - 1] === '' && (pageStickers[trimmedPages.length - 1] || []).length === 0) {
                trimmedPages.pop();
            }
            const stickersToSave = pageStickers.slice(0, trimmedPages.length);

            // 단일 페이지면 레거시 호환을 위해 문자열/1차원 배열로 저장
            const contentToSave = trimmedPages.length === 1 ? trimmedPages[0] : JSON.stringify(trimmedPages);
            const stickersStrToSave = trimmedPages.length === 1 ? JSON.stringify(stickersToSave[0] || []) : JSON.stringify(stickersToSave);

            await saveDiary(date, contentToSave, selectedMood, stickersStrToSave);
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
        showAlert,
        setShowAlert,
        alertConfig,

        // 멀티페이지
        pages,
        pageStickers,
        currentPageIndex,
        MAX_PAGES,
        addPage,
        deletePage,
        handlePageDeleteTrigger,
        goToPage,

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
        slideToBottom,

        // Drawer Manager
        enabledCatIds,
        catOrder,
        showManager,
        setShowManager,
        toggleCategory,
        reorderCategories,
        isPremium,

        // Ad
        adBonusStickers,
        handleAdReward,
    };
}

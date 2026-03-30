import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Alert, Dimensions, Keyboard, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MOOD_LIST } from '../../constants/mood';
import { ACTIVITIES } from '../../constants/activities';
import { STICKER_CATEGORIES, STICKER_PACK_DATA } from '../../constants/stickers';
import { BACKGROUNDS, BG_CATEGORIES, getBackgroundById } from '../../constants/backgrounds';
import { useDiaryForDate, useActivitiesForDate, saveDiary, saveActivities } from '../../hooks/useDiary';
import { getSetting, saveSetting } from '../../database/db';
import { usePremium } from '../../hooks/usePremium';
import { SYSTEM_LIMITS } from '../../constants/limits';
import { RewardedAd, RewardedAdEventType, AdEventType } from 'react-native-google-mobile-ads';
import { ADMOB_IDS } from '../../constants/ads';

/**
 * ⚙️ 작성(Write) 화면의 모든 비즈니스 로직과 폼 상태 관리를 담당하는 커스텀 훅입니다.
 */
export function useWriteLogic(route, navigation, scrollRef) {
    const { hasPremiumBenefits: isPremium } = usePremium();

    // 🗓️ 작성 날짜 고정 (자정 근처에서 날짜가 바뀌는 버그 방지)
    const date = useMemo(() => {
        if (route?.params?.date) return route.params.date;

        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    }, [route?.params?.date]);

    // 데이터 페칭(fetching) 훅 호출
    const { diary, loading } = useDiaryForDate(date);
    const { activities: savedActivities } = useActivitiesForDate(date);

    // 폼(Form) 주요 상태
    const [selectedMood, setSelectedMood] = useState(null);
    const [showStickers, setShowStickers] = useState(false);

    // ─── 멀티페이지 상태 ───
    // pages: 각 페이지의 content 문자열 배열
    // pageStickers: 각 페이지의 스티커 배열 (2차원 배열)
    const MAX_PAGES = SYSTEM_LIMITS.MAX_PAGES;
    const [pages, setPages] = useState(['']);
    const [pageStickers, setPageStickers] = useState([[]]);
    const [pagePhotos, setPagePhotos] = useState([[]]); // 📷 페이지별 사진 배열
    const [showPhotos, setShowPhotos] = useState(false); // 📷 사진(프레임 선택) 서랍 열림 상태
    const [pageTexts, setPageTexts] = useState([[]]); // ✏️ 페이지별 텍스트(커스텀) 스티커 배열
    const [showTexts, setShowTexts] = useState(false); // ✏️ 텍스트 서랍 열림 상태
    const [pageBackgrounds, setPageBackgrounds] = useState(['default']); // 🎨 페이지별 배경지 ID
    const [showBackgrounds, setShowBackgrounds] = useState(false); // 배경지 서랍 열림 상태
    const [currentPageIndex, setCurrentPageIndex] = useState(0);
    const MAX_PHOTOS_PER_PAGE = isPremium ? SYSTEM_LIMITS.PREMIUM_TIER.MAX_PHOTOS : SYSTEM_LIMITS.FREE_TIER.MAX_PHOTOS;
    const MAX_TEXTS_PER_PAGE = isPremium ? SYSTEM_LIMITS.PREMIUM_TIER.MAX_TEXTS : SYSTEM_LIMITS.FREE_TIER.MAX_TEXTS;

    // 스티커 서랍 관리 상태
    const defaultCats = STICKER_PACK_DATA.filter(p => p.isDefault).map(p => p.catId);
    const [enabledCatIds, setEnabledCatIds] = useState(defaultCats);
    const [showManager, setShowManager] = useState(false);

    // 📺 광고 보상 추가 스티커 수
    const [adBonusStickers, setAdBonusStickers] = useState(0);
    // 📺 광고 보상 추가 텍스트 수
    const [adBonusTexts, setAdBonusTexts] = useState(0);

    // 활동 선택 및 서술 관리를 위한 상태 (메타데이터 배열)
    const [activityStates, setActivityStates] = useState(
        ACTIVITIES.map(a => ({ key: a.key, selected: false, title: '', note: '' }))
    );

    // 현재 페이지의 content와 stickers (편의용 alias)
    const content = pages[currentPageIndex] || '';
    const stickers = pageStickers[currentPageIndex] || [];

    const [inputBoxBounds, setInputBoxBounds] = useState({ width: 0, height: 0, x: 0, y: 0 });
    const [isStickerLimitModalVisible, setStickerLimitModalVisible] = useState(false);
    const [isTextLimitModalVisible, setTextLimitModalVisible] = useState(false);

    // 🔔 커스텀 알림 상태 추가
    const [showAlert, setShowAlert] = useState(false);
    const [alertConfig, setAlertConfig] = useState({ title: '', message: '' });
    const [isInteracting, setIsInteracting] = useState(false); // 스티커 등 조작 중인지 여부 (스크롤 방지용)

    // 📺 광고 상태 관리
    const [isAdLoaded, setIsAdLoaded] = useState(false);
    const rewardedAdRef = useRef(null);
    const rewardTypeRef = useRef(null); // 'sticker' | 'text'
    // 상태 접근을 위한 ref
    const stateRef = useRef({ currentPageIndex, adBonusStickers, adBonusTexts, pageStickers, pageTexts });
    useEffect(() => {
        stateRef.current = { currentPageIndex, adBonusStickers, adBonusTexts, pageStickers, pageTexts };
    }, [currentPageIndex, adBonusStickers, adBonusTexts, pageStickers, pageTexts]);

    useEffect(() => {
        if (isPremium) return;

        let isMounted = true;

        try {
            const ad = RewardedAd.createForAdRequest(ADMOB_IDS.REWARDED, {
                requestNonPersonalizedAdsOnly: true,
            });

            const unsubscribeLoaded = ad.addAdEventListener(RewardedAdEventType.LOADED, () => {
                if (isMounted) setIsAdLoaded(true);
            });

            const unsubscribeEarned = ad.addAdEventListener(RewardedAdEventType.EARNED_REWARD, () => {
                if (!isMounted) return;
                const state = stateRef.current;

                if (rewardTypeRef.current === 'sticker') {
                    const baseLimit = SYSTEM_LIMITS.FREE_TIER.MAX_STICKERS;
                    const currentPageStickers = state.pageStickers[state.currentPageIndex]?.length || 0;
                    const currentEffectiveLimit = Math.max(baseLimit + state.adBonusStickers, currentPageStickers);
                    const nextBonus = (currentEffectiveLimit + 2) - baseLimit;

                    setAdBonusStickers(nextBonus);
                    setStickerLimitModalVisible(false);
                    setAlertConfig({
                        title: '보상 완료 🎁',
                        message: `스티커 한도가 추가되어 최대 ${baseLimit + nextBonus}개까지 붙일 수 있어요! ✨`
                    });
                    setTimeout(() => setShowAlert(true), 500);

                } else if (rewardTypeRef.current === 'text') {
                    const baseLimit = SYSTEM_LIMITS.FREE_TIER.MAX_TEXTS;
                    const currentPageTexts = state.pageTexts[state.currentPageIndex]?.length || 0;
                    const currentEffectiveLimit = Math.max(baseLimit + state.adBonusTexts, currentPageTexts);
                    const nextBonus = (currentEffectiveLimit + 2) - baseLimit;

                    setAdBonusTexts(nextBonus);
                    setTextLimitModalVisible(false);
                    setAlertConfig({
                        title: '보상 완료 🎁',
                        message: `텍스트 박스 한도가 추가되어 최대 ${baseLimit + nextBonus}개까지 넣을 수 있어요! ✨`
                    });
                    setTimeout(() => setShowAlert(true), 500);
                }
            });

            const unsubscribeClosed = ad.addAdEventListener(AdEventType.CLOSED, () => {
                if (isMounted) {
                    setIsAdLoaded(false);
                    ad.load(); // Load next ad
                }
            });

            ad.load();
            rewardedAdRef.current = ad;

            return () => {
                isMounted = false;
                unsubscribeLoaded();
                unsubscribeEarned();
                unsubscribeClosed();
            };
        } catch (error) {
            console.error('Failed to init AdMob:', error);
        }
    }, [isPremium]);

    // 💭 오늘의 기분 및 활동 모달 팝업 상태 (첫 화면 진입 시)
    const [isMoodModalVisible, setMoodModalVisible] = useState(false);

    // 🗑️ 쓰레기통 드래그 삭제 상태
    const [isDraggingAny, setIsDraggingAny] = useState(false); // 드래거블이 하나라도 드래그 중이면 true
    const isDraggingAnyRef = useRef(false); // 💡 콜백 안정화용 Ref (handleDragMove 의존성 제거)
    const [isOverTrash, setIsOverTrash] = useState(false); // 현재 쓰레기통 위에 있는지
    const trashZoneRef = useRef({ y: 0, height: 80 });
    const draggingItemId = useRef(null);
    const draggingItemType = useRef(null); // 'sticker' | 'photo' | 'text'

    // ✏️ 텍스트 프리셋 상태 (패널에서 설정 → 다음 텍스트 생성 시 적용)
    const [nextTextFont, setNextTextFont] = useState('basic');
    const [nextTextColor, setNextTextColor] = useState('#37352F');
    const [nextTextBgColor, setNextTextBgColor] = useState('transparent');

    // 🎯 선택된 아이템 관리 (중앙 집중식 선택 해제용)
    const [selectedItemId, setSelectedItemId] = useState(null);

    // ─── 💾 자동 저장(Auto-save) 로직 ───
    const latestData = useRef({ selectedMood, pages, pageStickers, pagePhotos, pageTexts, pageBackgrounds, activityStates, date });
    useEffect(() => {
        latestData.current = { selectedMood, pages, pageStickers, pagePhotos, pageTexts, pageBackgrounds, activityStates, date };
    }, [selectedMood, pages, pageStickers, pagePhotos, pageTexts, pageBackgrounds, activityStates, date]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('beforeRemove', (e) => {
            const data = latestData.current;
            if (data.selectedMood) {
                // 멀티페이지: pages 배열과 pageStickers 등 데이터를 저장 형식에 맞게 변환
                const trimmedPages = data.pages.map(p => (p || '').trim());
                // 빈 후행 페이지 제거
                while (trimmedPages.length > 1 && trimmedPages[trimmedPages.length - 1] === '' && (data.pageStickers[trimmedPages.length - 1] || []).length === 0 && (data.pagePhotos[trimmedPages.length - 1] || []).length === 0 && (data.pageTexts[trimmedPages.length - 1] || []).length === 0) {
                    trimmedPages.pop();
                }
                const stickersToSave = data.pageStickers.slice(0, trimmedPages.length);
                const photosToSave = data.pagePhotos.slice(0, trimmedPages.length);
                const textsToSave = data.pageTexts.slice(0, trimmedPages.length).map(page =>
                    (page || []).map(t => ({ ...t, autoFocus: false }))
                );

                const contentToSave = trimmedPages.length === 1 ? trimmedPages[0] : JSON.stringify(trimmedPages);
                const stickersStrToSave = trimmedPages.length === 1 ? JSON.stringify(stickersToSave[0] || []) : JSON.stringify(stickersToSave);
                const photosStrToSave = JSON.stringify(photosToSave);
                const textsStrToSave = JSON.stringify(textsToSave);
                const bgsToSave = data.pageBackgrounds.slice(0, trimmedPages.length);
                const bgsStrToSave = JSON.stringify(bgsToSave);

                // 화면 이탈 시 비동기 저장 백그라운드 수행 (Fire and Forget)
                saveDiary(data.date, contentToSave, data.selectedMood, stickersStrToSave, photosStrToSave, bgsStrToSave, textsStrToSave).catch(console.error);
                saveActivities(data.date, data.activityStates).catch(console.error);
            }
        });
        return unsubscribe;
    }, [navigation]);

    // (프리미엄 상태는 usePremium 훅에서 관리)


    // ─── 💾 데이터 복원 및 관리 ───
    const [isDataInitialized, setIsDataInitialized] = useState(false);

    /**
     * 기존 일기 데이터가 있으면 폼 상태를 복원합니다.
     */
    useEffect(() => {
        if (loading) return; // DB 조회가 끝나기 전에는 대기

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

            // 📷 사진 데이터 복원
            let parsedPhotos = [[]];
            try {
                if (diary.photos) {
                    const rawPhotos = JSON.parse(diary.photos);
                    if (Array.isArray(rawPhotos)) {
                        parsedPhotos = rawPhotos;
                    }
                }
            } catch (e) {
                console.log('Failed to parse photos', e);
            }
            while (parsedPhotos.length < parsedPages.length) {
                parsedPhotos.push([]);
            }
            setPagePhotos(parsedPhotos);

            // ✏️ 커스텀 텍스트 데이터 복원
            let parsedTexts = [[]];
            try {
                if (diary.texts) {
                    const rawTexts = JSON.parse(diary.texts);
                    if (Array.isArray(rawTexts)) {
                        // 🛠️ 버그 수정: 불러온 기존 데이터에서 autoFocus를 모두 제거하여, 
                        // 페이지 진입 시 키보드가 자동으로 올라오는 현상 방지
                        parsedTexts = rawTexts.map(page =>
                            Array.isArray(page)
                                ? page.map(t => ({ ...t, autoFocus: false }))
                                : []
                        );
                    }
                }
            } catch (e) {
                console.log('Failed to parse texts', e);
            }
            while (parsedTexts.length < parsedPages.length) {
                parsedTexts.push([]);
            }
            setPageTexts(parsedTexts);

            // 🎨 배경지 데이터 복원
            let parsedBgs = ['default'];
            try {
                if (diary.backgrounds) {
                    const rawBgs = JSON.parse(diary.backgrounds);
                    if (Array.isArray(rawBgs)) {
                        parsedBgs = rawBgs;
                    }
                }
            } catch (e) {
                console.log('Failed to parse backgrounds', e);
            }
            while (parsedBgs.length < parsedPages.length) {
                parsedBgs.push('default');
            }
            setPageBackgrounds(parsedBgs);

            setCurrentPageIndex(0);
        }

        // 데이터 복원 완벽히 마무리 (단, state update batching 고려)
        setIsDataInitialized(true);

    }, [diary, loading]);

    // 스티커 서랍 설정 로드
    useEffect(() => {
        (async () => {
            try {
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

        // 🚫 무료/프리미엄 모두 최대 6개 카테고리 동시 활성화 제한
        if (!isAlreadyEnabled && enabledCatIds.length >= 6) {
            setAlertConfig({
                title: '서랍장 공간 부족 📦',
                message: '스티커 팩은 최대 6개까지 동시에 꺼내둘 수 있어요.\n기존 팩을 하나 넣고 새로 꺼내보세요! ✨'
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

    // 📸 기분/활동 모달 상태 스냅샷 (편집 취소 복구용)
    const modalSnapshot = useRef(null);

    const openMoodModal = useCallback(() => {
        // 모달 열기 직전에 현재 선택된 기분과 활동 상태를 스냅샷으로 저장
        modalSnapshot.current = {
            mood: selectedMood,
            activities: JSON.parse(JSON.stringify(activityStates)),
        };
        setMoodModalVisible(true);
    }, [selectedMood, activityStates]);

    const handleMoodModalDismiss = useCallback(() => {
        if (modalSnapshot.current) {
            const oldMood = modalSnapshot.current.mood;
            const oldActivities = modalSnapshot.current.activities;
            const wasNewEntry = oldMood === null;

            // 1. 상태 복구
            setSelectedMood(oldMood);
            setActivityStates(oldActivities);

            // 2. 💡 중요: 자동 저장용 Ref를 즉시 업데이트합니다.
            // goBack()을 호출하면 즉시 beforeRemove 리스너가 실행되는데, 
            // 이때 리액트 상태 업데이트보다 먼저 최신 데이터를 읽어가기 때문에 수동으로 맞춰줘야 합니다.
            if (latestData.current) {
                latestData.current.selectedMood = oldMood;
                latestData.current.activityStates = oldActivities;
            }

            modalSnapshot.current = null;
            setMoodModalVisible(false);

            if (wasNewEntry) {
                navigation.goBack();
            }
        } else {
            setMoodModalVisible(false);
        }
    }, [navigation]);

    const handleMoodModalConfirm = useCallback(() => {
        // 💡 기분(selectedMood)이 선택되었는지 체크합니다.
        if (!selectedMood) {
            // 이미 구현되어 있는 커스텀 알림(setAlertConfig)을 활용하면 편리합니다.
            setAlertConfig({
                title: '잠시만요!',
                message: '오늘 하루를 표현할 기분을\n 선택해 주세요! ✨'
            });
            setShowAlert(true);
            return; // 모달을 닫지 않고 중단
        }
        // 기분이 선택되었다면 정상적으로 확정하고 모달 닫기
        modalSnapshot.current = null;
        setMoodModalVisible(false);
    }, [selectedMood, setAlertConfig, setShowAlert]); // 의존성 배열에 selectedMood 등 추가 필수

    /**
     * 🚪 첫 진입 시 (새 일기인 경우) 기분/활동 팝업 자동 오픈
     */
    useEffect(() => {
        if (!loading && !diary && !selectedMood) {
            // 화면 전환(트랜지션) 애니메이션이 끝날 때까지 기다린 후 모달 스냅샷을 찍으며 열기
            const timer = setTimeout(() => {
                openMoodModal();
            }, 150);
            return () => clearTimeout(timer);
        }
    }, [loading, diary, selectedMood, openMoodModal]);

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
        setPagePhotos(prev => [...prev, []]);
        setPageTexts(prev => [...prev, []]);
        setPageBackgrounds(prev => [...prev, 'default']);
        setCurrentPageIndex(pages.length); // 새 페이지로 이동
    };

    /**
     * 🗑️ 현재 페이지 삭제 (1페이지일 때는 내용 및 에셋 초기화)
     */
    const deletePage = (index) => {
        if (pages.length <= 1) {
            setPages(['']);
            setPageStickers([[]]);
            setPagePhotos([[]]);
            setPageTexts([[]]);
            setPageBackgrounds(['default']);
            setCurrentPageIndex(0);
            return 0;
        }

        const newPages = pages.filter((_, i) => i !== index);
        const newPageStickers = pageStickers.filter((_, i) => i !== index);
        const newPagePhotos = pagePhotos.filter((_, i) => i !== index);
        const newPageTexts = pageTexts.filter((_, i) => i !== index);
        const newPageBgs = pageBackgrounds.filter((_, i) => i !== index);

        setPages(newPages);
        setPageStickers(newPageStickers);
        setPagePhotos(newPagePhotos);
        setPageTexts(newPageTexts);
        setPageBackgrounds(newPageBgs);

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
        const baseLimit = isPremium ? SYSTEM_LIMITS.PREMIUM_TIER.MAX_STICKERS : SYSTEM_LIMITS.FREE_TIER.MAX_STICKERS;
        // 🚫 페이지당 최대 개수까지만 허용 (광고 보너스 포함)
        const pageLimit = Math.min(baseLimit + adBonusStickers, SYSTEM_LIMITS.PREMIUM_TIER.MAX_STICKERS);

        // 🚨 현재 페이지의 스티커 개수 체크 (페이지당 제한)
        const currentPageStickers = pageStickers[currentPageIndex]?.length || 0;

        // [아이디어 2번 적용] 현재 붙은 스티커가 제한보다 많으면, 이미 붙은 개수를 한도로 인정 (소프트 패스)
        const effectiveLimit = Math.max(pageLimit, currentPageStickers);

        if (currentPageStickers >= effectiveLimit) {
            setStickerLimitModalVisible(true);
            return;
        }
        // 화면 정중앙 혹은 고정 위치에 스폰(생성)
        const spawnX = inputBoxBounds.width > 0 ? inputBoxBounds.width / 2 - 20 : 100;
        const spawnY = inputBoxBounds.height > 0 ? inputBoxBounds.height / 2 - 20 : 80;
        const randomOffset = Math.random() * 20 - 10; // 자연스럽게 분산

        const newSticker = {
            id: Date.now().toString() + Math.random().toString(36).substring(7),
            type: stickerId,
            isGraphic,
            x: spawnX + randomOffset,
            y: spawnY + randomOffset,
            createdAt: Date.now(),
        };
        setPageStickers(prev => {
            const next = [...prev];
            next[currentPageIndex] = [...(next[currentPageIndex] || []), newSticker];
            return next;
        });
    };

    const handleAdReward = () => {
        if (isPremium) return;

        if (rewardedAdRef.current && isAdLoaded) {
            rewardTypeRef.current = 'sticker';
            rewardedAdRef.current.show();
        } else {
            setAlertConfig({
                title: '광고 준비 중 ⏳',
                message: '아직 광고가 준비되지 않았어요.\n잠시 후 다시 시도해 주세요.'
            });
            setShowAlert(true);
        }
    };

    /**
     * 📺 텍스트 서랍 & 캔버스 탭용 광고 보상 핸들러
     */
    const handleAdRewardForText = () => {
        if (isPremium) return;

        if (rewardedAdRef.current && isAdLoaded) {
            rewardTypeRef.current = 'text';
            rewardedAdRef.current.show();
        } else {
            setAlertConfig({
                title: '광고 준비 중 ⏳',
                message: '아직 광고가 준비되지 않았어요.\n잠시 후 다시 시도해 주세요.'
            });
            setShowAlert(true);
        }
    };

    const handleDeleteSticker = useCallback((id) => {
        setPageStickers(prev => {
            const next = [...prev];
            next[currentPageIndex] = (next[currentPageIndex] || []).filter(s => s.id !== id);
            return next;
        });
    }, [currentPageIndex]);

    /**
     * [스티커 드래그 종류] 드래그가 끝나면 최종 위치를 상태에 저장합니다.
     */
    const handleDragEnd = useCallback((id, newX, newY, newRotation, newScale) => {
        setPageStickers(prev => {
            const next = [...prev];
            next[currentPageIndex] = (next[currentPageIndex] || []).map(s =>
                s.id === id ? {
                    ...s,
                    x: newX,
                    y: newY,
                    rotation: newRotation !== undefined ? newRotation : (s.rotation || 0),
                    scale: newScale !== undefined ? newScale : (s.scale || 1)
                } : s
            );
            return next;
        });
    }, [currentPageIndex]);

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
     * 💾 작성된 전체 폼 데이터를 데이터베이스에 기록합니다. (수동 버튼 클릭 시 호출)
     */
    const handleSave = async () => {
        if (!selectedMood) {
            openMoodModal();
            return;
        }
        navigation.goBack(); // goBack 시 beforeRemove 이벤트가 발생하여 최신 데이터가 자동 저장됨
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

    // ✏️ 키보드 등장 시 ScrollView 자동 스크롤 (캔버스 하단 텍스트 가림 방지)
    useEffect(() => {
        const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
        const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

        const onKeyboardShow = (e) => {
            const keyboardHeight = e.endCoordinates.height;
            // 캔버스 하단이 키보드에 가려지지 않도록 스크롤
            setTimeout(() => {
                scrollRef.current?.scrollTo({ y: keyboardHeight * 0.5, animated: true });
            }, 100);
        };

        const onKeyboardHide = () => {
            setTimeout(() => {
                scrollRef.current?.scrollTo({ y: 0, animated: true });
            }, 100);
        };

        const subShow = Keyboard.addListener(showEvent, onKeyboardShow);
        const subHide = Keyboard.addListener(hideEvent, onKeyboardHide);

        return () => {
            subShow.remove();
            subHide.remove();
        };
    }, []);

    // ─── 📷 사진 첨부 로직 ───

    /**
     * 📷 사진 첨부 통합 로직: 프레임 선택 즉시 갤러리를 엽니다.
     */
    const handlePickPhotoWithFrame = async (frameType = 'white') => {
        const currentPhotos = pagePhotos[currentPageIndex] || [];
        if (currentPhotos.length >= MAX_PHOTOS_PER_PAGE) {
            setAlertConfig({
                title: '사진 제한 📷',
                message: `한 페이지에 사진은 최대 ${MAX_PHOTOS_PER_PAGE}장까지만 넣을 수 있어요!`
            });
            setShowAlert(true);
            return;
        }

        // 1. 권한 확인
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            setAlertConfig({
                title: '권한 필요 🔒',
                message: '사진을 추가하려면 갤러리 접근 권한이 필요해요.'
            });
            setShowAlert(true);
            return;
        }

        // 2. 갤러리 팝업
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        // 3. 선택 완료 시 데이터 부착
        if (!result.canceled && result.assets && result.assets.length > 0) {
            const asset = result.assets[0];
            const spawnX = inputBoxBounds.width > 0 ? inputBoxBounds.width / 2 - 65 : 40;
            const spawnY = inputBoxBounds.height > 0 ? inputBoxBounds.height / 2 - 72 : 40;
            const randomOffset = Math.random() * 20 - 10;
            const newId = Date.now().toString() + Math.random().toString(36).substring(7);

            const newPhoto = {
                id: newId,
                uri: asset.uri,
                x: spawnX + randomOffset,
                y: spawnY + randomOffset,
                rotation: 0,
                frameType,
                isNewPlaceholder: false,
                createdAt: Date.now(),
            };

            setPagePhotos(prev => {
                const next = [...prev];
                next[currentPageIndex] = [...(next[currentPageIndex] || []), newPhoto];
                return next;
            });
        }
    };

    /**
     * @deprecated handlePickPhotoWithFrame 로 교체됨
     */
    const handleAddPhoto = (frameType = 'white') => {
        handlePickPhotoWithFrame(frameType);
    };

    /**
     * 📷 기존 Placeholder 탭 할 때 호출되는 함수
     */
    const handlePickPhotoForId = async (id) => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            setAlertConfig({
                title: '권한 필요 🔒',
                message: '사진을 추가하려면 갤러리 접근 권한이 필요해요.'
            });
            setShowAlert(true);
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            const asset = result.assets[0];
            setPagePhotos(prev => {
                const next = [...prev];
                next[currentPageIndex] = (next[currentPageIndex] || []).map(p =>
                    p.id === id ? { ...p, uri: asset.uri, isNewPlaceholder: false } : p
                );
                return next;
            });
        }
    };

    const handleDeletePhoto = useCallback((id) => {
        setPagePhotos(prev => {
            const next = [...prev];
            next[currentPageIndex] = (next[currentPageIndex] || []).filter(p => p.id !== id);
            return next;
        });
    }, [currentPageIndex]);

    /**
     * [사진 드래그 종료] 사진 드래그가 끝나면 최종 위치를 저장합니다.
     */
    const handlePhotoDragEnd = useCallback((id, newX, newY, newRotation, newScale) => {
        let shouldOpenGallery = false;

        setPagePhotos(prev => {
            const next = [...prev];
            const photos = next[currentPageIndex] || [];

            const updatedPhotos = photos.map(p => {
                if (p.id === id) {
                    if (p.isNewPlaceholder) {
                        shouldOpenGallery = true;
                    }
                    return {
                        ...p,
                        x: newX,
                        y: newY,
                        rotation: newRotation !== undefined ? newRotation : (p.rotation || 0),
                        scale: newScale !== undefined ? newScale : (p.scale || 1)
                    };
                }
                return p;
            });
            next[currentPageIndex] = updatedPhotos;
            return next;
        });

        if (shouldOpenGallery) {
            setTimeout(() => handlePickPhotoForId(id), 100);
        }
    }, [currentPageIndex]);

    // ─── ✏️ 커스텀 텍스트 드래그 기능 추가 ───

    const handleAddText = (textValue, fontId, color, bgColor) => {
        if (!textValue || textValue.trim().length === 0) return;

        // 🚨 텍스트 개수 제한 체크
        const currentTexts = pageTexts[currentPageIndex] || [];
        const currentEffectiveTextLimit = Math.min(MAX_TEXTS_PER_PAGE + adBonusTexts, SYSTEM_LIMITS.PREMIUM_TIER.MAX_TEXTS);
        if (currentTexts.length >= currentEffectiveTextLimit) {
            setTextLimitModalVisible(true);
            return;
        }

        const spawnX = inputBoxBounds.width > 0 ? inputBoxBounds.width / 2 - 50 : 60;
        const spawnY = inputBoxBounds.height > 0 ? inputBoxBounds.height / 2 - 20 : 60;
        const randomOffset = Math.random() * 20 - 10;

        const newText = {
            id: Date.now().toString() + Math.random().toString(36).substring(7),
            text: textValue.substring(0, SYSTEM_LIMITS.MAX_TEXT_LENGTH),
            fontId,
            color,
            bgColor,
            x: spawnX + randomOffset,
            y: spawnY + randomOffset,
            rotation: 0,
            createdAt: Date.now(),
        };

        setPageTexts(prev => {
            const next = [...prev];
            next[currentPageIndex] = [...(next[currentPageIndex] || []), newText];
            return next;
        });
        setShowTexts(false); // 추가 후 패널 닫기
    };

    /**
     * 📝 캔버스 터치 시 해당 위치에 빈 텍스트 카드 생성 (Tap-to-Write)
     */
    const handleCanvasTap = (locationX, locationY) => {
        // 캔버스 탭 시 기존 선택 해제
        setSelectedItemId(null);

        // 🚨 텍스트 개수 제한 체크
        const currentTexts = pageTexts[currentPageIndex] || [];
        const currentEffectiveTextLimit = Math.min(MAX_TEXTS_PER_PAGE + adBonusTexts, SYSTEM_LIMITS.PREMIUM_TIER.MAX_TEXTS);
        if (currentTexts.length >= currentEffectiveTextLimit) {
            setTextLimitModalVisible(true);
            return;
        }

        const newText = {
            id: Date.now().toString() + Math.random().toString(36).substring(7),
            text: '',
            fontId: nextTextFont,
            color: nextTextColor,
            bgColor: nextTextBgColor,
            x: locationX - 30,
            y: locationY - 15,
            rotation: 0,
            autoFocus: true, // 생성 시 자동 포커스
            createdAt: Date.now(),
        };

        setPageTexts(prev => {
            const next = [...prev];
            next[currentPageIndex] = [...(next[currentPageIndex] || []), newText];
            return next;
        });
    };

    /**
     * ✏️ 텍스트 카드 내용 인라인 업데이트
     */
    const handleUpdateText = useCallback((id, newTextValue) => {
        setPageTexts(prev => {
            const next = [...prev];
            next[currentPageIndex] = (next[currentPageIndex] || []).map(t =>
                t.id === id ? { ...t, text: newTextValue } : t
            );
            return next;
        });
    }, [currentPageIndex]);

    const handleDeleteText = useCallback((id) => {
        setPageTexts(prev => {
            const next = [...prev];
            next[currentPageIndex] = (next[currentPageIndex] || []).filter(t => t.id !== id);
            return next;
        });
    }, [currentPageIndex]);

    /**
     * [텍스트 드래그 종료] 텍스트 박스 드래그가 끝나면 최종 위치를 저장합니다.
     */
    const handleTextDragEnd = useCallback((id, newX, newY, newRotation, newScale) => {
        setPageTexts(prev => {
            const next = [...prev];
            next[currentPageIndex] = (next[currentPageIndex] || []).map(t =>
                t.id === id ? {
                    ...t,
                    x: newX,
                    y: newY,
                    rotation: newRotation !== undefined ? newRotation : (t.rotation || 0),
                    scale: newScale !== undefined ? newScale : (t.scale || 1)
                } : t
            );
            return next;
        });
    }, [currentPageIndex]);

    // ─── 🎨 배경지 변경 로직 ───

    /**
     * 🎨 현재 페이지의 배경지를 변경합니다.
     * @param {string} bgId - 배경지 ID
     */
    const handleChangeBackground = (bgId) => {
        setPageBackgrounds(prev => {
            const next = [...prev];
            next[currentPageIndex] = bgId;
            return next;
        });
    };

    // ─── 🪄 다꾸 가챠 (Magic Decorate) ───

    /** 기분별 어울리는 이모지 매핑 */
    const MOOD_STICKER_MAP = {
        happy: ["✨", "🌈", "💖", "🌻", "🎀", "🍀", "💫"],
        sad: ["🫧", "🌧️", "💧", "🥹", "🌸", "☁️", "🪷"],
        surprised: ["⚡", "🎉", "🤯", "💥", "🌟", "🎊", "✦"],
        embarrassed: ["🫣", "💗", "🌺", "🎀", "🍓", "🧁", "💝"],
        soso: ["☕", "🍃", "🌤️", "📖", "🎵", "🧋", "🍰"],
    };

    /**
     * 🪄 다꾸 가챠: 현재 기분에 어울리는 스티커 2~3개를 랜덤 위치/각도로 자동 배치합니다.
     */
    const handleMagicDecorate = () => {
        const mood = selectedMood || 'happy';
        const pool = MOOD_STICKER_MAP[mood] || MOOD_STICKER_MAP.happy;

        // 스티커 제한 체크 (현재 페이지 기준)
        const baseLimit = isPremium ? 15 : 3;
        const pageLimit = Math.min(baseLimit + adBonusStickers, 15);
        const currentPageStickers = pageStickers[currentPageIndex]?.length || 0;

        // [아이디어 2번 적용] 소프트 패스 로직
        const effectiveLimit = Math.max(pageLimit, currentPageStickers);

        const stickerCount = Math.random() < 0.5 ? 2 : 3; // 2~3개 랜덤
        const remaining = effectiveLimit - currentPageStickers;

        if (remaining <= 0) {
            setStickerLimitModalVisible(true);
            return;
        }

        const count = Math.min(stickerCount, remaining);
        const w = inputBoxBounds.width > 0 ? inputBoxBounds.width : 280;
        const h = inputBoxBounds.height > 0 ? inputBoxBounds.height : 300;

        // 풀에서 중복 없이 랜덤 선택
        const shuffled = [...pool].sort(() => Math.random() - 0.5);
        const picked = shuffled.slice(0, count);

        const newStickers = picked.map((emoji) => ({
            id: Date.now().toString() + Math.random().toString(36).substring(7),
            type: emoji,
            isGraphic: false,
            x: Math.random() * (w - 60) + 10,     // 10 ~ (w-50) 범위
            y: Math.random() * (h - 80) + 20,     // 20 ~ (h-60) 범위
            rotation: (Math.random() - 0.5) * 30,  // -15° ~ +15° 살짝 삐뚤빼뚤
        }));

        setPageStickers(prev => {
            const next = [...prev];
            next[currentPageIndex] = [...(next[currentPageIndex] || []), ...newStickers];
            return next;
        });

        // 가챠 완료 알림
        setAlertConfig({
            title: '다꾸 완료! 🪄✨',
            message: `${count}개의 감성 스티커가 붙었어요!\n위치가 마음에 안 들면 드래그해서 옮겨보세요 🫶`
        });
        setShowAlert(true);
    };

    const handleInteractionStart = useCallback(() => {
        setIsInteracting(true);
        isDraggingAnyRef.current = true;
        setIsDraggingAny(true); // 💡 터치 즉시 부모 스크롤을 막기 위해 상태 즉시 업데이트
    }, []);
    const handleInteractionEnd = useCallback(() => {
        setIsInteracting(false);
        isDraggingAnyRef.current = false;
        setIsDraggingAny(false);
        setIsOverTrash(false);
    }, []);

    // 🗑️ 쓰레기통 영역 계산 (화면 하단 80px)
    const screenHeight = Dimensions.get('window').height;
    const TRASH_ZONE_TOP = screenHeight - 140; // 하단 140px 지점부터 쓰레기통 영역

    /**
     * 🗑️ 드래그 중 실시간 위치 감지 (쓰레기통 영역 판단)
     */
    const handleDragMove = useCallback((itemId, pageX, pageY, itemType = 'sticker') => {
        if (!isDraggingAnyRef.current) {
            // 드래그가 시작되면 부모 스크롤을 막기 위해 상태를 업데이트합니다.
            isDraggingAnyRef.current = true;
            setIsDraggingAny(true);
            draggingItemId.current = itemId;
            draggingItemType.current = itemType;
        }
        // [쓰레기통 판정] 손가락 위치(pageY)가 화면 하단 임계값을 넘으면 쓰레기통 활성화
        setIsOverTrash(pageY > TRASH_ZONE_TOP);
    }, [TRASH_ZONE_TOP]); // 💡 isDraggingAny 대신 Ref를 사용하므로 의존성에서 제거 → 콜백 안정화

    /**
     * 🗑️ 드롭 시 쓰레기통 위인지 판단 → 삭제 처리
     */
    const handleDragDrop = useCallback((itemId, pageX, pageY, itemType = 'sticker') => {
        const overTrash = pageY > TRASH_ZONE_TOP;
        isDraggingAnyRef.current = false;
        setIsDraggingAny(false);
        setIsOverTrash(false);

        if (overTrash) {
            // 아이템 타입에 따라 적절한 삭제 함수 호출
            const type = draggingItemType.current || itemType;
            if (type === 'sticker') {
                handleDeleteSticker(itemId);
            } else if (type === 'photo') {
                handleDeletePhoto(itemId);
            } else if (type === 'text') {
                handleDeleteText(itemId);
            }
            return true;
        }
        return false;
    }, [TRASH_ZONE_TOP, handleDeleteSticker, handleDeletePhoto, handleDeleteText]);

    // 스티커용 래퍼 (타입 태깅)
    const handleStickerDragMove = useCallback((id, px, py) => handleDragMove(id, px, py, 'sticker'), [handleDragMove]);
    const handleStickerDragDrop = useCallback((id, px, py) => handleDragDrop(id, px, py, 'sticker'), [handleDragDrop]);
    const handlePhotoDragMove = useCallback((id, px, py) => handleDragMove(id, px, py, 'photo'), [handleDragMove]);
    const handlePhotoDragDrop = useCallback((id, px, py) => handleDragDrop(id, px, py, 'photo'), [handleDragDrop]);
    const handleTextDragMove = useCallback((id, px, py) => handleDragMove(id, px, py, 'text'), [handleDragMove]);
    const handleTextDragDrop = useCallback((id, px, py) => handleDragDrop(id, px, py, 'text'), [handleDragDrop]);

    /**
     * 🎯 선택 상태 관리
     */
    const handleSelect = useCallback((id) => {
        setSelectedItemId(id);
    }, []);

    const handleClearSelection = useCallback(() => {
        setSelectedItemId(null);
    }, []);

    return {
        // Properties
        loading, // 🎬 DB 데이터 로딩 상태 (Staggered Reveal 트리거용)
        isDataInitialized, // 🎬 알맹이 페칭+상태 동기화 완전히 끝남
        isMoodModalVisible,
        setMoodModalVisible,
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
        setAlertConfig,

        // 멀티페이지
        pages,
        pageStickers,
        pagePhotos,
        pageBackgrounds,
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

        // Ad Models
        isTextLimitModalVisible,
        setTextLimitModalVisible,
        handleAdReward,
        handleAdRewardForText,
        adBonusTexts,

        // ✏️ Text state
        pageTexts,
        showTexts,
        setShowTexts,
        handleAddText,
        handleDeleteText,
        handleTextDragEnd,
        handleCanvasTap,
        handleUpdateText,

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

        // 📷 Photo
        showPhotos,
        setShowPhotos,
        handleAddPhoto,
        handleDeletePhoto,
        handlePhotoDragEnd,
        handlePickPhotoForId,

        // 🎨 Background
        showBackgrounds,
        setShowBackgrounds,
        handleChangeBackground,

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

        // 🪄 Magic Decorate (다꾸 가챠)
        handleMagicDecorate,
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
    };
}

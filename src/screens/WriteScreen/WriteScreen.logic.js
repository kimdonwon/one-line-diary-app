import { useState, useEffect, useMemo } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MOOD_LIST } from '../../constants/mood';
import { ACTIVITIES } from '../../constants/activities';
import { STICKER_CATEGORIES, STICKER_PACK_DATA } from '../../constants/stickers';
import { BACKGROUNDS, BG_CATEGORIES, getBackgroundById } from '../../constants/backgrounds';
import { useDiaryForDate, useActivitiesForDate, saveDiary, saveActivities } from '../../hooks/useDiary';
import { getSetting, saveSetting } from '../../database/db';
import { usePremium } from '../../hooks/usePremium';

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
    const MAX_PAGES = 5;
    const [pages, setPages] = useState(['']);
    const [pageStickers, setPageStickers] = useState([[]]);
    const [pagePhotos, setPagePhotos] = useState([[]]); // 📷 페이지별 사진 배열
    const [showPhotos, setShowPhotos] = useState(false); // 📷 사진(프레임 선택) 서랍 열림 상태
    const [pageTexts, setPageTexts] = useState([[]]); // ✏️ 페이지별 텍스트(커스텀) 스티커 배열
    const [showTexts, setShowTexts] = useState(false); // ✏️ 텍스트 서랍 열림 상태
    const [pageBackgrounds, setPageBackgrounds] = useState(['default']); // 🎨 페이지별 배경지 ID
    const [showBackgrounds, setShowBackgrounds] = useState(false); // 배경지 서랍 열림 상태
    const [currentPageIndex, setCurrentPageIndex] = useState(0);
    const MAX_PHOTOS_PER_PAGE = isPremium ? 5 : 1; // 프리미엄 5장, 무료 1장

    // 현재 페이지의 content와 stickers (편의용 alias)
    const content = pages[currentPageIndex] || '';
    const stickers = pageStickers[currentPageIndex] || [];

    const [inputBoxBounds, setInputBoxBounds] = useState({ width: 0, height: 0, x: 0, y: 0 });
    const [isStickerLimitModalVisible, setStickerLimitModalVisible] = useState(false);

    // 🔔 커스텀 알림 상태 추가
    const [showAlert, setShowAlert] = useState(false);
    const [alertConfig, setAlertConfig] = useState({ title: '', message: '' });

    // (프리미엄 상태는 usePremium 훅에서 관리)

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
                        parsedTexts = rawTexts;
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
    }, [diary]);

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
     * 🗑️ 현재 페이지 삭제 (최소 1페이지는 유지)
     */
    const deletePage = (index) => {
        if (pages.length <= 1) return;

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
        const baseLimit = isPremium ? 15 : 3;
        // 🚫 페이지당 최대 15개까지만 허용 (광고 보너스 포함)
        const pageLimit = Math.min(baseLimit + adBonusStickers, 15);

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

        // [수정] 현재 상태에 맞춰 스마트하게 한도 증설
        // 이미 소프트 패스로 인해 한도가 늘어난 것처럼 보일 수 있으므로, 
        // '실제 붙은 개수'와 '현재 이론적 제한' 중 큰 값에 +2를 해줍니다.
        const baseLimit = 3;
        const currentPageStickers = pageStickers[currentPageIndex]?.length || 0;
        const currentEffectiveLimit = Math.max(baseLimit + adBonusStickers, currentPageStickers);

        // 새로운 보너스 = (새로운 목표 한도) - (기본 한도)
        const nextBonus = (currentEffectiveLimit + 2) - baseLimit;

        setAdBonusStickers(nextBonus);
        setStickerLimitModalVisible(false);

        setAlertConfig({
            title: '광고 보상 🎁',
            message: `보너스 스티커가 추가되어 이제 최대 ${baseLimit + nextBonus}개까지 붙일 수 있어요! ✨`
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
            while (trimmedPages.length > 1 && trimmedPages[trimmedPages.length - 1] === '' && (pageStickers[trimmedPages.length - 1] || []).length === 0 && (pagePhotos[trimmedPages.length - 1] || []).length === 0) {
                trimmedPages.pop();
            }
            const stickersToSave = pageStickers.slice(0, trimmedPages.length);
            const photosToSave = pagePhotos.slice(0, trimmedPages.length);
            const textsToSave = pageTexts.slice(0, trimmedPages.length);

            // 단일 페이지면 레거시 호환을 위해 문자열/1차원 배열로 저장
            const contentToSave = trimmedPages.length === 1 ? trimmedPages[0] : JSON.stringify(trimmedPages);
            const stickersStrToSave = trimmedPages.length === 1 ? JSON.stringify(stickersToSave[0] || []) : JSON.stringify(stickersToSave);
            const photosStrToSave = JSON.stringify(photosToSave);
            const textsStrToSave = JSON.stringify(textsToSave);
            const bgsToSave = pageBackgrounds.slice(0, trimmedPages.length);
            const bgsStrToSave = JSON.stringify(bgsToSave);

            await saveDiary(date, contentToSave, selectedMood, stickersStrToSave, photosStrToSave, bgsStrToSave, textsStrToSave);
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

    // ─── 📷 사진 첨부 로직 ───

    /**
     * 📷 갤러리에서 사진 선택 (1:1 크롭, 압축) 및 프레임 지정
     */
    const handleAddPhoto = async (frameType = 'white') => {
        const currentPhotos = pagePhotos[currentPageIndex] || [];
        if (currentPhotos.length >= MAX_PHOTOS_PER_PAGE) {
            setAlertConfig({
                title: '사진 제한 📷',
                message: `한 페이지에 사진은 최대 ${MAX_PHOTOS_PER_PAGE}장까지만 넣을 수 있어요!`
            });
            setShowAlert(true);
            return;
        }

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
            aspect: [1, 1],    // 1:1 정방형 크롭 강제
            quality: 0.5,      // 50% 품질 (용량 절약)
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            const asset = result.assets[0];
            const spawnX = inputBoxBounds.width > 0 ? inputBoxBounds.width / 2 - 65 : 40;
            const spawnY = inputBoxBounds.height > 0 ? inputBoxBounds.height / 2 - 72 : 40;

            const newPhoto = {
                id: Date.now().toString() + Math.random().toString(36).substring(7),
                uri: asset.uri,
                x: spawnX,
                y: spawnY,
                rotation: 0,
                frameType,
            };

            setPagePhotos(prev => {
                const next = [...prev];
                next[currentPageIndex] = [...(next[currentPageIndex] || []), newPhoto];
                return next;
            });
            setShowPhotos(false); // 선택 후 프레임 서랍 닫기
        }
    };

    const handleDeletePhoto = (id) => {
        setPagePhotos(prev => {
            const next = [...prev];
            next[currentPageIndex] = (next[currentPageIndex] || []).filter(p => p.id !== id);
            return next;
        });
    };

    const handlePhotoDragEnd = (id, newX, newY, newRotation) => {
        setPagePhotos(prev => {
            const next = [...prev];
            next[currentPageIndex] = (next[currentPageIndex] || []).map(p =>
                p.id === id ? { ...p, x: newX, y: newY, rotation: newRotation !== undefined ? newRotation : (p.rotation || 0) } : p
            );
            return next;
        });
    };

    // ─── ✏️ 커스텀 텍스트 드래그 기능 추가 ───

    const handleAddText = (textValue, fontId, color, bgColor) => {
        if (!textValue || textValue.trim().length === 0) return;

        const spawnX = inputBoxBounds.width > 0 ? inputBoxBounds.width / 2 - 50 : 60;
        const spawnY = inputBoxBounds.height > 0 ? inputBoxBounds.height / 2 - 20 : 60;

        const newText = {
            id: Date.now().toString() + Math.random().toString(36).substring(7),
            text: textValue,
            fontId,
            color,
            bgColor,
            x: spawnX,
            y: spawnY,
            rotation: 0,
        };

        setPageTexts(prev => {
            const next = [...prev];
            next[currentPageIndex] = [...(next[currentPageIndex] || []), newText];
            return next;
        });
        setShowTexts(false); // 추가 후 패널 닫기
    };

    const handleDeleteText = (id) => {
        setPageTexts(prev => {
            const next = [...prev];
            next[currentPageIndex] = (next[currentPageIndex] || []).filter(t => t.id !== id);
            return next;
        });
    };

    const handleTextDragEnd = (id, newX, newY, newRotation) => {
        setPageTexts(prev => {
            const next = [...prev];
            next[currentPageIndex] = (next[currentPageIndex] || []).map(t =>
                t.id === id ? { ...t, x: newX, y: newY, rotation: newRotation !== undefined ? newRotation : (t.rotation || 0) } : t
            );
            return next;
        });
    };

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

        // ✏️ Text state
        pageTexts,
        showTexts,
        setShowTexts,
        handleAddText,
        handleDeleteText,
        handleTextDragEnd,

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
    };
}

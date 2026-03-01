import { useState, useEffect, useCallback } from 'react';
import { getMoodByKey } from '../../constants/mood';
import { useLock } from '../../context/LockContext';
import { getSetting, saveSetting } from '../../database/db';
import { STICKER_PACK_DATA } from '../../constants/stickers';
import * as LocalAuthentication from 'expo-local-authentication';

/**
 * ⚙️ 설정 화면용 비즈니스 로직 훅입니다.
 */
export function useSettingsLogic() {
    const { isLockEnabled, password, updateLockSettings } = useLock();
    const defaultMood = getMoodByKey('HAPPY');

    // 프리미엄 상태
    const [isPremium, setIsPremium] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertConfig, setAlertConfig] = useState({ title: '', message: '' });

    // PIN 모달 상태
    const [showPinModal, setShowPinModal] = useState(false);
    const [pinMode, setPinMode] = useState('setup'); // 'setup' | 'change'

    // 구매된 스티커 팩 상태
    const [purchasedPacks, setPurchasedPacks] = useState([]);

    useEffect(() => {
        loadPremiumStatus();
        loadPurchasedPacks();
    }, []);

    const loadPremiumStatus = async () => {
        try {
            const val = await getSetting('isPremium');
            setIsPremium(val === 'true');
        } catch (e) {
            console.log('Failed to load premium status:', e);
        }
    };

    const loadPurchasedPacks = async () => {
        try {
            const val = await getSetting('purchasedPacks');
            if (val) setPurchasedPacks(JSON.parse(val));
        } catch (e) {
            console.log('Failed to load purchased packs:', e);
        }
    };

    // 스티커 팩 (무료) 다운로드 / 구매 처리
    const handleBuyStickerPack = async (pack) => {
        // 이미 보유 중인지 확인
        if (purchasedPacks.includes(pack.catId)) return;

        // 무료가 아닌 경우 결제 로직 (현재는 더미)
        if (!pack.isFree) {
            setAlertConfig({
                title: '스티커 팩 구매 💳',
                message: `[${pack.title}] 팩을 ${pack.price || '1,100'}원에 구매하시겠습니까? (더미 결제)`
            });
            setShowAlert(true);
            return;
        }

        // 무료 팩 바로 다운로드
        await confirmBuyPack(pack.catId, pack.title);
    };

    const confirmBuyPack = async (catId, title) => {
        const newPurchased = [...purchasedPacks, catId];
        setPurchasedPacks(newPurchased);
        await saveSetting('purchasedPacks', JSON.stringify(newPurchased));

        // 서랍 상태에도 강제로 추가해줌
        try {
            const enabledVal = await getSetting('enabledStickerCats');
            const enabled = enabledVal ? JSON.parse(enabledVal) : ['emoji', 'legacy', 'pastel'];
            if (!enabled.includes(catId)) {
                await saveSetting('enabledStickerCats', JSON.stringify([...enabled, catId]));
            }

            // 순서에도 추가
            const orderVal = await getSetting('stickerCatOrder');
            const order = orderVal ? JSON.parse(orderVal) : ['emoji', 'legacy', 'pastel'];
            if (!order.includes(catId)) {
                await saveSetting('stickerCatOrder', JSON.stringify([...order, catId]));
            }
        } catch (e) { }

        setShowPreview(false);
        setAlertConfig({
            title: '다운로드 완료! 🎉',
            message: `[${title}] 팩이 스티커 서랍에 추가되었습니다.`
        });
        setShowAlert(true);
    };

    // 보안 확인 (생체인증 지원 시 인증 요구)
    const verifySecurity = async (promptMessage) => {
        try {
            const hasHardware = await LocalAuthentication.hasHardwareAsync();
            const isEnrolled = await LocalAuthentication.isEnrolledAsync();

            if (hasHardware && isEnrolled) {
                const result = await LocalAuthentication.authenticateAsync({
                    promptMessage: promptMessage,
                    cancelLabel: '취소',
                    disableDeviceFallback: true,
                });
                return result.success;
            }
            // 기기에 생체인증이 없을 경우 일단 통과 (추후 기존 비밀번호 입력 모달 추가 가능)
            return true;
        } catch (e) {
            console.log('Biometric verification failed:', e);
            return true;
        }
    };

    // 잠금 토글 처리
    const toggleLock = async () => {
        if (!isLockEnabled) {
            // 잠금 활성화 확인
            const isVerified = await verifySecurity('앱 잠금을 설정하려면 인증해주세요');
            if (isVerified) {
                setPinMode('setup');
                setShowPinModal(true);
            }
        } else {
            // 잠금 비활성화 확인
            const isVerified = await verifySecurity('앱 잠금을 해제하려면 인증해주세요');
            if (isVerified) {
                await updateLockSettings(false, '');
            }
        }
    };

    // PIN 모달 완료 콜백
    const handlePinComplete = async (pin) => {
        if (pinMode === 'setup') {
            await updateLockSettings(true, pin);
        } else {
            // 비밀번호 변경
            await updateLockSettings(true, pin);
        }
        setShowPinModal(false);
    };

    // 비밀번호 변경 처리
    const changePassword = async () => {
        const isVerified = await verifySecurity('비밀번호를 변경하려면 인증해주세요');
        if (isVerified) {
            setPinMode('change');
            setShowPinModal(true);
        }
    };

    // 프리미엄 토글 (개발용)
    const togglePremium = async () => {
        const newVal = !isPremium;
        setIsPremium(newVal);
        await saveSetting('isPremium', String(newVal));
    };

    // 프리미엄 결제 버튼 클릭 (더미)
    const handlePremiumPress = () => {
        if (isPremium) {
            setAlertConfig({
                title: '이미 프리미엄 회원이에요! ✨',
                message: '모든 기능을 마음껏 사용하고 계십니다.'
            });
            setShowAlert(true);
            return;
        }

        setAlertConfig({
            title: '프리미엄 구매 (더미) 💳',
            message: '5,000원으로 오늘조각 프리미엄을 평생 소장하시겠습니까? (한 번 결제로 모든 기능 영구 이용)'
        });
        setShowAlert(true);
    };

    const confirmPremium = async () => {
        const isBuyingPack = alertConfig.title === '스티커 팩 구매 💳';
        const isBuyingPremium = alertConfig.title === '프리미엄 구매 (더미) 💳';
        setShowAlert(false);

        if (isBuyingPack) {
            // 현재 미리보기 중인 팩 결제 완료 처리
            if (selectedPack) {
                await confirmBuyPack(selectedPack.catId, selectedPack.title);
            }
            return;
        }

        // 프리미엄 결제 모달을 통한 명시적 확인 시에만 프리미엄이 되도록 조건을 엄격하게 체크
        if (isBuyingPremium && !isPremium) {
            await togglePremium();
        }
    };

    const [showPreview, setShowPreview] = useState(false);
    const [selectedPack, setSelectedPack] = useState(null);

    // 스티커 상점 접기/펴기 상태
    const [isShopExpanded, setIsShopExpanded] = useState(true);

    // 모든 구매 내역 및 프리미엄 초기화 (테스트용)
    const resetPurchases = async () => {
        try {
            // 1. 상태 초기화
            setIsPremium(false);
            setPurchasedPacks([]);

            // 2. DB 업데이트 (app_settings)
            await saveSetting('isPremium', 'false');
            await saveSetting('purchasedPacks', JSON.stringify([]));

            // 3. 스티커 카테고리 설정 초기화 (기본값으로 복구)
            const defaultCats = STICKER_PACK_DATA.filter(p => p.isDefault).map(p => p.catId);
            await saveSetting('enabledStickerCats', JSON.stringify(defaultCats));
            await saveSetting('stickerCatOrder', JSON.stringify(defaultCats));

            setAlertConfig({
                title: '초기화 완료! ♻️',
                message: '프리미엄 상태 및 스티커 구매 내역이 모두 초기화되었습니다.'
            });
            setShowAlert(true);
        } catch (e) {
            console.log('Failed to reset purchases:', e);
        }
    };

    return {
        defaultMood,
        isLockEnabled,
        password,
        showPinModal,
        setShowPinModal,
        isPremium,
        showAlert,
        alertConfig,
        setShowAlert,
        confirmPremium,
        toggleLock,
        changePassword,
        handlePinComplete,
        handlePremiumPress,
        // 미리보기 모달 상태
        showPreview, setShowPreview,
        selectedPack, setSelectedPack,
        isShopExpanded, setIsShopExpanded,
        purchasedPacks, handleBuyStickerPack,
        resetPurchases
    };
}

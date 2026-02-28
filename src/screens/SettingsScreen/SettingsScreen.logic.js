import { useState, useEffect, useCallback } from 'react';
import { getMoodByKey } from '../../constants/mood';
import { useLock } from '../../context/LockContext';
import { getSetting, saveSetting } from '../../database/db';
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
        if (!pack.isFree && !isPremium) {
            handlePremiumPress();
            return;
        }

        const newPurchased = [...purchasedPacks, pack.catId];
        setPurchasedPacks(newPurchased);
        await saveSetting('purchasedPacks', JSON.stringify(newPurchased));

        // 서랍 상태에도 강제로 추가해줌 (Sticker Pack Manager 연동)
        try {
            const enabledVal = await getSetting('enabledStickerCats');
            const enabled = enabledVal ? JSON.parse(enabledVal) : ['emoji', 'legacy', 'pastel'];
            if (!enabled.includes(pack.catId)) {
                await saveSetting('enabledStickerCats', JSON.stringify([...enabled, pack.catId]));
            }

            // 순서에도 추가
            const orderVal = await getSetting('stickerCatOrder');
            const order = orderVal ? JSON.parse(orderVal) : ['emoji', 'legacy', 'pastel'];
            if (!order.includes(pack.catId)) {
                await saveSetting('stickerCatOrder', JSON.stringify([...order, pack.catId]));
            }
        } catch (e) { }

        setShowPreview(false);
        setAlertConfig({
            title: '다운로드 완료! 🎉',
            message: `[${pack.title}] 팩이 스티커 서랍에 추가되었습니다.`
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
            message: '구글 플레이 결제 창이 나중에 여기에 연동될 예정입니다. 지금은 테스트를 위해 바로 활성화해 드릴까요?'
        });
        setShowAlert(true);
    };

    const confirmPremium = async () => {
        setShowAlert(false);
        if (!isPremium) {
            await togglePremium();
        }
    };

    const [showPreview, setShowPreview] = useState(false);
    const [selectedPack, setSelectedPack] = useState(null);

    // 스티커 상점 접기/펴기 상태
    const [isShopExpanded, setIsShopExpanded] = useState(true);

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
        purchasedPacks, handleBuyStickerPack
    };
}

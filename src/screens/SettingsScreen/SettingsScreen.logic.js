import { useState, useEffect, useCallback } from 'react';
import { getMoodByKey } from '../../constants/mood';
import { useLock } from '../../context/LockContext';
import { getSetting, saveSetting } from '../../database/db';
import { STICKER_PACK_DATA, STICKER_CATEGORIES } from '../../constants/stickers';
import * as LocalAuthentication from 'expo-local-authentication';
import * as BackupRestore from '../../utils/backupRestore';
import { restoreFromData } from '../../database/db';
import { Alert, DevSettings } from 'react-native';
import { usePremium } from '../../hooks/usePremium';

/**
 * ⚙️ 설정 화면용 비즈니스 로직 훅입니다.
 */
export function useSettingsLogic() {
    const { isLockEnabled, password, updateLockSettings } = useLock();
    const defaultMood = getMoodByKey('HAPPY');

    // 프리미엄 상태 (체험판 포함)
    const { isPremium, isTrial, hasPremiumBenefits } = usePremium();
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
        // 프리미엄 상태는 usePremium 훅에서 관리하므로 삭제
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

        // 파스텔 팩은 프리미엄(또는 체험판) 혜택으로 무료
        const isPastelPack = pack.catId === 'pastel';
        const isEffectivelyFree = pack.isFree || (isPastelPack && hasPremiumBenefits);

        // 무료가 아닌 경우 결제 로직 (현재는 더미)
        if (!isEffectivelyFree) {
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
        await saveSetting('isPremium', String(newVal));
        Alert.alert('알림', '프리미엄 상태가 변경되었습니다. 앱을 재실행해 주세요.');
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
            title: '프리미엄 구독 (더미) 💳',
            message: '연 5,900원으로 오늘조각 프리미엄을 구독하시겠습니까? (결제일로부터 1년간 모든 기능 이용)'
        });
        setShowAlert(true);
    };

    const confirmAlert = async () => {
        const isBuyingPack = alertConfig.title === '스티커 팩 구매 💳';
        const isBuyingPremium = alertConfig.title === '프리미엄 구독 (더미) 💳';

        // 커스텀 onConfirm이 있는 경우 실행
        if (alertConfig.onConfirm) {
            await alertConfig.onConfirm();
            setShowAlert(false);
            return;
        }

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

    // 스티커 상점 접기/펴기 상태 및 더보기 상태
    const [isShopExpanded, setIsShopExpanded] = useState(true);
    const [isShopMore, setIsShopMore] = useState(false);

    // 모든 구매 내역 및 프리미엄 초기화 (테스트용)
    const resetPurchases = async () => {
        try {
            // 1. 상태 초기화
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
                message: '프리미엄 상태 및 스티커 구매 내역이 모두 초기화되었습니다. 변경사항을 반영하려면 앱을 재실행해 주세요.'
            });
            setShowAlert(true);
        } catch (e) {
            console.log('Failed to reset purchases:', e);
        }
    };

    // 무료버전 강제 전환 (테스트용)
    const forceFreeVersion = async () => {
        try {
            // 프리미엄 해제
            await saveSetting('isPremium', 'false');
            // 체험 기간 종료 (30일 전으로 설정)
            const pastDate = new Date();
            pastDate.setDate(pastDate.getDate() - 30);
            await saveSetting('premiumTrialStartDate', pastDate.toISOString());

            Alert.alert(
                '무료 버전 전환 완료 ⬇️',
                '무료 버전으로 전환되었습니다. 변경사항을 반영하려면 앱을 재실행해 주세요.'
            );
        } catch (e) {
            console.log('Failed to force free version:', e);
        }
    };

    // 모든 일기 데이터 초기화 (테스트용)
    const resetDiaryData = async () => {
        try {
            const { deleteAllDiaryData } = require('../../database/db');
            await deleteAllDiaryData();
            setAlertConfig({
                title: '일기 초기화 완료! 🗑️',
                message: '모든 일기, 활동, 댓글 기록이 삭제되었습니다.'
            });
            setShowAlert(true);
        } catch (e) {
            console.log('Failed to reset diary data:', e);
        }
    };

    // ─── 백업 및 복구 ───

    // 데이터 내보내기 (통합 공유: 구글 드라이브, 카카오톡 등)
    const handleExportSharing = async () => {
        try {
            const success = await BackupRestore.exportToShareSheet();
            if (success) {
                setAlertConfig({
                    title: '데이터 내보내기 완료 ✨',
                    message: '백업 파일을 원하는 곳에 안전하게 보관해 주세요.'
                });
                setShowAlert(true);
            }
        } catch (error) {
            Alert.alert('실패', '파일을 생성하거나 공유하는 도중 문제가 생겼습니다.');
        }
    };

    // 데이터 불러오기 (복원)
    const handleImportBackup = async () => {
        try {
            const data = await BackupRestore.importFromFile();
            if (!data) return; // 취소된 경우

            setAlertConfig({
                title: '데이터 복원 확인 📥',
                message: '백업 파일을 불러오시겠습니까? 기존의 모든 데이터(일기, 설정 등)가 덮어씌워집니다. 이 작업은 되돌릴 수 없습니다.',
                onConfirm: async () => {
                    await restoreFromData(data);
                    Alert.alert('복원 완료 🎉', '데이터가 성공적으로 복구되었습니다. 앱을 완전히 종료 후 다시 실행해 주세요.', [
                        { text: '확인' }
                    ]);
                }
            });
            setShowAlert(true);
        } catch (error) {
            Alert.alert('복원 실패', error.message || '파일을 불러오는 도중 문제가 생겼습니다.');
        }
    };

    // 구매 내역 복원 (더미 로직)
    const handleRestorePurchases = async () => {
        try {
            // 실제 구현 시에는 이 부분에서 인앱 결제 라이브러리의 restore 기능을 호출합니다.
            // 여기서는 2초 뒤에 성공하는 더미 로직으로 구현합니다.
            setAlertConfig({
                title: '구매 내역 확인 중... 🔎',
                message: 'Apple/Google 계정에서 과거 구매 내역을 찾는 중입니다.'
            });
            setShowAlert(true);

            setTimeout(async () => {
                // 더미 데이터 복원 (무조건 성공 가정)
                await saveSetting('isPremium', 'true');
                setIsPremium(true);

                // 모든 유료 팩을 구매한 것으로 처리 예시 (테스트용)
                const paidPacks = STICKER_PACK_DATA.filter(p => !p.isFree).map(p => p.catId);
                await saveSetting('purchasedPacks', JSON.stringify(paidPacks));
                setPurchasedPacks(paidPacks);

                setAlertConfig({
                    title: '구매 내역 복원 완료! ✨',
                    message: '과거에 구매하신 프리미엄 혜택과 스티커 팩이 모두 복구되었습니다.'
                });
                setShowAlert(true);
            }, 2000);

        } catch (error) {
            Alert.alert('복원 실패', '스토어 인증에 실패했습니다.');
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
        confirmPremium: confirmAlert,
        toggleLock,
        changePassword,
        handlePinComplete,
        handlePremiumPress,
        // 미리보기 모달 상태
        showPreview, setShowPreview,
        selectedPack, setSelectedPack,
        isShopExpanded, setIsShopExpanded,
        purchasedPacks, handleBuyStickerPack,
        resetPurchases, resetDiaryData,
        // 백업 및 복원
        handleExportBackup: handleExportSharing,
        handleImportBackup,
        handleRestorePurchases,
        isShopMore,
        setIsShopMore,
        isTrial,
        hasPremiumBenefits,
        forceFreeVersion
    };
}

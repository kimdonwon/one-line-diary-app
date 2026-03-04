import { useState, useEffect } from 'react';
import { getSetting } from '../database/db';

/**
 * 💎 프리미엄 멤버십 및 2주 체험판 상태를 관리하는 커스텀 훅입니다.
 *
 * 반환값:
 * - isPremium: 정식 프리미엄 결제 여부
 * - isTrial: 2주 무료 체험 기간 내 여부
 * - hasPremiumBenefits: 프리미엄 혜택 적용 대상 (isPremium || isTrial)
 * - loading: 상태 로딩 중 여부
 */
export function usePremium() {
    const [isPremium, setIsPremium] = useState(false);
    const [isTrial, setIsTrial] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkPremiumStatus = async () => {
            try {
                const isPremiumVal = await getSetting('isPremium');
                const trialStartVal = await getSetting('premiumTrialStartDate');

                const isPremiumActive = isPremiumVal === 'true';

                let isTrialActive = false;
                if (!isPremiumActive && trialStartVal) {
                    const startDate = new Date(trialStartVal);
                    const now = new Date();
                    const diffDays = (now - startDate) / (1000 * 60 * 60 * 24);

                    // 14일(2주) 무료 체험
                    if (diffDays >= 0 && diffDays <= 14) {
                        isTrialActive = true;
                    }
                }

                setIsPremium(isPremiumActive);
                setIsTrial(isTrialActive);
            } catch (e) {
                console.error('[usePremium] Failed to check status:', e);
            } finally {
                setLoading(false);
            }
        };

        checkPremiumStatus();
    }, []);

    // 프리미엄 혜택 적용 대상 여부 (진짜 프리미엄이거나 체험판이거나)
    const hasPremiumBenefits = isPremium || isTrial;

    return {
        isPremium,
        isTrial,
        hasPremiumBenefits,
        loading
    };
}

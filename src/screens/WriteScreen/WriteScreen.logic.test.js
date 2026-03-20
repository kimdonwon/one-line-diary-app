import { renderHook, act } from '@testing-library/react-native';
import { useWriteLogic } from './WriteScreen.logic';
import { SYSTEM_LIMITS } from '../../constants/limits';
import { usePremium } from '../../hooks/usePremium';

// ─── 의존성 모킹 (Mocking) ───
jest.mock('expo-image-picker', () => ({
    requestMediaLibraryPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
    launchImageLibraryAsync: jest.fn().mockResolvedValue({ canceled: false, assets: [{ uri: 'test.jpg' }] }),
}));

jest.mock('../../hooks/useDiary', () => ({
    useDiaryForDate: jest.fn().mockReturnValue({ diary: null, loading: false }),
    useActivitiesForDate: jest.fn().mockReturnValue({ activities: [] }),
    saveDiary: jest.fn().mockResolvedValue(),
    saveActivities: jest.fn().mockResolvedValue(),
}));

jest.mock('../../database/db', () => ({
    getSetting: jest.fn().mockResolvedValue(null),
    saveSetting: jest.fn().mockResolvedValue(),
}));

jest.mock('../../hooks/usePremium', () => ({
    usePremium: jest.fn(),
}));

describe('WriteScreen.logic 통합 테스트 (제약 조건 검증)', () => {
    const mockNavigation = {
        addListener: jest.fn().mockReturnValue(jest.fn()),
        goBack: jest.fn(),
    };
    const mockRoute = { params: { date: '2026-03-19' } };
    const mockScrollRef = { current: { scrollToEnd: jest.fn() } };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('1. 페이지 생성 제약 테스트', () => {
        it(`최대 \${SYSTEM_LIMITS.MAX_PAGES}장까지만 페이지를 추가할 수 있어야 한다.`, async () => {
            // Free Tier 가정
            usePremium.mockReturnValue({ hasPremiumBenefits: false });

            const { result } = renderHook(() => useWriteLogic(mockRoute, mockNavigation, mockScrollRef));

            // 최초 진입 시 1페이지가 존재하므로 MAX_PAGES - 1 번 추가 가능
            for (let i = 0; i < SYSTEM_LIMITS.MAX_PAGES - 1; i++) {
                act(() => {
                    result.current.addPage();
                });
            }

            // 이때까지는 정상적으로 추가되어야 함
            expect(result.current.pages.length).toBe(SYSTEM_LIMITS.MAX_PAGES);

            // 한도를 넘는 추가 시도
            act(() => {
                result.current.addPage();
            });

            // 내부 pages 배열 길이가 증가하지 않고 한도에 머물러야 함
            expect(result.current.pages.length).toBe(SYSTEM_LIMITS.MAX_PAGES);
            
            // 경고 알림(Alert) 상태가 켜졌는지 확인
            expect(result.current.showAlert).toBe(true);
            expect(result.current.alertConfig.title).toBe('페이지 제한');
        });
    });

    describe('2. 무료 등급 (Free Tier) 에셋 한도 테스트', () => {
        beforeEach(() => {
            usePremium.mockReturnValue({ hasPremiumBenefits: false });
        });

        it(`무료 사용자는 스티커를 \${SYSTEM_LIMITS.FREE_TIER.MAX_STICKERS}개까지만 붙일 수 있어야 한다.`, () => {
            const { result } = renderHook(() => useWriteLogic(mockRoute, mockNavigation, mockScrollRef));

            for (let i = 0; i < SYSTEM_LIMITS.FREE_TIER.MAX_STICKERS; i++) {
                act(() => {
                    result.current.handleStickerPress('sticker_id_test');
                });
            }

            // 현재 페이지의 스티커 수 검증
            expect(result.current.pageStickers[0].length).toBe(SYSTEM_LIMITS.FREE_TIER.MAX_STICKERS);

            // 한도 초과 스티커 추가 시도
            act(() => {
                result.current.handleStickerPress('sticker_id_extra');
            });

            // 제한 모달이 뜨고 스티커 수는 늘어나지 않아야 함
            expect(result.current.pageStickers[0].length).toBe(SYSTEM_LIMITS.FREE_TIER.MAX_STICKERS);
            expect(result.current.isStickerLimitModalVisible).toBe(true);
        });

        it(`무료 사용자는 텍스트 상자를 \${SYSTEM_LIMITS.FREE_TIER.MAX_TEXTS}개까지만 넣을 수 있어야 한다.`, () => {
            const { result } = renderHook(() => useWriteLogic(mockRoute, mockNavigation, mockScrollRef));

            for (let i = 0; i < SYSTEM_LIMITS.FREE_TIER.MAX_TEXTS; i++) {
                act(() => {
                    // 유효한 텍스트 입력 가정
                    result.current.handleAddText('Hello', 'testFont', '#000', 'transparent');
                });
            }

            // 현재 페이지의 텍스트 상자 수 검증
            expect(result.current.pageTexts[0].length).toBe(SYSTEM_LIMITS.FREE_TIER.MAX_TEXTS);

            // 한도 초과 텍스트 상자 추가 시도
            act(() => {
                result.current.handleAddText('Extra Hello', 'testFont', '#000', 'transparent');
            });

            expect(result.current.pageTexts[0].length).toBe(SYSTEM_LIMITS.FREE_TIER.MAX_TEXTS);
            expect(result.current.isTextLimitModalVisible).toBe(true);
        });
    });

    describe('3. 프리미엄 등급 (Premium Tier) 에셋 한도 테스트', () => {
        beforeEach(() => {
            // 프리미엄 혜택 활성화
            usePremium.mockReturnValue({ hasPremiumBenefits: true });
        });

        it(`프리미엄 사용자는 스티커를 \${SYSTEM_LIMITS.PREMIUM_TIER.MAX_STICKERS}개까지 붙일 수 있어야 한다.`, () => {
            const { result } = renderHook(() => useWriteLogic(mockRoute, mockNavigation, mockScrollRef));

            // 프리미엄 한도만큼 추가
            for (let i = 0; i < SYSTEM_LIMITS.PREMIUM_TIER.MAX_STICKERS; i++) {
                act(() => {
                    result.current.handleStickerPress('premium_sticker');
                });
            }

            expect(result.current.pageStickers[0].length).toBe(SYSTEM_LIMITS.PREMIUM_TIER.MAX_STICKERS);

            // 한도 초과 시도
            act(() => {
                result.current.handleStickerPress('extra_sticker');
            });

            expect(result.current.pageStickers[0].length).toBe(SYSTEM_LIMITS.PREMIUM_TIER.MAX_STICKERS);
            expect(result.current.isStickerLimitModalVisible).toBe(true);
        });
    });

    describe('4. 광고 보상 (Ad Reward)을 통한 한도 확장 테스트', () => {
        beforeEach(() => {
            usePremium.mockReturnValue({ hasPremiumBenefits: false });
        });

        it('무료 사용자가 광고를 시청하면 스티커 부착 한도가 증가해야 한다.', () => {
            const { result } = renderHook(() => useWriteLogic(mockRoute, mockNavigation, mockScrollRef));

            // 1. 최대치까지 스티커 부착
            for (let i = 0; i < SYSTEM_LIMITS.FREE_TIER.MAX_STICKERS; i++) {
                act(() => { result.current.handleStickerPress('sticker'); });
            }

            // 2. 광고 보상 함수 호출
            act(() => {
                result.current.handleAdReward();
            });

            // 광고 보상 모달이 닫혀야 함
            expect(result.current.isStickerLimitModalVisible).toBe(false);

            // 3. 광고 시청 후 추가 스티커 부착 시 정상 작동해야 함
            act(() => {
                result.current.handleStickerPress('reward_sticker');
            });

            expect(result.current.pageStickers[0].length).toBe(SYSTEM_LIMITS.FREE_TIER.MAX_STICKERS + 1);
        });
    });
});

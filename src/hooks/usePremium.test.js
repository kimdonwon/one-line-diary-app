import { renderHook, waitFor, act } from '@testing-library/react-native';
import { usePremium } from './usePremium';
import { getSetting } from '../database/db';

jest.mock('../database/db', () => ({
    getSetting: jest.fn(),
}));

beforeEach(() => {
    getSetting.mockReset();
});

// 날짜 헬퍼: 현재 시각 기준으로 N일 전 ISO 문자열 반환
// new Date() 를 직접 모킹하지 않고 hook 실행 시점과 동일한 기준을 사용
function daysAgoISO(days) {
    return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
}

describe('usePremium — 프리미엄 상태 관리', () => {

    describe('1. 정식 프리미엄 결제 사용자', () => {
        it('isPremium=true 이면 hasPremiumBenefits=true 를 반환해야 한다', async () => {
            getSetting.mockImplementation((key) => {
                if (key === 'isPremium') return Promise.resolve('true');
                if (key === 'premiumTrialStartDate') return Promise.resolve(null);
                return Promise.resolve(null);
            });

            const { result } = renderHook(() => usePremium());

            await waitFor(() => expect(result.current.loading).toBe(false));

            expect(result.current.isPremium).toBe(true);
            expect(result.current.isTrial).toBe(false);
            expect(result.current.hasPremiumBenefits).toBe(true);
        });

        it('체험 기간이 만료된 후에도 결제 상태면 hasPremiumBenefits=true 이어야 한다', async () => {
            getSetting.mockImplementation((key) => {
                if (key === 'isPremium') return Promise.resolve('true');
                if (key === 'premiumTrialStartDate') return Promise.resolve(daysAgoISO(30));
                return Promise.resolve(null);
            });

            const { result } = renderHook(() => usePremium());

            await waitFor(() => expect(result.current.loading).toBe(false));

            expect(result.current.isPremium).toBe(true);
            expect(result.current.hasPremiumBenefits).toBe(true);
        });
    });

    describe('2. 무료 체험 기간 (Trial)', () => {
        it('설치 직후(0일)는 isTrial=true, hasPremiumBenefits=true 이어야 한다', async () => {
            getSetting.mockImplementation((key) => {
                if (key === 'isPremium') return Promise.resolve('false');
                if (key === 'premiumTrialStartDate') return Promise.resolve(daysAgoISO(0));
                return Promise.resolve(null);
            });

            const { result } = renderHook(() => usePremium());

            await waitFor(() => expect(result.current.loading).toBe(false));

            expect(result.current.isPremium).toBe(false);
            expect(result.current.isTrial).toBe(true);
            expect(result.current.hasPremiumBenefits).toBe(true);
        });

        it('설치 후 7일(중간)은 isTrial=true 이어야 한다', async () => {
            getSetting.mockImplementation((key) => {
                if (key === 'isPremium') return Promise.resolve('false');
                if (key === 'premiumTrialStartDate') return Promise.resolve(daysAgoISO(7));
                return Promise.resolve(null);
            });

            const { result } = renderHook(() => usePremium());

            await waitFor(() => expect(result.current.loading).toBe(false));

            expect(result.current.isTrial).toBe(true);
            expect(result.current.hasPremiumBenefits).toBe(true);
        });

        it('경계값: 14일 - 1초(이내)는 isTrial=true 이어야 한다', async () => {
            // 14일 정각을 테스트하면 실행 시간 오차로 불안정 — 14일에서 1초 뺀 값으로 경계 검증
            const justInsideTrial = new Date(Date.now() - (14 * 24 * 60 * 60 * 1000 - 1000)).toISOString();

            getSetting.mockImplementation((key) => {
                if (key === 'isPremium') return Promise.resolve('false');
                if (key === 'premiumTrialStartDate') return Promise.resolve(justInsideTrial);
                return Promise.resolve(null);
            });

            const { result } = renderHook(() => usePremium());

            await waitFor(() => expect(result.current.loading).toBe(false));

            expect(result.current.isTrial).toBe(true);
            expect(result.current.hasPremiumBenefits).toBe(true);
        });

        it('경계값: 14일 + 1초(초과)는 isTrial=false 이어야 한다', async () => {
            const justOutsideTrial = new Date(Date.now() - (14 * 24 * 60 * 60 * 1000 + 1000)).toISOString();

            getSetting.mockImplementation((key) => {
                if (key === 'isPremium') return Promise.resolve('false');
                if (key === 'premiumTrialStartDate') return Promise.resolve(justOutsideTrial);
                return Promise.resolve(null);
            });

            const { result } = renderHook(() => usePremium());

            await waitFor(() => expect(result.current.loading).toBe(false));

            expect(result.current.isTrial).toBe(false);
            expect(result.current.hasPremiumBenefits).toBe(false);
        });
    });

    describe('3. 무료 사용자 (체험 만료)', () => {
        it('isPremium=false, 체험 만료 시 모든 혜택 플래그가 false 이어야 한다', async () => {
            getSetting.mockImplementation((key) => {
                if (key === 'isPremium') return Promise.resolve('false');
                if (key === 'premiumTrialStartDate') return Promise.resolve(daysAgoISO(30));
                return Promise.resolve(null);
            });

            const { result } = renderHook(() => usePremium());

            await waitFor(() => expect(result.current.loading).toBe(false));

            expect(result.current.isPremium).toBe(false);
            expect(result.current.isTrial).toBe(false);
            expect(result.current.hasPremiumBenefits).toBe(false);
        });

        it('trialStartDate 가 없으면 isTrial=false 이어야 한다', async () => {
            getSetting.mockImplementation((key) => {
                if (key === 'isPremium') return Promise.resolve('false');
                if (key === 'premiumTrialStartDate') return Promise.resolve(null);
                return Promise.resolve(null);
            });

            const { result } = renderHook(() => usePremium());

            await waitFor(() => expect(result.current.loading).toBe(false));

            expect(result.current.isTrial).toBe(false);
            expect(result.current.hasPremiumBenefits).toBe(false);
        });
    });

    describe('4. 로딩 상태', () => {
        it('DB 조회 완료 전까지 loading=true 이어야 한다', async () => {
            // getSetting 은 순차 await: 1번 resolve 후 2번 호출됨
            let resolvers = [];
            getSetting.mockImplementation(() => new Promise(r => resolvers.push(r)));

            const { result } = renderHook(() => usePremium());

            // 첫 번째 getSetting 호출 등록 대기
            await waitFor(() => expect(resolvers).toHaveLength(1));
            expect(result.current.loading).toBe(true);

            // 첫 번째 resolve → 두 번째 getSetting 호출 트리거
            await act(async () => { resolvers[0]('false'); });

            // 두 번째 getSetting 호출 등록 대기
            await waitFor(() => expect(resolvers).toHaveLength(2));

            // 두 번째 resolve → loading 완료
            await act(async () => { resolvers[1](null); });

            await waitFor(() => expect(result.current.loading).toBe(false));
        });

        it('DB 조회 실패 시 크래시 없이 loading=false 로 종료되어야 한다', async () => {
            getSetting.mockRejectedValue(new Error('DB error'));

            const { result } = renderHook(() => usePremium());

            await waitFor(() => expect(result.current.loading).toBe(false));

            expect(result.current.isPremium).toBe(false);
            expect(result.current.hasPremiumBenefits).toBe(false);
        });
    });
});

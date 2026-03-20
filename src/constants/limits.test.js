import { SYSTEM_LIMITS } from './limits';

describe('SYSTEM_LIMITS (시스템 한도 설정) 단위 테스트', () => {
    describe('기본 시스템 한도 (Base Limits)', () => {
        it('텍스트 박스 최대 글자 수는 300자로 설정되어야 한다', () => {
            expect(SYSTEM_LIMITS.MAX_TEXT_LENGTH).toBe(300);
        });

        it('일기당 최대 생성 가능한 페이지 수는 5장이어야 한다', () => {
            expect(SYSTEM_LIMITS.MAX_PAGES).toBe(5);
        });
    });

    describe('무료 등급 (Free Tier) 제한 한도', () => {
        it('최대 스티커 수는 3개여야 한다', () => {
            expect(SYSTEM_LIMITS.FREE_TIER.MAX_STICKERS).toBe(3);
        });

        it('최대 텍스트 상자 수는 3개여야 한다', () => {
            expect(SYSTEM_LIMITS.FREE_TIER.MAX_TEXTS).toBe(3);
        });

        it('최대 사진 첨부 수는 1개여야 한다', () => {
            expect(SYSTEM_LIMITS.FREE_TIER.MAX_PHOTOS).toBe(1);
        });
    });

    describe('프리미엄 등급 (Premium Tier) 제한 한도', () => {
        it('최대 스티커 수는 15개여야 한다', () => {
            expect(SYSTEM_LIMITS.PREMIUM_TIER.MAX_STICKERS).toBe(15);
        });

        it('최대 텍스트 상자 수는 15개여야 한다', () => {
            expect(SYSTEM_LIMITS.PREMIUM_TIER.MAX_TEXTS).toBe(15);
        });

        it('최대 사진 첨부 수는 5개여야 한다', () => {
            expect(SYSTEM_LIMITS.PREMIUM_TIER.MAX_PHOTOS).toBe(5);
        });
    });

    describe('등급별 혜택 비교', () => {
        it('프리미엄 등급은 무료 등급보다 더 많은 스티커를 사용할 수 있어야 한다', () => {
            expect(SYSTEM_LIMITS.PREMIUM_TIER.MAX_STICKERS).toBeGreaterThan(SYSTEM_LIMITS.FREE_TIER.MAX_STICKERS);
        });

        it('프리미엄 등급은 무료 등급보다 더 많은 텍스트 상자를 사용할 수 있어야 한다', () => {
            expect(SYSTEM_LIMITS.PREMIUM_TIER.MAX_TEXTS).toBeGreaterThan(SYSTEM_LIMITS.FREE_TIER.MAX_TEXTS);
        });

        it('프리미엄 등급은 무료 등급보다 더 많은 사진을 첨부할 수 있어야 한다', () => {
            expect(SYSTEM_LIMITS.PREMIUM_TIER.MAX_PHOTOS).toBeGreaterThan(SYSTEM_LIMITS.FREE_TIER.MAX_PHOTOS);
        });
    });
});

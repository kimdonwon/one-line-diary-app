/**
 * 📊 시스템 제한 및 비즈니스 규칙 상수 (System Limits & Business Rules)
 * 
 * 디자인(View)과 로직(Logic)에서 공통으로 참조하는 제약 사항들을 관리합니다.
 * 이 상수를 수정하면 앱 전반의 제약 조건이 한꺼번에 업데이트됩니다.
 */

export const SYSTEM_LIMITS = {
    /** 텍스트 박스(DraggableText) 최대 글자수 */
    MAX_TEXT_LENGTH: 380,

    /** 일기당 최대 생성 가능 페이지 수 */
    MAX_PAGES: 5,

    /** 무료 등급 (Free Tier) 제한 */
    FREE_TIER: {
        MAX_STICKERS: 3,
        MAX_TEXTS: 3,
        MAX_PHOTOS: 1,
    },

    /** 프리미엄 등급 (Premium Tier) 제한 */
    PREMIUM_TIER: {
        MAX_STICKERS: 15,
        MAX_TEXTS: 15,
        MAX_PHOTOS: 5,
    }
};

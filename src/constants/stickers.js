import React from 'react';
import {
    // 기본 스티커들
    FrogSticker, StrawberrySticker, BearSticker, CherrySticker,
    CloudSticker, DaisySticker, PizzaSticker, AvocadoSticker, SparkleSticker,
    HeartSticker, StarSticker, LightningSticker, SunSticker, MoonSticker,
    CoffeeSticker, WatermelonSticker, TulipSticker, MushroomSticker
} from './DoodleStickers';
import {
    PastelCircleRed, PastelCircleBlue, PastelSquareYellow, PastelSquareGreen,
    PastelHeartFilled, PastelHeartOutline, PastelStarYellow, PastelMoonYellow,
    PastelSunRed, PastelSunYellow, PastelCloudBlue, PastelRainBlue,
    PastelLeafGreen, PastelFlowerRed, PastelFlowerYellow, PastelSquiggleOrange,
    PastelZigzagGreen, PastelMusicOrange
} from './PastelStickers';
import {
    FoodDonut, FoodCoffee, FoodMalatang, FoodCookie, FoodRamen,
    FoodIceCreamRabbit, FoodBobaTea, FoodBearDrink, FoodCake, FoodMacaron,
    FoodFries, FoodSoftServe, FoodTanghulu, FoodCroffle, FoodMintChoco,
    FoodMatchaCake, FoodPudding, FoodBun
} from './FoodStickers';

// ─── 카테고리 탭 정의 ───────────────────────────────────────
export const STICKER_CATEGORIES = [
    { id: 'emoji', label: '이모지' },
    { id: 'legacy', label: '기본' },
    { id: 'pastel', label: '파스텔' },
    { id: 'food', label: '푸드' }, // 추가
];

export const STICKER_PACK_DATA = [
    { id: 'pack1', title: '기본 다꾸 이모지 팩', desc: '다양한 감정 표현', icon: '🐾', isFree: true, isDefault: true, catId: 'emoji' },
    { id: 'pack2', title: '기본 캐릭터 팩', desc: '오늘조각 시그니처', icon: '✨', isFree: true, isDefault: true, catId: 'legacy' },
    { id: 'pack3', title: '몽글몽글 파스텔 팩', desc: '프리미엄 전용 컬러', icon: '🎨', isFree: false, isDefault: true, catId: 'pastel' },
    { id: 'pack4', title: 'MZ 냠냠 먹방 팩', desc: '커피, 마라탕, 탕후루까지!', icon: '🍡', isFree: true, isDefault: false, catId: 'food', tagLabel: '푸드' },
];

// ─── 카테고리별 스티커 모음 ────────────────────────────────
export const CATEGORIZED_STICKERS = {
    /** 🎀 이모지 — 기존 텍스트 기반 이모지 */
    emoji: [
        "✨", "🎀", "🎧", "🍀", "🍓", "🍒", "🍭", "🧁",
        "🥞", "💫", "🌸", "🫧", "🎵", "🌈", "🍰", "🪷", "🧋", "💝",
    ],

    /** 기본 — 기존 그래픽 스티커 통합 */
    legacy: [
        { key: 'frog', label: '개구리', Component: FrogSticker },
        { key: 'strawberry', label: '딸기', Component: StrawberrySticker },
        { key: 'bear', label: '곰', Component: BearSticker },
        { key: 'cherry', label: '체리', Component: CherrySticker },
        { key: 'cloud', label: '구름', Component: CloudSticker },
        { key: 'daisy', label: '데이지', Component: DaisySticker },
        { key: 'pizza', label: '피자', Component: PizzaSticker },
        { key: 'avocado', label: '아보카도', Component: AvocadoSticker },
        { key: 'sparkle', label: '별빛', Component: SparkleSticker },
        { key: 'heart', label: '하트', Component: HeartSticker },
        { key: 'star', label: '별', Component: StarSticker },
        { key: 'lightning', label: '번개', Component: LightningSticker },
        { key: 'sun', label: '해', Component: SunSticker },
        { key: 'moon', label: '달', Component: MoonSticker },
        { key: 'coffee', label: '커피', Component: CoffeeSticker },
        { key: 'watermelon', label: '수박', Component: WatermelonSticker },
        { key: 'tulip', label: '튤립', Component: TulipSticker },
        { key: 'mushroom', label: '버섯', Component: MushroomSticker },
    ],

    /** 🎨 파스텔 — 손그림 질감의 파스텔 톤 스티커 */
    pastel: [
        { key: 'p_cir_r', label: '동그라미', Component: PastelCircleRed },
        { key: 'p_cir_b', label: '동그라미', Component: PastelCircleBlue },
        { key: 'p_sq_y', label: '네모', Component: PastelSquareYellow },
        { key: 'p_sq_g', label: '네모', Component: PastelSquareGreen },
        { key: 'p_hrt_f', label: '하트', Component: PastelHeartFilled },
        { key: 'p_hrt_o', label: '하트선', Component: PastelHeartOutline },
        { key: 'p_star', label: '별', Component: PastelStarYellow },
        { key: 'p_moon', label: '달', Component: PastelMoonYellow },
        { key: 'p_sun_r', label: '태양', Component: PastelSunRed },
        { key: 'p_sun_y', label: '동근해', Component: PastelSunYellow },
        { key: 'p_cld', label: '구름', Component: PastelCloudBlue },
        { key: 'p_rain', label: '비구름', Component: PastelRainBlue },
        { key: 'p_leaf', label: '나뭇잎', Component: PastelLeafGreen },
        { key: 'p_flw_r', label: '꽃', Component: PastelFlowerRed },
        { key: 'p_flw_y', label: '꽃', Component: PastelFlowerYellow },
        { key: 'p_sqg', label: '구불선', Component: PastelSquiggleOrange },
        { key: 'p_zig', label: '지그재그', Component: PastelZigzagGreen },
        { key: 'p_mus', label: '음표', Component: PastelMusicOrange },
    ],

    /** 🍔 푸드 — MZ가 좋아하는 음식 모음 */
    food: [
        { key: 'f_rabbit', label: '토끼스크림', Component: FoodIceCreamRabbit },
        { key: 'f_donut', label: '도넛', Component: FoodDonut },
        { key: 'f_malatang', label: '마라탕', Component: FoodMalatang },
        { key: 'f_cookie', label: '쿠키', Component: FoodCookie },
        { key: 'f_ramen', label: '라면', Component: FoodRamen },
        { key: 'f_coffee', label: '커피', Component: FoodCoffee },
        { key: 'f_boba', label: '버블티', Component: FoodBobaTea },
        { key: 'f_bear', label: '곰돌이캔', Component: FoodBearDrink },
        { key: 'f_cake', label: '조각케이크', Component: FoodCake },
        { key: 'f_macaron', label: '마카롱', Component: FoodMacaron },
        { key: 'f_fries', label: '감자튀김', Component: FoodFries },
        { key: 'f_soft', label: '소프트콘', Component: FoodSoftServe },
        { key: 'f_tang', label: '탕후루', Component: FoodTanghulu },
        { key: 'f_croffle', label: '크로플', Component: FoodCroffle },
        { key: 'f_mint', label: '민초모히토', Component: FoodMintChoco },
        { key: 'f_matcha', label: '말차케이크', Component: FoodMatchaCake },
        { key: 'f_pudding', label: '푸딩', Component: FoodPudding },
        { key: 'f_bun', label: '찐빵', Component: FoodBun },
    ],
};

// ─── 유틸 ─────────────────────────────────────────────────
/** SVG key로 컴포넌트를 찾는 헬퍼 (DB 역직렬화용) */
export function getStickerComponent(key) {
    for (const cat of Object.values(CATEGORIZED_STICKERS)) {
        if (!Array.isArray(cat)) continue;
        if (cat.length > 0 && typeof cat[0] === 'string') continue; // emoji
        const found = cat.find(s => s.key === key);
        if (found) return found.Component;
    }
    return null;
}

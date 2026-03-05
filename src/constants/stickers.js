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
import {
    LineSmile, LineSad, LineAngryRabbit, LineHeart, LineFlower,
    LineCrown, LineCamera, LineThumbsUp, LineCloud, LineBubble,
    LineSparkle, LineCircle, LineSquare, LineCat, LineLeaf,
    LineWing, LineDash, LineHighlight
} from './MZLineStickers';
import {
    FaceBoyBrown, FaceGirlPink, FaceGirlBrownHair, FaceBoyCap, FaceTanGirl,
    FaceAfroDark, FaceGirlBlueHair, FaceBearHat, FaceBaby, FaceCoolBoy,
    FaceHappyGirl, FaceHeadphones
} from './FaceStickers';
import {
    ItSticker, ItCamera, ItLaptop, ItSmartphone,
    ItJoystick, ItKeyboard, ItMouse, ItGameboy,
    ItHeadphones, ItSmartwatch, ItFloppy, ItTablet,
    ItMicrophone, ItSpeaker, ItBattery, ItCassette,
    ItVr, ItMonitor
} from './ItStickers';

// ─── 카테고리 탭 정의 ───────────────────────────────────────
export const STICKER_CATEGORIES = [
    { id: 'emoji', label: '이모지' },
    { id: 'legacy', label: '기본' },
    { id: 'pastel', label: '파스텔' },
    { id: 'food', label: '푸드' },
    { id: 'mzline', label: '라인' },
    { id: 'people', label: '피플' },
    { id: 'random', label: '랜덤' },
];

export const STICKER_PACK_DATA = [
    { id: 'pack1', title: '기본 다꾸 이모지 팩', desc: '다양한 감정 표현', icon: '🐾', isFree: true, isDefault: true, catId: 'emoji' },
    { id: 'pack2', title: '기본 캐릭터 팩', desc: '오늘조각 시그니처', icon: '✨', isFree: true, isDefault: true, catId: 'legacy' },
    { id: 'pack3', title: '몽글몽글 파스텔 팩', desc: '몽글몽글한 손그림 느낌', icon: '🎨', isFree: false, isDefault: false, catId: 'pastel', price: '1,100' },
    { id: 'pack4', title: '냠냠 먹방 팩', desc: '커피, 마라탕, 탕후루까지!', icon: '🍡', isFree: true, isDefault: false, catId: 'food', tagLabel: '푸드' },
    { id: 'pack5', title: '삐뚤빼뚤 라인 팩', desc: '대충 그린 꾸안꾸 갬성', icon: '〰️', isFree: true, isDefault: false, catId: 'mzline', tagLabel: '라인' },
    { id: 'pack7', title: '오밀조밀 동네 친구들', desc: '귀엽고 다양한 얼굴 모음!', icon: '👦', isFree: false, isDefault: false, catId: 'people', tagLabel: '피플', price: '1,500' },
    { id: 'pack8', title: '랜덤 스티커팩', desc: '스티커, 카메라, IT소품 가득!', icon: '🎁', isFree: false, isDefault: false, catId: 'random', tagLabel: '랜덤', price: '1,500' },
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

    /** 〰️ 라인 — MZ 감성 손그림 라인 드로잉 */
    mzline: [
        { key: 'ml_smile', label: '웃음', Component: LineSmile },
        { key: 'ml_sad', label: '슬픔', Component: LineSad },
        { key: 'ml_angry', label: '화남토끼', Component: LineAngryRabbit },
        { key: 'ml_heart', label: '하트선', Component: LineHeart },
        { key: 'ml_flower', label: '꽃', Component: LineFlower },
        { key: 'ml_crown', label: '왕관', Component: LineCrown },
        { key: 'ml_cam', label: '카메라', Component: LineCamera },
        { key: 'ml_thumb', label: '따봉', Component: LineThumbsUp },
        { key: 'ml_cloud', label: '구름', Component: LineCloud },
        { key: 'ml_bub', label: '말풍선', Component: LineBubble },
        { key: 'ml_sparkle', label: '반짝이', Component: LineSparkle },
        { key: 'ml_cir', label: '동그라미', Component: LineCircle },
        { key: 'ml_sq', label: '네모', Component: LineSquare },
        { key: 'ml_cat', label: '고양이', Component: LineCat },
        { key: 'ml_leaf', label: '나뭇잎', Component: LineLeaf },
        { key: 'ml_wing', label: '날개', Component: LineWing },
        { key: 'ml_dash', label: '점선', Component: LineDash },
        { key: 'ml_high', label: '강조', Component: LineHighlight },
    ],

    /** 👦 피플 — 오밀조밀 귀여운 사람 얼굴 컬렉션 */
    people: [
        { key: 'pp_boy_br', label: '밤송이', Component: FaceBoyBrown },
        { key: 'pp_girl_pk', label: '핑크소녀', Component: FaceGirlPink },
        { key: 'pp_girl_br', label: '갈색머리', Component: FaceGirlBrownHair },
        { key: 'pp_boy_cap', label: '모자소년', Component: FaceBoyCap },
        { key: 'pp_tan_g', label: '태닝소녀', Component: FaceTanGirl },
        { key: 'pp_afro', label: '아프로', Component: FaceAfroDark },
        { key: 'pp_girl_bl', label: '단발소녀', Component: FaceGirlBlueHair },
        { key: 'pp_bear_h', label: '곰돌모자', Component: FaceBearHat },
        { key: 'pp_baby', label: '아기', Component: FaceBaby },
        { key: 'pp_cool', label: '쿨보이', Component: FaceCoolBoy },
        { key: 'pp_happy', label: '양갈래', Component: FaceHappyGirl },
        { key: 'pp_hp', label: '헤드폰', Component: FaceHeadphones },
    ],

    /** 🎁 랜덤 — 카메라, 스티커, 노트북, 폰, IT소품 등 (Doodle Flash Style) */
    random: [
        { key: 'r_sticker', label: '스티커', Component: ItSticker },
        { key: 'r_camera', label: '카메라', Component: ItCamera },
        { key: 'r_laptop', label: '노트북', Component: ItLaptop },
        { key: 'r_phone', label: '스마트폰', Component: ItSmartphone },
        { key: 'r_joy', label: '조이스틱', Component: ItJoystick },
        { key: 'r_key', label: '키보드', Component: ItKeyboard },
        { key: 'r_mouse', label: '마우스', Component: ItMouse },
        { key: 'r_game', label: '게임보이', Component: ItGameboy },
        { key: 'r_head', label: '헤드폰', Component: ItHeadphones },
        { key: 'r_watch', label: '스마트워치', Component: ItSmartwatch },
        { key: 'r_floppy', label: '플로피', Component: ItFloppy },
        { key: 'r_tablet', label: '태블릿', Component: ItTablet },
        { key: 'r_mic', label: '마이크', Component: ItMicrophone },
        { key: 'r_speak', label: '스피커', Component: ItSpeaker },
        { key: 'r_batt', label: '배터리', Component: ItBattery },
        { key: 'r_cas', label: '카세트', Component: ItCassette },
        { key: 'r_vr', label: 'VR기기', Component: ItVr },
        { key: 'r_mon', label: '모니터', Component: ItMonitor },
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

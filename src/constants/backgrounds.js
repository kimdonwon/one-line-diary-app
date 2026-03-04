/**
 * 🎨 배경지 서랍장 (Paper Drawer) 데이터
 *
 * 입력 박스에 적용할 수 있는 배경지 테마를 정의합니다.
 * 각 배경지는 고유 id, 라벨, 배경색(또는 그라데이션), 선택 표시 색상 등을 포함합니다.
 */

// ─── 배경지 카테고리 ───
export const BG_CATEGORIES = [
    { id: 'pastel', label: '파스텔' },
    { id: 'pattern', label: '패턴' },
    { id: 'special', label: '스페셜' },
];

// ─── 배경지 아이템 목록 ───
export const BACKGROUNDS = [
    // 기본 (항상 첫 번째)
    {
        id: 'default',
        category: 'pastel',
        label: '기본',
        emoji: '📄',
        backgroundColor: '#FFFFFF',
        textColor: '#4A3728',
        shadowColor: '#C9A8B2',
    },

    // ─── 파스텔 무드 팩 ───
    {
        id: 'pastel_blue',
        category: 'pastel',
        label: '세레니티',
        emoji: '🫧',
        backgroundColor: '#E8F4FD',
        textColor: '#3A5A7C',
        shadowColor: '#B0D4F1',
    },
    {
        id: 'pastel_pink',
        category: 'pastel',
        label: '벚꽃',
        emoji: '🌸',
        backgroundColor: '#FDE8EF',
        textColor: '#7C3A5A',
        shadowColor: '#F1B0C9',
    },
    {
        id: 'pastel_mint',
        category: 'pastel',
        label: '민트',
        emoji: '🍃',
        backgroundColor: '#E6F7F2',
        textColor: '#3A7C5A',
        shadowColor: '#A8E6CF',
    },
    {
        id: 'pastel_lavender',
        category: 'pastel',
        label: '라벤더',
        emoji: '💜',
        backgroundColor: '#F0E8FD',
        textColor: '#5A3A7C',
        shadowColor: '#C9B0F1',
    },
    {
        id: 'pastel_lemon',
        category: 'pastel',
        label: '레몬',
        emoji: '🍋',
        backgroundColor: '#FFF9E6',
        textColor: '#7C6A3A',
        shadowColor: '#F1E0A8',
    },
    {
        id: 'pastel_peach',
        category: 'pastel',
        label: '피치',
        emoji: '🍑',
        backgroundColor: '#FDE8DE',
        textColor: '#7C503A',
        shadowColor: '#F1C0A8',
    },

    // ─── 패턴 팩 ───
    {
        id: 'pattern_grid',
        category: 'pattern',
        label: '모눈종이',
        emoji: '📐',
        backgroundColor: '#FAFAFA',
        textColor: '#4A3728',
        shadowColor: '#C9C9C9',
        pattern: 'grid',
    },
    {
        id: 'pattern_lined',
        category: 'pattern',
        label: '줄노트',
        emoji: '📝',
        backgroundColor: '#FFFEF8',
        textColor: '#4A3728',
        shadowColor: '#D5D3C6',
        pattern: 'lined',
    },
    {
        id: 'pattern_dots',
        category: 'pattern',
        label: '도트',
        emoji: '⬤',
        backgroundColor: '#FAFAFA',
        textColor: '#4A3728',
        shadowColor: '#C9C9C9',
        pattern: 'dots',
    },

    // ─── 스페셜 팩 ───
    {
        id: 'special_sunset',
        category: 'special',
        label: '노을',
        emoji: '🌅',
        backgroundColor: '#FDE8EF',
        gradientColors: ['#FDE8EF', '#E8F4FD'],
        textColor: '#5A3A5A',
        shadowColor: '#E6B0C9',
    },
    {
        id: 'special_night',
        category: 'special',
        label: '밤',
        emoji: '🌙',
        backgroundColor: '#2C2E43',
        textColor: '#E8E8E8',
        shadowColor: '#1A1A2E',
    },
    {
        id: 'special_kraft',
        category: 'special',
        label: '크라프트',
        emoji: '📦',
        backgroundColor: '#D4B896',
        textColor: '#4A3728',
        shadowColor: '#B8956A',
    },
];

/**
 * ID로 배경지 데이터를 가져옵니다.
 * @param {string} bgId - 배경지 ID
 * @returns {object} 배경지 객체 (없으면 기본값 반환)
 */
export function getBackgroundById(bgId) {
    return BACKGROUNDS.find(bg => bg.id === bgId) || BACKGROUNDS[0];
}

/**
 * 카테고리별 배경지 목록을 반환합니다.
 * @param {string} categoryId - 카테고리 ID
 * @returns {Array} 해당 카테고리의 배경지 배열
 */
export function getBackgroundsByCategory(categoryId) {
    return BACKGROUNDS.filter(bg => bg.category === categoryId);
}

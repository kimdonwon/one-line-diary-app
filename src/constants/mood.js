// 🍰 기분 데이터 - 순수 디자인 영역
// 색상, 라벨, 캐릭터 키 등 시각적 요소만 포함
// ⚠️ emoji 필드 제거 → MoodCharacters.js의 SVG 캐릭터로 대체
// 🎀 파스텔 색상으로 업데이트

export const MOODS = {
    HAPPY: {
        key: 'HAPPY',
        label: '기쁨',
        color: '#7CD4A0',
        bgColor: '#E8F8EE',
        character: 'frog',
        description: '활짝 웃는 초록 개구리',
    },
    SAD: {
        key: 'SAD',
        label: '슬픔',
        color: '#8BBFEF',
        bgColor: '#E8F1FB',
        character: 'cat',
        description: '눈물 흘리는 파란 고양이',
    },
    ANGRY: {
        key: 'ANGRY',
        label: '화남',
        color: '#FFD485',
        bgColor: '#FFF8E8',
        character: 'chick',
        description: '화난 노란 병아리',
    },
    EMBARRASSED: {
        key: 'EMBARRASSED',
        label: '당황',
        color: '#FFB5B5',
        bgColor: '#FFF0F0',
        character: 'rabbit',
        description: '당황한 분홍 토끼',
    },
    SOSO: {
        key: 'SOSO',
        label: '쏘쏘',
        color: '#C8BEB7',
        bgColor: '#F5F0ED',
        character: 'bear',
        description: '살짝 미소짓는 곰',
    },
};

export const MOOD_LIST = Object.values(MOODS);

export function getMoodByKey(key) {
    return MOODS[key] || MOODS.SOSO;
}

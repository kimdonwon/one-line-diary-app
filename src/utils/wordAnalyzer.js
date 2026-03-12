/**
 * 📝 단어 빈도 분석 유틸리티
 * 일기 content(JSON 배열) 및 texts(2차원 배열)에서 단어를 추출하고 빈도를 계산합니다.
 * 
 * 참고 스킬: Logic Documenter, Modular UI Developer
 */

// 한국어 불용어 (조사, 접속사, 대명사, 1글자 등)
const STOP_WORDS = new Set([
    // 조사
    '은', '는', '이', '가', '을', '를', '에', '에서', '의', '와', '과', '로', '으로',
    '도', '만', '까지', '부터', '에게', '한테', '께', '보다', '처럼', '같이', '마다',
    // 대명사 / 지시어
    '나', '너', '저', '우리', '그', '이', '저', '것', '거', '수', '뭐', '왜', '어디',
    '그것', '이것', '저것', '여기', '거기', '저기',
    // 부사 / 접속사
    '그리고', '하지만', '그래서', '또', '더', '안', '못', '잘', '좀', '너무', '아주',
    '매우', '정말', '진짜', '그냥', '다', '또', '이미', '아직', '별로', '꽤',
    // 동사/형용사 어미 잔여
    '했다', '했어', '했고', '하고', '해서', '하는', '한다', '했는데', '있다', '있어',
    '없다', '없어', '된다', '됐다', '같다', '같아', '인데', '이다',
    // 기타 흔한 단어
    '오늘', '내일', '어제', '때', '중', '후', '전', '날', '일', '좀', '등', '및',
]);

// 최소 문자 길이
const MIN_WORD_LENGTH = 2;

/**
 * 텍스트에서 단어를 추출하고 빈도수를 계산합니다.
 * Hermes 엔진 호환: Unicode property escape(\p{L}) 대신 일반 정규식 사용
 * @param {string} text - 분석할 텍스트
 * @returns {Object} { word: count, ... }
 */
function extractWords(text) {
    if (!text || typeof text !== 'string') return {};

    // 특수문자, 이모지, 숫자 제거 → 공백 기준 분할
    // Hermes 호환: \p{L} 대신 명시적 문자 범위 사용
    const cleaned = text
        .replace(/[^\uAC00-\uD7AF\u3131-\u3163\u1100-\u11FF\u3000-\u303Fa-zA-Z\s]/g, ' ')  // 한글, 영문, 공백만 유지
        .replace(/\s+/g, ' ')
        .trim();

    if (!cleaned) return {};

    const words = cleaned.split(' ');
    const freq = {};

    for (const word of words) {
        const w = word.trim().toLowerCase();
        if (w.length < MIN_WORD_LENGTH) continue;
        if (STOP_WORDS.has(w)) continue;
        freq[w] = (freq[w] || 0) + 1;
    }

    return freq;
}

/**
 * diary 레코드에서 모든 텍스트를 수집합니다.
 * content: JSON 배열(멀티페이지) 또는 일반 문자열
 * texts: 2차원 배열의 DraggableText 노드
 * @param {Object} diary - { content, texts }
 * @returns {string} 통합된 텍스트
 */
function collectTextFromDiary(diary) {
    if (!diary) return '';
    const parts = [];

    // 1. content 처리
    if (diary.content) {
        try {
            const parsed = JSON.parse(diary.content);
            if (Array.isArray(parsed)) {
                parsed.forEach(page => {
                    if (typeof page === 'string') parts.push(page);
                });
            } else {
                parts.push(String(parsed));
            }
        } catch (e) {
            // JSON이 아닌 일반 텍스트
            parts.push(String(diary.content));
        }
    }

    // 2. texts (DraggableText) 처리
    if (diary.texts) {
        try {
            const parsed = JSON.parse(diary.texts);
            if (Array.isArray(parsed)) {
                parsed.forEach(page => {
                    if (Array.isArray(page)) {
                        page.forEach(node => {
                            if (node && node.text) parts.push(node.text);
                        });
                    } else if (page && page.text) {
                        parts.push(page.text);
                    }
                });
            }
        } catch (e) {
            // 파싱 실패 무시
        }
    }

    return parts.join(' ');
}

/**
 * 단일 일기 레코드에서 단어 빈도 맵을 생성합니다.
 * @param {Object} diary - DB diary 레코드
 * @returns {Object} { word: count, ... }
 */
export function analyzeWordsFromDiary(diary) {
    try {
        const text = collectTextFromDiary(diary);
        return extractWords(text);
    } catch (e) {
        console.warn('[WordAnalyzer] analyzeWordsFromDiary error:', e.message);
        return {};
    }
}

/**
 * 여러 일기 레코드에서 종합 단어 빈도를 계산합니다.
 * @param {Array} diaries - DB diary 레코드 배열
 * @param {number} topN - 상위 N개 (기본 10)
 * @returns {Array} [{ word, count }, ...] 내림차순
 */
export function analyzeWordsFromDiaries(diaries, topN = 10) {
    const totalFreq = {};

    for (const diary of diaries) {
        const freq = analyzeWordsFromDiary(diary);
        for (const [word, count] of Object.entries(freq)) {
            totalFreq[word] = (totalFreq[word] || 0) + count;
        }
    }

    return Object.entries(totalFreq)
        .map(([word, count]) => ({ word, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, topN);
}

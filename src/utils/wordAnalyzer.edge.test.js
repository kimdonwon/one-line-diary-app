import { analyzeWordsFromDiary, analyzeWordsFromDiaries } from './wordAnalyzer';

describe('WordAnalyzer 엣지케이스 테스트', () => {

    describe('1. null / 빈 값 방어', () => {
        it('null 을 넘기면 빈 객체를 반환해야 한다', () => {
            expect(analyzeWordsFromDiary(null)).toEqual({});
        });

        it('빈 객체를 넘기면 빈 객체를 반환해야 한다', () => {
            expect(analyzeWordsFromDiary({})).toEqual({});
        });

        it('content 가 빈 문자열이면 빈 객체를 반환해야 한다', () => {
            expect(analyzeWordsFromDiary({ content: '' })).toEqual({});
        });

        it('analyzeWordsFromDiaries 에 빈 배열을 넘기면 빈 배열을 반환해야 한다', () => {
            expect(analyzeWordsFromDiaries([])).toEqual([]);
        });

        it('diaries 배열 안에 null 항목이 섞여 있어도 크래시 없이 처리해야 한다', () => {
            const diaries = [null, { content: '오늘조각' }, null];
            expect(() => analyzeWordsFromDiaries(diaries)).not.toThrow();
            const result = analyzeWordsFromDiaries(diaries);
            expect(result[0].word).toBe('오늘조각');
        });

        it('texts 필드가 null 이어도 content 는 정상 분석되어야 한다', () => {
            const diary = { content: '산책했다', texts: null };
            const result = analyzeWordsFromDiary(diary);
            expect(result).toHaveProperty('산책했다', 1);
        });

        it('texts 필드가 빈 배열 JSON 이어도 크래시 없이 처리해야 한다', () => {
            const diary = { content: '독서했다', texts: JSON.stringify([]) };
            const result = analyzeWordsFromDiary(diary);
            expect(result).toHaveProperty('독서했다', 1);
        });
    });

    describe('2. 불용어 vs 합성어 구분', () => {
        it('"오늘" 은 불용어라 제거되지만 "오늘조각" 은 남아야 한다', () => {
            const diary = { content: '오늘 오늘조각 앱을 사용했다' };
            const result = analyzeWordsFromDiary(diary);
            expect(result['오늘']).toBeUndefined();
            expect(result).toHaveProperty('오늘조각', 1);
        });

        it('"일" 은 불용어라 제거되지만 "일기" 는 남아야 한다', () => {
            const diary = { content: '일 일기 썼다' };
            const result = analyzeWordsFromDiary(diary);
            expect(result['일']).toBeUndefined();
            expect(result).toHaveProperty('일기', 1);
        });

        it('"있다" 는 불용어라 제거되지만 "있었다" 는 남아야 한다', () => {
            const diary = { content: '좋은 시간 있었다 있다' };
            const result = analyzeWordsFromDiary(diary);
            expect(result['있다']).toBeUndefined();
            expect(result).toHaveProperty('있었다', 1);
        });
    });

    describe('3. 본문 + DraggableText 빈도 합산', () => {
        it('content 와 texts 에 동일 단어가 있으면 빈도를 합산해야 한다', () => {
            const diary = {
                content: '카페',
                texts: JSON.stringify([[{ text: '카페' }, { text: '카페' }]]),
            };
            const result = analyzeWordsFromDiary(diary);
            expect(result).toHaveProperty('카페', 3);
        });

        it('texts 가 멀티페이지(2차원 배열) 구조여도 모든 페이지를 합산해야 한다', () => {
            const diary = {
                content: '',
                texts: JSON.stringify([
                    [{ text: '독서' }],          // 1페이지
                    [{ text: '독서' }, { text: '운동' }],  // 2페이지
                    [{ text: '운동' }],           // 3페이지
                ]),
            };
            const result = analyzeWordsFromDiary(diary);
            expect(result).toHaveProperty('독서', 2);
            expect(result).toHaveProperty('운동', 2);
        });

        it('texts 안에 text 필드가 없는 노드는 무시해야 한다', () => {
            const diary = {
                content: '커피',
                texts: JSON.stringify([[{ sticker: 'frog' }, { text: '커피' }]]),
            };
            const result = analyzeWordsFromDiary(diary);
            expect(result).toHaveProperty('커피', 2);
        });
    });

    describe('4. 잘못된 JSON 방어', () => {
        it('content 가 깨진 JSON 문자열이면 일반 텍스트로 처리해야 한다', () => {
            const diary = { content: '{ 깨진 json 내용' };
            expect(() => analyzeWordsFromDiary(diary)).not.toThrow();
        });

        it('texts 가 깨진 JSON 이어도 content 는 정상 분석되어야 한다', () => {
            const diary = { content: '여행', texts: '[ 깨진 texts json' };
            const result = analyzeWordsFromDiary(diary);
            expect(result).toHaveProperty('여행', 1);
        });
    });

    describe('5. analyzeWordsFromDiaries — 다중 일기 집계', () => {
        it('topN 이 실제 단어 수보다 크면 전체 단어를 반환해야 한다', () => {
            const diaries = [{ content: '사과' }];
            const result = analyzeWordsFromDiaries(diaries, 100);
            expect(result).toHaveLength(1);
        });

        it('topN=0 이면 빈 배열을 반환해야 한다', () => {
            const diaries = [{ content: '사과 배추 당근' }];
            const result = analyzeWordsFromDiaries(diaries, 0);
            expect(result).toEqual([]);
        });

        it('여러 일기에 걸쳐 동일 단어 빈도를 정확히 합산해야 한다', () => {
            const diaries = [
                { content: '커피 마셨다' },
                { content: '커피 한잔' },
                { content: '커피 좋아' },
            ];
            const result = analyzeWordsFromDiaries(diaries, 10);
            const coffeeEntry = result.find(r => r.word === '커피');
            expect(coffeeEntry).toBeDefined();
            expect(coffeeEntry.count).toBe(3);
        });

        it('결과는 빈도 내림차순으로 정렬되어야 한다', () => {
            const diaries = [
                { content: '운동 독서 운동 커피 운동 독서' },
            ];
            const result = analyzeWordsFromDiaries(diaries, 10);
            for (let i = 0; i < result.length - 1; i++) {
                expect(result[i].count).toBeGreaterThanOrEqual(result[i + 1].count);
            }
        });
    });
});

import { analyzeWordsFromDiary, analyzeWordsFromDiaries } from './wordAnalyzer';

describe('WordAnalyzer 단위 테스트 (상세 검증)', () => {

    describe('analyzeWordsFromDiary - 텍스트 정제 및 단일 객체 분석', () => {
        it('빈 객체나 null이 들어오면 빈 객체를 반환해야 한다', () => {
            expect(analyzeWordsFromDiary(null)).toEqual({});
            expect(analyzeWordsFromDiary({})).toEqual({});
        });

        it('일반 텍스트(content)에서 특수문자를 제거하고 형태소를 추출해야 한다', () => {
            const diary = { content: "오늘은 날씨가 참 좋다! 행복해요 😊 100점!" };
            // '오늘은' -> '오늘'(불용어라 제거됨), '은'(1글자 및 불용어라 제거됨)
            // '날씨가' -> '날씨가', '참'(1글자 제거됨), '좋다', '행복해요'
            const result = analyzeWordsFromDiary(diary);
            expect(result).toHaveProperty('날씨가', 1);
            expect(result).toHaveProperty('좋다', 1);
            expect(result).toHaveProperty('행복해요', 1);
            // 숫자, 특수문자, 1글자 단어, 이모티콘은 없어야 함
            expect(result['100점']).toBeUndefined();
            expect(result['참']).toBeUndefined();
            expect(result['😊']).toBeUndefined();
        });

        it('불용어(Stop Words) 및 1글자 단어는 카운트하지 않아야 한다', () => {
            // '오늘', '그리고', '그냥', '다' 등은 무시되어야 함
            const diary = { content: "오늘 그리고 내일 그냥 우리 코딩 다 하자" };
            const result = analyzeWordsFromDiary(diary);
            // '코딩', '하자' 등만 결과로 남아야 함
            expect(result).toHaveProperty('코딩', 1);
            expect(result).toHaveProperty('하자', 1);
            expect(result['오늘']).toBeUndefined();
            expect(result['그리고']).toBeUndefined();
            expect(result['그냥']).toBeUndefined();
        });

        it('JSON 형태의 멀티페이지 content도 파싱할 수 있어야 한다', () => {
            const diary = {
                content: JSON.stringify([
                    "첫번째 페이지 내용입니다",
                    "두번째 페이지 내용입니다"
                ])
            };
            const result = analyzeWordsFromDiary(diary);
            expect(result).toHaveProperty('첫번째', 1);
            expect(result).toHaveProperty('페이지', 2); // 두 페이지 모두 등장
            expect(result).toHaveProperty('내용입니다', 2); // 두 페이지 모두 등장
        });

        it('DraggableText (texts 필드) 내용도 합산해서 분석해야 한다', () => {
            const diary = {
                content: "바닷가 놀러갔다",
                texts: JSON.stringify([
                    [{ text: "갈매기" }, { text: "새우깡" }], // 첫번째 페이지의 텍스트 상자들
                    [{ text: "갈매기" }] // 두번째 페이지의 텍스트 상자
                ])
            };
            const result = analyzeWordsFromDiary(diary);
            expect(result).toHaveProperty('바닷가', 1);
            expect(result).toHaveProperty('놀러갔다', 1);
            expect(result).toHaveProperty('갈매기', 2); // texts에서 2번 등장
            expect(result).toHaveProperty('새우깡', 1);
        });
    });

    describe('analyzeWordsFromDiaries - 다중 일기 데이터 취합', () => {
        it('여러 일기 데이터에서 단어 빈도를 정확히 합산하고 내림차순 정렬해야 한다', () => {
            const diaries = [
                { content: "리액트 정말 재밌다" }, // '리액트' 1, '정말'(불용어제거), '재밌다' 1
                { content: "리액트 네이티브 재밌다" }, // '리액트' 1, '네이티브' 1, '재밌다' 1
                { content: "리액트 최고 최고" } // '리액트' 1, '최고' 2
            ];

            const result = analyzeWordsFromDiaries(diaries, 5); // 상위 5개까지만

            // 전체 합산 예상 결과: 리액트(3), 최고(2), 재밌다(2), 네이티브(1)
            expect(result).toHaveLength(4);
            expect(result[0]).toEqual({ word: '리액트', count: 3 });

            // 갯수가 같은 단어는 순서가 보장되지 않으므로, 포함 여부와 카운트로 검증
            const countByWord = result.reduce((acc, obj) => {
                acc[obj.word] = obj.count;
                return acc;
            }, {});
            expect(countByWord['재밌다']).toBe(2);
            expect(countByWord['최고']).toBe(2);
            expect(countByWord['네이티브']).toBe(1);
        });

        it('상위 N개(topN) 파라미터가 정확히 동작해야 한다', () => {
            const diaries = [
                { content: "사과 배 포도 사과 포도 귤 사과" } 
                // 사과 3, 포도 2, 귤 1 (배, 귤은 1글자라 제외됨!)
            ];
            const result = analyzeWordsFromDiaries(diaries, 1);
            
            expect(result).toHaveLength(1);
            expect(result[0]).toEqual({ word: '사과', count: 3 });
        });
    });
});

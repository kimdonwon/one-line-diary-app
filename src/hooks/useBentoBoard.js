/**
 * 🍱 벤토 보드(Annual Bento Board) 데이터 훅
 * 
 * 연간 모먼트 벤토 보드에 필요한 데이터를 통합 관리합니다.
 * 
 * 전략:
 * 1. 화면 진입 시 word_stats 테이블에서 바로 쿼리 (빠름)
 * 2. word_stats가 비어 있으면 전체 일기를 최초 1회 분석 (마이그레이션)
 * 3. 이후에는 saveDiary() 시점의 증분 동기화가 데이터를 최신으로 유지
 * 4. 기록 황금 시간대: updated_at 컬럼에서 시간 추출 후 빈도 분석
 * 
 * 참고 스킬: Logic Documenter, Modular UI Developer
 */

import { useState, useEffect, useRef } from 'react';
import {
    getYearWordStats,
    saveWordStats,
    getYearMaxStreak,
    getYearDiaryTimes,
} from '../database/db';
import { analyzeWordsFromDiary } from '../utils/wordAnalyzer';

/**
 * 시간(hour)을 한국식 표현으로 변환
 * @param {number} hour - 0~23
 * @returns {{ label: string, emoji: string, period: string }}
 */
function formatGoldenHour(hour) {
    let period, emoji;
    if (hour >= 0 && hour < 6) {
        period = '새벽';
        emoji = '🌃';
    } else if (hour >= 6 && hour < 12) {
        period = '오전';
        emoji = '☀️';
    } else if (hour >= 12 && hour < 18) {
        period = '오후';
        emoji = '🌤';
    } else {
        period = '밤';
        emoji = '🌙';
    }

    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return {
        label: `${period} ${displayHour}시`,
        emoji,
        period,
    };
}

/**
 * ⚙️ 벤토 보드 데이터를 로드하고 관리하는 훅
 */
export function useBentoBoard(year, diaries) {
    const [topWords, setTopWords] = useState([]);
    const [maxStreak, setMaxStreak] = useState(0);
    const [goldenHour, setGoldenHour] = useState(null); // { label, emoji, period }
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const isRunning = useRef(false);
    const lastDataRef = useRef(''); // 👈 추가: 마지막으로 분석한 일기 상태(시그니처) 저장
    // 2. useEffect 내부에서 체크 (약 64라인부터 시작되는 useEffect)
    useEffect(() => {
        if (!diaries || diaries.length === 0) return;
        // ─── 🚀 지능형 캐싱 로직 추가 ───
        // 현재 일기의 [개수 + 마지막 날짜 + 연도]로 고유한 '지문'을 만듭니다.
        const currentSignature = `${year}_${diaries.length}_${diaries[diaries.length - 1].date}`;

        // 만약 지문이 이전과 똑같다면? (바뀐 게 없으므로 분석 중단!)
        if (lastDataRef.current === currentSignature) return;
        // ──────────────────────────────
        if (isRunning.current) return;
        isRunning.current = true;

        (async () => {
            setIsAnalyzing(true);
            try {
                // 1단계: word_stats에서 바로 조회 (빠름)
                let words = [];
                try {
                    words = await getYearWordStats(year, 10) || [];
                } catch (e) {
                    console.warn('[BentoBoard] getYearWordStats failed:', e.message);
                }

                // 2단계: word_stats가 비어있으면 전체 분석 (최초 1회)
                if (words.length === 0) {
                    console.log('[BentoBoard] word_stats empty, running full analysis...');
                    for (let i = 0; i < diaries.length; i++) {
                        try {
                            const wordMap = analyzeWordsFromDiary(diaries[i]);
                            if (Object.keys(wordMap).length > 0) {
                                await saveWordStats(diaries[i].date, wordMap);
                            }
                        } catch (e) { }
                        if (i % 10 === 9) {
                            await new Promise(r => setTimeout(r, 0));
                        }
                    }
                    try {
                        words = await getYearWordStats(year, 10) || [];
                    } catch (e) { }
                }

                const formattedWords = words.map(row => ({
                    word: row.word,
                    count: row.total,
                }));

                // 연속 기록 일수 계산
                let streak = 0;
                try {
                    streak = await getYearMaxStreak(year);
                } catch (e) { }

                // 🕐 황금 시간대 분석
                let goldenHourData = null;
                try {
                    const timeRows = await getYearDiaryTimes(year);
                    if (timeRows && timeRows.length > 0) {
                        const hourCounts = {};
                        for (const row of timeRows) {
                            try {
                                const d = new Date(row.updated_at);
                                const h = d.getHours();
                                hourCounts[h] = (hourCounts[h] || 0) + 1;
                            } catch (e) { }
                        }
                        let maxHour = 0;
                        let maxCount = 0;
                        for (const [hour, count] of Object.entries(hourCounts)) {
                            if (count > maxCount) {
                                maxCount = count;
                                maxHour = parseInt(hour);
                            }
                        }
                        if (maxCount > 0) {
                            goldenHourData = {
                                ...formatGoldenHour(maxHour),
                                count: maxCount,
                                type: 'time',
                            };
                        }
                    }
                } catch (e) {
                    console.warn('[BentoBoard] Golden hour analysis failed:', e.message);
                }

                // 시간 데이터가 없으면 → "가장 활발한 달"로 폴백
                if (!goldenHourData && diaries.length > 0) {
                    const monthCounts = {};
                    for (const d of diaries) {
                        if (d.date) {
                            const month = d.date.substring(5, 7); // 'MM'
                            monthCounts[month] = (monthCounts[month] || 0) + 1;
                        }
                    }
                    let bestMonth = '01';
                    let bestCount = 0;
                    for (const [month, count] of Object.entries(monthCounts)) {
                        if (count > bestCount) {
                            bestCount = count;
                            bestMonth = month;
                        }
                    }
                    goldenHourData = {
                        label: `${parseInt(bestMonth)}월`,
                        emoji: '📅',
                        period: 'month',
                        count: bestCount,
                        type: 'month',
                    };
                }

                setTopWords(formattedWords);
                setMaxStreak(streak);
                setGoldenHour(goldenHourData);
                lastDataRef.current = currentSignature;
                console.log('[BentoBoard] Analysis complete for signature:', currentSignature);
                console.log('[BentoBoard] Loaded:', formattedWords.length, 'words, streak:', streak, 'goldenHour:', goldenHourData?.label);
            } catch (e) {
                console.error('[BentoBoard] Unexpected error:', e);
            } finally {
                setIsAnalyzing(false);
                isRunning.current = false;
            }
        })();
    }, [year, diaries]);

    return {
        topWords,
        maxStreak,
        goldenHour,
        totalEntries: diaries?.length || 0,
        isAnalyzing,
    };
}

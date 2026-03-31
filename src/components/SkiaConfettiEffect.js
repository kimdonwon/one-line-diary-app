import React, { useImperativeHandle, forwardRef, useRef, memo, useMemo, useState, useEffect } from 'react';
import { StyleSheet, Dimensions, InteractionManager } from 'react-native';
import {
    Canvas,
    Atlas,
    rect,
    useRSXformBuffer,
    useTexture,
    Group,
    Circle,
    Skia,
    ImageSVG,
} from '@shopify/react-native-skia';
import { useSharedValue, useFrameCallback } from 'react-native-reanimated';

import { MOOD_CHARACTER_SVG_MAP } from '../constants/MoodCharacterSVGs';
import { ACTIVITY_ICON_SVG_MAP } from '../constants/ActivityIconSVGs';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

/**
 * 🎨 Skia 기반 고성능 파티클 엔진 (v5.0 - Circular Queue + Activity Support)
 *
 * v5.0 개선 사항:
 * 1. [Circular Queue] 연타 시 기존 파티클을 유지하면서 새 파티클을 추가.
 *    POOL_SIZE를 60으로 키우고, 한번 burst 시 BURST_COUNT(12)개만 순환 사용.
 * 2. [Activity Icons] activityKey prop 지원. 활동별 SVG 아이콘을 Skia 텍스처로 베이킹.
 * 3. [Lazy Activation] burst 호출 전까지 frameCallback 비활성화 → 마운트 시 렉 제거.
 * 4. [Context7 참고] Atlas + useRSXformBuffer worklet 패턴 적용.
 */

const POOL_SIZE = 60;
const BURST_COUNT = 12;
const PARTICLE_SIZE = 50;
const GRAVITY = 950;
const DURATION_MS = 1000;

// ─── 무드 캐릭터 Atlas 키 ───
const MOOD_ATLAS_KEYS = ['frog', 'cat', 'chick', 'bear', 'rabbit', 'fallback'];
const MOOD_COLS = MOOD_ATLAS_KEYS.length;
const MOOD_TEX_W = MOOD_COLS * PARTICLE_SIZE;
const MOOD_TEX_H = PARTICLE_SIZE;

// ─── 활동 아이콘 Atlas 키 ───
const ACTIVITY_ATLAS_KEYS = ['reading', 'video', 'study', 'date', 'game', 'social', 'exercise', 'default'];
const ACTIVITY_COLS = ACTIVITY_ATLAS_KEYS.length;
const ACTIVITY_TEX_W = ACTIVITY_COLS * PARTICLE_SIZE;
const ACTIVITY_TEX_H = PARTICLE_SIZE;

const MOOD_FALLBACK_COLORS = ['#B4DCC6', '#8BBFEF', '#FEE97D', '#C9B5B6', '#FFB5B5', '#FFD700'];
const ACTIVITY_FALLBACK_COLORS = ['#B5D8A0', '#A8C8F0', '#FFD485', '#FFB5B5', '#C4A8F0', '#F5C08A', '#8DD4C8', '#E8E8E8'];

/**
 * 무드 캐릭터 스프라이트 시트
 */
const MoodSpriteSheet = memo(({ skSvgs }) => (
    <Group>
        {MOOD_ATLAS_KEYS.map((key, i) => {
            const x = i * PARTICLE_SIZE;
            const svg = skSvgs[key];
            if (key === 'fallback' || !svg) {
                return (
                    <Circle
                        key={key}
                        cx={x + PARTICLE_SIZE / 2}
                        cy={PARTICLE_SIZE / 2}
                        r={PARTICLE_SIZE / 2 - 4}
                        color={MOOD_FALLBACK_COLORS[i]}
                    />
                );
            }
            return (
                <ImageSVG
                    key={key}
                    svg={svg}
                    x={x + 2}
                    y={2}
                    width={PARTICLE_SIZE - 4}
                    height={PARTICLE_SIZE - 4}
                />
            );
        })}
    </Group>
));

/**
 * 활동 아이콘 스프라이트 시트
 */
const ActivitySpriteSheet = memo(({ skSvgs }) => (
    <Group>
        {ACTIVITY_ATLAS_KEYS.map((key, i) => {
            const x = i * PARTICLE_SIZE;
            const svg = skSvgs[key];
            if (!svg) {
                return (
                    <Circle
                        key={key}
                        cx={x + PARTICLE_SIZE / 2}
                        cy={PARTICLE_SIZE / 2}
                        r={PARTICLE_SIZE / 2 - 4}
                        color={ACTIVITY_FALLBACK_COLORS[i]}
                    />
                );
            }
            return (
                <ImageSVG
                    key={key}
                    svg={svg}
                    x={x + 2}
                    y={2}
                    width={PARTICLE_SIZE - 4}
                    height={PARTICLE_SIZE - 4}
                />
            );
        })}
    </Group>
));

// ─── 빈 파티클 생성 유틸 ───
const createEmptyParticle = () => ({
    active: false,
    startTime: 0,
    originX: 0,
    originY: 0,
    vx: 0,
    vy: 0,
    rotation: 0,
});

const DURATION_SEC = DURATION_MS / 1000;

// ─── SVG 글로벌 캐시 (화면 마운트 부하 최소화) ───
let parsedMoodCache = null;
let parsedActivityCache = null;

export const SkiaConfettiEffect = memo(forwardRef(({ character, activityKey }, ref) => {
    const isActivityMode = !!activityKey;

    const [skSvgs, setSkSvgs] = useState(() => 
        isActivityMode ? parsedActivityCache : parsedMoodCache
    );

    const engineRef = useRef(null);

    useImperativeHandle(ref, () => ({
        burst: (x, y) => {
            if (engineRef.current) engineRef.current.burst(x, y);
        }
    }));

    useEffect(() => {
        if (skSvgs) return;

        // 화면 렌더링이 완료된 후 여유롭게 파싱 (멈춤 방지)
        const handle = InteractionManager.runAfterInteractions(() => {
            setTimeout(() => {
                const map = {};
                const sourceMap = isActivityMode ? ACTIVITY_ICON_SVG_MAP : MOOD_CHARACTER_SVG_MAP;
                Object.entries(sourceMap).forEach(([key, xml]) => {
                    try {
                        const parsed = Skia.SVG.MakeFromString(xml);
                        if (parsed) map[key] = parsed;
                    } catch (e) {
                        console.warn(`[SkiaConfetti] SVG parse failed for key="${key}":`, e.message);
                    }
                });
                
                if (isActivityMode) parsedActivityCache = map;
                else parsedMoodCache = map;
                
                setSkSvgs(map);
            }, 50);
        });
        return () => handle.cancel();
    }, [isActivityMode, skSvgs]);

    if (!skSvgs) return null;

    return (
        <ConfettiEngine 
            ref={engineRef}
            character={character} 
            activityKey={activityKey} 
            skSvgs={skSvgs} 
        />
    );
}));

const ConfettiEngine = memo(forwardRef(({ character, activityKey, skSvgs }, ref) => {
    const lastBurstTime = useRef(0);
    const slotIndex = useRef(0);

    // ─── 모드 판별: activityKey가 있으면 활동 모드 ───
    const isActivityMode = !!activityKey;



    // ─── 2. 텍스처 생성 (모드별 분기) ───
    const texW = isActivityMode ? ACTIVITY_TEX_W : MOOD_TEX_W;
    const texH = isActivityMode ? ACTIVITY_TEX_H : MOOD_TEX_H;

    const texture = useTexture(
        isActivityMode
            ? <ActivitySpriteSheet skSvgs={skSvgs} />
            : <MoodSpriteSheet skSvgs={skSvgs} />,
        { width: texW, height: texH }
    );

    // ─── 3. 스프라이트 매핑 ───
    const sprites = useMemo(() => {
        if (isActivityMode) {
            const idx = ACTIVITY_ATLAS_KEYS.indexOf(activityKey);
            const finalIdx = idx !== -1 ? idx : ACTIVITY_ATLAS_KEYS.length - 1; // 'default'
            const sourceRect = rect(finalIdx * PARTICLE_SIZE, 0, PARTICLE_SIZE, PARTICLE_SIZE);
            return new Array(POOL_SIZE).fill(sourceRect);
        } else {
            const charIdx = MOOD_ATLAS_KEYS.indexOf(character);
            const idx = (charIdx !== -1 && charIdx < 5) ? charIdx : 5;
            const sourceRect = rect(idx * PARTICLE_SIZE, 0, PARTICLE_SIZE, PARTICLE_SIZE);
            return new Array(POOL_SIZE).fill(sourceRect);
        }
    }, [character, activityKey, isActivityMode]);

    // ─── 4. 물리 시뮬레이션 (Circular Queue) ───
    const particleData = useSharedValue(
        new Array(POOL_SIZE).fill(null).map(createEmptyParticle)
    );

    const clock = useSharedValue(0);
    const isPaused = useSharedValue(true);
    const lastTime = useSharedValue(0);
    const hideTimerRef = useRef(null);

    // ✅ JS 멈춤 및 Reanimated Worklet 슬립 처리
    useFrameCallback((info) => {
        'worklet';
        if (isPaused.value) {
            lastTime.value = info.timeSinceFirstFrame;
            return;
        }
        
        const delta = info.timeSinceFirstFrame - lastTime.value;
        if (delta > 0) {
            clock.value += delta;
        }
        lastTime.value = info.timeSinceFirstFrame;
    });

    useEffect(() => {
        return () => {
            if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
        };
    }, []);

    const transforms = useRSXformBuffer(POOL_SIZE, (val, i) => {
        'worklet';
        const p = particleData.value[i];
        if (!p || !p.active) {
            val.set(0, 0, -1000, -1000);
            return;
        }

        const elapsed = (clock.value - p.startTime) / 1000;
        const progress = Math.min(elapsed / DURATION_SEC, 1);

        if (progress >= 1) {
            val.set(0, 0, -1000, -1000);
            return;
        }

        // 물리 궤적
        const x = p.originX + p.vx * elapsed;
        const y = p.originY + p.vy * elapsed + 0.5 * GRAVITY * elapsed * elapsed;

        // 스케일 곡선 (팝업 → 유지 → 소멸)
        const scale = progress < 0.1
            ? (progress / 0.1) * 1.2
            : progress < 0.8
                ? 0.7
                : 0.7 * (1 - (progress - 0.8) / 0.2);

        const angle = p.rotation * progress * Math.PI * 3;
        const cos = Math.cos(angle) * scale;
        const sin = Math.sin(angle) * scale;

        const anchor = PARTICLE_SIZE / 2;
        const tx = x + anchor - cos * anchor + sin * anchor;
        const ty = y + anchor - sin * anchor - cos * anchor;
        val.set(cos, sin, tx, ty);
    });

    // ─── 5. burst (Circular Queue 방식) ───
    useImperativeHandle(ref, () => ({
        burst: (x, y) => {
            const now = Date.now();
            if (now - lastBurstTime.current < 120) return;
            lastBurstTime.current = now;

            // ✅ 프레임 콜백 부활 및 파티클 발동 유지
            isPaused.value = false;
            if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
            hideTimerRef.current = setTimeout(() => {
                isPaused.value = true;
            }, DURATION_MS + 100);

            const currentTime = clock.value;
            const newData = [...particleData.value];
            const startIdx = slotIndex.current;

            for (let i = 0; i < BURST_COUNT; i++) {
                const idx = (startIdx + i) % POOL_SIZE;
                const angle = (i / BURST_COUNT) * Math.PI * 2 + (Math.random() - 0.5) * 1.5;
                const speed = 160 + Math.random() * 250;
                newData[idx] = {
                    active: true,
                    startTime: currentTime + Math.random() * 80,
                    originX: x - PARTICLE_SIZE / 2,
                    originY: y - PARTICLE_SIZE / 2,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed - 250,
                    rotation: (Math.random() > 0.5 ? 1 : -1) * (0.8 + Math.random() * 2.0),
                };
            }

            // 순환 인덱스 전진
            slotIndex.current = (startIdx + BURST_COUNT) % POOL_SIZE;
            particleData.value = newData;
        },
    }));

    if (!texture) return null;

    return (
        <Canvas style={skiaStyles.canvas} pointerEvents="none">
            <Atlas
                image={texture}
                sprites={sprites}
                transforms={transforms}
            />
        </Canvas>
    );
}));

const skiaStyles = StyleSheet.create({
    canvas: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: SCREEN_W,
        height: SCREEN_H,
        zIndex: 9999,
    },
});

import React, { useImperativeHandle, forwardRef, useRef, memo, useMemo } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
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

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

/**
 * 🎨 Skia 기반 고성능 파티클 엔진 (v4.7 - Hybrid Baking Architecture)
 *
 * 개선 사항:
 * 1. [Fix] canvas.drawSVG 에러 해결: 리액트 컴포넌트 계층(ImageSVG)을 사용하여 텍스처 생성
 * 2. [Clean XML] 이전 단계에서 정제한 표준 XML 데이터를 사용하여 파싱 성공률 확보
 * 3. [Master Atlas] 모든 캐릭터를 단일 텍스처로 미리 구워 리액티브 이슈 원천 차단
 */

const POOL_SIZE = 15;
const PARTICLE_SIZE = 36; 
const GRAVITY = 650;
const DURATION_MS = 1300;

const ATLAS_KEYS = ['frog', 'cat', 'chick', 'bear', 'rabbit', 'fallback'];
const COLS = ATLAS_KEYS.length;
const TEX_W = COLS * PARTICLE_SIZE;
const TEX_H = PARTICLE_SIZE;

/**
 * 텍스처 베이킹을 위한 내부 컴포넌트
 */
const MasterSpriteSheet = ({ skSvgs }) => {
    return (
        <Group>
            {ATLAS_KEYS.map((key, i) => {
                const x = i * PARTICLE_SIZE;
                const svg = skSvgs[key];
                
                // 캐릭터별 고유 색상 (SVG 로드 실패 대비)
                const colors = ['#B4DCC6', '#8BBFEF', '#FEE97D', '#C9B5B6', '#FFB5B5', '#FFD700'];

                if (key === 'fallback' || !svg) {
                    return (
                        <Circle 
                            key={key} 
                            cx={x + PARTICLE_SIZE / 2} 
                            cy={PARTICLE_SIZE / 2} 
                            r={PARTICLE_SIZE / 2 - 4} 
                            color={colors[i]} 
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
    );
};

export const SkiaConfettiEffect = memo(forwardRef(({ character }, ref) => {
    const lastBurstTime = useRef(0);

    // ─── 1. SVG 사전 파싱 (마운트 시 1회) ───
    const skSvgs = useMemo(() => {
        const map = {};
        Object.entries(MOOD_CHARACTER_SVG_MAP).forEach(([key, xml]) => {
            try {
                const parsed = Skia.SVG.MakeFromString(xml);
                if (parsed) map[key] = parsed;
            } catch (e) {
                console.warn(`[SkiaConfetti] SVG 파싱 실패 (${key}):`, e);
            }
        });
        return map;
    }, []);

    // ─── 2. 하이브리드 텍스처 생성 (GPU Baking) ───
    const texture = useTexture(
        <MasterSpriteSheet skSvgs={skSvgs} />,
        { width: TEX_W, height: TEX_H }
    );

    // ─── 3. 스프라이트 매핑 (UV 선택) ───
    const sprites = useMemo(() => {
        const charIdx = ATLAS_KEYS.indexOf(character);
        // 캐릭터가 없거나 'fallback'이 매칭되면 5번 인덱스(도형) 사용
        const idx = (charIdx !== -1 && charIdx < 5) ? charIdx : 5;
        const sourceRect = rect(idx * PARTICLE_SIZE, 0, PARTICLE_SIZE, PARTICLE_SIZE);
        return new Array(POOL_SIZE).fill(sourceRect);
    }, [character]);

    // ─── 4. 물리 시뮬레이션 SharedValues ───
    const particleData = useSharedValue(
        new Array(POOL_SIZE).fill(null).map(() => ({
            active: false,
            startTime: 0,
            originX: 0,
            originY: 0,
            vx: 0,
            vy: 0,
            rotation: 0,
        }))
    );

    const clock = useSharedValue(0);
    useFrameCallback((info) => {
        'worklet';
        clock.value = info.timeSinceFirstFrame;
    });

    const transforms = useRSXformBuffer(POOL_SIZE, (val, i) => {
        'worklet';
        const p = particleData.value[i];
        if (!p || !p.active) {
            val.set(0, 0, -1000, -1000);
            return;
        }

        const elapsed = (clock.value - p.startTime) / 1000;
        const progress = Math.min(elapsed / (DURATION_MS / 1000), 1);

        if (progress >= 1) {
            val.set(0, 0, -1000, -1000);
            return;
        }

        // 물리 궤적 연산
        const x = p.originX + p.vx * elapsed;
        const y = p.originY + p.vy * elapsed + 0.5 * GRAVITY * elapsed * elapsed;
        
        // 애니메이션 곡선 (팝업 -> 유지 -> 소멸)
        const scale = progress < 0.1 
            ? (progress / 0.1) * 1.2 
            : progress < 0.8 
                ? 1.2 
                : 1.2 * (1 - (progress - 0.8) / 0.2);

        const angle = p.rotation * progress * Math.PI * 4;
        const cos = Math.cos(angle) * scale;
        const sin = Math.sin(angle) * scale;

        const anchor = PARTICLE_SIZE / 2;
        const tx = x + anchor - cos * anchor + sin * anchor;
        const ty = y + anchor - sin * anchor - cos * anchor;
        val.set(cos, sin, tx, ty);
    });

    useImperativeHandle(ref, () => ({
        burst: (x, y) => {
            const now = Date.now();
            if (now - lastBurstTime.current < 150) return;
            lastBurstTime.current = now;

            const currentTime = clock.value;
            const newData = [...particleData.value];
            for (let i = 0; i < POOL_SIZE; i++) {
                const angle = (i / POOL_SIZE) * Math.PI * 2 + (Math.random() - 0.5) * 1.5;
                const speed = 220 + Math.random() * 250;
                newData[i] = {
                    active: true,
                    startTime: currentTime + Math.random() * 80,
                    originX: x - PARTICLE_SIZE / 2,
                    originY: y - PARTICLE_SIZE / 2,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed - 250,
                    rotation: (Math.random() > 0.5 ? 1 : -1) * (0.8 + Math.random() * 2.0),
                };
            }
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

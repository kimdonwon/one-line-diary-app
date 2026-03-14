import React, { useRef } from 'react';
import { View, PanResponder, Keyboard, Animated } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { styles } from './RotationHandle.styles';

export default function RotationHandle({
    containerRef,
    currentRotation,
    currentScale,
    onRotate,
    onRotateAndScale,
    onRotateEnd,
    onInteractionStart,
    onInteractionEnd,
    style,
    minScale = 0.3, // 👈 추가
    maxScale = 5.0  // 👈 추가
}) {
    const startInteraction = useRef({
        cx: 0,
        cy: 0,
        startAngle: 0,
        initialRotation: 0,
        startDist: 0,
        initialScale: 1,
        ready: false
    });

    const handlePanResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onStartShouldSetPanResponderCapture: () => true,
            onMoveShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponderCapture: () => true,
            onPanResponderTerminationRequest: () => false,

            onPanResponderGrant: (e, gestureState) => {
                Keyboard.dismiss();
                if (onInteractionStart) onInteractionStart();
                const { x0, y0 } = gestureState;
                const initRot = currentRotation.current;

                startInteraction.current.ready = false;

                if (containerRef.current) {
                    containerRef.current.measureInWindow((x, y, w, h) => {
                        const cx = x + w / 2;
                        const cy = y + h / 2;
                        const dx = x0 - cx;
                        const dy = y0 - cy;
                        const startAngle = Math.atan2(dy, dx) * (180 / Math.PI);
                        const startDist = Math.sqrt(dx * dx + dy * dy);

                        startInteraction.current = {
                            cx, cy,
                            startAngle, initialRotation: initRot,
                            startDist, initialScale: currentScale ? currentScale.current : 1,
                            ready: true
                        };
                    });
                }
            },
            onPanResponderMove: (e, gestureState) => {
                if (!startInteraction.current.ready) return;

                const { cx, cy, startAngle, initialRotation, startDist, initialScale } = startInteraction.current;
                const dx = gestureState.moveX - cx;
                const dy = gestureState.moveY - cy;

                const currentAngle = Math.atan2(dy, dx) * (180 / Math.PI);
                let delta = currentAngle - startAngle;

                if (delta > 180) delta -= 360;
                if (delta < -180) delta += 360;

                const currentDist = Math.sqrt(dx * dx + dy * dy);
                const scaleRatio = startDist > 0 ? (currentDist / startDist) : 1;
                let newScale = initialScale * scaleRatio;

                // 💡 동적 제한 적용
                if (newScale < minScale) newScale = minScale;
                if (newScale > maxScale) newScale = maxScale;

                if (onRotateAndScale) {
                    onRotateAndScale(initialRotation + delta, newScale);
                } else if (onRotate) {
                    onRotate(initialRotation + delta);
                }
            },
            onPanResponderRelease: () => {
                if (onRotateEnd) onRotateEnd();
                if (onInteractionEnd) onInteractionEnd();
            },
            onPanResponderTerminate: () => {
                if (onRotateEnd) onRotateEnd();
                if (onInteractionEnd) onInteractionEnd();
            },
            onShouldBlockNativeResponder: () => true,
        })
    ).current;

    return (
        <Animated.View
            style={[styles.rotationHandle, style]}
            {...handlePanResponder.panHandlers}
        >
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                <Path d="M15 3H21V9" stroke="#8B7E74" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <Path d="M9 21H3V15" stroke="#8B7E74" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <Path d="M21 3L14 10" stroke="#8B7E74" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <Path d="M3 21L10 14" stroke="#8B7E74" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
        </Animated.View>
    );
}

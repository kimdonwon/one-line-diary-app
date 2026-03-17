import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Animated, PanResponder, Keyboard, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { RotationHandle } from '../components/RotationHandle';

/**
 * ✏️ 편집 아이콘 (연필 모양)
 */
function EditIcon({ size = 20, color = '#8B7E74' }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Path
                d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M18.5 2.50023C18.8978 2.1024 19.4374 1.87891 20 1.87891C20.5626 1.87891 21.1022 2.1024 21.5 2.50023C21.8978 2.89805 22.1213 3.43762 22.1213 4.00023C22.1213 4.56284 21.8978 5.1024 21.5 5.50023L12 15.0002L8 16.0002L9 12.0002L18.5 2.50023Z"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}

/**
 * ⚙️ 드래그, 회전, 경계(bounds) 등 공통 로직을 처리하는 통합 훅입니다.
 *
 * v2: 롱프레스 기반 드래그 시스템
 *  - 꾹 눌러야(400ms) 드래그 가능
 *  - 꾹 누르기를 떼면 선택 상태 (회전/크기 조절 핸들 표시)
 *  - 드래그 중 onDragMove를 호출해 쓰레기통 영역 감지를 외부에 위임
 *  - 더블탭 삭제 제거 → 인스타그램 스타일 쓰레기통 삭제로 대체
 */
export function useDraggable({
    id,
    initialX,
    initialY,
    initialRotation = 0,
    initialScale = 1,
    bounds,
    onDelete,
    onDragEnd,
    onFocus,
    onTap,
    isEditing = false,
    defaultSize = { width: 40, height: 40 },
    externalPan,
    externalRotation,
    onInteractionStart,
    onInteractionEnd,
    onDragMove,       // (id, pageX, pageY) 드래그 중 실시간 위치 보고 (쓰레기통 감지용)
    onDragDrop,       // (id, pageX, pageY) => boolean 드롭 시 쓰레기통 위인지 반환
    onSelect,         // (id) 선택되었음을 알림 (중앙 관리용)
    isSelected: externalIsSelected = null, // 외부에서 관리되는 선택 상태
    createdAt,        // 생성 시간 (애니메이션용)
    scaleMultiplier = 1, // 💡 UI 보정을 위한 내부 스케일 배율 (Text: 1, Sticker: 0.35 등)
    controlScale = 1, // 💡 크기 회전 버튼 배율 (스티커만)
    offsetMultiplier = 1, // 👈 크기 회전 버튼 위치 (스티커만)
    minScale,   // 👈 기본값 제거 (RotationHandle에서 처리)
    maxScale    // 👈 기본값 제거 (RotationHandle에서 처리)
}) {
    const isRecent = createdAt && (Date.now() - createdAt < 1000);
    const pan = externalPan || useRef(new Animated.ValueXY({ x: initialX, y: isRecent ? initialY + 300 : initialY })).current;
    const rotation = externalRotation || useRef(new Animated.Value(initialRotation)).current;
    const currentRotation = useRef(initialRotation);

    const springScale = useRef(new Animated.Value(isRecent ? 0.2 : 1)).current;
    const transformScale = useRef(new Animated.Value(initialScale)).current;
    const currentTransformScale = useRef(initialScale);
    const combinedScale = Animated.multiply(springScale, transformScale);

    const currentPosition = useRef({ x: initialX, y: initialY });
    const lastGesture = useRef({ dx: 0, dy: 0 });

    //const [mySize, setMySize] = useState(defaultSize);
    const [mySize, setMySizeState] = useState(defaultSize);
    const mySizeRef = useRef(defaultSize);
    const setMySize = useCallback((size) => {
        mySizeRef.current = size;
        setMySizeState(size);
    }, []);
    const [isDragging, setIsDragging] = useState(false);
    const [isSelected, setIsSelected] = useState(false);
    const isSelectedRef = useRef(false);

    // 내부 상태와 외부 상태를 통합 (중앙 관리용)
    const effectiveSelected = externalIsSelected !== null ? externalIsSelected : isSelected;
    const effectiveSelectedRef = useRef(effectiveSelected);
    effectiveSelectedRef.current = effectiveSelected;

    const prevSelected = useRef(effectiveSelected);

    // 💡 생성 직후 슝 날아오는 애니메이션 (바텀시트 -> 캔버스)
    useEffect(() => {
        if (isRecent && !externalPan) {
            Animated.parallel([
                Animated.spring(pan, {
                    toValue: { x: initialX, y: initialY },
                    friction: 7,
                    tension: 60,
                    useNativeDriver: false
                }),
                Animated.spring(springScale, {
                    toValue: 1,
                    friction: 7,
                    tension: 60,
                    useNativeDriver: false
                })
            ]).start();
        }
    }, []);

    // 💡 선택 상태 진입 시 귀여운 씰룩 효과 (Wiggle Animation)
    useEffect(() => {
        if (effectiveSelected && !prevSelected.current) {
            Animated.sequence([
                Animated.timing(rotation, { toValue: currentRotation.current + 6, duration: 60, useNativeDriver: false }),
                Animated.timing(rotation, { toValue: currentRotation.current - 4, duration: 80, useNativeDriver: false }),
                Animated.timing(rotation, { toValue: currentRotation.current + 3, duration: 80, useNativeDriver: false }),
                Animated.timing(rotation, { toValue: currentRotation.current, duration: 60, useNativeDriver: false })
            ]).start();
        }
        prevSelected.current = effectiveSelected;
    }, [effectiveSelected, rotation]);

    // 롱프레스 상태 관리
    const longPressTimer = useRef(null);
    const isLongPressed = useRef(false);

    // ─── 🚀 공통 UI 보정 로직 통합 ───
    // 시각적 스케일 (실제 화면에 그려지는 크기 비율)
    const visualScale = Animated.multiply(combinedScale, scaleMultiplier);

    // 1. 버튼 역보정 스케일: 부모가 커져도 버튼 크기는 일정하게 유지
    const rawHandleScale = visualScale.interpolate({
        inputRange: [0.1, 0.2, 0.3, 0.5, 0.7, 1, 1.5, 2, 3, 5],
        outputRange: [10, 5, 3.33, 2, 1.428, 1, 0.666, 0.5, 0.333, 0.2],
        extrapolate: 'clamp'
    });
    const handleScale = Animated.multiply(rawHandleScale, controlScale);

    // 2. 핸들 오프셋 역보정: 항상 테두리 밖 -24px 지점 유지
    const rawHandleOffset = visualScale.interpolate({
        inputRange: [0.1, 0.2, 0.3, 0.5, 0.7, 1, 1.5, 2, 3, 5],
        outputRange: [-240, -120, -80, -48, -34.28, -24, -16, -12, -8, -4.8],
        extrapolate: 'clamp'
    });
    const handleOffset = Animated.multiply(rawHandleOffset, offsetMultiplier);

    // 3. 드래그 막대 오프셋: 항상 테두리 하단 -36px 지점 유지
    const dragHandleOffset = visualScale.interpolate({
        inputRange: [0.1, 0.2, 0.3, 0.5, 0.7, 1, 1.5, 2, 3, 5],
        outputRange: [-360, -180, -120, -72, -51.42, -50, -36, -18, -12, -7.2],
        extrapolate: 'clamp'
    });

    // 4. 공통 드래그 핸들 렌더러
    const renderDragHandle = () => {
        if (!effectiveSelected || isEditing) return null;
        return (
            <Animated.View style={{
                position: 'absolute',
                bottom: dragHandleOffset,
                left: '50%',
                marginLeft: -13,
                width: 40,
                height: 15,
                borderRadius: 5,
                backgroundColor: '#8B7E74',
                transform: [{ scale: rawHandleScale }],
                zIndex: 1000, // 👈 다른 핸들(999)보다 높게 설정하여 우선순위 확보
            }} />
        );
    };

    // ─── 🕹️ 통합 조작 UI 렌더러 ───
    const renderControls = ({ containerRef, editOptions = null } = {}) => {
        if (!effectiveSelected || isEditing) return null;

        return (
            <>
                {/* 👆 드래그 막대 핸들 */}
                {renderDragHandle()}

                {/* 🔄 회전 핸들 */}
                <RotationHandle
                    containerRef={containerRef}
                    currentRotation={currentRotation}
                    currentScale={currentTransformScale}
                    onRotateAndScale={handleRotateAndScale}
                    onRotateEnd={handleRotationEnd}
                    onInteractionStart={onInteractionStart}
                    onInteractionEnd={onInteractionEnd}
                    minScale={minScale} // 👈 전달
                    maxScale={maxScale} // 👈 전달
                    style={{
                        position: 'absolute',
                        right: flipRightOffset,
                        bottom: handleOffset,
                        transform: [{ scale: handleScale }]
                    }}
                />

                {/* ✏️ 수정 버튼 (옵션이 있을 때만) */}
                {editOptions && (
                    <Animated.View
                        {...(editOptions.panHandlers || {})}
                        style={{
                            position: 'absolute',
                            left: flipLeftOffset,
                            bottom: handleOffset,
                            width: 43,
                            height: 43,
                            borderRadius: 21.5,
                            backgroundColor: '#FFFFFF',
                            borderWidth: 1.2,
                            borderColor: '#D1C7BD',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 999,
                            shadowColor: '#8B7E74',
                            shadowOffset: { width: 0, height: 3 },
                            shadowOpacity: 0.2,
                            shadowRadius: 5,
                            elevation: 6,
                            transform: [{ scale: handleScale }]
                        }}
                    >
                        <View style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                            <EditIcon size={20} color="#8B7E74" />
                        </View>
                    </Animated.View>
                )}
            </>
        );
    };
    // 5. 플립 오프셋: 벽에 가까워지면 핸들을 안쪽으로 밀어 넣어줍니다.
    const canvasWidth = bounds?.width || 350;
    const flipLeftOffset = pan.x.interpolate({
        inputRange: [0, 40],
        outputRange: [10, -24],
        extrapolate: 'clamp'
    });

    const flipRightOffset = pan.x.interpolate({
        inputRange: [canvasWidth - mySize.width - 40, canvasWidth - mySize.width],
        outputRange: [-24, 10],
        extrapolate: 'clamp'
    });
    const [isLongPressActive, setIsLongPressActive] = useState(false); // UI 반영용
    const hasMoved = useRef(false);
    const LONG_PRESS_DELAY = 400; // 400ms 꾹 누르기

    const updateIsSelected = useCallback((val) => {
        isSelectedRef.current = val;
        setIsSelected(val);
        // 선택되었을 때만 외부 콜백 호출 (중앙 관리용)
        if (val && onSelect) {
            onSelect(id);
        }
    }, [id, onSelect]);

    const deselectTimer = useRef(null);
    const isPressed = useRef(false);

    const isEditingRef = useRef(isEditing);
    isEditingRef.current = isEditing;

    const wasSelectedRef = useRef(false);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => !isEditingRef.current,
            onStartShouldSetPanResponderCapture: () => false, // 💡 자식(TextInput)의 터치를 빼앗지 않음
            onMoveShouldSetPanResponder: (e, gs) => {
                if (isEditingRef.current) return false;
                // 💡 이미 선택된 상태라면 미세한 움직임도 즉시 가로챔
                if (effectiveSelectedRef.current) return true;
                return false; // 선택 안 된 상태는 롱프레스에서 처리
            },
            onMoveShouldSetPanResponderCapture: (e, gs) => {
                if (isEditingRef.current) return false;
                // 💡 선택 상태에서만 캡처 (비선택 상태에서는 FlatList 스크롤을 방해하지 않음)
                if (effectiveSelectedRef.current) {
                    return true;
                }
                return false;
            },

            onPanResponderGrant: () => {
                if (effectiveSelectedRef.current && onInteractionStart) {
                    onInteractionStart();
                } // 💡 터치 즉시 부모 스크롤 차단 시도

                if (!isEditingRef.current) {
                    Keyboard.dismiss();
                }
                wasSelectedRef.current = effectiveSelectedRef.current;
                isPressed.current = true;
                lastGesture.current = { dx: 0, dy: 0 };
                hasMoved.current = false;
                isLongPressed.current = false;
                setIsLongPressActive(false);

                if (deselectTimer.current) {
                    clearTimeout(deselectTimer.current);
                    deselectTimer.current = null;
                }

                // 값의 점프 방지
                pan.setValue({ x: currentPosition.current.x, y: currentPosition.current.y });

                if (effectiveSelectedRef.current) {
                    // 💡 이미 선택된 상태라면 롱프레스 대기 없이 즉시 드래그 허용
                    isLongPressed.current = true;
                    setIsLongPressActive(true);
                    setIsDragging(true);

                    if (onFocus) onFocus(id);

                    Animated.spring(springScale, {
                        toValue: 1,
                        friction: 5,
                        useNativeDriver: false
                    }).start();
                } else {
                    // 선택되지 않은 상태라면 기존처럼 롱프레스 타이머 시작
                    longPressTimer.current = setTimeout(() => {
                        if (isPressed.current && !hasMoved.current) {
                            isLongPressed.current = true;
                            setIsLongPressActive(true);
                            setIsDragging(true);

                            if (onFocus) onFocus(id);

                            // 꾹 누르기 완료 시 스케일 업 피드백
                            Animated.spring(springScale, {
                                toValue: 1,
                                friction: 5,
                                useNativeDriver: false
                            }).start();
                        }
                    }, LONG_PRESS_DELAY);
                }
            },

            onPanResponderMove: (e, gestureState) => {
                const moveDist = Math.sqrt(gestureState.dx * gestureState.dx + gestureState.dy * gestureState.dy);

                // 롱프레스 판정 전에 많이 움직이면 타이머 취소 (이미 선택된 경우는 예외)
                if (!isLongPressed.current && moveDist > 10 && !effectiveSelectedRef.current) {
                    hasMoved.current = true;
                    if (longPressTimer.current) {
                        clearTimeout(longPressTimer.current);
                        longPressTimer.current = null;
                    }
                    return;
                }

                // 롱프레스가 아직 안 됐으면 무시
                if (!isLongPressed.current) return;

                // [드래그 계산] 이전 제스처 위치와의 차이만큼 이동량을 계산합니다.
                const deltaX = gestureState.dx - lastGesture.current.dx;
                const deltaY = gestureState.dy - lastGesture.current.dy;
                lastGesture.current = { dx: gestureState.dx, dy: gestureState.dy };

                let nextX = currentPosition.current.x + deltaX;
                let nextY = currentPosition.current.y + deltaY;

                // [경계 제한] 아이템이 캔버스 밖으로 완전히 나가지 않도록 제한합니다. (쓰레기통은 예외)
                if (bounds && bounds.width > 0) {
                    const BORDER_OFFSET = 2;
                    nextX = Math.max(BORDER_OFFSET, Math.min(nextX, bounds.width - mySizeRef.current.width - BORDER_OFFSET));
                    // 🗑️ 쓰레기통 영역(캔버스 하단 외곽)으로의 이동은 허용합니다.
                    nextY = Math.max(BORDER_OFFSET, Math.min(nextY, bounds.height + 500));
                }

                // [위치 업데이트] 실시간으로 좌표 값을 업데이트하고 애니메이션 값(pan)에 반영합니다.
                currentPosition.current = { x: nextX, y: nextY };
                pan.setValue({ x: nextX, y: nextY });

                // [실시간 보고] 외부(Logic)에 현재 드래그 위치를 알려 쓰레기통 활성화 여부를 판단하게 합니다.
                if (onDragMove) {
                    onDragMove(id, gestureState.moveX, gestureState.moveY);
                }
            },

            onPanResponderRelease: (e, gestureState) => {
                // 롱프레스 타이머 정리
                if (longPressTimer.current) {
                    clearTimeout(longPressTimer.current);
                    longPressTimer.current = null;
                }

                const wasLongPress = isLongPressed.current;
                const dragDistance = Math.sqrt(
                    Math.pow(lastGesture.current.dx, 2) + Math.pow(lastGesture.current.dy, 2)
                );

                isPressed.current = false;
                isLongPressed.current = false;
                setIsLongPressActive(false);

                Animated.spring(springScale, {
                    toValue: 1,
                    friction: 5,
                    useNativeDriver: false
                }).start();

                // 1) 롱프레스 드래그 후 드롭 시점
                if (wasLongPress && dragDistance > 5) {
                    setIsDragging(false);

                    let deletedByTrash = false;
                    // [드롭 처리] 아이템을 놓았을 때 쓰레기통 위인지 체크하고, 맞다면 삭제를 수행합니다.
                    if (onDragDrop) {
                        deletedByTrash = onDragDrop(id, gestureState.moveX, gestureState.moveY);
                    }

                    if (deletedByTrash) {
                        // 쓰레기통에 드롭됨 -> 삭제 로직은 Logic 파일의 handleDelete* 함수에서 수행됩니다.
                        if (onInteractionEnd) onInteractionEnd();
                        return;
                    }

                    // [위치 보정] 쓰레기통이 아닌 곳에 놓았다면, 캔버스 안쪽으로 좌표를 안착 시킵니다.
                    const BORDER_OFFSET = 2;
                    let finalX = currentPosition.current.x;
                    let finalY = currentPosition.current.y;

                    if (bounds && bounds.height > 0) {
                        const maxX = bounds.width - (mySizeRef.current.width || 0) - BORDER_OFFSET;
                        const maxY = bounds.height - (mySizeRef.current.height || 0) - BORDER_OFFSET;

                        finalX = Math.max(BORDER_OFFSET, Math.min(finalX, maxX));
                        finalY = Math.max(BORDER_OFFSET, Math.min(finalY, maxY));
                        currentPosition.current = { x: finalX, y: finalY };
                    }

                    // [상태 저장] 최종 좌표를 Logic 상태에 저장하여 다음에 들어왔을 때도 유지되게 합니다.
                    const needsSnap = Math.abs(pan.x._value - finalX) > 1 || Math.abs(pan.y._value - finalY) > 1;

                    if (needsSnap) {
                        Animated.spring(pan, {
                            toValue: { x: finalX, y: finalY },
                            friction: 7,
                            tension: 40,
                            useNativeDriver: false
                        }).start(() => {
                            if (onDragEnd) {
                                onDragEnd(id, finalX, finalY, currentRotation.current, currentTransformScale.current);
                            }
                            if (onInteractionEnd) onInteractionEnd();
                        });
                    } else {
                        if (onDragEnd) {
                            onDragEnd(id, finalX, finalY, currentRotation.current, currentTransformScale.current);
                        }
                        if (onInteractionEnd) onInteractionEnd();
                    }
                    updateIsSelected(true);


                    // 자동 해제 타이머
                    if (deselectTimer.current) clearTimeout(deselectTimer.current);
                    deselectTimer.current = setTimeout(() => updateIsSelected(false), 5000);
                    return;
                }

                // 2) 롱프레스만 하고 드래그 안 함 → 선택 상태 진입
                if (wasLongPress && dragDistance <= 5) {
                    setIsDragging(false);
                    updateIsSelected(true);
                    if (onInteractionEnd) onInteractionEnd();

                    // 자동 해제 타이머
                    if (deselectTimer.current) clearTimeout(deselectTimer.current);
                    deselectTimer.current = setTimeout(() => updateIsSelected(false), 5000);
                    return;
                }

                // 3) 짧은 탭 (롱프레스가 아닌 경우)
                setIsDragging(false);
                const isShortTap = dragDistance < 10 && !hasMoved.current;

                if (isShortTap) {
                    if (onTap) {
                        onTap(id, wasSelectedRef.current);
                    } else {
                        // 💡 별도의 onTap이 없다면 기본 동작으로 선택 상태 토글
                        updateIsSelected(!wasSelectedRef.current);
                    }

                }
            },
            onPanResponderTerminate: () => {
                if (longPressTimer.current) {
                    clearTimeout(longPressTimer.current);
                    longPressTimer.current = null;
                }
                setIsDragging(false);
                isPressed.current = false;
                isLongPressed.current = false;
                setIsLongPressActive(false);

                if (onInteractionEnd) onInteractionEnd();

                Animated.spring(springScale, {
                    toValue: 1,
                    friction: 5,
                    useNativeDriver: false
                }).start();
            },
            // 💡 선택/드래그 상태에서만 제스처 독점, 그 외에는 다른 컴포넌트(FlatList 등)에 양보
            onPanResponderTerminationRequest: () => {
                return effectiveSelectedRef.current ? false : true;
            },
            onShouldBlockNativeResponder: () => true,
        })
    ).current;

    const handleRotation = (angleDeg) => {
        currentRotation.current = angleDeg;
        rotation.setValue(angleDeg);
    };

    const handleRotateAndScale = (angleDeg, newScale) => {
        currentRotation.current = angleDeg;
        rotation.setValue(angleDeg);
        currentTransformScale.current = newScale;
        transformScale.setValue(newScale);
    };

    const handleRotationEnd = () => {
        if (onDragEnd) {
            onDragEnd(id, currentPosition.current.x, currentPosition.current.y, currentRotation.current, currentTransformScale.current);
        }
    };

    // 외부에서 선택 해제할 때 사용
    const deselect = useCallback(() => {
        updateIsSelected(false);
        if (deselectTimer.current) {
            clearTimeout(deselectTimer.current);
            deselectTimer.current = null;
        }
    }, []);

    return {
        pan,
        rotation,
        currentRotation,
        lastRotation: currentRotation,
        scale: combinedScale,
        transformScale,
        currentTransformScale,
        panResponder,
        isDragging,
        isSelected: effectiveSelected,
        isLongPressActive,
        setIsSelected: updateIsSelected,
        setMySize,
        mySize: mySizeRef.current,
        handleRotation,
        handleRotateAndScale,
        handleRotationEnd,
        deselect,
        // UI Helpers
        visualScale,  // 💡 메인 컨테이너 스케일용으로 남겨둠
        renderControls, // 👈 보정값들은 모두 이 안에 캡슐화됨!
    };
}

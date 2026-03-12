import { useRef, useState, useCallback, useEffect } from 'react';
import { Animated, PanResponder, Keyboard } from 'react-native';

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

    const [mySize, setMySize] = useState(defaultSize);
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
                if (isEditingRef.current) return false; // 💡 편집 중일 때는 절대 드래그 가로채지 않음 (Text 커서 이동 보장)
                const moveDist = Math.sqrt(gs.dx * gs.dx + gs.dy * gs.dy);
                // 💡 이미 선택된 상태라면 1px만 움직여도 즉시 가로챔 (버튼 클릭 보호와 스크롤 간섭 차단)
                if (effectiveSelectedRef.current) return moveDist > 1;
                return false;
            },
            onMoveShouldSetPanResponderCapture: (e, gs) => {
                if (isEditingRef.current) return false;
                const moveDist = Math.sqrt(gs.dx * gs.dx + gs.dy * gs.dy);
                // 💡 이미 선택된 상태에서 움직임이 감지되면 캡처 단계에서 미리 낚아채어 부모(FlatList)의 스크롤을 원천 차단
                if (effectiveSelectedRef.current && moveDist > 1) return true;
                return false;
            },

            onPanResponderGrant: () => {
                if (onInteractionStart) onInteractionStart(); // 💡 터치 즉시 부모 스크롤 차단 시도

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

                const deltaX = gestureState.dx - lastGesture.current.dx;
                const deltaY = gestureState.dy - lastGesture.current.dy;
                lastGesture.current = { dx: gestureState.dx, dy: gestureState.dy };

                let nextX = currentPosition.current.x + deltaX;
                let nextY = currentPosition.current.y + deltaY;

                // 물리적 바운더리 제한
                if (bounds && bounds.width > 0) {
                    const BORDER_OFFSET = 2;
                    nextX = Math.max(BORDER_OFFSET, Math.min(nextX, bounds.width - mySize.width - BORDER_OFFSET));
                    // 🗑️ 글로벌 레이어(하이브리드) 캔버스 탈출 효과를 위해 하단 바운더리는 무한정(또는 화면 하단 500px까지) 허용
                    nextY = Math.max(BORDER_OFFSET, Math.min(nextY, bounds.height + 500));
                }

                currentPosition.current = { x: nextX, y: nextY };
                pan.setValue({ x: nextX, y: nextY });

                // 쓰레기통 영역 감지를 위해 절대 좌표(pageX/pageY) 보고
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

                // 1) 롱프레스 드래그 후 드롭 → 쓰레기통 삭제 확인
                if (wasLongPress && dragDistance > 5) {
                    setIsDragging(false);

                    let deletedByTrash = false;
                    if (onDragDrop) {
                        deletedByTrash = onDragDrop(id, gestureState.moveX, gestureState.moveY);
                    }

                    if (deletedByTrash) {
                        // 쓰레기통에 드롭됨 → 삭제 처리는 외부에서
                        if (onInteractionEnd) onInteractionEnd();
                        return;
                    }

                    // 🗑️ 쓰레기통이 아닌 곳에 드롭 → 위치 보정 및 상태 저장
                    const BORDER_OFFSET = 2;
                    let finalX = currentPosition.current.x;
                    let finalY = currentPosition.current.y;

                    // 경계값이 있다면 보정 수행
                    if (bounds && bounds.height > 0) {
                        const maxX = bounds.width - (mySize.width || 0) - BORDER_OFFSET;
                        const maxY = bounds.height - (mySize.height || 0) - BORDER_OFFSET;

                        finalX = Math.max(BORDER_OFFSET, Math.min(finalX, maxX));
                        finalY = Math.max(BORDER_OFFSET, Math.min(finalY, maxY));
                        currentPosition.current = { x: finalX, y: finalY };
                    }

                    // 보정된 위치로 애니메이션 (필요한 경우) 및 콜백 호출
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
            // 💡 중요: 드래그 중에는 다른 컴포넌트(스크롤뷰 등)에게 제스처 주도권을 뺏기지 않도록 함
            onPanResponderTerminationRequest: () => false,
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
        mySize,
        handleRotation,
        handleRotateAndScale,
        handleRotationEnd,
        deselect,
    };
}

import { useRef, useState } from 'react';
import { Animated, PanResponder, Keyboard } from 'react-native';

/**
 * ⚙️ 드래그, 회전, 더블 탭 삭제, 경계(bounds) 등 공통 로직을 처리하는 통합 훅입니다.
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
    onFocus,          // (Text 전용)
    onTap,            // (Text 전용) 탭 발생 시 콜백
    isEditing = false, // (Text 편집 모드 상태)
    defaultSize = { width: 40, height: 40 },
    externalPan,
    externalRotation,
    onInteractionStart, // 상호작용 시작 콜백 (스크롤 방지용)
    onInteractionEnd,   // 상호작용 종료 콜백
}) {
    const pan = externalPan || useRef(new Animated.ValueXY({ x: initialX, y: initialY })).current;
    const rotation = externalRotation || useRef(new Animated.Value(initialRotation)).current;
    const currentRotation = useRef(initialRotation);

    // 눌렀을 때의 통통 튀는 스프링 효과
    const springScale = useRef(new Animated.Value(1)).current;

    // 리사이즈를 위한 영구적인 스케일 효과
    const transformScale = useRef(new Animated.Value(initialScale)).current;
    const currentTransformScale = useRef(initialScale);

    // 두 스케일을 합성 (spring * transform)
    const combinedScale = Animated.multiply(springScale, transformScale);

    const currentPosition = useRef({ x: initialX, y: initialY });
    const lastGesture = useRef({ dx: 0, dy: 0 });

    const [mySize, setMySize] = useState(defaultSize);
    const [isDragging, setIsDragging] = useState(false);
    const [isSelected, setIsSelected] = useState(false);
    const isSelectedRef = useRef(false); // 클로저 이슈 해결을 위한 Ref

    const updateIsSelected = (val) => {
        isSelectedRef.current = val;
        setIsSelected(val);
    };

    const lastTap = useRef(0);
    const DOUBLE_TAP_DELAY = 400; // 300ms -> 400ms로 완화 (더블탭 인식률 향상)
    const deselectTimer = useRef(null);
    const isPressed = useRef(false);

    const isEditingRef = useRef(isEditing); // PanResponder 클로저 안에서 최신 isEditing 값 참조
    isEditingRef.current = isEditing; // 매 렌더링마다 동기화

    const wasSelectedRef = useRef(false); // 터치 시작 시 선택 상태 저장

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => !isEditingRef.current,
            onMoveShouldSetPanResponder: (e, gs) => {
                const moveThreshold = isEditingRef.current ? 8 : 3;
                return Math.abs(gs.dx) > moveThreshold || Math.abs(gs.dy) > moveThreshold;
            },

            onPanResponderGrant: () => {
                // 편집 중이 아닐 때만 키보드를 내림
                if (!isEditingRef.current) {
                    Keyboard.dismiss();
                }
                setIsDragging(true);
                wasSelectedRef.current = isSelectedRef.current;
                // updateIsSelected(true); // <--- Release에서 결정하도록 여기서는 주석 처리
                isPressed.current = true;
                lastGesture.current = { dx: 0, dy: 0 };

                if (deselectTimer.current) {
                    clearTimeout(deselectTimer.current);
                    deselectTimer.current = null;
                }

                if (onInteractionStart) onInteractionStart();
                if (onFocus) onFocus(id);

                // 값의 점프 및 시각적 잔상 방지를 위해 setOffset 대신 직접 좌표 주입
                pan.setValue({ x: currentPosition.current.x, y: currentPosition.current.y });

                Animated.spring(springScale, {
                    toValue: 1.05,
                    friction: 5,
                    useNativeDriver: false
                }).start();
            },

            onPanResponderMove: (e, gestureState) => {

                const deltaX = gestureState.dx - lastGesture.current.dx;
                const deltaY = gestureState.dy - lastGesture.current.dy;
                lastGesture.current = { dx: gestureState.dx, dy: gestureState.dy };

                let nextX = currentPosition.current.x + deltaX;
                let nextY = currentPosition.current.y + deltaY;

                // 물리적 바운더리 제한 연산
                if (bounds && bounds.width > 0) {
                    const BORDER_OFFSET = 2;
                    nextX = Math.max(BORDER_OFFSET, Math.min(nextX, bounds.width - mySize.width - BORDER_OFFSET));
                    nextY = Math.max(BORDER_OFFSET, Math.min(nextY, bounds.height - mySize.height - BORDER_OFFSET));
                }

                currentPosition.current = { x: nextX, y: nextY };
                pan.setValue({ x: nextX, y: nextY });
            },

            onPanResponderRelease: () => {
                setIsDragging(false);
                isPressed.current = false;

                Animated.spring(springScale, {
                    toValue: 1,
                    friction: 5,
                    useNativeDriver: false
                }).start();

                // flattenOffset 제거: 직접 절대 좌표를 쓰도록 수정하여 깜빡임 근원 제거

                const now = Date.now();
                const isDoubleTap = lastTap.current && (now - lastTap.current) < DOUBLE_TAP_DELAY;

                // 1. 더블 탭 삭제 (드래그가 크지 않을 때 최우선 체크)
                const dragDistance = Math.sqrt(Math.pow(lastGesture.current.dx, 2) + Math.pow(lastGesture.current.dy, 2));
                if (isDoubleTap && dragDistance < 20) {
                    if (!isEditingRef.current && onDelete) {
                        onDelete(id);
                        lastTap.current = 0; // 초기화
                        return;
                    }
                }

                // 2. 드래그 종료 시 위치 저장 (onDragEnd)
                if (dragDistance > 5) {
                    if (onDragEnd) {
                        onDragEnd(id, currentPosition.current.x, currentPosition.current.y, currentRotation.current, currentTransformScale.current);
                    }
                }

                // 3. 탭 처리 (이동이 거의 없을 때)
                const isShortTap = dragDistance < 10;
                if (isShortTap) {
                    if (onTap) onTap(id, wasSelectedRef.current);

                    if (wasSelectedRef.current) {
                        // 이미 선택된 상태에서 다시 탭 -> 해제 (토글)
                        updateIsSelected(false);
                        if (deselectTimer.current) {
                            clearTimeout(deselectTimer.current);
                            deselectTimer.current = null;
                        }
                    } else {
                        // 미선택 상태에서 탭 -> 선택
                        updateIsSelected(true);
                    }
                } else {
                    // 드래그 발생 시 -> 선택 유지
                    updateIsSelected(true);
                }

                lastTap.current = isDoubleTap ? 0 : now; // 더블탭 이후엔 초기화

                if (onInteractionEnd) onInteractionEnd();

                // 3초 자동 숨김 (지금 선택된 상태일 때만 타이머 가동)
                if (isSelectedRef.current) {
                    if (deselectTimer.current) clearTimeout(deselectTimer.current);
                    deselectTimer.current = setTimeout(() => updateIsSelected(false), 3000);
                }
            },
            onPanResponderTerminate: () => {
                setIsDragging(false);
                isPressed.current = false;

                if (onInteractionEnd) onInteractionEnd();

                Animated.spring(springScale, {
                    toValue: 1,
                    friction: 5,
                    useNativeDriver: false
                }).start();
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

    return {
        pan,
        rotation,
        currentRotation,
        lastRotation: currentRotation, // 호환성 엘리어스
        scale: combinedScale,
        transformScale,
        currentTransformScale,
        panResponder,
        isDragging,
        isSelected,
        setIsSelected: updateIsSelected,
        setMySize,
        mySize,
        handleRotation,
        handleRotateAndScale,
        handleRotationEnd,
    };
}

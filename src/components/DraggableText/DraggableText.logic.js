import { useRef, useState } from 'react';
import { Animated, PanResponder, Platform } from 'react-native';

export function useDraggableTextLogic({ id, initialX, initialY, initialRotation, isEditing, onDelete, // 🛠️ 추가됨
    onDragEnd,
    onFocus,
}) {
    // x, y 위치 제어용 애니메이션 밸류
    const pan = useRef(new Animated.ValueXY({ x: initialX, y: initialY })).current;

    // 회전 각도 (라디안 → degree 변환은 View에서 처리)
    const rotation = useRef(new Animated.Value(initialRotation || 0)).current;
    const lastRotation = useRef(initialRotation || 0);

    // 스케일 (누를 때 살짝 커짐)
    const scale = useRef(new Animated.Value(1)).current;

    // 터치 상태
    const isPressed = useRef(false);

    // 리사이즈/회전 박스 표시 상태 (스티커와 동일)
    const [isSelected, setIsSelected] = useState(false);
    const deselectTimer = useRef(null);

    // 더블 탭 처리를 위한 타임스탬프 (스티커와 동일 가입)
    const lastTap = useRef(0);
    const DOUBLE_TAP_DELAY = 300;

    // 핀치줌/회전 계산용 상태
    const initialDistance = useRef(null);
    const initialAngle = useRef(null);
    const panOffset = useRef({ x: initialX, y: initialY });

    // 삭제 버튼 타이머
    const showDeleteTimer = useRef(null);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: (e, gs) => {
                // 살짝이라도 움직이면 드래그 시작 (또는 탭으로 남겨둠)
                return Math.abs(gs.dx) > 2 || Math.abs(gs.dy) > 2;
            },

            onPanResponderGrant: () => {
                if (isEditing) return; // 편집 모드일 땐 움직이지 않음
                isPressed.current = true;

                setIsSelected(true);
                if (deselectTimer.current) {
                    clearTimeout(deselectTimer.current);
                    deselectTimer.current = null;
                }

                // 포커스 획득 (z-index 제일 위로)
                if (onFocus) onFocus(id);

                pan.setOffset({
                    x: panOffset.current.x,
                    y: panOffset.current.y
                });
                pan.setValue({ x: 0, y: 0 });

                Animated.spring(scale, {
                    toValue: 1.05,
                    friction: 5,
                    useNativeDriver: false
                }).start();
            },

            onPanResponderMove: (e, gestureState) => {
                if (isEditing) return; // 편집 모드일 땐 움직이지 않음

                const touches = e.nativeEvent.touches;

                // ─── 터치 1개 (단일 이동) ───
                if (touches.length === 1) {
                    pan.setValue({ x: gestureState.dx, y: gestureState.dy });
                }
                // ─── 터치 2개 (축소/확대 & 회전) ───
                else if (touches.length === 2) {
                    const [touch1, touch2] = touches;
                    const dx = touch2.pageX - touch1.pageX;
                    const dy = touch2.pageY - touch1.pageY;

                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const angle = Math.atan2(dy, dx) * (180 / Math.PI);

                    if (!initialDistance.current) {
                        initialDistance.current = distance;
                        initialAngle.current = angle;
                        return;
                    }

                    // 회전 계산
                    const angleDiff = angle - initialAngle.current;
                    rotation.setValue(lastRotation.current + angleDiff);

                    /* 텍스트는 핀치 확대를 폰트 크기 변경으로 하기엔 UI상 복잡하므로
                     * 보통 Scale만 약간 키우는 걸로 하거나 일단 회전만 지원 */
                }
            },

            onPanResponderRelease: (e, gestureState) => {
                if (isEditing) return;
                isPressed.current = false;

                initialDistance.current = null;
                initialAngle.current = null;

                // 회전값 업데이트
                rotation.addListener(({ value }) => {
                    lastRotation.current = value;
                });
                rotation.removeAllListeners();

                Animated.spring(scale, {
                    toValue: 1,
                    friction: 5,
                    useNativeDriver: false
                }).start();

                pan.flattenOffset();
                panOffset.current = { x: pan.x._value, y: pan.y._value };

                // ─── 더블 탭 체크 (스티커와 동일한 방식의 삭제 지원) ───
                const now = Date.now();
                if (lastTap.current && (now - lastTap.current) < DOUBLE_TAP_DELAY) {
                    // 삭제 함수 호출 (view의 onDelete에 바인딩됨)
                    if (onDelete) onDelete(id);
                } else {
                    lastTap.current = now;
                    onDragEnd(id, panOffset.current.x, panOffset.current.y, lastRotation.current);
                }

                // 3초 후 선택 해제 (회전 핸들 숨기기)
                deselectTimer.current = setTimeout(() => {
                    setIsSelected(false);
                }, 3000);
            },
            onPanResponderTerminate: () => {
                // 터치 캔슬시 복구
                if (isEditing) return;
                isPressed.current = false;
                initialDistance.current = null;
                initialAngle.current = null;

                Animated.spring(scale, {
                    toValue: 1,
                    friction: 5,
                    useNativeDriver: false
                }).start();
            }
        })
    ).current;

    /**
     * 🔄 회전 핸들 드래그 시 호출되는 콜백
     */
    const handleRotation = (angleDeg) => {
        lastRotation.current = angleDeg;
        rotation.setValue(angleDeg);
    };

    /**
     * 🔄 회전 종료 시 호출 → 상태 저장
     */
    const handleRotationEnd = () => {
        if (onDragEnd) {
            onDragEnd(
                id,
                panOffset.current.x,
                panOffset.current.y,
                lastRotation.current
            );
        }
    };

    return {
        pan,
        rotation,
        scale,
        panResponder,
        isSelected,
        lastRotation,
        handleRotation,
        handleRotationEnd
    };
}

import { useRef, useState } from 'react';
import { Animated, PanResponder } from 'react-native';

/**
 * ⚙️ 스티커의 드래그 애니메이션, 좌표 계산, 물리적 바운더리 검사를 담당하는 로직 훅입니다.
 */
export function useDraggableLogic({ sticker, bounds, onDelete, onDragEnd }) {
    // x, y 위치 제어용 애니메이션 밸류
    const pan = useRef(new Animated.ValueXY({ x: sticker.x, y: sticker.y })).current;

    // 현재 컨테이너 내부의 실제 위치를 추적 저장
    const currentPosition = useRef({ x: sticker.x, y: sticker.y });
    const lastGesture = useRef({ dx: 0, dy: 0 }); // 이전 애니메이션 이동량 기억 (Sticky 보정)

    const [mySize, setMySize] = useState({ width: 40, height: 40 });
    const [isDragging, setIsDragging] = useState(false);

    // 더블 탭 처리를 위한 타임스탬프
    const lastTap = useRef(0);
    const DOUBLE_TAP_DELAY = 300;

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,

            onPanResponderGrant: () => {
                setIsDragging(true);
                // 드래그 시작 시 이동량 누적 초기화
                lastGesture.current = { dx: 0, dy: 0 };
            },

            onPanResponderMove: (e, gestureState) => {
                // 한 프레임(직전 이벤트) 대비 얼만큼 움직였는지 Delta(변화량) 계산
                const deltaX = gestureState.dx - lastGesture.current.dx;
                const deltaY = gestureState.dy - lastGesture.current.dy;

                // 다음 기준점을 위해 보존
                lastGesture.current = { dx: gestureState.dx, dy: gestureState.dy };

                let nextX = currentPosition.current.x + deltaX;
                let nextY = currentPosition.current.y + deltaY;

                // 물리적 바운더리를 넘지 않게 엄격하게 클램핑(Clamping) 제한
                if (bounds && bounds.width > 0) {
                    const BORDER_OFFSET = 2; // 안전 여백 거리
                    const minX = BORDER_OFFSET;
                    const minY = BORDER_OFFSET;
                    const maxX = bounds.width - mySize.width - BORDER_OFFSET;
                    const maxY = bounds.height - mySize.height - BORDER_OFFSET;

                    if (nextX < minX) nextX = minX;
                    if (nextX > maxX) nextX = maxX;
                    if (nextY < minY) nextY = minY;
                    if (nextY > maxY) nextY = maxY;
                }

                // 보정된 위치 업데이트
                currentPosition.current = { x: nextX, y: nextY };
                pan.setValue({ x: nextX, y: nextY });
            },

            onPanResponderRelease: (e, gestureState) => {
                setIsDragging(false);

                const finalX = currentPosition.current.x;
                const finalY = currentPosition.current.y;

                // 더블 탭 체크 후 삭제 처리
                const now = Date.now();
                if (lastTap.current && (now - lastTap.current) < DOUBLE_TAP_DELAY) {
                    onDelete(sticker.id);
                } else {
                    lastTap.current = now;
                    if (onDragEnd) {
                        // 드래그 종료 위치를 원본 객체로 갱신
                        onDragEnd(sticker.id, finalX, finalY);
                    }
                }
            }
        })
    ).current;

    return {
        pan,
        panResponder,
        isDragging,
        setMySize
    };
}

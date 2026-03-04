import { useRef, useState } from 'react';
import { Animated, PanResponder, Keyboard } from 'react-native';

/**
 * ⚙️ 드래그 가능한 폴라로이드 사진의 위치·회전·삭제 로직 훅입니다.
 * DraggableSticker.logic.js와 동일한 패턴으로 제작되었습니다.
 */
export function useDraggablePhotoLogic({ photo, bounds, onDelete, onDragEnd }) {
    const pan = useRef(new Animated.ValueXY({ x: photo.x, y: photo.y })).current;
    const rotation = useRef(new Animated.Value(photo.rotation || 0)).current;
    const currentRotation = useRef(photo.rotation || 0);

    const currentPosition = useRef({ x: photo.x, y: photo.y });
    const lastGesture = useRef({ dx: 0, dy: 0 });

    // 사진 크기는 폴라로이드 프레임 포함 고정 크기
    const PHOTO_SIZE = { width: 130, height: 148 }; // 프레임 포함 (1:1 사진 + 하단 여백)
    const [mySize, setMySize] = useState(PHOTO_SIZE);
    const [isDragging, setIsDragging] = useState(false);
    const [isSelected, setIsSelected] = useState(false);

    const lastTap = useRef(0);
    const DOUBLE_TAP_DELAY = 300;
    const deselectTimer = useRef(null);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,

            onPanResponderGrant: () => {
                Keyboard.dismiss();
                setIsDragging(true);
                setIsSelected(true);
                lastGesture.current = { dx: 0, dy: 0 };

                if (deselectTimer.current) {
                    clearTimeout(deselectTimer.current);
                    deselectTimer.current = null;
                }
            },

            onPanResponderMove: (e, gestureState) => {
                const deltaX = gestureState.dx - lastGesture.current.dx;
                const deltaY = gestureState.dy - lastGesture.current.dy;
                lastGesture.current = { dx: gestureState.dx, dy: gestureState.dy };

                let nextX = currentPosition.current.x + deltaX;
                let nextY = currentPosition.current.y + deltaY;

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

                const finalX = currentPosition.current.x;
                const finalY = currentPosition.current.y;

                // 더블 탭 → 삭제
                const now = Date.now();
                if (lastTap.current && (now - lastTap.current) < DOUBLE_TAP_DELAY) {
                    if (onDelete) onDelete(photo.id);
                } else {
                    lastTap.current = now;
                    if (onDragEnd) {
                        onDragEnd(photo.id, finalX, finalY, currentRotation.current);
                    }
                }

                deselectTimer.current = setTimeout(() => setIsSelected(false), 3000);
            },
            onShouldBlockNativeResponder: () => true,
        })
    ).current;

    const handleRotation = (angleDeg) => {
        currentRotation.current = angleDeg;
        rotation.setValue(angleDeg);
    };

    const handleRotationEnd = () => {
        if (onDragEnd) {
            onDragEnd(photo.id, currentPosition.current.x, currentPosition.current.y, currentRotation.current);
        }
    };

    return {
        pan,
        rotation,
        currentRotation,
        panResponder,
        isDragging,
        isSelected,
        setMySize,
        mySize,
        handleRotation,
        handleRotationEnd,
    };
}

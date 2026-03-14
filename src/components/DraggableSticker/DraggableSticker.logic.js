import { useDraggable } from '../../hooks/useDraggable';

export function useDraggableLogic({ sticker, bounds, onDelete, onDragEnd, onInteractionStart, onInteractionEnd, onDragMove, onDragDrop, onSelect, isSelected }) {
    return useDraggable({
        id: sticker.id,
        initialX: sticker.x,
        initialY: sticker.y,
        initialRotation: sticker.rotation || 0,
        initialScale: sticker.scale || 1,
        bounds,
        onDelete,
        onDragEnd,
        onInteractionStart,
        onInteractionEnd,
        onDragMove,
        onDragDrop,
        onSelect,
        isSelected,
        createdAt: sticker.createdAt,
        scaleMultiplier: 0.35, // 💡 디자인 보정 배율
        controlScale: 0.7, // 💡 컨트롤 크기 배율
        offsetMultiplier: 0.7, // 👈 숫자를 줄이면(1보다 작으면) 버튼이 스티커 쪽으로 더 '바싹' 붙습니다.
        minScale: 0.7,         // 👈 최소 0.7배
        maxScale: 5,         // 👈 최대 3.5배

    });
}

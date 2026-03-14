import { useDraggable } from '../../hooks/useDraggable';

export function useDraggableTextLogic({ id, initialX, initialY, initialRotation, initialScale = 1, bounds, isEditing, onDelete, onDragEnd, onFocus, onTap, onInteractionStart, onInteractionEnd, onDragMove, onDragDrop, onSelect, isSelected, createdAt }) {
    return useDraggable({
        id,
        initialX,
        initialY,
        initialRotation: initialRotation || 0,
        initialScale: initialScale || 1,
        bounds,
        onDelete,
        onDragEnd,
        onFocus,
        onTap,
        isEditing,
        onInteractionStart,
        onInteractionEnd,
        onDragMove,
        onDragDrop,
        onSelect,
        isSelected,
        createdAt,
        scaleMultiplier: 1, // 💡 텍스트는 기본 1:1 배율 사용
        minScale: 0.5,      // 👈 최소 0.5배
        maxScale: 2.0       // 👈 최대 2.0배
    });
}

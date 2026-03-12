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
    });
}

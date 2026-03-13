import { useDraggable } from '../../hooks/useDraggable';

export function useDraggablePhotoLogic({ photo, bounds, onDelete, onDragEnd, externalPan, externalRotation, onInteractionStart, onInteractionEnd, onDragMove, onDragDrop, onSelect, isSelected, onTap }) {
    return useDraggable({
        id: photo.id,
        initialX: photo.x,
        initialY: photo.y,
        initialRotation: photo.rotation || 0,
        initialScale: photo.scale || 1,
        bounds,
        onDelete,
        onDragEnd,
        defaultSize: { width: 130, height: 148 },
        externalPan,
        externalRotation,
        onInteractionStart,
        onInteractionEnd,
        onDragMove,
        onDragDrop,
        onSelect,
        isSelected,
        onTap,
        createdAt: photo.createdAt,
        scaleMultiplier: 1, // 💡 사진은 기본 1:1 배율 사용
    });
}

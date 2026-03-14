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
        minScale: 0.7,      // 👈 최소 0.7배
        maxScale: 1.5,      // 👈 최대 3.5배
    });
}

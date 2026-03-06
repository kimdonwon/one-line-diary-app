import { useDraggable } from '../../hooks/useDraggable';

export function useDraggableLogic({ sticker, bounds, onDelete, onDragEnd, onInteractionStart, onInteractionEnd }) {
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
    });
}

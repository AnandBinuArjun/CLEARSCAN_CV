import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export function DraggableElement({ element, onUpdate, onRemove, isSelected, onSelect }) {
  const [isDragging, setIsDragging] = useState(false);
  const [pos, setPos] = useState({ x: element.x, y: element.y });

  useEffect(() => {
    if (!isDragging) {
      setPos({ x: element.x, y: element.y });
    }
  }, [element.x, element.y, isDragging]);

  const handlePointerDown = (e) => {
    e.stopPropagation();
    onSelect();
    if (e.target.tagName.toLowerCase() === 'textarea') return; // Don't drag if clicking inside textarea
    
    setIsDragging(true);
    const startX = e.clientX;
    const startY = e.clientY;
    const startPosX = pos.x;
    const startPosY = pos.y;

    const onMove = (moveEvent) => {
      setPos({
        x: startPosX + (moveEvent.clientX - startX),
        y: startPosY + (moveEvent.clientY - startY),
      });
    };

    const onUp = () => {
      setIsDragging(false);
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup', onUp);
    };

    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onUp);
  };

  useEffect(() => {
    if (!isDragging && (pos.x !== element.x || pos.y !== element.y)) {
      onUpdate({ ...element, x: pos.x, y: pos.y });
    }
  }, [isDragging, pos, element, onUpdate]);

  return (
    <div
      style={{
        position: 'absolute',
        left: pos.x,
        top: pos.y,
        width: element.width,
        height: element.height,
        cursor: isDragging ? 'grabbing' : (element.type === 'rect' ? 'grab' : 'text'),
        border: isSelected ? '1px dashed var(--color-accent)' : '1px solid transparent',
        zIndex: isSelected ? 10 : 1,
        pointerEvents: 'auto',
      }}
      onPointerDown={handlePointerDown}
      onClick={(e) => { e.stopPropagation(); onSelect(); }}
    >
      {isSelected && (
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          className="absolute -top-3 -right-3 w-6 h-6 bg-[var(--color-danger)] rounded-full flex items-center justify-center text-white cursor-pointer z-20 shadow-md border border-[var(--color-border)]"
        >
          <X size={14} />
        </button>
      )}

      {element.type === 'text' || element.type === 'inline-text' ? (
        <textarea
          value={element.content}
          onChange={(e) => onUpdate({ ...element, content: e.target.value })}
          onPointerDown={(e) => {
            // Let the user select text inside the textarea without dragging
            e.stopPropagation();
            onSelect();
          }}
          style={{
            width: '100%',
            height: '100%',
            background: 'transparent',
            border: 'none',
            color: element.color || '#000000',
            fontSize: `${element.size || 14}px`,
            fontFamily: 'Helvetica, Arial, sans-serif',
            resize: 'none',
            outline: 'none',
            overflow: 'hidden',
          }}
          placeholder="Double click to edit..."
        />
      ) : element.type === 'image' ? (
        <img src={element.content} alt="Overlay" style={{ width: '100%', height: '100%', objectFit: 'fill', pointerEvents: 'none' }} />
      ) : (
        <div style={{ width: '100%', height: '100%', backgroundColor: element.color || '#FFFFFF' }} />
      )}
      
      {/* Resizer for all elements */}
      {isSelected && (
        <div
          style={{
            position: 'absolute',
            right: -4,
            bottom: -4,
            width: 10,
            height: 10,
            backgroundColor: 'var(--color-accent)',
            cursor: 'nwse-resize',
            borderRadius: '50%',
            zIndex: 20
          }}
          onPointerDown={(e) => {
            e.stopPropagation();
            const startX = e.clientX;
            const startY = e.clientY;
            const startWidth = element.width;
            const startHeight = element.height;
            
            const onMove = (moveEvent) => {
              const newW = Math.max(20, startWidth + (moveEvent.clientX - startX));
              const newH = Math.max(20, startHeight + (moveEvent.clientY - startY));
              onUpdate({ ...element, width: newW, height: newH });
            };
            const onUp = () => {
              document.removeEventListener('pointermove', onMove);
              document.removeEventListener('pointerup', onUp);
            };
            document.addEventListener('pointermove', onMove);
            document.addEventListener('pointerup', onUp);
          }}
        />
      )}
    </div>
  );
}

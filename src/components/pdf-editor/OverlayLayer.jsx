import { DraggableElement } from './DraggableElement';

export function OverlayLayer({ overlays, activePage, selectedId, onSelect, onUpdate, onRemove }) {
  return (
    <div className="absolute inset-0 z-20 pointer-events-none" style={{ width: '100%', height: '100%' }}>
      <div className="relative w-full h-full pointer-events-none">
        {overlays
          .filter((overlay) => overlay.page === activePage)
          .map((overlay) => (
            <DraggableElement
              key={overlay.id}
              element={overlay}
              isSelected={selectedId === overlay.id}
              onSelect={() => onSelect(overlay.id)}
              onUpdate={(updated) => onUpdate(overlay.id, updated)}
              onRemove={() => onRemove(overlay.id)}
            />
          ))}
      </div>
    </div>
  );
}

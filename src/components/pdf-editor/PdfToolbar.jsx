import { Type, Square, Download, ChevronLeft, ChevronRight, Image as ImageIcon, Undo, Redo } from 'lucide-react';

export function PdfToolbar({ 
  onAddText, 
  onAddWhiteout, 
  onAddImage,
  onExport, 
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  currentPage, 
  numPages, 
  onPageChange,
  hasFile
}) {
  return (
    <div className="h-16 border-b flex items-center justify-between px-4 shrink-0" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-surface)' }}>
      <div className="flex items-center gap-2">
        <button 
          onClick={onAddText}
          disabled={!hasFile}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: 'var(--color-bg-surface-2)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}
        >
          <Type size={16} />
          Add Text
        </button>
        <button 
          onClick={onAddWhiteout}
          disabled={!hasFile}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: 'var(--color-bg-surface-2)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}
          title="Visually cover underlying content"
        >
          <Square size={16} />
          Whiteout (Cover)
        </button>
        <label 
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${!hasFile ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          style={{ backgroundColor: 'var(--color-bg-surface-2)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}
        >
          <ImageIcon size={16} />
          Add Image
          <input 
            type="file" 
            accept="image/png, image/jpeg" 
            className="hidden" 
            disabled={!hasFile}
            onChange={(e) => {
              if (e.target.files?.[0]) onAddImage(e.target.files[0]);
              e.target.value = ''; // Reset so same file can be added again
            }} 
          />
        </label>

        <div className="flex items-center gap-1 border-l pl-2 ml-1" style={{ borderColor: 'var(--color-border)' }}>
          <button 
            onClick={onUndo} 
            disabled={!canUndo} 
            className="p-1.5 rounded-lg transition-colors disabled:opacity-30"
            style={{ color: 'var(--color-text-primary)' }}
            title="Undo (Ctrl+Z)"
          >
            <Undo size={16}/>
          </button>
          <button 
            onClick={onRedo} 
            disabled={!canRedo} 
            className="p-1.5 rounded-lg transition-colors disabled:opacity-30"
            style={{ color: 'var(--color-text-primary)' }}
            title="Redo (Ctrl+Shift+Z)"
          >
            <Redo size={16}/>
          </button>
        </div>
      </div>

      {hasFile && (
        <div className="flex items-center gap-4" style={{ color: 'var(--color-text-primary)' }}>
          <button 
            disabled={currentPage <= 1} 
            onClick={() => onPageChange(currentPage - 1)}
            className="p-1 disabled:opacity-50 rounded hover:bg-[var(--color-bg-hover)]"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="text-sm font-medium font-mono">Page {currentPage} of {numPages}</span>
          <button 
            disabled={currentPage >= numPages} 
            onClick={() => onPageChange(currentPage + 1)}
            className="p-1 disabled:opacity-50 rounded hover:bg-[var(--color-bg-hover)]"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}

      <div>
        <button 
          onClick={onExport}
          disabled={!hasFile}
          className="btn-gradient flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-black disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download size={16} />
          Export PDF
        </button>
      </div>
    </div>
  );
}

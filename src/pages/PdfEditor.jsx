import { useState, useCallback, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { UploadCloud, ShieldCheck, AlertCircle } from 'lucide-react';
import { PdfToolbar } from '../components/pdf-editor/PdfToolbar';
import { PdfViewer } from '../components/pdf-editor/PdfViewer';
import { OverlayLayer } from '../components/pdf-editor/OverlayLayer';
import { exportModifiedPdf } from '../lib/pdfEditorUtils';

const SCALE = 1.5;
const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB

export function PdfEditor() {
  const [fileUrl, setFileUrl] = useState(null);
  const [originalFileBuffer, setOriginalFileBuffer] = useState(null);
  const [fileName, setFileName] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState(0);
  
  const [overlays, setOverlays] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  const [password, setPassword] = useState('');
  const [needsPassword, setNeedsPassword] = useState(false);

  const saveState = useCallback(() => {
    setUndoStack(prev => [...prev, JSON.parse(JSON.stringify(overlays))]);
    setRedoStack([]);
  }, [overlays]);

  const undo = useCallback(() => {
    if (undoStack.length === 0) return;
    const previousState = undoStack[undoStack.length - 1];
    setRedoStack(prev => [...prev, JSON.parse(JSON.stringify(overlays))]);
    setOverlays(previousState);
    setUndoStack(prev => prev.slice(0, -1));
    setSelectedId(null);
  }, [undoStack, overlays]);

  const redo = useCallback(() => {
    if (redoStack.length === 0) return;
    const nextState = redoStack[redoStack.length - 1];
    setUndoStack(prev => [...prev, JSON.parse(JSON.stringify(overlays))]);
    setOverlays(nextState);
    setRedoStack(prev => prev.slice(0, -1));
    setSelectedId(null);
  }, [redoStack, overlays]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger undo/redo if user is actively typing in a textarea
      if (e.target.tagName.toLowerCase() === 'textarea') return;
      
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      alert("File exceeds 25MB browser limit. This is to prevent your browser from hanging.");
      e.target.value = '';
      return;
    }

    setFileName(file.name);
    setPassword('');
    setNeedsPassword(false);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      setOriginalFileBuffer(event.target.result);
    };
    reader.readAsArrayBuffer(file);
    
    const url = URL.createObjectURL(file);
    setFileUrl(url);
    setCurrentPage(1);
    setOverlays([]);
    setUndoStack([]);
    setRedoStack([]);
    setSelectedId(null);
  };

  const handleLoadSuccess = useCallback(({ numPages }) => {
    setNumPages(numPages);
    setNeedsPassword(false);
  }, []);

  const handlePasswordRequired = useCallback(() => {
    setNeedsPassword(true);
  }, []);

  const submitPassword = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    setPassword(formData.get('password'));
    setNeedsPassword(false);
  };

  const addText = () => {
    saveState();
    const newId = Date.now().toString();
    setOverlays((prev) => [
      ...prev,
      {
        id: newId,
        type: 'text',
        page: currentPage,
        x: 50,
        y: 50,
        width: 200,
        height: 40,
        content: '',
        size: 14 * SCALE,
        color: '#000000',
        scale: SCALE
      }
    ]);
    setSelectedId(newId);
  };

  const addWhiteout = () => {
    saveState();
    const newId = Date.now().toString();
    setOverlays((prev) => [
      ...prev,
      {
        id: newId,
        type: 'rect',
        page: currentPage,
        x: 50,
        y: 50,
        width: 150,
        height: 30,
        color: '#FFFFFF',
        scale: SCALE
      }
    ]);
    setSelectedId(newId);
  };

  const addImage = (file) => {
    saveState();
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      
      const img = new Image();
      img.onload = () => {
        const maxDim = 200;
        let w = img.width;
        let h = img.height;
        if (w > maxDim || h > maxDim) {
          const ratio = Math.min(maxDim / w, maxDim / h);
          w = w * ratio;
          h = h * ratio;
        }

        const newId = Date.now().toString();
        setOverlays((prev) => [
          ...prev,
          {
            id: newId,
            type: 'image',
            page: currentPage,
            x: 50,
            y: 50,
            width: w,
            height: h,
            content: dataUrl,
            scale: SCALE
          }
        ]);
        setSelectedId(newId);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const updateOverlay = useCallback((id, updatedData) => {
    setOverlays((prev) => prev.map((o) => (o.id === id ? { ...o, ...updatedData } : o)));
  }, []);

  const handleTextClick = useCallback((item) => {
    saveState();
    
    const existing = overlays.find(o => o.type === 'inline-text' && o.originalId === item.id);
    if (existing) {
      setSelectedId(existing.id);
      return;
    }

    const newId = Date.now().toString();
    setOverlays((prev) => [
      ...prev,
      {
        id: newId,
        type: 'inline-text',
        originalId: item.id,
        page: currentPage,
        x: item.cssLeft,
        y: item.cssTop,
        width: Math.max(item.cssWidth, 50), // Give it some min width
        height: item.cssHeight,
        content: item.str,
        size: item.fontSize,
        color: '#000000',
        scale: SCALE,
        originalBox: {
          x: item.cssLeft,
          y: item.cssTop,
          width: item.cssWidth,
          height: item.cssHeight
        }
      }
    ]);
    setSelectedId(newId);
  }, [saveState, overlays, currentPage]);

  const removeOverlay = useCallback((id) => {
    saveState();
    setOverlays((prev) => prev.filter((o) => o.id !== id));
    if (selectedId === id) setSelectedId(null);
  }, [saveState, selectedId]);

  const handleExport = async () => {
    if (!originalFileBuffer) return;
    try {
      await exportModifiedPdf(originalFileBuffer, overlays);
    } catch (err) {
      console.error("Export failed:", err);
      alert("Failed to export PDF.");
    }
  };

  return (
    <div className="flex flex-col h-full bg-[var(--color-bg-base)] text-[var(--color-text-primary)]">
      <Helmet>
        <title>PDF Editor - Clearscan</title>
      </Helmet>

      <PdfToolbar
        hasFile={!!fileUrl}
        currentPage={currentPage}
        numPages={numPages}
        onPageChange={setCurrentPage}
        onAddText={addText}
        onAddWhiteout={addWhiteout}
        onAddImage={addImage}
        onExport={handleExport}
        onUndo={undo}
        onRedo={redo}
        canUndo={undoStack.length > 0}
        canRedo={redoStack.length > 0}
      />

      <div className="flex-1 relative overflow-hidden flex">
        {!fileUrl ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8">
            <div className="bento-card p-10 max-w-md w-full flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-[var(--color-bg-surface-2)] flex items-center justify-center mb-6">
                <UploadCloud size={32} className="text-[var(--color-accent)]" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Upload PDF Resume</h2>
              <p className="text-[var(--color-text-secondary)] mb-6 text-sm">
                Edit your existing PDF to add missing ATS keywords, correct dates, or visually cover up old information.
              </p>
              
              <div className="flex items-start gap-3 bg-[var(--color-accent-dim)] border border-[var(--color-border-accent)] p-4 rounded-xl mb-8 w-full text-left">
                <ShieldCheck size={20} className="text-[var(--color-accent)] shrink-0 mt-0.5" />
                <p className="text-xs text-[var(--color-text-secondary)]">
                  <strong>Privacy First:</strong> Your PDF is processed entirely in your browser. It is never uploaded, stored, or seen by anyone — including us.
                </p>
              </div>

              <label className="btn-gradient px-6 py-3 rounded-xl font-bold text-black cursor-pointer inline-flex items-center gap-2 transition-transform hover:scale-105 active:scale-95">
                <span>Select PDF File</span>
                <input 
                  type="file" 
                  accept="application/pdf" 
                  onChange={handleFileUpload} 
                  className="hidden" 
                />
              </label>
            </div>
          </div>
        ) : needsPassword ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8">
             <div className="bento-card p-10 max-w-sm w-full flex flex-col items-center text-center">
               <h2 className="text-xl font-bold mb-4">Password Required</h2>
               <p className="text-sm text-[var(--color-text-secondary)] mb-6">This PDF is password protected. Enter the password to view and edit it.</p>
               <form onSubmit={submitPassword} className="w-full flex flex-col gap-4">
                 <input type="password" name="password" placeholder="Password" className="px-4 py-2 rounded-lg bg-[var(--color-bg-surface-2)] border border-[var(--color-border)] text-white focus:outline-none focus:border-[var(--color-accent)] transition-colors" autoFocus required />
                 <button type="submit" className="btn-gradient px-4 py-2 rounded-lg font-bold text-black w-full">Unlock PDF</button>
               </form>
             </div>
          </div>
        ) : (
          <div 
            className="flex-1 flex flex-col relative bg-[var(--color-bg-base)] overflow-hidden"
          >
            <div className="bg-[var(--color-warning)]/10 border-b border-[var(--color-warning)]/20 px-4 py-2 flex items-center gap-2 text-xs text-[var(--color-warning)] justify-center shrink-0">
              <AlertCircle size={14} className="shrink-0" />
              <span>Adding text creates a new overlay layer. If your PDF is a scanned image, you cannot edit the existing text directly.</span>
            </div>
            <div 
              className="flex-1 relative overflow-auto"
              onClick={() => setSelectedId(null)}
            >
              <PdfViewer 
                fileUrl={fileUrl} 
                pageNumber={currentPage} 
                scale={SCALE}
                password={password}
                onLoadSuccess={handleLoadSuccess}
                onPasswordRequired={handlePasswordRequired}
                onTextClick={handleTextClick}
                hiddenTextIds={overlays.filter(o => o.type === 'inline-text').map(o => o.originalId)}
              >
                <OverlayLayer
                  overlays={overlays}
                  activePage={currentPage}
                  selectedId={selectedId}
                  onSelect={setSelectedId}
                  onUpdate={updateOverlay}
                  onRemove={removeOverlay}
                  onInteractionStart={saveState}
                />
              </PdfViewer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

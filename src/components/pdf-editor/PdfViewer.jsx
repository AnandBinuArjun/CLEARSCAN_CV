import { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// Setup worker
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export function PdfViewer({ fileUrl, pageNumber, scale = 1.5, password = '', onLoadSuccess, onPasswordRequired, onTextClick, hiddenTextIds = [], children }) {
  const canvasRef = useRef(null);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [textItems, setTextItems] = useState([]);

  useEffect(() => {
    if (!fileUrl) return;

    let active = true;
    const loadingTask = pdfjsLib.getDocument({ url: fileUrl, password });
    loadingTask.promise.then((loadedPdf) => {
      if (!active) return;
      setPdfDoc(loadedPdf);
      if (onLoadSuccess) {
        onLoadSuccess({ numPages: loadedPdf.numPages });
      }
    }).catch(err => {
      if (err.name === 'PasswordException') {
        if (onPasswordRequired) onPasswordRequired();
      } else {
        console.error('Error loading PDF:', err);
      }
    });

    return () => {
      active = false;
      loadingTask.destroy();
    };
  }, [fileUrl, password, onLoadSuccess, onPasswordRequired]);

  useEffect(() => {
    if (!pdfDoc || !canvasRef.current) return;

    let active = true;
    let renderTask = null;

    pdfDoc.getPage(pageNumber).then(async (page) => {
      if (!active) return;
      
      const viewport = page.getViewport({ scale });
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      renderTask = page.render(renderContext);

      try {
        const textContent = await page.getTextContent();
        if (!active) return;
        
        const items = textContent.items.map((item, index) => {
          const tx = item.transform[4];
          const ty = item.transform[5];
          const scaleY = item.transform[3];
          
          const [domX, domY] = viewport.convertToViewportPoint(tx, ty);
          
          const cssHeight = scaleY * scale;
          const cssWidth = item.width * scale;
          const cssTop = domY - cssHeight;
          const cssLeft = domX;

          return {
            id: `text-${pageNumber}-${index}`,
            str: item.str,
            pdfX: tx,
            pdfY: ty,
            pdfHeight: scaleY,
            pdfWidth: item.width,
            cssLeft,
            cssTop,
            cssWidth,
            cssHeight,
            fontSize: cssHeight
          };
        });
        
        setTextItems(items.filter(i => i.str.trim().length > 0));
      } catch (err) {
        console.error("Failed to extract text:", err);
      }
    });

    return () => {
      active = false;
      if (renderTask) {
        renderTask.cancel();
      }
    };
  }, [pdfDoc, pageNumber, scale]);

  if (!fileUrl) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full bg-[var(--color-bg-base)]">
        <p className="text-[var(--color-text-secondary)] mb-4">No PDF loaded.</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-start w-full h-full bg-[var(--color-bg-base)] overflow-auto p-8 relative">
      <div className="relative shadow-2xl shrink-0" style={{ backgroundColor: '#fff' }}>
        <canvas ref={canvasRef} className="block" />
        
        <div className="absolute inset-0 z-10 pointer-events-auto">
          {textItems.map((item) => {
            const isHidden = hiddenTextIds.includes(item.id);
            if (isHidden) return null;
            
            return (
              <div
                key={item.id}
                onClick={(e) => {
                  e.stopPropagation();
                  if (onTextClick) onTextClick(item);
                }}
                className="absolute text-transparent hover:bg-[var(--color-accent)]/20 cursor-text transition-colors"
                style={{
                  left: item.cssLeft,
                  top: item.cssTop,
                  width: item.cssWidth,
                  height: item.cssHeight,
                  fontSize: item.fontSize,
                  lineHeight: `${item.cssHeight}px`,
                  fontFamily: 'sans-serif',
                }}
                title="Click to edit"
              >
                {item.str}
              </div>
            );
          })}
        </div>

        {children}
      </div>
    </div>
  );
}

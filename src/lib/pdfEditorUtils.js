import { PDFDocument, rgb } from 'pdf-lib';
import { saveAs } from 'file-saver';

/**
 * Converts DOM coordinates to PDF coordinates.
 * PDF coordinate system has origin (0,0) at the bottom-left corner.
 * DOM coordinate system has origin (0,0) at the top-left corner.
 */
export function domToPdfCoords(domX, domY, elementHeight, pageHeight, scale = 1) {
  const unscaledX = domX / scale;
  const unscaledY = domY / scale;
  const unscaledElementHeight = elementHeight / scale;
  return {
    pdfX: unscaledX,
    pdfY: pageHeight - unscaledY - unscaledElementHeight,
  };
}

function hexToRgb(hex) {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return rgb(r / 255, g / 255, b / 255);
}

export async function exportModifiedPdf(originalPdfBytes, overlays) {
  const pdfDoc = await PDFDocument.load(originalPdfBytes);
  const pages = pdfDoc.getPages();

  for (const overlay of overlays) {
    const pageIndex = overlay.page - 1;
    if (pageIndex < 0 || pageIndex >= pages.length) continue;
    
    const page = pages[pageIndex];
    const { height: pageHeight } = page.getSize();
    
    const { pdfX, pdfY } = domToPdfCoords(overlay.x, overlay.y, overlay.height, pageHeight, overlay.scale || 1);

    if (overlay.type === 'text' || overlay.type === 'inline-text') {
      if (overlay.type === 'inline-text' && overlay.originalBox) {
        const { pdfX: maskX, pdfY: maskY } = domToPdfCoords(overlay.originalBox.x, overlay.originalBox.y, overlay.originalBox.height, pageHeight, overlay.scale || 1);
        page.drawRectangle({
          x: maskX,
          y: maskY,
          width: overlay.originalBox.width / (overlay.scale || 1),
          height: overlay.originalBox.height / (overlay.scale || 1),
          color: rgb(1, 1, 1),
        });
      }
      
      page.drawText(overlay.content || '', {
        x: pdfX,
        y: pdfY + 2, // slight baseline adjustment
        size: (overlay.size || 14) / (overlay.scale || 1),
        color: overlay.color ? hexToRgb(overlay.color) : rgb(0, 0, 0),
      });
    } else if (overlay.type === 'image') {
      const base64Data = overlay.content.split(',')[1];
      const imageBytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
      
      let image;
      if (overlay.content.includes('image/png')) {
        image = await pdfDoc.embedPng(imageBytes);
      } else if (overlay.content.includes('image/jpeg') || overlay.content.includes('image/jpg')) {
        image = await pdfDoc.embedJpg(imageBytes);
      }
      
      if (image) {
        page.drawImage(image, {
          x: pdfX,
          y: pdfY,
          width: overlay.width / (overlay.scale || 1),
          height: overlay.height / (overlay.scale || 1),
        });
      }
    } else if (overlay.type === 'rect') {
      page.drawRectangle({
        x: pdfX,
        y: pdfY,
        width: overlay.width / (overlay.scale || 1),
        height: overlay.height / (overlay.scale || 1),
        color: overlay.color ? hexToRgb(overlay.color) : rgb(1, 1, 1),
      });
    }
  }

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  saveAs(blob, 'modified-document.pdf');
}

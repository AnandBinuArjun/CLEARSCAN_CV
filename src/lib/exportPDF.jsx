import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { CVPreviewPDF } from '../components/preview/CVPreviewPDF';

export const exportPDF = async (cvData, filename = 'resume.pdf') => {
  try {
    const blob = await pdf(<CVPreviewPDF data={cvData} />).toBlob();
    saveAs(blob, filename);
    return true;
  } catch (error) {
    console.error('Failed to generate PDF', error);
    return false;
  }
};

import { Download, FileText, FileType2, ChevronDown, MoreVertical } from 'lucide-react';
import { useCVStore } from '../../store/cvStore';
import { exportPDF } from '../../lib/exportPDF';
import { exportDOCX } from '../../lib/exportDOCX';
import { exportTXT } from '../../lib/exportTXT';
import { useState, useEffect } from 'react';
import { useToast } from '../../providers/ToastProvider';
import { Button } from '../ui/Button';

export function Topbar() {
  const cvData = useCVStore();
  const { personalInfo, atsScore } = cvData;
  const [isExporting, setIsExporting] = useState(false);
  const [showScorePopover, setShowScorePopover] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const { addToast } = useToast();

  const cvTitle = personalInfo?.fullName?.trim() || 'Untitled CV';
  const hasMinContent = !!(personalInfo?.fullName?.trim());

  const buildFilename = (ext) => {
    const name = personalInfo?.fullName?.trim();
    if (name) {
      const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      return `${slug}-resume.${ext}`;
    }
    return `resume.${ext}`;
  };


  const handleExport = async (format) => {
    if (!hasMinContent) {
      addToast({ type: 'warning', title: 'Export blocked', message: 'Add your name before exporting.' });
      return;
    }
    setIsExporting(true);
    setShowExportMenu(false);
    try {
      const filename = buildFilename(format);
      let ok = false;
      if (format === 'pdf')       ok = await exportPDF(cvData, filename);
      else if (format === 'docx') ok = await exportDOCX(cvData, filename);
      else if (format === 'txt')  ok = exportTXT(cvData, filename);
      
      if (ok) {
        addToast({ type: 'success', title: 'Export successful', message: `${filename} downloaded!` });
      } else {
        addToast({ type: 'danger', title: 'Export failed', message: 'Please try again.' });
      }
    } catch {
      addToast({ type: 'danger', title: 'Export failed', message: 'An unexpected error occurred.' });
    } finally {
      setIsExporting(false);
    }
  };

  // Use keyboard shortcut Ctrl+E → Export PDF
  useEffect(() => {
    const handleKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        handleExport('pdf');
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMinContent, cvData]);

  const scoreTotal = atsScore?.total ?? 0;
  const scoreColor =
    scoreTotal >= 80 ? 'var(--color-success)' :
    scoreTotal >= 50 ? 'var(--color-warning)' : 'var(--color-danger)';

  return (
    <header
      className="h-14 flex items-center justify-between px-3 md:px-5 border-b shrink-0 z-[var(--z-topbar)] relative"
      style={{
        backgroundColor: 'var(--color-bg-surface)',
        borderColor: 'var(--color-border)',
      }}
    >
      {/* Left */}
      <div className="flex items-center gap-2 md:gap-3 min-w-0">
        <h2 className="text-sm font-semibold truncate max-w-[120px] md:max-w-[200px]"
          style={{ color: 'var(--color-text-primary)' }}>
          {cvTitle}
        </h2>
        <span className="px-2 py-0.5 text-[10px] md:text-xs rounded-md font-medium flex-shrink-0"
          style={{ backgroundColor: 'var(--color-bg-surface-2)', color: 'var(--color-text-muted)', border: '1px solid var(--color-border)' }}>
          Draft
        </span>
      </div>

      {/* Center: ATS score — dot on mobile, full pill on desktop */}
      <div
        className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center gap-2 px-2 py-1.5 md:px-3 md:py-1 rounded-full text-xs font-semibold cursor-pointer select-none"
        style={{ background: 'var(--color-bg-surface-2)', border: '1px solid var(--color-border)', color: scoreColor }}
        onClick={() => setShowScorePopover(!showScorePopover)}
      >
        <span className="w-2 h-2 md:w-1.5 md:h-1.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: scoreColor, boxShadow: `0 0 6px ${scoreColor}` }} />
        <span className="hidden md:inline">ATS Score: {scoreTotal}/100</span>
        
        {/* Mobile popover */}
        {showScorePopover && (
          <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg bg-[var(--color-bg-surface-2)] border border-[var(--color-border)] shadow-xl z-[var(--z-tooltip)] md:hidden whitespace-nowrap text-[var(--color-text-primary)]">
            ATS Score: {scoreTotal}/100
          </div>
        )}
      </div>

      {/* Right: Export buttons */}
      <div className="flex items-center gap-2 relative">
        {/* Desktop inline chips */}
        <div className="hidden md:flex items-center gap-2">
          {['txt', 'docx'].map(fmt => (
            <button key={fmt}
              onClick={() => handleExport(fmt)}
              disabled={isExporting}
              title={`Export as ${fmt.toUpperCase()}${!hasMinContent ? ' — add your name first' : ''}`}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 disabled:opacity-40 cursor-pointer"
              style={{ color: 'var(--color-text-secondary)', backgroundColor: 'transparent', border: '1px solid var(--color-border)' }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--color-bg-surface-2)'; e.currentTarget.style.borderColor = 'var(--color-border-focus)'; e.currentTarget.style.color = 'var(--color-text-primary)'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-text-secondary)'; }}
            >
              {fmt === 'txt' ? <FileText size={12} /> : <FileType2 size={12} />}
              {fmt.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Mobile dropdown trigger for txt/docx */}
        <button 
          className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg border border-[var(--color-border)] text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-bg-surface-2)]"
          onClick={() => setShowExportMenu(!showExportMenu)}
        >
          <MoreVertical size={16} />
        </button>

        {showExportMenu && (
          <div className="absolute top-full right-0 mt-2 p-1.5 rounded-xl bg-[var(--color-bg-surface)] border border-[var(--color-border)] shadow-xl z-[var(--z-dropdown)] md:hidden flex flex-col gap-1 w-32">
            {['txt', 'docx'].map(fmt => (
              <button key={fmt}
                onClick={() => handleExport(fmt)}
                className="flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg transition-colors hover:bg-[var(--color-bg-hover)] w-full text-left"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {fmt === 'txt' ? <FileText size={14} /> : <FileType2 size={14} />}
                {fmt.toUpperCase()}
              </button>
            ))}
          </div>
        )}

        <Button
          onClick={() => handleExport('pdf')}
          disabled={!hasMinContent}
          loading={isExporting}
          loadingText="Exporting"
          title={`Export as PDF${!hasMinContent ? ' — add your name first' : ' (Ctrl+E)'}`}
          size="sm"
        >
          <Download size={14} strokeWidth={2.5} />
          <span className="hidden sm:inline">Export PDF</span>
          <span className="sm:hidden">PDF</span>
        </Button>
      </div>
    </header>
  );
}

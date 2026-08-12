import { SectionAccordion } from '../components/builder/SectionAccordion';
import { CVPreview } from '../components/preview/CVPreview';
import { ATSScoreCard } from '../components/ats/ATSScoreCard';
import { useEffect, useState } from 'react';
import { Edit3, Eye } from 'lucide-react';

export function Builder() {
  const [mobileTab, setMobileTab] = useState('edit');
  useEffect(() => { document.title = 'Builder — Clearscan'; return () => { document.title = 'Clearscan'; }; }, []);

  return (
    <div className="flex flex-col lg:flex-row gap-5 h-full pb-8 animate-fade-in relative">
      {/* Mobile Tab Switcher */}
      <div className="lg:hidden flex items-center justify-center p-1 rounded-xl w-full max-w-sm mx-auto mb-2 shrink-0 border"
           style={{ backgroundColor: 'var(--color-bg-surface-2)', borderColor: 'var(--color-border)' }}>
        <button
          onClick={() => setMobileTab('edit')}
          className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-lg text-sm font-semibold transition-all ${mobileTab === 'edit' ? 'shadow-sm' : 'opacity-70'}`}
          style={{
            backgroundColor: mobileTab === 'edit' ? 'var(--color-bg-surface)' : 'transparent',
            color: mobileTab === 'edit' ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
            border: mobileTab === 'edit' ? '1px solid var(--color-border)' : '1px solid transparent',
          }}
        >
          <Edit3 size={16} /> Edit
        </button>
        <button
          onClick={() => setMobileTab('preview')}
          className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-lg text-sm font-semibold transition-all ${mobileTab === 'preview' ? 'shadow-sm' : 'opacity-70'}`}
          style={{
            backgroundColor: mobileTab === 'preview' ? 'var(--color-bg-surface)' : 'transparent',
            color: mobileTab === 'preview' ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
            border: mobileTab === 'preview' ? '1px solid var(--color-border)' : '1px solid transparent',
          }}
        >
          <Eye size={16} /> Preview
        </button>
      </div>

      {/* Left column: ATS card + forms */}
      <div className={`flex-1 overflow-y-auto pr-1 custom-scrollbar flex-col gap-4 min-w-0 ${mobileTab === 'edit' ? 'flex' : 'hidden lg:flex'}`}>
        <ATSScoreCard />

        <div>
          <p className="section-heading mb-3">CV Editor</p>
          <SectionAccordion />
        </div>
      </div>

      {/* Right column: Live preview */}
      <div
        className={`w-full lg:w-[44%] xl:w-[48%] overflow-hidden flex-col lg:sticky lg:top-0 h-[800px] lg:h-[calc(100vh-7.5rem)] flex-shrink-0 ${mobileTab === 'preview' ? 'flex' : 'hidden lg:flex'}`}
        style={{
          borderRadius: '20px',
          border: '1px solid var(--color-border)',
          boxShadow: '0 0 0 1px var(--color-border), 0 20px 60px -20px rgba(0,0,0,0.7)',
          backgroundColor: '#ffffff',
          colorScheme: 'light',
        }}
      >
        {/* Preview chrome bar */}
        <div
          className="flex items-center gap-2 px-4 py-3 border-b text-xs font-medium flex-shrink-0"
          style={{
            backgroundColor: '#F5F5FA',
            borderColor: '#E8E8F0',
            color: '#8888AA',
            colorScheme: 'light',
          }}
        >
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#FF6058' }} />
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#FFBD2E' }} />
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#28C840' }} />
          </div>
          <span className="flex-1 text-center font-semibold" style={{ color: '#555570' }}>
            Live ATS-Safe Preview
          </span>
          <div
            className="px-2 py-0.5 rounded-full text-xs font-semibold"
            style={{
              background: 'rgba(201, 162, 39, 0.1)',
              color: '#C9A227',
              border: '1px solid rgba(201, 162, 39, 0.2)',
            }}
          >
            ● LIVE
          </div>
        </div>

        <div
          className="flex-1 p-6 overflow-y-auto custom-scrollbar bg-white"
          style={{ colorScheme: 'light' }}
        >
          <CVPreview />
        </div>
      </div>
    </div>
  );
}

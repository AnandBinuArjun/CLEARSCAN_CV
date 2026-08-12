import { useCVStore } from '../store/cvStore';
import { Check } from 'lucide-react';
import { cn } from '../lib/utils';
import { useEffect } from 'react';

const APP_VERSION = '2.0.0';

const templates = [
  {
    id: 'classic',
    name: 'Classic',
    sub: 'Times New Roman — Traditional serif',
    font: 'Georgia, "Times New Roman", serif',
    accent: '#1a1a2e',
  },
  {
    id: 'modern',
    name: 'Modern',
    sub: 'Arial — Clean sans-serif',
    font: 'Arial, Helvetica, sans-serif',
    accent: '#0f172a',
  },
  {
    id: 'compact',
    name: 'Compact',
    sub: 'Courier — Monospace / technical',
    font: '"Courier New", Courier, monospace',
    accent: '#111827',
  },
];

// Mini live CV preview using store data
function MiniCVPreview({ template, personalInfo, summary, experience }) {
  const name = personalInfo?.fullName?.trim() || 'Your Name';
  const email = personalInfo?.email || '';
  const phone = personalInfo?.phone || '';
  const contact = [email, phone].filter(Boolean).join(' · ');
  const exp = experience?.[0];

  return (
    <div
      className="w-full rounded overflow-hidden text-left"
      style={{
        backgroundColor: '#ffffff',
        fontFamily: template.font,
        fontSize: '6px',
        lineHeight: '1.4',
        color: '#111',
        transform: 'scale(1)',
        border: '1px solid #e5e7eb',
        minHeight: '140px',
      }}
    >
      {/* Header */}
      <div className="px-3 pt-3 pb-2" style={{ borderBottom: '1.5px solid #cbd5e1' }}>
        <div className="font-bold" style={{ fontSize: '10px', color: template.accent }}>{name}</div>
        {contact && <div style={{ fontSize: '5.5px', color: '#6b7280', marginTop: '1px' }}>{contact}</div>}
      </div>
      {/* Summary snippet */}
      {summary && (
        <div className="px-3 pt-1.5">
          <div className="font-bold uppercase" style={{ fontSize: '5px', letterSpacing: '0.08em', color: '#374151', borderBottom: '0.5px solid #d1d5db', paddingBottom: '1px', marginBottom: '2px' }}>Summary</div>
          <div style={{ fontSize: '5px', color: '#4b5563' }}>{summary.slice(0, 80)}{summary.length > 80 ? '…' : ''}</div>
        </div>
      )}
      {/* Experience snippet */}
      {exp && (
        <div className="px-3 pt-1.5">
          <div className="font-bold uppercase" style={{ fontSize: '5px', letterSpacing: '0.08em', color: '#374151', borderBottom: '0.5px solid #d1d5db', paddingBottom: '1px', marginBottom: '2px' }}>Experience</div>
          <div className="font-semibold" style={{ fontSize: '5.5px', color: '#111' }}>{exp.title}</div>
          <div style={{ fontSize: '5px', color: '#6b7280' }}>{exp.company}</div>
          {exp.bullets?.[0] && (
            <div style={{ fontSize: '4.5px', color: '#4b5563', marginTop: '1px' }}>• {exp.bullets[0].slice(0, 60)}</div>
          )}
        </div>
      )}
      {/* Skeleton lines if no content */}
      {!summary && !exp && (
        <div className="px-3 pt-2 space-y-1">
          {[0.9, 0.7, 0.5, 0.75, 0.6].map((w, i) => (
            <div key={i} className="h-1 rounded-sm" style={{ width: `${w * 100}%`, backgroundColor: i % 2 === 0 ? '#e2e8f0' : '#cbd5e1' }} />
          ))}
        </div>
      )}
    </div>
  );
}

export function Templates() {
  const { activeTemplate, setActiveTemplate, personalInfo, summary, experience } = useCVStore();

  useEffect(() => { document.title = 'Templates — Clearscan'; return () => { document.title = 'Clearscan'; }; }, []);

  return (
    <div className="max-w-4xl animate-fade-in">
      <div className="mb-8">
        <h1 className="text-xl font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>
          ATS-Safe Templates
        </h1>
        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          Guaranteed 100% parseable by ATS systems. Standard fonts, linear structure, no tables or columns.
          <span className="ml-2 font-medium" style={{ color: 'var(--color-accent-hover)' }}>Previews use your actual CV data.</span>
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        {templates.map((template) => {
          const isActive = activeTemplate === template.id;
          return (
            <button
              key={template.id}
              onClick={() => setActiveTemplate(template.id)}
              className="relative flex flex-col gap-3 p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer text-left group"
              style={{
                backgroundColor: 'var(--color-bg-surface)',
                borderColor: isActive ? 'var(--color-accent)' : 'var(--color-border)',
                boxShadow: isActive ? '0 0 0 1px rgba(124,58,237,0.15), 0 0 24px rgba(124,58,237,0.12)' : 'none',
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.borderColor = 'var(--color-border-focus)'; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.borderColor = 'var(--color-border)'; }}
              aria-pressed={isActive}
              aria-label={`Select ${template.name} template`}
            >
              {/* Active badge */}
              {isActive && (
                <div
                  className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center z-10"
                  style={{ background: 'var(--color-accent)' }}
                >
                  <Check size={10} color="#fff" strokeWidth={3} />
                </div>
              )}

              {/* Real mini CV preview */}
              <MiniCVPreview
                template={template}
                personalInfo={personalInfo}
                summary={summary}
                experience={experience}
              />

              {/* Label */}
              <div>
                <p
                  className="text-sm font-bold"
                  style={{
                    color: isActive ? 'var(--color-accent-hover)' : 'var(--color-text-primary)',
                    fontWeight: 600,
                  }}
                >
                  {template.name}
                </p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                  {template.sub}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* ATS safety note */}
      <div
        className="rounded-xl p-4 flex items-start gap-3"
        style={{
          background: 'linear-gradient(135deg, rgba(124,58,237,0.06), rgba(6,182,212,0.04))',
          border: '1px solid rgba(124,58,237,0.2)',
        }}
      >
        <div className="text-xs leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
          <span className="font-semibold" style={{ color: 'var(--color-accent-hover)' }}>ATS Safety Guarantee: </span>
          All templates avoid multi-column layouts, text boxes, tables, and headers/footers — the four main
          causes of ATS parsing failures. Font selection only affects the <em>visual appearance</em> of the exported file,
          not the underlying data structure.
        </div>
      </div>
    </div>
  );
}

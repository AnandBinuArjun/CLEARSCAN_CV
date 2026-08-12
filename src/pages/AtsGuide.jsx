import { FileText, Layout, Type, List, MonitorSmartphone, XCircle, ShieldCheck } from 'lucide-react';
import { useEffect } from 'react';

export function AtsGuide() {
  useEffect(() => { document.title = 'ATS Guide — Clearscan'; return () => { document.title = 'Clearscan'; }; }, []);

  const sections = [
    {
      title: '1. File Format',
      icon: FileText,
      items: [
        'Save as .docx or standard PDF (not scanned/image-based PDF).',
        'Avoid .pages, .odt, or other uncommon formats.',
        'File name should be professional: FirstName-LastName-Resume.pdf.',
        'If the job posting specifies a format, follow it exactly.'
      ]
    },
    {
      title: '2. Layout & Structure',
      icon: Layout,
      items: [
        'Single column layout — multi-column resumes often get scrambled.',
        'No tables for layout (parsers may skip table content entirely).',
        'No headers/footers for critical info (name, contact details).',
        'Reverse-chronological order (most recent experience first).',
        'Keep to 1–2 pages.'
      ]
    },
    {
      title: '3. Fonts & Typography',
      icon: Type,
      items: [
        'Use standard fonts: Arial, Calibri, Georgia, Times New Roman, Helvetica.',
        'Avoid decorative/script fonts.',
        'Font size: 10–12pt for body text, 14–16pt for name/headers.',
        'Avoid excessive bold/italic/underline.',
      ]
    },
    {
      title: '4. Section Headers',
      icon: List,
      items: [
        'Use exact-match titles: "Work Experience" or "Professional Experience".',
        'Use standard titles: "Education", "Skills", "Certifications".',
        'Avoid creative renaming (e.g., "My Journey") — this breaks parsing.'
      ]
    },
    {
      title: '5. What to Avoid Entirely',
      icon: XCircle,
      isWarning: true,
      items: [
        'Multi-column/creative template layouts (Canva-style visual resumes).',
        'Embedded images, icons, infographics, or logos.',
        'Unusual bullet/icon fonts (Wingdings, emojis).',
        'Text over images or colored backgrounds.',
        'Scanned/flattened image-based PDFs.'
      ]
    }
  ];

  return (
    <div className="max-w-4xl animate-fade-in pb-12">
      {/* Header */}
      <div className="mb-8 border-b pb-6" style={{ borderColor: 'var(--color-border)' }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--color-accent-dim)' }}>
            <ShieldCheck size={20} style={{ color: 'var(--color-accent-hover)' }} />
          </div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
            ATS Optimization Guide
          </h1>
        </div>
        <p className="text-sm mt-2 max-w-2xl" style={{ color: 'var(--color-text-secondary)' }}>
          A complete checklist covering structure, formatting, content, and technical file requirements to ensure your resume passes Applicant Tracking Systems.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section, idx) => {
          const Icon = section.icon;
          return (
            <section 
              key={idx} 
              className="rounded-xl p-6" 
              style={{ 
                backgroundColor: 'var(--color-bg-surface)', 
                border: section.isWarning ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid var(--color-border)' 
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <Icon size={18} style={{ color: section.isWarning ? 'var(--color-danger)' : 'var(--color-text-secondary)' }} />
                <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: section.isWarning ? 'var(--color-danger)' : 'var(--color-text-primary)' }}>
                  {section.title}
                </h2>
              </div>
              <ul className="space-y-2.5">
                {section.items.map((item, i) => (
                  <li key={i} className="flex gap-3 text-sm">
                    <span style={{ color: section.isWarning ? 'var(--color-danger)' : 'var(--color-accent)' }} className="mt-0.5">•</span>
                    <span style={{ color: 'var(--color-text-secondary)' }}>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          )
        })}
      </div>

      <section className="mt-8 rounded-xl p-6" style={{ backgroundColor: 'var(--color-bg-surface-2)', border: '1px solid var(--color-border)' }}>
        <div className="flex items-center gap-3 mb-4">
          <MonitorSmartphone size={18} style={{ color: 'var(--color-text-secondary)' }} />
          <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-primary)' }}>
            Keyword Optimization
          </h2>
        </div>
        <ul className="space-y-3">
          <li className="flex gap-3 text-sm">
             <span style={{ color: 'var(--color-accent)' }} className="mt-0.5">✓</span>
             <span style={{ color: 'var(--color-text-secondary)' }}>Mirror keywords/phrases from the <strong>specific job description</strong> (exact terms, not just synonyms).</span>
          </li>
          <li className="flex gap-3 text-sm">
             <span style={{ color: 'var(--color-accent)' }} className="mt-0.5">✓</span>
             <span style={{ color: 'var(--color-text-secondary)' }}>Include both the acronym and full term where relevant (e.g., "Search Engine Optimization (SEO)").</span>
          </li>
          <li className="flex gap-3 text-sm">
             <span style={{ color: 'var(--color-accent)' }} className="mt-0.5">✓</span>
             <span style={{ color: 'var(--color-text-secondary)' }}>Weave keywords naturally into experience bullets — not just a dumped keyword list.</span>
          </li>
        </ul>
      </section>
    </div>
  );
}

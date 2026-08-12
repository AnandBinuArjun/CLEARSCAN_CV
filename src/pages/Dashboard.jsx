import { Link } from 'react-router-dom';
import { Plus, FileText, Clock, ArrowRight, Zap, Eye, Rocket, FilePlus } from 'lucide-react';
import { useCVStore } from '../store/cvStore';
import { motion } from 'framer-motion';
import { useEffect } from 'react';

export function Dashboard() {
  const { personalInfo, atsScore } = useCVStore();
  const name = personalInfo?.fullName?.trim();
  const greeting = name ? `Welcome back, ${name.split(' ')[0]}` : 'Your Workspace';
  const scoreTotal = atsScore?.total ?? 0;
  const scoreColor =
    scoreTotal >= 80 ? 'var(--color-success)' :
    scoreTotal >= 50 ? 'var(--color-warning)' : 'var(--color-danger)';
  const hasContent = !!(name || personalInfo?.email);

  useEffect(() => { document.title = 'Dashboard — Clearscan'; return () => { document.title = 'Clearscan'; }; }, []);

  return (
    <div className="max-w-5xl animate-fade-in space-y-8">

      {/* Hero greeting banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative rounded-2xl overflow-hidden p-8"
        style={{
          background: 'var(--color-bg-surface)',
          borderTop: '1px solid rgba(201, 162, 39, 0.2)',
          borderLeft: '1px solid var(--color-border)',
          borderRight: '1px solid var(--color-border)',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1
              className="text-2xl sm:text-3xl font-semibold mb-2"
              style={{ color: 'var(--color-text-primary)' }}
            >
              {greeting}
            </h1>
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              You have {hasContent ? '1 draft' : '0 drafts'} and 0 export-ready resumes.
            </p>
          </div>
          {/* Action Buttons in Hero */}
          <div className="flex gap-3">
            <Link to="/builder">
              <button className="btn-gradient px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap">
                + New CV
              </button>
            </Link>
            <Link to="/ats-score">
              <button
                className="px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                style={{ background: 'transparent', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--color-border-focus)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--color-border)'}
              >
                Analyze Score
              </button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="surface p-5 flex flex-col justify-center">
          <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: 'var(--color-text-secondary)' }}>Total CVs</p>
          <p className="text-2xl font-semibold" style={{ color: 'var(--color-text-primary)', fontFamily: "'Geist Mono', monospace" }}>{hasContent ? 1 : 0}</p>
        </div>
        <div className="surface p-5 flex flex-col justify-center relative overflow-hidden">
          <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: 'var(--color-text-secondary)' }}>Avg. ATS Score</p>
          <div className="flex items-center gap-3">
            <p className="text-2xl font-semibold" style={{ color: scoreColor, fontFamily: "'Geist Mono', monospace" }}>{scoreTotal}</p>
          </div>
        </div>
        <div className="surface p-5 flex flex-col justify-center">
          <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: 'var(--color-text-secondary)' }}>Last Edited</p>
          <p className="text-lg font-medium mt-1" style={{ color: 'var(--color-text-primary)' }}>{hasContent ? 'Just now' : 'Never'}</p>
        </div>
      </div>



      {/* Resumes grid */}
      <div>
        <p className="section-heading mb-4">Your Resumes</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          
          {/* Create new */}
          <Link to="/builder">
            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="group h-52 rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-200"
              style={{
                border: '1px dashed var(--color-border)',
                background: 'transparent',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--color-accent)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--color-border)';
              }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200"
                style={{ background: 'var(--color-bg-surface-2)', border: '1px solid var(--color-border)' }}
              >
                <FilePlus size={20} style={{ color: 'var(--color-text-secondary)' }} strokeWidth={2} />
              </div>
              <span
                className="text-sm font-medium transition-colors duration-200"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Create New CV
              </span>
            </motion.div>
          </Link>

          {hasContent ? (
            /* Existing CV card */
            <Link to="/builder">
              <motion.div
                whileHover={{ y: -2 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="bento-card h-52 flex flex-col p-5 justify-between cursor-pointer group"
              >
                <div className="flex items-start justify-between">
                  <div
                    className="w-full h-24 rounded-lg overflow-hidden border mb-3 flex items-center justify-center bg-[var(--color-bg-surface-2)]"
                    style={{ borderColor: 'var(--color-border)' }}
                  >
                    <FileText size={24} style={{ color: 'var(--color-accent)' }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <p
                      className="text-sm font-semibold"
                      style={{ color: 'var(--color-text-primary)' }}
                    >
                      {name || 'Untitled CV'}
                    </p>
                    <ArrowRight size={14} style={{ color: 'var(--color-text-secondary)' }} className="group-hover:text-[var(--color-accent)] transition-colors" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-2 h-2 rounded-full inline-block"
                      style={{ backgroundColor: scoreColor }}
                    />
                    <span className="text-xs" style={{ color: 'var(--color-text-secondary)', fontFamily: "'Geist Mono', monospace" }}>ATS {scoreTotal}</span>
                    <span className="text-xs mx-1" style={{ color: 'var(--color-border)' }}>•</span>
                    <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>edit</span>
                  </div>
                </div>
              </motion.div>
            </Link>
          ) : (
            /* Skeleton Cards for empty state */
            <>
              {[1, 2].map((i) => (
                <div key={i} className="bento-card h-52 flex flex-col p-5 justify-between relative overflow-hidden pointer-events-none opacity-50">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(150,150,150,0.05)] to-transparent animate-shimmer" style={{ transform: 'skewX(-20deg)', backgroundSize: '200% 100%' }} />
                  <div className="w-full h-24 rounded-lg bg-[var(--color-bg-surface-2)]" />
                  <div>
                    <div className="w-2/3 h-4 rounded bg-[var(--color-bg-surface-2)] mb-2" />
                    <div className="w-1/3 h-3 rounded bg-[var(--color-bg-surface-2)]" />
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

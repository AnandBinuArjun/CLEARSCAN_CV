import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Zap, FileText } from 'lucide-react';
import { useEffect } from 'react';

const features = [
  { icon: '🎯', title: 'ATS Scoring', desc: 'Real-time keyword match analysis against job descriptions.' },
  { icon: '⚡', title: 'Instant Export', desc: 'PDF, DOCX, and TXT — pixel-perfect ATS-safe output.' },
  { icon: '🧠', title: 'Smart Templates', desc: 'Professionally designed layouts proven to pass parsers.' },
];

export function Landing() {
  useEffect(() => { document.title = 'Clearscan — Land the Job'; return () => { document.title = 'Clearscan'; }; }, []);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center text-center px-4 relative overflow-hidden"
      style={{ backgroundColor: 'var(--color-bg-primary)' }}
    >

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="z-10 max-w-4xl flex flex-col items-center"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="badge-blue mb-8"
        >
          <Zap size={11} />
          ATS-Optimized CV Builder v4.0
        </motion.div>

        {/* Headline */}
        <h1
          className="text-5xl md:text-7xl font-semibold mb-6 leading-[1.05] tracking-tight"
          style={{ color: 'var(--color-text-primary)' }}
        >
          <span>Beat the</span>{' '}
          <span style={{ color: 'var(--color-accent)' }}>ATS.</span>
          <br />
          <span>Land the</span>{' '}
          <span style={{ color: 'var(--color-accent)' }}>Job.</span>
        </h1>

        <p
          className="text-lg md:text-xl max-w-2xl mb-12 leading-relaxed"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          The only CV builder engineered to bypass Applicant Tracking Systems.
          Get real-time scoring, intelligent keyword matching, and recruiter-ready PDF exports.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 mb-20">
          <Link to="/builder">
            <Button size="xl" variant="primary" className="rounded-2xl gap-3 px-10">
              Build Your CV Free
              <ArrowRight size={16} strokeWidth={2.5} />
            </Button>
          </Link>
          <Link to="/templates">
            <Button size="xl" variant="secondary" className="rounded-2xl px-10">
              View Templates
            </Button>
          </Link>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.12, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="bento-card p-6 text-left"
            >
              <span className="text-2xl mb-4 block">{f.icon}</span>
              <h3
                className="text-sm font-semibold mb-2"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {f.title}
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Floating side cards */}
      <motion.div
        initial={{ opacity: 0, x: -60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.7, duration: 0.8 }}
        className="absolute left-8 top-1/3 hidden xl:block glass-panel p-5 rotate-[4deg]"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ background: 'var(--color-bg-surface-2)', border: '1px solid var(--color-border)' }}
          >
            <CheckCircle2 size={18} style={{ color: 'var(--color-success)' }} />
          </div>
          <div>
            <div className="text-xs font-semibold" style={{ color: 'var(--color-text-primary)' }}>Keywords Matched</div>
            <div className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>React · Node.js · TypeScript</div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.9, duration: 0.8 }}
        className="absolute right-8 bottom-1/3 hidden xl:block glass-panel p-6 rotate-[-4deg]"
      >
        <div className="flex flex-col items-center gap-2">
          <FileText size={20} style={{ color: 'var(--color-accent)' }} className="mb-2" />
          <div className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-text-secondary)' }}>ATS Score</div>
          <div
            className="text-4xl font-semibold"
            style={{ color: 'var(--color-text-primary)', fontFamily: "'Geist Mono', monospace" }}
          >
            98
          </div>
          <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>out of 100</div>
        </div>
      </motion.div>
    </div>
  );
}

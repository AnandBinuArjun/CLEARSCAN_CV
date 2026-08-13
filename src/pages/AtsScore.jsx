import React, { useState, useEffect } from 'react';
import { useCVStore } from '../store/cvStore';
import { calculateATSScore } from '../lib/atsScoring';
import { Button } from '../components/ui/Button';
import { SEO } from '../components/seo/SEO';
import { Textarea } from '../components/ui/Textarea';
import { CheckCircle2, AlertCircle, Zap, TrendingUp, Target, Award, FlaskConical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

const SAMPLE_JD = `We are looking for a Senior Software Engineer with experience in React, TypeScript, and Node.js. You will lead a team of 4 engineers to develop and deploy scalable microservices. Requirements: 5+ years of software development, proficiency in SQL and PostgreSQL, experience with AWS or GCP, strong communication and leadership skills, familiarity with Agile methodologies and CI/CD pipelines.`;

export default function AtsScore() {
  const cvData = useCVStore();
  const { atsScore: storeScore, setAtsScore, targetJobDescription, setTargetJobDescription } = cvData;
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scoreData, setScoreData] = useState(() =>
    storeScore?.breakdown?.completeness ? storeScore : null
  );

  useEffect(() => { document.title = 'ATS Score — Clearscan'; return () => { document.title = 'Clearscan'; }; }, []);

  const handleSampleJD = () => {
    setTargetJobDescription(SAMPLE_JD);
  };

  useEffect(() => {
    if (storeScore?.breakdown?.completeness) setScoreData(storeScore);
  }, [storeScore]);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const latestData = useCVStore.getState();
      const newScore = calculateATSScore(latestData);
      setAtsScore(newScore);
      setScoreData(newScore);
      setIsAnalyzing(false);
    }, 800);
  };

  const getScoreColor = (pct) => {
    if (pct >= 80) return 'var(--color-success)';
    if (pct >= 50) return 'var(--color-warning)';
    return 'var(--color-danger)';
  };

  const getScoreGradient = (pct) => {
    if (pct >= 80) return 'linear-gradient(90deg, var(--color-success), var(--color-success-hover))';
    if (pct >= 50) return 'linear-gradient(90deg, var(--color-warning), var(--color-warning-hover))';
    return 'linear-gradient(90deg, var(--color-danger), var(--color-danger-hover))';
  };

  /* Gradient SVG ring */
  const ScoreRing = ({ score, max, size = 120 }) => {
    const r = size / 2 - 10;
    const circ = r * 2 * Math.PI;
    const pct = max > 0 ? score / max : 0;
    const offset = circ - pct * circ;
    const clr = getScoreColor(pct * 100);

    return (
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="rotate-[-90deg]">
          <defs>
            <linearGradient id={`ring-grad-${max}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7C3AED" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>
          </defs>
          {/* Track */}
          <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,0.05)" strokeWidth="8" fill="transparent" />
          {/* Progress */}
          <circle
            cx={size / 2} cy={size / 2} r={r}
            stroke={pct >= 0.8 ? `url(#ring-grad-${max})` : clr}
            strokeWidth="8" fill="transparent"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute flex flex-col items-center leading-none">
          <span
            className="text-2xl font-bold"
            style={{ color: clr, fontFamily: "'Geist Mono', monospace" }}
          >
            {score}
          </span>
          <span className="text-xs mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>/{max}</span>
        </div>
      </div>
    );
  };

  const BreakdownBar = ({ label, score, max, messages, icon: Icon }) => {
    const pct = max > 0 ? (score / max) * 100 : 0;
    const clr = getScoreColor(pct);
    const grad = getScoreGradient(pct);

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {Icon && <Icon size={14} style={{ color: 'var(--color-text-muted)' }} />}
            <span className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
              {label}
            </span>
          </div>
          <span
            className="text-xs font-bold px-2.5 py-1 rounded-full"
            style={{
              color: clr,
              background: `color-mix(in srgb, ${clr} 12%, transparent)`,
              border: `1px solid color-mix(in srgb, ${clr} 25%, transparent)`,
            }}
          >
            {score} / {max}
          </span>
        </div>
        {/* Progress bar */}
        <div
          className="h-1.5 rounded-full overflow-hidden"
          style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ background: grad }}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
        {/* Messages */}
        {messages && messages.length > 0 ? (
          <ul className="space-y-1 mt-1">
            {messages.map((msg, i) => (
              <li key={i} className="flex items-start gap-2 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                <AlertCircle size={12} className="mt-0.5 flex-shrink-0" style={{ color: 'var(--color-warning)' }} />
                {msg}
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--color-success)' }}>
            <CheckCircle2 size={12} />
            All requirements met.
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      <SEO 
        title="Free ATS Resume Checker | Clearscan" 
        description="Check your resume against a job description in real time. Our free ATS resume checker scans for missing keywords and formatting errors."
        keywords="free ATS resume checker, resume keyword scanner, resume keyword match tool, resume builder with live ATS score"
        url="/ats-score"
      />
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'var(--color-bg-surface-2)', border: '1px solid var(--color-border)' }}
            >
              <TrendingUp size={15} style={{ color: 'var(--color-accent)' }} />
            </div>
            <h1
              className="text-xl font-semibold"
              style={{ color: 'var(--color-text-primary)' }}
            >
              ATS Compatibility Score
            </h1>
          </div>
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            Analyze your CV against ATS best practices and a target job description.
          </p>
        </div>
      </div>

      {/* Main Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 flex-col-reverse lg:flex-row">

        {/* Left: JD Input (Below results on mobile) */}
        <div className="lg:col-span-2 space-y-4 order-2 lg:order-1">
          <div className="bento-card p-6 space-y-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Target size={15} style={{ color: 'var(--color-accent)' }} />
                  <p className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                    Target Job Description
                  </p>
                </div>
                <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                  Paste the full job posting to check keyword alignment.
                </p>
              </div>
              <button
                onClick={handleSampleJD}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium flex-shrink-0 transition-all cursor-pointer"
                style={{ background: 'var(--color-accent-dim)', color: 'var(--color-accent-hover)', border: '1px solid rgba(124,58,237,0.25)' }}
                title="Load a sample software engineer job description"
              >
                <FlaskConical size={11} /> Try Sample
              </button>
            </div>

            <Textarea
              value={targetJobDescription}
              onChange={(e) => setTargetJobDescription(e.target.value)}
              placeholder="Paste job description here…"
              className="h-48 text-xs leading-relaxed"
            />

            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              variant="primary"
              className="w-full rounded-xl"
            >
              {isAnalyzing ? (
                <span className="flex items-center gap-2">
                  <span className="inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analyzing…
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Zap size={14} />
                  Analyze My CV
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Right: Results (Above JD input on mobile) */}
        <div className="lg:col-span-3 space-y-4 order-1 lg:order-2">
          <AnimatePresence mode="wait">
            {scoreData ? (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-4"
              >
                {/* Overall score card */}
                <div
                  className="bento-card p-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                        Overall ATS Match
                      </p>
                      <div className="flex items-baseline gap-2">
                        <span
                          className="text-5xl font-bold"
                          style={{
                            color: getScoreColor(scoreData.total),
                            fontFamily: "'Geist Mono', monospace",
                          }}
                        >
                          {scoreData.total}
                        </span>
                        <span className="text-xl font-medium" style={{ color: 'var(--color-text-secondary)' }}>/100</span>
                      </div>
                      <p className="text-xs mt-2" style={{ color: 'var(--color-text-secondary)' }}>
                        Based on structure, content quality, and keyword match.
                      </p>
                    </div>
                    <ScoreRing score={scoreData.total} max={100} size={110} />
                  </div>
                </div>

                {/* Breakdown */}
                <div className="bento-card p-6 space-y-6">
                  <p className="section-heading">Detailed Breakdown</p>

                  <BreakdownBar
                    label="Structure & Completeness"
                    score={scoreData.breakdown.completeness.score}
                    max={30}
                    messages={scoreData.breakdown.completeness.messages}
                    icon={Award}
                  />

                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }} />

                  <BreakdownBar
                    label="Action Verbs & Metrics"
                    score={scoreData.breakdown.bullets.score}
                    max={30}
                    messages={scoreData.breakdown.bullets.messages}
                    icon={TrendingUp}
                  />

                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }} />

                  <BreakdownBar
                    label="Keyword Match"
                    score={scoreData.breakdown.keywords.score}
                    max={40}
                    messages={scoreData.breakdown.keywords.messages}
                    icon={Target}
                  />

                  {/* Missing keywords */}
                  {scoreData.missingKeywords?.length > 0 && (
                    <div
                      className="mt-2 p-4 rounded-xl space-y-3"
                      style={{
                        background: 'rgba(239,68,68,0.06)',
                        border: '1px solid rgba(239,68,68,0.2)',
                      }}
                    >
                      <p className="text-xs font-bold" style={{ color: 'var(--color-danger)' }}>
                        ⚠ Missing Keywords
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {scoreData.missingKeywords.map((kw, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 text-xs rounded-lg font-medium"
                            style={{
                              background: 'rgba(239,68,68,0.1)',
                              color: 'var(--color-danger)',
                              border: '1px solid rgba(239,68,68,0.25)',
                            }}
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bento-card p-12 flex flex-col items-center justify-center text-center"
                style={{ borderStyle: 'dashed', minHeight: '300px' }}
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
                  style={{
                    background: 'var(--color-bg-surface-2)',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  <Zap size={28} style={{ color: 'var(--color-accent)' }} />
                </div>
                <p className="text-base font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                  No Analysis Yet
                </p>
                <p className="text-sm mb-5 max-w-xs" style={{ color: 'var(--color-text-secondary)' }}>
                  Paste a job description and click Analyze to see your full ATS breakdown with scored metrics.
                </p>
                <button
                  onClick={() => { handleSampleJD(); setTimeout(handleAnalyze, 100); }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold cursor-pointer transition-all"
                  style={{ background: 'var(--color-bg-surface-2)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}
                >
                  <FlaskConical size={14} /> Try with Sample JD
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

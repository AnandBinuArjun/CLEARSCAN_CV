import { useState, useEffect, useRef } from 'react';
import { useCVStore } from '../../store/cvStore';
import { calculateATSScore } from '../../lib/atsScoring';
import { ProgressRing } from '../ui/ProgressRing';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import { Zap, AlertCircle, CheckCircle2 } from 'lucide-react';

export function ATSScoreCard() {
  const cvData = useCVStore();
  const { setAtsScore, atsScore, targetJobDescription, setTargetJobDescription, skills, updateSkills } = cvData;
  const [jdInput, setJdInput] = useState(targetJobDescription);

  // ── Debounced auto-score (600ms after last change) ───────────────────────
  const debounceRef = useRef(null);
  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const newScore = calculateATSScore(cvData);
      if (JSON.stringify(newScore) !== JSON.stringify(atsScore)) {
        setAtsScore(newScore);
      }
    }, 600);
    return () => clearTimeout(debounceRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cvData.personalInfo, cvData.summary, cvData.experience, cvData.education, cvData.skills, cvData.targetJobDescription]);

  const handleJDSubmit = () => {
    setTargetJobDescription(jdInput);
    const latestData = useCVStore.getState();
    const newScore = calculateATSScore({ ...latestData, targetJobDescription: jdInput });
    setAtsScore(newScore);
  };

  const addMissingKeyword = (kw) => {
    const hardSkills = skills?.hard ?? [];
    const softSkills = skills?.soft ?? [];
    if (!hardSkills.includes(kw) && !softSkills.includes(kw)) {
      updateSkills({ ...skills, hard: [...hardSkills, kw] });
    }
  };

  const total = atsScore?.total ?? 0;
  const breakdown = atsScore?.breakdown ?? {};
  let scoreColor = 'var(--color-danger)';
  let scoreBg    = 'var(--color-danger-dim)';
  let ScoreIcon  = AlertCircle;
  if (total >= 75) { scoreColor = 'var(--color-success)'; scoreBg = 'var(--color-success-dim)'; ScoreIcon = CheckCircle2; }
  else if (total >= 50) { scoreColor = 'var(--color-warning)'; scoreBg = 'var(--color-warning-dim)'; ScoreIcon = Zap; }

  const getScore = (key) => {
    const val = breakdown[key];
    if (typeof val === 'object' && val !== null) return val.score ?? 0;
    return typeof val === 'number' && !isNaN(val) ? val : 0;
  };

  const metrics = [
    { label: 'Completeness', value: Math.round(getScore('completeness')), max: 30 },
    { label: 'Action Verbs', value: Math.round(getScore('bullets')),      max: 30 },
    { label: 'Keywords',     value: Math.round(getScore('keywords')),     max: 40 },
  ];

  return (
    <div
      className="bento-card p-5 space-y-5 animate-fade-in text-left"
    >
      {/* Title row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ScoreIcon size={15} style={{ color: scoreColor }} strokeWidth={2} />
          <h3
            className="text-sm font-semibold"
            style={{ color: 'var(--color-text-primary)' }}
          >
            ATS Compatibility
          </h3>
        </div>
        <span
          className="text-xs font-bold px-2.5 py-0.5 rounded-full"
          style={{ backgroundColor: scoreBg, color: scoreColor }}
        >
          {total} / 100
        </span>
      </div>

      {/* Ring + metric pills */}
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
        <div className="relative flex items-center justify-center flex-shrink-0 self-start sm:self-auto">
          <ProgressRing radius={44} stroke={6} progress={total} color={scoreColor} />
          <div className="absolute flex flex-col items-center leading-none">
            <span
              className="text-xl font-bold"
              style={{ color: scoreColor, fontFamily: "'Geist Mono', monospace" }}
            >
              {total}
            </span>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-3 gap-2 w-full">
          {metrics.map(({ label, value, max }) => {
            const pct = max > 0 ? value / max : 0;
            const mColor = pct >= 0.75 ? 'var(--color-success)' : pct >= 0.5 ? 'var(--color-warning)' : 'var(--color-danger)';
            return (
              <div
                key={label}
                className="flex flex-col gap-0.5 px-3 py-2 rounded-xl"
                style={{ backgroundColor: 'var(--color-bg-surface-2)', border: '1px solid var(--color-border)' }}
              >
                <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{label}</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)', fontFamily: "'Geist Mono', monospace" }}>{value}</span>
                  <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>/{max}</span>
                </div>
                <div className="h-1 rounded-full mt-1" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                  <div
                    className="h-1 rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${pct * 100}%`, backgroundColor: mColor }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--color-border)' }} />

      {/* JD input */}
      <div className="space-y-2">
        <p className="text-xs font-semibold" style={{ color: 'var(--color-text-secondary)' }}>
          Target Job Description
        </p>
        <div className="flex gap-2">
          <Textarea
            value={jdInput}
            onChange={e => setJdInput(e.target.value)}
            placeholder="Paste the job description here to see your keyword match…"
            className="h-20 text-xs"
          />
          <Button
            onClick={handleJDSubmit}
            variant="primary"
            className="self-stretch h-auto px-3 text-xs flex-shrink-0 rounded-xl"
          >
            <Zap size={13} />
            Analyze
          </Button>
        </div>
      </div>

      {/* Missing keywords — click to add */}
      {targetJobDescription && atsScore.missingKeywords?.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold" style={{ color: 'var(--color-text-secondary)' }}>
            Missing Keywords
            <span className="ml-1 font-normal" style={{ color: 'var(--color-text-muted)' }}>— click to add to Skills</span>
          </p>
          <div className="flex flex-wrap gap-1.5">
            {atsScore.missingKeywords.map((kw, i) => (
              <button
                key={i}
                onClick={() => addMissingKeyword(kw)}
                className="px-2.5 py-1 text-xs rounded-lg font-medium cursor-pointer transition-all duration-150 hover:opacity-90 active:scale-95"
                style={{
                  backgroundColor: 'var(--color-danger-dim)',
                  color: 'var(--color-danger)',
                  border: '1px solid rgba(239,68,68,0.25)',
                }}
              >
                + {kw}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { summarySchema } from '../../lib/schemas';
import { useCVStore } from '../../store/cvStore';
import { Textarea } from '../ui/Textarea';
import { useEffect } from 'react';

const MIN_CHARS = 50;
const WARN_WORDS = 100;

export function SummaryForm() {
  const { summary, updateSummary } = useCVStore();

  const { register, watch, formState: { errors } } = useForm({
    resolver: zodResolver(summarySchema),
    defaultValues: { summary },
    mode: 'onChange'
  });

  const currentSummary = watch('summary') || '';
  const charCount = currentSummary.length;
  const wordCount = currentSummary.split(/\s+/).filter(w => w.length > 0).length;

  const charStatus = charCount === 0
    ? 'empty'
    : charCount >= MIN_CHARS ? 'good' : 'warn';

  const charColor = charStatus === 'good'
    ? 'var(--color-success)'
    : charStatus === 'warn' ? 'var(--color-warning)' : 'var(--color-text-muted)';

  useEffect(() => {
    const subscription = watch((value) => {
      updateSummary(value.summary || '');
    });
    return () => subscription.unsubscribe();
  }, [watch, updateSummary]);

  return (
    <div className="space-y-3">
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <label className="block text-xs font-semibold" style={{ color: 'var(--color-text-secondary)' }}>
            Professional Summary
          </label>
          <div className="flex items-center gap-3">
            <span className="text-xs" style={{ color: wordCount > WARN_WORDS ? 'var(--color-warning)' : 'var(--color-text-muted)' }}>
              {wordCount} words
            </span>
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full transition-colors duration-300"
              style={{
                color: charColor,
                background: charStatus === 'good' ? 'rgba(16,185,129,0.1)' : charStatus === 'warn' ? 'rgba(245,158,11,0.1)' : 'var(--color-bg-surface-2)',
                border: `1px solid ${charStatus === 'good' ? 'rgba(16,185,129,0.25)' : charStatus === 'warn' ? 'rgba(245,158,11,0.25)' : 'transparent'}`,
              }}
            >
              {charCount} / {MIN_CHARS}+ chars
            </span>
          </div>
        </div>

        <Textarea
          {...register('summary')}
          placeholder="Experienced software engineer with 5+ years building scalable web applications. Led a team of 4 to deliver a 30% improvement in platform performance..."
          className="min-h-[120px]"
          error={errors.summary?.message}
        />

        {charStatus === 'warn' && charCount > 0 && (
          <p className="text-xs mt-1.5" style={{ color: 'var(--color-warning)' }}>
            ⚡ Needs {MIN_CHARS - charCount} more characters to qualify for ATS scoring.
          </p>
        )}
        {charStatus === 'good' && (
          <p className="text-xs mt-1.5" style={{ color: 'var(--color-success)' }}>
            ✓ Summary meets ATS length requirements.
          </p>
        )}

        <p className="text-xs mt-2" style={{ color: 'var(--color-text-muted)' }}>
          Keep it to 2–3 lines. Focus on quantifiable achievements and relevant keywords from the job description.
        </p>
      </div>
    </div>
  );
}

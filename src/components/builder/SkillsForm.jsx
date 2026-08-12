import { useState } from 'react';
import { useCVStore } from '../../store/cvStore';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { X } from 'lucide-react';

function SkillInput({ label, skills, onAdd, onRemove, placeholder }) {
  const [input, setInput] = useState('');

  const addSkill = (raw) => {
    const skill = raw.trim();
    if (skill && !skills.includes(skill)) onAdd(skill);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkill(input.replace(/,$/, ''));
      setInput('');
    } else if (e.key === 'Backspace' && input === '' && skills.length > 0) {
      onRemove(skills[skills.length - 1]);
    }
  };

  const handleChange = (e) => {
    const val = e.target.value;
    // Auto-add on comma
    if (val.endsWith(',')) {
      addSkill(val.slice(0, -1));
      setInput('');
    } else {
      setInput(val);
    }
  };

  return (
    <div>
      <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
        {label}
      </label>
      <div
        className="min-h-[42px] flex flex-wrap gap-1.5 items-center px-3 py-2 rounded-xl transition-all duration-200"
        style={{
          background: 'var(--color-bg-surface-2)',
          border: '1px solid var(--color-border)',
        }}
        onClick={() => document.getElementById(`skill-input-${label}`)?.focus()}
      >
        {skills.map(skill => (
          <Badge key={skill} variant="primary" onRemove={() => onRemove(skill)}>
            {skill}
          </Badge>
        ))}
        <input
          id={`skill-input-${label}`}
          value={input}
          onChange={handleChange}
          onKeyDown={handleKey}
          placeholder={skills.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[140px] bg-transparent outline-none text-sm"
          style={{ color: 'var(--color-text-primary)' }}
        />
      </div>
      <p className="text-xs mt-1.5" style={{ color: 'var(--color-text-muted)' }}>
        Press <kbd className="px-1 py-0.5 rounded text-xs font-mono" style={{ background: 'var(--color-bg-hover)', border: '1px solid var(--color-border)', color: 'var(--color-text-secondary)' }}>Enter</kbd>{' '}
        or <kbd className="px-1 py-0.5 rounded text-xs font-mono" style={{ background: 'var(--color-bg-hover)', border: '1px solid var(--color-border)', color: 'var(--color-text-secondary)' }}>,</kbd>{' '}
        to add · <kbd className="px-1 py-0.5 rounded text-xs font-mono" style={{ background: 'var(--color-bg-hover)', border: '1px solid var(--color-border)', color: 'var(--color-text-secondary)' }}>⌫</kbd>{' '}
        to remove last
      </p>
    </div>
  );
}

export function SkillsForm() {
  const { skills, updateSkills } = useCVStore();

  return (
    <div className="space-y-5">
      <SkillInput
        label="Hard Skills — Tools, Languages, Frameworks"
        skills={skills.hard}
        placeholder="e.g. React.js, Python, AWS, SQL…"
        onAdd={(s) => updateSkills({ ...skills, hard: [...skills.hard, s] })}
        onRemove={(s) => updateSkills({ ...skills, hard: skills.hard.filter(x => x !== s) })}
      />
      <SkillInput
        label="Soft Skills — Leadership, Communication"
        skills={skills.soft}
        placeholder="e.g. Agile, Team Leadership, Mentoring…"
        onAdd={(s) => updateSkills({ ...skills, soft: [...skills.soft, s] })}
        onRemove={(s) => updateSkills({ ...skills, soft: skills.soft.filter(x => x !== s) })}
      />
    </div>
  );
}

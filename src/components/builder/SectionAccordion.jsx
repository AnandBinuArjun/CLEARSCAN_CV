import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';
import { PersonalInfoForm } from './PersonalInfoForm';
import { SummaryForm } from './SummaryForm';
import { ExperienceForm } from './ExperienceForm';
import { EducationForm } from './EducationForm';
import { SkillsForm } from './SkillsForm';
import { CertificationsForm } from './CertificationsForm';
import { ProjectsForm } from './ProjectsForm';

import { User, FileText, Briefcase, GraduationCap, Zap, Rocket, Award } from 'lucide-react';

const sections = [
  { id: 'personal',        title: 'Personal Information',     icon: <User size={18} />,          component: PersonalInfoForm },
  { id: 'summary',         title: 'Professional Summary',     icon: <FileText size={18} />,      component: SummaryForm },
  { id: 'experience',      title: 'Work Experience',          icon: <Briefcase size={18} />,     component: ExperienceForm },
  { id: 'education',       title: 'Education',                icon: <GraduationCap size={18} />, component: EducationForm },
  { id: 'skills',          title: 'Skills',                   icon: <Zap size={18} />,           component: SkillsForm },
  { id: 'projects',        title: 'Projects',                 icon: <Rocket size={18} />,        component: ProjectsForm },
  { id: 'certifications',  title: 'Certifications',           icon: <Award size={18} />,         component: CertificationsForm },
];

export function SectionAccordion() {
  const [openSection, setOpenSection] = useState('personal');
  const toggle = (id) => setOpenSection(prev => (prev === id ? null : id));

  return (
    <div className="space-y-2">
      {sections.map(({ id, title, icon, component: Component }) => {
        const isOpen = openSection === id;
        return (
          <div
            key={id}
            className={cn(
              'rounded-xl overflow-hidden transition-all duration-300',
            )}
            style={{
              border: isOpen
                ? '1px solid rgba(124, 58, 237, 0.3)'
                : '1px solid var(--color-border)',
              backgroundColor: isOpen ? 'var(--color-bg-surface)' : 'var(--color-bg-surface)',
              boxShadow: isOpen
                ? '0 0 0 1px rgba(124,58,237,0.1), 0 4px 24px -4px rgba(0,0,0,0.5)'
                : 'none',
            }}
          >
            {/* Header */}
            <button
              onClick={() => toggle(id)}
              className="w-full flex items-center justify-between px-4 py-3.5 text-left focus-visible:outline-none cursor-pointer group transition-all duration-200"
              style={{
                background: isOpen
                  ? 'linear-gradient(135deg, rgba(124,58,237,0.06), rgba(6,182,212,0.03))'
                  : 'transparent',
              }}
              aria-expanded={isOpen}
            >
              <div className="flex items-center gap-3">
                <span
                  className="text-base leading-none flex-shrink-0 transition-all duration-200"
                  style={{ filter: isOpen ? 'none' : 'grayscale(1) opacity(0.5)' }}
                >
                  {icon}
                </span>
                <span
                  className="text-sm font-semibold transition-colors duration-200"
                  style={{
                    color: isOpen ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                    fontWeight: 600,
                  }}
                >
                  {title}
                </span>
              </div>
              <ChevronDown
                size={15}
                strokeWidth={2.5}
                className="flex-shrink-0 transition-transform duration-300"
                style={{
                  transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  color: isOpen ? 'var(--color-accent-hover)' : 'var(--color-text-muted)',
                  filter: isOpen ? 'drop-shadow(0 0 4px var(--color-accent-glow))' : 'none',
                }}
              />
            </button>

            {/* Content */}
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
                  style={{ overflow: 'hidden' }}
                >
                  <div
                    className="px-4 pb-5 pt-1"
                    style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
                  >
                    <div className="pt-4">
                      <Component />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

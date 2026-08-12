const ACTION_VERBS = new Set([
  // Leadership & Management
  'led', 'managed', 'directed', 'oversaw', 'supervised', 'coordinated', 'orchestrated',
  'spearheaded', 'championed', 'facilitated', 'guided', 'mentored', 'coached', 'trained',
  'recruited', 'hired', 'promoted', 'delegated', 'prioritized', 'administered',
  // Building & Creating
  'built', 'developed', 'created', 'designed', 'architected', 'engineered', 'implemented',
  'established', 'launched', 'deployed', 'shipped', 'authored', 'composed', 'produced',
  'constructed', 'assembled', 'fabricated', 'formulated', 'generated', 'initiated',
  'introduced', 'pioneered', 'founded', 'incorporated', 'instituted',
  // Improving & Optimizing
  'optimized', 'improved', 'enhanced', 'upgraded', 'modernized', 'streamlined',
  'transformed', 'revamped', 'restructured', 'refactored', 'accelerated', 'boosted',
  'amplified', 'expanded', 'scaled', 'maximized', 'minimized', 'reduced', 'decreased',
  'cut', 'eliminated', 'automated', 'simplified', 'standardized',
  // Achievement & Delivery
  'achieved', 'delivered', 'executed', 'completed', 'accomplished', 'attained',
  'exceeded', 'surpassed', 'secured', 'won', 'earned', 'generated', 'drove', 'grew',
  // Analysis & Research
  'analyzed', 'researched', 'evaluated', 'assessed', 'audited', 'investigated',
  'identified', 'diagnosed', 'reviewed', 'monitored', 'tracked', 'measured',
  'benchmarked', 'validated', 'tested', 'verified', 'reported',
  // Collaboration & Communication
  'collaborated', 'partnered', 'negotiated', 'presented', 'communicated', 'liaised',
  'interfaced', 'consulted', 'advised', 'supported', 'assisted',
  // Technical
  'integrated', 'migrated', 'configured', 'maintained', 'troubleshot', 'resolved',
  'debugged', 'documented', 'prototyped', 'modeled', 'programmed', 'coded',
  'published', 'released', 'patched', 'upgraded',
]);

import { extractKeywords } from './keywordExtractor.js';

export function calculateATSScore(cvState, jobDescriptionOverride = '') {
  const jobDescription = jobDescriptionOverride || cvState.targetJobDescription || '';
  let score = 0;
  const breakdown = {
    completeness: { score: 0, max: 30, messages: [] },
    bullets:      { score: 0, max: 30, messages: [] },
    keywords:     { score: 0, max: 40, messages: [] }
  };

  const {
    personalInfo, summary, experience, education,
    skills, projects, certifications
  } = cvState;

  // ── 1. Structure & Completeness (30 pts) ─────────────────────────────────
  let completenessScore = 0;

  if (personalInfo.email && personalInfo.phone) {
    completenessScore += 10;
  } else {
    breakdown.completeness.messages.push('Add both email and phone number to contact info.');
  }

  if (summary && summary.length > 50) {
    completenessScore += 5;
  } else {
    breakdown.completeness.messages.push('Add a professional summary (at least 50 characters).');
  }

  if (experience && experience.length > 0) {
    completenessScore += 5;
  } else {
    breakdown.completeness.messages.push('Add at least one work experience entry.');
  }

  if (education && education.length > 0) {
    completenessScore += 5;
  } else {
    breakdown.completeness.messages.push('Add at least one education entry.');
  }

  // Support both {hard, soft} and {technical, soft} shapes
  const hardSkills = skills?.hard ?? skills?.technical ?? [];
  const softSkills = skills?.soft ?? [];
  if (hardSkills.length > 0 || softSkills.length > 0) {
    completenessScore += 5;
  } else {
    breakdown.completeness.messages.push('Add skills to your profile.');
  }

  breakdown.completeness.score = completenessScore;
  score += completenessScore;

  // ── 2. Bullet Point Best Practices (30 pts) ───────────────────────────────
  let bulletsScore = 0;
  let totalBullets = 0;
  let bulletsWithActionVerbs = 0;
  let bulletsWithMetrics = 0;

  if (experience && experience.length > 0) {
    experience.forEach(exp => {
      if (exp.bullets && exp.bullets.length > 0) {
        exp.bullets.forEach(bullet => {
          totalBullets++;
          const firstWord = bullet.trim().split(/\s+/)[0]?.toLowerCase();
          if (firstWord && ACTION_VERBS.has(firstWord)) bulletsWithActionVerbs++;
          if (/\d|%|\$/.test(bullet)) bulletsWithMetrics++;
        });
      }
    });

    if (totalBullets === 0) {
      breakdown.bullets.messages.push('Add bullet points to your work experience.');
    } else {
      const actionVerbRatio = bulletsWithActionVerbs / totalBullets;
      const actionVerbScore = Math.min(15, Math.round(actionVerbRatio * 15));
      bulletsScore += actionVerbScore;
      if (actionVerbRatio < 0.8) {
        breakdown.bullets.messages.push('Start more bullet points with strong action verbs (e.g., Led, Built, Delivered).');
      }

      const metricRatio = bulletsWithMetrics / totalBullets;
      const metricScore = Math.min(15, Math.round((metricRatio / 0.4) * 15));
      bulletsScore += metricScore;
      if (metricRatio < 0.3) {
        breakdown.bullets.messages.push('Quantify your impact — add numbers, percentages, or dollar amounts.');
      }
    }
  } else {
    breakdown.bullets.messages.push('Add work experience to evaluate bullet points.');
  }

  breakdown.bullets.score = bulletsScore;
  score += bulletsScore;

  // ── 3. Keyword Match (40 pts) ─────────────────────────────────────────────
  let keywordScore = 0;
  let missingKeywords = [];

  if (!jobDescription || jobDescription.trim().length < 50) {
    // NO JD provided → 0 points, not 40
    breakdown.keywords.messages.push('Paste a target job description to get keyword matching scores.');
    keywordScore = 0;
  } else {
    const normalizedJd = jobDescription.replace(/[,/#!$%^&*;:{}=\-_`~()]/g, ' ');
    const jdWords = extractKeywords(normalizedJd);

    const wordFreq = {};
    jdWords.forEach(w => { wordFreq[w] = (wordFreq[w] || 0) + 1; });

    const topKeywords = Object.entries(wordFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
      .map(([word]) => word);

    if (topKeywords.length > 0) {
      let cvText = (summary || '') + ' ';
      experience.forEach(exp => {
        cvText += `${exp.title || ''} ${exp.company || ''} `;
        if (exp.bullets) cvText += exp.bullets.join(' ') + ' ';
      });
      projects?.forEach(proj => {
        cvText += `${proj.name || ''} ${proj.techStack || ''} ${proj.description || ''} `;
      });
      certifications?.forEach(cert => { cvText += `${cert.name || ''} `; });
      cvText += [...hardSkills, ...softSkills].join(' ');

      const normalizedCv = cvText.replace(/[,/#!$%^&*;:{}=\-_`~()]/g, ' ');
      const cvWords = new Set(extractKeywords(normalizedCv));

      let matchedCount = 0;
      topKeywords.forEach(kw => {
        if (cvWords.has(kw)) {
          matchedCount++;
        } else {
          missingKeywords.push(kw);
        }
      });

      const matchRatio = matchedCount / topKeywords.length;
      keywordScore = Math.round(matchRatio * 40);

      if (matchRatio < 0.7) {
        breakdown.keywords.messages.push('Your CV is missing important keywords from the job description.');
      }
    } else {
      keywordScore = 40;
    }
  }

  breakdown.keywords.score = keywordScore;
  score += keywordScore;

  return { total: score, breakdown, missingKeywords };
}

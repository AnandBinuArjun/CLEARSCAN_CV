import { calculateATSScore } from './src/lib/atsScoring.js';

const mockCvState = {
  personalInfo: { email: 'a@a.com', phone: '123' },
  summary: 'I am a software engineer with 10 years of experience.',
  experience: [
    { title: 'Engineer', company: 'Meta', bullets: ['Built a cool thing'] }
  ],
  education: [ { degree: 'BS' } ],
  skills: { hard: ['React.js', 'TypeScript', 'Tailwind CSS'], soft: [] },
  projects: [
    { name: 'ATS Builder', techStack: 'React, Tailwind CSS, TypeScript', description: 'Built an app' }
  ],
  certifications: []
};

const jd = 'Looking for a Senior Software Engineer with strong experience in React, TypeScript, and Tailwind CSS. Must have led teams and improved performance metrics by 20% or more.';

const result = calculateATSScore(mockCvState, jd);
console.log(JSON.stringify(result, null, 2));

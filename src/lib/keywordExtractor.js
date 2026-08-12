// A very basic curated list of common skills for MVP
const commonSkills = new Set([
  'react', 'javascript', 'typescript', 'node.js', 'python', 'java', 'c++', 'sql', 'nosql', 'mongodb', 'postgresql',
  'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'ci/cd', 'git', 'agile', 'scrum', 'html', 'css', 'tailwind',
  'leadership', 'communication', 'management', 'project management', 'data analysis', 'machine learning',
  'api', 'rest', 'graphql', 'redux', 'zustand', 'vue', 'angular', 'spring boot', 'django', 'flask', 'express'
]);

export function extractKeywords(text) {
  if (!text) return [];
  
  // Basic tokenization: lowercase and extract words
  const words = text.toLowerCase().match(/\b[\w.#+-]+\b/g) || [];
  
  // Filter against our curated skills set
  const extracted = new Set();
  words.forEach(word => {
    if (commonSkills.has(word)) {
      extracted.add(word);
    }
  });
  
  // Basic bi-gram extraction for things like "project management"
  for (let i = 0; i < words.length - 1; i++) {
    const bigram = `${words[i]} ${words[i+1]}`;
    if (commonSkills.has(bigram)) {
      extracted.add(bigram);
    }
  }

  return Array.from(extracted);
}

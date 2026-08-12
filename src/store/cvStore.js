import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const initialCVState = {
  personalInfo: {
    fullName: '',
    jobTitle: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    portfolio: ''
  },
  summary: '',
  experience: [],
  education: [],
  skills: { hard: [], soft: [] },
  certifications: [],
  projects: [],
  targetJobDescription: '',
  atsScore: { total: 0, breakdown: {}, missingKeywords: [] },
  activeTemplate: 'classic'
};

export const useCVStore = create(
  persist(
    (set, get) => ({
      ...initialCVState,
      
      updatePersonalInfo: (data) => set({ personalInfo: data }),
      
      updateSummary: (summary) => set({ summary }),
      
      addExperience: (exp) => set((state) => ({ 
        experience: [...state.experience, { ...exp, id: crypto.randomUUID() }] 
      })),
      
      updateExperience: (id, exp) => set((state) => ({
        experience: state.experience.map(e => e.id === id ? { ...e, ...exp } : e)
      })),
      
      removeExperience: (id) => set((state) => ({
        experience: state.experience.filter(e => e.id !== id)
      })),
      
      addEducation: (edu) => set((state) => ({
        education: [...state.education, { ...edu, id: crypto.randomUUID() }]
      })),
      
      updateEducation: (id, edu) => set((state) => ({
        education: state.education.map(e => e.id === id ? { ...e, ...edu } : e)
      })),
      
      removeEducation: (id) => set((state) => ({
        education: state.education.filter(e => e.id !== id)
      })),
      
      updateSkills: (skills) => set({ skills }),
      
      addCertification: (cert) => set((state) => ({
        certifications: [...state.certifications, { ...cert, id: crypto.randomUUID() }]
      })),
      
      updateCertification: (id, cert) => set((state) => ({
        certifications: state.certifications.map(c => c.id === id ? { ...c, ...cert } : c)
      })),
      
      removeCertification: (id) => set((state) => ({
        certifications: state.certifications.filter(c => c.id !== id)
      })),
      
      addProject: (proj) => set((state) => ({
        projects: [...state.projects, { ...proj, id: crypto.randomUUID() }]
      })),
      
      updateProject: (id, proj) => set((state) => ({
        projects: state.projects.map(p => p.id === id ? { ...p, ...proj } : p)
      })),
      
      removeProject: (id) => set((state) => ({
        projects: state.projects.filter(p => p.id !== id)
      })),
      
      setTargetJobDescription: (jd) => set({ targetJobDescription: jd }),
      
      setAtsScore: (score) => set({ atsScore: score }),
      
      setActiveTemplate: (templateId) => set({ activeTemplate: templateId }),
      
      resetCV: () => set(initialCVState)
    }),
    {
      name: 'cv-builder-storage',
      // In a real app with multiple CVs, we would scope this or use a separate multi-cv store.
      // For MVP Phase 1-6, this handles the single active draft.
    }
  )
);

import { z } from 'zod';

export const personalInfoSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  jobTitle: z.string().optional(),
  email: z.string().email('Invalid email address').or(z.literal('')),
  phone: z.string().min(5, "Phone number is required"),
  location: z.string().min(2, "Location is required"),
  linkedin: z.string().url("Must be a valid URL").optional().or(z.literal('')),
  portfolio: z.string().url("Must be a valid URL").optional().or(z.literal('')),
});

export const summarySchema = z.object({
  summary: z.string().max(500, "Summary should be concise (max 500 characters)"),
});

export const experienceSchema = z.object({
  id: z.string(),
  title: z.string().min(2, "Job title is required"),
  company: z.string().min(2, "Company name is required"),
  location: z.string().optional(),
  startDate: z.string().min(2, "Start date is required"),
  endDate: z.string().optional(),
  current: z.boolean().default(false),
  bullets: z.array(z.string()),
});

export const educationSchema = z.object({
  id: z.string(),
  degree: z.string().min(2, "Degree is required"),
  institution: z.string().min(2, "Institution is required"),
  location: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().min(2, "End date/Graduation is required"),
  gpa: z.string().optional(),
});

export const certificationSchema = z.object({
  id: z.string(),
  name: z.string().min(2, "Certification name is required"),
  issuer: z.string().min(2, "Issuer is required"),
  date: z.string().optional(),
});

export const projectSchema = z.object({
  id: z.string(),
  name: z.string().min(2, "Project name is required"),
  description: z.string().min(10, "Description is required"),
  techStack: z.string().optional(),
  link: z.string().url("Must be a valid URL").optional().or(z.literal('')),
});

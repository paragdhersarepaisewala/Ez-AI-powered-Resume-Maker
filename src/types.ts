export enum TemplateType {
  BASIC = 'BASIC',
  ATS = 'ATS',
  DESIGNER = 'DESIGNER',
  GLASSMORPHISM = 'GLASSMORPHISM'
}

export interface Education {
  institution: string;
  degree: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Skill {
  name: string;
  level: number; // 1-5
}

export interface CustomSection {
  id: string;
  title: string;
  content: string;
  alignment?: 'left' | 'right';
}

export interface SectionConfig {
  id: string;
  alignment: 'left' | 'right';
  order: number;
}

export interface ResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    age: string;
    designation: string;
    contactNo: string;
    address: string;
    profileImage?: string;
  };
  aiContent: {
    summary: string;
    education: Education[];
    experience: Experience[];
    skills: Skill[];
    hobbies: string[];
    goals: string;
    customSections: CustomSection[];
  };
  sectionConfig?: Record<string, SectionConfig>;
}

export interface ResumeVersion {
  id: string;
  name: string;
  data: ResumeData;
  lastModified: number;
}

export interface TemplateProps {
  data: ResumeData;
  onChange?: (data: ResumeData) => void;
}

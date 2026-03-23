import React, { useState, useEffect, useRef } from 'react';
import { ResumeData, CustomSection } from '../types';
import { structureResumeData } from '../services/gemini';
import { saveImage, loadImage, deleteImage } from '../services/db';
import {
  Sparkles, Loader2, User, Briefcase, Trash2, Plus, ChevronDown, ChevronUp, Layers,
  Target
} from 'lucide-react';

interface ResumeFormProps {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
  activeTemplate: string;
}

// Image key per version is stored as versionId in IndexedDB
const IMG_KEY_PREFIX = 'profile_img_';

export const ResumeForm: React.FC<ResumeFormProps> = ({ data, onChange, activeTemplate }) => {
  const [unstructuredText, setUnstructuredText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [showJobDesc, setShowJobDesc] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const imgKeyRef = useRef<string>('');

  // Load image preview from IndexedDB when versionId changes
  useEffect(() => {
    const versionId = data.personalInfo.fullName + '_' + (data.personalInfo.email || 'default');
    imgKeyRef.current = IMG_KEY_PREFIX + versionId;
    loadImage(imgKeyRef.current).then((url) => {
      if (url) setPreviewUrl(url);
    });
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange({
      ...data,
      personalInfo: { ...data.personalInfo, [name]: value },
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Revoke old URL
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    // Save blob to IndexedDB
    await saveImage(imgKeyRef.current, file);
    // Store a sentinel in data so templates know an image exists
    onChange({
      ...data,
      personalInfo: { ...data.personalInfo, profileImage: imgKeyRef.current },
    });
  };

  const removeImage = async () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    await deleteImage(imgKeyRef.current);
    onChange({
      ...data,
      personalInfo: { ...data.personalInfo, profileImage: undefined },
    });
  };

  const handleAiMagic = async () => {
    if (!unstructuredText.trim()) return;
    setIsAiLoading(true);
    try {
      const structured = await structureResumeData(unstructuredText, jobDescription || undefined);
      onChange({
        ...data,
        aiContent: {
          ...data.aiContent,
          ...structured,
          skills: structured.skills || data.aiContent.skills,
          customSections: structured.customSections || data.aiContent.customSections,
        } as ResumeData['aiContent'],
      });
    } catch (error) {
      console.error('Error in AI Magic:', error);
    } finally {
      setIsAiLoading(false);
    }
  };

  // ── Custom Sections ──────────────────────────────────────────────
  const addCustomSection = () => {
    const newSection: CustomSection = {
      id: Math.random().toString(36).substr(2, 9),
      title: 'New Section',
      content: '',
    };
    onChange({
      ...data,
      aiContent: { ...data.aiContent, customSections: [...(data.aiContent.customSections || []), newSection] },
    });
  };

  const updateCustomSection = (id: string, field: keyof CustomSection, value: string) => {
    onChange({
      ...data,
      aiContent: {
        ...data.aiContent,
        customSections: data.aiContent.customSections.map((s) =>
          s.id === id ? { ...s, [field]: value } : s
        ),
      },
    });
  };

  const removeCustomSection = (id: string) => {
    onChange({
      ...data,
      aiContent: {
        ...data.aiContent,
        customSections: data.aiContent.customSections.filter((s) => s.id !== id),
      },
    });
  };

  // ── Section Alignment ────────────────────────────────────────────
  const updateSectionAlignment = (sectionId: string, alignment: 'left' | 'right') => {
    onChange({
      ...data,
      sectionConfig: {
        ...(data.sectionConfig || {}),
        [sectionId]: { id: sectionId, alignment, order: data.sectionConfig?.[sectionId]?.order || 0 },
      },
    });
  };

  // ── Experience ───────────────────────────────────────────────────
  const updateExperience = (index: number, field: string, value: string) => {
    const newExperience = [...data.aiContent.experience];
    newExperience[index] = { ...newExperience[index], [field]: value };
    onChange({ ...data, aiContent: { ...data.aiContent, experience: newExperience } });
  };

  const addExperience = () => {
    onChange({
      ...data,
      aiContent: {
        ...data.aiContent,
        experience: [
          ...data.aiContent.experience,
          { company: '', position: '', startDate: '', endDate: '', description: '' },
        ],
      },
    });
  };

  const removeExperience = (index: number) => {
    onChange({
      ...data,
      aiContent: {
        ...data.aiContent,
        experience: data.aiContent.experience.filter((_, i) => i !== index),
      },
    });
  };

  // ── Education ────────────────────────────────────────────────────
  const updateEducation = (index: number, field: string, value: string) => {
    const newEducation = [...data.aiContent.education];
    newEducation[index] = { ...newEducation[index], [field]: value };
    onChange({ ...data, aiContent: { ...data.aiContent, education: newEducation } });
  };

  const addEducation = () => {
    onChange({
      ...data,
      aiContent: {
        ...data.aiContent,
        education: [
          ...data.aiContent.education,
          { institution: '', degree: '', startDate: '', endDate: '', description: '' },
        ],
      },
    });
  };

  const removeEducation = (index: number) => {
    onChange({
      ...data,
      aiContent: {
        ...data.aiContent,
        education: data.aiContent.education.filter((_, i) => i !== index),
      },
    });
  };

  // ── Skills ───────────────────────────────────────────────────────
  const updateSkill = (index: number, field: string, value: string) => {
    const newSkills = [...data.aiContent.skills];
    newSkills[index] = { ...newSkills[index], [field]: value };
    onChange({ ...data, aiContent: { ...data.aiContent, skills: newSkills } });
  };

  const updateSkillLevel = (index: number, level: number) => {
    const newSkills = [...data.aiContent.skills];
    newSkills[index] = { ...newSkills[index], level };
    onChange({ ...data, aiContent: { ...data.aiContent, skills: newSkills } });
  };

  const addSkill = () => {
    onChange({
      ...data,
      aiContent: { ...data.aiContent, skills: [...data.aiContent.skills, { name: '', level: 3 }] },
    });
  };

  const removeSkill = (index: number) => {
    onChange({
      ...data,
      aiContent: { ...data.aiContent, skills: data.aiContent.skills.filter((_, i) => i !== index) },
    });
  };

  const clearAllSkills = () => {
    onChange({ ...data, aiContent: { ...data.aiContent, skills: [] } });
  };

  // ── Hobbies ──────────────────────────────────────────────────────
  const updateHobby = (index: number, value: string) => {
    const newHobbies = [...data.aiContent.hobbies];
    newHobbies[index] = value;
    onChange({ ...data, aiContent: { ...data.aiContent, hobbies: newHobbies } });
  };

  // ── Alignment Toggle (non-ATS only) ──────────────────────────────
  const AlignmentToggle = ({ sectionId }: { sectionId: string }) => {
    if (activeTemplate === 'ATS') return null;
    const alignment = data.sectionConfig?.[sectionId]?.alignment || 'right';
    return (
      <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg gap-1 transition-colors">
        {(['left', 'right'] as const).map((dir) => (
          <button
            key={dir}
            onClick={() => updateSectionAlignment(sectionId, dir)}
            className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${alignment === dir ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}
          >
            {dir.toUpperCase()}
          </button>
        ))}
      </div>
    );
  };

  const SectionHeader = ({
    title,
    sectionId,
    onAdd,
    onRemoveAll,
    removeAllLabel = 'Remove All',
  }: {
    title: string;
    sectionId?: string;
    onAdd?: () => void;
    onRemoveAll?: () => void;
    removeAllLabel?: string;
  }) => (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">{title}</h2>
      <div className="flex items-center gap-2">
        {sectionId && <AlignmentToggle sectionId={sectionId} />}
        {onRemoveAll && (
          <button
            onClick={onRemoveAll}
            className="p-1.5 text-xs font-semibold text-red-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all flex items-center gap-1"
            title={removeAllLabel}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{removeAllLabel}</span>
          </button>
        )}
        {onAdd && (
          <button
            onClick={onAdd}
            className="p-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-all"
            title={`Add ${title}`}
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-8 pb-20">
      {/* ── Personal Info ────────────────────────────────────────────── */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-6 shadow-sm dark:shadow-none border border-slate-100 dark:border-slate-800 transition-colors duration-200">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
          <User className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
          Personal Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: 'Full Name', name: 'fullName', placeholder: 'John Doe', type: 'text' },
            { label: 'Email', name: 'email', placeholder: 'john@example.com', type: 'email' },
            { label: 'Designation', name: 'designation', placeholder: 'Senior Web Developer', type: 'text' },
            { label: 'Contact No', name: 'contactNo', placeholder: '+1 234 567 890', type: 'text' },
          ].map((field) => (
            <div key={field.name} className="space-y-1">
              <label className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase ml-1">
                {field.label}
              </label>
              <input
                type={field.type}
                name={field.name}
                value={(data.personalInfo as Record<string, string>)[field.name]}
                onChange={handlePersonalInfoChange}
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm text-slate-900 dark:text-white"
                placeholder={field.placeholder}
              />
            </div>
          ))}
          <div className="md:col-span-2 space-y-1">
            <label className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase ml-1">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={data.personalInfo.address}
              onChange={handlePersonalInfoChange}
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm text-slate-900 dark:text-white"
              placeholder="New York, USA"
            />
          </div>
          {/* Profile Image */}
          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase ml-1">
              Profile Image
            </label>
            {previewUrl && (
              <div className="flex items-center gap-3 mb-2">
                <img src={previewUrl} alt="Profile" className="w-14 h-14 rounded-full object-cover border-2 border-indigo-300 dark:border-indigo-700" />
                <button
                  onClick={removeImage}
                  className="text-xs text-red-500 hover:text-red-700 font-semibold flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" /> Remove
                </button>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:bg-indigo-50 dark:file:bg-indigo-500/10 file:text-indigo-700 dark:file:text-indigo-400 hover:file:bg-indigo-100 dark:hover:file:bg-indigo-500/20 transition-all text-slate-600 dark:text-slate-300"
            />
            <p className="text-[10px] text-slate-400 dark:text-slate-500 ml-1">
              Stored locally in your browser — no upload size limit.
            </p>
          </div>
        </div>
      </section>

      {/* ── AI Content Builder ────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-4 sm:p-6 shadow-sm dark:shadow-none border border-indigo-100 dark:border-indigo-800/30 transition-colors duration-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            AI Content Builder
          </h2>
        </div>
        <textarea
          value={unstructuredText}
          onChange={(e) => setUnstructuredText(e.target.value)}
          placeholder="Paste your raw info here... AI will structure it into a professional resume."
          className="w-full h-32 p-4 bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm leading-relaxed text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
        />

        {/* Job Description (optional) */}
        <div className="mt-3">
          <button
            onClick={() => setShowJobDesc(!showJobDesc)}
            className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200 transition-colors"
          >
            <Target className="w-3.5 h-3.5" />
            {showJobDesc ? 'Hide' : 'Add'} Job Description (optional – for ATS targeting)
            {showJobDesc ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
          {showJobDesc && (
            <div className="mt-3 space-y-2">
              <p className="text-[11px] text-indigo-700 dark:text-indigo-400 font-medium leading-relaxed bg-indigo-50 dark:bg-indigo-900/30 rounded-xl p-3 border border-indigo-100 dark:border-indigo-800/50">
                💡 Paste the job posting here. AI will mirror its exact keywords in your resume summary, skills, and experience — boosting your ATS score significantly.
              </p>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the full job description here..."
                className="w-full h-28 p-4 bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm leading-relaxed text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
            </div>
          )}
        </div>

        <button
          onClick={handleAiMagic}
          disabled={isAiLoading || !unstructuredText.trim()}
          className="mt-4 w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-200 dark:shadow-none active:scale-[0.98] text-sm"
        >
          {isAiLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
          {isAiLoading ? 'Generating...' : jobDescription.trim() ? 'Generate Job-Targeted Resume' : 'Generate Structured Content'}
        </button>
      </section>

      {/* ── Summary ─────────────────────────────────────────────────── */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-6 shadow-sm dark:shadow-none border border-slate-100 dark:border-slate-800 transition-colors duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">Summary</h2>
          <AlignmentToggle sectionId="summary" />
        </div>
        <textarea
          value={data.aiContent.summary}
          onChange={(e) => onChange({ ...data, aiContent: { ...data.aiContent, summary: e.target.value } })}
          className="w-full h-32 p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
          placeholder="Professional summary..."
        />
      </section>

      {/* ── Experience ───────────────────────────────────────────────── */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-6 shadow-sm dark:shadow-none border border-slate-100 dark:border-slate-800 transition-colors duration-200">
        <SectionHeader
          title="Experience"
          sectionId="experience"
          onAdd={addExperience}
          onRemoveAll={data.aiContent.experience.length > 0 ? () => onChange({ ...data, aiContent: { ...data.aiContent, experience: [] } }) : undefined}
          removeAllLabel="Remove All"
        />
        <div className="space-y-6">
          {data.aiContent.experience.map((exp, i) => (
            <div key={i} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50 space-y-3 transition-colors relative group">
              <button
                onClick={() => removeExperience(i)}
                className="absolute top-3 right-3 p-1.5 text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                title="Remove experience"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <input
                type="text"
                value={exp.position}
                onChange={(e) => updateExperience(i, 'position', e.target.value)}
                className="w-full bg-transparent border-b border-slate-200 dark:border-slate-700 py-1 font-bold text-slate-800 dark:text-slate-200 focus:border-indigo-500 outline-none text-sm placeholder:text-slate-400 dark:placeholder:text-slate-600"
                placeholder="Position"
              />
              <input
                type="text"
                value={exp.company}
                onChange={(e) => updateExperience(i, 'company', e.target.value)}
                className="w-full bg-transparent border-b border-slate-200 dark:border-slate-700 py-1 text-slate-600 dark:text-slate-300 focus:border-indigo-500 outline-none text-sm placeholder:text-slate-400 dark:placeholder:text-slate-600"
                placeholder="Company"
              />
              <div className="grid grid-cols-2 gap-2">
                <input type="text" value={exp.startDate} onChange={(e) => updateExperience(i, 'startDate', e.target.value)} className="w-full bg-transparent border-b border-slate-200 dark:border-slate-700 py-1 text-xs text-slate-500 dark:text-slate-400 focus:border-indigo-500 outline-none placeholder:text-slate-400 dark:placeholder:text-slate-600" placeholder="Start Date" />
                <input type="text" value={exp.endDate} onChange={(e) => updateExperience(i, 'endDate', e.target.value)} className="w-full bg-transparent border-b border-slate-200 dark:border-slate-700 py-1 text-xs text-slate-500 dark:text-slate-400 focus:border-indigo-500 outline-none placeholder:text-slate-400 dark:placeholder:text-slate-600" placeholder="End Date / Present" />
              </div>
              <textarea
                value={exp.description}
                onChange={(e) => updateExperience(i, 'description', e.target.value)}
                className="w-full h-24 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-xs focus:ring-2 focus:ring-indigo-500 outline-none text-slate-700 dark:text-slate-300 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                placeholder="Describe your responsibilities and achievements..."
              />
            </div>
          ))}
        </div>
      </section>

      {/* ── Education ────────────────────────────────────────────────── */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-6 shadow-sm dark:shadow-none border border-slate-100 dark:border-slate-800 transition-colors duration-200">
        <SectionHeader
          title="Education"
          sectionId="education"
          onAdd={addEducation}
          onRemoveAll={data.aiContent.education.length > 0 ? () => onChange({ ...data, aiContent: { ...data.aiContent, education: [] } }) : undefined}
          removeAllLabel="Remove All"
        />
        <div className="space-y-6">
          {data.aiContent.education.map((edu, i) => (
            <div key={i} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50 space-y-3 transition-colors relative group">
              <button
                onClick={() => removeEducation(i)}
                className="absolute top-3 right-3 p-1.5 text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                title="Remove education"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <input type="text" value={edu.degree} onChange={(e) => updateEducation(i, 'degree', e.target.value)} className="w-full bg-transparent border-b border-slate-200 dark:border-slate-700 py-1 font-bold text-slate-800 dark:text-slate-200 focus:border-indigo-500 outline-none text-sm placeholder:text-slate-400 dark:placeholder:text-slate-600" placeholder="Degree / Certificate" />
              <input type="text" value={edu.institution} onChange={(e) => updateEducation(i, 'institution', e.target.value)} className="w-full bg-transparent border-b border-slate-200 dark:border-slate-700 py-1 text-slate-600 dark:text-slate-300 focus:border-indigo-500 outline-none text-sm placeholder:text-slate-400 dark:placeholder:text-slate-600" placeholder="Institution" />
              <div className="grid grid-cols-2 gap-2">
                <input type="text" value={edu.startDate} onChange={(e) => updateEducation(i, 'startDate', e.target.value)} className="w-full bg-transparent border-b border-slate-200 dark:border-slate-700 py-1 text-xs text-slate-500 dark:text-slate-400 focus:border-indigo-500 outline-none placeholder:text-slate-400 dark:placeholder:text-slate-600" placeholder="Start Date" />
                <input type="text" value={edu.endDate} onChange={(e) => updateEducation(i, 'endDate', e.target.value)} className="w-full bg-transparent border-b border-slate-200 dark:border-slate-700 py-1 text-xs text-slate-500 dark:text-slate-400 focus:border-indigo-500 outline-none placeholder:text-slate-400 dark:placeholder:text-slate-600" placeholder="End Date" />
              </div>
              <input type="text" value={edu.description} onChange={(e) => updateEducation(i, 'description', e.target.value)} className="w-full bg-transparent border-b border-slate-200 dark:border-slate-700 py-1 text-xs text-slate-500 dark:text-slate-400 focus:border-indigo-500 outline-none placeholder:text-slate-400 dark:placeholder:text-slate-600" placeholder="GPA / Honors / Notes (optional)" />
            </div>
          ))}
        </div>
      </section>

      {/* ── Skills ───────────────────────────────────────────────────── */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-6 shadow-sm dark:shadow-none border border-slate-100 dark:border-slate-800 transition-colors duration-200">
        <SectionHeader
          title="Skills"
          sectionId="skills"
          onAdd={addSkill}
          onRemoveAll={data.aiContent.skills.length > 0 ? clearAllSkills : undefined}
          removeAllLabel="Remove All"
        />
        <div className="space-y-3">
          {data.aiContent.skills.map((skill, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50 group transition-colors">
              <input
                type="text"
                value={skill.name}
                onChange={(e) => updateSkill(index, 'name', e.target.value)}
                className="flex-1 bg-transparent border-b border-slate-200 dark:border-slate-700 py-1 font-bold text-slate-700 dark:text-slate-300 focus:border-indigo-500 outline-none text-sm placeholder:text-slate-400 dark:placeholder:text-slate-600"
                placeholder="Skill Name"
              />
              <div className="flex gap-1 shrink-0">
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    onClick={() => updateSkillLevel(index, level)}
                    className={`w-6 h-6 rounded-md flex items-center justify-center transition-all text-[10px] font-bold ${skill.level >= level ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 hover:bg-slate-300 dark:hover:bg-slate-600'}`}
                  >
                    {level}
                  </button>
                ))}
              </div>
              <button
                onClick={() => removeSkill(index)}
                className="p-1.5 text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                title="Remove skill"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          {data.aiContent.skills.length === 0 && (
            <p className="text-sm text-slate-400 dark:text-slate-500 italic text-center py-4">
              No skills added yet. Click + to add one or use AI Builder.
            </p>
          )}
        </div>
      </section>

      {/* ── Custom Sections ──────────────────────────────────────────── */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-6 shadow-sm dark:shadow-none border border-slate-100 dark:border-slate-800 transition-colors duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-500" />
            Custom Sections
          </h2>
          <button
            onClick={addCustomSection}
            className="p-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-6">
          {data.aiContent.customSections?.map((section) => (
            <div key={section.id} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700/50 relative group space-y-4 transition-colors">
              <div className="flex justify-between items-center">
                <AlignmentToggle sectionId={section.id} />
                <button
                  onClick={() => removeCustomSection(section.id)}
                  className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3">
                <input
                  type="text"
                  value={section.title}
                  onChange={(e) => updateCustomSection(section.id, 'title', e.target.value)}
                  className="w-full bg-transparent border-b border-slate-200 dark:border-slate-700 py-1 font-bold text-slate-800 dark:text-slate-200 focus:border-indigo-500 outline-none transition-all text-sm placeholder:text-slate-400 dark:placeholder:text-slate-600"
                  placeholder="Section Title"
                />
                <textarea
                  value={section.content}
                  onChange={(e) => updateCustomSection(section.id, 'content', e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all h-24 text-slate-700 dark:text-slate-300 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  placeholder="Section content..."
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Hobbies ─────────────────────────────────────────────────── */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-6 shadow-sm dark:shadow-none border border-slate-100 dark:border-slate-800 transition-colors duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">Hobbies</h2>
          <div className="flex items-center gap-2">
            <AlignmentToggle sectionId="hobbies" />
            {data.aiContent.hobbies.length > 0 && (
              <button
                onClick={() => onChange({ ...data, aiContent: { ...data.aiContent, hobbies: [] } })}
                className="p-1.5 text-xs font-semibold text-red-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Remove All</span>
              </button>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {data.aiContent.hobbies.map((hobby, i) => (
            <div key={i} className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-700 transition-colors">
              <input
                type="text"
                value={hobby}
                onChange={(e) => updateHobby(i, e.target.value)}
                className="bg-transparent outline-none text-xs font-medium text-slate-600 dark:text-slate-300 w-24"
              />
              <button
                onClick={() => onChange({ ...data, aiContent: { ...data.aiContent, hobbies: data.aiContent.hobbies.filter((_, idx) => idx !== i) } })}
                className="text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
          <button
            onClick={() => onChange({ ...data, aiContent: { ...data.aiContent, hobbies: [...data.aiContent.hobbies, 'New Hobby'] } })}
            className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-lg text-xs font-bold hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors"
          >
            + Add
          </button>
        </div>
      </section>

      {/* ── Goals ───────────────────────────────────────────────────── */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-6 shadow-sm dark:shadow-none border border-slate-100 dark:border-slate-800 transition-colors duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">Goals</h2>
          <AlignmentToggle sectionId="goals" />
        </div>
        <textarea
          value={data.aiContent.goals}
          onChange={(e) => onChange({ ...data, aiContent: { ...data.aiContent, goals: e.target.value } })}
          className="w-full h-24 p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
          placeholder="Career goals..."
        />
      </section>
    </div>
  );
};

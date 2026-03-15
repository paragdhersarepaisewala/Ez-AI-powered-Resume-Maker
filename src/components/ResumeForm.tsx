import React, { useState } from 'react';
import { ResumeData, CustomSection, Skill } from '../types';
import { structureResumeData } from '../services/gemini';
import { Sparkles, Loader2, User, Mail, Briefcase, Phone, MapPin, Hash, Info, Plus, Trash2, Star } from 'lucide-react';

interface ResumeFormProps {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
  activeTemplate: string;
}

export const ResumeForm: React.FC<ResumeFormProps> = ({ data, onChange, activeTemplate }) => {
  const [unstructuredText, setUnstructuredText] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange({
      ...data,
      personalInfo: {
        ...data.personalInfo,
        [name]: value,
      },
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange({
          ...data,
          personalInfo: {
            ...data.personalInfo,
            profileImage: reader.result as string,
          },
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAiMagic = async () => {
    if (!unstructuredText.trim()) return;
    setIsAiLoading(true);
    console.log("Starting AI Magic. Text length:", unstructuredText.length);
    try {
      console.log("Calling structureResumeData...");
      const structured = await structureResumeData(unstructuredText);
      console.log("Received structured response:", structured);
      onChange({
        ...data,
        aiContent: {
          ...data.aiContent,
          ...structured,
          skills: structured.skills || data.aiContent.skills,
          customSections: structured.customSections || data.aiContent.customSections,
        } as ResumeData['aiContent'],
      });
      console.log("State updated");
    } catch (error) {
      console.error("Error in AI Magic:", error);
    } finally {
      console.log("AI Magic finished");
      setIsAiLoading(false);
    }
  };

  const addCustomSection = () => {
    const newSection: CustomSection = {
      id: Math.random().toString(36).substr(2, 9),
      title: 'New Section',
      content: '',
    };
    onChange({
      ...data,
      aiContent: {
        ...data.aiContent,
        customSections: [...(data.aiContent.customSections || []), newSection],
      },
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

  const updateSectionAlignment = (sectionId: string, alignment: 'left' | 'right') => {
    onChange({
      ...data,
      sectionConfig: {
        ...(data.sectionConfig || {}),
        [sectionId]: {
          id: sectionId,
          alignment,
          order: data.sectionConfig?.[sectionId]?.order || 0
        }
      }
    });
  };

  const updateExperience = (index: number, field: string, value: string) => {
    const newExperience = [...data.aiContent.experience];
    newExperience[index] = { ...newExperience[index], [field]: value };
    onChange({ ...data, aiContent: { ...data.aiContent, experience: newExperience } });
  };

  const updateEducation = (index: number, field: string, value: string) => {
    const newEducation = [...data.aiContent.education];
    newEducation[index] = { ...newEducation[index], [field]: value };
    onChange({ ...data, aiContent: { ...data.aiContent, education: newEducation } });
  };

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

  const updateHobby = (index: number, value: string) => {
    const newHobbies = [...data.aiContent.hobbies];
    newHobbies[index] = value;
    onChange({ ...data, aiContent: { ...data.aiContent, hobbies: newHobbies } });
  };

  const AlignmentToggle = ({ sectionId }: { sectionId: string }) => {
    if (activeTemplate === 'ATS') return null;
    const alignment = data.sectionConfig?.[sectionId]?.alignment || 'right';
    return (
      <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg gap-1 transition-colors">
        <button
          onClick={() => updateSectionAlignment(sectionId, 'left')}
          className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${alignment === 'left' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}
        >
          LEFT
        </button>
        <button
          onClick={() => updateSectionAlignment(sectionId, 'right')}
          className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${alignment === 'right' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}
        >
          RIGHT
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Personal Info */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-6 shadow-sm dark:shadow-none border border-slate-100 dark:border-slate-800 transition-colors duration-200">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
          <User className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
          Personal Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase ml-1">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={data.personalInfo.fullName}
              onChange={handlePersonalInfoChange}
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm text-slate-900 dark:text-white"
              placeholder="John Doe"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase ml-1">Email</label>
            <input
              type="email"
              name="email"
              value={data.personalInfo.email}
              onChange={handlePersonalInfoChange}
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm text-slate-900 dark:text-white"
              placeholder="john@example.com"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase ml-1">Designation</label>
            <input
              type="text"
              name="designation"
              value={data.personalInfo.designation}
              onChange={handlePersonalInfoChange}
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm text-slate-900 dark:text-white"
              placeholder="Senior Web Developer"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase ml-1">Contact No</label>
            <input
              type="text"
              name="contactNo"
              value={data.personalInfo.contactNo}
              onChange={handlePersonalInfoChange}
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm text-slate-900 dark:text-white"
              placeholder="+1 234 567 890"
            />
          </div>
          <div className="md:col-span-2 space-y-1">
            <label className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase ml-1">Address</label>
            <input
              type="text"
              name="address"
              value={data.personalInfo.address}
              onChange={handlePersonalInfoChange}
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm text-slate-900 dark:text-white"
              placeholder="New York, USA"
            />
          </div>
          <div className="md:col-span-2 space-y-1">
            <label className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase ml-1">Profile Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:bg-indigo-50 dark:file:bg-indigo-500/10 file:text-indigo-700 dark:file:text-indigo-400 hover:file:bg-indigo-100 dark:hover:file:bg-indigo-500/20 transition-all text-slate-600 dark:text-slate-300"
            />
          </div>
        </div>
      </section>

      {/* AI Content Builder */}
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
          placeholder="Paste your raw info here... AI will structure it."
          className="w-full h-32 p-4 bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm leading-relaxed text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
        />
        <button
          onClick={handleAiMagic}
          disabled={isAiLoading || !unstructuredText.trim()}
          className="mt-4 w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-200 dark:shadow-none active:scale-[0.98] text-sm"
        >
          {isAiLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
          {isAiLoading ? 'Structuring...' : 'Generate Structured Content'}
        </button>
      </section>

      {/* Summary Section */}
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

      {/* Experience Section */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-6 shadow-sm dark:shadow-none border border-slate-100 dark:border-slate-800 transition-colors duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">Experience</h2>
          <AlignmentToggle sectionId="experience" />
        </div>
        <div className="space-y-6">
          {data.aiContent.experience.map((exp, i) => (
            <div key={i} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50 space-y-3 transition-colors">
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
                <input
                  type="text"
                  value={exp.startDate}
                  onChange={(e) => updateExperience(i, 'startDate', e.target.value)}
                  className="w-full bg-transparent border-b border-slate-200 dark:border-slate-700 py-1 text-xs text-slate-500 dark:text-slate-400 focus:border-indigo-500 outline-none placeholder:text-slate-400 dark:placeholder:text-slate-600"
                  placeholder="Start Date"
                />
                <input
                  type="text"
                  value={exp.endDate}
                  onChange={(e) => updateExperience(i, 'endDate', e.target.value)}
                  className="w-full bg-transparent border-b border-slate-200 dark:border-slate-700 py-1 text-xs text-slate-500 dark:text-slate-400 focus:border-indigo-500 outline-none placeholder:text-slate-400 dark:placeholder:text-slate-600"
                  placeholder="End Date"
                />
              </div>
              <textarea
                value={exp.description}
                onChange={(e) => updateExperience(i, 'description', e.target.value)}
                className="w-full h-24 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-xs focus:ring-2 focus:ring-indigo-500 outline-none text-slate-700 dark:text-slate-300 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                placeholder="Description..."
              />
            </div>
          ))}
        </div>
      </section>

      {/* Education Section */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-6 shadow-sm dark:shadow-none border border-slate-100 dark:border-slate-800 transition-colors duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">Education</h2>
          <AlignmentToggle sectionId="education" />
        </div>
        <div className="space-y-6">
          {data.aiContent.education.map((edu, i) => (
            <div key={i} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50 space-y-3 transition-colors">
              <input
                type="text"
                value={edu.degree}
                onChange={(e) => updateEducation(i, 'degree', e.target.value)}
                className="w-full bg-transparent border-b border-slate-200 dark:border-slate-700 py-1 font-bold text-slate-800 dark:text-slate-200 focus:border-indigo-500 outline-none text-sm placeholder:text-slate-400 dark:placeholder:text-slate-600"
                placeholder="Degree"
              />
              <input
                type="text"
                value={edu.institution}
                onChange={(e) => updateEducation(i, 'institution', e.target.value)}
                className="w-full bg-transparent border-b border-slate-200 dark:border-slate-700 py-1 text-slate-600 dark:text-slate-300 focus:border-indigo-500 outline-none text-sm placeholder:text-slate-400 dark:placeholder:text-slate-600"
                placeholder="Institution"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={edu.startDate}
                  onChange={(e) => updateEducation(i, 'startDate', e.target.value)}
                  className="w-full bg-transparent border-b border-slate-200 dark:border-slate-700 py-1 text-xs text-slate-500 dark:text-slate-400 focus:border-indigo-500 outline-none placeholder:text-slate-400 dark:placeholder:text-slate-600"
                  placeholder="Start Date"
                />
                <input
                  type="text"
                  value={edu.endDate}
                  onChange={(e) => updateEducation(i, 'endDate', e.target.value)}
                  className="w-full bg-transparent border-b border-slate-200 dark:border-slate-700 py-1 text-xs text-slate-500 dark:text-slate-400 focus:border-indigo-500 outline-none placeholder:text-slate-400 dark:placeholder:text-slate-600"
                  placeholder="End Date"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Skills Section */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-6 shadow-sm dark:shadow-none border border-slate-100 dark:border-slate-800 transition-colors duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">Skills</h2>
          <AlignmentToggle sectionId="skills" />
        </div>
        <div className="space-y-3">
          {data.aiContent.skills.map((skill, index) => (
            <div key={index} className="flex flex-col p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50 gap-3 transition-colors">
              <input
                type="text"
                value={skill.name}
                onChange={(e) => updateSkill(index, 'name', e.target.value)}
                className="bg-transparent border-b border-slate-200 dark:border-slate-700 py-1 font-bold text-slate-700 dark:text-slate-300 focus:border-indigo-500 outline-none text-sm placeholder:text-slate-400 dark:placeholder:text-slate-600"
                placeholder="Skill Name"
              />
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    onClick={() => updateSkillLevel(index, level)}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all text-xs ${skill.level >= level ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 hover:bg-slate-300 dark:hover:bg-slate-600'
                      }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Custom Sections */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-6 shadow-sm dark:shadow-none border border-slate-100 dark:border-slate-800 transition-colors duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">Custom Sections</h2>
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

      {/* Hobbies Section */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-6 shadow-sm dark:shadow-none border border-slate-100 dark:border-slate-800 transition-colors duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">Hobbies</h2>
          <AlignmentToggle sectionId="hobbies" />
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

      {/* Goals Section */}
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

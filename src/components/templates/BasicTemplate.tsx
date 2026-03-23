import React from 'react';
import { ResumeData, TemplateProps } from '../../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const BasicTemplate: React.FC<TemplateProps> = ({ data }) => {
  const getAlignment = (id: string, defaultAlign: 'left' | 'right') => {
    return data.sectionConfig?.[id]?.alignment || defaultAlign;
  };

  const renderSection = (id: string) => {
    switch (id) {
      case 'experience':
        if (data.aiContent.experience.length === 0) return null;
        return (
          <section key="experience">
            <h2 className="text-lg font-bold text-slate-900 uppercase border-b border-slate-200 mb-4">Experience</h2>
            <div className="space-y-6">
              {data.aiContent.experience.map((exp, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-slate-800">{exp.position}</h3>
                    <span className="text-sm text-slate-500">{exp.startDate} — {exp.endDate}</span>
                  </div>
                  <p className="text-slate-600 font-medium italic text-sm">{exp.company}</p>
                  <p className="text-slate-700 mt-2 text-sm leading-relaxed whitespace-pre-line">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        );
      case 'education':
        if (data.aiContent.education.length === 0) return null;
        return (
          <section key="education">
            <h2 className="text-lg font-bold text-slate-900 uppercase border-b border-slate-200 mb-4">Education</h2>
            <div className="space-y-4">
              {data.aiContent.education.map((edu, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-slate-800">{edu.degree}</h3>
                    <span className="text-sm text-slate-500">{edu.startDate} — {edu.endDate}</span>
                  </div>
                  <p className="text-slate-600 font-medium italic text-sm">{edu.institution}</p>
                  <p className="text-slate-700 mt-1 text-sm">{edu.description}</p>
                </div>
              ))}
            </div>
          </section>
        );
      case 'skills':
        if (data.aiContent.skills.length === 0) return null;
        return (
          <section key="skills">
            <h2 className="text-lg font-bold text-slate-900 uppercase border-b border-slate-200 mb-3">Skills</h2>
            <div className="space-y-2">
              {data.aiContent.skills.map((skill, i) => (
                <div key={i} className="flex flex-col">
                  <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                    <span>{skill.name}</span>
                    <span className="text-slate-400">{['Beginner', 'Elementary', 'Intermediate', 'Advanced', 'Expert'][skill.level - 1]}</span>
                  </div>
                  <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-slate-400 rounded-full" 
                      style={{ width: `${(skill.level / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      case 'hobbies':
        if (data.aiContent.hobbies.length === 0) return null;
        return (
          <section key="hobbies">
            <h2 className="text-lg font-bold text-slate-900 uppercase border-b border-slate-200 mb-3">Hobbies</h2>
            <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
              {data.aiContent.hobbies.map((hobby, i) => (
                <li key={i}>{hobby}</li>
              ))}
            </ul>
          </section>
        );
      case 'goals':
        if (!data.aiContent.goals?.trim()) return null;
        return (
          <section key="goals">
            <h2 className="text-lg font-bold text-slate-900 uppercase border-b border-slate-200 mb-3">Goals</h2>
            <p className="text-slate-700 text-sm leading-relaxed">{data.aiContent.goals}</p>
          </section>
        );
      default:
        const custom = data.aiContent.customSections?.find(s => s.id === id);
        if (custom) {
          return (
            <section key={custom.id}>
              <h2 className="text-lg font-bold text-slate-900 uppercase border-b border-slate-200 mb-3">{custom.title}</h2>
              <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">{custom.content}</p>
            </section>
          );
        }
        return null;
    }
  };

  const allSectionIds = [
    'experience', 'education', 'skills', 'hobbies', 'goals',
    ...(data.aiContent.customSections?.map(s => s.id) || [])
  ];

  const leftColumnSections = allSectionIds.filter(id => {
    const defaultAlign = ['skills', 'hobbies', 'goals'].includes(id) ? 'right' : 'left';
    return getAlignment(id, defaultAlign) === 'left';
  });

  const rightColumnSections = allSectionIds.filter(id => {
    const defaultAlign = ['skills', 'hobbies', 'goals'].includes(id) ? 'right' : 'left';
    return getAlignment(id, defaultAlign) === 'right';
  });

  return (
    <div className="p-8 bg-white text-slate-800 h-[1123px] w-[794px] font-sans overflow-hidden relative flex flex-col">
      <header className="border-b-2 border-slate-200 pb-6 mb-6">
        <h1 className="text-4xl font-bold text-slate-900 uppercase tracking-tight">{data.personalInfo.fullName}</h1>
        <p className="text-xl text-slate-600 font-medium mt-1">{data.personalInfo.designation}</p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-sm text-slate-500">
          <span>{data.personalInfo.email}</span>
          <span>•</span>
          <span>{data.personalInfo.contactNo}</span>
          <span>•</span>
          <span>{data.personalInfo.address}</span>
        </div>
      </header>

      {data.aiContent.summary?.trim() && (
        <section className="mb-8">
          <h2 className="text-lg font-bold text-slate-900 uppercase border-b border-slate-200 mb-3">Professional Summary</h2>
          <p className="text-slate-700 leading-relaxed">{data.aiContent.summary}</p>
        </section>
      )}

      {rightColumnSections.length > 0 ? (
        <div className="grid grid-cols-3 gap-8 flex-1 overflow-hidden">
          <div className={cn(
            "space-y-8 overflow-y-auto pr-4 scrollbar-hide",
            leftColumnSections.length > 0 ? "col-span-2" : "hidden"
          )}>
            {leftColumnSections.map(id => renderSection(id))}
          </div>
          <div className={cn(
            "space-y-8 overflow-y-auto pr-4 scrollbar-hide",
            leftColumnSections.length === 0 ? "col-span-3" : "col-span-1"
          )}>
            {rightColumnSections.map(id => renderSection(id))}
          </div>
        </div>
      ) : (
        <div className="space-y-8 overflow-y-auto pr-4 scrollbar-hide flex-1">
          {leftColumnSections.map(id => renderSection(id))}
        </div>
      )}
    </div>
  );
};

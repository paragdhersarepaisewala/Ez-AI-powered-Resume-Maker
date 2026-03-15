import React from 'react';
import { ResumeData, TemplateProps } from '../../types';

export const ATSTemplate: React.FC<TemplateProps> = ({ data }) => {
  const renderSection = (id: string) => {
    switch (id) {
      case 'experience':
        return (
          <section key="experience" className="mb-6">
            <h2 className="text-base font-bold border-b border-black mb-3 uppercase tracking-wide">Experience</h2>
            <div className="space-y-4">
              {data.aiContent.experience.map((exp, i) => (
                <div key={i}>
                  <div className="flex justify-between font-bold text-sm">
                    <span>{exp.company}</span>
                    <span>{exp.startDate} – {exp.endDate}</span>
                  </div>
                  <div className="italic text-sm mb-1">{exp.position}</div>
                  <p className="text-sm text-justify whitespace-pre-line leading-relaxed">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        );
      case 'education':
        return (
          <section key="education" className="mb-6">
            <h2 className="text-base font-bold border-b border-black mb-3 uppercase tracking-wide">Education</h2>
            <div className="space-y-3">
              {data.aiContent.education.map((edu, i) => (
                <div key={i}>
                  <div className="flex justify-between font-bold text-sm">
                    <span>{edu.institution}</span>
                    <span>{edu.startDate} – {edu.endDate}</span>
                  </div>
                  <div className="italic text-sm">{edu.degree}</div>
                  {edu.description && <p className="text-sm mt-1">{edu.description}</p>}
                </div>
              ))}
            </div>
          </section>
        );
      case 'skills':
        return (
          <section key="skills" className="mb-6">
            <h2 className="text-base font-bold border-b border-black mb-2 uppercase tracking-wide">Skills</h2>
            <p className="text-sm">
              {data.aiContent.skills.map((skill, i) => (
                <span key={i}>
                  <span className="font-bold">{skill.name}</span> ({['Beginner', 'Elementary', 'Intermediate', 'Advanced', 'Expert'][skill.level - 1]})
                  {i < data.aiContent.skills.length - 1 ? ', ' : ''}
                </span>
              ))}
            </p>
          </section>
        );
      case 'goals':
        return (
          <section key="goals" className="mb-6">
            <h2 className="text-base font-bold border-b border-black mb-2 uppercase tracking-wide">Objective</h2>
            <p className="text-sm leading-relaxed">{data.aiContent.goals}</p>
          </section>
        );
      default:
        const custom = data.aiContent.customSections?.find(s => s.id === id);
        if (custom) {
          return (
            <section key={custom.id} className="mb-6">
              <h2 className="text-base font-bold border-b border-black mb-2 uppercase tracking-wide">{custom.title}</h2>
              <p className="text-sm text-justify whitespace-pre-line leading-relaxed">{custom.content}</p>
            </section>
          );
        }
        return null;
    }
  };

  const allSectionIds = [
    'experience', 'education', 'skills', 'goals',
    ...(data.aiContent.customSections?.map(s => s.id) || [])
  ];

  return (
    <div className="p-12 bg-white text-black h-[1123px] w-[794px] font-serif leading-normal overflow-hidden relative flex flex-col">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">{data.personalInfo.fullName}</h1>
        <div className="text-sm space-x-2">
          <span>{data.personalInfo.address}</span>
          <span>|</span>
          <span>{data.personalInfo.contactNo}</span>
          <span>|</span>
          <span>{data.personalInfo.email}</span>
        </div>
      </header>

      <section className="mb-6">
        <h2 className="text-base font-bold border-b border-black mb-2 uppercase tracking-wide">Summary</h2>
        <p className="text-sm text-justify leading-relaxed">{data.aiContent.summary}</p>
      </section>

      <div className="space-y-2 overflow-y-auto pr-4 scrollbar-hide flex-1">
        {allSectionIds.map(id => renderSection(id))}
      </div>
    </div>
  );
};

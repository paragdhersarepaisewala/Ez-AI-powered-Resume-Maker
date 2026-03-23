import React from 'react';
import { TemplateProps } from '../../types';

export const ATSTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, aiContent } = data;

  const hasExperience = aiContent.experience.length > 0;
  const hasEducation = aiContent.education.length > 0;
  const hasSkills = aiContent.skills.length > 0;
  const hasCustomSections = (aiContent.customSections?.length ?? 0) > 0;
  const hasGoals = !!aiContent.goals?.trim();

  return (
    <div className="p-10 bg-white text-black h-[1123px] w-[794px] font-sans leading-normal overflow-hidden relative flex flex-col text-[13px]">
      {/* ─── Header ─── */}
      <header className="mb-5 border-b-2 border-black pb-4">
        <h1 className="text-[28px] font-extrabold uppercase tracking-tight leading-none">
          {personalInfo.fullName || 'YOUR NAME'}
        </h1>
        {personalInfo.designation && (
          <p className="text-[14px] font-semibold text-gray-600 mt-0.5">{personalInfo.designation}</p>
        )}
        <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-2 text-[11.5px] text-gray-700">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.contactNo && <><span>|</span><span>{personalInfo.contactNo}</span></>}
          {personalInfo.address && <><span>|</span><span>{personalInfo.address}</span></>}
        </div>
      </header>

      {/* ─── Professional Summary ─── */}
      {aiContent.summary && (
        <section className="mb-4">
          <h2 className="text-[11px] font-black uppercase tracking-[0.15em] border-b border-gray-400 mb-2 pb-0.5">
            Professional Summary
          </h2>
          <p className="text-[12.5px] leading-relaxed text-justify">{aiContent.summary}</p>
        </section>
      )}

      {/* ─── Skills (ATS keyword block) ─── */}
      {hasSkills && (
        <section className="mb-4">
          <h2 className="text-[11px] font-black uppercase tracking-[0.15em] border-b border-gray-400 mb-2 pb-0.5">
            Core Competencies &amp; Skills
          </h2>
          <div className="flex flex-wrap gap-x-1.5 gap-y-1">
            {aiContent.skills.map((skill, i) => (
              <span
                key={i}
                className="text-[11.5px] font-semibold bg-gray-100 border border-gray-300 rounded px-2 py-0.5"
              >
                {skill.name}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* ─── Experience ─── */}
      {hasExperience && (
        <section className="mb-4">
          <h2 className="text-[11px] font-black uppercase tracking-[0.15em] border-b border-gray-400 mb-2 pb-0.5">
            Professional Experience
          </h2>
          <div className="space-y-3">
            {aiContent.experience.map((exp, i) => (
              <div key={i}>
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-[13px]">{exp.position}</span>
                  <span className="text-[11px] text-gray-600 font-medium whitespace-nowrap ml-2">
                    {exp.startDate}{exp.endDate ? ` – ${exp.endDate}` : ''}
                  </span>
                </div>
                <div className="text-[12px] text-gray-700 font-semibold italic">{exp.company}</div>
                {exp.description && (
                  <p className="text-[12px] mt-1 leading-relaxed text-justify whitespace-pre-line text-gray-800">
                    {exp.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ─── Education ─── */}
      {hasEducation && (
        <section className="mb-4">
          <h2 className="text-[11px] font-black uppercase tracking-[0.15em] border-b border-gray-400 mb-2 pb-0.5">
            Education
          </h2>
          <div className="space-y-2">
            {aiContent.education.map((edu, i) => (
              <div key={i}>
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-[13px]">{edu.degree}</span>
                  <span className="text-[11px] text-gray-600 font-medium whitespace-nowrap ml-2">
                    {edu.startDate}{edu.endDate ? ` – ${edu.endDate}` : ''}
                  </span>
                </div>
                <div className="text-[12px] text-gray-700 italic">{edu.institution}</div>
                {edu.description && <p className="text-[11.5px] mt-0.5 text-gray-700">{edu.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ─── Objective / Goals ─── */}
      {hasGoals && (
        <section className="mb-4">
          <h2 className="text-[11px] font-black uppercase tracking-[0.15em] border-b border-gray-400 mb-2 pb-0.5">
            Career Objective
          </h2>
          <p className="text-[12.5px] leading-relaxed">{aiContent.goals}</p>
        </section>
      )}

      {/* ─── Custom Sections ─── */}
      {hasCustomSections && aiContent.customSections.map((section) => (
        <section key={section.id} className="mb-4">
          <h2 className="text-[11px] font-black uppercase tracking-[0.15em] border-b border-gray-400 mb-2 pb-0.5">
            {section.title}
          </h2>
          <p className="text-[12.5px] leading-relaxed text-justify whitespace-pre-line">{section.content}</p>
        </section>
      ))}
    </div>
  );
};

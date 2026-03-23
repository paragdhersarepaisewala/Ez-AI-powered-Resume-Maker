import React from 'react';
import { TemplateProps } from '../../types';

// All sizes are expressed as em ratios relative to the base fontSize (default 13px).
// Changing fontSize in the parent scales the entire document proportionally.
const ratio = {
  name:        2.15,   // ~28px at 13px base
  designation: 1.08,   // ~14px
  contact:     0.88,   // ~11.5px
  heading:     0.846,  // ~11px  (section headings)
  body:        0.96,   // ~12.5px
  secondary:   0.923,  // ~12px
  date:        0.846,  // ~11px
  pill:        0.884,  // ~11.5px
};

const em = (r: number) => `${r}em`;

export const ATSTemplate: React.FC<TemplateProps> = ({ data, fontSize = 13 }) => {
  const { personalInfo, aiContent } = data;

  const hasExperience    = aiContent.experience.length > 0;
  const hasEducation     = aiContent.education.length > 0;
  const hasSkills        = aiContent.skills.length > 0;
  const hasCustomSections = (aiContent.customSections?.length ?? 0) > 0;
  const hasGoals         = !!aiContent.goals?.trim();

  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h2
      style={{
        fontSize: em(ratio.heading),
        fontWeight: 900,
        textTransform: 'uppercase',
        letterSpacing: '0.15em',
        borderBottom: '1px solid #9ca3af',
        marginBottom: '0.5em',
        paddingBottom: '2px',
      }}
    >
      {children}
    </h2>
  );

  return (
    <div
      className="p-10 bg-white text-black h-[1123px] w-[794px] font-sans leading-normal overflow-hidden relative flex flex-col"
      style={{ fontSize: `${fontSize}px` }}
    >
      {/* ─── Header ─── */}
      <header className="mb-5" style={{ borderBottom: '2px solid black', paddingBottom: '1em' }}>
        <h1 style={{ fontSize: em(ratio.name), fontWeight: 800, textTransform: 'uppercase', letterSpacing: '-0.02em', lineHeight: 1 }}>
          {personalInfo.fullName || 'YOUR NAME'}
        </h1>
        {personalInfo.designation && (
          <p style={{ fontSize: em(ratio.designation), fontWeight: 600, color: '#4b5563', marginTop: '0.2em' }}>
            {personalInfo.designation}
          </p>
        )}
        <div style={{ fontSize: em(ratio.contact), color: '#374151', marginTop: '0.5em', display: 'flex', flexWrap: 'wrap', gap: '0 0.75em' }}>
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.contactNo && <><span>|</span><span>{personalInfo.contactNo}</span></>}
          {personalInfo.address && <><span>|</span><span>{personalInfo.address}</span></>}
        </div>
      </header>

      {/* ─── Summary ─── */}
      {aiContent.summary && (
        <section className="mb-4">
          <SectionTitle>Professional Summary</SectionTitle>
          <p style={{ fontSize: em(ratio.body), lineHeight: 1.6, textAlign: 'justify' }}>{aiContent.summary}</p>
        </section>
      )}

      {/* ─── Skills ─── */}
      {hasSkills && (
        <section className="mb-4">
          <SectionTitle>Core Competencies &amp; Skills</SectionTitle>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3em 0.4em' }}>
            {aiContent.skills.map((skill, i) => (
              <span
                key={i}
                style={{
                  fontSize: em(ratio.pill),
                  fontWeight: 600,
                  background: '#f3f4f6',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  padding: '2px 8px',
                }}
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
          <SectionTitle>Professional Experience</SectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75em' }}>
            {aiContent.experience.map((exp, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontWeight: 700, fontSize: em(1) }}>{exp.position}</span>
                  <span style={{ fontSize: em(ratio.date), color: '#6b7280', fontWeight: 500, whiteSpace: 'nowrap', marginLeft: '0.5em' }}>
                    {exp.startDate}{exp.endDate ? ` – ${exp.endDate}` : ''}
                  </span>
                </div>
                <div style={{ fontSize: em(ratio.secondary), color: '#374151', fontWeight: 600, fontStyle: 'italic' }}>{exp.company}</div>
                {exp.description && (
                  <p style={{ fontSize: em(ratio.secondary), marginTop: '0.25em', lineHeight: 1.5, textAlign: 'justify' }}>
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
          <SectionTitle>Education</SectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5em' }}>
            {aiContent.education.map((edu, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontWeight: 700, fontSize: em(1) }}>{edu.degree}</span>
                  <span style={{ fontSize: em(ratio.date), color: '#6b7280', fontWeight: 500, whiteSpace: 'nowrap', marginLeft: '0.5em' }}>
                    {edu.startDate}{edu.endDate ? ` – ${edu.endDate}` : ''}
                  </span>
                </div>
                <div style={{ fontSize: em(ratio.secondary), color: '#374151', fontStyle: 'italic' }}>{edu.institution}</div>
                {edu.description && <p style={{ fontSize: em(ratio.date), marginTop: '0.2em', color: '#374151' }}>{edu.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ─── Objective ─── */}
      {hasGoals && (
        <section className="mb-4">
          <SectionTitle>Career Objective</SectionTitle>
          <p style={{ fontSize: em(ratio.body), lineHeight: 1.6 }}>{aiContent.goals}</p>
        </section>
      )}

      {/* ─── Custom Sections ─── */}
      {hasCustomSections && aiContent.customSections.map((section) => (
        <section key={section.id} className="mb-4">
          <SectionTitle>{section.title}</SectionTitle>
          <p style={{ fontSize: em(ratio.body), lineHeight: 1.6, textAlign: 'justify', whiteSpace: 'pre-line' }}>{section.content}</p>
        </section>
      ))}
    </div>
  );
};

import React from 'react';
import { ResumeData, TemplateProps } from '../../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const DesignerTemplate: React.FC<TemplateProps> = ({ data, resolvedProfileImageUrl }) => {
  const getAlignment = (id: string, defaultAlign: 'left' | 'right') => {
    return data.sectionConfig?.[id]?.alignment || defaultAlign;
  };

  const renderSection = (id: string, isSidebar: boolean) => {
    const titleColor = isSidebar ? "text-slate-500" : "text-slate-900";
    const textColor = isSidebar ? "text-slate-300" : "text-slate-600";
    const headingSize = isSidebar ? "text-xs font-bold uppercase tracking-widest" : "text-xl font-bold flex items-center gap-2";

    switch (id) {
      case 'experience':
        if (data.aiContent.experience.length === 0) return null;
        return (
          <section key="experience" className={isSidebar ? "mb-8" : "mb-10"}>
            <h2 className={cn(headingSize, titleColor, !isSidebar && "mb-6")}>
              {!isSidebar && <span className="w-8 h-[2px] bg-slate-900"></span>}
              Experience
            </h2>
            <div className="space-y-8">
              {data.aiContent.experience.map((exp, i) => (
                <div key={i} className={cn("relative pl-6", !isSidebar && "border-l-2 border-slate-100")}>
                  {!isSidebar && <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-slate-900 border-4 border-white"></div>}
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className={cn("font-bold", isSidebar ? "text-white text-sm" : "text-slate-900")}>{exp.position}</h3>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      {exp.startDate} — {exp.endDate}
                    </span>
                  </div>
                  <p className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-2">{exp.company}</p>
                  <p className={cn("text-sm leading-relaxed whitespace-pre-line", textColor)}>{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        );
      case 'education':
        if (data.aiContent.education.length === 0) return null;
        return (
          <section key="education" className={isSidebar ? "mb-8" : "mb-10"}>
            <h2 className={cn(headingSize, titleColor, !isSidebar && "mb-6")}>
              {!isSidebar && <span className="w-8 h-[2px] bg-slate-900"></span>}
              Education
            </h2>
            <div className="space-y-6">
              {data.aiContent.education.map((edu, i) => (
                <div key={i} className={cn("relative pl-6", !isSidebar && "border-l-2 border-slate-100")}>
                  {!isSidebar && <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-slate-900 border-4 border-white"></div>}
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className={cn("font-bold", isSidebar ? "text-white text-sm" : "text-slate-900")}>{edu.degree}</h3>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      {edu.startDate} — {edu.endDate}
                    </span>
                  </div>
                  <p className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-1">{edu.institution}</p>
                  <p className={cn("text-sm", textColor)}>{edu.description}</p>
                </div>
              ))}
            </div>
          </section>
        );
      case 'skills':
        if (data.aiContent.skills.length === 0) return null;
        return (
          <section key="skills" className="mb-8">
            <h2 className={cn(headingSize, titleColor, !isSidebar && "mb-4")}>
              {!isSidebar && <span className="w-8 h-[2px] bg-slate-900"></span>}
              Skills
            </h2>
            <div className="space-y-3">
              {data.aiContent.skills.map((skill, i) => (
                <div key={i}>
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider mb-1">
                    <span className={isSidebar ? "text-white" : "text-slate-700"}>{skill.name}</span>
                    <span className="text-slate-500">{skill.level}/5</span>
                  </div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((dot) => (
                      <div 
                        key={dot} 
                        className={cn(
                          "h-1 flex-1 rounded-full",
                          dot <= skill.level ? (isSidebar ? "bg-white" : "bg-slate-900") : (isSidebar ? "bg-slate-700" : "bg-slate-200")
                        )}
                      ></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      case 'hobbies':
        if (data.aiContent.hobbies.length === 0) return null;
        return (
          <section key="hobbies" className="mb-8">
            <h2 className={cn(headingSize, titleColor, !isSidebar && "mb-4")}>
              {!isSidebar && <span className="w-8 h-[2px] bg-slate-900"></span>}
              Hobbies
            </h2>
            <ul className={cn("space-y-1 text-sm", textColor)}>
              {data.aiContent.hobbies.map((hobby, i) => (
                <li key={i}>{hobby}</li>
              ))}
            </ul>
          </section>
        );
      case 'goals':
        if (!data.aiContent.goals?.trim()) return null;
        return (
          <section key="goals" className="mb-8">
            <h2 className={cn(headingSize, titleColor, !isSidebar && "mb-4")}>
              {!isSidebar && <span className="w-8 h-[2px] bg-slate-900"></span>}
              Goals
            </h2>
            <p className={cn("text-sm leading-relaxed", textColor)}>{data.aiContent.goals}</p>
          </section>
        );
      default:
        const custom = data.aiContent.customSections?.find(s => s.id === id);
        if (custom) {
          return (
            <section key={custom.id} className="mb-8">
              <h2 className={cn(headingSize, titleColor, !isSidebar && "mb-4")}>
                {!isSidebar && <span className="w-8 h-[2px] bg-slate-900"></span>}
                {custom.title}
              </h2>
              <p className={cn("text-sm leading-relaxed whitespace-pre-line", textColor)}>{custom.content}</p>
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

  const sidebarSections = allSectionIds.filter(id => {
    const defaultAlign = ['skills', 'hobbies', 'goals'].includes(id) ? 'left' : 'right';
    return getAlignment(id, defaultAlign) === 'left';
  });

  const mainSections = allSectionIds.filter(id => {
    const defaultAlign = ['skills', 'hobbies', 'goals'].includes(id) ? 'left' : 'right';
    return getAlignment(id, defaultAlign) === 'right';
  });

  return (
    <div className="flex bg-white h-[1123px] w-[794px] font-sans overflow-hidden relative">
      {/* Sidebar */}
      <aside className="w-1/3 bg-slate-900 text-white p-8 space-y-8 h-full overflow-y-auto scrollbar-hide">
        <div className="flex flex-col items-center text-center">
          {resolvedProfileImageUrl ? (
            <img 
              src={resolvedProfileImageUrl} 
              alt={data.personalInfo.fullName} 
              className="w-32 h-32 rounded-full object-cover border-4 border-slate-700 mb-4"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-slate-800 flex items-center justify-center border-4 border-slate-700 mb-4 text-4xl font-bold">
              {data.personalInfo.fullName.charAt(0)}
            </div>
          )}
          <h1 className="text-2xl font-bold leading-tight">{data.personalInfo.fullName}</h1>
          <p className="text-slate-400 text-sm mt-1">{data.personalInfo.designation}</p>
        </div>

        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Contact</h2>
          <ul className="space-y-3 text-sm">
            <li className="flex flex-col">
              <span className="text-slate-500 text-[10px] uppercase font-bold">Email</span>
              <span>{data.personalInfo.email}</span>
            </li>
            <li className="flex flex-col">
              <span className="text-slate-500 text-[10px] uppercase font-bold">Phone</span>
              <span>{data.personalInfo.contactNo}</span>
            </li>
            <li className="flex flex-col">
              <span className="text-slate-500 text-[10px] uppercase font-bold">Address</span>
              <span className="text-slate-300">{data.personalInfo.address}</span>
            </li>
          </ul>
        </section>

        {sidebarSections.map(id => renderSection(id, true))}
      </aside>

      {/* Main Content */}
      <main className="w-2/3 p-12 text-slate-800 h-full overflow-y-auto scrollbar-hide">
        <section className="mb-10">
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-[2px] bg-slate-900"></span>
            Profile
          </h2>
          <p className="text-slate-600 leading-relaxed italic">{data.aiContent.summary}</p>
        </section>

        {mainSections.map(id => renderSection(id, false))}
      </main>
    </div>
  );
};

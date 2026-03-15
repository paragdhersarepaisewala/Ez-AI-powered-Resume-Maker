import React from 'react';
import { ResumeData, TemplateProps } from '../../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const GlassmorphismTemplate: React.FC<TemplateProps> = ({ data }) => {
  const getAlignment = (id: string, defaultAlign: 'left' | 'right') => {
    return data.sectionConfig?.[id]?.alignment || defaultAlign;
  };

  const renderSection = (id: string, isMain: boolean) => {
    switch (id) {
      case 'experience':
        return (
          <section key="experience">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 mb-8 flex items-center gap-4">
              Experience <span className="h-px flex-1 bg-white/10"></span>
            </h2>
            <div className="space-y-12">
              {data.aiContent.experience.map((exp, i) => (
                <div key={i} className="relative group">
                  <div className="absolute -left-6 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/50 to-transparent"></div>
                  <div className="flex justify-between items-baseline mb-3">
                    <h3 className="text-2xl font-bold group-hover:text-blue-400 transition-colors">{exp.position}</h3>
                    <span className="text-xs font-mono text-white/40 bg-white/5 px-2 py-1 rounded-md">
                      {exp.startDate} — {exp.endDate}
                    </span>
                  </div>
                  <p className="text-sm font-black text-white/60 uppercase tracking-wider mb-4">{exp.company}</p>
                  <p className="text-sm leading-relaxed text-white/70 whitespace-pre-line">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        );
      case 'education':
        return (
          <section key="education">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 mb-8 flex items-center gap-4">
              Education <span className="h-px flex-1 bg-white/10"></span>
            </h2>
            <div className="space-y-8">
              {data.aiContent.education.map((edu, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline mb-2">
                    <h3 className="text-xl font-bold">{edu.degree}</h3>
                    <span className="text-xs font-mono text-white/40">
                      {edu.startDate} — {edu.endDate}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-white/60 mb-2">{edu.institution}</p>
                  <p className="text-sm text-white/50">{edu.description}</p>
                </div>
              ))}
            </div>
          </section>
        );
      case 'skills':
        return (
          <section key="skills">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 mb-8">Expertise</h2>
            <div className="space-y-6">
              {data.aiContent.skills.map((skill, i) => (
                <div key={i}>
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">
                    <span>{skill.name}</span>
                    <span className="text-white/40">{skill.level}/5</span>
                  </div>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" 
                      style={{ width: `${(skill.level / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      case 'hobbies':
        return (
          <section key="hobbies">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 mb-6">Interests</h2>
            <div className="flex flex-wrap gap-2">
              {data.aiContent.hobbies.map((hobby, i) => (
                <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold uppercase tracking-wider text-white/60">
                  {hobby}
                </span>
              ))}
            </div>
          </section>
        );
      case 'goals':
        return (
          <section key="goals">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 mb-6">Vision</h2>
            <p className="text-sm text-white/60 leading-relaxed">{data.aiContent.goals}</p>
          </section>
        );
      default:
        const custom = data.aiContent.customSections?.find(s => s.id === id);
        if (custom) {
          return (
            <section key={custom.id}>
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 mb-8 flex items-center gap-4">
                {custom.title} <span className="h-px flex-1 bg-white/10"></span>
              </h2>
              <p className="text-sm leading-relaxed text-white/70 whitespace-pre-line">{custom.content}</p>
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

  const mainSections = allSectionIds.filter(id => {
    const defaultAlign = ['skills', 'hobbies', 'goals'].includes(id) ? 'right' : 'left';
    return getAlignment(id, defaultAlign) === 'left';
  });

  const sidebarSections = allSectionIds.filter(id => {
    const defaultAlign = ['skills', 'hobbies', 'goals'].includes(id) ? 'right' : 'left';
    return getAlignment(id, defaultAlign) === 'right';
  });

  return (
    <div className="h-[1123px] w-[794px] bg-[#1a1a1a] p-12 font-sans relative overflow-hidden text-white">
      {/* Dynamic Glass Shapes */}
      <div className="absolute top-[5%] left-[5%] w-64 h-64 bg-blue-500/20 rounded-full blur-[80px] animate-pulse"></div>
      <div className="absolute top-[20%] right-[10%] w-80 h-80 bg-purple-500/20 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[10%] left-[15%] w-72 h-72 bg-emerald-500/20 rounded-full blur-[90px] animate-bounce-slow"></div>
      <div className="absolute top-[40%] left-[40%] w-96 h-96 bg-pink-500/10 rounded-full blur-[120px]"></div>

      {/* Main Glass Container */}
      <div className="relative z-10 backdrop-blur-2xl bg-white/5 border border-white/10 rounded-[40px] shadow-2xl p-8 sm:p-12 h-full flex flex-col">
        <header className="flex items-center gap-6 sm:gap-8 mb-8 sm:mb-12 border-b border-white/10 pb-8 sm:pb-12">
          {data.personalInfo.profileImage ? (
            <img 
              src={data.personalInfo.profileImage} 
              alt={data.personalInfo.fullName} 
              className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl object-cover border border-white/20 shadow-2xl rotate-3"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl bg-white/10 flex items-center justify-center border border-white/20 text-4xl sm:text-5xl font-black rotate-3">
              {data.personalInfo.fullName.charAt(0)}
            </div>
          )}
          
          <div className="flex-1">
            <h1 className="text-4xl sm:text-6xl font-black tracking-tighter mb-1 sm:mb-2 bg-gradient-to-r from-white via-white to-white/40 bg-clip-text text-transparent">
              {data.personalInfo.fullName}
            </h1>
            <p className="text-lg sm:text-xl font-bold text-blue-400 uppercase tracking-[0.2em]">{data.personalInfo.designation}</p>
            <div className="flex flex-wrap gap-3 sm:gap-4 mt-4 sm:mt-6 text-[10px] sm:text-xs font-medium text-white/50 uppercase tracking-widest">
              <span>{data.personalInfo.email}</span>
              <span>•</span>
              <span>{data.personalInfo.contactNo}</span>
              <span>•</span>
              <span className="truncate max-w-[200px]">{data.personalInfo.address}</span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-8 sm:gap-12 flex-1 overflow-hidden">
          {/* Left Column */}
          <div className={cn(
            "space-y-10 sm:space-y-16 overflow-y-auto pr-4 scrollbar-hide",
            mainSections.length > 0 ? (sidebarSections.length > 0 ? "col-span-8" : "col-span-12") : "hidden"
          )}>
            {mainSections.map(id => renderSection(id, true))}
          </div>

          {/* Right Column */}
          <div className={cn(
            "space-y-10 sm:space-y-16 overflow-y-auto pr-4 scrollbar-hide",
            sidebarSections.length > 0 ? (mainSections.length > 0 ? "col-span-4" : "col-span-12") : "hidden"
          )}>
            {(mainSections.length === 0 || sidebarSections.length > 0) && (
              <section className="bg-white/5 rounded-3xl p-6 sm:p-8 border border-white/10">
                <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 mb-4 sm:mb-6">About</h2>
                <p className="text-xs sm:text-sm leading-relaxed text-white/80 italic">
                  "{data.aiContent.summary}"
                </p>
              </section>
            )}
            {sidebarSections.map(id => renderSection(id, false))}
          </div>
        </div>
      </div>
    </div>
  );
};

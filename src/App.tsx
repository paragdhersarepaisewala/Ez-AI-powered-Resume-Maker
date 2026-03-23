import { useState, useRef, useEffect } from 'react';
import { ResumeForm } from './components/ResumeForm';
import { BasicTemplate } from './components/templates/BasicTemplate';
import { ATSTemplate } from './components/templates/ATSTemplate';
import { DesignerTemplate } from './components/templates/DesignerTemplate';

import { loadImage } from './services/db';
import { ResumeData, TemplateType, ResumeVersion, TemplateProps } from './types';
import { exportToPDF, exportToWord } from './utils/export';
import { motion, AnimatePresence } from 'motion/react';
import { Download, FileText, Layout, Eye, ChevronRight, Github, Linkedin, Twitter, Plus, Copy, Trash2, Edit3, Sun, Moon } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const initialData: ResumeData = {
  personalInfo: {
    fullName: '',
    email: '',
    age: '',
    designation: '',
    contactNo: '',
    address: '',
  },
  aiContent: {
    summary: '',
    education: [],
    experience: [],
    skills: [],
    hobbies: [],
    goals: '',
    customSections: [],
  },
};

const STORAGE_KEY = 'craftcv_versions';

export default function App() {
  const [versions, setVersions] = useState<ResumeVersion[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to load versions', e);
      }
    }
    const defaultVersion: ResumeVersion = {
      id: 'default',
      name: 'My First Resume',
      data: initialData,
      lastModified: Date.now(),
    };
    return [defaultVersion];
  });

  const [currentVersionId, setCurrentVersionId] = useState<string>(versions[0].id);
  const [activeTemplate, setActiveTemplate] = useState<TemplateType>(TemplateType.BASIC);
  const [view, setView] = useState<'edit' | 'preview'>('edit');
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('craftcv_theme');
      if (savedTheme) {
        return savedTheme === 'dark';
      }
      return document.documentElement.classList.contains('dark') ||
        window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const currentVersion = versions.find(v => v.id === currentVersionId) || versions[0];
  const data = currentVersion.data;

  const [resolvedProfileImageUrl, setResolvedProfileImageUrl] = useState<string | null>(null);

  // Resolve profile image URL from IndexedDB whenever the stored key changes
  useEffect(() => {
    const key = data?.personalInfo?.profileImage;
    if (!key) { setResolvedProfileImageUrl(null); return; }
    loadImage(key).then(url => setResolvedProfileImageUrl(url));
  }, [data?.personalInfo?.profileImage]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(versions));
  }, [versions]);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('craftcv_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('craftcv_theme', 'light');
    }
  }, [isDark]);

  const updateData = (newData: ResumeData) => {
    setVersions(prev => prev.map(v =>
      v.id === currentVersionId
        ? { ...v, data: newData, lastModified: Date.now() }
        : v
    ));
  };

  const createVersion = () => {
    const newId = Math.random().toString(36).substr(2, 9);
    const newVersion: ResumeVersion = {
      id: newId,
      name: `New Resume ${versions.length + 1}`,
      data: initialData,
      lastModified: Date.now(),
    };
    setVersions(prev => [...prev, newVersion]);
    setCurrentVersionId(newId);
  };

  const duplicateVersion = (id: string) => {
    const versionToCopy = versions.find(v => v.id === id);
    if (!versionToCopy) return;

    const newId = Math.random().toString(36).substr(2, 9);
    const newVersion: ResumeVersion = {
      ...versionToCopy,
      id: newId,
      name: `${versionToCopy.name} (Copy)`,
      lastModified: Date.now(),
    };
    setVersions(prev => [...prev, newVersion]);
    setCurrentVersionId(newId);
  };

  const deleteVersion = (id: string) => {
    if (versions.length <= 1) return;
    setVersions(prev => prev.filter(v => v.id !== id));
    if (currentVersionId === id) {
      setCurrentVersionId(versions.find(v => v.id !== id)!.id);
    }
  };

  const renameVersion = (id: string, newName: string) => {
    setVersions(prev => prev.map(v =>
      v.id === id ? { ...v, name: newName, lastModified: Date.now() } : v
    ));
  };

  const renderTemplate = () => {
    const props: TemplateProps = { data, onChange: updateData, resolvedProfileImageUrl: resolvedProfileImageUrl ?? undefined };
    switch (activeTemplate) {
      case TemplateType.BASIC:
        return <BasicTemplate {...props} />;
      case TemplateType.ATS:
        return <ATSTemplate {...props} />;
      case TemplateType.DESIGNER:
        return <DesignerTemplate {...props} />;
      default:
        return <BasicTemplate {...props} />;
    }
  };

  const handleExportPDF = () => {
    exportToPDF('resume-preview', `Resume_${data.personalInfo.fullName.replace(/\s+/g, '_') || 'Untitled'}`);
  };

  const handleExportWord = () => {
    exportToWord(data, `Resume_${data.personalInfo.fullName.replace(/\s+/g, '_') || 'Untitled'}`);
  };

  const resetData = () => {
    setIsResetModalOpen(true);
  };

  const confirmReset = () => {
    updateData(JSON.parse(JSON.stringify(initialData)));
    setIsResetModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-3 sm:px-6 py-3 sm:py-4 transition-colors duration-200">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20">
              <FileText className="text-white w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-black tracking-tighter text-slate-900 dark:text-white">CraftCV</h1>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">AI Resume Builder</p>
            </div>
          </div>

          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl lg:hidden">
            <button
              onClick={() => setView('edit')}
              className={cn(
                "px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center gap-2",
                view === 'edit' ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              )}
            >
              <Layout className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Build
            </button>
            <button
              onClick={() => setView('preview')}
              className={cn(
                "px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center gap-2",
                view === 'preview' ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              )}
            >
              <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Preview
            </button>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl transition-all"
              title="Toggle Theme"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={resetData}
              className="p-2 sm:px-4 sm:py-2 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-xl text-sm font-bold transition-all inline-flex items-center gap-2"
              title="Reset Document"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Reset</span>
            </button>
            <button
              onClick={handleExportPDF}
              className="p-2 sm:px-4 sm:py-2 bg-slate-900 dark:bg-indigo-600 text-white rounded-xl text-sm font-bold inline-flex items-center gap-2 hover:bg-slate-800 dark:hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-slate-200 dark:shadow-indigo-900/20"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export PDF</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Left Column: Editor or Template Selection */}
        <div className={cn("lg:col-span-5 space-y-6 lg:space-y-8", view === 'preview' && "hidden lg:block")}>
          {/* Version Management */}
          <section className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-6 shadow-sm dark:shadow-none border border-slate-100 dark:border-slate-800 transition-colors duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                Resume Versions
              </h2>
              <button
                onClick={createVersion}
                className="p-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-all"
                title="Create New Version"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              {versions.map((v) => (
                <div
                  key={v.id}
                  className={cn(
                    "group p-3 rounded-xl border transition-all flex items-center justify-between",
                    currentVersionId === v.id
                      ? "border-indigo-600 dark:border-indigo-500 bg-indigo-50/30 dark:bg-indigo-500/10"
                      : "border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 bg-white dark:bg-slate-900"
                  )}
                >
                  <div
                    className="flex-1 cursor-pointer min-w-0"
                    onClick={() => setCurrentVersionId(v.id)}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={v.name}
                        onChange={(e) => renameVersion(v.id, e.target.value)}
                        className="bg-transparent border-none p-0 text-sm font-bold text-slate-800 dark:text-slate-200 focus:ring-0 w-full truncate"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">
                      Modified {new Date(v.lastModified).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => { e.stopPropagation(); duplicateVersion(v.id); }}
                      className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-lg transition-all"
                      title="Duplicate"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteVersion(v.id); }}
                      disabled={versions.length <= 1}
                      className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all disabled:opacity-30"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-6 shadow-sm dark:shadow-none border border-slate-100 dark:border-slate-800 transition-colors duration-200">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <Layout className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
              Choose Template
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {Object.values(TemplateType).map((type) => (
                <button
                  key={type}
                  onClick={() => setActiveTemplate(type)}
                  className={cn(
                    "p-3 sm:p-4 rounded-xl border-2 text-left transition-all group relative overflow-hidden",
                    activeTemplate === type
                      ? "border-indigo-600 dark:border-indigo-500 bg-indigo-50/50 dark:bg-indigo-500/10"
                      : "border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50"
                  )}
                >
                  <div className="flex justify-between items-center">
                    <span className={cn(
                      "text-[10px] sm:text-xs font-black uppercase tracking-widest",
                      activeTemplate === type ? "text-indigo-600 dark:text-indigo-400" : "text-slate-500 dark:text-slate-400"
                    )}>
                      {type}
                    </span>
                    {activeTemplate === type && <ChevronRight className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
                  </div>
                  <div className="mt-2 h-12 sm:h-16 w-full bg-slate-200 dark:bg-slate-700 rounded-lg group-hover:bg-slate-300 dark:group-hover:bg-slate-600 transition-colors"></div>
                </button>
              ))}
            </div>
          </section>

          <ResumeForm
            key={currentVersionId}
            data={data}
            onChange={updateData}
            activeTemplate={activeTemplate}
          />
        </div>

        {/* Right Column: Preview */}
        <div className={cn("lg:col-span-7", view === 'edit' && "hidden lg:block")}>
          <div className="lg:sticky lg:top-28">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Eye className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                Live Preview
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={handleExportWord}
                  className="p-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-lg transition-all"
                  title="Export to Word"
                >
                  <FileText className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="bg-slate-200 dark:bg-slate-800 rounded-2xl p-2 sm:p-8 shadow-inner overflow-hidden flex justify-center items-start min-h-[500px] sm:min-h-[800px] transition-colors duration-200">
              <div className="relative w-full flex justify-center py-4 sm:py-0">
                <div
                  className="shadow-2xl dark:shadow-slate-900/50 origin-top transition-transform duration-300"
                  style={{
                    height: 'calc(1123px * var(--preview-scale, 0.5))',
                    width: 'calc(794px * var(--preview-scale, 0.5))',
                  }}
                >
                  <div
                    id="resume-preview"
                    className="bg-white text-black" /* Explicitly keeping CV strictly white/light mode */
                    ref={previewRef}
                    style={{
                      height: '1123px',
                      width: '794px',
                      transform: 'scale(var(--preview-scale, 0.5))',
                      transformOrigin: 'top left'
                    }}
                  >
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeTemplate}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="h-full w-full"
                      >
                        {renderTemplate()}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>

            <style dangerouslySetInnerHTML={{
              __html: `
              :root { --preview-scale: 0.42; }
              @media (min-width: 400px) { :root { --preview-scale: 0.48; } }
              @media (min-width: 640px) { :root { --preview-scale: 0.65; } }
              @media (min-width: 768px) { :root { --preview-scale: 0.85; } }
              @media (min-width: 1024px) { :root { --preview-scale: 0.75; } }
              @media (min-width: 1280px) { :root { --preview-scale: 0.9; } }
            `}} />

            <p className="text-center text-slate-400 dark:text-slate-500 text-[10px] sm:text-xs mt-8 font-medium italic">
              * Preview is scaled down. Exported PDF will be full size (A4).
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-12 mt-20 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex justify-center items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-slate-900 dark:bg-indigo-600 rounded-lg flex items-center justify-center">
              <FileText className="text-white w-4 h-4" />
            </div>
            <span className="text-lg font-black tracking-tighter text-slate-900 dark:text-white">CraftCV</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto mb-8">
            The ultimate AI-powered resume builder. Create professional, stylized, and ATS-friendly resumes in minutes.
          </p>
          <div className="flex justify-center gap-6 text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-widest">
            <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Terms</a>
            <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Support</a>
          </div>
        </div>
      </footer>

      {/* Reset Modal */}
      {isResetModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-sm w-full animate-in fade-in zoom-in duration-200">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-5">
              <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Reset Resume Data</h3>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
              Are you absolute sure? All text, AI structures, and custom sections will be permanently erased.
            </p>
            <div className="flex justify-end gap-3 font-bold text-sm">
              <button
                onClick={() => setIsResetModalOpen(false)}
                className="px-5 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmReset}
                className="px-5 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white shadow-lg shadow-red-200 dark:shadow-red-900/20 transition-all active:scale-95"
              >
                Yes, reset it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

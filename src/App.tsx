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
import { LandingPage } from './components/landing/LandingPage';

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
  const [fontSize, setFontSize] = useState<number>(() => {
    const saved = localStorage.getItem('craftcv_fontsize');
    return saved ? parseInt(saved, 10) : 13;
  });
  const [previewZoom, setPreviewZoom] = useState<number>(() => {
    const saved = localStorage.getItem('craftcv_zoom');
    return saved ? parseFloat(saved) : 0.55;
  });
  const setZoom = (z: number) => {
    const clamped = Math.min(1.2, Math.max(0.3, z));
    setPreviewZoom(clamped);
    localStorage.setItem('craftcv_zoom', String(clamped));
  };
  const [view, setView] = useState<'edit' | 'preview'>('edit');
  const [viewMode, setViewMode] = useState<'landing' | 'builder'>('landing');
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
    const props: TemplateProps = { data, onChange: updateData, resolvedProfileImageUrl: resolvedProfileImageUrl ?? undefined, fontSize };
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

  if (viewMode === 'landing') {
    return <LandingPage onBuildResume={() => setViewMode('builder')} />;
  }

  return (
    <div className="min-h-screen bg-background font-sans text-foreground transition-colors duration-300 overflow-x-hidden selection:bg-primary/20">
      {/* Premium Glass Header */}
      <motion.nav 
        initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 bg-background/70 backdrop-blur-xl border-b border-border/50 px-4 sm:px-6 py-4 shadow-sm"
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <FileText className="text-primary-foreground w-6 h-6" />
            </div>
            <div className="hidden sm:block cursor-pointer" onClick={() => setViewMode('landing')}>
              <h1 className="text-xl font-bold tracking-tight text-foreground">CraftCV</h1>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">AI Resume Builder</p>
            </div>
          </div>

          <div className="flex items-center bg-secondary/80 p-1 rounded-xl lg:hidden">
            <button
              onClick={() => setView('edit')}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2",
                view === 'edit' ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Layout className="w-4 h-4" />
              Build
            </button>
            <button
              onClick={() => setView('preview')}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2",
                view === 'preview' ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Eye className="w-4 h-4" />
              Preview
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2.5 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-xl transition-all"
              title="Toggle Theme"
            >
              <motion.div initial={false} animate={{ rotate: isDark ? 180 : 0 }} transition={{ duration: 0.3 }}>
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </motion.div>
            </button>
            <button
              onClick={resetData}
              className="px-4 py-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl text-sm font-bold transition-all hidden sm:flex items-center gap-2"
              title="Reset Document"
            >
              <Trash2 className="w-4 h-4" />
              Reset
            </button>
            <button
              onClick={handleExportPDF}
              className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-bold inline-flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export PDF</span>
            </button>
          </div>
        </div>
      </motion.nav>

      <main className="max-w-7xl mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 mt-4">
        {/* Left Column: Editor & Options */}
        <motion.div 
          initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.1 }}
          className={cn("lg:col-span-5 space-y-8", view === 'preview' && "hidden lg:block")}
        >
          {/* Versions & Template Cards */}
          <div className="grid grid-cols-1 gap-6">
            <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Your Resumes
                </h2>
                <button
                  onClick={createVersion}
                  className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-all"
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
                      "group p-3 rounded-xl border transition-all flex items-center justify-between cursor-pointer",
                      currentVersionId === v.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-border/80 bg-background"
                    )}
                    onClick={() => setCurrentVersionId(v.id)}
                  >
                    <div className="flex-1 min-w-0 pr-2">
                      <input
                        type="text"
                        value={v.name}
                        onChange={(e) => renameVersion(v.id, e.target.value)}
                        className="bg-transparent border-none p-0 text-sm font-bold text-foreground focus:ring-0 w-full truncate outline-none"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <p className="text-[10px] text-muted-foreground font-medium mt-1">
                        Modified {new Date(v.lastModified).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={(e) => { e.stopPropagation(); duplicateVersion(v.id); }} className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all" title="Duplicate"><Copy className="w-3.5 h-3.5" /></button>
                      <button onClick={(e) => { e.stopPropagation(); deleteVersion(v.id); }} disabled={versions.length <= 1} className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all disabled:opacity-30" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
              <h2 className="text-lg font-bold text-foreground mb-5 flex items-center gap-2">
                <Layout className="w-5 h-5 text-primary" />
                Template & Style
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {Object.values(TemplateType).map((type) => (
                  <button
                    key={type}
                    onClick={() => setActiveTemplate(type)}
                    className={cn(
                      "p-4 rounded-xl border-2 text-left transition-all group relative overflow-hidden",
                      activeTemplate === type
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50 bg-secondary/30"
                    )}
                  >
                    <div className="flex justify-between items-center z-10 relative">
                      <span className={cn(
                        "text-xs font-bold uppercase tracking-widest",
                        activeTemplate === type ? "text-primary" : "text-muted-foreground"
                      )}>
                        {type}
                      </span>
                      {activeTemplate === type && <ChevronRight className="w-4 h-4 text-primary" />}
                    </div>
                    {activeTemplate === type && (
                      <motion.div layoutId="templateOutline" className="absolute inset-0 border-2 border-primary rounded-xl" initial={false} transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />
                    )}
                  </button>
                ))}
              </div>

              {/* Font Size Control */}
              <div className="mt-6 flex items-center justify-between gap-4 bg-secondary/50 p-3 rounded-xl">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap">Text Size</span>
                <div className="flex items-center gap-3 flex-1">
                  <button onClick={() => { const v = Math.max(10, fontSize - 1); setFontSize(v); localStorage.setItem('craftcv_fontsize', String(v)); }} className="w-8 h-8 rounded-lg bg-background text-foreground shadow-sm font-bold hover:bg-border transition-all flex items-center justify-center text-lg">−</button>
                  <input type="range" min={10} max={18} step={1} value={fontSize} onChange={(e) => { const v = Number(e.target.value); setFontSize(v); localStorage.setItem('craftcv_fontsize', String(v)); }} className="flex-1 accent-primary h-2 rounded-full cursor-pointer bg-border outline-none appearance-none" />
                  <button onClick={() => { const v = Math.min(18, fontSize + 1); setFontSize(v); localStorage.setItem('craftcv_fontsize', String(v)); }} className="w-8 h-8 rounded-lg bg-background text-foreground shadow-sm font-bold hover:bg-border transition-all flex items-center justify-center text-lg">+</button>
                  <span className="text-xs font-bold text-primary w-8 text-right">{fontSize}px</span>
                </div>
              </div>
            </div>
          </div>

          <ResumeForm
            key={currentVersionId}
            data={data}
            onChange={updateData}
            activeTemplate={activeTemplate}
          />
        </motion.div>

        {/* Right Column: Preview — sticky, never scrolls with page */}
        <motion.div
          initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}
          className={cn('lg:col-span-7', view === 'edit' && 'hidden lg:block')}
          style={{ position: 'sticky', top: '5.5rem', height: 'calc(100vh - 6rem)', display: 'flex', flexDirection: 'column' }}
        >
          {/* Header row */}
          <div className="flex justify-between items-center mb-3 shrink-0">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <Eye className="w-4 h-4 text-primary" /> Live Preview
            </h2>
            <div className="flex items-center gap-1">
              {/* Zoom controls */}
              <button onClick={() => setZoom(previewZoom - 0.1)} className="w-7 h-7 rounded-lg bg-secondary text-foreground font-bold hover:bg-border transition-all flex items-center justify-center text-sm" title="Zoom out">−</button>
              <span className="text-xs font-bold text-primary w-10 text-center">{Math.round(previewZoom * 100)}%</span>
              <button onClick={() => setZoom(previewZoom + 0.1)} className="w-7 h-7 rounded-lg bg-secondary text-foreground font-bold hover:bg-border transition-all flex items-center justify-center text-sm" title="Zoom in">+</button>
              <button onClick={() => setZoom(0.55)} className="px-2 h-7 rounded-lg bg-secondary text-muted-foreground text-xs font-bold hover:bg-border transition-all ml-1" title="Reset zoom">Fit</button>
              <div className="w-px h-5 bg-border mx-2" />
              <button
                onClick={handleExportWord}
                className="px-3 py-1.5 text-xs font-bold text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5" /> DOCX
              </button>
            </div>
          </div>

          {/* Scrollable / pannable preview area */}
          <div
            className="flex-1 rounded-2xl border border-border/50 bg-secondary/30 shadow-inner relative overflow-auto"
            style={{ cursor: 'grab' }}
          >
            {/* dot-grid bg */}
            <div className="absolute inset-0 pointer-events-none opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, var(--color-border, #666) 1px, transparent 0)', backgroundSize: '20px 20px' }} />
            {/* Sized wrapper so scrollbars know the scrollable area */}
            <div style={{ width: 794 * previewZoom + 32, minHeight: 1123 * previewZoom + 32, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '16px', boxSizing: 'border-box' }}>
              <div
                className="shadow-2xl shadow-black/20 dark:shadow-black/60 ring-1 ring-border/50 bg-white rounded-sm"
                style={{ width: 794 * previewZoom, height: 1123 * previewZoom, position: 'relative', flexShrink: 0, overflow: 'hidden' }}
              >
                <div
                  id="resume-preview"
                  ref={previewRef}
                  className="bg-white text-black"
                  style={{ width: '794px', height: '1123px', transform: `scale(${previewZoom})`, transformOrigin: 'top left' }}
                >
                  <AnimatePresence mode="wait">
                    <motion.div key={activeTemplate} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="h-full w-full">
                      {renderTemplate()}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>

          <p className="text-center text-muted-foreground text-[10px] mt-2 shrink-0">
            Scroll inside to pan · Use − / + to zoom
          </p>
        </motion.div>
      </main>

      {/* Modern Footer */}
      <footer className="bg-card border-t border-border py-16 mt-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
          <div className="flex justify-center items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <FileText className="text-primary-foreground w-6 h-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-foreground">CraftCV</span>
          </div>
          <p className="text-muted-foreground text-sm max-w-md text-center mb-8 leading-relaxed">
            The ultimate AI-powered resume builder. Create professional, stylized, and beautifully designed resumes in minutes.
          </p>
          <div className="flex gap-8 text-muted-foreground text-xs font-bold uppercase tracking-widest">
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Support</a>
          </div>
        </div>
      </footer>

      {/* Reset Modal */}
      <AnimatePresence>
        {isResetModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsResetModalOpen(false)} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-card p-8 rounded-3xl shadow-2xl shadow-black/20 border border-border max-w-sm w-full relative z-10"
            >
              <div className="w-14 h-14 rounded-2xl bg-destructive/10 flex items-center justify-center mb-6">
                <Trash2 className="w-7 h-7 text-destructive" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3 tracking-tight">Erase everything?</h3>
              <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
                This action cannot be undone. All text, history, and generated sections for this version will be permanently deleted.
              </p>
              <div className="flex justify-end gap-3">
                <button onClick={() => setIsResetModalOpen(false)} className="px-5 py-2.5 rounded-xl text-sm font-bold text-foreground hover:bg-secondary transition-colors">Cancel</button>
                <button onClick={confirmReset} className="px-5 py-2.5 rounded-xl bg-destructive hover:bg-destructive/90 text-destructive-foreground text-sm font-bold shadow-lg shadow-destructive/20 transition-all active:scale-95">Yes, delete it</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

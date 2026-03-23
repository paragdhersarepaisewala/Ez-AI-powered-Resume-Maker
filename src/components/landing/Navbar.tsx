import React from 'react';
import { motion } from 'motion/react';

interface NavbarProps {
  onBuildResume: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onBuildResume }) => {
  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 w-full z-50 bg-white/5 dark:bg-[#0e0e10]/40 backdrop-blur-xl border-b border-white/10 shadow-[0_8px_32px_0_rgba(99,102,241,0.1)]"
    >
      <div className="flex justify-between items-center w-full px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-8">
          <a className="text-2xl font-black tracking-tighter text-white bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#a855f7] font-headline" href="#">
            CraftCV
          </a>
          <div className="hidden md:flex items-center gap-6 font-headline font-bold tracking-tight">
            <a className="text-white border-b-2 border-[#6366f1] pb-1" href="#templates">Templates</a>
            <a className="text-slate-400 hover:text-white transition-colors" href="#features">Features</a>
            <a className="text-slate-400 hover:text-white transition-colors" href="#pricing">Pricing</a>
            <a className="text-slate-400 hover:text-white transition-colors" href="#ai-builder">AI Builder</a>
          </div>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBuildResume}
          className="bg-gradient-to-br from-[#6366f1] to-[#a855f7] text-white px-6 py-2.5 rounded-full font-bold shadow-lg shadow-indigo-500/20"
        >
          Build Resume
        </motion.button>
      </div>
    </motion.nav>
  );
};

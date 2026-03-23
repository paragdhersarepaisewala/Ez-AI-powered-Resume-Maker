import React from 'react';
import { Globe, AtSign } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0e0e10] w-full py-12 border-t border-white/5 mt-20 relative z-10">
      <div className="flex flex-col md:flex-row justify-between items-center px-8 max-w-7xl mx-auto gap-8">
        <div className="flex flex-col items-center md:items-start gap-4">
          <span className="text-lg font-bold text-white font-headline tracking-tight">CraftCV</span>
          <p className="font-body text-sm text-slate-500">© 2024 CraftCV. The Digital Alchemist.</p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-8">
          <a className="text-slate-500 hover:text-[#a855f7] transition-colors text-sm font-body" href="#">Privacy Policy</a>
          <a className="text-slate-500 hover:text-[#a855f7] transition-colors text-sm font-body" href="#">Terms of Service</a>
          <a className="text-slate-500 hover:text-[#a855f7] transition-colors text-sm font-body" href="#">Contact Support</a>
          <a className="text-slate-500 hover:text-[#a855f7] transition-colors text-sm font-body" href="#">Affiliates</a>
        </div>
        
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer text-slate-400 hover:text-white">
            <Globe className="size-5" />
          </div>
          <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer text-slate-400 hover:text-white">
            <AtSign className="size-5" />
          </div>
        </div>
      </div>
    </footer>
  );
};

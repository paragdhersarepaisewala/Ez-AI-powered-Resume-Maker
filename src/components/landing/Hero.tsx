import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Zap, Palette } from 'lucide-react';

interface HeroProps {
  onBuildResume: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onBuildResume }) => {
  return (
    <section className="relative w-full max-w-7xl mx-auto px-6 py-32 lg:py-40 grid lg:grid-cols-2 gap-16 items-center">
      {/* Ambient Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="z-10 text-left"
      >
        <h1 className="font-headline font-bold text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[1.1] mb-8 text-white">
          Craft Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#6366f1] to-[#a855f7]">Dream Resume</span> with AI
        </h1>
        <p className="text-slate-400 text-xl md:text-2xl max-w-xl mb-12 leading-relaxed font-body">
          Unleash the power of AI to land your dream job in record time. Professional, ATS-ready documents crafted in seconds.
        </p>
        <div className="flex flex-wrap gap-6">
          <motion.button 
            whileHover={{ scale: 1.05, boxShadow: "0px 0px 30px rgba(99,102,241,0.5)" }}
            whileTap={{ scale: 0.95 }}
            onClick={onBuildResume}
            className="bg-gradient-to-r from-[#6366f1] to-[#a855f7] px-8 py-4 rounded-full font-bold text-lg text-white"
          >
            Get Started Free
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-[1px] rounded-full overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#6366f1] to-[#a855f7]"></div>
            <div className="relative px-8 py-4 rounded-full bg-[#0e0e10] hover:bg-[#131315] transition-colors">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#6366f1] to-[#a855f7] font-bold text-lg">View Templates</span>
            </div>
          </motion.button>
        </div>
      </motion.div>

      {/* 3D Floating Elements */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
        animate={{ opacity: 1, scale: 1, rotateY: -15, rotateX: 10, y: [0, -20, 0] }}
        transition={{ 
          opacity: { duration: 1 }, 
          scale: { duration: 1 }, 
          y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
        }}
        className="hidden lg:block relative perspective-1000 z-10"
      >
         <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-500/30 blur-3xl rounded-full"></div>
         <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-500/30 blur-3xl rounded-full"></div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 w-full max-w-lg mx-auto shadow-[-20px_20px_60px_rgba(99,102,241,0.2)]">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-full bg-slate-800 overflow-hidden border border-white/10">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5BQ1_GPcQI3BF1mPrSI-MfFE1GNZLnBcKe1mDX3Iv4Bsvf64K241gMARo1ely8tE260iOB5Zdof55rod8qqUOHx4giMJSEYpQ4NEYsBDpyxm29_IlgRMEeAWpKIw0Hbic82CZh2fosJfcrIFfk8IyFASGhjPNWF4mTvSs6zfCiW4_DsClNcO_MrNqaD8ce6l7Wh1LH__EoQXUIY-YbwqIoVu4lTzhfs6O9X1OStgbLWLVtDuaZ5MVsRoLCTKOsfcoEWEclAmQ0Uc4" alt="Portrait" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="h-4 w-32 bg-indigo-400/40 rounded-full mb-2"></div>
              <div className="h-3 w-20 bg-slate-600 rounded-full"></div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="h-2 w-full bg-white/10 rounded-full"></div>
            <div className="h-2 w-full bg-white/10 rounded-full"></div>
            <div className="h-2 w-3/4 bg-white/10 rounded-full"></div>
            
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="h-20 bg-white/5 border border-white/5 rounded-xl flex flex-col justify-center px-4">
                <Zap className="text-cyan-400 mb-2" size={20} />
                <div className="h-1.5 w-full bg-cyan-400/20 rounded-full"></div>
              </div>
              <div className="h-20 bg-white/5 border border-white/5 rounded-xl flex flex-col justify-center px-4">
                <Sparkles className="text-purple-400 mb-2" size={20} />
                <div className="h-1.5 w-full bg-purple-400/20 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

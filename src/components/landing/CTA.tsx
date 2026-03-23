import React from 'react';
import { motion } from 'motion/react';

interface CTAProps {
  onBuildResume: () => void;
}

export const CTA: React.FC<CTAProps> = ({ onBuildResume }) => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20 w-full">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative rounded-3xl overflow-hidden bg-[#131315] border border-white/10 p-12 md:p-20 text-center"
      >
        {/* Background pattern */}
        <div 
          className="absolute inset-0 opacity-10" 
          style={{ backgroundImage: 'radial-gradient(#6366f1 2px, transparent 2px)', backgroundSize: '32px 32px' }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e10] to-transparent opacity-80"></div>
        
        <div className="relative z-10 flex flex-col items-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-400 text-sm font-label font-bold tracking-widest uppercase mb-6 border border-indigo-500/20">
            World-Class Careers
          </span>
          <h2 className="font-headline font-bold text-4xl md:text-6xl mb-8 text-white">
            Join 10,000+ professionals
          </h2>
          <p className="text-slate-400 text-lg mb-12 max-w-xl mx-auto leading-relaxed">
            Stop wasting hours on formatting. Focus on your interview prep while CraftCV handles the rest.
          </p>
          <motion.button 
            whileHover={{ scale: 1.05, boxShadow: "0px 0px 50px rgba(168,85,247,0.5)" }}
            whileTap={{ scale: 0.95 }}
            onClick={onBuildResume}
            className="bg-gradient-to-r from-[#6366f1] to-[#a855f7] px-10 py-5 rounded-full font-bold text-xl text-white shadow-lg"
          >
            Start Building Now
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
};

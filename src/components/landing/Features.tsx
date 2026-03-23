import React from 'react';
import { motion } from 'motion/react';
import { BrainCircuit, FileCheck2, LayoutTemplate } from 'lucide-react';

const featureItems = [
  {
    title: "AI Text Generation",
    description: "Smart algorithms that highlight your best achievements and quantify your impact automatically.",
    icon: <BrainCircuit className="text-indigo-400 size-8" />,
    color: "bg-indigo-500/10 border-indigo-500/20"
  },
  {
    title: "ATS Optimized",
    description: "Built-in checking systems ensure your resume passes through every automated gatekeeper with ease.",
    icon: <FileCheck2 className="text-cyan-400 size-8" />,
    color: "bg-cyan-500/10 border-cyan-500/20"
  },
  {
    title: "Beautiful Templates",
    description: "Choose from dozens of designer-crafted layouts that project authority and modern professionalism.",
    icon: <LayoutTemplate className="text-purple-400 size-8" />,
    color: "bg-purple-500/10 border-purple-500/20"
  }
];

export const Features: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-24" id="features">
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <h2 className="font-headline font-bold text-4xl md:text-5xl mb-4 text-white">Engineered for Success</h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
          Our AI doesn't just write; it builds professional narratives that recruiters love.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8">
        {featureItems.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.15 }}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8"
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border ${feature.color}`}>
              {feature.icon}
            </div>
            <h3 className="font-headline font-bold text-2xl mb-4 text-white">{feature.title}</h3>
            <p className="text-slate-400 leading-relaxed font-body">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

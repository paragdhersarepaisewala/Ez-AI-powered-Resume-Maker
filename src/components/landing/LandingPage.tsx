import React from 'react';
import { Navbar } from './Navbar';
import { Hero } from './Hero';
import { Features } from './Features';
import { CTA } from './CTA';
import { Footer } from './Footer';

interface LandingPageProps {
  onBuildResume: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onBuildResume }) => {
  return (
    <div className="min-h-screen bg-[#0e0e10] text-slate-100 font-body selection:bg-indigo-500/30 selection:text-indigo-200 overflow-x-hidden">
      <Navbar onBuildResume={onBuildResume} />
      
      <main className="relative pt-24 pb-0 flex flex-col items-center w-full">
        <Hero onBuildResume={onBuildResume} />
        <Features />
        <CTA onBuildResume={onBuildResume} />
      </main>
      
      <Footer />
    </div>
  );
};

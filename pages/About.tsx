import React from 'react';
import { useData } from '../context/MockBackend';
import { ProtectedImage } from '../components/ui/SecureMedia';
import { RefreshCw, ShieldCheck, Zap } from 'lucide-react';

const About: React.FC = () => {
  const { aboutConfig } = useData();

  if (!aboutConfig) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-black">
        <RefreshCw className="w-10 h-10 text-crimson-600 animate-spin mb-4" />
        <p className="text-neutral-500 font-serif italic animate-pulse">Establishing Sanctum Connection...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-20 md:py-32">
      {/* Header Section */}
      <div className="text-center mb-20 animate-in fade-in duration-700">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="h-px w-12 bg-crimson-900/40"></div>
          <span className="text-[10px] uppercase tracking-[0.5em] text-crimson-600 font-bold">The Origin Protocol</span>
          <div className="h-px w-12 bg-crimson-900/40"></div>
        </div>
        <h1 className="text-5xl md:text-8xl font-serif text-white tracking-tight">{aboutConfig.title}</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        {/* Left Side: Portrait */}
        <div className="lg:col-span-5 animate-in slide-in-from-left duration-1000">
          <div className="relative group">
            <div className="absolute -inset-4 bg-crimson-900/10 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-all duration-1000"></div>
            <div className="relative border border-white/10 p-4 rounded-sm bg-neutral-900/20 backdrop-blur-sm shadow-2xl">
              <div className="relative aspect-[4/5] overflow-hidden border border-crimson-900/30">
                <ProtectedImage 
                  src={aboutConfig.profileImage} 
                  alt="The Goddess" 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              </div>
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-crimson-800 -translate-x-1 -translate-y-1"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-crimson-800 translate-x-1 translate-y-1"></div>
            </div>
            <div className="mt-8 flex flex-col items-center">
              <span className="text-white font-serif text-xl italic tracking-widest">Aradhya</span>
              <span className="text-[8px] uppercase tracking-[0.3em] text-neutral-500 font-bold">Divine Sovereign</span>
            </div>
          </div>
        </div>

        {/* Right Side: Manifesto */}
        <div className="lg:col-span-7 space-y-8 animate-in slide-in-from-right duration-1000 delay-200">
          <div className="flex items-center gap-3 mb-2">
             <ShieldCheck className="w-5 h-5 text-crimson-600" />
             <h3 className="text-xs uppercase tracking-[0.3em] font-bold text-neutral-400">Biological Manifesto</h3>
          </div>
          <div className="space-y-6 text-neutral-300 font-light text-lg leading-relaxed font-sans">
            {aboutConfig.paragraphs.map((para, i) => (
              <p key={i} className={i === 0 ? "text-xl text-white font-serif italic border-l-2 border-crimson-900 pl-6 py-2" : ""}>
                {para}
              </p>
            ))}
          </div>
          <div className="pt-12 border-t border-white/5">
            <div className="flex items-center gap-3 mb-8">
               <Zap className="w-4 h-4 text-crimson-600" />
               <h3 className="text-sm font-serif text-white tracking-widest uppercase">Sacred Pillars</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12">
              {aboutConfig.values.map((item, idx) => (
                <div key={idx} className="flex items-start space-x-4 group">
                  <span className="text-crimson-900 font-serif text-2xl leading-none opacity-40 group-hover:opacity-100 transition-all">0{idx + 1}</span>
                  <div>
                    <span className="block text-xs uppercase tracking-[0.2em] text-neutral-400 font-bold mb-1 group-hover:text-crimson-500 transition-colors">{item}</span>
                    <span className="text-[10px] text-neutral-600 uppercase tracking-widest">Protocol Established</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="pt-12 italic text-neutral-500 font-serif text-lg opacity-40">
            "I do not seek followers; I demand devotion."
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;

import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { useData } from '../context/MockBackend';
import { RefreshCw } from 'lucide-react';

const Services: React.FC = () => {
  const { servicesConfig } = useData();

  if (!servicesConfig) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-black">
        <RefreshCw className="w-10 h-10 text-crimson-600 animate-spin mb-4" />
        <p className="text-neutral-500 font-serif italic animate-pulse">Establishing Sanctum Connection...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <h1 className="text-4xl md:text-6xl font-serif text-center mb-2 text-white">{servicesConfig.title}</h1>
      <h2 className="text-xl md:text-2xl font-serif text-center mb-8 text-crimson-600 italic">{servicesConfig.subtitle}</h2>
      <p className="text-center text-neutral-400 mb-16 max-w-2xl mx-auto leading-relaxed">
        {servicesConfig.mainDescription}
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {servicesConfig.servicesList.map((service, index) => (
          <div key={index} className="bg-neutral-900/50 border border-white/5 p-8 hover:border-crimson-900/50 transition-colors group flex flex-col hover:bg-neutral-900">
            <h3 className="text-2xl font-serif text-white mb-3 group-hover:text-crimson-500 transition-colors">{service.title}</h3>
            <div className="w-12 h-1 bg-neutral-800 group-hover:bg-crimson-900 mb-4 transition-colors"></div>
            <p className="text-neutral-400 mb-6 flex-grow leading-relaxed font-light">{service.description}</p>
            <div className="flex justify-end items-center border-t border-white/5 pt-6 mt-auto">
              <Link to="/contact">
                <span className="text-xs uppercase tracking-widest text-crimson-500 hover:text-white transition-colors cursor-pointer border border-crimson-900/50 px-4 py-2 rounded hover:bg-crimson-900">
                  Beg for Audience
                </span>
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-20 text-center bg-neutral-900 p-12 border border-white/5 rounded-lg">
        <h3 className="text-2xl font-serif text-white mb-4">{servicesConfig.footerTitle}</h3>
        <p className="text-neutral-500 mb-8 max-w-xl mx-auto">
          {servicesConfig.footerDescription}
        </p>
        <Link to="/contact">
          <Button>Book a Custom Consultation</Button>
        </Link>
      </div>
    </div>
  );
};

export default Services;

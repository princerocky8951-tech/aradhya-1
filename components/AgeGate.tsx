import React, { useEffect, useState } from 'react';
import { ShieldAlert } from 'lucide-react';

const AgeGate: React.FC = () => {
  const [accepted, setAccepted] = useState(true); // Default true to avoid flash, check useEffect

  useEffect(() => {
    const hasAccepted = localStorage.getItem('aradhya_age_gate');
    setAccepted(hasAccepted === 'true');
  }, []);

  const handleAccept = () => {
    localStorage.setItem('aradhya_age_gate', 'true');
    setAccepted(true);
  };

  const handleDecline = () => {
    window.location.href = 'https://www.google.com';
  };

  if (accepted) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black bg-opacity-95 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-neutral-900 border border-crimson-900/50 p-8 rounded-lg shadow-2xl text-center">
        <ShieldAlert className="w-16 h-16 text-crimson-700 mx-auto mb-6" />
        <h1 className="text-3xl font-serif text-white mb-4">Age Verification</h1>
        <p className="text-neutral-400 mb-8">
          This website contains adult themes and BDSM content intended for mature audiences only. 
          By entering, you confirm that you are at least 18 years of age.
        </p>
        <div className="flex flex-col gap-4">
          <button 
            onClick={handleAccept}
            className="w-full bg-crimson-900 hover:bg-crimson-800 text-white py-3 rounded uppercase tracking-widest text-sm font-semibold transition-colors"
          >
            I am 18+ - Enter
          </button>
          <button 
            onClick={handleDecline}
            className="w-full bg-transparent border border-neutral-700 text-neutral-500 hover:text-white py-3 rounded uppercase tracking-widest text-sm font-semibold transition-colors"
          >
            Exit
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgeGate;
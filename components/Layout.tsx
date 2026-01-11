import React, { ReactNode } from 'react';
import Navbar from './Navbar';
import AgeGate from './AgeGate';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-black text-neutral-200 flex flex-col font-sans">
      <AgeGate />
      <Navbar />
      <main className="flex-grow pt-20">
        {children}
      </main>
      <footer className="bg-neutral-950 py-8 border-t border-neutral-900 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-neutral-500 text-sm font-serif">© 2024 Goddess Aradhya. All rights reserved.</p>
          <p className="text-neutral-700 text-xs mt-2 uppercase tracking-widest">18+ Adults Only</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Crown, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const links = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="fixed w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-2">
            <Crown className="w-6 h-6 text-crimson-700" />
            <span className="text-xl font-serif font-bold text-white tracking-widest">
              ARADHYA
            </span>
          </Link>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {links.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`${
                    location.pathname === link.path ? 'text-crimson-500' : 'text-neutral-400 hover:text-white'
                  } px-3 py-2 text-sm font-medium uppercase tracking-widest transition-colors`}
                >
                  {link.name}
                </Link>
              ))}
              
              {user ? (
                 <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-white/10">
                   <Link to="/dashboard" className="text-neutral-400 hover:text-white flex items-center space-x-2 transition-colors">
                     <UserIcon className="w-4 h-4" />
                     <span className="text-sm font-medium uppercase tracking-widest">Sanctum</span>
                   </Link>
                   <button onClick={logout} className="text-crimson-700 hover:text-crimson-500 text-sm font-medium uppercase tracking-widest transition-colors">
                     Exit
                   </button>
                 </div>
              ) : (
                <Link to="/login" className="ml-4 px-6 py-2 bg-crimson-900/20 border border-crimson-900/50 text-crimson-500 hover:bg-crimson-900/40 text-xs font-bold uppercase tracking-widest rounded transition-all">
                  Login
                </Link>
              )}
            </div>
          </div>

          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-neutral-400 hover:text-white p-2"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-black border-b border-white/10 animate-in slide-in-from-top duration-300">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {links.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="text-neutral-300 hover:text-white block px-3 py-2 text-base font-medium uppercase tracking-wider"
              >
                {link.name}
              </Link>
            ))}
             {user ? (
                <>
                  <Link to="/dashboard" onClick={() => setIsOpen(false)} className="text-neutral-300 hover:text-white block px-3 py-2 text-base font-medium uppercase tracking-wider">Sanctum</Link>
                  <button onClick={() => { logout(); setIsOpen(false); }} className="text-crimson-500 block px-3 py-2 text-base font-medium uppercase tracking-wider w-full text-left">Exit</button>
                </>
             ) : (
               <Link to="/login" onClick={() => setIsOpen(false)} className="text-crimson-500 block px-3 py-2 text-base font-medium uppercase tracking-wider">Login</Link>
             )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

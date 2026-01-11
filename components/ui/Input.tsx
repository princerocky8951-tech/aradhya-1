import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input: React.FC<InputProps> = ({ label, className = '', ...props }) => {
  return (
    <div className="w-full">
      {label && <label className="block text-neutral-400 text-xs uppercase tracking-wider mb-2">{label}</label>}
      <input 
        className={`w-full bg-neutral-900 border border-neutral-800 focus:border-crimson-900/50 text-neutral-200 px-4 py-3 rounded outline-none transition-colors ${className}`}
        {...props}
      />
    </div>
  );
};

export default Input;
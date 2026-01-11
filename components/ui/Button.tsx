import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  const baseStyle = "px-6 py-3 rounded font-medium transition-all duration-300 uppercase tracking-wider text-xs md:text-sm";
  const variants = {
    primary: "bg-crimson-900 hover:bg-crimson-800 text-white shadow-[0_0_15px_rgba(153,27,27,0.3)] hover:shadow-[0_0_20px_rgba(153,27,27,0.5)]",
    secondary: "bg-neutral-800 hover:bg-neutral-700 text-white",
    outline: "border border-crimson-900/50 text-crimson-500 hover:text-crimson-400 hover:border-crimson-700"
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', ...props }) => {
  const baseClasses = "font-bold rounded-lg shadow-lg focus:outline-none focus:ring-4 focus:ring-opacity-50 transition-all duration-300 ease-in-out transform disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center gap-2";

  const variantClasses = {
    primary: "bg-amber-700 text-stone-900 py-3 px-8 shadow-amber-900/50 hover:bg-amber-600 focus:ring-amber-500 hover:scale-105 disabled:bg-stone-700 disabled:text-stone-400",
    secondary: "bg-stone-700/50 border border-stone-600 w-full text-stone-300 py-2 px-4 hover:bg-stone-700 hover:border-stone-500 focus:ring-stone-600 disabled:bg-stone-800 disabled:text-stone-500 disabled:border-stone-700",
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
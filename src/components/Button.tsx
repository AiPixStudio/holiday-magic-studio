import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({ children, className, variant = 'primary', ...props }) => {
  const baseStyles = "inline-flex items-center justify-center px-6 py-3 text-[17px] font-semibold rounded-[12px] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E3CE8A] focus:ring-offset-[#F7F2E9] transition-all duration-300 min-w-[140px]";
  
  // Primary: Cream Gold background, Charcoal text (for contrast)
  const primaryStyles = "bg-[#E3CE8A] text-[#565A7C] hover:bg-[#CBB575] shadow-sm border border-transparent";
  
  // Secondary: Transparent bg, Cream Gold border, Cream Gold text
  const secondaryStyles = "bg-transparent border border-[#E3CE8A] text-[#E3CE8A] hover:text-[#CBB575] hover:border-[#CBB575]";

  return (
    <button
      className={`${baseStyles} ${variant === 'primary' ? primaryStyles : secondaryStyles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
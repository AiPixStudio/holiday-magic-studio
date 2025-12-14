import React from 'react';

const Spinner: React.FC<{className?: string}> = ({className}) => {
  return (
    <div className={`flex flex-col items-center justify-center gap-2 ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#E3CE8A]"></div>
        <p className="text-[#E3CE8A] text-xs font-medium uppercase tracking-wide">Creating Magic...</p>
    </div>
  );
};

export default Spinner;
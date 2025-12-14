import React from 'react';

interface SelectControlProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  disabled?: boolean;
}

const SelectControl: React.FC<SelectControlProps> = ({ label, value, options, onChange, disabled = false }) => {
  // Use a simple formatting function or just return the option as-is
  const formattedLabel = (option: string) => option; 

  return (
    <div>
      <label className="block text-[13px] font-medium text-[#565A7C] font-['Montserrat'] mb-2">{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        disabled={disabled}
        className={`w-full bg-[#FAF5EC] border border-[#E8E1D6] rounded-xl px-4 py-3 text-[#565A7C] text-[15px] focus:ring-1 focus:ring-[#E3CE8A] focus:border-[#E3CE8A] outline-none font-['Montserrat'] ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
      >
        {options.map(option => (
          <option key={option} value={option} className="bg-white text-[#565A7C]">
            {formattedLabel(option)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectControl;

import React from 'react';

interface NumberInputProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  prefix?: string;
  helpText?: string;
  placeholder?: string;
}

const NumberInput: React.FC<NumberInputProps> = ({ 
  label, 
  value, 
  onChange, 
  prefix = "R", 
  helpText, 
  placeholder = "0" 
}) => {
  return (
    <div className="mb-6">
      <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-widest leading-tight min-h-[1.5em]">
        {label}
      </label>
      <div className="relative rounded-2xl">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          <span className="text-orange-500 font-black text-sm">{prefix}</span>
        </div>
        <input
          type="number"
          value={value === 0 ? '' : value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="block w-full rounded-2xl border-0 py-4 pl-12 pr-4 text-slate-900 bg-white ring-1 ring-inset ring-slate-200 placeholder:text-slate-300 focus:ring-2 focus:ring-inset focus:ring-[#ff4d29] sm:text-sm transition-all hover:ring-slate-300 font-bold"
          placeholder={placeholder}
        />
      </div>
      {helpText && <p className="mt-2 text-[10px] text-slate-400 font-bold italic tracking-tight opacity-70 pl-1">{helpText}</p>}
    </div>
  );
};

export default NumberInput;

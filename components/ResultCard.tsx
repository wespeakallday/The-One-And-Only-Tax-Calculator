
import React from 'react';

interface ResultCardProps {
  label: string;
  value: number;
  isCurrency?: boolean;
  isPercentage?: boolean;
  highlight?: boolean;
  subText?: string;
}

const ResultCard: React.FC<ResultCardProps> = ({ label, value, isCurrency = true, isPercentage = false, highlight = false, subText }) => {
  const formattedValue = isPercentage 
    ? `${value.toFixed(2)}%`
    : new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR', maximumFractionDigits: 0 }).format(value);

  return (
    <div className={`p-8 rounded-[2.5rem] border ${highlight ? 'bg-[#1a1a1a] border-slate-800 shadow-2xl shadow-slate-900/10' : 'bg-white border-slate-200 shadow-sm'} transition-all hover:translate-y-[-4px] hover:shadow-lg group relative overflow-hidden`}>
      {highlight && <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 rounded-full translate-x-12 -translate-y-12"></div>}
      <p className={`text-[10px] font-black uppercase tracking-[0.3em] mb-3 ${highlight ? 'text-orange-500' : 'text-slate-400'}`}>{label}</p>
      <p className={`text-3xl font-black tracking-tighter ${highlight ? 'text-white' : 'text-slate-900'}`}>{formattedValue}</p>
      {subText && <p className={`mt-4 text-[10px] font-bold uppercase tracking-widest ${highlight ? 'text-slate-500' : 'text-slate-400'}`}>{subText}</p>}
    </div>
  );
};

export default ResultCard;

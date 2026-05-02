import React from 'react';

interface EditModeToggleProps {
  isActive: boolean;
  onToggle: () => void;
}

const EditModeToggle: React.FC<EditModeToggleProps> = ({ isActive, onToggle }) => {
  return (
    <div className="flex items-center gap-4 mb-8">
      <button
        onClick={onToggle}
        className={`group relative flex items-center gap-3 px-6 py-3 rounded-2xl border transition-all duration-500 overflow-hidden ${
          isActive 
            ? 'bg-slate-900 border-slate-900 text-white shadow-2xl shadow-violet-500/20' 
            : 'bg-white border-slate-200 text-slate-500 hover:border-violet-200 hover:text-violet-600'
        }`}
      >
        <div className={`w-2 h-2 rounded-full transition-all duration-500 ${
          isActive ? 'bg-violet-400 scale-125 animate-pulse' : 'bg-slate-300 group-hover:bg-violet-400'
        }`} />
        <span className="text-xs font-black uppercase tracking-[0.2em]">
          {isActive ? 'Studio Mode Active' : 'Enter Studio Mode'}
        </span>
        
        {/* Shine effect animation logic - handled by CSS in Tailwind/Vanilla */}
        {isActive && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        )}
      </button>
      
      {isActive && (
        <div className="flex items-center gap-2 px-4 py-2 bg-violet-100/50 border border-violet-100 rounded-xl animate-in fade-in zoom-in duration-500">
          <div className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
          <span className="text-[10px] font-black text-violet-600 uppercase tracking-widest">Designing</span>
        </div>
      )}
    </div>
  );
};

export default EditModeToggle;

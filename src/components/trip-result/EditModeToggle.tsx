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
            : 'bg-white border-violet-100 text-slate-600 shadow-lg shadow-violet-500/5 hover:border-violet-300 hover:shadow-violet-500/10 hover:translate-y-[-1px]'
        }`}
      >
        <div className="relative flex items-center justify-center">
          <div className={`w-2 h-2 rounded-full transition-all duration-500 ${
            isActive ? 'bg-violet-400 scale-125 animate-pulse' : 'bg-violet-300 group-hover:bg-violet-500'
          }`} />
          {!isActive && (
            <div className="absolute w-full h-full rounded-full bg-violet-400 animate-ping opacity-40" />
          )}
        </div>
        
        <span className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${
          isActive ? 'text-white' : 'text-slate-900 group-hover:text-violet-600'
        }`}>
          {isActive ? 'Studio Mode Active' : '✨ Enter Studio Mode'}
        </span>
        
        {/* Subtle Shine effect for discoverability */}
        <div className={`absolute inset-0 bg-gradient-to-r from-transparent ${isActive ? 'via-white/5' : 'via-violet-500/5'} to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000`} />
      </button>
      
      {/* Designing label removed */}
    </div>
  );
};

export default EditModeToggle;

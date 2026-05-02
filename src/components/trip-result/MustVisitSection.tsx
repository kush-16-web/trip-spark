import React from 'react';
import mustSeeIcon from '../../assets/mustSee.gif';

interface Place {
  name: string;
  time: string;
  tag: string;
}

interface MustVisitSectionProps {
  places: readonly Place[];
}

const MustVisitSection: React.FC<MustVisitSectionProps> = ({ places }) => {
  return (
    <div className="relative">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center">
          <img src={mustSeeIcon} className="w-8 h-8 object-contain" alt="" />
        </div>
        <h4 className="text-2xl font-black text-slate-900 tracking-tight uppercase tracking-widest">Must Visit</h4>
      </div>

      <div className="space-y-4">
        {places.map((place, index) => (
          <li
            key={`${place.name}-${index}`}
            className="list-none p-6 md:p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/40 hover:border-indigo-200 transition-all flex items-center gap-6 group"
          >
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 font-black text-xl flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              {index + 1}
            </div>
            <div className="flex-1 space-y-2">
              <p className="font-black text-slate-900 text-xl tracking-tight">{place.name}</p>
              <span className="text-[9px] bg-black/20 rounded-lg text-black px-2 py-1 font-bold uppercase tracking-widest">{place.time}</span>
              <p className="text-sm text-indigo-600 font-bold tracking-wide uppercase">{place.tag}</p>
            </div>
          </li>
        ))}
      </div>
    </div>
  );
};

export default MustVisitSection;

import React from 'react';
import stayIcon from '../../assets/stay.gif';

interface Hotel {
  name: string;
  tag: string;
  blurb: string;
}

interface HotelSectionProps {
  hotels: readonly Hotel[];
}

const HotelSection: React.FC<HotelSectionProps> = ({ hotels }) => {
  return (
    <div className="relative">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center">
          <img src={stayIcon} className="w-10 h-10 rounded-lg object-contain" alt="" />
        </div>
        <h4 className="text-2xl font-black text-slate-900 tracking-tight uppercase tracking-widest">Where to stay</h4>
      </div>
      
      <div className="space-y-6">
        {hotels.map((stay) => (
          <article
            key={stay.name}
            className="group relative p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/40 hover:border-violet-200 transition-all"
          >
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <h5 className="text-2xl font-black text-slate-900 tracking-tight">{stay.name}</h5>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full bg-slate-900 text-white">
                {stay.tag}
              </span>
            </div>
            <p className="text-slate-600 text-base leading-relaxed font-medium">{stay.blurb}</p>
          </article>
        ))}
      </div>
    </div>
  );
};

export default HotelSection;

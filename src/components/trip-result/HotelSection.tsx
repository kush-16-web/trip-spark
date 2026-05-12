import React from 'react';
import { GhostWriter } from '../GhostWriter';
import stayIcon from '../../assets/stay.gif';
import hotel_sign from '../../assets/hotel-sign.gif'

interface Hotel {
  name: string;
  tag: string;
  blurb: string;
}

interface HotelSectionProps {
  hotels: readonly Hotel[];
  city: string;
}

const HotelCard = ({ stay }: { stay: Hotel }) => {
  return (
    <div className="w-full px-2 py-2"> {/* Safe Zone Margin */}
      <article className="group relative rounded-[1.5rem] md:rounded-[2rem] bg-white border border-slate-100 shadow-lg shadow-slate-200/50 transition-all duration-300 hover:border-violet-300">
        <div className="p-6 md:p-10">
           <div className="flex justify-between items-start mb-4 gap-4">
             <div className="flex flex-col gap-1 min-w-0">
               <h5 className="text-xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight group-hover:text-violet-600 transition-colors">
                 {stay.name}
               </h5>
                <div className="flex flex-wrap items-center gap-2 mt-1.5">
                  <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 bg-violet-100 text-violet-600 rounded">
                    {stay.tag}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Recommended</span>
                </div>
             </div>
             <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 group-hover:bg-violet-600 group-hover:text-white transition-colors">
               <img src={hotel_sign} className="w-full h-full object-contain" alt="Hotel Sign" />
             </div>
           </div>

           <p className="text-slate-500 text-sm md:text-lg leading-relaxed font-medium">
             {stay.blurb}
           </p>
        </div>
      </article>
    </div>
  );
}

const HotelSection: React.FC<HotelSectionProps> = ({ hotels }) => {
  return (
    <div className="w-full overflow-visible">
      <div className="flex items-center gap-4 mb-6 px-2">
        <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center ">
          <img src={stayIcon} className="w-full h-full object-contain" alt="" />
        </div>
        <h4 className="text-xl font-black text-slate-900 tracking-tight uppercase tracking-widest">Where to stay</h4>
      </div>
      
      <div className="flex flex-col gap-4">
        {hotels.map((stay) => (
          <HotelCard key={stay.name} stay={stay} />
        ))}
      </div>
    </div>
  );
};

export default HotelSection;

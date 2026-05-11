import React from 'react';
import mustSeeIcon from '../../assets/mustSee.gif';

interface Place {
  name: string;
  tag: string;
  time: string;
}

interface MustVisitSectionProps {
  places: readonly Place[];
}

const MustVisitSection: React.FC<MustVisitSectionProps> = ({ places }) => {
  return (
    <div className="w-full overflow-visible">
      <div className="flex items-center gap-4 mb-6 px-2">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
          <img src={mustSeeIcon} className="w-full h-full object-contain" alt="" />
        </div>
        <h4 className="text-xl font-black text-slate-900 tracking-tight uppercase tracking-widest">Must Visit</h4>
      </div>

      <div className="flex flex-col gap-4">
        {places.map((place, index) => (
          <div key={`${place.name}-${index}`} className="w-full px-2 py-2">
             <article className="group relative p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] bg-white border border-slate-100 shadow-lg shadow-slate-200/50 transition-all duration-300 flex items-center gap-4 md:gap-6 hover:border-violet-300">
               <div className="w-10 h-10 hidden sm:flex md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-slate-50 text-slate-400 font-black text-lg md:text-2xl items-center justify-center shrink-0 group-hover:bg-slate-900 group-hover:text-white transition-all duration-500">
                 {index + 1}
               </div>

               <div className="flex-1 min-w-0">
                 <div className="flex flex-wrap items-center gap-2 mb-2">
                  <div className="w-10 h-10 sm:hidden md:w-16 md:h-16 rounded-xl md:rounded-2xl border border-slate-200 text-slate-900 font-black text-lg md:text-2xl flex items-center justify-center shrink-0 transition-all duration-500">
                    {index + 1}
                  </div>
                   <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 bg-slate-900 text-white rounded">
                    {place.time} <p className='text-[8px] font-light'>time duration</p>
                   </span>
                   <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 bg-violet-100 text-violet-600 rounded">
                     {place.tag}
                   </span>
                 </div>
                 <h5 className="font-black text-slate-900 text-lg md:text-2xl tracking-tight leading-tight">
                   {place.name}
                 </h5>
               </div>

               {/* <div className="hidden md:flex w-8 h-8 items-center justify-center text-slate-200 group-hover:text-violet-400 group-hover:translate-x-1 transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                  </svg>
               </div> */}
             </article>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MustVisitSection;

import React from 'react';
import Sun from '../../assets/sun.gif';
import Cloudy from '../../assets/cloudy.gif';
import Fog from '../../assets/foggy.gif';
import Raining from '../../assets/raining.gif';
import Snowing from '../../assets/snowing.gif';
import Thunderstorm from '../../assets/thunderstorm.gif';

interface Activity {
  title: string;
  desc: string;
  time: string;
}

interface Weather {
  tempMax: number;
  tempMin: number;
  weatherCode: number;
}

interface ItineraryDayProps {
  dayNumber: number;
  activities: readonly Activity[];
  isEditMode: boolean;
  weather?: Weather;
  date?: string;
}

const ItineraryDay: React.FC<ItineraryDayProps> = ({ dayNumber, activities, isEditMode, weather, date }) => {
  return (
    <div className="relative group">
      {/* Card Decoration */}
      <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-[3.5rem] blur opacity-5 group-hover:opacity-10 transition duration-1000"></div>
      
      <div className="relative p-5 md:p-14 rounded-[2.5rem] md:rounded-[3rem] bg-white border border-slate-100 shadow-2xl shadow-slate-200/50 transition-all overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 md:w-64 md:h-64 bg-violet-50/50 rounded-bl-[5rem] md:rounded-bl-[10rem] -z-10" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-8 mb-8 md:mb-12 border-b border-slate-50 pb-8 md:pb-10">
          <div className="flex flex-col gap-2 md:gap-4">
            <div className="flex items-center gap-3 md:gap-4">
              <h4 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter">
                Day {dayNumber}
              </h4>
              <div className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest">
                AI Plan
              </div>
            </div>
            {date && (
              <div className="flex items-center gap-2 text-slate-400 font-bold text-sm md:text-lg">
                <span className="w-6 h-[2px] bg-slate-200" />
                {date}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between md:justify-end gap-3 md:gap-4">
            <div className="bg-slate-50 px-4 py-2 md:px-6 md:py-3 rounded-xl md:rounded-2xl border border-slate-100 flex flex-col items-center">
              <span className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Stops</span>
              <span className="text-lg md:text-2xl font-black text-slate-900">{activities.length}</span>
            </div>

            {/* Weather Logic - Mobile Optimized */}
            {weather && (
              <div className="flex items-center gap-3 md:gap-4 bg-white border border-violet-100 rounded-[1.5rem] md:rounded-[2rem] p-1.5 md:p-2 pr-4 md:pr-6 shadow-lg shadow-violet-100/50">
                <div className="w-10 h-10 md:w-16 md:h-16 rounded-xl md:rounded-[1.5rem] bg-white flex items-center justify-center shrink-0">
                  {weather.weatherCode === 0 ? <img src={Sun} alt="Sun" className='w-12 h-12' /> : 
                  weather.weatherCode === 1 || weather.weatherCode === 2 ? <img src={Cloudy} alt="Cloudy" className='w-12 h-12' /> : 
                  weather.weatherCode === 3 ? <img src={Cloudy} alt="Cloudy" className='w-12 h-12' /> : 
                  weather.weatherCode === 45 || weather.weatherCode === 48 ? <img src={Fog} alt="Fog" className='w-12 h-12' /> : 
                  weather.weatherCode === 51 || weather.weatherCode === 53 || weather.weatherCode === 55 ? <img src={Raining} alt="Raining" className='w-12 h-12' /> : 
                  weather.weatherCode === 56 || weather.weatherCode === 57 ? <img src={Raining} alt="Raining" className='w-12 h-12' /> : 
                  weather.weatherCode === 61 || weather.weatherCode === 63 || weather.weatherCode === 65 ? <img src={Raining} alt="Raining" className='w-12 h-12' /> : 
                  weather.weatherCode === 66 || weather.weatherCode === 67 ? <img src={Raining} alt="Raining" className='w-12 h-12' /> : 
                  weather.weatherCode === 71 || weather.weatherCode === 73 || weather.weatherCode === 75 ? <img src={Snowing} alt="Snowing" className='w-12 h-12' /> : 
                  weather.weatherCode === 77 ? <img src={Snowing} alt="Snowing" className='w-12 h-12' /> : 
                  weather.weatherCode === 80 || weather.weatherCode === 81 || weather.weatherCode === 82 ? <img src={Raining} alt="Raining" className='w-12 h-12' /> : 
                  weather.weatherCode === 85 || weather.weatherCode === 86 ? <img src={Snowing} alt="Snowing" className='w-12 h-12' /> : 
                  weather.weatherCode === 95 ? <img src={Thunderstorm} alt="Thunderstorm" className='w-12 h-12' /> : 
                  weather.weatherCode === 96 || weather.weatherCode === 99 ? <img src={Thunderstorm} alt="Thunderstorm" className='w-12 h-12' /> : ''}
                </div>
                <div className="flex flex-col">
                  <span className="text-base md:text-xl font-black text-slate-900 leading-none mb-0.5">
                    {weather.tempMax}° / {weather.tempMin}°
                  </span>
                  <span className="text-[8px] md:text-[10px] font-bold text-violet-500 uppercase tracking-wider italic">
                    {weather.weatherCode === 0 ? "Perfect Sun" :
                    weather.weatherCode >= 1 && weather.weatherCode <= 3 ? "Mild & Nice" :
                    weather.weatherCode >= 51 && weather.weatherCode <= 67 ? "Rainy Outlook" :
                    weather.weatherCode >= 80 && weather.weatherCode <= 82 ? "Showers Expected" :
                    weather.weatherCode >= 95 ? "Storm Risk" : "Variable Sky"}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {activities.map((item, idx) => (
            <details
              key={`${item.title}-${idx}`}
              open={idx === 0}
              className="group/details border-b border-slate-100 last:border-0 pb-4 md:pb-6 last:pb-0"
            >
              <summary className="list-none cursor-pointer flex items-center gap-4 md:gap-6">
                <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-slate-900 text-white font-black text-sm md:text-lg flex items-center justify-center shrink-0 shadow-lg shadow-slate-200 transition-transform group-hover/details:scale-105">
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 md:gap-3 mb-0.5 md:mb-1">
                    <span className="text-[8px] md:text-[10px] font-black text-violet-600 uppercase tracking-widest px-1.5 py-0.5 bg-violet-50 rounded">
                      {item.time}
                    </span>
                  </div>
                  <h5 className="text-base md:text-2xl font-black text-slate-900 tracking-tight group-hover/details:text-violet-600 transition-colors truncate">
                    {item.title}
                  </h5>
                </div>
                {isEditMode && (
                  <button className="text-red-500 hover:text-red-700 font-black text-[10px] uppercase tracking-tighter px-2 py-1 bg-red-50 rounded-lg md:text-xs">
                    Del
                  </button>
                )}
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-slate-100 flex items-center justify-center group-open/details:bg-slate-50 transition-colors">
                  <svg className="w-4 h-4 md:w-5 md:h-5 text-slate-400 group-open/details:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </summary>
              <div className="mt-3 md:mt-4 pl-14 md:pl-20 pr-2 md:pr-10">
                <p className="text-slate-600 leading-relaxed text-sm md:text-lg font-medium bg-slate-50/50 p-4 md:p-6 rounded-2xl md:rounded-3xl border border-slate-100/50">
                  {item.desc}
                </p>
              </div>
            </details>
          ))}

          {isEditMode && (
            <button className="w-full py-4 md:py-6 border-2 border-dashed border-slate-200 rounded-2xl md:rounded-[2rem] text-slate-400 font-bold hover:border-violet-300 hover:text-violet-500 hover:bg-violet-50/50 transition-all flex items-center justify-center gap-2 mt-6 md:mt-8 group text-sm md:text-base">
              <span className="text-lg md:text-xl group-hover:rotate-90 transition-transform">+</span>
              Add Activity
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItineraryDay;

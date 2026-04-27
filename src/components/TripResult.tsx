import React from 'react';
import soloTravel from '../assets/solo-traveller.gif';
import Romantic from '../assets/dating.gif'
import family from '../assets/Family-travel.gif'
import friends from '../assets/friends.gif'

// We pass data (the trip info) and onEdit (to go back)
export default function TripResult({ data, onEdit }: any) {
  // This creates an array for each day (e.g., [1, 2, 3])
  const days = Array.from({ length: Number(data?.days) || 1 }, (_, i) => i + 1);

  return (
    <section id="trip-result" className="py-16 md:py-24 bg-slate-50 overflow-hidden relative">
      {/* Decorative background gradients */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-indigo-50 to-transparent -z-10"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-violet-100/30 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-8">
          <div className="w-full md:w-auto">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="px-4 py-4 bg-violet-100 text-violet-700 rounded-full text-xs md:sm font-bold tracking-wide uppercase">
                Your Adventure is Ready
              </span>
              <span className="px-4 py-1.5 transition-all duration-500 bg-slate-900 text-white border border-slate-800 rounded-full text-xs md:sm font-bold tracking-wide uppercase flex items-center gap-4">
                {data?.type} {data?.type === 'friends' ? <img src={friends} className='h-8 w-8 object-cover rounded-full' alt="friends trip" /> : data?.type === 'Family' ? <img src={family} alt="family trip" className='h-8 w-8 object-cover rounded-full' /> : data?.type === 'Solo' ? <img src={soloTravel} alt="solo trip" className='h-8 w-8 object-cover rounded-full' /> : data?.type === 'Couple' ? <img src={Romantic} alt="couple trip" className='h-8 w-8 object-cover rounded-full bg-current' /> : ''}
              </span>
            </div>
            <h2 className="text-5xl md:text-8xl font-black text-slate-900 leading-none tracking-tight">
              {data?.Destination}
            </h2>
          </div>
          
          <button 
            onClick={onEdit}
            className="group px-6 py-4 md:px-8 md:py-5 bg-slate-900 text-white rounded-3xl md:rounded-[2rem] font-bold text-base md:text-lg hover:bg-violet-600 transition-all duration-300 shadow-xl shadow-slate-200 flex items-center gap-3 active:scale-95"
          >
            <span>Edit Preferences</span>
            <span className="group-hover:rotate-180 transition-transform duration-500">⚙️</span>
          </button>
        </div>

        {/* Quick Stats Grid - Mobile Friendly (2x2 on mobile, 4x1 on desktop) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16 md:20">
          {[
            { label: 'Duration', value: `${data?.days} Days`, icon: '📅' },
            { label: 'Group', value: `${data?.travelers} People`, icon: '👥' },
            { label: 'Budget', value: data?.budget, icon: '💰' },
            { label: 'Travel Style', value: data?.type, icon: '✨' },
          ].map((stat, i) => (
            <div key={i} className="p-5 md:p-8 rounded-[2rem] md:rounded-[2.5rem] bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-50 transition-all duration-500">
              <span className="text-2xl md:text-3xl mb-3 md:mb-4 block">{stat.icon}</span>
              <p className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-lg md:text-2xl font-bold text-slate-800">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Itinerary Timeline */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-10 md:12 flex items-center gap-4">
            Day-by-Day Itinerary 🗺️
          </h3>

          <div className="space-y-10 md:space-y-12 relative">
            {/* Vertical Line for timeline */}
            <div className="absolute left-6 md:left-8 top-0 bottom-0 w-0.5 bg-slate-200"></div>

            {days.map((day) => (
              <div key={day} className="relative pl-14 md:pl-24">
                {/* Timeline Dot */}
                <div className="absolute left-[14px] md:left-[22px] top-0 w-8 h-8 md:w-12 md:h-12 rounded-full bg-white border-4 border-violet-500 shadow-md flex items-center justify-center z-10">
                  <span className="text-[10px] md:text-sm font-black text-violet-600">{day}</span>
                </div>

                <div className="p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] bg-white border border-slate-100 shadow-sm hover:border-violet-200 transition-all">
                  <h4 className="text-xl md:text-3xl font-black text-slate-900 mb-6 flex items-center gap-3">
                    Day {day}
                    <span className="text-[10px] md:text-sm font-bold px-2 py-1 bg-violet-50 text-violet-600 rounded-lg uppercase">Exploring</span>
                  </h4>
                  
                  <div className="space-y-8">
                    {[
                      { time: '09:00 AM', title: 'Morning Exploration', desc: `Start your day in ${data?.Destination} by exploring the iconic local landmarks and soaking in the morning atmosphere.` },
                      { time: '01:00 PM', title: 'Culinary Delights', desc: 'Enjoy a curated lunch experience at a top-rated local eatery, sampling authentic flavors of the region.' },
                      { time: '04:00 PM', title: 'Afternoon Adventure', desc: 'Visit a hidden gem museum, take a guided walking tour, or relax in a scenic local park.' },
                    ].map((item, j) => (
                      <div key={j} className="flex flex-col md:flex-row gap-2 md:gap-6 items-start group">
                        <div className="md:w-24 pt-1">
                          <p className="text-[10px] md:text-xs font-black text-violet-500 uppercase tracking-widest">{item.time}</p>
                        </div>
                        <div className="flex-1">
                          <h5 className="text-lg md:text-xl font-bold text-slate-800 mb-2 group-hover:text-violet-600 transition-colors">{item.title}</h5>
                          <p className="text-slate-500 leading-relaxed text-sm md:text-base">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="mt-20 md:24 text-center">
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] md:text-sm mb-8 italic">Adventure is waiting for you...</p>
          <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-6">
             <button className="px-8 py-5 bg-violet-600 text-white rounded-[2rem] font-black text-lg hover:bg-violet-700 shadow-2xl shadow-violet-200 transition-all active:scale-95">
               Book This Trip ✈️
             </button>
             <button className="px-8 py-5 bg-white text-slate-900 border-2 border-slate-900 rounded-[2rem] font-black text-lg hover:bg-slate-50 transition-all active:scale-95">
               Share Itinerary 🔗
             </button>
          </div>
        </div>
      </div>
    </section>
  );
}

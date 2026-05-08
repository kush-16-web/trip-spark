import React, { useEffect, useState } from 'react';
import soloTravel from '../assets/solo-traveller.gif';
import Romantic from '../assets/dating.gif'
import family from '../assets/Family-travel.gif'
import friends from '../assets/friends.gif'
import hiddenGems from '../assets/hiddenGems.gif'
import balanced from '../assets/balanced.gif'
import mustSee from '../assets/mustSee.gif'

interface TripFormProps {
  trip: {
    Destination: string;
    days: string | number;
    /** Optional; hero flow may omit; form defaults to Moderate. */
    budget?: string;
    travelers: string | number;
    placeStyle?: string;
    startDate: string;
    endDate: string;
  };
  onComplete: (formData: any) => void;
  setTrip: (trip: any) => void;
}

export default function TripForm({ trip, onComplete, setTrip }: TripFormProps) {
  const [selectedType, setSelectedType] = useState('Solo');
  const [days, setDays] = useState(Number(trip.days) || 1);
  const [travelers, setTravelers] = useState(1);
  const [selectedPlaceStyle, setSelectedPlaceStyle] = useState(trip.placeStyle || 'balanced');
  const initialDays = Number(trip.days) || 1;
  const [startDate, setStartDate] = useState(trip.startDate || new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(
    new Date(
      new Date(trip.startDate || new Date().toISOString().split('T')[0]).setDate(
        new Date(trip.startDate || new Date().toISOString().split('T')[0]).getDate() + (initialDays - 1),
      ),
    )
      .toISOString()
      .split('T')[0],
  );

  const tripTypes = [
    { id: 'Solo', label: 'Solo', icon: soloTravel },
    { id: 'Couple', label: 'Couple', icon: Romantic },
    { id: 'Family', label: 'Family', icon: family },
    { id: 'Friends', label: 'Friends', icon: friends },
  ];

  const [minBudget, setMinBudget] = useState(10000);
  const [maxBudget, setMaxBudget] = useState(50000);

  const placeStyles = [
    { id: 'hidden_gems', label: 'Hidden Gems', icon: hiddenGems },
    { id: 'balanced', label: 'Balanced', icon: balanced },
    { id: 'must_see', label: 'Must-See', icon: mustSee },
  ];

  const toDateInputValue = (date: Date) => date.toISOString().split('T')[0];

const addDays = (startDate: string, days: number) => {
  const date = new Date(startDate);
  date.setDate(date.getDate() + (days - 1)); // inclusive range
  return toDateInputValue(date);
};
const today = toDateInputValue(new Date());

  useEffect(() => {
    setEndDate(addDays(startDate, days));
  }, [startDate, days]);


  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [isDraggingMin, setIsDraggingMin] = useState(false);
  const [isDraggingMax, setIsDraggingMax] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onComplete({
      Destination: trip.Destination,
      days: days,
      budgetRange: { min: minBudget, max: maxBudget },
      travelers: travelers,
      type: selectedType,
      placeStyle: selectedPlaceStyle,
      startDate: startDate,
      endDate: endDate,
    });
  }

  return (
    <section id='trip-result' className="py-24 bg-slate-50 overflow-hidden relative">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-50"></div>
      
      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <div className="glass p-8 md:p-14 rounded-[3rem] shadow-2xl shadow-indigo-100/50 border border-white/40">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent text-center">
              Plan Your Trip
            </h2>
            <p className="text-slate-500 text-xl font-medium">Tell us a bit more about your adventure…</p>
          </div>

          <form className="space-y-10" onSubmit={handleSubmit} >
            {/* ... other fields remain same ... */}
            <div className="space-y-4">
              <label className="text-sm font-black uppercase tracking-widest text-slate-400 ml-1">Where are you headed?</label>
              <div className="relative group">
                <input 
                  type="text" 
                  placeholder="e.g. Kyoto, Japan" 
                  value={trip.Destination}
                  onChange={(e) => setTrip({ ...trip, Destination: e.target.value })}
                  className="input-field text-xl py-6 pl-12 bg-white/50 backdrop-blur-sm group-focus-within:bg-white transition-all shadow-sm"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl group-focus-within:scale-110 transition-transform">📍</span>
              </div>
            </div>

            {/* Trip Type selection */}
            <div className="space-y-4">
              <label className="text-sm font-black uppercase tracking-widest text-slate-400 ml-1">What's the vibe?</label>
              
              {/* Mobile Dropdown */}
              <div className="md:hidden relative">
                <button 
                  type="button"
                  onClick={() => setIsTypeOpen(!isTypeOpen)}
                  className="w-full flex items-center justify-between p-4 bg-white/50 backdrop-blur-sm rounded-2xl border-2 border-slate-100 shadow-sm active:scale-[0.98] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
                      <img src={tripTypes.find(t => t.id === selectedType)?.icon} className="w-full h-full object-contain" alt="" />
                    </div>
                    <span className="font-bold text-slate-700 text-lg">{selectedType}</span>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 text-slate-400 transition-transform duration-300 ${isTypeOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {isTypeOpen && (
                  <div className="absolute z-50 mt-2 w-full bg-white rounded-2xl border-2 border-slate-100 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    {tripTypes.map((type) => (
                      <div 
                        key={type.id}
                        onClick={() => {
                          setSelectedType(type.id);
                          setIsTypeOpen(false);
                        }}
                        className={`flex items-center gap-4 p-4 hover:bg-violet-50 cursor-pointer transition-colors ${selectedType === type.id ? 'bg-violet-50 border-l-4 border-violet-500' : 'border-l-4 border-transparent'}`}
                      >
                        <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
                          <img src={type.icon} className="w-full h-full object-contain" alt="" />
                        </div>
                        <span className={`font-bold ${selectedType === type.id ? 'text-violet-600' : 'text-slate-700'}`}>{type.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Tablet/Desktop Grid */}
              <div className="hidden md:grid grid-cols-2 md:grid-cols-4 gap-4">
                {tripTypes.map((type) => (
                  <div 
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`card-select h-32 ${selectedType === type.id ? 'active ring-4 ring-violet-500/10' : ''}`}
                  >
                    <img src={type.icon} alt={type.label} className="w-12 h-12" />
                    <span className="font-bold text-slate-700">{type.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Travelers and Days */}
            <div className="grid md:grid-cols-2 justify-center gap-10">
              <div className="space-y-4">
                <label className="text-sm font-black uppercase tracking-widest text-slate-400 ml-1">How many days?</label>
                <div className='flex items-center justify-between p-2 bg-white/50 backdrop-blur-sm rounded-2xl border-2 border-slate-100 focus-within:border-violet-300 transition-all'>
                  <button type="button" className='w-14 h-14 rounded-xl bg-violet-100 text-violet-600 hover:bg-violet-500 hover:text-white transition-all font-black text-2xl flex items-center justify-center shadow-sm active:scale-95'
                    onClick={() => { if (days <= 1) return; setDays(days - 1) }}>-</button>
                  <input type='number' value={days} readOnly
                    className='bg-transparent border-none focus:ring-0 text-3xl font-black text-center w-20 text-slate-800' />
                  <button type="button" className='w-14 h-14 rounded-xl bg-violet-600 text-white hover:bg-violet-700 transition-all font-black text-2xl flex items-center justify-center shadow-md active:scale-95'
                    onClick={() => { setDays(days + 1) }}>+</button>
                </div>
              </div>
                <div className="space-y-4" style={{ display: selectedType === 'Solo' ? 'none' : 'block' }}>
                  <label className="flex items-center gap-3 text-sm font-black uppercase tracking-widest text-slate-400 ml-1"><span>Travelers </span></label>
                  <div className="relative flex items-center justify-between p-2 bg-white/50 backdrop-blur-sm rounded-2xl border-2 border-slate-100 focus-within:border-violet-300 transition-all">
                    <button  type="button" className='w-14 h-14 rounded-xl bg-violet-100 text-violet-600 hover:bg-violet-500 hover:text-white transition-all font-black text-2xl flex items-center justify-center shadow-sm active:scale-95'
                    onClick={() => { if (travelers <= 1) return; setTravelers(travelers - 1) }}>-</button>
                    <input 
                      type='number'
                      value={travelers}
                      readOnly
                      className='bg-transparent border-none focus:ring-0 text-3xl font-black text-center w-20 text-slate-800'
                    />
                    <button type="button" className='w-14 h-14 rounded-xl bg-violet-600 text-white hover:bg-violet-700 transition-all font-black text-2xl flex items-center justify-center shadow-md active:scale-95'
                    onClick={() => { setTravelers(travelers + 1) }}>+</button>
                  </div>
                </div>
            </div>

            {/* Dates */}
            <div className="grid md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <label className="text-sm font-black uppercase tracking-widest text-slate-400 ml-1">Start Date</label>
                <input
                  type="date"
                  min={today}
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="input-field text-lg py-5 bg-white/50 backdrop-blur-sm focus:bg-white transition-all shadow-sm"
                />
              </div>
              <div className="space-y-4">
                <label className="text-sm font-black uppercase tracking-widest text-slate-400 ml-1">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  readOnly
                  className="input-field text-lg py-5 bg-slate-100/70 backdrop-blur-sm shadow-sm cursor-not-allowed"
                />
              </div>
            </div>

            {/* Budget Range Slider */}
            {/* Budget Range Slider */}
            <div className="space-y-8"> 
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-violet-600 rounded-full" />
                  <label className="text-sm md:text-base font-black uppercase tracking-widest text-slate-800">Budget Strategy</label>
                </div>
                <div className="px-6 py-2.5 bg-slate-900 text-white rounded-2xl font-black text-sm shadow-xl shadow-slate-200">
                  ₹{minBudget.toLocaleString()} - ₹{maxBudget.toLocaleString()}
                </div>
              </div>
              
              <div className="relative pt-12 pb-6 px-6 md:px-10 bg-white border border-slate-100 rounded-[3rem] shadow-2xl shadow-slate-200/50 group/container">
                <div className="flex flex-col gap-12">
                   {/* Min Budget Slider */}
                   <div className="space-y-6">
                    <div className="flex justify-between text-[11px] font-black text-slate-400 uppercase tracking-[0.4em]">
                      <span className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-violet-400" />
                        Minimum Base
                      </span>
                      <span className="text-slate-900 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">₹{minBudget.toLocaleString()}</span>
                    </div>
                    <div 
                      className="relative h-8 flex items-center group/slider cursor-crosshair"
                      onMouseMove={(e) => {
                        if (isDraggingMin) return;
                        const rect = e.currentTarget.getBoundingClientRect();
                        const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                        const currentPercent = (minBudget - 5000) / (100000 - 5000);
                        
                        const rawVal = 5000 + percent * (100000 - 5000);
                        const steppedVal = Math.round(rawVal / 5000) * 5000;
                        const tooltip = e.currentTarget.querySelector('.hover-tooltip') as HTMLElement;
                        
                        if (tooltip) {
                          tooltip.style.left = `${percent * 100}%`;
                          tooltip.innerText = `₹${steppedVal.toLocaleString()}`;
                          // Hide if too close to the main thumb (within 8% range)
                          if (Math.abs(percent - currentPercent) < 0.08) {
                            tooltip.style.opacity = '0';
                          } else {
                            tooltip.style.opacity = '1';
                          }
                        }
                      }}
                      onMouseLeave={(e) => {
                        const tooltip = e.currentTarget.querySelector('.hover-tooltip') as HTMLElement;
                        if (tooltip) tooltip.style.opacity = '0';
                      }}
                    >
                      {/* Hover Preview Tooltip (Ghost) */}
                      <div className="hover-tooltip absolute -top-4 -translate-y-full px-2 py-1 bg-violet-100 text-violet-600 text-[10px] font-black rounded-lg opacity-0 transition-opacity pointer-events-none z-10 whitespace-nowrap shadow-sm border border-violet-200" style={{ transform: 'translate(-50%, -10px)' }}>
                        ₹0
                      </div>

                      {/* Main Value Tooltip */}
                      <div 
                        className={`absolute -top-10 transition-all duration-300 pointer-events-none z-30 ${isDraggingMin ? 'scale-125' : ''}`}
                        style={{ left: `calc(${(minBudget - 5000) / (100000 - 5000) * 100}% - 35px)` }}
                      >
                        <div className="bg-slate-900 text-white text-[10px] font-black px-3 py-2 rounded-xl shadow-2xl whitespace-nowrap">
                          ₹{minBudget.toLocaleString()}
                          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[5px] border-t-slate-900"></div>
                        </div>
                      </div>
                      
                      {/* Bold Custom Track */}
                      <div className="absolute w-full h-4 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50 shadow-inner">
                        <div 
                          className="h-full bg-indigo-600/50 shadow-[0_0_20px_rgba(124,58,237,0.3)] transition-all duration-300" 
                          style={{ width: `${(minBudget - 5000) / (100000 - 5000) * 100}%` }}
                        />
                      </div>

                      <input 
                        type="range" 
                        min="5000" 
                        max="100000" 
                        step="5000"
                        value={minBudget}
                        onMouseDown={() => setIsDraggingMin(true)}
                        onMouseUp={() => setIsDraggingMin(false)}
                        onTouchStart={() => setIsDraggingMin(true)}
                        onTouchEnd={() => setIsDraggingMin(false)}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          if (val < maxBudget) setMinBudget(val);
                        }}
                        className="absolute w-full h-8 bg-transparent appearance-none cursor-pointer z-40 
                          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-8 [&::-webkit-slider-thumb]:h-8 
                          [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-[5px] 
                          [&::-webkit-slider-thumb]:border-violet-600 [&::-webkit-slider-thumb]:shadow-2xl [&::-webkit-slider-thumb]:transition-all 
                          [&::-webkit-slider-thumb]:active:scale-90 hover:[&::-webkit-slider-thumb]:scale-110 hover:[&::-webkit-slider-thumb]:border-[6px]"
                      />
                    </div>
                  </div>

                  {/* Max Budget Slider */}
                  <div className="space-y-6">
                    <div className="flex justify-between text-[11px] font-black text-slate-400 uppercase tracking-[0.4em]">
                      <span className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-indigo-400" />
                        Cap Ceiling
                      </span>
                      <span className="text-slate-900 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">₹{maxBudget.toLocaleString()}</span>
                    </div>
                    <div 
                      className="relative h-8 flex items-center group/slider cursor-crosshair"
                      onMouseMove={(e) => {
                        if (isDraggingMax) return;
                        const rect = e.currentTarget.getBoundingClientRect();
                        const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                        const currentPercent = (maxBudget - 10000) / (500000 - 10000);
                        
                        const rawVal = 10000 + percent * (500000 - 10000);
                        const steppedVal = Math.round(rawVal / 5000) * 5000;
                        const tooltip = e.currentTarget.querySelector('.hover-tooltip-max') as HTMLElement;
                        
                        if (tooltip) {
                          tooltip.style.left = `${percent * 100}%`;
                          tooltip.innerText = `₹${steppedVal.toLocaleString()}`;
                          // Hide if too close to the main thumb (within 8% range)
                          if (Math.abs(percent - currentPercent) < 0.08) {
                            tooltip.style.opacity = '0';
                          } else {
                            tooltip.style.opacity = '1';
                          }
                        }
                      }}
                      onMouseLeave={(e) => {
                        const tooltip = e.currentTarget.querySelector('.hover-tooltip-max') as HTMLElement;
                        if (tooltip) tooltip.style.opacity = '0';
                      }}
                    >
                      {/* Hover Preview Tooltip (Ghost) */}
                      <div className="hover-tooltip-max absolute -top-4 -translate-y-full px-2 py-1 bg-indigo-100 text-indigo-600 text-[10px] font-black rounded-lg opacity-0 transition-opacity pointer-events-none z-10 whitespace-nowrap shadow-sm border border-indigo-200" style={{ transform: 'translate(-50%, -10px)' }}>
                        ₹0
                      </div>

                      {/* Main Value Tooltip */}
                      <div 
                        className={`absolute -top-10 transition-all duration-300 pointer-events-none z-30 ${isDraggingMax ? 'scale-125' : ''}`}
                        style={{ left: `calc(${(maxBudget - 10000) / (500000 - 10000) * 100}% - 35px)` }}
                      >
                        <div className="bg-slate-900 text-white text-[10px] font-black px-3 py-2 rounded-xl shadow-2xl whitespace-nowrap">
                          ₹{maxBudget.toLocaleString()}
                          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[5px] border-t-slate-900"></div>
                        </div>
                      </div>

                      {/* Bold Custom Track */}
                      <div className="absolute w-full h-4 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50 shadow-inner">
                        <div 
                          className="h-full bg-indigo-600/50 shadow-[0_0_20px_rgba(124,58,237,0.3)] transition-all duration-300" 
                          style={{ width: `${(maxBudget - 10000) / (500000 - 10000) * 100}%` }}
                        />
                      </div>

                      <input 
                        type="range" 
                        min="10000" 
                        max="500000" 
                        step="5000"
                        value={maxBudget}
                        onMouseDown={() => setIsDraggingMax(true)}
                        onMouseUp={() => setIsDraggingMax(false)}
                        onTouchStart={() => setIsDraggingMax(true)}
                        onTouchEnd={() => setIsDraggingMax(false)}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          if (val > minBudget) setMaxBudget(val);
                        }}
                        className="absolute w-full h-8 bg-transparent appearance-none cursor-pointer z-40 
                          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-8 [&::-webkit-slider-thumb]:h-8 
                          [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-[5px] 
                          [&::-webkit-slider-thumb]:border-indigo-600 [&::-webkit-slider-thumb]:shadow-2xl [&::-webkit-slider-thumb]:transition-all 
                          [&::-webkit-slider-thumb]:active:scale-90 hover:[&::-webkit-slider-thumb]:scale-110 hover:[&::-webkit-slider-thumb]:border-[6px]"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mt-10 flex items-center justify-center gap-3 py-3 px-6 rounded-2xl">
                  <span className="text-xl">💡</span>
                  <p className="text-slate-500 text-xs font-bold italic">
                    AI will suggest stays and activities within this total budget.
                  </p>
                </div>
              </div>
            </div>

            {/* Place preference */}
            <div className="space-y-4">
              <label className="text-sm font-black uppercase tracking-widest text-slate-400 ml-1">
                Place preference
              </label>
              <div className="grid md:grid-cols-3 gap-4">
                {placeStyles.map((style) => (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => setSelectedPlaceStyle(style.id)}
                    className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                      selectedPlaceStyle === style.id
                        ? 'border-violet-500 ring-4 ring-violet-500/10 bg-violet-50'
                        : 'border-slate-100 bg-white hover:border-violet-200'
                    }`}
                  >
                    <img src={style.icon} alt={style.label} className="w-10 h-10 object-contain" />
                    <span className="font-bold text-slate-800">{style.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-8">
              <button type="submit" className="group relative w-full md:py-8 py-4 text-2xl font-black rounded-[2.5rem] bg-white border-2 border-slate-500 text-slate-800 shadow-2xl shadow-indigo-100/50 hover:border-violet-500 hover:text-violet-600 transition-all duration-500 flex items-center justify-center gap-6 overflow-hidden">
                <div className="absolute inset-0 bg-violet-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10 flex items-center gap-4">
                  {/* <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-violet-100 transition-colors duration-500">
                    <img src={tripGIF} alt="magic" className="w-10 h-10 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500" />
                  </div> */}
                  <span className="tracking-tight md:text-2xl text-sm font-bold">Craft My Perfect Itinerary</span>
                  <span className="tracking-tight md:text-2xl text-sm font-bold">✨</span>
                </div>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
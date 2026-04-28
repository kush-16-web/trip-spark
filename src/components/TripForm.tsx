import React, { useEffect, useState } from 'react';
import soloTravel from '../assets/solo-traveller.gif';
import Romantic from '../assets/dating.gif'
import family from '../assets/Family-travel.gif'
import friends from '../assets/friends.gif'
import Travelers from '../assets/family.png'
import Budget from '../assets/Budget.gif'
import Moderate from '../assets/wallet.gif'
import Luxury from '../assets/Premium.gif'

interface TripFormProps {
  trip: {
    Destination: string;
    days: string | number;
    budget: string;
    travelers: string | number;
    startDate: string;
    endDate: string;
  };
  onComplete: (formData: any) => void;
}

export default function TripForm({ trip, onComplete }: TripFormProps) {
  const [selectedType, setSelectedType] = useState('Solo');
  const [selectedBudget, setSelectedBudget] = useState('Moderate');
  const [days, setDays] = useState(Number(trip.days) || 1);
  const [travelers, setTravelers] = useState(1);
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

  const budgetLevels = [
    { id: 'Budget', label: 'Budget', desc: 'Economic', icon: Budget },
    { id: 'Moderate', label: 'Moderate', desc: 'Balanced', icon: Moderate },
    { id: 'Luxury', label: 'Luxury', desc: 'Premium', icon: Luxury },
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
  const [isBudgetOpen, setIsBudgetOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onComplete({
      Destination: trip.Destination,
      days: days,
      budget: selectedBudget,
      travelers: travelers,
      type: selectedType,
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
            <h2 className="text-4xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              Plan Your Trip
            </h2>
            <p className="text-slate-500 text-xl font-medium">Tell us a bit more about your adventure…</p>
          </div>

          <form className="space-y-10" onSubmit={handleSubmit} >
            {/* Destination */}
            <div className="space-y-4">
              <label className="text-sm font-black uppercase tracking-widest text-slate-400 ml-1">Where are you headed?</label>
              <div className="relative group">
                <input 
                  type="text" 
                  placeholder="e.g. Kyoto, Japan" 
                  defaultValue={trip.Destination}
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
                  <label className="flex items-center gap-3 text-sm font-black uppercase tracking-widest text-slate-400 ml-1"><span>Travelers </span>
                    {/* <img src={Travelers} alt="Travelers-icon" className="w-8 h-8" /> */}
                  </label>
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

            {/* Budget Selection */}
            <div className="space-y-4">
              <label className="text-sm font-black uppercase tracking-widest text-slate-400 ml-1">What's the budget?</label>
              
              {/* Mobile Dropdown for Budget */}
              <div className="md:hidden relative">
                <button 
                  type="button"
                  onClick={() => setIsBudgetOpen(!isBudgetOpen)}
                  className="w-full flex items-center justify-between p-4 bg-white/50 backdrop-blur-sm rounded-2xl border-2 border-slate-100 shadow-sm active:scale-[0.98] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 shadow-sm">
                      <img src={budgetLevels.find(b => b.id === selectedBudget)?.icon} alt="" className="w-8 h-8 object-contain" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-slate-700 leading-none">{selectedBudget}</p>
                      <p className="text-xs text-slate-400 mt-1">{budgetLevels.find(b => b.id === selectedBudget)?.desc}</p>
                    </div>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 text-slate-400 transition-transform duration-300 ${isBudgetOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {isBudgetOpen && (
                  <div className="absolute z-50 mt-2 w-full bg-white rounded-2xl border-2 border-slate-100 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    {budgetLevels.map((level) => (
                      <div 
                        key={level.id}
                        onClick={() => {
                          setSelectedBudget(level.id);
                          setIsBudgetOpen(false);
                        }}
                        className={`flex items-center gap-4 p-4 hover:bg-violet-50 cursor-pointer transition-colors ${selectedBudget === level.id ? 'bg-violet-50 border-l-4 border-violet-500' : 'border-l-4 border-transparent'}`}
                      >
                        <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
                          <img src={level.icon} className="w-full h-full object-contain" alt="" />
                        </div>
                        <div>
                          <p className={`font-bold ${selectedBudget === level.id ? 'text-violet-600' : 'text-slate-700'}`}>{level.label}</p>
                          <p className="text-xs text-slate-400">{level.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Tablet/Desktop Grid */}
              <div className="hidden md:grid md:grid-cols-3 gap-4">
                {budgetLevels.map((level) => (
                  <div 
                    key={level.id}
                    onClick={() => setSelectedBudget(level.id)}
                    className={`flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                      selectedBudget === level.id 
                        ? 'border-violet-500 ring-4 ring-violet-500/10' 
                        : 'border-slate-100 bg-white hover:border-violet-200'
                    }`}
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center shadow-sm group-hover:bg-violet-100 transition-colors">
                      <img className="w-8 h-8 object-contain" src={level.icon} alt="Budget-icon" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 leading-none mb-1">{level.label}</p>
                      <p className="text-xs text-slate-500 font-medium">{level.desc}</p>
                    </div>
                  </div>
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
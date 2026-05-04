import React from 'react';
import compassIcon from '../../assets/compass.gif';
import walletIcon from '../../assets/wallet.gif';
import calender from '../../assets/calendar-time.gif';
import soloTravel from '../../assets/solo-traveller.gif';
import family from '../../assets/Family-travel.gif';
import Romantic from '../../assets/dating.gif';
import friends from '../../assets/friends.gif';
import groupIcon from '../../assets/group.gif';

interface TripStatsProps {
  location: string;
  budget: string;
  travelers: string;
  days: number | string;
  tripType?: string;
  isEditMode: boolean;
  onUpdate: (field: string, value: any) => void;
  startDate?: string;
  endDate?: string;
  minBudget?: number;
  maxBudget?: number;
  currency?: string;
}

const TripStats: React.FC<TripStatsProps> = ({ 
  location, 
  budget, 
  travelers, 
  days, 
  tripType, 
  isEditMode, 
  onUpdate,
  startDate,
  endDate,
  minBudget,
  maxBudget,
  currency
}) => {
  const [isTypeMenuOpen, setIsTypeMenuOpen] = React.useState(false);
  const [isCurrencyOpen, setIsCurrencyOpen] = React.useState(false);
  const typeOptions = [
    { label: 'Solo', icon: soloTravel },
    { label: 'Couple', icon: Romantic },
    { label: 'Family', icon: family },
    { label: 'Friends', icon: friends },
  ];

  const getTravelerIcon = () => {
    switch (tripType?.toLowerCase()) {
      case 'friends': return friends;
      case 'family': return family;
      case 'solo': return soloTravel;
      case 'couple': return Romantic;
      default: return groupIcon;
    }
  };

 const currencyOptions = [
  { label: 'INR', symbol: '₹' },
  { label: 'USD', symbol: '$' },
  { label: 'EUR', symbol: '€' },
  { label: 'GBP', symbol: '£' },
  { label: 'JPY', symbol: '¥' },
];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
      {/* 1. Journey Card (Destination) */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all">
        <div className="w-12 h-12  rounded-2xl flex items-center justify-center mb-6 shadow-inner">
          <img src={compassIcon} className="w-10 h-10 rounded-lg shadow-sm object-contain" alt="" />
        </div>
        <p className="text-[10px] uppercase tracking-widest font-black text-slate-400 mb-2">Destination</p>
        {isEditMode ? (
          <input
            className="w-full bg-transparent border-b border-violet-200 outline-none font-black text-slate-900 text-lg"
            value={location}
            onChange={(e) => onUpdate('Destination', e.target.value)}
          />
        ) : (
          <h4 className="text-xl font-black text-slate-900 truncate">{location}</h4>
        )}
      </div>

      {/* 2. Timeline Card (Smart Dates) */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all">
        <div className="flex justify-between items-start mb-6">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner">
            <img src={calender} className="w-10 h-10 rounded-lg shadow-sm object-contain" alt="" />
          </div>
          <div className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-[10px] font-black uppercase tracking-widest">
            {days} Days
          </div>
        </div>
        <p className="text-[10px] uppercase tracking-widest font-black text-slate-400 mb-2">Timeline</p>
        {isEditMode ? (
          <div className="flex flex-col gap-2">
            <input
              type="date"
              className="bg-transparent text-xs font-bold text-slate-600 outline-none border-b border-orange-100"
              value={startDate || ''}
              onChange={(e) => onUpdate('startDate', e.target.value)}
            />
            <input
              type="date"
              className="bg-transparent text-xs font-bold text-slate-600 outline-none border-b border-orange-100"
              value={endDate || ''}
              onChange={(e) => onUpdate('endDate', e.target.value)}
            />
          </div>
        ) : (
          <div className="flex items-center gap-2 text-slate-900 font-black">
            <span>{startDate ? new Date(startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '—'}</span>
            <span className="text-slate-300">→</span>
            <span>{endDate ? new Date(endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '—'}</span>
          </div>
        )}
      </div>

      {/* 3. Crew Card (Travelers & Type) */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm hover:shadow-md transition-all">
        <div className="relative mb-6">
          {/* Interactive Icon / Dropdown Trigger */}
          <button 
            type="button"
            disabled={!isEditMode}
            onClick={() => setIsTypeMenuOpen(!isTypeMenuOpen)}
            className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner transition-all"
          >
            <img src={getTravelerIcon()} className="w-10 h-10 rounded-lg shadow-sm object-contain" alt="" />
          </button>

          {/* Floating Dropdown Menu */}
          {isTypeMenuOpen && isEditMode && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setIsTypeMenuOpen(false)} />
              <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-xl z-20 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                {typeOptions.map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => {
                      onUpdate('type', opt.label);
                      setIsTypeMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2.5 hover:bg-violet-50 transition-colors flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <img src={opt.icon} className="w-6 h-6 object-cover rounded-full bg-slate-100 shadow-sm" alt="" />
                      <span className="text-xs font-bold text-slate-600 group-hover:text-violet-700">{opt.label}</span>
                    </div>
                    {tripType?.toLowerCase() === opt.label.toLowerCase() && (
                      <div className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <p className="text-[10px] uppercase tracking-widest font-black text-slate-400 mb-2">The Crew</p>
        
        {isEditMode ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="1"
                disabled={tripType?.toLowerCase() === 'solo'}
                className={`w-16 bg-transparent border-b border-violet-200 outline-none font-black text-slate-900 text-lg ${tripType?.toLowerCase() === 'solo' ? 'opacity-50 cursor-not-allowed' : ''}`}
                value={tripType?.toLowerCase() === 'solo' ? 1 : travelers.split(' ')[0]}
                onChange={(e) => onUpdate('travelers', e.target.value)}
              />
              <span className="text-xs font-bold text-slate-400">People</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col">
            <h4 className="text-xl font-black text-slate-900">{travelers}</h4>
            <span className="text-[10px] font-bold text-violet-500 uppercase tracking-wider">{tripType}</span>
          </div>
        )}
      </div>

      {/* 4. Budget Card (Financials) */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
          <img src={walletIcon} className="w-10 h-10 rounded-lg shadow-sm object-contain" alt="" />
        </div>
        <p className="text-[10px] uppercase tracking-widest font-black text-slate-400 mb-2">Budget</p>
        {isEditMode ? (
           <div className="flex items-center gap-2">
            {/* Interactive Currency Dropdown */}
            <div className="relative">
              <button 
                disabled={!isEditMode}
                onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                className="text-violet-500 font-bold text-sm hover:bg-violet-50 px-2 py-1 rounded-lg transition-colors flex items-center gap-1"
              >
                {currency}
                {isEditMode && <span className="text-[8px] opacity-50">▼</span>}
              </button>

              {isCurrencyOpen && isEditMode && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsCurrencyOpen(false)} />
                  <div className="absolute top-full left-0 mt-2 bg-white shadow-2xl border border-slate-100 rounded-xl p-1 z-50 min-w-[100px] animate-in fade-in zoom-in-95 duration-200">
                    {currencyOptions.map((opt) => (
                      <button
                        key={opt.label}
                        onClick={() => {
                          onUpdate('currency', opt.symbol);
                          setIsCurrencyOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-violet-600 hover:text-white rounded-lg text-xs font-bold transition-all flex justify-between group"
                      >
                        <span className="text-slate-600 group-hover:text-white">{opt.label}</span>
                        <span className="text-violet-600 group-hover:text-white">{opt.symbol}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

              {/* Min Input */}
              <input
                type="number"
                className="w-full bg-transparent border-b border-violet-200 outline-none font-black text-slate-900 text-lg"
                value={minBudget}
                onChange={(e) => onUpdate('budgetMin', e.target.value)}
              />
              <span className="text-slate-300 font-bold">—</span>
                {/* Max Input */}
              <input
                type="number"
                className="w-full bg-transparent border-b border-violet-200 outline-none font-black text-slate-900 text-lg"
                value={maxBudget}
                onChange={(e) => onUpdate('budgetMax', e.target.value)}
              />
            </div>
        ) : (
          <h4 className="text-xl font-black text-slate-900 truncate">{budget}</h4>
        )}
      </div>
    </div>
  );
};

export default TripStats;

import React from 'react';
import destinationIcon from '../../assets/destination-map.gif';
import walletIcon from '../../assets/wallet.gif';
import calender from '../../assets/calendar-time.gif';
import soloTravel from '../../assets/solo-traveller.gif';
import family from '../../assets/Family-travel.gif';
import Romantic from '../../assets/dating.gif';
import friends from '../../assets/friends.gif';
import groupIcon from '../../assets/group.gif';

interface TripStatsProps {
  location: string;
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
  currencyMode: 'INR' | 'LOCAL';
  exchangeRate: number;
  localCurrency?: any;
}

const TripStats: React.FC<TripStatsProps> = ({ 
  location, 
  travelers, 
  days, 
  tripType, 
  isEditMode, 
  onUpdate,
  startDate,
  endDate,
  minBudget,
  maxBudget,
  currency,
  currencyMode,
  exchangeRate,
  localCurrency
}) => {
  const [isTypeMenuOpen, setIsTypeMenuOpen] = React.useState(false);
  const [isCurrencyOpen, setIsCurrencyOpen] = React.useState(false);

  const formatInternalPrice = (amount: any) => {
    const numericAmount = Number(amount) || 0;
    if (currencyMode === 'LOCAL' && localCurrency) {
      const converted = numericAmount * exchangeRate;
      return `${localCurrency.symbol}${Math.round(converted).toLocaleString()}`;
    }
    return `₹${Math.round(numericAmount).toLocaleString()}`;
  };
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
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
      {/* 1. Journey Card (Destination) */}
      <div className="p-3.5 md:p-5 bg-white rounded-[1.5rem] border border-slate-100 shadow-sm transition-all hover:border-violet-200">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 flex items-center justify-center">
            <img src={destinationIcon} className="w-full h-full object-contain" alt="" />
          </div>
          <p className="text-[7px] sm:text-[9px] uppercase tracking-widest font-black text-slate-400">Destination</p>
        </div>
        <div className="min-h-[28px]">
          <h4 className="text-sm md:text-base font-black text-slate-900 truncate">{location}</h4>
        </div>
      </div>

      {/* 2. Timeline Card (Smart Dates) */}
      <div className="p-3.5 md:p-5 bg-white rounded-[1.5rem] border border-slate-100 shadow-sm transition-all hover:border-orange-200">
        <div className="flex flex-col items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center">
              <img src={calender} className="w-full h-full object-contain" alt="" />
            </div>
            <p className="text-[9px] uppercase tracking-widest font-black text-slate-400">Timeline</p>
          </div>
          <div className="px-2 mt-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-[8px] font-black uppercase tracking-widest">
            {days} {days === 1 ? 'Day' : 'Days'}
          </div>
        </div>
        <div className="min-h-[28px]">
          {isEditMode ? (
            <div className="flex flex-col gap-1">
              <input
                type="date"
                className="bg-transparent text-[10px] font-bold text-slate-600 outline-none border-b border-orange-100"
                value={startDate || ''}
                onChange={(e) => onUpdate('startDate', e.target.value)}
              />
              <input
                type="date"
                className="bg-transparent text-[10px] font-bold text-slate-600 outline-none border-b border-orange-100"
                value={endDate || ''}
                onChange={(e) => onUpdate('endDate', e.target.value)}
              />
            </div>
          ) : (
            <div className="flex items-center gap-2 text-slate-900 font-black">
              <span className='text-xs'>{startDate ? new Date(startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '—'}</span>
              <span className="text-slate-300 text-xs">→</span>
              <span className='text-xs'>{endDate ? new Date(endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '—'}</span>
            </div>
          )}
        </div>
      </div>

      {/* 3. Crew Card (Travelers & Type) */}
      <div className="p-3.5 md:p-5 bg-white rounded-[1.5rem] border border-slate-100 shadow-sm transition-all hover:border-violet-200">
        <div className="relative flex items-center gap-3 mb-3">
          <button 
            type="button"
            disabled={!isEditMode}
            onClick={() => setIsTypeMenuOpen(!isTypeMenuOpen)}
            className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center transition-all"
          >
            <img src={getTravelerIcon()} className="w-full h-full object-contain" alt="" />
          </button>
          <p className="text-[9px] uppercase tracking-widest font-black text-slate-400">The Crew</p>

          {/* Floating Dropdown Menu */}
          {isTypeMenuOpen && isEditMode && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setIsTypeMenuOpen(false)} />
              <div className="absolute top-full left-0 mt-2 w-40 bg-white border border-slate-100 rounded-xl shadow-xl z-20 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                {typeOptions.map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => {
                      onUpdate('type', opt.label);
                      setIsTypeMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-violet-50 transition-colors flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2">
                      <img src={opt.icon} className="w-5 h-5 md:w-8 md:h-8 object-contain" alt="" />
                      <span className="text-[10px] font-bold text-slate-600 group-hover:text-violet-700">{opt.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
        
        <div className="min-h-[28px]">
          {isEditMode ? (
            <div className="flex items-center gap-2">
              <input  
                type="number"
                min="1"
                disabled={tripType?.toLowerCase() === 'solo'}
                className={`w-12 bg-transparent border-b border-violet-200 outline-none font-black text-slate-900 text-sm ${tripType?.toLowerCase() === 'solo' ? 'opacity-50 cursor-not-allowed' : ''}`}
                value={tripType?.toLowerCase() === 'solo' ? 1 : travelers.split(' ')[0]}
                onChange={(e) => onUpdate('travelers', e.target.value)}
              />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{tripType}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-black text-slate-900">{travelers.split(' ')[0]} PPL</h4>
              <span className="text-[10px] font-bold text-violet-500 uppercase tracking-wider">{tripType}</span>
            </div>
          )}
        </div>
      </div>

      {/* 4. Budget Card (Financials) */}
      <div className="p-3.5 md:p-5 bg-white rounded-[1.5rem] border border-slate-100 shadow-sm transition-all hover:border-violet-200">
        <div className="relative flex items-center gap-3 mb-3">
          <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center">
            <img src={walletIcon} className="w-full h-full object-contain" alt="" />
          </div>
          <p className="text-[9px] uppercase tracking-widest font-black text-slate-400">Budget</p>
        </div>
        <div className="min-h-[28px]">
          {isEditMode ? (
            <div className="flex items-center gap-1">
              <div className="relative">
                <button 
                  onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                  className="text-violet-500 font-bold text-[10px] hover:bg-violet-50 px-1 py-0.5 rounded transition-colors"
                >
                  {currency}
                </button>
                {isCurrencyOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsCurrencyOpen(false)} />
                    <div className="absolute top-full left-0 mt-2 bg-white shadow-xl border border-slate-100 rounded-lg p-1 z-50 min-w-[80px]">
                      {currencyOptions.map((opt) => (
                        <button
                          key={opt.label}
                          onClick={() => {
                            onUpdate('currency', opt.symbol);
                            setIsCurrencyOpen(false);
                          }}
                          className="w-full text-left px-2 py-1.5 hover:bg-violet-50 rounded text-[10px] font-bold transition-all flex justify-between"
                        >
                          <span className="text-slate-600">{opt.label}</span>
                          <span className="text-violet-600">{opt.symbol}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
              <input
                type="number"
                className="w-full bg-transparent border-b border-violet-100 outline-none font-black text-slate-900 text-sm"
                value={minBudget}
                onChange={(e) => onUpdate('budgetMin', e.target.value)}
              />
              <span className="text-slate-300 font-bold">—</span>
              <input
                type="number"
                className="w-full bg-transparent border-b border-violet-100 outline-none font-black text-slate-900 text-sm"
                value={maxBudget}
                onChange={(e) => onUpdate('budgetMax', e.target.value)}
              />
            </div>
          ) : (
            <h4 className="text-sm font-black text-slate-900 truncate">
              {formatInternalPrice(minBudget)} — {formatInternalPrice(maxBudget)}
            </h4>
          )}
        </div>
      </div>
    </div>
  );
};

export default TripStats;

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
}

const TripStats: React.FC<TripStatsProps> = ({ location, budget, travelers, days, tripType }) => {
  // Logic to get the right GIF for the trip type
  const getTravelerIcon = () => {
    switch (tripType?.toLowerCase()) {
      case 'solo': return soloTravel;
      case 'family': return family;
      case 'couple': return Romantic;
      case 'friends': return friends;
      default: return groupIcon;
    }
  };

  const stats = [
    { label: 'Destination', value: location, icon: compassIcon, color: 'bg-blue-50' },
    { label: 'Budget', value: budget, icon: walletIcon, color: 'bg-emerald-50' },
    { label: 'Travelers', value: travelers, icon: getTravelerIcon(), color: 'bg-violet-50' },
    { label: 'Duration', value: `${days} Days`, icon: calender, color: 'bg-orange-50' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12 md:mb-16">
      {stats.map((stat, idx) => (
        <div key={idx} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className={`w-14 h-14 ${stat.color} rounded-2xl flex items-center justify-center mb-4 shadow-inner overflow-hidden p-2`}>
            <img src={stat.icon} alt={stat.label} className="w-full h-full object-contain" />
          </div>
          <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">{stat.label}</p>
          <p className="text-sm md:text-base font-black text-slate-900 truncate">{stat.value}</p>
        </div>
      ))}
    </div>
  );
};

export default TripStats;

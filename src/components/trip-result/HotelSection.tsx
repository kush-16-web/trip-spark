import React, { useEffect, useState } from 'react';
import stayIcon from '../../assets/stay.gif';
import { API_BASE_URL } from '../../services/tripApi';

interface Hotel {
  name: string;
  tag: string;
  blurb: string;
}

interface HotelSectionProps {
  hotels: readonly Hotel[];
  city: string;
}

const HotelCard = ({ stay, city }: { stay: Hotel, city: string }) => {
  const [details, setDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`${API_BASE_URL}/api/trip/hotel/details?name=${encodeURIComponent(stay.name)}&city=${encodeURIComponent(city)}`);
        const data = await res.json();
        if (data.ok) {
          setDetails(data.details);
        }
      } catch (err) {
        console.error("Error in getting details:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchDetails()
  }, [stay.name, city])

  const photoUrl = details?.photoReference 
    ? `${API_BASE_URL}/api/trip/hotel/photo/${details.photoReference}`
    : "https://via.placeholder.com/400x300?text=No+Photo+Available";

  return (
    <article className="group relative overflow-hidden rounded-[2.5rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/40 hover:border-violet-200 transition-all duration-500">
      <div className="flex flex-col md:flex-row min-h-[220px]">
        {/* Left Side: Photo */}
        <div className="md:w-1/3 relative h-48 md:h-auto overflow-hidden">
           {isLoading ? (
             <div className="w-full h-full bg-slate-100 animate-pulse flex items-center justify-center">
               <span className="text-slate-300 text-[10px] font-black uppercase tracking-widest">Finding...</span>
             </div>
           ) : (
             <img 
               src={photoUrl} 
               alt={stay.name}
               className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
             />
           )}
           <div className="absolute top-4 left-4 md:hidden">
             <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/10">
               {stay.tag}
             </span>
           </div>
        </div>

        {/* Right Side: Details */}
        <div className="p-6 md:p-8 md:w-2/3 flex flex-col justify-center">
           <div className="flex justify-between items-start mb-2">
             <h5 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight group-hover:text-violet-600 transition-colors">
               {stay.name}
             </h5>
             <span className="hidden md:inline-block text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-slate-900 text-white">
               {stay.tag}
             </span>
           </div>

           {/* Live Rating from Google */}
           {!isLoading && details?.rating && (
             <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1 bg-violet-50 px-2 py-1 rounded-lg">
                  <span className="text-violet-600 font-black text-sm">⭐ {details.rating}</span>
                </div>
                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-tighter">
                  ({details.userRatingsTotal.toLocaleString()} reviews)
                </span>
             </div>
           )}

           <p className="text-slate-500 text-sm md:text-base leading-relaxed font-medium mb-6 line-clamp-2">
             {stay.blurb}
           </p>
           
           <div className="mt-auto space-y-3">
              {details?.address && (
                <div className="flex items-start gap-2 text-slate-400">
                  <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p className="text-[10px] font-bold leading-tight line-clamp-1">{details.address}</p>
                </div>
              )}
              
              {details?.mapUrl && (
                <a 
                  href={details.mapUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-violet-600 font-black text-[10px] uppercase tracking-widest hover:text-violet-700 transition-all group/link"
                >
                  Explore on Google Maps
                  <span className="group-hover/link:translate-x-1 transition-transform">→</span>
                </a>
              )}
           </div>
        </div>
      </div>
    </article>
  );
}

const HotelSection: React.FC<HotelSectionProps> = ({ hotels, city }) => {
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
          <HotelCard key={stay.name} stay={stay} city={city} />
        ))}
      </div>
    </div>
  );
};

export default HotelSection;

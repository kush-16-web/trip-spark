import { useState } from 'react';
import soloTravel from '../assets/solo-traveller.gif';
import Romantic from '../assets/dating.gif';
import Couples from '../assets/dating.png'
import family from '../assets/Family-travel.gif';
import friends from '../assets/friends.gif';
import Budget from '../assets/Budget.gif'
import Moderate from '../assets/wallet.gif'
import Luxury from '../assets/Premium.gif'
import Travelers from '../assets/group.gif'
import Sun from '../assets/sun.gif'
import Cloudy from '../assets/cloudy.gif'
import Fog from '../assets/foggy.gif'
import Raining from '../assets/raining.gif'
import Snowing from '../assets/snowing.gif'
import Thunderstorm from '../assets/thunderstorm.gif'
import calender from '../assets/calendar-time.gif'

import type {
  BudgetEstimateRow,
  DayPlan,
  PlaceSuggestion,
  StaySuggestion,
  TotalEstimate,
  Weather,
} from '../services/tripApi';

export interface TripResultData {
  Destination?: string;
  days?: number | string;
  travelers?: number | string;
  budget?: string;
  startDate?: string;
  endDate?: string;
  type?: string;
  summary?: string;
  totalEstimate?: TotalEstimate;
  dayPlan?: DayPlan[];
  budgetEstimate?: BudgetEstimateRow[];
  suggestedStays?: StaySuggestion[];
  suggestedPlaces?: PlaceSuggestion[];
  weather?: Weather[] | null;
}

interface TripResultProps {
  /** Parent state may be null until a trip is planned; we guard below. */
  data: TripResultData | null | undefined;
  onEdit: () => void;
}

function TripTypeBadge({ tripType }: { tripType?: string }) {
  const t = tripType ?? '';
  const icon =
    t === 'Friends' ? (
      <img src={friends} className="h-8 w-8 object-cover rounded-full" alt="" />
    ) : t === 'Family' ? (
      <img src={family} alt="" className="h-8 w-8 object-cover rounded-full" />
    ) : t === 'Solo' ? (
      <img src={soloTravel} alt="" className="h-8 w-8 object-cover rounded-full" />
    ) : t === 'Couple' ? (
      <img src={Romantic} alt="" className="h-8 w-8 object-cover rounded-full bg-current" />
    ) : null;

  return (
    <span className="px-4 py-1.5 transition-all duration-500 bg-slate-900 text-white border border-slate-800 rounded-full text-xs md:text-sm font-bold tracking-wide uppercase flex items-center gap-2">
      {t}
      {icon}
    </span>
  );
}

function SectionHeading({
  id,
  eyebrow,
  title,
  icon,
}: {
  id: string;
  eyebrow: string;
  title: string;
  icon: string;
}) {
  return (
    <div id={id} className="mb-8 md:mb-10">
      <p className="text-[10px] md:text-xs font-black text-violet-500 uppercase tracking-widest mb-2">{eyebrow}</p>
      <h3 className="text-2xl md:text-4xl font-black text-slate-900 flex items-center gap-3 tracking-tight">
        <span aria-hidden>{icon}</span>
        {title}
      </h3>
    </div>
  );
}

/** Placeholder copy until AI generates summary from place, days, vibe, etc. */
const HARDCODED_DAY_ACTIVITIES = [
  { time: '09:00', title: 'Morning exploration', desc: 'Landmarks and local neighborhoods while the city wakes up.' },
  { time: '13:00', title: 'Lunch & culture', desc: 'Regional dishes, then a museum or walking tour.' },
  { time: '16:00', title: 'Afternoon unwind', desc: 'Park, viewpoint, or café before the evening.' },
];

const HARDCODED_BUDGET_ROWS = [
  { label: 'Stay (nights)', amount: '$420–680', note: 'Mid-range hotels / guesthouses' },
  { label: 'Food & drinks', amount: '$180–320', note: 'Mix of cafés and one nicer dinner' },
  { label: 'Local transport', amount: '$45–90', note: 'Metro, rides, short taxis' },
  { label: 'Activities & tickets', amount: '$120–200', note: 'Museums, tours, experiences' },
  { label: 'Buffer / misc.', amount: '$80–150', note: 'Souvenirs, tips, small surprises' },
] as const;

const HARDCODED_STAYS = [
  { name: 'Old Quarter Inn', tag: 'Boutique', blurb: 'Walkable core, breakfast included, quiet rooms.' },
  { name: 'Riverside Lodge', tag: 'Scenic', blurb: 'Views and slower pace; good for couples.' },
  { name: 'City Hub Hotel', tag: 'Practical', blurb: 'Near transit; easy base for packed days.' },
] as const;

const HARDCODED_PLACES = [
  { name: 'Central market hall', tag: 'Food & people-watching', time: '2–3 hrs' },
  { name: 'Heritage quarter walk', tag: 'Free / self-guided', time: 'Half day' },
  { name: 'Sunset viewpoint trail', tag: 'Outdoors', time: '2 hrs' },
  { name: 'Contemporary arts district', tag: 'Evening', time: 'Flexible' },
] as const;

export default function TripResult({ data, onEdit }: TripResultProps) {
  const [activeDay, setActiveDay] = useState(1);

  if (data == null) {
    return null;
  }

  const travelerCount = Number(data.travelers) || 1;
  const perPersonMin = Math.round(data.totalEstimate?.min / travelerCount);
  const perPersonMax = Math.round(data.totalEstimate?.max / travelerCount);
  const destination = data.Destination?.trim() || 'your destination';
  const dayCount = Math.max(1, data.dayPlan?.length || Number(data?.days) || 1);
  const days = Array.from({ length: dayCount }, (_, i) => i + 1);
  const activeDayPlan = data.dayPlan?.find((item) => item.day === activeDay);
  const weatherForDay = data.weather?.[activeDay - 1];

  return (
    <section id="trip-result" className="py-16 md:py-24 bg-slate-50 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-indigo-50 to-transparent -z-10" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-violet-100/30 rounded-full blur-3xl -z-10" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-8">
          <div className="w-full md:w-auto">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="px-4 py-1.5 bg-violet-100 text-violet-700 rounded-full text-xs md:text-sm font-bold tracking-wide uppercase">
                Your adventure is ready
              </span>
              <TripTypeBadge tripType={data?.type} />
            </div>
            <h2 className="text-5xl md:text-8xl font-black text-slate-900 leading-none tracking-tight">{destination}</h2>
          </div>

          <button
            type="button"
            onClick={onEdit}
            className="group px-6 py-4 md:px-8 md:py-5 bg-slate-900 text-white rounded-3xl md:rounded-[2rem] font-bold text-base md:text-lg hover:bg-violet-600 transition-all duration-300 shadow-xl shadow-slate-200 flex items-center gap-3 active:scale-95"
          >
            <span>Edit preferences</span>
            <span className="group-hover:rotate-180 transition-transform duration-500" aria-hidden>
              ⚙️
            </span>
          </button>
        </div>

        {/* At-a-glance (feeds into summary context) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12 md:mb-16">
          {[
            { label: 'Duration', value: `${dayCount} day${dayCount === 1 ? '' : 's'}`, icon: calender },
            { label: 'Group', value: `${data?.travelers ?? '—'} people`, icon: Travelers },
            { label: 'Budget style', value: data?.budget ?? '—', icon: data?.budget === 'Budget' ? Budget : data?.budget === 'Moderate' ? Moderate : Luxury },
            { label: 'Trip type', value: data?.type ?? '—', icon: data?.type === 'Friends' ? friends : data?.type === 'Family' ? family : data?.type === 'Couple' ? Couples : soloTravel },
          ].map((stat) => (
            <div
              key={stat.label}
              className="p-5 md:p-8 rounded-[2rem] md:rounded-[2.5rem] bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-50 transition-all duration-500"
            >
              <img src={stat.icon} alt={stat.label} className='h-8 w-8 mb-4' />
              <p className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-lg md:text-2xl font-bold text-slate-800">{stat.value}</p>
            </div>
          ))}
        </div>

        {data.totalEstimate && (
          <div className="rounded-[1.5rem] md:rounded-[2rem] bg-slate-900 text-white p-6 md:p-8 mb-12 md:mb-16 shadow-xl">
            <p className="text-xs uppercase tracking-widest text-violet-200 font-black mb-2">Estimated trip cost</p>
            <div className="flex items-center justify-start gap-4">
            <p className="text-2xl md:text-4xl font-black">
              {data.totalEstimate.currency} {data.totalEstimate.min.toLocaleString()} -{' '}
              {data.totalEstimate.max.toLocaleString()}
            </p>
            {data.type === 'Friends' && (
              <span className="text-sm text-white font-bold bg-violet-200/20 shadow-sm shadow-violet-900 italic rounded-lg p-2 flex items-center gap-2">
                Per person: {data.totalEstimate.currency} {perPersonMin.toLocaleString()} -{' '}
                {perPersonMax.toLocaleString()}
              </span>
            )}
            </div>
            <p className="text-sm text-slate-300 mt-2">{data.totalEstimate.note}</p>
          </div>
        )}

        {/* 1. Trip summary */}
        <section className="mb-16 md:mb-24" aria-labelledby="trip-summary-heading">
          <SectionHeading id="trip-summary-heading" eyebrow="Overview" title="Trip summary" icon="📋" />
          <div className="rounded-[2rem] md:rounded-[3rem] bg-white border border-slate-100 shadow-sm p-8 md:p-12">
            <p className="text-slate-600 text-base md:text-lg leading-relaxed mb-8">
              {data.summary ?? `Trip plan for ${destination}.`}
            </p>
            <ul className="grid sm:grid-cols-2 gap-4">
              {[
                'Balanced mix of sights, food, and downtime',
                'Suited to your group size and budget band',
                'Day blocks you can reorder without losing the story',
              ].map((item) => (
                <li
                  key={item}
                  className="flex gap-3 items-start text-slate-700 text-sm md:text-base leading-relaxed"
                >
                  <span className="mt-1 shrink-0 w-2 h-2 rounded-full bg-violet-500" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 2. Day-wise plan */}
        <section className="mb-16 md:mb-24" aria-labelledby="day-plan-heading">
          <SectionHeading id="day-plan-heading" eyebrow="Schedule" title="Day-wise plan" icon="🗺️" />
          
          <div className="max-w-4xl">
            {/* Horizontal Tabs */}
            <div className="flex bg-violet-100 w-fit rounded-full py-2 px-4 transition-all duration-300 overflow-x-auto gap-2 mb-6 md:mb-10 snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {days.map((day) => (
                <button
                  key={day}
                  onClick={() => setActiveDay(day)}
                  className={`shrink-0 snap-start py-1 px-4 rounded-2xl font-bold text-base md:text-lg transition-all duration-300 flex items-center gap-1 border-2 ${
                    activeDay === day 
                      ? 'bg-violet-600 text-white border-violet-600 shadow-lg shadow-violet-200 scale-100' 
                      : 'bg-white text-slate-500 border-slate-100 hover:border-violet-200 hover:bg-violet-50 hover:scale-90'
                  }`}
                >
                  <span className={`text-[10px] md:text-xs uppercase tracking-widest ${activeDay === day ? 'text-white' : 'text-slate-400'}`}>Day</span>
                  <span>{day}</span>
                </button>
              ))}
            </div>

            {/* Active Day Content */}
            <div className="p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] bg-white border border-slate-100 shadow-sm transition-all relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-36 h-36 bg-violet-50 rounded-bl-full -z-10 transition-transform duration-500 group-hover:scale-110" />
              
              <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
                <h4 className="text-xl md:text-3xl font-black text-slate-900 flex flex-wrap items-center gap-3">
                  Day {activeDay}
                  <span className="text-[10px] md:text-sm font-bold px-3 py-1.5 bg-violet-50 text-violet-600 rounded-xl uppercase">
                    AI itinerary
                  </span>
                  {weatherForDay && (
                    <div className='flex gap-2 items-center shadow-sm shadow-violet-400 p-2 rounded-xl'>
                      <span className='text-lg'>
                        {weatherForDay.weatherCode === 0 ? <img src={Sun} alt="Sun" className='w-10 h-10 inline' /> : 
                        weatherForDay.weatherCode === 1 || weatherForDay.weatherCode === 2 ? <img src={Cloudy} alt="Cloudy" className='w-10 h-10 inline' /> : 
                        weatherForDay.weatherCode === 3 ? <img src={Cloudy} alt="Cloudy" className='w-10 h-10 inline' /> : 
                        weatherForDay.weatherCode === 45 || weatherForDay.weatherCode === 48 ? <img src={Fog} alt="Fog" className='w-10 h-10 inline' /> : 
                        weatherForDay.weatherCode === 51 || weatherForDay.weatherCode === 53 || weatherForDay.weatherCode === 55 ? <img src={Raining} alt="Raining" className='w-10 h-10 inline' /> : 
                        weatherForDay.weatherCode === 56 || weatherForDay.weatherCode === 57 ? <img src={Raining} alt="Raining" className='w-10 h-10 inline' /> : 
                        weatherForDay.weatherCode === 61 || weatherForDay.weatherCode === 63 || weatherForDay.weatherCode === 65 ? <img src={Raining} alt="Raining" className='w-10 h-10 inline' /> : 
                        weatherForDay.weatherCode === 66 || weatherForDay.weatherCode === 67 ? <img src={Raining} alt="Raining" className='w-10 h-10 inline' /> : 
                        weatherForDay.weatherCode === 71 || weatherForDay.weatherCode === 73 || weatherForDay.weatherCode === 75 ? <img src={Snowing} alt="Snowing" className='w-10 h-10 inline' /> : 
                        weatherForDay.weatherCode === 77 ? <img src={Snowing} alt="Snowing" className='w-10 h-10 inline' /> : 
                        weatherForDay.weatherCode === 80 || weatherForDay.weatherCode === 81 || weatherForDay.weatherCode === 82 ? <img src={Raining} alt="Raining" className='w-10 h-10 inline' /> : 
                        weatherForDay.weatherCode === 85 || weatherForDay.weatherCode === 86 ? <img src={Snowing} alt="Snowing" className='w-10 h-10 inline' /> : 
                        weatherForDay.weatherCode === 95 ? <img src={Thunderstorm} alt="Thunderstorm" className='w-10 h-10 inline' /> : 
                        weatherForDay.weatherCode === 96 || weatherForDay.weatherCode === 99 ? <img src={Thunderstorm} alt="Thunderstorm" className='w-10 h-10 inline' /> : ''}
                      </span>
                     <span className="text-sm font-bold text-slate-600 ml-1">
                      {weatherForDay.tempMax}° / {weatherForDay.tempMin}°
                      </span>
                      <span className="hidden md:inline text-[10px] md:text-xs font-medium text-violet-600 italic bg-violet-50 px-2 py-1 rounded-lg">
                        {weatherForDay.weatherCode === 0 ? "Perfect day for sightseeing! 🕶️" : 
                        weatherForDay.weatherCode >= 1 && weatherForDay.weatherCode <= 3 ? "Good day to explore! 🌤️" :
                        weatherForDay.weatherCode >= 51 && weatherForDay.weatherCode <= 67 ? "Grab an umbrella! ☔" :
                        weatherForDay.weatherCode >= 80 && weatherForDay.weatherCode <= 82 ? "Heavy rain expected, stay dry! 🌧️" :
                        weatherForDay.weatherCode >= 95 ? "Thunderstorms! Better stay indoors. ⚡" :
                        "Enjoy your day! ✨"}
                      </span>
                    </div>
                  )}
                </h4>
                <span className="text-[10px] md:text-xs font-black tracking-widest uppercase text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">
                  {(activeDayPlan?.activities.length ? activeDayPlan.activities.length : HARDCODED_DAY_ACTIVITIES.length)} stops
                </span>
              </div>

              <div className="space-y-4">
                {(activeDayPlan?.activities.length ? activeDayPlan.activities : HARDCODED_DAY_ACTIVITIES).map((item, idx) => (
                  <details
                    key={`${item.title}-${idx}`}
                    open={idx === 0}
                    className="group/details rounded-2xl border border-slate-100 bg-slate-50/60 p-4 md:p-5 transition-colors hover:border-violet-200"
                  >
                    <summary className="list-none cursor-pointer flex items-start gap-4">
                      <div className="w-9 h-9 rounded-xl bg-white border border-violet-200 text-violet-700 font-black text-sm flex items-center justify-center shrink-0">
                        {idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <p className="text-[10px] md:text-xs font-black text-violet-600 uppercase tracking-widest bg-violet-100 px-2 py-1 rounded-md">
                            {item.time}
                          </p>
                        </div>
                        <h5 className="text-base md:text-lg font-bold text-slate-800 leading-snug pr-3">{item.title}</h5>
                      </div>
                      <span className="text-slate-400 group-open/details:rotate-180 transition-transform">⌄</span>
                    </summary>
                    <p className="text-slate-600 leading-relaxed text-sm md:text-base mt-4 pl-[52px]">{item.desc}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 3. Budget estimate */}
        <section className="mb-16 md:mb-24" aria-labelledby="budget-heading">
          <SectionHeading id="budget-heading" eyebrow="Numbers" title="Budget estimate" icon="💳" />
          <div className="rounded-[2rem] md:rounded-[3rem] bg-white border border-slate-100 shadow-sm p-6 md:p-10">
            {data.totalEstimate && (
              <div className="rounded-2xl md:rounded-[1.75rem] bg-slate-900 text-white p-5 md:p-7 mb-6 md:mb-8">
                <p className="text-[10px] md:text-xs font-black uppercase tracking-widest text-violet-200 mb-2">Estimated total</p>
                <p className="text-2xl md:text-4xl font-black leading-tight">
                  {data.totalEstimate.currency} {data.totalEstimate.min.toLocaleString()} - {data.totalEstimate.max.toLocaleString()} 
                </p>
                <p className="text-sm text-slate-300 mt-2">{data.totalEstimate.note}</p>
              </div>
            )}

            <p className="text-sm text-slate-500 leading-relaxed mb-6">
              Cost split for your selected budget style (<span className="font-semibold text-slate-700">{data?.budget ?? 'not set'}</span>).
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              {(data.budgetEstimate?.length ? data.budgetEstimate : HARDCODED_BUDGET_ROWS).map((row) => (
                <article
                  key={row.label}
                  className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 md:p-5 hover:border-violet-200 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h5 className="font-bold text-slate-900">{row.label}</h5>
                    <span className="font-black text-violet-700 whitespace-nowrap">{row.amount}</span>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed">{row.note}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Suggested places / stay */}
        <section className="mb-16 md:mb-20" aria-labelledby="suggestions-heading">
          <SectionHeading id="suggestions-heading" eyebrow="Ideas" title="Suggested places & stay" icon="🏨" />
          <div className="grid lg:grid-cols-2 gap-8 md:gap-10">
            <div>
              <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Where to stay</h4>
              <div className="space-y-3">
                {(data.suggestedStays?.length ? data.suggestedStays : HARDCODED_STAYS).map((stay) => (
                  <article
                    key={stay.name}
                    className="p-5 md:p-6 rounded-[1.25rem] md:rounded-[1.5rem] bg-white border border-slate-100 shadow-sm hover:border-violet-200 hover:shadow-md transition-all"
                  >
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h5 className="text-lg font-black text-slate-900">{stay.name}</h5>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-violet-100 text-violet-700">
                        {stay.tag}
                      </span>
                    </div>
                    <p className="text-slate-500 text-sm md:text-base leading-relaxed">{stay.blurb}</p>
                  </article>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Places to visit</h4>
              <ul className="space-y-3">
                {(data.suggestedPlaces?.length ? data.suggestedPlaces : HARDCODED_PLACES).map((place, index) => (
                  <li
                    key={`${place.name}-${index}`}
                    className="p-5 md:p-6 rounded-[1.25rem] md:rounded-[1.5rem] bg-white border border-slate-100 shadow-sm hover:border-violet-200 hover:shadow-md transition-all flex items-start gap-4"
                  >
                    <span className="w-8 h-8 rounded-lg bg-violet-100 text-violet-700 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <p className="font-bold text-slate-900 text-lg">{place.name}</p>
                      <p className="text-sm text-violet-600 font-semibold mt-1">{place.tag}</p>
                    </div>
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest shrink-0 mt-1">{place.time}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Footer actions */}
        <div className="mt-12 md:mt-16 text-center">
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] md:text-sm mb-8 italic">
            Adventure is waiting for you…
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-6">
            <button
              type="button"
              className="px-8 py-5 bg-violet-600 text-white rounded-[2rem] font-black text-lg hover:bg-violet-700 shadow-2xl shadow-violet-200 transition-all active:scale-95"
            >
              Book this trip ✈️
            </button>
            <button
              type="button"
              className="px-8 py-5 bg-white text-slate-900 border-2 border-slate-900 rounded-[2rem] font-black text-lg hover:bg-slate-50 transition-all active:scale-95"
            >
              Share itinerary 🔗
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

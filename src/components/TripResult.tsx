import { useState, useEffect, useRef } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, getFriendlyAuthErrorMessage } from '../lib/firebase';
import { loginWithGoogle } from '../services/authApi';
import AuthModal from './AuthModal';
import { 
  type BudgetEstimateRow,
  type DayPlan,
  type PlaceSuggestion,
  type StaySuggestion,
  type TotalEstimate,
  type Weather,
} from '../services/tripApi';

import tripIcon from '../assets/trip.gif';
import walletIcon from '../assets/wallet.gif';
import compassIcon from '../assets/compass.gif';
import calender from '../assets/calendar-time.gif';
import friends from '../assets/friends.gif';
import family from '../assets/Family-travel.gif';
import soloTravel from '../assets/solo-traveller.gif';
import Romantic from '../assets/dating.gif';
import TripStats from './trip-result/TripStats';
import HotelSection from './trip-result/HotelSection';
import MustVisitSection from './trip-result/MustVisitSection';
import ItineraryDay from './trip-result/ItineraryDay';
import EditModeToggle from './trip-result/EditModeToggle';

export interface TripResultData {
  id?: string;
  shareId?: string;
  Destination?: string;
  days?: number | string;
  travelers?: number | string;
  budgetRange?: { min: number; max: number };
  startDate?: string;
  endDate?: string;
  type?: string;
  summary?: string;
  summaryBullets?: string[];
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
  onViewMyTrips?: () => void;
  onCopyLink?: () => void;
  onUpdateTripData?: (newPlan: any) => void;
  isEditMode: boolean;
  setIsEditMode: (val: boolean) => void;
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
  const isEmoji = icon.length <= 4;
  return (
    <div id={id} className="mb-8 md:mb-12">
      <div className="flex items-center gap-3 mb-2">
        <div className="h-[1px] w-8 bg-violet-200" />
        <p className="text-[10px] md:text-xs font-black text-violet-500 uppercase tracking-[0.3em]">{eyebrow}</p>
      </div>
      <h3 className="text-3xl md:text-5xl font-black text-slate-900 flex items-center gap-4 tracking-tight">
        {isEmoji ? (
          <span className="text-3xl md:text-4xl" aria-hidden>{icon}</span>
        ) : (
          <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100/50 overflow-hidden">
            <img src={icon} className="w-10 h-10 md:w-12 md:h-12 object-contain" alt="" />
          </div>
        )}
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

export default function TripResult({ 
  data, 
  onViewMyTrips,
  isEditMode,
  setIsEditMode
}: TripResultProps) {
  const [activeDay, setActiveDay] = useState(1);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [authError, setAuthError] = useState<string | undefined>(undefined);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [pendingAction, setPendingAction] = useState<'save' | null>(null);
  const [loginSuccessMessage, setLoginSuccessMessage] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  const dayRefs = useRef<{ [key: number]: HTMLButtonElement | null }>({});
  const prevDay = useRef(activeDay);

  useEffect(() => {
    if (prevDay.current !== activeDay) {
      const activeTab = dayRefs.current[activeDay];
      if (activeTab) {
        activeTab.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
      prevDay.current = activeDay;
    }
  }, [activeDay]);

  async function handleContinueWithGoogle() {
    try {
      setIsSigningIn(true);
      setAuthError(undefined);

      const cred = await signInWithPopup(auth, googleProvider);
      const idToken = await cred.user.getIdToken();
      const loginData = await loginWithGoogle(idToken);
      if (!loginData.token || !loginData.user) {
        throw new Error('Google login response is incomplete');
      }

      localStorage.setItem('auth_token', loginData.token);
      localStorage.setItem('auth_user', JSON.stringify(loginData.user));
      setLoginSuccessMessage(`Logged in as ${loginData.user.email}`);

      setShowLoginPrompt(false);
      if (pendingAction === 'save') {
        setIsSaved(true);
        setPendingAction(null);
      }
    } catch (err: any) {
      console.error('Login failed:', err);
      const friendlyMessage = getFriendlyAuthErrorMessage(err.code);
      if (friendlyMessage) {
        setAuthError(friendlyMessage);
      } else {
        setAuthError('Google sign-in failed. Please try again.');
      }
    } finally {
      setIsSigningIn(false);
    }
  }

  function onClickSaveTrip() {
    if(isSaved && onViewMyTrips){
      onViewMyTrips();
      return;
    }
    const token = localStorage.getItem('auth_token');
    if (!token) {
      setPendingAction('save');
      setShowLoginPrompt(true);
      return;
    }
    setIsSaved(true);
    setAuthError(undefined);
  }

  if (data == null) {
    return null;
  }

  const loggedInUser = (() => {
    try {
      const raw = localStorage.getItem('auth_user');
      return raw ? (JSON.parse(raw) as { email?: string; picture?: string }) : null;
    } catch {
      return null;
    }
  })();

  const travelerCount = Number(data.travelers) || 1;
  const perPersonMin = Math.round((data.totalEstimate?.min ?? 0) / travelerCount);
  const perPersonMax = Math.round((data.totalEstimate?.max ?? 0) / travelerCount);
  const budgetDisplay =
    data.budgetRange
      ? `₹${data.budgetRange.min.toLocaleString()} - ₹${data.budgetRange.max.toLocaleString()}`
      : data.totalEstimate
        ? `${data.totalEstimate.currency}${data.totalEstimate.min.toLocaleString()} - ${data.totalEstimate.currency}${data.totalEstimate.max.toLocaleString()}`
        : '—';
  const destination = data.Destination?.trim() || 'your destination';
  const dayCount = Math.max(1, data.dayPlan?.length || Number(data?.days) || 1);
  const days = Array.from({ length: dayCount }, (_, i) => i + 1);
  const activeDayPlan = data.dayPlan?.find((item) => item.day === activeDay);
  // Header animations and logic

  return (
    <section id="trip-result" className={`py-16 md:py-24 bg-slate-50 overflow-hidden relative transition-colors duration-500 ${isEditMode ? 'bg-violet-50/30' : ''}`}>
      {/* Blueprint Grid Overlay (Only in Edit Mode) */}
      {isEditMode && (
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
      )}
      {loginSuccessMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 bg-emerald-600 text-white rounded-2xl shadow-lg font-semibold">
          {loginSuccessMessage}
        </div>
      )}

      {showLoginPrompt && (
        <AuthModal
         isOpen={showLoginPrompt}
         onClose={() => setShowLoginPrompt(false)}
         onGoogleLogin={handleContinueWithGoogle}
         isSigningIn={isSigningIn}
         error={authError}
        />
      )}

      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-indigo-50 to-transparent -z-10" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-violet-100/30 rounded-full blur-3xl -z-10" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-8">
          <div className="w-full md:w-auto">
            {data?.id && (
              <EditModeToggle 
                isActive={isEditMode} 
                onToggle={() => setIsEditMode(!isEditMode)} 
              />
            )}
            <div className="flex items-center gap-3 mb-6">
              <span className="px-4 py-3 bg-violet-100 text-violet-700 rounded-full text-[9px] md:text-sm font-bold tracking-wide uppercase">
                Your adventure is ready
              </span>
              <TripTypeBadge tripType={data?.type} />
            </div>
            <div className='flex md:flex-col justify-between items-center'>
            <h2 className="text-5xl md:text-8xl font-black text-slate-900 leading-none tracking-tight">{destination}</h2>
            </div>
          </div>
        </div>


        <TripStats 
          location={data?.Destination ?? '—'}
          budget={budgetDisplay}
          travelers={`${data?.travelers ?? '—'} people`}
          days={dayCount}
          tripType={data?.type ?? '—'}
        />

        {data.totalEstimate && (
          <div className="relative overflow-hidden rounded-[2rem] md:rounded-[2.5rem] bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 text-white p-8 md:p-12 mb-12 md:mb-16 shadow-2xl shadow-indigo-100">
            {/* Background design elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl -mr-32 -mt-32" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-6">
                <span className="w-8 h-[2px] bg-violet-400" />
                <p className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-violet-300 font-black">Estimated investment</p>
              </div>

              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                <div>
                  <p className="text-2xl md:text-6xl font-black items-center tracking-tighter mb-4">
                    <span className="text-violet-400 text-xl md:text-4xl mr-2">{data.totalEstimate.currency}</span>
                    {data.totalEstimate.min.toLocaleString()} <span className="text-slate-500 mx-2 text-lg md:text-5xl">—</span> {data.totalEstimate.max.toLocaleString()}
                  </p>
                  <p className="text-sm text-slate-400 max-w-xl leading-relaxed">{data.totalEstimate.note}</p>
                </div>

                {data.travelers && Number(data.travelers) > 1 && (
                  <div className="flex flex-col gap-3 p-6 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10">
                    <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Per person split</p>
                    <p className="text-2xl font-black text-white">
                      <span className='text-violet-400'>{data.totalEstimate.currency}</span> {perPersonMin.toLocaleString()} <span className="text-slate-600 font-normal text-lg">to</span> {perPersonMax.toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 1. Trip summary */}
        <section className="mb-24 md:mb-40" aria-labelledby="trip-summary-heading">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-start">
            <div className="lg:w-1/3 sticky top-24">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-slate-900 rounded-full mb-8">
                <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
                <span className="text-[10px] text-white font-black tracking-[0.2em] uppercase">Overview</span>
              </div>
              <h3 id="trip-summary-heading" className="text-4xl md:text-6xl font-black text-slate-900  tracking-tighter mb-6">
                The Experience
              </h3>
              <div className="w-20 h-2 bg-violet-600 rounded-full" />
            </div>
            
            <div className="lg:w-2/3">
              <div className="relative">
                {/* Decorative background element */}
                <div className="absolute -top-10 -left-10 w-32 h-32 bg-violet-100 rounded-full blur-3xl opacity-50 -z-10" />
                
                <div className="bg-white/40 backdrop-blur-md border border-white/60 p-8 md:p-12 rounded-[3rem] shadow-xl shadow-slate-200/50 relative overflow-hidden group">
                  <img src={tripIcon} className="absolute -right-4 -top-4 w-24 h-24 opacity-10 group-hover:opacity-20 transition-opacity" alt="" />
                  
                  <p className="text-lg md:text-3xl text-slate-900 font-bold leading-snug mb-16 relative">
                    <span className="text-6xl text-violet-200 absolute -top-8 -left-6 font-serif">“</span>
                    {data.summary ?? `An curated journey through ${destination}.`}
                  </p>
                  
                  <div className="grid sm:grid-cols-2 gap-8 md:gap-12 relative">
                    {(data.summaryBullets ?? []).map((item, idx) => (
                      <div key={idx} className="group/item">
                        <div className="flex items-start gap-5">
                          <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover/item:bg-violet-600 group-hover/item:border-violet-600 transition-all duration-300">
                            <span className="text-slate-400 font-black text-sm group-hover/item:text-white transition-colors">0{idx + 1}</span>
                          </div>
                          <p className="text-slate-600 text-base md:text-lg leading-relaxed font-medium pt-1">
                            {item}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Day-wise plan */}
        <section className="mb-24 md:mb-32" aria-labelledby="day-plan-heading">
          <SectionHeading id="day-plan-heading" eyebrow="Schedule" title="Day-wise plan" icon={calender} />
          
          <div className="max-w-5xl mx-auto px-4 md:px-0">
            {/* Horizontal Tabs - Refined sliding mechanism */}
            <div className="relative mb-12 md:mb-16">
              <div 
                className="relative flex bg-white w-full md:w-fit p-2 rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-100 overflow-x-auto snap-x no-scrollbar"
                style={{
                  '--tab-w': '85px',
                  '--tab-gap': '8px',
                  '--md-tab-w': '140px'
                } as any}
              >
                <div className="flex gap-2 relative">
                  {/* The Sliding Background */}
                  <div 
                    className="absolute top-0 bottom-0 bg-slate-900 rounded-[2rem] shadow-xl shadow-slate-900/20 transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) pointer-events-none"
                    style={{
                      width: 'var(--tab-w)',
                      transform: `translateX(calc(${(activeDay - 1)} * (var(--tab-w) + var(--tab-gap))))`,
                    } as any}
                    data-md-slider
                  />

                  <style>{`
                    @media (min-width: 768px) {
                      [data-md-slider] {
                        width: var(--md-tab-w) !important;
                        transform: translateX(calc(${(activeDay - 1)} * (var(--md-tab-w) + var(--tab-gap)))) !important;
                      }
                    }
                  `}</style>

                  {days.map((day) => (
                    <button
                      key={day}
                      ref={(el) => {dayRefs.current[day] = el}}
                      onClick={() => setActiveDay(day)}
                      className={`relative z-10 shrink-0 snap-start min-w-[85px] md:min-w-[140px] py-4 px-6 rounded-[2rem] font-bold text-sm md:text-base transition-all duration-500 flex flex-col items-center justify-center gap-1 ${
                        activeDay === day ? 'text-white' : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      <span className={`text-[8px] md:text-lg uppercase tracking-[0.3em] font-black ${activeDay === day ? 'opacity-100' : 'opacity-60'}`}>Day</span>
                      <span className={`text-xl md:text-2xl leading-none font-black ${activeDay === day ? 'text-white' : 'text-slate-400'}`}>{day}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <ItineraryDay 
              dayNumber={activeDay}
              activities={activeDayPlan?.activities.length ? activeDayPlan.activities : HARDCODED_DAY_ACTIVITIES}
              isEditMode={isEditMode}
              weather={data.weather?.[activeDay - 1]}
              date={data.startDate ? (() => {
                const start = new Date(data.startDate);
                const dayDate = new Date(start);
                dayDate.setDate(start.getDate() + (activeDay - 1));
                return dayDate.toLocaleDateString(undefined, {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                });
              })() : undefined}
            />
          </div>
        </section>

        {/* 3. Budget estimate */}
        <section className="mb-24 md:mb-32" aria-labelledby="budget-heading">
          <SectionHeading id="budget-heading" eyebrow="Investment" title="Budget breakdown" icon={walletIcon} />
          
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="h-full bg-slate-900 rounded-[3rem] p-10 flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-violet-500/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                
                <div className="relative z-10">
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-violet-400 mb-6">Total Strategy</p>
                  <h4 className="text-4xl font-black text-white leading-tight mb-8">
                    Your <br />Travel <br />Capital
                  </h4>
                  <div className="flex items-center gap-4 text-violet-400 mb-10">
                    <div className="h-[2px] w-12 bg-current" />
                      <span className="text-sm font-bold uppercase tracking-widest">{budgetDisplay}</span>
                  </div>
                </div>

                <div className="relative z-10 bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2rem]">
                  {data.totalEstimate && (
                    <>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Grand Total</p>
                      <p className="text-3xl font-black text-white tracking-tighter">
                        <span className="text-violet-400 text-xl mr-1">{data.totalEstimate.currency}</span>
                        {data.totalEstimate.min.toLocaleString()} — {data.totalEstimate.max.toLocaleString()}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 grid sm:grid-cols-2 gap-6">
              {(data.budgetEstimate?.length ? data.budgetEstimate : HARDCODED_BUDGET_ROWS).map((row, idx) => (
                <article
                  key={row.label}
                  className="group relative bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/30 hover:border-violet-200 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center font-black text-xs text-slate-400 group-hover:bg-violet-600 group-hover:text-white transition-all">
                      0{idx + 1}
                    </div>
                    <span className="text-lg font-black text-slate-900 tracking-tight">{row.amount}</span>
                  </div>
                  <h5 className="font-bold text-slate-900 text-xl mb-2">{row.label}</h5>
                  <p className="text-slate-500 text-sm leading-relaxed">{row.note}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Suggested places / stay */}
        <section className="mb-24 md:mb-32" aria-labelledby="suggestions-heading">
          <SectionHeading id="suggestions-heading" eyebrow="Discovery" title="Curated Suggestions" icon={compassIcon} />
          
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            <HotelSection hotels={data.suggestedStays?.length ? data.suggestedStays : HARDCODED_STAYS} />

            <MustVisitSection places={data.suggestedPlaces?.length ? data.suggestedPlaces : HARDCODED_PLACES} />
          </div>
        </section>

        {/* Footer actions - Redesigned for Premium Feel */}
        <div className="mt-20 md:mt-32 pb-20 max-w-4xl mx-auto px-6">
          <div className="relative p-8 md:p-12 rounded-[3rem] bg-white border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden text-center">
            {/* Background Accent */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-violet-50 rounded-full blur-3xl opacity-50" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50" />

            <div className="relative z-10">
              <p className="text-violet-500 font-black uppercase tracking-[0.3em] text-[8px] sm:text-[10px] md:text-xs mb-4">
                Your next story starts here
              </p>
              <h3 className="text-xl sm:text-2xl md:text-4xl font-black text-slate-900 mb-8">
                Ready for the adventure?
              </h3>
              
              <div className="flex flex-col items-center gap-6">
                <div className="flex flex-col md:flex-row justify-center items-center gap-4 w-full">
                  <button
                    type="button"
                    onClick={onClickSaveTrip}
                    className={`w-full md:w-auto py-2.5 sm:px-10 sm:py-5 ${isSaved ? 'bg-white text-black border border-black' : 'bg-slate-900 hover:bg-slate-800 text-white'} rounded-2xl font-bold text-sm sm:text-lg hover:translate-y-[-2px] transition-all duration-300 shadow-xl shadow-slate-900/10 active:scale-95 flex items-center justify-center gap-2`}
                  >
                    {isSaved ? 'See trip!' : 'Save Trip'} <span className="text-xl">✈️</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: `Trip to ${data.Destination}`,
                          text: `Check out my itinerary for ${data.Destination}!`,
                          url: `${window.location.origin}/share/${data.shareId}`,
                        });
                      } else {
                        navigator.clipboard.writeText(`${window.location.origin}/share/${data.shareId}`);
                        alert('Link copied to clipboard!');
                      }
                    }}
                    className="w-full md:w-auto py-2.5 sm:px-6 sm:py-5 bg-white text-slate-900 border-2 border-slate-200 rounded-2xl font-bold text-sm sm:text-lg hover:border-violet-400 hover:text-violet-600 hover:translate-y-[-2px] transition-all duration-300 active:scale-95 flex items-center justify-center gap-2"
                  >
                    Share Itinerary
                    <span className="text-xl">🔗</span>
                  </button>
                </div>

                <div className="flex flex-wrap justify-center gap-3 mt-4">
                  {onViewMyTrips && (
                    <button
                      type="button"
                      onClick={onViewMyTrips}
                      className="px-6 py-3 text-slate-500 font-bold text-sm hover:text-violet-600 bg-violet-50 rounded-xl transition-all"
                    >
                      View all my trips
                    </button>
                  )}
                  {loggedInUser?.email && (
                    <div className="px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-xs text-slate-500 font-medium">Logged in as {loggedInUser.email}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Editor HUD - Premium Floating Controls */}
        {isEditMode && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-3rem)] max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-500">
            <div className="bg-slate-900/90 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-4 pr-6 flex items-center justify-between shadow-2xl shadow-violet-500/20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-violet-600 flex items-center justify-center shadow-lg shadow-violet-600/30">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-violet-300"></span>
                  </span>
                </div>
                <div className="hidden sm:block">
                  <p className="text-white font-black text-sm uppercase tracking-widest leading-none mb-1">Itinerary Studio</p>
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-tighter">Refining your journey in real-time</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/10 hidden md:block">
                  <span className="text-[10px] font-black text-violet-400 uppercase tracking-widest">Saved to cloud</span>
                </div>
                <button 
                  onClick={() => setIsEditMode(false)}
                  className="px-6 py-3 bg-white text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-colors shadow-lg active:scale-95"
                >
                  Finish Editing
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

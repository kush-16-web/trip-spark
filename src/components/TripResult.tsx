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
import { arrayMove } from '@dnd-kit/sortable';
import magicWandIcon from '../assets/magic-wand.gif';
import TripStats from './trip-result/TripStats';
import HotelSection from './trip-result/HotelSection';
import MustVisitSection from './trip-result/MustVisitSection';
import ItineraryDay from './trip-result/ItineraryDay';
import EditModeToggle from './trip-result/EditModeToggle';
import { useBlocker } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const GhostWriter = ({ text, className }: { text: string; className?: string }) => {
  return (
    <motion.div className={`inline-flex items-center ${className}`}>
      {text.split("").map((char, i) => (
        <motion.span
          key={`${text}-${i}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.05,
            delay: i * 0.02,
            ease: "easeIn"
          }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
      <motion.span
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="ml-0.5 inline-block w-1.5 h-4 bg-violet-500 rounded-full"
      />
    </motion.div>
  );
};

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
  onSaveTripUpdates: (finalTripData: any) => void;
}


function TripTypeBadge({ 
  tripType, 
  onUpdate, 
  isEditMode 
}: { 
  tripType?: string, 
  onUpdate?: (type: string) => void, 
  isEditMode: boolean 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const options = [
    { type: 'Solo', icon: soloTravel },
    { type: 'Family', icon: family },
    { type: 'Friends', icon: friends },
    { type: 'Couple', icon: Romantic },
  ];

  const selectedOption = options.find(opt => opt.type.toLocaleLowerCase() === tripType?.toLocaleLowerCase()) || options[0];

  return (
    <div className="relative">
      <button
        disabled={!isEditMode}
        onClick={() => setIsOpen(!isOpen)}
        className={`px-4 py-1.5 transition-all duration-500 rounded-full text-xs md:text-sm font-bold uppercase flex items-center gap-3 ${
          isEditMode 
            ? 'bg-slate-900 text-white shadow-lg shadow-violet-200 cursor-pointer hover:scale-105 active:scale-95' 
            : 'bg-slate-900 text-white border border-slate-800'
        }`}
      >
        <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center overflow-hidden border border-white/10 shrink-0">
          <img src={selectedOption.icon} className="w-4 h-4 md:w-8 md:h-8 rounded-full object-contain" alt="" />
        </div>
        <span className="text-xs md:text-sm">{tripType || 'Select Type'}</span>
        {isEditMode && (
          <svg className={`w-3 h-3 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </button>

      <AnimatePresence>
        {isOpen && isEditMode && (
          <>
            <div className="fixed inset-0 z-[90]" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute top-full mt-3 left-0 z-[100] bg-white/90 backdrop-blur-2xl border border-slate-100 p-2 rounded-[1.5rem] shadow-2xl min-w-[160px] origin-top-left"
            >
              {options.map((opt) => (
                <button
                  key={opt.type}
                  onClick={() => {
                    onUpdate?.(opt.type);
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 rounded-xl transition-all group"
                >
                  <div className="w-8 h-8 bg-slate-100 group-hover:bg-black rounded-xl flex items-center justify-center transition-colors shrink-0">
                    <img src={opt.icon} className="w-5 h-5 object-contain" alt="" />
                  </div>
                  <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{opt.type}</span>
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
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
  onUpdateTripData,
  isEditMode,
  setIsEditMode,
  onSaveTripUpdates
}: TripResultProps) {
  const [activeDay, setActiveDay] = useState(1);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [authError, setAuthError] = useState<string | undefined>(undefined);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [pendingAction, setPendingAction] = useState<'save' | null>(null);
  const [loginSuccessMessage, setLoginSuccessMessage] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [localDayplan, setLocalDayplan] = useState<DayPlan[]>(data?.dayPlan || []);
  const [isGeneratingDay, setIsGeneratingDay] = useState(false);
  const [isGeneratingBudget, setIsGeneratingBudget] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  const dayRefs = useRef<{ [key: number]: HTMLButtonElement | null }>({});
  const prevDay = useRef(activeDay);

  // Navigation Blocker Logic
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      isEditMode && currentLocation.pathname !== nextLocation.pathname
  );

  // If navigation is blocked, we show this beautiful modal
  const showBlockerModal = blocker.state === "blocked";


  useEffect(() => {
    if (prevDay.current !== activeDay) {
      const activeTab = dayRefs.current[activeDay];
      if (activeTab) {
        activeTab.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
      prevDay.current = activeDay;
    }
  }, [activeDay]);

  useEffect(() => {
    if(data?.dayPlan){
      setLocalDayplan(data.dayPlan);
    }
  },[data?.id]);

  useEffect(() => {
  const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    if (isEditMode) {
      e.preventDefault();
      e.returnValue = ""; // Standard way to trigger the browser warning
    }
  };

  window.addEventListener("beforeunload", handleBeforeUnload);
  return () => window.removeEventListener("beforeunload", handleBeforeUnload);
}, [isEditMode]);


  const handleUpdateActivity  = (dayNumber: number,activityIndex: number, updatedActivity: any) => {
    const updatedLocalDayplan = localDayplan.map(dp => {
      if(dp.day === dayNumber){
        const newActivities = [...dp.activities];
        newActivities[activityIndex] = updatedActivity;
        return {...dp,activities : newActivities}
      }
      return dp;
    })
    setLocalDayplan(updatedLocalDayplan);
  };

  const handleDeleteActivity = (dayNumber: number, activityIndex: number) => {
  const updatedPlan = localDayplan.map(dp => {
    if (dp.day === dayNumber) {
      return { ...dp, activities: dp.activities.filter((_, i) => i !== activityIndex) };
    }
    return dp;
  });
  setLocalDayplan(updatedPlan);
  };

  const handleAddActivity = (dayNumber: number) =>{
    const existingDay = localDayplan.find(dp => dp.day === dayNumber);
    if(!existingDay) {
      setLocalDayplan([...localDayplan,{day:dayNumber,activities:[{title:"New Activity",time:"12:00",desc:"Add description here..."}]}])
      return;
    }
    const updatePLan = localDayplan.map(dp => {
      if(dp.day === dayNumber){
        return{...dp,activities:[...dp.activities,{ title: "New Activity", time: "12:00", desc: "Add description here..." } ]}
      }
      return dp;
    })
    setLocalDayplan(updatePLan);
  };

  const handleReorderActivity = (dayNumber: number, oldIndex: number, newIndex: number) => {
    const updatedPlan = localDayplan.map(dp => {
      if (dp.day === dayNumber) {
        return { 
          ...dp, 
          activities: arrayMove(dp.activities, oldIndex, newIndex) 
        };
      }
      return dp;
    });
    setLocalDayplan(updatedPlan);
  };

    const handleGenerateDayAI = async (dayNumber: number, customPrompt: string) => {
    try {
      setIsGeneratingDay(true);
      
      // 1. Get the activities ALREADY on this specific day
      const currentDayActivities = localDayplan.find(dp => dp.day === dayNumber)?.activities || [];
      const otherDaysActivities = localDayplan.flatMap(dp => dp.day !== dayNumber ? dp.activities.map(a => a.title) : []);
      
      // 2. Call your backend endpoint
      const response = await fetch('http://localhost:8080/api/trip/generate-day', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination: data?.Destination,
          type: data?.type || 'Solo',
          daynumber: dayNumber,
          customPrompt,
          existingActivities: otherDaysActivities.join(", "),
          currentDaySchedule: currentDayActivities
        })
      });

      if (!response.ok) throw new Error('Failed to generate day from AI');
      
      const result = await response.json();
      
      // 3. APPEND the new activities directly into the frontend state!
      setLocalDayplan(prev => {
        const existingDay = prev.find(dp => dp.day === dayNumber);
        if (!existingDay) {
          return [...prev, { day: dayNumber, activities: result.activities }];
        }
        return prev.map(dp => {
          if (dp.day === dayNumber) {
            // Logic: If the day was empty, use new activities. If not, append them.
            return { 
              ...dp, 
              activities: [...dp.activities, ...result.activities] 
            };
          }
          return dp;
        });
      });

    } catch (error) {
      console.error("Error generating day:", error);
      alert("Failed to generate activities. Please try again.");
    } finally {
      setIsGeneratingDay(false);
    }
  };

    const handleFetchNewWeather = async (newStartDate: string, newEndDate: string) => {
    try {
      const url = `http://localhost:8080/api/trip/weather/${encodeURIComponent(data.Destination || '')}/${newStartDate}/${newEndDate}`;
      const response = await fetch(url);
      const result = await response.json();
      
      if (result.ok && result.weather) {
        // Send the new weather array up to your parent component to save it!
        onUpdateTripData({ weather: result.weather });
      }
    } catch (error) {
      console.error("Failed to update weather", error);
    }
  };

  const handleGenerateBudget = async () => {
    setIsGeneratingBudget(true);
    try {
      const response = await fetch('http://localhost:8080/api/trip/generate-budget',{
        method:'POST',
        headers:{
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          destination: data.Destination,
          type: data.type,
          days: data.days,
          budgetRange: data.budgetRange,
          travelers: data.travelers,
          currentTotalEstimate: data.totalEstimate,
          currentBudgetEstimate: data.budgetEstimate,      
        })
      })
      const result = await response.json();
      if(result.ok && result.budget){
        if(onUpdateTripData){
          onUpdateTripData({
            totalEstimate:result.budget.totalEstimate,
            budgetEstimate:result.budget.budgetEstimate,
          })
        }
      }
    } catch (error) {
      console.error("Error generating budget:", error);
      alert("Failed to generate budget. Please try again.");
    } finally{
      setIsGeneratingBudget(false);
    }
  }

  const handleGenerateSummary = async () => {
    if(!data.Destination) return;
    setIsGeneratingSummary(true);
    try {
      const response = await fetch('http://localhost:8080/api/trip/generate-summary',
        {method:'POST',
          headers:{
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            destination: data.Destination,
            days: dayCount,
            type: data.type,
            travelers:data.travelers,
          }) 
        });
        const result = await response.json();
        if(result.ok){
          onUpdateTripData({
            summary:result.summary.summary,
            summaryBullets:result.summary.summaryBullets,
          })
        }
    } catch (error) {
      console.error("Error generating summary:", error);
      alert("Failed to generate summary. Please try again.");
    } finally{
      setIsGeneratingSummary(false);
    }
  }

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
      ? `₹${data.budgetRange.min?.toLocaleString() ?? '0'} - ₹${data.budgetRange.max?.toLocaleString() ?? '0'}`
      : data.totalEstimate
        ? `${data.totalEstimate.currency}${data.totalEstimate.min?.toLocaleString() ?? '0'} - ${data.totalEstimate.currency}${data.totalEstimate.max?.toLocaleString() ?? '0'}`
        : '—';
  const destination = data.Destination?.trim() || 'your destination';
  const dayCount = Math.max(1, Number(data?.days) || data.dayPlan?.length || 1);
  const days = Array.from({ length: dayCount }, (_, i) => i + 1);
  // const activeDayPlan = data.dayPlan?.find((item) => item.day === activeDay);
  const handleUpdateStats = (field: string, value: any) => {
    if (!onUpdateTripData) return;
    
    const newData = { ...data };
    
    if (field === 'startDate' || field === 'endDate') {
      const start = field === 'startDate' ? value : data.startDate;
      const end = field === 'endDate' ? value : data.endDate;
      
      newData[field as keyof TripResultData] = value;

      if (start && end) {
        const s = new Date(start);
        const e = new Date(end);
        const diff = e.getTime() - s.getTime();
        const calculatedDays = Math.max(1, Math.ceil(diff / (1000 * 3600 * 24)) + 1);
        newData.days = calculatedDays;
        handleFetchNewWeather(start, end);
      }
    } else if (field === 'Destination') {
      newData.Destination = value;
    } else if (field === 'budgetMin') {
      newData.totalEstimate = { ...data.totalEstimate!, min: parseInt(value) || 0 };
    } else if (field === 'budgetMax') {
      newData.totalEstimate = { ...data.totalEstimate!, max: parseInt(value) || 0 };
    } else if (field === 'currency') {
      newData.totalEstimate = { ...data.totalEstimate!, currency: value };
    } else if (field === 'travelers') {
      newData.travelers = value;
    } else if (field === 'type') {
      newData.type = value;
      // Safety net: Force travelers to 1 if Solo
      if (value.toLowerCase() === 'solo') {
        newData.travelers = 1;
      }
    }

    onUpdateTripData(newData);
  };

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

      {/* Premium Navigation Guard Modal */}
      {showBlockerModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 max-w-md w-full shadow-2xl border border-slate-100 relative overflow-hidden">
             {/* Decorative Background */}
             <div className="absolute -top-12 -right-12 w-32 h-32 bg-violet-50 rounded-full blur-2xl opacity-50" />
             
             <div className="relative z-10 text-center">
                <div className="w-20 h-20 bg-violet-100 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
                   <span className="text-4xl">⚠️</span>
                </div>
                
                <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-4 tracking-tight">Unsaved Changes!</h3>
                <p className="text-slate-500 font-medium leading-relaxed mb-10">
                   You're currently in the <span className="text-violet-600 font-bold">Itinerary Studio</span>. Leaving now will discard all your recent edits.
                </p>
                
                <div className="flex flex-col gap-3">
                   <button 
                     onClick={() => blocker.proceed?.()}
                     className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 active:scale-95"
                   >
                     Discard & Leave
                   </button>
                   <button 
                     onClick={() => blocker.reset?.()}
                     className="w-full py-4 bg-white text-slate-900 border-2 border-slate-100 rounded-2xl font-black text-sm uppercase tracking-widest hover:border-violet-200 hover:text-violet-600 transition-all active:scale-95"
                   >
                     Stay in Studio
                   </button>
                </div>
             </div>
          </div>
        </div>
      )}

      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-indigo-50 to-transparent -z-10" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-violet-100/30 rounded-full blur-3xl -z-10" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 md:mb-16 gap-8 relative z-10">
          <div className="w-full lg:flex-1 lg:max-w-4xl">
            <div className="flex items-center gap-3 mb-6 min-h-[40px]">
              <span className="px-4 py-3 bg-violet-100 text-violet-700 rounded-full text-[9px] md:text-sm font-bold tracking-wide uppercase shadow-inner shadow-violet-200/50">
                <AnimatePresence mode="wait">
                  <GhostWriter 
                    key={isEditMode ? 'studio' : 'ready'}
                    text={isEditMode ? "✨ Studio: Refine your masterpiece..." : "Your adventure is ready"} 
                  />
                </AnimatePresence>
              </span>
              <TripTypeBadge 
                tripType={data?.type} 
                isEditMode={isEditMode}
                onUpdate={(newType) => handleUpdateStats('type', newType)}
              />
            </div>
            <div className='flex md:flex-col justify-between items-center'>
              {isEditMode ? (
                <input
                  className="bg-transparent border-b border-violet-200 outline-none text-5xl md:text-8xl font-black text-slate-900 leading-none tracking-tight w-full max-w-full md:max-w-[90%]"
                  value={destination}
                  onChange={(e) => handleUpdateStats('Destination', e.target.value)}
                  autoFocus
                />
              ) : (
                <h2 className="text-5xl md:text-8xl font-black text-slate-900 leading-none tracking-tight">{destination}</h2>
              )}
            </div>
          </div>
          <div className="shrink-0">
            {data?.id && (
              <EditModeToggle 
                isActive={isEditMode} 
                onToggle={() => setIsEditMode(!isEditMode)} 
              />
            )}
          </div>
        </div>


        <TripStats 
          location={data?.Destination ?? '—'}
          budget={budgetDisplay}
          travelers={`${data?.travelers ?? '—'} people`}
          days={dayCount}
          tripType={data?.type ?? '—'}
          isEditMode={isEditMode}
          onUpdate={handleUpdateStats}
          startDate={data?.startDate}
          endDate={data?.endDate}
          minBudget={data?.totalEstimate?.min ?? 0}
          maxBudget={data?.totalEstimate?.max ?? 0}
          currency={data?.totalEstimate?.currency ?? '₹'}
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
                    {data.totalEstimate.min?.toLocaleString() ?? '0'} <span className="text-slate-500 mx-2 text-lg md:text-5xl">—</span> {data.totalEstimate.max?.toLocaleString() ?? '0'}
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
<section className="mb-24 md:mb-48 px-4 md:px-0" aria-labelledby="trip-summary-heading">
  <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">
    {/* Left Column: Title & Controls */}
    <div className="lg:w-1/3 lg:sticky lg:top-32 w-full">
      <div className="flex flex-row items-center justify-between">
        <div className="inline-flex items-center gap-3 px-4 py-2 bg-slate-900 rounded-full mb-8 shadow-xl shadow-slate-900/10">
          <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
          <span className="text-[10px] text-white font-black tracking-[0.3em] uppercase">Overview</span>
        </div>
      {isEditMode && (
        <button
          onClick={handleGenerateSummary}
          disabled={isGeneratingSummary}
          className="flex flex-col items-center gap-2 group"
        >
          <div className="p-1 bg-white shadow-2xl shadow-violet-100 border border-slate-100 rounded-[2rem] group-hover:scale-110 active:scale-95 transition-all relative overflow-hidden">
            <div className="absolute inset-0 bg-violet-500/0 group-hover:bg-violet-500/5 transition-colors" />
            <img src={magicWandIcon} className="md:w-10 md:h-10 w-8 h-8 relative z-10 group-hover:rotate-12 transition-transform" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-violet-600 transition-colors">Refine AI</span>
        </button>
      )}
    </div>    
      <div className="flex flex-row lg:flex-col items-center lg:items-start justify-between lg:justify-start gap-6 mb-8">
        <div>
          <h3 id="trip-summary-heading" className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-[0.9]">
            The <br className="hidden lg:block" /> Experience
          </h3>
          <div className="w-24 h-2 bg-violet-600 rounded-full mt-6" />
        </div>

      </div>
    </div>
    
    {/* Right Column: The Card */}
    <div className="lg:w-2/3 relative w-full">
       {/* Premium AI Loading Overlay */}
       {isGeneratingSummary && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-2xl z-50 flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-500 rounded-[3rem] md:rounded-[4rem]">
          <img src={magicWandIcon} className="w-24 h-24 mb-4" />
          <p className="text-slate-900 font-black text-xs uppercase tracking-[0.4em] animate-pulse">Rewriting the story...</p>
        </div>
      )}

      <div className="relative group">
        {/* Decorative background glow */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-violet-200/40 rounded-full blur-[100px] opacity-50 group-hover:opacity-80 transition-opacity" />
        
        <div className="bg-white/60 backdrop-blur-xl border border-white p-8 md:p-16 rounded-[3rem] md:rounded-[4rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] relative overflow-hidden">
          {/* Huge background quote mark */}
          <span className="absolute -top-10 -left-6 text-[15rem] font-serif text-slate-100/50 select-none pointer-events-none">“</span>
          
          <div className="relative z-10">
            <p className="text-lg md:text-4xl text-slate-900 font-bold leading-[1.1] tracking-tight mb-16">
              <AnimatePresence mode="wait">
                <GhostWriter 
                  key={data.summary}
                  text={data.summary ?? `A curated journey through ${destination}.`} 
                />
              </AnimatePresence>
            </p>
            
            <div className="grid sm:grid-cols-2 gap-x-12 gap-y-10">
              {(data.summaryBullets ?? []).map((item, idx) => (
                <div key={idx} className="group/item flex items-start gap-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover/item:bg-slate-900 group-hover/item:border-slate-900 transition-all duration-300 shadow-sm">
                    <span className="text-slate-400 font-black text-sm group-hover/item:text-white">0{idx + 1}</span>
                  </div>
                  <p className="text-slate-600 text-lg leading-relaxed font-medium pt-1">
                    {item}
                  </p>
                </div>
              ))}
            </div>
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
              activities={localDayplan.find(dp => dp.day === activeDay)?.activities || []}
              onUpdateActivity={(idx, updated) => handleUpdateActivity(activeDay, idx, updated)}
              onDeleteActivity={(idx) => handleDeleteActivity(activeDay, idx)}
              onAddActivity={() => handleAddActivity(activeDay)}
              onReorder={(oldIdx, newIdx) => handleReorderActivity(activeDay, oldIdx, newIdx)}
              isEditMode={isEditMode}
              onGenerateDayAI={(prompt) => handleGenerateDayAI(activeDay, prompt)}
              isGeneratingAI={isGeneratingDay}
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
                        <div className="flex flex-col sm:flex-row sm:items-center justify-start md:justify-between gap-4 mb-8 md:mb-12">
            <div className="mb-0">
              <SectionHeading id="budget-heading" eyebrow="Investment" title="Budget breakdown" icon={walletIcon} />
            </div>
            
            {isEditMode && (
              <button 
                onClick={handleGenerateBudget}
                disabled={isGeneratingBudget}
                className="w-fit md:w-full px-4 py-2 bg-black text-white font-bold rounded-xl hover:bg-slate-800 transition-colors flex items-center gap-2 text-sm disabled:opacity-50"
              >
                {isGeneratingBudget ? (
                  <> <span className="animate-spin">⏳</span> Updating... </>
                ) : (
                  <> ✨ Auto-update </>
                )}
              </button>
            )}
          </div>

          <div className="grid lg:grid-cols-3 gap-8 relative overflow-hidden">
            {isGeneratingBudget && (
    <div className="absolute inset-0 bg-white/60 backdrop-blur-md z-20 flex flex-col items-center justify-center animate-in fade-in duration-500 rounded-[3rem]">
       <div className="w-12 h-12 border-4 border-slate-900 border-t-violet-500 rounded-full animate-spin mb-4" />
       <p className="text-slate-900 font-black text-xs uppercase tracking-widest animate-pulse">
         Syncing with AI...
       </p>
    </div>
  )}
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
                        {data.totalEstimate.min?.toLocaleString() ?? '0'} — {data.totalEstimate.max?.toLocaleString() ?? '0'}
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
        {!isEditMode && (
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
        )}

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
                  onClick={() => {
                    const finalData = {
                      ...data,
                      dayPlan: localDayplan,
                    };
                    if(onSaveTripUpdates){
                      onSaveTripUpdates(finalData);
                      }
                  }}
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

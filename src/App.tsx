import { Routes, Route, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import TripForm from './components/TripForm'
import Destinations from './components/Destinations'
import Footer from './components/Footer'
import MyTrips from './components/MyTrips'
import './App.css'
import { useState, useEffect, useRef } from 'react'
// import compass from './assets/compass.gif'
import finder from './assets/finder.gif'
import TripResult from './components/TripResult'
import { getTripById, planTrip, type TripFormPayload, type TripPlanModel, getSharedTrip, updatetrip } from './services/tripApi'
import Features from './components/Features';

interface TripState extends Partial<TripPlanModel> {
  Destination: string;
  days: number | string;
  travelers: number | string;
  budgetRange?: { min: number; max: number };
  type?: string;
  placeStyle?: string;
  startDate: string;
  endDate: string;
  vibe?: string;
  shareId?: string;
  id?: string;

}

function App() {
  const navigate = useNavigate();
  const [trip, setTrip] = useState<TripState | null>(null);
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [userEmail, setUserEmail] = useState<string | undefined>(undefined);
  const [userPicture, setUserPicture] = useState<string | undefined>(undefined);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Planning your trip...");
  
  const formRef = useRef<HTMLDivElement | null>(null);
  const resultRef = useRef<HTMLDivElement | null>(null);

  const loadingMessages = [
    "Planning your trip...",
    "Researching destinations...",
    "Checking weather...",
    "Building itinerary...",
    "Adding hidden gems...",
    "Finalizing details...",
    "Voila! Your trip is ready..."
  ];

  useEffect(() => {
    if(loading){
      let index = 0;
      const interval = setInterval(() => {
        index = (index + 1) % loadingMessages.length;
        setLoadingMessage(loadingMessages[index]);
      }, 2500);

      return () => {
        if(interval) clearInterval(interval);
      }
    }
  },[loading])

  useEffect(() => {
    // ... (skipping lines) ...
  }, [loading, trip]);

  useEffect(() => {
    const hydrateUser = () => {
      try {
        const raw = localStorage.getItem('auth_user');
        const parsed = raw ? (JSON.parse(raw) as { email?: string; picture?: string }) : null;
        setUserEmail(parsed?.email);
        setUserPicture(parsed?.picture);
      } catch {
        setUserEmail(undefined);
        setUserPicture(undefined);
      }
    };
    hydrateUser();
    window.addEventListener('focus', hydrateUser);
    return () => window.removeEventListener('focus', hydrateUser);
  }, []);

  useEffect(() => {
    const path = window.location.pathname;
    if(path.startsWith('/share/')){
      const shareId = path.split('/').pop();
      if(shareId){
        handleOpenSharedTrip(shareId);
      }
    }
  },[])

  const handleFormSubmit = async (formData: TripFormPayload) => {
    try {
      setLoading(true);
      formRef.current?.scrollIntoView({ behavior: 'smooth' });

      const response = await planTrip(formData);
      // Preserve user input fields while merging generated AI plan.
      setTrip({
        ...formData,
        ...response.plan,
        weather: response.weather,
        shareId: response.shareId,
      } as TripState);
      setShowResult(true);
      navigate('/'); // Ensure we are on the planner view

      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    } catch (error) {
      console.error('Error while planning trip:', error);
    } finally {
      setLoading(false);
    }
  }

  const handlePlanTrip = (Destination: string) => {
    setShowResult(false);
    setLoading(true);
    formRef.current?.scrollIntoView({behavior:'smooth'});
    setTimeout(() => {
      setTrip({
        Destination,
        days: '',
        travelers: '',
        budgetRange: { min: 10000, max: 50000 },
        startDate: '',
        endDate: '',
      });
      setLoading(false);
    }, 2500);
  }


  const handleOpenTrip = async (tripId: string) => {
    try {
      setLoading(true);
      const response = await getTripById(tripId);
      const plannedTrip = response.trip;
      const plan = plannedTrip.plan;

      setTrip({
        id: plannedTrip.id,
        Destination: plannedTrip.destination,
        days: plannedTrip.days ?? plan.dayPlan?.length ?? 1,
        travelers: plannedTrip.travelers ?? 1,
        type: plannedTrip.type,
        budgetRange: undefined,
        startDate: plannedTrip.startDate,
        endDate: plannedTrip.endDate,
        ...plan,
        weather: plannedTrip.weather,
        shareId: plannedTrip.shareId,
      } as TripState);
      setShowResult(true);
      navigate('/'); // Go back to planner to show the result
    } catch (error) {
      console.error('Failed to open trip by id:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenSharedTrip = async (shareId: string) => {
    try {
      setLoading(true);
      const response = await getSharedTrip(shareId);
      const plannedTrip = response.trip;
      const plan = plannedTrip.plan;
      setTrip({
        id: plannedTrip.id,
        Destination: plannedTrip.destination,
        days: plannedTrip.days ?? plan.dayPlan?.length ?? 1,
        travelers: plannedTrip.travelers ?? 1,
        type: plannedTrip.type,
        ...plan,
        budgetRange: undefined,
        startDate: plannedTrip.startDate,
        endDate: plannedTrip.endDate,
        weather: plannedTrip.weather,
        shareId: plannedTrip.shareId,
      } as TripState);
      setShowResult(true);
    } catch (error) {
      console.error('Failed to open shared trip:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDestination = (city:string) => {
      setShowResult(false);
      setLoading(true);
      formRef.current?.scrollIntoView({behavior:'smooth'});
      setTimeout(() => {
        setTrip({
          Destination: city,
          days: '',
          travelers: '',
          budgetRange: { min: 10000, max: 50000 },
          startDate: '',
          endDate: '',
        });
        setLoading(false);
      }, 800);
    }  

  const handleHomeClick = () => {
  setTrip(null);       // Clear the current trip
  setShowResult(false); // Hide the results
  navigate('/');        // Go home
};
 
  
  const handleUpdateTripData  = (newPlan: any) => {
      setTrip(prev => prev ? { ...prev, ...newPlan } : null);
  }

  const handleTripDeleted = (deletedId: string) => {
    console.log('Trip deleted:', deletedId, 'Current trip ID:', trip?.id);
    setTrip(prev => {
      if (prev?.id === deletedId) {
        setShowResult(false);
        setIsEditMode(false);
        return null;
      }
      return prev;
    });
  };

  const handleSaveTripUpdates = async (finalTripData: any) => {
      if(!finalTripData?.id) return;
    try {
      setTrip(finalTripData);
      setLoading(true);
      await updatetrip(finalTripData.id, { ...finalTripData, plan: finalTripData });
      toast.success("Changes saved to cloud! ☁️");
      setIsEditMode(false);
    } catch (error) {
      toast.error("Failed to save changes");
    } finally{
      setLoading(false);
    }
  }
  
  return (
    <main className="min-h-screen">
      <Toaster 
        position="top-center" 
        containerClassName="hidden md:block"
        containerStyle={{top: 12}}
        toastOptions={{
          duration: 3000,
          style: {
            background: 'rgba(0, 0, 0, 0.6)',
            color: '#fff',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '8px 8px',
            borderRadius: '9999px',
            fontWeight: '600',
            fontSize: '13px',
            fontFamily: 'Outfit, sans-serif',
          },
        }}
      />



      <Navbar 
        userEmail={userEmail} 
        userPicture={userPicture} 
        onLogoClick={handleHomeClick}
        isEditMode={isEditMode}
      />
      
      <Routes>
        {/* Main Planner Route */}
        <Route path="/" element={
          <>
            <Hero onPlanTrip={handlePlanTrip} />
            <div ref={formRef} className="scroll-mt-24">
              {loading && (
                <div className="flex flex-col justify-center bg-white items-center h-screen">
                  <img src={finder} alt="trip-icon" className="w-24 h-24 ease-out"/>
                  <p className="font-lexend text-xl font-semibold mt-4">{loadingMessage}</p>
                </div>
              )}

              {!loading && trip && !showResult && <TripForm trip={trip} onComplete={handleFormSubmit} setTrip={setTrip} />}
              
              <div ref={resultRef} className="scroll-mt-24">
                {!loading && showResult && (
                  <TripResult
                    data={trip}
                    onCopyLink={() => toast('Link copied! 🔗')}
                    onViewMyTrips={() => navigate('/my-trips')}
                    onUpdateTripData={handleUpdateTripData}
                    isEditMode={isEditMode}
                    setIsEditMode={setIsEditMode}
                    onSaveTripUpdates={handleSaveTripUpdates}
                  />
                )}
              </div>
            </div>
            <Features />
            <Destinations onSelectDestination={handleSelectDestination} />
          </>
        } />

        {/* My Trips Route */}
        <Route path="/my-trips" element={
          <div className="pt-20">
             <MyTrips 
               onOpenTrip={handleOpenTrip} 
               onBackToPlanner={() => navigate('/')} 
               onTripDeleted={handleTripDeleted}
             />
          </div>
        } />

        {/* Shared Trip Route (handled by the useEffect we wrote earlier or directly here) */}
        <Route path="/share/:shareId" element={
          <div className="pt-24 min-h-screen bg-slate-50">
             {loading && (
                <div className="flex flex-col justify-center items-center py-20">
                  <img src={finder} alt="loading" className="w-16 h-16 opacity-50" />
                  <p className="text-slate-400 mt-4">Fetching shared itinerary...</p>
                </div>
             )}
             {!loading && showResult && (
                <div className="max-w-7xl mx-auto px-6">
                   <TripResult 
                     data={trip} 
                     onUpdateTripData={handleUpdateTripData} 
                     isEditMode={isEditMode}
                     setIsEditMode={setIsEditMode}
                     onSaveTripUpdates={handleSaveTripUpdates}
                   />
                </div>
             )}
             {!loading && !showResult && (
                <div className="text-center py-20">
                  <h2 className="text-2xl font-bold text-slate-800">Trip not found</h2>
                  <button onClick={() => navigate('/')} className="mt-4 text-violet-600 font-bold underline">Go to Planner</button>
                </div>
             )}
          </div>
        } />
      </Routes>
      <Footer />
    </main>
  );
}

export default App

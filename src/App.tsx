import Navbar from './components/Navbar'
import Hero from './components/Hero'
import TripForm from './components/TripForm'
import Destinations from './components/Destinations'
import Footer from './components/Footer'
import './App.css'
import { useState, useEffect, useRef } from 'react'
// import compass from './assets/compass.gif'
import finder from './assets/finder.gif'
import TripResult from './components/TripResult'
import { planTrip, type TripFormPayload, type TripPlanModel } from './services/tripApi'

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
}

function App() {
  const [trip, setTrip] = useState<TripState | null>(null);
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  
  const formRef = useRef<HTMLDivElement | null>(null);
  const resultRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if(!loading && trip){
      const element = document.getElementById('trip-result');
      if(element){
        element.scrollIntoView({behavior:'smooth'})
      }
    }

    if(loading){
       const messages = [
    "Cooking your trip...",
    "Finding the hidden gems...",
    "Checking the local vibes...",
    "Hold on, we're almost there...",
    "Packing your virtual bags...",
  ];

  let index = 0;
  const interval = setInterval(() => {
    setLoadingMessage(messages[index]);
    index = (index + 1) % messages.length;
  }, 2000);

  return () => clearInterval(interval);
    }
    else{
      setLoadingMessage("Planning your trip...");
    }

  }, [loading, trip]);

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
      } as TripState);
      setShowResult(true);

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

  const [loadingMessage, setLoadingMessage] = useState("Planning your trip...");

  
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero onPlanTrip={handlePlanTrip} />
      {/* <Features /> */}
      <div ref={formRef} className="">
  {loading &&  
    <div className="flex flex-col justify-center bg-white items-center h-screen">
      <img src={finder} alt="trip-icon" className="w-24 h-24 ease-out"/>
      <p className="font-lexend text-xl font-semibold mt-4">{loadingMessage}</p>
    </div>
  }

  {!loading && trip && !showResult && <TripForm trip={trip} onComplete={handleFormSubmit} />}
  <div ref={resultRef}>
   {!loading && showResult && <TripResult data={trip} onEdit={() => setShowResult(false)} />}
</div>

</div>
      <Destinations />
      <Footer />
    </main>
  )
}

export default App

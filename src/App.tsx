import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Features from './components/Features'
import TripForm from './components/TripForm'
import Destinations from './components/Destinations'
import Footer from './components/Footer'
import './App.css'
import { useState, useEffect, useRef } from 'react'
import compass from './assets/compass.gif'
import TripResult from './components/TripResult'

function App() {
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const formRef = useRef(null);
  const resultRef = useRef(null);

  const handleFormSubmit = (formData :any) => {
    setLoading(true);

    formRef.current?.scrollIntoView({behavior:'smooth'});

    setTimeout(() => {
      setTrip({...trip, ...formData });
      setShowResult(true);
      setLoading(false);

      setTimeout(() => {
        resultRef.current?.scrollIntoView({behavior:'smooth'});
      },2000)
    },2500)
  }

  const handlePlanTrip = (Destination: any) => {
    setShowResult(false);
    setLoading(true);
    formRef.current?.scrollIntoView({behavior:'smooth'});
    setTimeout(() => {
      setTrip({
        Destination,
      });
      setLoading(false);
    }, 2500);
  }

  useEffect(() => {
    if(!loading && trip){
      const element = document.getElementById('trip-result');
      if(element){
        element.scrollIntoView({behavior:'smooth'})
      }
    }
  }, [loading, trip]);
  
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero onPlanTrip={handlePlanTrip} />
      {/* <Features /> */}
      <div ref={formRef} className="">
  {loading && 
    <div className="flex flex-col justify-center bg-white items-center h-screen">
      <img src={compass} alt="trip-icon" className="w-24 h-24 ease-out"/>
      <p className="font-lexend text-xl font-semibold mt-4">Planning your trip...</p>
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

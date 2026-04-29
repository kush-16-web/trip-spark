import { useState, useEffect } from 'react';
import heroBanner from "../assets/trip_hero_banner.png";
import tripGIF from '../assets/trip.gif'

interface HeroProps {
  onPlanTrip: (destination: string) => void;
}


export default function Hero({ onPlanTrip }: HeroProps) {
  const [Destination, setDestination] = useState("");
  const [placeholderText, setPlaceholderText] = useState("");
  const [destIndex, setDestIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const destinations = ["Goa, India", "Manali, India","Himalayas, India", "Gokarna, India", "Tokyo, Japan", "Paris, France", "Bali, Indonesia", "New York, USA"];

  useEffect(() => {
    if (subIndex === destinations[destIndex].length + 1 && !isDeleting) {
      const timeout = setTimeout(() => setIsDeleting(true), 1500);
      return () => clearTimeout(timeout);
    }

    if (subIndex === 0 && isDeleting) {
      setIsDeleting(false);
      setDestIndex((prev) => (prev + 1) % destinations.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (isDeleting ? -1 : 1));
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [subIndex, destIndex, isDeleting]);

  useEffect(() => {
    setPlaceholderText(`Try "${destinations[destIndex].substring(0, subIndex)}"`);
  }, [subIndex, destIndex]);

  const handlePlanTrip = () => {
    const destinationToUse = Destination.trim();
    if (!destinationToUse) return;
    onPlanTrip(destinationToUse);
  };

  return (
    <section className="relative h-[90vh] min-h-[600px] flex items-center justify-center overflow-visible"
    style={{backgroundImage: `url(${heroBanner})`, backgroundSize: "cover", backgroundPosition: "center",backgroundAttachment: "fixed"}}>
      {/* Background Overlay for Foggy Effect */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/40 backdrop-blur-sm via-black/20 to-slate-50"></div>
      
      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-3 text-center text-white">
        <h1 className="text-4xl md:text-5xl lg:text-7xl mb-6 font-bold leading-tight drop-shadow-xl">
          Stop Dreaming, <br />
          Start <span className="text-black/90">Trippin'</span>
        </h1>
        <p className="text-md md:text-xl text-slate-100 mb-10 max-w-2xl mx-auto drop-shadow-md font-medium">
          No more mid itineraries. Our AI builds the main character energy your next trip deserves. 
          Low effort planning, high vibe traveling.
        </p>
        
        {/* Floating Search/CTA */}
        <div className="w-full max-w-3xl mx-auto relative backdrop-blur-lg bg-white p-2 rounded-3xl flex flex-col sm:flex-row gap-2 shadow-2xl">
          <div className="flex-1 min-w-0">
            <div className="px-3 sm:px-4 py-3 flex items-center gap-3">
              <img src={tripGIF} alt="trip-icon" className="w-7 h-7 sm:w-8 sm:h-8 bg-transparent shrink-0" />
              <input
                type="text"
                value={Destination}
                onChange={(e) => {
                  setDestination(e.target.value);
                }}
                placeholder={placeholderText}
                className="bg-transparent focus:placeholder-transparent border-none focus:ring-0 text-black placeholder-slate-400 w-full outline-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handlePlanTrip();
                  }
                }}
                required
              />
            </div>
          </div>
          <button 
            className="w-full sm:w-auto flex items-center justify-center gap-3 shadow-lg bg-violet-500 font-semibold text-black py-3 px-6 sm:px-8 rounded-full whitespace-nowrap transition-transform active:scale-[0.98]"
            onClick={handlePlanTrip}
            disabled={!Destination}
          >
            <span className="text-lg text-white">Plan My Trip</span>
          </button>
        </div>
      </div>
    </section>
  );
}
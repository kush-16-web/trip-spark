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

  // Autocomplete states
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  const destinations = ["Goa, India", "Manali, India", "Himalayas, India", "Gokarna, India", "Tokyo, Japan", "Paris, France", "Bali, Indonesia", "New York, USA"];

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

  // Fetch suggestions as user types
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (Destination.trim().length < 3) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      try {
        setIsLoadingSuggestions(true);
        const response = await fetch(`http://localhost:8080/api/trip/location/suggestions?input=${encodeURIComponent(Destination)}`);
        const data = await response.json();
        
        console.log("Autocomplete Response:", data); // Debugging

        if (data.ok && Array.isArray(data.suggestions)) {
          setSuggestions(data.suggestions);
          setShowSuggestions(true);
        } else {
          setSuggestions([]);
        }
      } catch (error) {
        console.error("Autocomplete fetch error:", error);
      } finally {
        setIsLoadingSuggestions(false);
      }
    };

    const timer = setTimeout(fetchSuggestions, 300); // Debounce
    return () => clearTimeout(timer);
  }, [Destination]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.search-container')) {
        setShowSuggestions(false);
      }
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const handlePlanTrip = () => {
    const destinationToUse = Destination.trim();
    if (!destinationToUse) return;
    onPlanTrip(destinationToUse);
  };

  return (
    <section className="relative h-[90vh] min-h-[600px] flex items-center justify-center overflow-visible"
      style={{ backgroundImage: `url(${heroBanner})`, backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed" }}>
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
        <div className="w-full max-w-3xl mx-auto relative z-[100] search-container">
          <div className="backdrop-blur-lg bg-white p-2 rounded-3xl flex flex-col sm:flex-row gap-2 shadow-2xl relative z-20">
            <div className="flex-1 min-w-0">
              <div className="px-3 sm:px-4 py-3 flex items-center gap-3">
                <img src={tripGIF} alt="trip-icon" className="w-7 h-7 sm:w-8 sm:h-8 bg-transparent shrink-0" />
                <input
                  type="text"
                  value={Destination}
                  onChange={(e) => {
                    setDestination(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => Destination.length >= 3 && setShowSuggestions(true)}
                  placeholder={placeholderText}
                  className="bg-transparent focus:placeholder-transparent border-none focus:ring-0 text-black placeholder-slate-400 w-full outline-none font-medium"
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
              className={`w-full sm:w-auto flex items-center justify-center gap-3 shadow-lg ${Destination ? "bg-violet-500" : "bg-violet-500/60"} font-semibold text-white py-3 px-6 sm:px-8 rounded-full whitespace-nowrap transition-all hover:scale-105 active:scale-[0.98]`}
              onClick={handlePlanTrip}
              disabled={!Destination}
            >
              <span className="text-lg text-white">Plan My Trip</span>
            </button>
          </div>

          {/* Suggestions Dropdown */}
          {showSuggestions && (suggestions.length > 0 || isLoadingSuggestions) && (
            <div className="absolute top-[80%] left-4 right-4 md:left-8 md:right-8 bg-white rounded-b-[2rem] shadow-2xl border-x border-b border-slate-100 overflow-hidden text-left z-10 animate-in fade-in slide-in-from-top-4 duration-300 pt-10">
              {isLoadingSuggestions ? (
                <div className="p-6 text-slate-400 text-sm font-bold uppercase tracking-widest animate-pulse flex items-center gap-3">
                   <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" />
                   Searching...
                </div>
              ) : (
                <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion.place_id}
                      onClick={() => {
                        setDestination(suggestion.description);
                        setSuggestions([]);
                        setShowSuggestions(false);
                      }}
                      className="w-full px-6 py-4 flex items-center gap-5 hover:bg-slate-50 transition-all text-slate-700 group border-b border-slate-50 last:border-0"
                    >
                      <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center group-hover:bg-violet-600 transition-all group-hover:rotate-12">
                        <span className="text-xl group-hover:scale-110 transition-transform">📍</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-black text-slate-900 group-hover:text-violet-600 transition-colors text-sm uppercase tracking-tight">
                          {suggestion.structured_formatting.main_text}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                          {suggestion.structured_formatting.secondary_text}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
import { useState } from 'react';
import heroBanner from "../assets/trip_hero_banner.png";
import way from "../assets/way.gif";
import tripGIF from '../assets/trip.gif'
import tripPNG from '../assets/trip.png'

export default function Hero({onPlanTrip}){
  const [isHovered, setIsHovered] = useState(false);
  const [Destination, setDestination] = useState("");

  return (
    <section className="relative h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden"
    style={{backgroundImage: `url(${heroBanner})`, backgroundSize: "cover", backgroundPosition: "center",backgroundAttachment: "fixed"}}>
      {/* Background Overlay for Foggy Effect */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/40 backdrop-blur-sm via-black/20 to-slate-50"></div>
      
      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
        <h1 className="text-4xl md:text-5xl lg:text-7xl font-['Lexend'] mb-6 leading-tight drop-shadow-xl">
          Your Next Great <br />
          <span className="text-black/90">Adventure</span> Starts Here
        </h1>
        <p className="text-md font-['Lexend'] md:text-xl text-slate-100 mb-10 max-w-2xl mx-auto drop-shadow-md">
          Ditch the spreadsheets. Our AI-powered planner crafts the perfect itinerary 
          tailored to your unique travel style and budget.
        </p>
        
        {/* Floating Search/CTA */}
        <div className="backdrop-blur-lg bg-white p-2 rounded-3xl flex flex-col md:flex-row gap-2 max-w-3xl mx-auto shadow-2xl">
          <div className="flex-1 px-4 py-3 flex items-center gap-3">
            <img src={tripGIF} alt="trip-icon" className="w-8 h-8 bg-transparent" />
            <input 
              type="text" 
              value={Destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Where do you want to go?" 
              className="bg-transparent font-['Lexend'] focus:placeholder-transparent border-none focus:ring-0 text-black placeholder-black w-full outline-none"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onPlanTrip(Destination);
                }
              }}
            />
          </div>
          <button 
            className="flex items-center justify-center gap-3 shadow-lg bg-violet-500 font-['Lexend'] font-semibold text-black py-3 px-8 rounded-full whitespace-nowrap"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => onPlanTrip(Destination)}
          >
            <span className="font-['Lexend'] text-lg text-white">Plan My Trip</span>
            {/* <img 
              src={isHovered ? tripGIF : tripPNG} 
              alt="trip-icon" 
              className={`w-6 h-6 bg-transparent transition-all duration-500 ease-in-out ${isHovered ? 'scale-150' : 'scale-100'}`} 
            /> */}
          </button>
        </div>
      </div>
    </section>
  );
}
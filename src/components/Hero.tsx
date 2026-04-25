import { useState } from 'react';
import heroBanner from "../assets/trip_hero_banner.png";
import way from "../assets/way.gif";
import tripGIF from '../assets/trip.gif'
import tripPNG from '../assets/trip.png'

export default function Hero() {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <section className="relative h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0 ">
        <img 
          src={heroBanner} 
          alt="Travel Destination" 
          className="w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 backdrop-blur-sm via-black/20 to-slate-50"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
        <h1 className="text-5xl md:text-7xl font-['Lexend'] mb-6 leading-tight drop-shadow-xl">
          Your Next Great <br />
          <span className="text-black/90">Adventure</span> Starts Here
        </h1>
        <p className="text-lg font-['Lexend'] md:text-xl text-slate-100 mb-10 max-w-2xl mx-auto drop-shadow-md">
          Ditch the spreadsheets. Our AI-powered planner crafts the perfect itinerary 
          tailored to your unique travel style and budget.
        </p>
        
        {/* Floating Search/CTA */}
        <div className="backdrop-blur-lg bg-[#000000]/50 p-2 rounded-3xl flex flex-col md:flex-row gap-2 max-w-3xl mx-auto shadow-2xl">
          <div className="flex-1 px-4 py-3 flex items-center gap-3">
            {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg> */}
            <input 
              type="text" 
              placeholder="Where do you want to go?" 
              className="bg-transparent font-['Lexend'] border-none focus:ring-0 text-black placeholder-black w-full outline-none"
            />
          </div>
          <button 
            className="flex items-center justify-between gap-3 shadow-lg bg-white font-['Lexend'] font-semibold text-black py-3 px-8 rounded-2xl whitespace-nowrap"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <span className="font-['Lexend'] text-lg">Plan My Trip</span>
            <img 
              src={isHovered ? tripGIF : tripPNG} 
              alt="trip-icon" 
              className={`w-6 h-6 bg-transparent transition-all duration-500 ease-in-out ${isHovered ? 'scale-150' : 'scale-100'}`} 
            />
          </button>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-indigo-600 animate-bounce">
        <span className="text-sm font-semibold uppercase tracking-widest">Scroll</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}
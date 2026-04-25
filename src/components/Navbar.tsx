import React from 'react';
import logo from "../assets/airplane-flight.png";

const Navbar: React.FC = () => {
  return (
    <nav className="w-[70%] mx-auto rounded-full mt-2 fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-md py-4 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <a href='/' className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center">
            <img src={logo} alt="Logo"  />
          </div>
          <div className="font-['Lexend']">
          <span className="text-2xl font-bold text-violet-400 group-hover:text-white transition-colors">
            Trip 
          </span>
          <span className="text-white group-hover:text-violet-400 transition-colors ">Spark</span>
          </div>
        </a>
        
        <div className="hidden md:flex items-center gap-8 text-white font-['Lexend'] font-medium">
          <a href="#" className="hover:text-violet-400 hover:scale-95 transition-all duration-300">Destinations</a>
          <a href="#" className="hover:text-violet-400 hover:scale-95 transition-all duration-300">Features</a>
          <a href="#" className="hover:text-violet-400 hover:scale-95 transition-all duration-300">Planning</a>
          <a href="#" className="hover:text-violet-400 hover:scale-95 transition-all duration-300">Community</a>
        </div>

        <button className="nav-get-started py-2 px-5 text-sm text-white font-medium rounded-full bg-violet-600/40 backdrop-blur-sm transition-all duration-300">
          <span>Get Started</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

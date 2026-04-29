import React from 'react';
import logo from "../assets/airplane-flight.png";

const Navbar: React.FC = () => {
  const navLinks = [
    { name: 'Explore', href: '#', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )},
    { name: 'Features', href: '#', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    )},
    { name: 'Planning', href: '#', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    )},
    { name: 'Social', href: '#', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    )},
  ];

  return (
    <>
      {/* Desktop/Tablet Top Navbar */}
      <nav className="hidden md:block w-[95%] lg:w-[85%] xl:w-[60%] mx-auto rounded-full mt-4 fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-md py-4 transition-all duration-300 border border-white/10 shadow-2xl shadow-black/20">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <a href='/' className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/10 p-1 group-hover:bg-white/20 transition-all">
              <img src={logo} alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div className="font-['Outfit']">
              <span className="text-2xl font-bold text-violet-400 group-hover:text-white transition-colors">Trip </span>
              <span className="text-white group-hover:text-violet-400 transition-colors">Spark</span>
            </div>
          </a>
          
          <div className="flex items-center gap-8 text-white font-medium">
            {navLinks.map((link) => (
              <a key={link.name} href={link.href} className="hover:text-violet-400 hover:-translate-y-0.5 transition-all duration-300 opacity-80 hover:opacity-100">
                {link.name}
              </a>
            ))}
          </div>

          <button className="nav-get-started py-2.5 px-6 text-sm text-white font-bold rounded-full bg-violet-600/60 hover:bg-violet-600 backdrop-blur-sm transition-all duration-300 shadow-lg shadow-violet-500/20 active:scale-95">
            Get Started
          </button>
        </div>
      </nav>

      {/* Mobile Floating Bottom Dock */}
      <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] z-50">
        <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-1 shadow-2xl shadow-black/40">
          <div className="flex items-center justify-between">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                className="flex-1 flex flex-col items-center justify-center py-3 min-w-0 rounded-2xl text-white/60 hover:text-violet-400 active:bg-white/5 transition-all duration-300"
              >
                <div className="mb-1 transform scale-90">{link.icon}</div>
                <span className="text-[9px] font-black uppercase tracking-tighter truncate w-full text-center px-0.5">{link.name}</span>
              </a>
            ))}
            
            <div className="h-6 w-[1px] bg-white/10 mx-1"></div>
            
            <button className="flex-shrink-0 w-10 h-10 rounded-2xl bg-violet-600 text-white flex items-center justify-center shadow-lg shadow-violet-600/30 active:scale-90 transition-all mr-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Branding (Top Left) */}
      <div className="md:hidden fixed top-2 left-[50%] -translate-x-1/2 justify-center z-50 flex items-center gap-2 bg-black/30 backdrop-blur-lg px-4 py-2 rounded-2xl border border-white/10 shadow-lg">
        <a href="/" className="flex items-center gap-2 group cursor-pointer">
          <img src={logo} alt="Logo" className="w-6 h-6" />
        <span className="font-['Outfit'] text-lg font-black text-white">TripSpark</span>
        </a>
      </div>
    </>
  );
};

export default Navbar;

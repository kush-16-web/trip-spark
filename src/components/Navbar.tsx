import React from 'react';
import logo from "../assets/airplane-flight.png";

interface NavbarProps {
  activeView: 'planner' | 'myTrips';
  onChangeView: (view: 'planner' | 'myTrips') => void;
  userEmail?: string;
}

const Navbar: React.FC<NavbarProps> = ({ activeView, onChangeView, userEmail }) => {
  const navLinks: Array<{ name: string; href: string; action?: () => void }> = [
    { name: 'Explore', href: '#explore' },
    { name: 'Features', href: '#features' },
    { name: 'Planning', href: '#trip-result' },
    { name: 'Social', href: '#footer' },
    { name: 'My Trips', href: '#', action: () => onChangeView('myTrips') },
  ];

  return (
    <>
      {/* Desktop/Tablet Top Navbar */}
      <nav className="hidden md:block w-[95%] lg:w-[90%] xl:w-[70%] mx-auto rounded-full mt-4 fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-md py-4 transition-all duration-300 border border-white/10 shadow-2xl shadow-black/20">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <a href='/' className="flex items-center gap-2 group shrink-0">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/10 p-1 group-hover:bg-white/20 transition-all">
              <img src={logo} alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div className="font-['Outfit']">
              <span className="text-2xl font-bold text-violet-400 group-hover:text-white transition-colors">Trip </span>
              <span className="text-white group-hover:text-violet-400 transition-colors">Spark</span>
            </div>
          </a>

          <div className="flex items-center gap-7 text-white/90 font-semibold">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  if (link.action) {
                    e.preventDefault();
                    link.action();
                    return;
                  }
                  onChangeView('planner');
                }}
                className={`hover:text-violet-300 transition-colors ${
                  link.name === 'My Trips' && activeView === 'myTrips' ? 'text-violet-300' : ''
                }`}
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3 py-2 rounded-xl bg-white/20 border border-white/20 text-white text-xs max-w-[180px] truncate">
              {userEmail ?? 'Guest account'}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Floating Bottom Dock */}
      <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] z-50">
        <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-1 shadow-2xl shadow-black/40">
          <div className="grid grid-cols-2 gap-2">
            <a
              href="#explore"
              onClick={() => onChangeView('planner')}
              className="py-3 rounded-2xl font-bold text-sm text-white/80 hover:bg-white/10 transition-all text-center"
            >
              Explore
            </a>
            <button
              type="button"
              onClick={() => onChangeView('myTrips')}
              className={`py-3 rounded-2xl font-bold text-sm transition-all ${
                activeView === 'myTrips'
                  ? 'bg-violet-500 text-white'
                  : 'text-white/80 hover:bg-white/10'
              }`}
            >
              My Trips
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

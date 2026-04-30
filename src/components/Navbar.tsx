import React, { useState } from 'react';
import logo from "../assets/airplane-flight.png";
import AuthModal from './AuthModal';
import { auth, googleProvider, getFriendlyAuthErrorMessage } from '../lib/firebase';
import { signInWithPopup, signOut } from 'firebase/auth';
import { loginWithGoogle } from '../services/authApi';

interface NavbarProps {
  activeView: 'planner' | 'myTrips';
  onChangeView: (view: 'planner' | 'myTrips') => void;
  userEmail?: string;
  userPicture?: string;
}

const Navbar: React.FC<NavbarProps> = ({ activeView, onChangeView, userEmail, userPicture }) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const navLinks: Array<{ name: string; href: string; action?: () => void }> = [
    { name: 'Explore', href: '#explore' },
    { name: 'Features', href: '#features' },
    { name: 'Planning', href: '#trip-result' },
    { name: 'Social', href: '#footer' },
    { name: 'My Trips', href: '#', action: () => onChangeView('myTrips') },
  ];

  const filteredLinks = navLinks.filter(link => 
    link.name !== 'My Trips' || userEmail
  );

  const handleGoogleLogin = async () => {
    try {
      setIsSigningIn(true);
      setAuthError(null);
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      const res = await loginWithGoogle(idToken);
      
      if (res.ok) {
        localStorage.setItem('auth_token', res.token!);
        localStorage.setItem('auth_user', JSON.stringify(res.user));
        setShowAuthModal(false);
        window.location.reload();
      }
    } catch (error: any) {
      console.error('Login failed:', error);
      const friendlyMessage = getFriendlyAuthErrorMessage(error.code);
      if (friendlyMessage) {
        setAuthError(friendlyMessage);
      }
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('auth_user');
      localStorage.removeItem('auth_token');
      window.location.reload();
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

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
            {filteredLinks.map((link) => (
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
            {/* {userEmail && (
              <div className="hidden lg:flex flex-col items-end mr-2">
                <span className="text-[10px] text-white/50 font-bold uppercase tracking-widest">Logged in as</span>
                <span className="text-xs text-white font-medium truncate max-w-[120px]">{userEmail}</span>
              </div>
            )} */}
            <button 
              onClick={userEmail ? handleSignOut : () => setShowAuthModal(true)}
              className="flex items-center gap-2 pl-2 pr-4 py-1.5 rounded-xl bg-white/10 border border-white/10 text-white text-xs hover:bg-white/20 transition-all group"
            >
              {userEmail ? (
                <>
                  <div className="w-7 h-7 rounded-lg overflow-hidden border border-white/20">
                    {userPicture ? (
                      <img src={userPicture} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-violet-500 flex items-center justify-center text-[10px] font-bold">
                        {userEmail[0].toUpperCase()}
                      </div>
                    )}
                  </div>
                  <span className="font-bold">Sign Out</span>
                </>
              ) : (
                <span className="px-2 py-1 font-bold">Log In</span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Floating Bottom Dock */}
      <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] z-50">
        <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-1 shadow-2xl shadow-black/40">
          <div className="grid grid-cols-2 gap-2 relative">
            {/* Sliding Background Highlight */}
            <div 
              className="absolute inset-y-0 w-[calc(50%-4px)] bg-black/60 rounded-3xl transition-transform duration-300 ease-out"
              style={{ 
                transform: activeView === 'myTrips' ? 'translateX(calc(100% + 8px))' : 'translateX(0)' 
              }}
            />
            
            <a
              href="#explore"
              onClick={(e) => {
                e.preventDefault();
                onChangeView('planner');
              }}
              className={`relative z-10 py-3 rounded-3xl font-bold text-sm transition-all text-center ${
                activeView === 'planner' ? 'text-white' : 'text-white/80'
              }`}
            >
              Explore
            </a>
            {
              userEmail ? (
                <button
                  type="button"
                  onClick={() => onChangeView('myTrips')}
                  className={`relative z-10 py-3 rounded-3xl font-bold text-sm transition-all ${
                    activeView === 'myTrips'
                      ? 'text-white'
                      : 'text-white/80'
                  }`}
                >
                  My Trips
                </button>
              ) : (
                <button 
                  onClick={() => setShowAuthModal(true)}
                  className={`relative z-10 py-3 rounded-3xl font-bold text-sm transition-all ${
                    activeView === 'myTrips'
                      ? 'text-white'
                      : 'text-white/80'
                  }`}
                >
                  Log In
                </button>
              )
            }
          </div>
        </div>
      </nav>

      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onGoogleLogin={handleGoogleLogin}
        isSigningIn={isSigningIn}
        error={authError}
      />

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

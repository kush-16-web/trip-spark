import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from "../assets/airplane-flight.png";
import AuthModal from './AuthModal';
import { auth, googleProvider, getFriendlyAuthErrorMessage } from '../lib/firebase';
import { signInWithPopup, signOut } from 'firebase/auth';
import { loginWithGoogle } from '../services/authApi';
import { useToaster } from 'react-hot-toast';


interface NavbarProps {
  userEmail?: string;
  userPicture?: string;
  onLogoClick?: () => void;
  isEditMode?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ userEmail, userPicture, onLogoClick, isEditMode }) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showNavGuard, setShowNavGuard] = useState(false);

  const handleLogoClick = () => {
    if (isEditMode) {
      setShowNavGuard(true);
    } else {
      onLogoClick?.();
    }
  };
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const { toasts } = useToaster();
  const hasToast = toasts.some(t => t.visible && typeof t.message === 'string');

  useEffect(() => {
    const handleScroll = () => {
      // If we scroll more than 20px, set isScrolled to true
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const location = useLocation();
  const navLinks: Array<{ name: string; href: string; action?: () => void }> = [
    { name: 'Explore', href: '/' },
    { name: 'Features', href: '/features' },
    { name: 'Social', href: '/social' },
    { name: 'My Trips', href: '/my-trips' },
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
      <style>{`
          @keyframes modalFadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
          }
          @keyframes modalZoomIn {
              from { opacity: 0; transform: scale(0.95) translateY(10px); }
              to { opacity: 1; transform: scale(1) translateY(0); }
          }
          .animate-backdrop {
              animation: modalFadeIn 0.3s ease-out forwards;
          }
          .animate-modal {
              animation: modalZoomIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
      `}</style>
      {/* Desktop/Tablet Top Navbar */}
      <nav className={`hidden md:block mx-auto rounded-full mt-4 fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-md py-4 transition-all duration-500 border border-white/10 shadow-2xl shadow-black/20 
  ${isScrolled ? 'w-[98%] lg:w-[95%] xl:w-[70%]' : 'w-[95%] lg:w-[90%] xl:w-[60%]'}
`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <Link to='/' onClick={(e) => { e.preventDefault(); handleLogoClick(); }} className="flex items-center gap-2 group shrink-0">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/10 p-1 group-hover:bg-white/20 transition-all">
              <img src={logo} alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div className="font-['Outfit']">
              <span className="text-2xl font-bold text-violet-400 group-hover:text-white transition-colors">Trip </span>
              <span className="text-white group-hover:text-violet-400 transition-colors">Spark</span>
            </div>
          </Link>

          <div className="flex items-center gap-7 text-white/90 font-semibold">
            {filteredLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`transition-all duration-300 py-1 relative group/link ${location.pathname === link.href ? 'text-violet-400' : 'hover:scale-95 active:scale-105 text-white/80'
                  }`}
              >
                {link.name}
                <span className={`absolute -bottom-1 left-0 h-[2px] bg-violet-500 transition-all duration-300 ${location.pathname === link.href ? 'w-full' : 'w-0 group-hover/link:w-full'
                  }`} />
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={userEmail ? () => setShowLogoutConfirm(true) : () => setShowAuthModal(true)}
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
      <nav className={`md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] z-50 transition-all duration-700 ease-in-out ${isEditMode ? 'opacity-0 translate-y-32 pointer-events-none' : 'opacity-100 translate-y-0'
        }`}>
        <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-1 shadow-2xl shadow-black/40">
          <div className="grid grid-cols-2 gap-2 relative">
            {/* Sliding Background Highlight */}
            <div
              className={`absolute inset-y-0 w-[calc(50%-4px)] rounded-3xl transition-all duration-500 ease-out ${location.pathname === '/my-trips' ? 'bg-violet-600 shadow-lg shadow-violet-600/40' : 'bg-white'
                }`}
              style={{
                transform: location.pathname === '/my-trips' ? 'translateX(calc(100% + 8px))' : 'translateX(0)'
              }}
            />

            <Link
              to="/"
              className={`relative z-10 py-3 rounded-3xl font-bold text-sm transition-all duration-300 text-center ${location.pathname === '/' ? 'text-black' : 'text-white'
                }`}
            >
              Explore
            </Link>

            {userEmail ? (
              <Link
                to="/my-trips"
                className={`relative z-10 py-3 rounded-3xl font-bold text-sm transition-all duration-300 text-center ${location.pathname === '/my-trips' ? 'text-white' : 'text-white/70'
                  }`}
              >
                My Trips
              </Link>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="relative z-10 py-3 rounded-3xl font-bold text-sm transition-all text-white/80"
              >
                Log In
              </button>
            )}
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

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-md flex items-center justify-center px-4 animate-backdrop">
          <div
            className="absolute inset-0"
            onClick={() => setShowLogoutConfirm(false)}
          />
          <div className="relative w-full max-w-md rounded-[2.5rem] bg-white p-8 md:p-10 shadow-2xl border border-slate-100 overflow-hidden animate-modal">
            {/* Background Sparkle Decoration */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-violet-100 rounded-full blur-3xl opacity-50" />

            <div className="relative z-10 flex flex-col items-center text-center">
              {/* Icon Container */}
              <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mb-6 ring-8 ring-red-50/50">
                <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>

              <h3 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">
                Ready to leave?
              </h3>
              <p className="text-slate-500 text-base mb-8 leading-relaxed">
                Are you sure you want to sign out? You'll need to log in again to access your saved trips.
              </p>

              <div className="w-full space-y-3">
                <button
                  onClick={handleSignOut}
                  className="w-full px-6 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:translate-y-[-3px] transition-all duration-300 shadow-xl shadow-slate-900/10 active:scale-[0.98]"
                >
                  Yes, Sign Out
                </button>
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="w-full px-6 py-4 bg-transparent text-slate-500 rounded-2xl font-semibold hover:bg-slate-50 hover:text-slate-900 transition-all duration-300"
                >
                  Cancel
                </button>
              </div>

              {/* Footer Logo (Matching AuthModal) */}
              <div className="mt-8 pt-6 border-t border-slate-50 flex justify-center items-center gap-2 w-full">
                <img src={logo} alt="Logo" className="w-8 h-8 object-contain" />
                <span className="font-['Outfit'] font-bold text-lg text-slate-900">Trip <span className="text-sm text-violet-500">Spark</span></span>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Mobile Branding (Top Left) */}
      {/* Mobile/Tablet Dynamic Island Header */}
      <div className="md:hidden fixed top-2 left-[50%] -translate-x-1/2 z-50">
        <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[1.5rem] shadow-2xl overflow-hidden px-5 py-2.5 min-w-[140px] transition-all duration-500 ease-in-out">
          <div className="relative h-6 flex items-center justify-center">

            {/* 1. The Normal State (Logo + Text) */}
            <div className={`flex items-center gap-2 transition-all duration-500 absolute ${hasToast ? 'opacity-0 -translate-y-10 scale-90' : 'opacity-100 translate-y-0 scale-100'
              }`} onClick={handleLogoClick}>
              <img src={logo} alt="Logo" className="w-5 h-5" />
              <span className="font-['Outfit'] text-base font-black text-white">TripSpark</span>
            </div>

            {/* 2. The Notification State (The Message) */}
            <div className={`flex items-center gap-2 transition-all duration-500 absolute whitespace-nowrap ${hasToast ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-90'
              }`}>
              <span className="text-white font-bold text-sm">
                {toasts.find(t => t.visible && typeof t.message === 'string')?.message as string}
              </span>
            </div>

          </div>
        </div>
      </div>
      {/* Navigation Guard Modal (for Logo Clicks) */}
      {showNavGuard && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 max-w-md w-full shadow-2xl border border-slate-100 relative overflow-hidden text-center">
             <div className="absolute -top-12 -right-12 w-32 h-32 bg-violet-50 rounded-full blur-2xl opacity-50" />
             <div className="relative z-10 flex flex-col items-center">
                <div className="w-20 h-20 bg-violet-100 rounded-3xl flex items-center justify-center mb-8 shadow-inner">
                   <span className="text-4xl">⚠️</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-4 tracking-tight">Unsaved Changes!</h3>
                <p className="text-slate-500 font-medium leading-relaxed mb-10">
                   You're currently in the <span className="text-violet-600 font-bold">Itinerary Studio</span>. Leaving now will discard all your recent edits.
                </p>
                <div className="flex flex-col gap-3 w-full">
                   <button 
                     onClick={() => {
                        setShowNavGuard(false);
                        onLogoClick?.();
                     }}
                     className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 active:scale-95"
                   >
                     Discard & Leave
                   </button>
                   <button 
                     onClick={() => setShowNavGuard(false)}
                     className="w-full py-4 bg-white text-slate-900 border-2 border-slate-100 rounded-2xl font-black text-sm uppercase tracking-widest hover:border-violet-200 hover:text-violet-600 transition-all active:scale-95"
                   >
                     Stay in Studio
                   </button>
                </div>
             </div>
          </div>
        </div>
      )}
    </>

  );
};

export default Navbar;

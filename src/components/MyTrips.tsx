import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { MyTripListItem } from '../services/tripApi';
import { deletetrip, getMyTrips } from '../services/tripApi';
import toast from 'react-hot-toast';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import deleteIcon from '../assets/bin.gif';
import friends from '../assets/friends.gif';
import family from '../assets/Family-travel.gif';
import solo from '../assets/solo-traveller.gif';
import couple from '../assets/dating.gif';
import airplane from '../assets/beach.gif';

interface MyTripsProps {
  onOpenTrip: (tripId: string) => void;
  onBackToPlanner: () => void;
  onTripDeleted: (tripId: string) => void;
}

export default function MyTrips({ onOpenTrip, onBackToPlanner, onTripDeleted }: MyTripsProps) {
  const [trips, setTrips] = useState<MyTripListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tripToDelete, setTripToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getMyTrips();
      setTrips(response.trips);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load trips');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const confirmDelete = async () => {
    if (!tripToDelete) return;
    try {
      setIsDeleting(true);
      await deletetrip(tripToDelete);
      onTripDeleted(tripToDelete);
      setTrips(prev => prev.filter(t => t.id !== tripToDelete));
      toast.success("Adventure removed.");
      setTripToDelete(null);
    } catch (err) {
      console.error(err);
      toast.error("Unable to remove trip.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setShowLogoutConfirm(false);
      localStorage.setItem('pending_toast', 'logout_success');
      await signOut(auth);
      localStorage.removeItem('auth_user');
      localStorage.removeItem('auth_token');
      window.location.href = '/';
    } catch (error) {
      console.error('Sign out failed:', error);
      toast.error('Failed to sign out.');
    }
  };

  return (
    <div className="min-h-screen bg-white pt-32 pb-20 px-6 relative overflow-hidden">
      {/* Background Decorative Blurs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-50 rounded-full blur-[120px] opacity-40 -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-50 rounded-full blur-[120px] opacity-40 -z-10" />

      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20"
        >
          <div>
            <div className="flex items-center gap-4 mb-4">
              <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter">
                My <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">Adventures</span>
              </h1>
              {!loading && trips.length > 0 && (
                <span className="bg-violet-100 text-violet-600 px-4 py-2 rounded-2xl text-xl font-black">
                  {trips.length.toString().padStart(2, '0')}
                </span>
              )}
            </div>
            <p className="text-slate-500 font-medium text-xl leading-relaxed max-w-xl">
              {loading ? 'Consulting the stars...' : 'Your personalized archive of dream destinations and curated journeys.'}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={onBackToPlanner}
              className="px-8 py-4 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-widest text-[10px] hover:bg-violet-600 transition-all shadow-xl shadow-slate-200 flex items-center gap-3"
            >
              <span>←</span> New Journey
            </button>
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="p-4 bg-white border border-slate-100 text-slate-400 rounded-[1.5rem] hover:text-red-500 hover:bg-red-50 transition-all shadow-sm"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </motion.div>

        {/* Content States */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 bg-slate-50 rounded-[3rem] animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-32 bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/50 px-10 max-w-2xl mx-auto">
            <div className="text-6xl mb-8">⚠️</div>
            <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Sync Issue</h2>
            <p className="text-slate-500 font-medium mb-12 text-lg">
              We couldn't reach your cloud storage. Check your connection and try again.
            </p>
            <button
              onClick={() => fetchTrips()}
              className="px-10 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs"
            >
              Retry Connection
            </button>
          </div>
        ) : trips.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-40 bg-slate-50/50 backdrop-blur-3xl rounded-[4rem] border border-white shadow-2xl shadow-slate-200/50 px-10 relative overflow-hidden"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 text-[15rem] font-black text-white select-none pointer-events-none opacity-50">EMPTY</div>
            <div className="relative z-10">
               <div className="text-8xl mb-10"><img src={airplane} alt="" className="w-40 h-40" /></div>
               <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tighter">No adventures yet?</h2>
               <p className="text-slate-500 mb-12 max-w-md mx-auto text-xl font-medium leading-relaxed">
                 The world is massive and your story hasn't started. Spark your first AI itinerary today.
               </p>
               <button
                 onClick={onBackToPlanner}
                 className="px-12 py-5 bg-violet-600 text-white rounded-[2rem] font-black text-lg hover:bg-violet-700 hover:scale-105 transition-all shadow-2xl shadow-violet-500/30"
               >
                 Start Planning
               </button>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial="hidden"
            animate="show"
            variants={{
              show: { transition: { staggerChildren: 0.1 } }
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {trips.map((trip) => (
              <motion.article
                key={trip.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 }
                }}
                className="group relative bg-white rounded-[3rem] border-2 border-slate-300/70 p-10 shadow-xl shadow-slate-200/30 hover:shadow-2xl hover:shadow-violet-200/40 transition-all duration-500 flex flex-col justify-between"
              >
                {/* Delete Button (Floating) */}
                <button 
                  onClick={() => setTripToDelete(trip.id)} 
                  className="absolute top-6 right-6 w-12 h-12 bg-white rounded-2xl border border-slate-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0 translate-x-4"
                >
                  <img className="w-6 h-6 transition-all" src={deleteIcon} alt="Delete" />
                </button>

                <div>
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500">
                      {trip.type === 'Solo' && <img src={solo} alt="Solo" className="w-full h-full" />}
                      {trip.type === 'Couple' && <img src={couple} alt="Couple" className="w-full h-full" />}
                      {trip.type === 'Family' && <img src={family} alt="Family" className="w-full h-full" />}
                      {trip.type === 'Friends' && <img src={friends} alt="Friends" className="w-full h-full" />}
                    </div>
                    <span className="px-4 py-1.5 bg-violet-50 text-violet-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-violet-100">
                      {trip.days || 'Multi'} Days
                    </span>
                  </div>

                  <h3 className="text-3xl font-black text-slate-900 mb-3 tracking-tight leading-tight group-hover:text-violet-600 transition-colors">
                    {trip.destination}
                  </h3>

                  <p className="text-slate-400 group-hover:text-black transition-colors duration-800 font-bold text-sm mb-12 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-violet-400 group-hover:bg-black rounded-full animate-pulse" />
                    {trip.travelers || 'multiple'} Travelers
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => onOpenTrip(trip.id)}
                    className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-violet-600 transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-200"
                  >
                    Open Studio
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </button>

                  <button
                    onClick={() => {
                      const shareUrl = `${window.location.origin}/share/${trip.shareId}`;
                      void navigator.clipboard.writeText(shareUrl);
                      toast.success('Share link ready! 🔗');
                    }}
                    className="w-full py-4 bg-white text-slate-400 rounded-2xl font-black uppercase tracking-widest text-[9px] hover:text-slate-900 hover:bg-slate-50 transition-all"
                  >
                    Copy Experience Link
                  </button>
                </div>
              </motion.article>
            ))}
          </motion.div>
        )}
      </div>

      {/* Modern Dialogs */}
      <AnimatePresence>
        {(tripToDelete || showLogoutConfirm) && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setTripToDelete(null); setShowLogoutConfirm(false); }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[3.5rem] p-12 shadow-2xl text-center"
            >
              <div className="w-24 h-24 bg-red-50 text-red-500 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {showLogoutConfirm ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  )}
                </svg>
              </div>

              <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">
                {showLogoutConfirm ? 'Sign Out?' : 'Delete Adventure?'}
              </h3>
              <p className="text-slate-500 font-medium leading-relaxed mb-10 text-lg">
                {showLogoutConfirm 
                  ? 'Are you sure you want to log out? Your trips will be waiting for you.'
                  : 'This action is permanent. You will lose this itinerary and all curated plans.'}
              </p>

              <div className="flex flex-col gap-4">
                <button
                  onClick={showLogoutConfirm ? handleSignOut : confirmDelete}
                  disabled={isDeleting}
                  className="w-full py-5 bg-red-600 text-white rounded-3xl font-black uppercase tracking-widest text-xs hover:bg-red-700 transition-all shadow-xl shadow-red-200 active:scale-95"
                >
                  {isDeleting ? 'Processing...' : showLogoutConfirm ? 'Yes, Log Out' : 'Confirm Deletion'}
                </button>
                <button
                  onClick={() => { setTripToDelete(null); setShowLogoutConfirm(false); }}
                  className="w-full py-5 bg-slate-50 text-slate-400 rounded-3xl font-black uppercase tracking-widest text-xs hover:bg-slate-100 transition-all"
                >
                  Go Back
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

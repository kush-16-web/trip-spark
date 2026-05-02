import { useEffect, useState } from 'react';
import type { MyTripListItem } from '../services/tripApi';
import { deletetrip, getMyTrips } from '../services/tripApi';
import toast from 'react-hot-toast';
import deleteIcon from '../assets/bin.gif';
import friends from '../assets/friends.gif';
import family from '../assets/Family-travel.gif';
import solo from '../assets/solo-traveller.gif';
import couple from '../assets/dating.gif';

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


  const handleDeleteTrip = (id: string) => {
    setTripToDelete(id);
  };

  const confirmDelete = async () => {
    if (!tripToDelete) return;
    try {
      setIsDeleting(true);
      await deletetrip(tripToDelete);
      onTripDeleted(tripToDelete); // Notify App.tsx to clear state if this trip was active
      setTrips(prev => prev.filter(t => t.id !== tripToDelete));
      toast.success("Trip removed successfully!");
      setTripToDelete(null);
    } catch (err) {
      console.error(err);
      toast.error("Unable to remove trip. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
              My <span className="text-violet-600">Adventures</span>
            </h1>
            <p className="text-slate-500 font-medium text-lg">
              {loading ? 'Fetching your itineraries...' : `You have planned ${trips.length} amazing journeys.`}
            </p>
          </div>
          <button
            onClick={onBackToPlanner}
            className="w-fit px-8 py-3.5 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2"
          >
            <span>←</span> Back to Planner
          </button>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-slate-200 rounded-[2.5rem] animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-24 bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50 px-6 max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
              ⚠️
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-3">Oops! Something went wrong</h2>
            <p className="text-slate-500 font-medium mb-8 max-w-md mx-auto">
              {error}
            </p>
            <button
              onClick={() => fetchTrips()}
              disabled={loading}
              className="px-8 py-3.5 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 active:scale-95 flex items-center gap-2 mx-auto disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <span className={`inline-block ${loading ? 'animate-spin' : ''}`}>↻</span> 
              {loading ? 'Refreshing...' : 'Refresh Page'}
            </button>
          </div>
        ) : trips.length === 0 ? (
          /* Empty State */
          <div className="text-center py-32 bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50 px-6">
            <div className="text-6xl mb-6">🌎</div>
            <h2 className="text-3xl font-black text-slate-900 mb-4">No adventures yet?</h2>
            <p className="text-slate-500 mb-8 max-w-md mx-auto text-lg font-medium">
              Your future memories are waiting to be planned. Let's create your first dream itinerary right now.
            </p>
            <button
              onClick={onBackToPlanner}
              className="px-10 py-4 bg-violet-600 text-white rounded-2xl font-black text-lg hover:bg-violet-700 hover:scale-105 transition-all shadow-lg shadow-violet-500/25 active:scale-95"
            >
              Start Planning
            </button>
          </div>
        ) : (
          /* Trip Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trips.map((trip) => (
              <article
                key={trip.id}
                className="group bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-violet-200/40 transition-all duration-500  relative overflow-hidden"
              >
                {/* Decorative background glow */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-violet-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10">
                  <div className="flex justify-between items-center mb-4">
                    <button onClick={() => handleDeleteTrip(trip.id)} className='bg-transparent border-none cursor-pointer font-semibold flex items-center gap-2 hover:translate-y-[-5px] transition-all duration-500'><img className="w-8 h-8" src={deleteIcon} alt="" /></button>
                  </div>
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-14 h-14 bg-violet-100 rounded-2xl flex items-center justify-center text-2xl">
                      {trip.type === 'Solo' ? <img src={solo} alt="Solo" className="w-14 h-14" /> : 
                      trip.type === 'Couple' ? <img src={couple} alt="Couple" className="w-14 h-14" /> : 
                      trip.type === 'Family' ? <img src={family} alt="Family" className="w-14 h-14" /> :
                      trip.type === 'Friends' ? <img src={friends} alt="Friends" className="w-14 h-14" /> : ''}
                    </div>
                    <span className="px-4 py-1.5 bg-slate-50 text-slate-500 rounded-full text-xs font-black uppercase tracking-widest border border-slate-100">
                      {trip.days || 'Multi'} Days
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-slate-900 mb-2 group-hover:text-violet-600 transition-colors line-clamp-1">
                    {trip.destination}
                  </h3>
                  
                  <p className="text-slate-400 font-bold text-sm mb-8 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
                    Planned for {trip.travelers || 'multiple'} Travelers
                  </p>

                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => onOpenTrip(trip.id)}
                      className="w-full py-4 bg-violet-600 text-white rounded-2xl font-black hover:bg-violet-700 transition-all flex items-center justify-center gap-2 group/btn shadow-lg shadow-violet-500/20"
                    >
                      View Itinerary
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        const shareUrl = `${window.location.origin}/share/${trip.shareId}`;
                        void navigator.clipboard.writeText(shareUrl);
                        toast('Link copied! 🔗');
                      }}
                      className="w-full py-4 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold hover:bg-slate-50 transition-all text-sm flex items-center justify-center gap-2"
                    >
                      Copy Share Link
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {tripToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-backdrop">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
            onClick={() => !isDeleting && setTripToDelete(null)}
          />
          
          <div className="relative w-full max-w-md bg-white rounded-[2.5rem] p-10 shadow-2xl animate-modal overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-bl-full -z-10" />
            
            <div className="text-center">
              <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                <img src={deleteIcon} alt="Delete" className="w-12 h-12" />
              </div>
              
              <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">
                Remove Adventure?
              </h3>
              
              <p className="text-slate-500 font-medium leading-relaxed mb-10">
                Are you sure you want to delete this itinerary? This action cannot be undone and you'll lose all your plans.
              </p>
              
              <div className="flex flex-col gap-3">
                <button
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className={`w-full py-4 ${isDeleting ? 'bg-slate-400' : 'bg-red-600 hover:bg-red-700'} text-white rounded-2xl font-bold transition-all shadow-lg shadow-red-200 active:scale-95 flex items-center justify-center gap-2`}
                >
                  {isDeleting ? 'Removing...' : 'Yes, Delete Trip'}
                </button>
                
                <button
                  onClick={() => setTripToDelete(null)}
                  disabled={isDeleting}
                  className="w-full py-4 bg-slate-50 text-slate-500 rounded-2xl font-bold hover:bg-slate-100 transition-all active:scale-95"
                >
                  Keep It
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

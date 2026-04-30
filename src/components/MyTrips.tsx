import { useEffect, useState } from 'react';
import type { MyTripListItem } from '../services/tripApi';
import { getMyTrips } from '../services/tripApi';

interface MyTripsProps {
  onOpenTrip: (tripId: string) => void;
  onBackToPlanner: () => void;
}

export default function MyTrips({ onOpenTrip, onBackToPlanner }: MyTripsProps) {
  const [trips, setTrips] = useState<MyTripListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>('Guest');

  useEffect(() => {
    let cancelled = false;

    const loadTrips = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getMyTrips();
        if (!cancelled) {
          setTrips(response.trips);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Unable to load trips');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadTrips();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('auth_user');
      if (!raw) return;
      const parsed = JSON.parse(raw) as { email?: string };
      if (parsed.email) setUserEmail(parsed.email);
    } catch {
      // ignore parse issues and keep Guest label
    }
  }, []);

  return (
    <section className="py-20 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-violet-500 mb-2">Dashboard</p>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900">My Trips</h2>
          </div>
          <button
            type="button"
            onClick={onBackToPlanner}
            className="px-5 py-3 bg-white border border-slate-200 text-slate-700 rounded-2xl font-semibold hover:bg-slate-100 transition-all"
          >
            Back to planner
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] font-bold text-slate-400 mb-2">Account</p>
            <p className="text-lg font-black text-slate-900">{userEmail}</p>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] font-bold text-slate-400 mb-2">Total trips</p>
            <p className="text-lg font-black text-violet-700">{trips.length}</p>
          </div>
        </div>

        {loading && <p className="text-slate-500 font-semibold">Loading your trips...</p>}

        {error && !loading && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 font-medium">
            {error}
          </div>
        )}

        {!loading && !error && trips.length === 0 && (
          <div className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm">
            <p className="text-slate-700 font-semibold">No saved trips yet.</p>
            <p className="text-slate-500 mt-1">Generate a trip and save it to see it here.</p>
          </div>
        )}

        {!loading && !error && trips.length > 0 && (
          <div className="grid md:grid-cols-2 gap-6">
            {trips.map((trip) => (
              <article
                key={trip.id}
                className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all"
              >
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-500 mb-2">Saved trip</p>
                <h3 className="text-2xl font-black text-slate-900 mb-4">{trip.destination}</h3>

                <div className="space-y-1 text-sm text-slate-600 mb-5">
                  <p>
                    {trip.startDate} - {trip.endDate}
                  </p>
                  <p>Created: {new Date(trip.createdAt).toLocaleDateString()}</p>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => onOpenTrip(trip.id)}
                    className="px-4 py-2.5 bg-violet-600 text-white rounded-xl font-bold hover:bg-violet-700 transition-all"
                  >
                    Open Trip
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const shareUrl = `${window.location.origin}/trip/${trip.shareId}`;
                      void navigator.clipboard.writeText(shareUrl);
                    }}
                    className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-100 transition-all"
                  >
                    Copy Share Link
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

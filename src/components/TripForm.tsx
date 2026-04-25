import React from 'react';

export default function TripForm() {
  return (
    <section className="py-24 bg-slate-50 overflow-hidden relative">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-50"></div>
      
      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <div className="glass p-10 md:p-16 rounded-[3rem] shadow-2xl shadow-indigo-100/50">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Start Your Plan</h2>
            <p className="text-slate-600 text-lg">Enter your details and let our AI do the magic.</p>
          </div>

          <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">DESTINATION</label>
                <input 
                  type="text" 
                  placeholder="e.g. Paris, France" 
                  className="input-field"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">TRIP TYPE</label>
                <select className="input-field appearance-none bg-white">
                  <option>Solo Adventure</option>
                  <option>Romantic Getaway</option>
                  <option>Family Vacation</option>
                  <option>Business Trip</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">START DATE</label>
                <input type="date" className="input-field" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">END DATE</label>
                <input type="date" className="input-field" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">BUDGET</label>
                <select className="input-field appearance-none bg-white">
                  <option>$ Budget</option>
                  <option>$$ Moderate</option>
                  <option>$$$ Luxury</option>
                </select>
              </div>
            </div>

            <div className="pt-4">
              <button className="btn-primary w-full py-4 text-lg rounded-[2rem]">
                Generate Itinerary
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
import React from 'react';
import { motion } from 'framer-motion';

const Features: React.FC = () => {
  return (
    <section className="py-32 bg-white relative overflow-hidden" id="features">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-40 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-200/50 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-200/50 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="mb-24">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="h-[1px] w-12 bg-violet-600" />
            <span className="text-violet-600 font-black uppercase tracking-[0.3em] text-[10px]">Capabilities</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter leading-[0.85]"
          >
            Smart Tech.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-500 italic">Wild Journeys.</span>
          </motion.h2>
        </div>

        {/* Asymmetrical Feature Bento */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[600px]">

          {/* Card 1: AI Spark (Large & Dominant) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="md:col-span-7 relative group rounded-[3rem] bg-slate-900 overflow-hidden p-12 flex flex-col justify-end"
          >
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-violet-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-violet-600/30 rounded-full blur-[80px] group-hover:scale-150 transition-transform duration-1000" />

            <div className="relative z-20">
              <div className="text-violet-400 text-xs font-black uppercase tracking-widest mb-4">01 // Artificial Intelligence</div>
              <h3 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">The Gemini Spark Engine</h3>
              <p className="text-slate-400 text-lg max-w-md leading-relaxed">
                We don't just generate lists. Our AI understands the "vibe" of your travel style to craft itineraries that feel human-made.
              </p>
            </div>
          </motion.div>

          {/* Card 2: Interactive Maps (Tall & Sleek) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="md:col-span-5 relative group rounded-[3rem] bg-violet-50 border border-violet-100 overflow-hidden p-12"
          >
            <div className="relative z-10"> {/* Added z-10 to keep text on top */}
              <div className="text-violet-600 text-right text-[10px] font-black uppercase tracking-widest mb-4">02 // Geospatial Data</div>
              <h3 className="text-3xl text-right font-bold text-slate-900 mb-6 tracking-tight">Real-time Map Studio</h3>
              <p className="text-slate-900 font-bold leading-relaxed mb-12">
                Sync your itinerary with Mapbox GL. Fly-to animations, numbered routes, and satellite exploration.
              </p>
            </div>

            {/* Visual element representing a map */}
            <div className="absolute bottom-[-15%] right-[-10%] w-[110%] h-72 bg-white rounded-[2rem] shadow-2xl rotate-[-5deg] border border-slate-100 p-3 group-hover:rotate-0 group-hover:bottom-[-10%] transition-all duration-700 pointer-events-none overflow-hidden">
              <div className="relative w-full h-full rounded-[1.5rem] overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800"
                  alt="Map Preview"
                  className="w-full h-full object-cover grayscale-[0.2] group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-violet-600/10 mix-blend-overlay" />

                {/* The GPS Marker */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="w-10 h-10 rounded-full bg-violet-600 animate-ping opacity-30" />
                  <div className="w-4 h-4 rounded-full bg-violet-600 border-2 border-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-lg" />
                </div>

                {/* Satellite Badge */}
                <div className="absolute top-4 left-4 px-3 py-1 bg-black/50 backdrop-blur-md rounded-full border border-white/20 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[8px] font-black text-white uppercase tracking-widest">Live Satellite</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 3: Budgeting (Wide & Minimal) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="md:col-span-12 relative group rounded-[3rem] bg-slate-50 border border-slate-200/60 overflow-hidden p-12 flex flex-col md:flex-row items-center justify-between gap-12"
          >
            <div className="max-w-xl">
              <div className="text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-4">03 // Finance</div>
              <h3 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">Live Currency Intelligence</h3>
              <p className="text-slate-500 text-lg leading-relaxed">
                Plan in INR, spend in Yen. Our dynamic conversion engine handles real-time rates so you stay on budget globally.
              </p>
            </div>

            <div className="flex gap-4">
              {['$', '€', '¥', '₹'].map((symbol, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -10, rotate: 10, color: "rgb(124 58 237)" }}
                  className="w-16 h-16 rounded-2xl bg-white shadow-lg flex items-center justify-center text-2xl font-black text-slate-900 border  border-slate-100"
                >
                  {symbol}
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Features;

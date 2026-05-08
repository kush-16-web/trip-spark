import React from 'react';
import { motion } from 'framer-motion';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 py-32 px-6 relative overflow-hidden border-t border-white/5">
      {/* Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[300px] bg-violet-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-24">
          
          {/* Brand Column */}
          <div className="md:col-span-4">
            <div className="flex items-center gap-3 mb-8 group cursor-default">
               <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-violet-600/20 group-hover:scale-110 transition-transform duration-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
               </div>
               <div className="font-['Outfit']">
                  <span className="text-2xl font-black text-white tracking-tight">Trip</span>
                  <span className="text-2xl font-black text-violet-500 tracking-tight">Spark</span>
               </div>
            </div>
            <p className="text-lg leading-relaxed text-slate-500 max-w-sm mb-8 font-medium">
              Transforming vague travel ideas into detailed, interactive itineraries with the power of AI.
            </p>
            <div className="flex gap-4">
               {/* Social Icons Placeholder */}
               {[1, 2, 3, 4].map((i) => (
                 <motion.div 
                   key={i}
                   whileHover={{ y: -5, backgroundColor: "rgba(255,255,255,0.1)" }}
                   className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center cursor-pointer transition-colors"
                 >
                    <div className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                 </motion.div>
               ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className="md:col-span-2">
            <h4 className="text-white font-black uppercase tracking-[0.2em] text-[11px] mb-8">Platform</h4>
            <ul className="space-y-4 font-semibold">
              <li><a href="/" className="hover:text-violet-400 transition-colors">Home</a></li>
              <li><a href="#features" className="hover:text-violet-400 transition-colors">Features</a></li>
              <li><a href="/my-trips" className="hover:text-violet-400 transition-colors">My Trips</a></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-white font-black uppercase tracking-[0.2em] text-[11px] mb-8">Company</h4>
            <ul className="space-y-4 font-semibold">
              <li><a href="#" className="hover:text-violet-400 transition-colors">Our Vision</a></li>
              <li><a href="#" className="hover:text-violet-400 transition-colors">API Access</a></li>
              <li><a href="#" className="hover:text-violet-400 transition-colors">Terms</a></li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="md:col-span-4">
            <h4 className="text-white font-black uppercase tracking-[0.2em] text-[11px] mb-8">Stay Sparked</h4>
            <p className="mb-8 font-medium leading-relaxed">Join 5,000+ travelers getting AI-curated tips every week.</p>
            <div className="relative group">
              <input 
                type="email" 
                placeholder="Drop your email..." 
                className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 w-full focus:outline-none focus:ring-2 focus:ring-violet-600/50 transition-all placeholder:text-slate-600 font-medium group-hover:bg-white/10"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-violet-600 text-white p-2.5 rounded-xl hover:bg-violet-500 transition-all shadow-lg shadow-violet-600/30">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">© 2025 TripSpark AI. Built with ❤️ for explorers.</span>
          </div>
          <div className="flex gap-10 text-xs font-black uppercase tracking-widest">
            <a href="#" className="hover:text-white transition-colors">Security</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

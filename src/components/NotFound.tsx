import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center pt-32 pb-24 px-6 overflow-hidden relative">
      {/* Background Decorative Blurs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-violet-100 rounded-full blur-[120px] opacity-50" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-100 rounded-full blur-[120px] opacity-50" />

      <div className="text-center relative z-10 max-w-4xl w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-4"
        >
          <span className="text-[8rem] sm:text-[12rem] md:text-[18rem] font-black text-slate-900 leading-none tracking-tighter select-none">
            404
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
            Oops! You've drifted <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600 italic">off the map.</span>
          </h1>
          <p className="text-slate-500 text-lg md:text-xl font-medium mb-12 leading-relaxed">
            The destination you're looking for doesn't exist yet, or it's hiding
            somewhere our AI hasn't discovered. Let's get you back on track.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <button
              onClick={() => navigate('/')}
              className="px-10 py-5 bg-slate-900 text-white rounded-full font-black uppercase tracking-widest text-xs hover:bg-violet-600 transition-all hover:shadow-2xl hover:shadow-violet-200"
            >
              Back to Civilization
            </button>
            <button
              onClick={() => window.history.back()}
              className="px-10 py-5 bg-white text-slate-900 border border-slate-200 rounded-full font-black uppercase tracking-widest text-xs hover:bg-slate-50 transition-all"
            >
              Go Back
            </button>
          </div>
        </motion.div>

        {/* Decorative Floating Icon */}
        <motion.div
          animate={{
            y: [0, 20, 0],
            rotate: [0, 10, 0]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -top-16 md:-top-12 right-0 md:-right-12 text-5xl md:text-8xl opacity-80"
        >
          🚀
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;

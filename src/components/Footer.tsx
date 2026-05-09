import React from 'react';
import { motion } from 'framer-motion';
import logo from '../assets/airplane-flight.png';
import gmail from '../assets/gmail.png';
import twitter from '../assets/twitter.png';
import linkedin from '../assets/linkedin.png';
import github from '../assets/github.png';
import toast from 'react-hot-toast';

const socials = [
  {name:"Gmail",icon:gmail,link:"mailto:kushpandya0116@gmail.com"},
  {name:"Twitter",icon:twitter,link:"https://x.com/KPandya68805"},
  {name:"Linkedin",icon:linkedin,link:"https://www.linkedin.com/in/kush-pandya-6544a6352?utm_source=share_via&utm_content=profile&utm_medium=member_android"},
  {name:"Github",icon:github,link:"https://github.com/kush-16-web"}
];
const Footer: React.FC = () => {
  const [formStatus, setFormStatus] = React.useState<'idle' | 'sending' | 'success'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    
    setFormStatus('sending');
    try {
      const response = await fetch("https://formspree.io/f/xpqbybpl", {
        method: "POST",
        body: data,
        headers: { 'Accept': 'application/json' }
      });
      if (response.ok) {
        setFormStatus('success');
        toast.success("Message received! I'll get back to you. ✈️");
        form.reset();
      }
    } catch (error) {
      toast.error("Oops! Something went wrong.");
    } finally {
      setFormStatus('idle');
    }
  };

  return (
    <footer className="bg-slate-950 text-slate-400 py-20 px-6 relative overflow-hidden border-t border-white/5">
      {/* Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[300px] bg-violet-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-16">
          
          {/* Brand Column */}
          <div className="md:col-span-4">
            <a className="flex items-center gap-3 w-fit mb-8 group" href="/">
               <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-violet-600/20 group-hover:scale-110 transition-transform duration-500">
                 <img src={logo} alt="logo" className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-violet-600/20 group-hover:scale-110 transition-transform duration-500" />
               </div>
               <div className="font-['Outfit']">
                  <span className="text-2xl font-black text-white tracking-tight">Trip</span>
                  <span className="text-2xl font-black text-violet-500 tracking-tight">Spark</span>
               </div>
            </a>
            <p className="text-lg leading-relaxed text-slate-500 max-w-sm mb-8 font-medium">
              Transforming vague travel ideas into detailed, interactive itineraries with the power of AI.
            </p>
            <div className="w-[80%] md:w-fit flex justify-around md:gap-6 bg-slate-800/50 backdrop-blur-sm p-2  rounded-2xl ">
               {socials.map(({icon,name,link})=>(
                <motion.a
                  key={name}
                  href={link}
                  whileHover={{ scale:1.2 }}
                  transition={{ duration:0.3 }}
                  className="w-10 h-10 flex items-center justify-center cursor-pointer transition-colors duration-300"
                  target={link.startsWith('http') ? '_blank' : '_self'}
                  rel='noopener noreferrer'
                >
                  <img src={icon} alt={name} />
                </motion.a>
               ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className="md:col-span-2">
            <h4 className="text-white font-black uppercase tracking-[0.2em] text-[11px] mb-8">Platform</h4>
            <ul className="space-y-4 font-semibold">
              <li><a href="/" className="hover:text-violet-600 transition-colors">Home</a></li>
              <li><a href="#features" className="hover:text-violet-600 transition-colors">Features</a></li>
              <li><a href="/my-trips" className="hover:text-violet-600 transition-colors">My Trips</a></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-white font-black uppercase tracking-[0.2em] text-[11px] mb-8">Showcase</h4>
            <ul className="space-y-4 font-semibold text-sm">
              <li><a href="https://github.com/kush-16-web/trip-spark" target="_blank" rel="noopener noreferrer" className="hover:text-violet-600 transition-colors">Source Code</a></li>
              <li><a href="https://github.com/kush-16-web" target="_blank" rel="noopener noreferrer" className="hover:text-violet-600 transition-colors">Developer</a></li>
              <li><a href="https://www.linkedin.com/in/kush-pandya-6544a6352" target="_blank" rel="noopener noreferrer" className="hover:text-violet-600 transition-colors">LinkedIn</a></li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="md:col-span-4">
            <h4 className="text-white font-black uppercase tracking-[0.2em] text-[11px] mb-8">Get In Touch</h4>
            <p className="mb-8 font-medium leading-relaxed">Spotted a bug or have a suggestion? <br/>Drop a message below.</p>
            
            <form onSubmit={handleSubmit} 
            className="flex flex-col gap-3"
            onKeyDown={(e)=>{
              if(e.key==='Enter'){
                handleSubmit(e);
              }
            }}
            >
              <input 
                name="email"
                type="email" 
                required
                placeholder="Your email..." 
                className="bg-white/5 border border-white/10 ring-1 ring-transparent rounded-xl px-4 py-3 w-full outline-none focus:ring-violet-600/50 transition-all duration-500 placeholder:text-slate-600 font-medium text-sm"
              />
              <textarea 
                name="message"
                required
                placeholder="How can I help?" 
                rows={3}
                className="bg-white/5 border border-white/10 ring-1 ring-transparent rounded-xl px-4 py-3 w-full outline-none focus:ring-violet-600/50 transition-all duration-500 placeholder:text-slate-600 font-medium text-sm resize-none"
              />
              <button 
                type="submit"
                disabled={formStatus === 'sending'}
                className="bg-violet-600 text-white py-3 rounded-xl hover:bg-violet-500 transition-all shadow-sm shadow-violet-600/30 font-black uppercase tracking-widest text-[10px] disabled:opacity-50"
              >
                {formStatus === 'sending' ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex justify-center items-center gap-8">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">© 2025 TripSpark AI. Built with ❤️ for explorers.</span>
          </div>
          {/* <div className="flex gap-10 text-xs font-black uppercase tracking-widest">
            <a href="#" className="hover:text-white transition-colors">Security</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div> */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;

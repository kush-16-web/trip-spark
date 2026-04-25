import React from 'react';
import parisImg from '../assets/destination_paris.png';
import baliImg from '../assets/destination_bali.png';
import tokyoImg from '../assets/destination_tokyo.png';

const destinations = [
  {
    name: 'Paris',
    country: 'France',
    image: parisImg,
    tag: 'Romantic',
  },
  {
    name: 'Bali',
    country: 'Indonesia',
    image: baliImg,
    tag: 'Nature',
  },
  {
    name: 'Tokyo',
    country: 'Japan',
    image: tokyoImg,
    tag: 'Culture',
  },
];

const Destinations: React.FC = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Popular Destinations</h2>
            <p className="text-slate-600 text-lg">Handpicked locations for your next unforgettable journey.</p>
          </div>
          <button className="text-indigo-600 font-bold flex items-center gap-2 hover:gap-3 transition-all">
            View All <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {destinations.map((dest, index) => (
            <div key={index} className="group relative h-[450px] rounded-[2rem] overflow-hidden cursor-pointer shadow-xl">
              <img 
                src={dest.image} 
                alt={dest.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute top-6 left-6">
                <span className="glass px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-slate-800">
                  {dest.tag}
                </span>
              </div>
              <div className="absolute bottom-8 left-8 text-white">
                <h3 className="text-3xl font-bold mb-1">{dest.name}</h3>
                <p className="text-slate-200">{dest.country}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Destinations;

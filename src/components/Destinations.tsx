import React, { useId, useState } from 'react';
import lehImg from '../assets/destination_leh.png';
import keralaImg from '../assets/destination_kerala.png';
import goaImg from '../assets/destination_goa.png';
import udaipurImg from '../assets/destination_udaipur.png';
import andamanImg from '../assets/destination_andaman.png';
import Trending from "../assets/Trending.gif"

export interface DestinationEntry {
  name: string;
  country: string;
  tag: string;
  tagIcon?: string;
  /** Short seasonal / planning hint (about the place, not viewer location). */
  blurb: string;
  image?: string;
  /** Tailwind gradient classes when `image` is omitted. */
  gradient?: string;
}

/** Top three — high intent trips people search for right now in India. */
const trendingDestinations: DestinationEntry[] = [
  {
    name: 'Leh-Ladakh',
    country: 'India',
    image: lehImg,
    tag: 'Adventure',
    blurb: 'Best during May–Sep — breathtaking high-altitude landscapes and ancient monasteries.',
  },
  {
    name: 'Kerala',
    country: 'India',
    image: keralaImg,
    tag: 'Serene',
    blurb: 'Oct–Mar — peaceful backwaters, lush tea gardens in Munnar, and tranquil beaches.',
  },
  {
    name: 'Goa',
    country: 'India',
    image: goaImg,
    tag: 'Trending',
    tagIcon: Trending,
    blurb: 'Nov–Feb — vibrant nightlife, golden sandy beaches, and charming Portuguese architecture.',
  },
];

/** Secondary picks — still strong, shown after “View more”. */
const moreDestinations: DestinationEntry[] = [
  {
    name: 'Udaipur',
    country: 'India',
    image: udaipurImg,
    tag: 'Royal',
    blurb: 'Oct–Mar — the City of Lakes with romantic palaces and serene boat rides.',
  },
  {
    name: 'Andaman Islands',
    country: 'India',
    image: andamanImg,
    tag: 'Beach',
    blurb: 'Nov–May — turquoise waters, vibrant coral reefs, and white sandy beaches.',
  },
  {
    name: 'Spiti Valley',
    country: 'India',
    tag: 'Offbeat',
    blurb: 'Jun–Sep — rugged terrain, ancient monasteries, and remote Himalayan villages.',
    gradient: 'bg-gradient-to-br from-slate-600 via-stone-700 to-zinc-900',
  },
  {
    name: 'Rishikesh',
    country: 'India',
    tag: 'Spiritual',
    blurb: 'Mar–May & Sep–Nov — Yoga capital of the world and thrilling river rafting.',
    gradient: 'bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-900',
  },
];

function DestinationCard({
  dest,
  compact,
}: {
  dest: DestinationEntry;
  compact?: boolean;
}) {
  const height = compact ? 'min-h-[280px] md:min-h-[300px]' : 'h-[450px]';
  const titleClass = compact ? 'text-2xl' : 'text-3xl';

  return (
    <article
      className={`group relative ${height} rounded-[2rem] overflow-hidden shadow-xl ring-1 ring-black/5`}
    >
      {dest.image ? (
        <img
          src={dest.image}
          alt={`${dest.name}, ${dest.country}`}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 motion-safe:group-hover:scale-110"
        />
      ) : (
        <div
          className={`absolute inset-0 ${dest.gradient ?? 'bg-gradient-to-br from-slate-700 to-slate-900'}`}
          aria-hidden
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
      <div className="absolute top-6 left-6 right-6 flex flex-wrap gap-2">
        <span className="bg-black/40 backdrop-blur-md px-2 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
          {dest.tag}
          {dest.tagIcon && <img src={dest.tagIcon} alt="" className="w-6 h-6 rounded-md" />}
        </span>
      </div>
      <div className="absolute bottom-8 left-8 right-8 text-white">
        <h3 className={`${titleClass} font-bold mb-1`}>{dest.name}</h3>
        <p className="text-slate-200 mb-2">{dest.country}</p>
        <p className="text-sm text-slate-300/95 leading-snug max-w-prose">{dest.blurb}</p>
      </div>
    </article>
  );
}

const Destinations: React.FC = () => {
  const [showMore, setShowMore] = useState(false);
  const morePanelId = useId();

  return (
    <section className="py-24 bg-white" aria-labelledby="destinations-heading">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2
              id="destinations-heading"
              className="text-4xl md:text-5xl font-bold mb-4"
            >
              Trending in India
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl">
              Top three Indian destinations travelers are flocking to right now — with seasonal tips to help you plan.
            </p>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {trendingDestinations.map((dest) => (
            <DestinationCard key={dest.name} dest={dest} />
          ))}
        </div>

        {!showMore && (
          <div className="flex justify-center mt-12">
            <button
              type="button"
              className="group flex items-center gap-3 bg-white text-slate-900 px-8 py-4 rounded-full font-bold shadow-xl border border-slate-100 hover:bg-slate-50 hover:shadow-2xl transition-all duration-300"
              onClick={() => setShowMore(true)}
            >
              Explore More Spots
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 group-hover:translate-x-1 transition-transform"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        )}

        <div
          id={morePanelId}
          role="region"
          aria-label="More popular destinations"
          hidden={!showMore}
          className={showMore ? 'mt-16 border-t border-slate-100 pt-16 motion-safe:animate-in motion-safe:slide-in-from-bottom-8 motion-safe:fade-in motion-safe:duration-700' : ''}
        >
          {showMore && (
            <>
              <div className="flex justify-between items-end mb-10">
                <div>
                  <h3 className="text-3xl font-bold text-slate-900 mb-2">Also Trending</h3>
                  <p className="text-slate-600 max-w-2xl">
                    Other incredible Indian destinations that are perfect for your next escape.
                  </p>
                </div>
                <button
                  type="button"
                  className="text-slate-400 hover:text-slate-600 font-semibold flex items-center gap-2 transition-colors"
                  onClick={() => setShowMore(false)}
                >
                  Show Less
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {moreDestinations.map((dest) => (
                  <DestinationCard key={dest.name} dest={dest} compact />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      
    </section>
  );
};

export default Destinations;

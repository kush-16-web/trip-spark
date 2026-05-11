import { useId, useState } from 'react';
import lehImg from '../assets/destination_leh.png';
import keralaImg from '../assets/destination_kerala.png';
import goaImg from '../assets/destination_goa.png';
import udaipurImg from '../assets/destination_udaipur.png';
import andamanImg from '../assets/destination_andaman.png';
import spitiImg from '../assets/destination_spiti.png';
import rishikeshImg from '../assets/destination_rishikesh.png';

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

interface DestinationsProps {
  onSelectDestination: (city: string) => void;
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
    image: spitiImg,
  },
  {
    name: 'Rishikesh',
    country: 'India',
    tag: 'Spiritual',
    blurb: 'Mar–May & Sep–Nov — Yoga capital of the world and thrilling river rafting.',
    image: rishikeshImg,
  },
];

function DestinationCard({
  dest,
  compact,
  className = "",
  onSelect
}: {
  dest: DestinationEntry;
  compact?: boolean;
  className?: string;
  onSelect: (city: string) => void;
}) {
  const height = compact ? 'h-[300px]' : 'h-full min-h-[400px] md:min-h-[500px]';
  const titleClass = compact ? 'text-2xl' : 'text-3xl md:text-5xl';

  return (
    <article
      onClick={() => onSelect(dest.name)}
      className={`group relative ${height} ${className} rounded-[2.5rem] overflow-hidden shadow-2xl transition-all duration-500 hover:shadow-violet-500/10 hover:-translate-y-1 cursor-pointer`}
    >
      {dest.image ? (
        <img
          src={dest.image}
          alt={`${dest.name}, ${dest.country}`}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
        />
      ) : (
        <div
          className={`absolute inset-0 ${dest.gradient ?? 'bg-gradient-to-br from-slate-700 to-slate-900'}`}
          aria-hidden
        />
      )}

      {/* Dynamic Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Top Badge */}
      <div className="absolute top-6 left-6 z-20">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 px-4 py-2 rounded-2xl flex items-center gap-2 group-hover:bg-white/20 transition-all duration-300">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/90">
            {dest.tag}
          </span>
          {dest.tagIcon && <img src={dest.tagIcon} alt="" className="w-5 h-5 rounded-lg object-contain" />}
        </div>
      </div>

      {/* Content Area */}
      <div className="absolute bottom-0 left-0 right-0 p-8 z-20 transform transition-transform duration-500 group-hover:translate-y-[-8px]">
        <div className="flex flex-col gap-2">
          <div className="flex items-end gap-3 mb-1">
            <h3 className={`${titleClass} font-black text-white leading-none tracking-tight`}>
              {dest.name}
            </h3>
            <div className="h-[2px] flex-grow bg-violet-500/50 rounded-full mb-2 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700 delay-100" />
          </div>

          <div className="flex items-center gap-2 text-violet-300 font-bold text-xs uppercase tracking-widest mb-2">
            <span className="w-4 h-[1px] bg-violet-400" />
            {dest.country}
          </div>

          <p className="text-sm md:text-base text-white/70 leading-relaxed max-w-md line-clamp-2 group-hover:line-clamp-none transition-all duration-500">
            {dest.blurb}
          </p>

          {/* Hidden "Explore" hint that appears on hover */}
          <div className="mt-4 flex items-center gap-2 text-white font-bold text-xs opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 delay-200">
            Plan this trip <span className="text-violet-400">→</span>
          </div>
        </div>
      </div>
    </article>
  );
}

const Destinations = ({onSelectDestination}:DestinationsProps) => {
  const [showMore, setShowMore] = useState(false);
  const morePanelId = useId();

  return (
    <section className="py-24 bg-white" aria-labelledby="destinations-heading">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-50 border border-violet-100 text-violet-600 text-xs font-black uppercase tracking-[0.2em] mb-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
              </span>
              Top Picks
            </div>
            <h2
              id="destinations-heading"
              className="text-5xl md:text-7xl font-black text-slate-900 mb-6 tracking-tight leading-[0.9]"
            >
              Trending in <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-500">India</span>
            </h2>
            <p className="text-slate-500 text-lg md:text-xl font-medium leading-relaxed">
              Hand-picked escapes for every vibe. From high-altitude adventures to serene backwaters, find your next story here.
            </p>
          </div>
        </div>

        {/* Asymmetrical Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:h-[700px] mb-16">
          <div className="md:col-span-8 h-full">
            <DestinationCard dest={trendingDestinations[0]} onSelect={onSelectDestination} />
          </div>
          <div className="md:col-span-4 grid grid-cols-1 gap-6 h-full">
            <DestinationCard dest={trendingDestinations[1]} onSelect={onSelectDestination} compact className="h-full" />
            <DestinationCard dest={trendingDestinations[2]} onSelect={onSelectDestination} compact className="h-full" />
          </div>
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
          className={showMore ? 'mt-24 border-t border-slate-100 pt-20 motion-safe:animate-in motion-safe:slide-in-from-bottom-12 motion-safe:fade-in motion-safe:duration-1000' : ''}
        >
          {showMore && (
            <>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                <div>
                  <div className="text-violet-500 font-black text-sm uppercase tracking-[0.3em] mb-2">Discovery</div>
                  <h3 className="text-4xl font-black text-slate-900 tracking-tight">Also Trending</h3>
                  <p className="text-slate-500 mt-2 font-medium">
                    Hidden gems and royal escapes that are currently rising in popularity.
                  </p>
                </div>
                <button
                  type="button"
                  className="group flex items-center gap-2 text-slate-400 hover:text-violet-600 font-bold transition-all"
                  onClick={() => setShowMore(false)}
                >
                  <span className="text-xs uppercase tracking-widest">Collapse</span>
                  <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center group-hover:border-violet-200 group-hover:bg-violet-50 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:-translate-y-0.5 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </button>
              </div>

              {/* Mosaic Mosaic Grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-4">
                  <div className="relative">
                    <span className="absolute -top-4 -left-4 z-30 text-6xl font-black text-slate-900/5 select-none italic">04</span>
                    <DestinationCard dest={moreDestinations[0]} onSelect={onSelectDestination} compact />
                  </div>
                </div>
                <div className="md:col-span-8">
                  <div className="relative h-full">
                    <span className="absolute -top-4 -left-4 z-30 text-6xl font-black text-slate-900/5 select-none italic">05</span>
                    <DestinationCard dest={moreDestinations[1]} onSelect={onSelectDestination} compact className="md:h-full" />
                  </div>
                </div>
                <div className="md:col-span-7">
                  <div className="relative h-full">
                    <span className="absolute -top-4 -left-4 z-30 text-6xl font-black text-slate-900/5 select-none italic">06</span>
                    <DestinationCard dest={moreDestinations[2]} onSelect={onSelectDestination} compact className="md:h-full" />
                  </div>
                </div>
                <div className="md:col-span-5">
                  <div className="relative h-full">
                    <span className="absolute -top-4 -left-4 z-30 text-6xl font-black text-slate-900/5 select-none italic">07</span>
                    <DestinationCard dest={moreDestinations[3]} onSelect={onSelectDestination} compact className="md:h-full" />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

    </section>
  );
};

export default Destinations;

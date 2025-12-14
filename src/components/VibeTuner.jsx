import React from "react";
import { Sliders, Zap } from "lucide-react";

const GENRES = [
  { id: "bollywood", label: "BOLLYWOOD", icon: "🇮🇳" },
  { id: "punjabi", label: "PUNJABI", icon: "🚜" },
  { id: "global", label: "GLOBAL", icon: "🌎" },
  { id: "kpop", label: "K-POP", icon: "🇰🇷" },
  { id: "lofi", label: "LO-FI", icon: "☕" },
];

const VibeTuner = ({ selectedGenre, onGenreChange }) => {
  return (
    // FIX: max-w-xl tha, usko badha ke md:max-w-3xl kar diya taaki PC pe na kate
    <div className="w-full max-w-xl md:max-w-3xl mx-auto mb-6 relative z-30 animate-in fade-in slide-in-from-top-4 duration-700">
      {/* Header Label */}
      <div className="flex justify-between items-end mb-2 px-2">
        <div className="flex items-center gap-2 text-green-400">
          <Sliders size={12} />
          <span className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase">
            Frequency Tuner
          </span>
        </div>
        <span className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest">
          {selectedGenre} CH
        </span>
      </div>

      {/* The Tuner Bar */}
      <div className="relative p-1 bg-white/5 border border-white/10 rounded-full backdrop-blur-md">
        {/* Active Slide Effect */}
        <div className="absolute inset-x-0 h-full w-full pointer-events-none overflow-hidden rounded-full opacity-20">
          <div className="absolute top-1/2 left-0 w-full h-px bg-white/10 -translate-y-1/2"></div>
        </div>

        {/* FIX ADDED: 'md:justify-center' -> PC par center karega
           Mobile par scroll rahega, PC par sab ek line mein dikhenge 
        */}
        <div className="flex w-full overflow-x-auto md:overflow-visible md:justify-center gap-1 snap-x px-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {GENRES.map((genre) => {
            const isSelected = selectedGenre === genre.id;

            return (
              <button
                key={genre.id}
                onClick={() => onGenreChange(genre.id)}
                className={`
                  relative group flex-shrink-0 snap-center
                  flex items-center gap-2 px-5 py-2 rounded-full border transition-all duration-300 cursor-pointer select-none
                  ${
                    isSelected
                      ? "bg-green-500 text-black border-green-400 shadow-[0_0_20px_rgba(34,197,94,0.4)] scale-100"
                      : "bg-transparent text-zinc-500 border-transparent hover:text-zinc-300 hover:bg-white/5"
                  }
                `}
              >
                {/* Icon */}
                <span
                  className={`text-sm ${
                    isSelected ? "grayscale-0" : "grayscale opacity-50"
                  }`}
                >
                  {genre.icon}
                </span>

                {/* Text */}
                <span
                  className={`text-[10px] font-bold tracking-wider uppercase whitespace-nowrap`}
                >
                  {genre.label}
                </span>

                {/* Active Indicator Dot */}
                {isSelected && (
                  <Zap size={10} className="fill-black animate-pulse ml-1" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Decorative Tech Lines */}
      <div className="flex justify-between mt-1 px-6 opacity-20 pointer-events-none">
        <div className="w-0.5 h-1.5 bg-green-500"></div>
        <div className="flex gap-1">
          <div className="w-px h-1 bg-white"></div>
          <div className="w-px h-1 bg-white"></div>
          <div className="w-px h-1 bg-white"></div>
        </div>
        <div className="w-0.5 h-1.5 bg-green-500"></div>
      </div>
    </div>
  );
};

export default VibeTuner;

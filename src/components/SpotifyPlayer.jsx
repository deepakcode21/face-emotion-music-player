import React from "react";
import { Disc, Music, BarChart3, Radio, Signal, Cpu } from "lucide-react";

const SpotifyPlayer = ({ playlistId, logicText }) => {
  return (
    <div className="glass-panel rounded-3xl p-1 flex flex-col h-full w-full overflow-hidden relative hover:border-green-500/40 transition-all duration-500 group bg-[#0a0a0a]">
      <div className="absolute  inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none z-0 mix-blend-overlay"></div>

      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.4)_50%)] bg-size-[100%_4px] pointer-events-none z-10 opacity-10"></div>

      <div className="px-6 py-4  flex justify-between items-center border-b border-green-400 bg-black/40 z-20 relative backdrop-blur-md">
        <h2 className="text-lg font-bold flex items-center gap-3 text-white tracking-wide">
          <Disc
            className={`w-6 h-6 ${
              playlistId
                ? "text-green-400 animate-[spin_1.5s_linear_infinite] drop-shadow-[0_0_15px_rgba(74,222,128,1)]"
                : "text-zinc-600"
            }`}
          />
          <span
            className={`text-sm uppercase tracking-wider font-bold ${
              playlistId
                ? "text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]"
                : "text-zinc-500"
            }`}
          >
            Audio Terminal
          </span>
        </h2>

        {playlistId ? (
          <div className="flex items-center gap-2 text-xs text-green-400 font-bold bg-green-500/10 px-3 py-1.5 rounded-sm border border-green-500/30 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.2)] font-mono">
            <Signal size={14} className="animate-ping absolute opacity-50" />
            <BarChart3 size={14} className="relative z-10" /> STREAM ACTIVE
          </div>
        ) : (
          <div className="flex items-center gap-1 text-xs text-zinc-600 font-mono">
            <Cpu size={14} /> STANDBY
          </div>
        )}
      </div>

      <div className="flex-1 relative w-full h-full overflow-hidden rounded-b-[20px] z-10">
        {playlistId ? (
          <>
            <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-green-500/60 z-30 rounded-tl-md pointer-events-none"></div>
            <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-green-500/60 z-30 rounded-tr-md pointer-events-none"></div>
            <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-green-500/60 z-30 rounded-bl-md pointer-events-none"></div>
            <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-green-500/60 z-30 rounded-br-md pointer-events-none"></div>

            <iframe
              key={playlistId}
              src={`https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=0`}
              width="100%"
              height="100%"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              className="absolute inset-0 w-full h-full animate-in fade-in zoom-in-95 duration-700 z-20"
            ></iframe>

            <div className="absolute bottom-0 left-0 w-full bg-linear-to-t from-black via-black/95 to-transparent p-4 z-40 pointer-events-none">
              <div className="border-l-2 border-green-500/50 pl-3">
                <p className="text-[10px] text-green-500/70 font-mono uppercase mb-1">
                  Generation Protocol // Success
                </p>
                <p className="text-xs text-zinc-300 font-mono truncate tracking-wider">
                  <span className="text-green-400 mr-2"></span>
                  {logicText}
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center z-0 overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-linear-to-r from-green-500/10 to-purple-500/10 rounded-full blur-[120px] animate-[spin_20s_linear_infinite] z-0 pointer-events-none"></div>

            <div className="relative mb-10 z-10">
              <div className="absolute -inset-8 border-2 border-dashed border-green-500/20 rounded-full animate-[spin_10s_linear_infinite]"></div>

              <div className="absolute -inset-1 bg-green-500/10 rounded-full animate-ping"></div>

              <div className="w-36 h-36 bg-[#0a0a0a] border-2 border-white/5 rounded-full flex items-center justify-center relative z-10 shadow-[0_0_50px_rgba(34,197,94,0.05)] backdrop-blur-xl">
                <Music
                  size={56}
                  className="text-zinc-700 group-hover:text-green-500 transition-colors duration-500 drop-shadow-lg"
                />
              </div>
            </div>

            <h3 className="text-3xl font-black text-transparent bg-clip-text bg-linear-to-br from-white to-zinc-600 mb-4 tracking-tight z-10">
              Awaiting Input
            </h3>

            <div className="flex flex-col items-center gap-3 z-10">
              <div className="flex items-center gap-2 text-green-400/80 text-xs font-mono bg-green-500/5 px-4 py-2 rounded border border-green-500/10">
                <Radio size={12} className="animate-pulse" />
                SCANNER LINK ESTABLISHED
              </div>
              <p className="text-zinc-600 text-[10px] font-mono uppercase tracking-widest">
                Ready to synthesize Vibe Playlist...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpotifyPlayer;

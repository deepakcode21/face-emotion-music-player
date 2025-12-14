import React from "react";
import {
  Github,
  Globe,
  User,
  Code2,
  Heart,
  Cpu,
  Coffee,
  Sparkles,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative w-full mt-20 pt-12 pb-8 px-4 border-t border-white/5 bg-[#050505]/50 backdrop-blur-sm overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-linear-to-r from-transparent via-green-500/50 to-transparent shadow-[0_0_15px_rgba(34,197,94,0.5)]"></div>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
        <div className="space-y-5">
          <h3 className="flex items-center gap-2 text-sm font-bold text-white font-mono uppercase tracking-wider">
            <Globe className="text-blue-400" size={16} />
            <span className="bg-clip-text text-transparent bg-linear-to-r from-white to-zinc-500">
              Mission Protocol
            </span>
          </h3>
          <div className="relative pl-4 border-l-2 border-white/10">
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              Moodify bridges the gap between biological emotion and digital
              auditory experience. A real-time experiment in AI interaction.
            </p>
            <div className="mt-3 flex items-center gap-2 text-[10px] text-green-500/80 font-mono bg-green-900/10 px-2 py-1 rounded w-fit border border-green-500/20">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
              SYSTEM STATUS: ONLINE
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <h3 className="flex items-center gap-2 text-sm font-bold text-white font-mono uppercase tracking-wider">
            <Cpu className="text-purple-400" size={16} />
            <span className="bg-clip-text text-transparent bg-linear-to-r from-white to-zinc-500">
              Neural Engine
            </span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {[
              {
                name: "React 18",
                color: "hover:border-blue-400/50 hover:text-blue-300",
              },
              {
                name: "FaceAPI",
                color: "hover:border-red-500/50 hover:text-red-400",
              },
              {
                name: "Spotify Web API",
                color: "hover:border-green-400/50 hover:text-green-300",
              },
              {
                name: "Tailwind",
                color: "hover:border-cyan-400/50 hover:text-cyan-300",
              },
              {
                name: "Vite",
                color: "hover:border-purple-400/50 hover:text-purple-300",
              },
            ].map((tech) => (
              <span
                key={tech.name}
                className={`px-3 py-1.5 bg-[#0a0a0a] border border-white/10 rounded-md text-[10px] font-mono text-zinc-400 uppercase tracking-wide transition-all duration-300 hover:bg-white/5 hover:scale-105 cursor-default ${tech.color} shadow-sm`}
              >
                {tech.name}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <h3 className="flex items-center gap-2 text-sm font-bold text-white font-mono uppercase tracking-wider">
            <User className="text-yellow-400" size={16} />
            <span className="bg-clip-text text-transparent bg-linear-to-r from-white to-zinc-500">
              Creator
            </span>
          </h3>

          <div className="group p-4 rounded-xl bg-linear-to-br    transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-lg">
                DC
              </div>
              <div>
                <p className="text-sm font-bold text-white">deepakcode21</p>
                <p className="text-[10px] text-zinc-500 font-mono">
                  FULL STACK DEVELOPER
                </p>
              </div>
            </div>

            <div className="h-px w-full bg-white/5 my-2"></div>

            <div className="flex items-center gap-2 text-xs text-zinc-400 mt-2">
              <span className="text-zinc-500">Dedicated to</span>
              <span className="font-bold text-white flex items-center gap-1.5 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                Gupta Ji{" "}
                <Heart
                  size={10}
                  className="text-red-500 fill-red-500 animate-pulse"
                />
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 border-t border-white/5 pt-6 flex flex-col md:flex-row justify-center text-center items-center gap-4">
        <p className="text-[10px] text-zinc-600 font-mono uppercase tracking-widest">
          © 2025 MOODIFY LABS. ALL RIGHTS RESERVED. Powered By Spotify.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

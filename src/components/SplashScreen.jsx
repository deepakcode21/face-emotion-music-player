import React, { useState, useEffect } from "react";
import { Terminal, Cpu, Wifi, CheckCircle2, Play } from "lucide-react";

const SplashScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState([]);
  const [isReady, setIsReady] = useState(false);

  const systemLogs = [
    "Initializing Core Systems...",
    "Loading Neural Face Models...",
    "Establishing Spotify Uplink...",
    "Calibrating Mood Sensors...",
    "All Services Online.",
    "System Ready.",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsReady(true);
          return 100;
        }
        return prev + Math.random() * 10;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let currentLog = 0;
    const logInterval = setInterval(() => {
      if (currentLog < systemLogs.length) {
        setLogs((prev) => [...prev, systemLogs[currentLog]]);
        currentLog++;
      } else {
        clearInterval(logInterval);
      }
    }, 800);

    return () => clearInterval(logInterval);
  }, []);

   useEffect(() => {
    if (isReady) {
      const timer = setTimeout(() => {
        onComplete();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isReady, onComplete]);

  return (
    <div className="fixed inset-0 z-[100] bg-black text-green-500 font-mono flex flex-col items-center justify-center p-4">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-green-900/5 to-transparent pointer-events-none animate-scan"></div>

        <div className="w-full max-w-md space-y-8 relative z-10">

            <div className="flex items-center gap-3 mb-8 animate-pulse">
                <Terminal size={32} />
                <h1 className="text-2xl font-black tracking-widest uppercase">MOODIFY_OS <span className="text-xs align-top opacity-50">v2.0</span></h1>
            </div>
            <div className="h-40 border-l-2 border-green-500/30 pl-4 space-y-2 overflow-hidden flex flex-col justify-end">
                {logs.map((log, i) => (
                    <div key={i} className="text-xs md:text-sm flex items-center gap-2 animate-in slide-in-from-left-5 fade-in duration-300">
                        <span className="opacity-50">{`>`}</span> 
                        {log === "System Ready." ? <span className="text-white font-bold">{log}</span> : log}
                        {i === logs.length - 1 && log !== "System Ready." && <span className="w-2 h-4 bg-green-500 animate-pulse inline-block ml-1"></span>}
                    </div>
                ))}
            </div>

            <div className="space-y-2">
                <div className="flex justify-between text-xs uppercase opacity-70">
                    <span>System Integrity</span>
                    <span>{Math.min(100, Math.round(progress))}%</span>
                </div>
                <div className="h-1 w-full bg-green-900/30 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)] transition-all duration-200 ease-out"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>

            
            <div className="h-16 flex items-center justify-center mt-8">
                {isReady ? (
                    <button 
                        onClick={onComplete}
                        className="group relative px-8 py-3 bg-green-500 text-black font-bold uppercase tracking-widest hover:bg-white transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(34,197,94,0.5)] cursor-pointer flex items-center gap-2"
                    >
                        <Play size={16} className="fill-current" />
                        Enter Interface
                    </button>
                ) : (
                    <div className="flex items-center gap-2 text-xs text-green-500/50 animate-pulse">
                        <Cpu size={14} className="animate-spin" /> PROCESSING DATA...
                    </div>
                )}
            </div>
        </div>


        <div className="absolute bottom-8 text-[10px] opacity-30 uppercase tracking-[0.5em] text-center w-full">
            Secure Connection Established • 2025
        </div>
    </div>
  );
};

export default SplashScreen;
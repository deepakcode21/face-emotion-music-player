import React, { useRef, useState, useEffect } from "react";
import html2canvas from "html2canvas";
import {
  Download,
  X,
  Loader2,
  Sparkles,
  Music2,
  Instagram,
  User,
  Activity,
  Aperture,
  Wifi,
} from "lucide-react";

// --- THEMES (Enhanced Glows) ---
const THEMES = {
  happy: {
    label: "RADIANT ENERGY",
    gradient: "from-yellow-400/20 via-orange-500/10 to-black",
    border: "border-yellow-400/40",
    text: "text-yellow-400",
    shadow: "shadow-[0_0_50px_rgba(250,204,21,0.2)]",
    glow: "bg-yellow-400",
    emoji: "😊",
  },
  sad: {
    label: "MELANCHOLY BLUES",
    gradient: "from-blue-500/20 via-indigo-900/10 to-black",
    border: "border-blue-400/40",
    text: "text-blue-400",
    shadow: "shadow-[0_0_50px_rgba(96,165,250,0.2)]",
    glow: "bg-blue-400",
    emoji: "😞",
  },
  angry: {
    label: "HIGH VOLTAGE",
    gradient: "from-red-500/20 via-orange-900/10 to-black",
    border: "border-red-500/40",
    text: "text-red-500",
    shadow: "shadow-[0_0_50px_rgba(239,68,68,0.2)]",
    glow: "bg-red-500",
    emoji: "😠",
  },
  fearful: {
    label: "VOID RESONANCE",
    gradient: "from-purple-500/20 via-violet-900/10 to-black",
    border: "border-purple-400/40",
    text: "text-purple-400",
    shadow: "shadow-[0_0_50px_rgba(192,132,252,0.2)]",
    glow: "bg-purple-500",
    emoji: "😨",
  },
  disgusted: {
    label: "BIO HAZARD",
    gradient: "from-green-500/20 via-emerald-900/10 to-black",
    border: "border-green-400/40",
    text: "text-green-400",
    shadow: "shadow-[0_0_50px_rgba(74,222,128,0.2)]",
    glow: "bg-green-500",
    emoji: "🤢",
  },
  surprised: {
    label: "SYSTEM SHOCK",
    gradient: "from-pink-500/20 via-cyan-500/10 to-black",
    border: "border-pink-400/40",
    text: "text-pink-400",
    shadow: "shadow-[0_0_50px_rgba(244,114,182,0.2)]",
    glow: "bg-pink-500",
    emoji: "😲",
  },
  neutral: {
    label: "PURE ZEN",
    gradient: "from-gray-500/20 via-zinc-900/10 to-black",
    border: "border-gray-400/40",
    text: "text-gray-400",
    shadow: "shadow-[0_0_50px_rgba(156,163,175,0.2)]",
    glow: "bg-gray-500",
    emoji: "😐",
  },
};

const VibeCard = ({ mood, playlistName, userName, userImage, onClose }) => {
  const cardRef = useRef();
  const [loadingAction, setLoadingAction] = useState(null);
  const [currentTime, setCurrentTime] = useState("");

  const theme = THEMES[mood] || THEMES.neutral;

  // Random Tech ID generation
  const ticketId = `VIBE-${Math.floor(Math.random() * 10000)}-X`;

  useEffect(() => {
    setCurrentTime(
      new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  }, []);

  const generateCard = async () => {
    if (!cardRef.current) return null;
    await new Promise((resolve) => setTimeout(resolve, 300));
    return await html2canvas(cardRef.current, {
      backgroundColor: "#050505",
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
    });
  };

  const handleDownload = async () => {
    setLoadingAction("download");
    try {
      const canvas = await generateCard();
      const link = document.createElement("a");
      link.download = `Moodify-${mood}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (e) {
      console.error(e);
    }
    setLoadingAction(null);
  };

  const handleShare = async () => {
    setLoadingAction("share");
    try {
      const canvas = await generateCard();
      canvas.toBlob(async (blob) => {
        const file = new File([blob], `moodify-vibe.png`, {
          type: "image/png",
        });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: `My Vibe`,
            text: `Currently vibing to ${playlistName} on Moodify.`,
          });
        } else {
          handleDownload();
        }
      }, "image/png");
    } catch (e) {
      console.error(e);
    }
    setLoadingAction(null);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 animate-in fade-in duration-300">
      {/* Background Ambience */}
      <div
        className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] ${theme.glow} blur-[150px] opacity-20 pointer-events-none rounded-full animate-pulse`}
      ></div>

      <div className="relative w-full max-w-sm flex flex-col gap-6 scale-95 md:scale-100">
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 p-3 bg-white/5 border border-white/10 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-all z-50 backdrop-blur-md"
        >
          <X size={20} />
        </button>

        {/* =========================================================
            THE AESTHETIC CARD
           ========================================================= */}
        <div
          ref={cardRef}
          className={`relative aspect-[9/16] w-full bg-[#030303] rounded-[32px] overflow-hidden border ${theme.border} ${theme.shadow} flex flex-col justify-between p-6 group`}
        >
          {/* Grid Overlay */}
          <div className="absolute inset-0 bg-[url('https://assets.codepen.io/1462889/grid.png')] opacity-10 bg-center pointer-events-none"></div>

          {/* Dynamic Gradient */}
          <div
            className={`absolute inset-0 bg-linear-to-b ${theme.gradient} opacity-60 pointer-events-none`}
          ></div>

          {/* Top Tech Header */}
          <div className="relative z-20 flex justify-between items-start border-b border-white/5 pb-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl border border-white/10 overflow-hidden flex items-center justify-center bg-black/40`}
              >
                {userImage ? (
                  <img
                    src={userImage}
                    alt="User"
                    className="w-full h-full object-cover"
                    crossOrigin="anonymous"
                  />
                ) : (
                  <User size={18} className="text-zinc-500" />
                )}
              </div>
              <div>
                <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                  Subject
                </p>
                <p className="text-sm font-bold text-white uppercase tracking-tight">
                  {userName || "UNKNOWN_USER"}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div
                className={`flex items-center justify-end gap-1.5 ${theme.text} mb-1`}
              >
                <Activity size={12} className="animate-pulse" />
                <span className="text-[10px] font-mono font-bold">
                  LIVE SYNC
                </span>
              </div>
              <p className="text-[10px] font-mono text-zinc-600 tracking-widest">
                {ticketId}
              </p>
            </div>
          </div>

          {/* Main Visual Core */}
          <div className="relative z-20 flex-1 flex flex-col items-center justify-center">
            {/* Rotating Rings (Purely Visual) */}
            <div className="relative w-64 h-64 flex items-center justify-center">
              {/* Outer Ring */}
              <div
                className={`absolute inset-0 border border-dashed ${theme.border} rounded-full opacity-30 animate-[spin_10s_linear_infinite]`}
              ></div>
              {/* Inner Ring */}
              <div
                className={`absolute inset-4 border border-dotted ${theme.border} rounded-full opacity-50 animate-[spin_15s_linear_infinite_reverse]`}
              ></div>

              {/* Glowing Core */}
              <div
                className={`absolute inset-0 ${theme.glow} blur-[80px] opacity-20 animate-pulse`}
              ></div>

              {/* Emoji with Floating Animation */}
              <div className="relative z-10 animate-[bounce_3s_infinite_ease-in-out]">
                <span className="text-[100px] filter drop-shadow-2xl">
                  {theme.emoji}
                </span>
              </div>
            </div>

            <div className="mt-8 text-center space-y-2">
              <h2 className="text-6xl font-black text-white tracking-tighter uppercase relative">
                <span
                  className={`absolute inset-0 blur-lg opacity-50 ${theme.text}`}
                >
                  {mood}
                </span>
                <span className="relative z-10">{mood}</span>
              </h2>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded border border-white/10 backdrop-blur-md">
                <Aperture size={12} className={theme.text} />
                <span
                  className={`text-[10px] font-mono font-bold tracking-[0.2em] uppercase ${theme.text}`}
                >
                  {theme.label}
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="relative z-20 space-y-4">
            {/* Visualizer Lines */}
            <div className="flex items-end justify-between h-4 px-2 opacity-50">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className={`w-1 rounded-t-sm ${theme.glow}`}
                  style={{
                    height: `${Math.random() * 100}%`,
                    animation: `pulse ${0.5 + Math.random()}s infinite`,
                  }}
                ></div>
              ))}
            </div>

            {/* Playlist Ticket */}
            <div className="bg-black/40 border border-white/10 rounded-xl p-4 backdrop-blur-md flex items-center gap-4 relative overflow-hidden">
              <div
                className={`absolute left-0 top-0 bottom-0 w-1 ${theme.glow}`}
              ></div>

              <div
                className={`w-10 h-10 rounded-full bg-white/5 flex items-center justify-center ${theme.text}`}
              >
                <Music2 size={18} />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest mb-0.5">
                  Detected Frequency
                </p>
                <p className="text-xs font-bold text-white truncate">
                  {playlistName || "Scanning..."}
                </p>
              </div>

              <div className="text-right">
                <p className="text-[10px] font-mono text-zinc-600 uppercase">
                  Time
                </p>
                <p className="text-xs font-mono text-zinc-400">{currentTime}</p>
              </div>
            </div>

            {/* Footer Branding */}
            <div className="flex justify-between items-center pt-2 opacity-60">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-0.5 h-3 bg-zinc-700"></div>
                ))}
              </div>
              <p className="text-[10px] font-mono uppercase text-zinc-500 flex items-center gap-2">
                Moodify AI <Wifi size={10} />
              </p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleDownload}
            disabled={loadingAction !== null}
            className="flex-1 bg-zinc-900 border border-zinc-800 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all disabled:opacity-50 cursor-pointer"
          >
            {loadingAction === "download" ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <Download size={20} />
            )}
            <span className="text-sm">Save</span>
          </button>

          <button
            onClick={handleShare}
            disabled={loadingAction !== null}
            className={`flex-[1.5] text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg disabled:opacity-50 cursor-pointer ${theme.glow} ${theme.shadow}`}
          >
            {loadingAction === "share" ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <Instagram size={20} />
            )}
            <span className="text-sm">Share Story</span>
          </button>
        </div>

        <p className="text-center text-[10px] text-zinc-500 font-mono opacity-70">
          PRO TIP: Screen Record for the full animated vibe!
        </p>
      </div>
    </div>
  );
};

export default VibeCard;

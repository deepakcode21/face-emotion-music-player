import React, { useState, useEffect } from "react";
import {
  Sparkles,
  LogIn,
  LogOut,
  Clock,
  CloudSun,
  MapPin,
  Calendar,
  Radio,
  Wind,
} from "lucide-react";

const Navbar = ({ isUserLoggedIn, userProfile, onLogin, onLogout }) => {
  const [time, setTime] = useState(new Date());
  // Added 'aqi' to state
  const [weather, setWeather] = useState({
    temp: "--",
    code: 0,
    location: "Scanning...",
    aqi: "--",
  });

  // 1. Time Logic
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 2. Weather, Location & AQI Logic
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // A. Weather
          const weatherRes = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
          );
          const weatherData = await weatherRes.json();

          // B. AQI (Air Quality) - New API Call
          const aqiRes = await fetch(
            `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=us_aqi`
          );
          const aqiData = await aqiRes.json();

          // C. Location
          const locRes = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          const locData = await locRes.json();

          setWeather({
            temp: Math.round(weatherData.current_weather.temperature),
            code: weatherData.current_weather.weathercode,
            aqi: aqiData.current ? aqiData.current.us_aqi : "--", // Set AQI
            location: locData.city || locData.locality || "Unknown",
          });
        } catch (error) {
          setWeather((prev) => ({ ...prev, location: "Offline" }));
        }
      });
    }
  }, []);

  const formatTime = (date) =>
    date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  const formatDate = (date) =>
    date.toLocaleDateString([], {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  // Helper to determine AQI Color based on value
  const getAqiColor = (val) => {
    if (val <= 50) return "text-cyan-400"; // Good
    if (val <= 100) return "text-yellow-400"; // Moderate
    return "text-red-400"; // Unhealthy
  };

  return (
    <div className="fixed top-4 left-0 right-0 mx-auto w-[94%] max-w-7xl z-50">
      <nav className="w-full px-4 md:px-6 py-3 rounded-3xl border bg-black/80 backdrop-blur-2xl border-green-400/80 shadow-green-400 shadow-[0_0_20px_5px_rgba(0,0,0,0.20)] flex items-center justify-between relative overflow-hidden">
        <div className="absolute top-0 -left-full w-1/2 h-full bg-linear-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 animate-[shimmer_8s_infinite_linear]"></div>

        <div className="flex items-center gap-3 relative z-10">
          <div className="relative group">
            <div className="absolute inset-0 bg-green-500 blur-md opacity-40 animate-pulse"></div>
            <Sparkles className="relative text-green-400 w-5 h-5 drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
          </div>
          <h1 className="text-lg md:text-xl font-black tracking-tighter text-white hidden sm:block">
            Moodify
            <span className="text-transparent bg-clip-text bg-linear-to-r from-green-400 to-emerald-500">
              .ai
            </span>
          </h1>
        </div>

        <div className="hidden md:flex relative group">
          <div className="absolute -inset-1 bg-linear-to-r from-green-500/20 via-blue-500/20 to-purple-500/20 rounded-full blur-xl opacity-70 group-hover:opacity-100 animate-[pulse_4s_ease-in-out_infinite]"></div>

          <div className="relative flex items-center gap-5 px-5 py-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <MapPin
                  size={12}
                  className="text-green-400 drop-shadow-[0_0_5px_rgba(74,222,128,0.6)]"
                />
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-300 max-w-20 truncate">
                  {weather.location}
                </span>
              </div>

              <div className="h-4 w-px bg-white/10"></div>

              <div className="flex items-center gap-1.5">
                <CloudSun
                  size={14}
                  className="text-yellow-400 drop-shadow-[0_0_5px_rgba(250,204,21,0.6)] animate-[bounce_3s_ease-in-out_infinite]"
                />
                <span className="text-xs font-mono font-bold text-white">
                  {weather.temp}°C
                </span>
              </div>

              <div className="h-4 w-px bg-white/10"></div>

              <div
                className="flex items-center gap-1.5"
                title="Air Quality Index"
              >
                <Wind
                  size={14}
                  className={`drop-shadow-[0_0_5px_rgba(34,211,238,0.6)] ${getAqiColor(
                    weather.aqi
                  )}`}
                />
                <span className="text-xs font-mono font-bold text-white">
                  AQI {weather.aqi}
                </span>
              </div>
            </div>

            <div className="flex items-center text-zinc-600">
              <Radio size={10} className="animate-pulse text-blue-500/60" />
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <Calendar
                  size={12}
                  className="text-purple-400 drop-shadow-[0_0_5px_rgba(192,132,252,0.6)]"
                />
                <span className="text-[10px] font-bold uppercase text-zinc-300 whitespace-nowrap">
                  {formatDate(time)}
                </span>
              </div>

              <div className="h-4 w-px bg-white/10"></div>

              <div className="flex items-center gap-1.5 min-w-20">
                <Clock
                  size={14}
                  className="text-blue-400 drop-shadow-[0_0_5px_rgba(96,165,250,0.6)]"
                />
                <span className="text-xs font-mono font-bold text-white">
                  {formatTime(time)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 relative z-10">
          {isUserLoggedIn && userProfile ? (
            <div className="group relative">
              <button className="flex items-center gap-3 bg-zinc-900 border border-white/10 pl-2 pr-4 py-1.5 rounded-full hover:bg-zinc-800 transition-all">
                {userProfile?.images?.[0]?.url ? (
                  <img
                    src={userProfile.images[0].url}
                    alt="User"
                    className="w-7 h-7 rounded-full border border-green-500 object-cover"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center text-black font-bold text-xs">
                    {userProfile?.display_name?.charAt(0) || "U"}
                  </div>
                )}
                <span className="text-xs font-bold text-white max-w-[100px] truncate">
                  {userProfile?.display_name || "Spotify User"}
                </span>
              </button>
              <div className="absolute right-0 top-full mt-2 w-44 bg-[#0a0a0a] border border-white/10 rounded-xl shadow-2xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right">
                <div className="px-4 py-3 border-b border-white/5">
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wider">
                    Logged In As
                  </p>
                  <p className="text-xs font-bold text-white truncate">
                    {userProfile?.display_name || "Spotify User"}
                  </p>
                  {userProfile?.email && (
                    <p className="text-[10px] text-zinc-500 truncate mt-1">
                      {userProfile.email}
                    </p>
                  )}
                </div>

                <button
                  onClick={onLogout}
                  className="w-full flex items-center gap-2 px-4 py-3 text-xs font-bold text-red-400 hover:bg-red-500/10 transition-colors text-left"
                >
                  <LogOut size={14} /> Logout
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={onLogin}
              className="flex items-center gap-2 bg-white text-black px-5 py-2 rounded-full text-xs font-bold hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.3)]"
            >
              <LogIn size={14} /> Login
            </button>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;

import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import MoodCamera from "./components/MoodCamera";
import SpotifyPlayer from "./components/SpotifyPlayer";
import { RefreshCw, ScanFace, Share2 } from "lucide-react";
import VibeCard from "./components/VibeCard";
import SplashScreen from "./components/SplashScreen";
import VibeTuner from "./components/VibeTuner";
import { playClick, playSuccess, playSwitch } from "./utils/SoundEngine";

// --- MOOD COLORS CONFIG (For Ambient Background) ---
const MOOD_COLORS = {
  happy: "from-yellow-500/30 via-orange-500/10",
  sad: "from-blue-600/30 via-indigo-900/10",
  angry: "from-red-600/30 via-orange-900/10",
  fearful: "from-purple-600/30 via-violet-900/10",
  disgusted: "from-green-600/30 via-emerald-900/10",
  surprised: "from-pink-500/30 via-cyan-500/10",
  neutral: "from-gray-500/30 via-zinc-900/10",
  default: "from-green-500/20 via-black",
};

// ===============================
// PKCE HELPERS
// ===============================
function generateRandomString(length = 64) {
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let text = "";
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

async function sha256(plain) {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return hash;
}

function base64encode(input) {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

// ===============================

function App() {
  const [appToken, setAppToken] = useState("");
  const [playlistId, setPlaylistId] = useState(null);
  const [playlistName, setPlaylistName] = useState("");
  const [currentLogic, setCurrentLogic] = useState("");
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [showShareCard, setShowShareCard] = useState(false);

  // Splash Screen Logic
  const [showSplash, setShowSplash] = useState(() => {
    return !localStorage.getItem("splash_seen");
  });

  const [selectedGenre, setSelectedGenre] = useState("bollywood");

  // Ambient Background State
  const [bgGradient, setBgGradient] = useState(MOOD_COLORS.default);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code) {
      exchangeToken(code);
      window.history.replaceState({}, document.title, "/");
    }

    const storedToken = localStorage.getItem("spotify_user_token");
    if (storedToken) {
      setIsUserLoggedIn(true);
      fetchUserProfile(storedToken);
    }

    const getAppToken = async () => {
      const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
      const CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

      const res = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: "Basic " + btoa(CLIENT_ID + ":" + CLIENT_SECRET),
        },
        body: "grant_type=client_credentials",
      });

      const data = await res.json();
      setAppToken(data.access_token);
    };

    getAppToken();
  }, []);

  const handleLogin = async () => {
    const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
    const REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;
    const verifier = generateRandomString(128);
    const challenge = base64encode(await sha256(verifier));
    localStorage.setItem("spotify_code_verifier", verifier);

    const scopes = [
      "user-read-email",
      "user-read-private",
      "streaming",
      "user-read-playback-state",
      "user-modify-playback-state",
    ].join(" ");

    const authUrl =
      `https://accounts.spotify.com/authorize` +
      `?client_id=${CLIENT_ID}` +
      `&response_type=code` +
      `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
      `&scope=${encodeURIComponent(scopes)}` +
      `&code_challenge_method=S256` +
      `&code_challenge=${challenge}`;

    window.location.href = authUrl;
  };

  const exchangeToken = async (code) => {
    const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
    const REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;
    const verifier = localStorage.getItem("spotify_code_verifier");

    const res = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        grant_type: "authorization_code",
        code,
        redirect_uri: REDIRECT_URI,
        code_verifier: verifier,
      }),
    });

    const data = await res.json();
    if (data.access_token) {
      localStorage.setItem("spotify_user_token", data.access_token);
      setIsUserLoggedIn(true);
      fetchUserProfile(data.access_token);
    }
  };

  const fetchUserProfile = async (token) => {
    try {
      const res = await fetch("https://api.spotify.com/v1/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        handleLogout();
        return;
      }
      const data = await res.json();
      setUserProfile(data);
    } catch (e) {
      console.error("PROFILE ERROR", e);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("spotify_user_token");
    setIsUserLoggedIn(false);
    setUserProfile(null);
    window.location.href = "/";
  };

  const handleReset = () => {
    playClick(); // SOUND ADDED
    setPlaylistId(null);
    setPlaylistName("");
    setCurrentLogic("");
    setShowShareCard(false);
    setBgGradient(MOOD_COLORS.default); // RESET BG
  };

  // Wrapper for Genre Change to play sound
  const handleGenreChange = (id) => {
    playSwitch(); // SOUND ADDED
    setSelectedGenre(id);
  };

  const handleMoodDetected = async (mood, age) => {
    playSuccess(); // SOUND ADDED
    setBgGradient(MOOD_COLORS[mood] || MOOD_COLORS.default); // UPDATE BG

    if (!appToken) return;

    const randomPick = (arr) => arr[Math.floor(Math.random() * arr.length)];

    let queryBase = "";

    // ✅ YOUR LOGIC KEPT EXACTLY AS IS
    const bollywoodMap = {
      happy: [
        "bollywood party dance songs hindi",
        "bollywood wedding dance mashup",
        "bollywood happy travel songs",
      ],
      sad: [
        "bollywood sad emotional arijit singh",
        "bollywood heartbreak broken love songs",
        "bollywood rain sad vibe",
      ],
      angry: [
        "bollywood rock workout high energy",
        "bollywood motivational rage songs",
        "bollywood gym power songs",
      ],
      default: [
        "bollywood lofi chill",
        "bollywood romantic soft vibe",
        "bollywood late night drive songs",
      ],
    };

    const punjabiMap = {
      happy: [
        "punjabi party hits ap dhillon diljit",
        "punjabi wedding bhangra vibe",
        "punjabi club songs bass boosted",
      ],
      sad: [
        "punjabi sad songs qismat",
        "punjabi breakup emotional songs",
        "punjabi slow heartbreak vibe",
      ],
      default: [
        "punjabi sidhu moose wala high energy",
        "punjabi gangster rap",
        "punjabi attitude workout songs",
      ],
    };

    const kpopMap = {
      happy: [
        "kpop happy summer vibe bts",
        "kpop party edm blackpink",
        "kpop bright cute vibe",
      ],
      sad: [
        "kpop sad emotional ballad",
        "kpop lonely night vibe",
        "kpop breakup soft songs",
      ],
      default: [
        "kpop dark concept hype",
        "kpop gym energy",
        "kpop futuristic beats",
      ],
    };

    const lofiMap = {
      happy: [
        "lofi happy chill beats",
        "lofi coffee shop vibe",
        "lofi aesthetic sunshine mood",
      ],
      sad: [
        "lofi sad rain night vibe",
        "lofi lonely deep focus",
        "lofi heartbreak chill",
      ],
      default: [
        "lofi chill study relaxing beats",
        "lofi coding midnight session",
        "lofi anime night vibe",
      ],
    };

    // 2. SELECTED GENRE DRIVER
    if (selectedGenre === "bollywood")
      queryBase = randomPick(bollywoodMap[mood] || bollywoodMap.default);
    else if (selectedGenre === "punjabi")
      queryBase = randomPick(punjabiMap[mood] || punjabiMap.default);
    else if (selectedGenre === "kpop")
      queryBase = randomPick(kpopMap[mood] || kpopMap.default);
    else if (selectedGenre === "lofi")
      queryBase = randomPick(lofiMap[mood] || lofiMap.default);
    else {
      const globalMap = {
        happy: [
          "party upbeat dance pop hits",
          "feel good summer pop songs",
          "happy road trip music",
        ],
        sad: [
          "sad soulful acoustic heartbreak piano",
          "late night emotional english songs",
          "deep broken heart songs",
        ],
        angry: [
          "heavy metal rock gym workout energy",
          "phonk aggressive bass music",
          "rage rap hard beats",
        ],
        default: [
          "lofi chill study relaxing beats",
          "ambient calm relaxing music",
          "deep focus instrumental music",
        ],
      };
      queryBase = randomPick(globalMap[mood] || globalMap.default);
    }

    // 4. AGE + ERA LOGIC
    let era = "";
    if (age < 18)
      era = randomPick(["2024 viral", "gen z trending", "reels trending"]);
    else if (age < 30)
      era = randomPick([
        "2015-2024 hits",
        "spotify global hits",
        "viral sensation",
      ]);
    else if (age < 45) era = randomPick(["2010s hits", "classic party era"]);
    else if (age < 55) era = randomPick(["90s hits classic", "retro gold"]);
    else era = randomPick(["70s 80s golden era", "old is gold evergreen"]);

    // 5. TIME BASED FLAVOUR
    const hour = new Date().getHours();
    let timeFlavor = "";
    if (hour >= 5 && hour < 12) timeFlavor = "morning fresh vibe";
    else if (hour >= 12 && hour < 18) timeFlavor = "day energy mode";
    else if (hour >= 18 && hour < 22) timeFlavor = "evening chill mood";
    else timeFlavor = "midnight deep listening";

    // 6. FINAL AI QUERY
    const finalQuery = `${queryBase} ${era} ${timeFlavor}`;

    setCurrentLogic(
      `${mood.toUpperCase()} | ${selectedGenre.toUpperCase()} | ${timeFlavor.toUpperCase()}`
    );

    try {
      const offset = Math.floor(Math.random() * 20);
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(
          finalQuery
        )}&type=playlist&limit=10&offset=${offset}`,
        { headers: { Authorization: "Bearer " + appToken } }
      );
      const data = await response.json();

      if (
        data &&
        data.playlists &&
        Array.isArray(data.playlists.items) &&
        data.playlists.items.length > 0 &&
        data.playlists.items.some((item) => item && item.id)
      ) {
        const safePlaylists = data.playlists.items.filter(
          (item) => item && item.id
        );
        const randomIdx = Math.floor(Math.random() * safePlaylists.length);
        setPlaylistId(safePlaylists[randomIdx].id);
        setPlaylistName(safePlaylists[randomIdx].name);
      } else {
        const fallbackQuery = `${selectedGenre} ${mood} songs`;
        const retryRes = await fetch(
          `https://api.spotify.com/v1/search?q=${encodeURIComponent(
            fallbackQuery
          )}&type=playlist&limit=10`,
          { headers: { Authorization: "Bearer " + appToken } }
        );
        const retryData = await retryRes.json();
        if (
          retryData?.playlists?.items?.length > 0 &&
          retryData.playlists.items[0]?.id
        ) {
          setPlaylistId(retryData.playlists.items[0].id);
          setPlaylistName(retryData.playlists.items[0].name);
        }
      }
    } catch (err) {
      console.error("SPOTIFY AI ERROR", err);
    }
  };

  if (showSplash) {
    return (
      <SplashScreen
        onComplete={() => {
          localStorage.setItem("splash_seen", "true");
          setShowSplash(false);
        }}
      />
    );
  }

  return (
    // FIX: Transparent bg here so dynamic div shows
    <div className="relative min-h-dvh flex flex-col font-sans selection:bg-green-500 selection:text-black overflow-x-hidden text-white transition-colors duration-1000">
      {/* --- DYNAMIC BACKGROUND LAYER --- */}
      <div className="fixed inset-0 -z-10 h-full w-full bg-[#050505]">
        <div
          className={`absolute inset-0 bg-linear-to-b ${bgGradient} to-black transition-all duration-1000 ease-in-out opacity-80`}
        ></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[100%_4px] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 hidden md:block mix-blend-overlay"></div>
      </div>

      <Navbar
        isUserLoggedIn={isUserLoggedIn}
        userProfile={userProfile}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 pt-28 pb-12 flex flex-col">
        {/* OPTIMIZED GUEST MODE ALERT (SLEEK VERSION) */}
        {!isUserLoggedIn && (
          <div className="mb-4 mx-auto w-fit flex items-center gap-3 px-4 py-1.5 rounded-full bg-yellow-500/5 border border-yellow-500/20 backdrop-blur-md group hover:border-yellow-500/40 transition-all">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(234,179,8,0.8)]"></div>
              <span className="text-[10px] font-mono font-bold text-yellow-500 uppercase tracking-widest">
                GUEST ACCESS
              </span>
            </div>
            <div className="w-px h-3 bg-yellow-500/20"></div>
            <p className="text-[10px] font-mono text-yellow-200/60 uppercase tracking-wide">
              30s Preview Only • Login Required
            </p>
          </div>
        )}

        {!playlistId && (
          <VibeTuner
            selectedGenre={selectedGenre}
            onGenreChange={handleGenreChange}
          />
        )}

        {/* MOBILE VIEW */}
        <div className="lg:hidden flex flex-col gap-6 mb-12">
          {!playlistId && (
            <div className="relative w-full h-[500px]">
              <MoodCamera
                onMoodDetected={handleMoodDetected}
                onReset={handleReset}
              />
            </div>
          )}
          {playlistId && (
            <>
              <div className="flex gap-3">
                <button
                  onClick={handleReset}
                  className="flex-1 bg-[#0a0a0a]/80 border border-green-500/40 p-4 rounded-2xl flex items-center justify-between shadow-[0_0_20px_rgba(34,197,94,0.1)] active:scale-95 transition-transform backdrop-blur-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <div className="text-left">
                      <p className="text-[10px] text-zinc-400 font-mono uppercase tracking-widest">
                        SESSION
                      </p>
                      <p className="text-xs font-bold text-white flex items-center gap-2">
                        Reset
                      </p>
                    </div>
                  </div>
                  <RefreshCw size={16} className="text-zinc-500" />
                </button>
                <button
                  onClick={() => {
                    playClick();
                    setShowShareCard(true);
                  }}
                  className="w-20 bg-green-500 text-black rounded-2xl flex flex-col items-center justify-center gap-1 active:scale-95 transition-transform shadow-[0_0_20px_rgba(34,197,94,0.4)] cursor-pointer"
                >
                  <Share2 size={20} />
                  <span className="text-[10px] font-bold">SHARE</span>
                </button>
              </div>
              <div className="relative w-full h-[600px] animate-in slide-in-from-bottom-10 duration-700 fade-in">
                <SpotifyPlayer
                  playlistId={playlistId}
                  logicText={currentLogic}
                />
              </div>
            </>
          )}
        </div>

        {/* DESKTOP VIEW */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-12 lg:h-[650px] mb-16 items-center">
          <div className="relative group w-full h-full">
            <div className="absolute -inset-1 bg-linear-to-r from-green-500/20 to-transparent rounded-4xl blur-xl opacity-40 group-hover:opacity-60 transition duration-1000 -z-10"></div>
            <MoodCamera
              onMoodDetected={handleMoodDetected}
              onReset={handleReset}
            />
          </div>

          <div className="relative group w-full h-full flex flex-col gap-4">
            <div className="absolute -inset-1 bg-linear-to-l from-green-500/20 to-transparent rounded-4xl blur-xl opacity-40 group-hover:opacity-60 transition duration-1000 -z-10"></div>
            {playlistId && (
              <div className="flex justify-end gap-3 absolute -top-14 right-0 z-50">
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 border border-white/10 hover:bg-zinc-800 text-xs font-bold transition-all cursor-pointer"
                >
                  <RefreshCw size={14} /> New Scan
                </button>
                <button
                  onClick={() => {
                    playClick();
                    setShowShareCard(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500 text-black hover:bg-green-400 text-xs font-bold transition-all shadow-[0_0_15px_rgba(34,197,94,0.4)] cursor-pointer"
                >
                  <Share2 size={14} /> Share Vibe
                </button>
              </div>
            )}
            <SpotifyPlayer playlistId={playlistId} logicText={currentLogic} />
          </div>
        </div>

        {showShareCard && (
          <VibeCard
            mood={currentLogic.split("|")[0]?.trim().toLowerCase()}
            playlistName={playlistName}
            userName={userProfile?.display_name}
            userImage={userProfile?.images?.[0]?.url}
            onClose={() => setShowShareCard(false)}
          />
        )}
        <Footer />
      </main>
    </div>
  );
}

export default App;

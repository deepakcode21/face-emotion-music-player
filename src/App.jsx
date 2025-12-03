import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MoodCamera from './components/MoodCamera';
import SpotifyPlayer from './components/SpotifyPlayer';
import { RefreshCw, ScanFace } from 'lucide-react';

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;

function App() {
  const [appToken, setAppToken] = useState("");
  const [playlistId, setPlaylistId] = useState(null);
  const [currentLogic, setCurrentLogic] = useState("");
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token"));
      if (token) {
        window.location.hash = "";
        setIsUserLoggedIn(true);
        localStorage.setItem("spotify_user_login", "true");
      }
    } else if (localStorage.getItem("spotify_user_login") === "true") {
      setIsUserLoggedIn(true);
    }

    const getAppToken = async () => {
      try {
        const result = await fetch('https://accounts.spotify.com/api/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(CLIENT_ID + ':' + CLIENT_SECRET)
          },
          body: 'grant_type=client_credentials'
        });
        const data = await result.json();
        setAppToken(data.access_token);
      } catch (error) { console.error("Token Error:", error); }
    };
    getAppToken();
  }, []);

  const handleLogin = () => {
    const scopes = "streaming user-read-email user-read-private";
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${encodeURIComponent(scopes)}&response_type=token&show_dialog=true`;
    window.location.href = authUrl;
  };

  const handleLogout = () => {
    setIsUserLoggedIn(false);
    localStorage.removeItem("spotify_user_login");
    window.location.href = "/";
  };

  const handleReset = () => {
    setPlaylistId(null);
    setCurrentLogic("");
  };

  const handleMoodDetected = async (mood, age) => {
    if (!appToken) return;

    let vibe = "";
    let era = "";

    switch(mood) {
      case 'happy': vibe = "party upbeat dance pop hits"; break;
      case 'sad': vibe = "sad soulful acoustic heartbreak piano"; break;
      case 'angry': vibe = "heavy metal rock gym workout energy"; break;
      case 'fearful': vibe = "calming ambient nature sounds healing"; break; 
      case 'disgusted': vibe = "fresh trending viral hits mood booster"; break; 
      case 'surprised': vibe = "new music friday discovery viral"; break;
      default: vibe = "lofi chill study relaxing beats"; 
    }

    if (age < 20) era = "2024 gen z viral";
    else if (age < 40) era = "2010s club hits";
    else if (age < 50) era = "90s bollywood classic rock";
    else era = "70s 80s golden era";

    const finalQuery = `${vibe} ${era}`;
    setCurrentLogic(`${mood.toUpperCase()} | AGE: ${age} | QUERY: ${finalQuery}`);
    
    try {
      const offset = Math.floor(Math.random() * 5); 
      const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(finalQuery)}&type=playlist&limit=10&offset=${offset}`, {
        headers: { 'Authorization': 'Bearer ' + appToken }
      });
      const data = await response.json();
      if (data.playlists && data.playlists.items.length > 0) {
        const randomIdx = Math.floor(Math.random() * data.playlists.items.length);
        setPlaylistId(data.playlists.items[randomIdx].id);
      }
    } catch (err) { console.error(err); }
  };

  return (
    <div className="relative min-h-screen flex flex-col font-sans selection:bg-green-500 selection:text-black overflow-x-hidden bg-[#050505] text-white">
      <div className="fixed inset-0 -z-10 h-full w-full">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5"></div>
        <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-green-900/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-20%] right-[20%] w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none"></div>
      </div>

      <Navbar 
        isUserLoggedIn={isUserLoggedIn} 
        onLogin={handleLogin} 
        onLogout={handleLogout} 
      />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 pt-28 pb-12 flex flex-col">
        {!isUserLoggedIn && (
           <div className="mb-8 mx-auto max-w-2xl p-3 rounded-full bg-yellow-500/5 border border-yellow-500/20 text-yellow-200/80 text-xs flex items-center justify-center gap-2 backdrop-blur-md">
             <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
             <p>Guest Mode: 30s previews only. Login into your spotify account for full playback.</p>
           </div>
        )}

        {/* ==============================================
            MOBILE VIEW (Special Layout)
            ==============================================
        */}
        <div className="lg:hidden flex flex-col gap-6 mb-12">
            {!playlistId && (
                <div className="relative w-full h-[550px]">
                    <div className="absolute -inset-1 bg-linear-to-r from-green-500/20 to-transparent rounded-4xl blur-xl opacity-40 -z-10"></div>
                    <MoodCamera onMoodDetected={handleMoodDetected} onReset={handleReset} />
                </div>
            )}
            {playlistId && (
                <>
                    <button 
                        onClick={handleReset} 
                        className="w-full bg-[#0a0a0a] border border-green-500/40 p-4 rounded-2xl flex items-center justify-between shadow-[0_0_20px_rgba(34,197,94,0.1)] active:scale-95 transition-transform"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <div className="text-left">
                                <p className="text-[10px] text-zinc-400 font-mono uppercase tracking-widest">CURRENT SESSION</p>
                                <p className="text-sm font-bold text-white flex items-center gap-2">
                                    <ScanFace size={16} className="text-green-400" /> 
                                    Vibe Locked
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-black bg-green-400 px-4 py-2 rounded-full">
                            <RefreshCw size={14} /> Tap to Rescan
                        </div>
                    </button>
                    <div className="relative w-full h-[600px] animate-in slide-in-from-bottom-10 duration-700 fade-in">
                        <div className="absolute -inset-1 bg-linear-to-l from-green-500/20 to-transparent rounded-4xl blur-xl opacity-40 -z-10"></div>
                        <SpotifyPlayer playlistId={playlistId} logicText={currentLogic} />
                    </div>
                </>
            )}
        </div>

        {/* ==============================================
            DESKTOP VIEW (Standard Grid)
            ==============================================
        */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-12 lg:h-[650px] mb-16 items-center">
           <div className="relative group w-full h-full">
              <div className="absolute -inset-1 bg-linear-to-r from-green-500/20 to-transparent rounded-4xl blur-xl opacity-40 group-hover:opacity-60 transition duration-1000 -z-10"></div>
              <MoodCamera onMoodDetected={handleMoodDetected} onReset={handleReset} />
           </div>
           <div className="relative group w-full h-full">
              <div className="absolute -inset-1 bg-linear-to-l from-green-500/20 to-transparent rounded-4xl blur-xl opacity-40 group-hover:opacity-60 transition duration-1000 -z-10"></div>
              <SpotifyPlayer playlistId={playlistId} logicText={currentLogic} />
           </div>
        </div>

        <Footer />

      </main>
    </div>
  );
}

export default App;
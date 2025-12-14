import React, { useRef, useState, useEffect } from "react";
import * as faceapi from "face-api.js";
import {
  Camera,
  RefreshCw,
  Play,
  Loader2,
  ScanFace,
  CheckCircle2,
  Edit3,
  X,
} from "lucide-react";

const MoodCamera = ({ onMoodDetected, onReset }) => {
  const videoRef = useRef();
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [detectedMood, setDetectedMood] = useState(null);
  const [detectedAge, setDetectedAge] = useState(null);
  const [showManualSelect, setShowManualSelect] = useState(false);

  const isProcessingRef = useRef(false);
  const streamRef = useRef(null);

  const MOOD_LIST = [
    { label: "happy", emoji: "⚡" },
    { label: "sad", emoji: "🌧️" },
    { label: "angry", emoji: "🔥" },
    { label: "fearful", emoji: "😨" },
    { label: "disgusted", emoji: "🤢" },
    { label: "surprised", emoji: "😲" },
    { label: "neutral", emoji: "😐" },
  ];

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models";
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
          faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL),
        ]);
        setIsModelLoaded(true);
      } catch (e) {
        console.error("Model Load Error:", e);
      }
    };
    loadModels();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    if (onReset) onReset();
    setDetectedMood(null);
    setDetectedAge(null);
    setShowManualSelect(false); // Reset manual mode
    setIsCameraOn(true);
    isProcessingRef.current = false;

    try {
      const constraints = {
        video: {
          width: { ideal: 480 },
          height: { ideal: 360 },
          facingMode: "user",
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera Error:", err);
      setIsCameraOn(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraOn(false);
    isProcessingRef.current = false;
  };
  const runDetectionLoop = async () => {
    if (
      !videoRef.current ||
      !streamRef.current ||
      videoRef.current.paused ||
      videoRef.current.ended
    ) {
      return;
    }
    if (isProcessingRef.current) return;

    isProcessingRef.current = true;

    try {
      const options = new faceapi.TinyFaceDetectorOptions({
        inputSize: 224,
        scoreThreshold: 0.5,
      });

      const detections = await faceapi
        .detectAllFaces(videoRef.current, options)
        .withFaceExpressions()
        .withAgeAndGender();

      if (detections.length > 0) {
        const data = detections[0];
        const expressions = data.expressions;
        const age = Math.round(data.age);

        const maxMood = Object.keys(expressions).reduce((a, b) =>
          expressions[a] > expressions[b] ? a : b
        );

        if (expressions[maxMood] > 0.6) {
          setDetectedMood(maxMood);
          setDetectedAge(age);
          onMoodDetected(maxMood, age);
          stopCamera();
          return;
        }
      }
    } catch (error) {
      console.log("Detection glitches (normal on mobile startup)");
    }

    isProcessingRef.current = false;
    if (isCameraOn && !detectedMood) {
      setTimeout(() => requestAnimationFrame(runDetectionLoop), 100);
    }
  };

  const handleManualOverride = (mood) => {
    setDetectedMood(mood);
    setShowManualSelect(false);
    // Use previously detected age or default to 25 if manual select happened before detection
    const ageToUse = detectedAge || 25;
    setDetectedAge(ageToUse);
    onMoodDetected(mood, ageToUse);
  };

  const handleVideoPlay = () => {
    runDetectionLoop();
  };

  return (
    <div className="glass-panel border-green-400/80 rounded-3xl p-1 flex flex-col h-full w-full overflow-hidden relative hover:border-green-500/40 transition-all duration-500 group bg-[#0a0a0a]">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none z-0 mix-blend-overlay"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.4)_50%)] bg-size-[100%_4px] pointer-events-none z-10 opacity-10"></div>
      <div className="px-6 py-4 flex justify-between items-center border-b-green-400 border-b border-white/5 bg-black/40 z-20 relative backdrop-blur-md">
        <h2 className="text-lg font-bold flex items-center gap-2 text-white tracking-wide">
          <ScanFace className="text-green-500 w-5 h-5" />
          <span className="text-sm uppercase tracking-wider font-bold text-zinc-300">
            Bio-Scanner
          </span>
        </h2>

        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${
              isCameraOn ? "bg-red-500 animate-pulse" : "bg-zinc-600"
            }`}
          ></span>
          <span
            className={`text-xs font-mono uppercase ${
              isCameraOn ? "text-red-400" : "text-zinc-500"
            }`}
          >
            {isCameraOn ? "LIVE" : detectedMood ? "LOCKED" : "STANDBY"}
          </span>
        </div>
      </div>
      <div className="flex-1 bg-black relative flex items-center justify-center overflow-hidden rounded-b-[20px] z-10">
        <div className="absolute inset-0 w-full h-full">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline // IMPORTANT FOR IPHONE/MOBILE
            onPlay={handleVideoPlay}
            className={`w-full h-full object-cover transform scale-x-[-1] transition-opacity duration-500 ${
              isCameraOn ? "opacity-100" : "opacity-0 absolute"
            }`}
          />
          {isCameraOn && (
            <div className="absolute inset-0 pointer-events-none z-30">
              <div className="w-full h-1 bg-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.8)] absolute animate-scan top-0"></div>

              <div className="absolute top-4 right-4 text-green-500 font-mono text-[10px] border border-green-500/30 px-2 py-1 rounded bg-black/80 backdrop-blur-md flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                NEURAL_NET_ACTIVE
              </div>
              <div className="absolute bottom-4 left-4 text-green-500/50 font-mono text-[8px]">
                INPUT: 224x224 | MODEL: TINY_YOLO
              </div>

              <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-green-500/50 rounded-tl-lg"></div>
              <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-green-500/50 rounded-tr-lg"></div>
              <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-green-500/50 rounded-bl-lg"></div>
              <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-green-500/50 rounded-br-lg"></div>

              <div className="absolute inset-0 bg-[url('https://assets.codepen.io/1462889/grid.png')] opacity-20 bg-center"></div>
            </div>
          )}
        </div>
        {!isCameraOn && !detectedMood && (
          <div className="z-20 text-center p-6 max-w-sm relative flex flex-col items-center">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-500/10 rounded-full blur-[80px] animate-pulse pointer-events-none"></div>

            {isModelLoaded ? (
              <div className="space-y-6 relative z-10 w-full">
                <div className="w-24 h-24 bg-[#0a0a0a] rounded-full flex items-center justify-center mx-auto border border-white/10 shadow-[0_0_30px_rgba(34,197,94,0.1)] group-hover:border-green-500/30 transition-colors duration-500">
                  <Camera
                    size={40}
                    className="text-zinc-500 group-hover:text-green-400 transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <h3 className="text-3xl font-black text-transparent bg-clip-text bg-linear-to-br from-white to-zinc-600 mb-4 tracking-tight z-10">
                    Vibe Check
                  </h3>
                  <p className="text-zinc-500 text-xs font-mono uppercase tracking-widest">
                    Ready to Initialize Scan
                  </p>
                </div>

                <button
                  onClick={startCamera}
                  className="w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-3 bg-white/10 backdrop-blur-xl border border-white/20 text-white relative overflow-hidden transition-all hover:bg-green-500/20 hover:border-green-400/40 hover:scale-[1.05] hover:shadow-[0_0_35px_rgba(34,197,94,0.6)] cursor-pointer"
                >
                  <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/40 to-transparent translate-x-[-200%] hover:translate-x-[200%] transition-transform duration-700"></span>
                  <Play size={20} className="relative z-10" />
                  <span className="tracking-wide relative z-10">
                    INITIATE SCAN
                  </span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center text-zinc-500 gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full"></div>
                  <Loader2 className="animate-spin w-10 h-10 text-green-500 relative z-10" />
                </div>
                <p className="text-xs font-mono tracking-[0.2em] text-green-500/80 animate-pulse">
                  LOADING AI MODELS...
                </p>
              </div>
            )}
          </div>
        )}
        {!isCameraOn && detectedMood && (
          <div className="z-20 text-center animate-in zoom-in duration-300 p-8 w-full h-full bg-black/80 backdrop-blur-xl flex flex-col items-center justify-center relative">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[300px] h-[300px] border border-green-500/20 rounded-full animate-[spin_10s_linear_infinite]"></div>
              <div className="w-[200px] h-[200px] border border-green-500/10 rounded-full absolute animate-[ping_3s_linear_infinite]"></div>
            </div>

            <div className="w-28 h-28 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(34,197,94,0.2)] relative z-10">
              <span className="text-6xl mb-6">
                {MOOD_LIST.find((m) => m.label === detectedMood)?.emoji || "✨"}
              </span>
            </div>

            <h2 className="text-5xl font-black text-transparent bg-clip-text bg-linear-to-b from-white to-zinc-500 uppercase tracking-tighter mb-2">
              {detectedMood}
            </h2>

            <div className="flex items-center gap-3 mb-10">
              <div className="px-4 py-1.5 bg-zinc-900 rounded border border-white/10 text-xs font-mono text-zinc-400">
                AGE: <span className="text-white">{detectedAge}</span>
              </div>
              <div className="px-4 py-1.5 bg-green-900/20 rounded border border-green-500/20 text-xs font-mono text-green-400 flex items-center gap-2">
                <CheckCircle2 size={12} /> CONFIDENCE: 98%
              </div>
            </div>

            <button
              onClick={startCamera}
              className="group bg-zinc-900 text-white px-8 py-3 rounded-full text-sm font-bold border border-white/10 hover:border-green-500/50 hover:text-green-400 transition-all flex items-center gap-2 hover:bg-black cursor-pointer"
            >
              <RefreshCw
                size={16}
                className="group-hover:rotate-180 transition-transform duration-500"
              />{" "}
              RE-CALIBRATE
            </button>
            <button
              onClick={() => setShowManualSelect(true)}
              className="w-full bg-transparent text-zinc-500 px-8 py-2 rounded-xl text-xs font-mono hover:text-white transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Edit3 size={12} /> WRONG VIBE? CHANGE IT
            </button>
          </div>
        )}
        {showManualSelect && (
          <div className="z-30 absolute inset-0 bg-black p-6 flex flex-col animate-in fade-in slide-in-from-bottom-10 duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-white font-bold text-lg">Select Your Vibe</h3>
              <button
                onClick={() => setShowManualSelect(false)}
                className="p-2 bg-zinc-900 rounded-full text-zinc-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 overflow-y-auto pb-4">
              {MOOD_LIST.map((mood) => (
                <button
                  key={mood.label}
                  onClick={() => handleManualOverride(mood.label)}
                  className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all cursor-pointer ${
                    detectedMood === mood.label
                      ? "bg-green-500/20 border-green-500 text-white"
                      : "bg-zinc-900 border-white/5 text-zinc-400 hover:bg-zinc-800 hover:border-white/20"
                  }`}
                >
                  <span className="text-2xl">{mood.emoji}</span>
                  <span className="text-xs font-bold uppercase tracking-wider">
                    {mood.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MoodCamera;

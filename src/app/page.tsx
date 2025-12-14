"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Sparkles, Zap, Brain, Mic, Play, Square, Download, RotateCcw } from "lucide-react";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

import { charMap, elementFreqs, calculateSanmeigaku } from "@/utils/astroLogic";
import { createReverb, bufferToWave } from "@/utils/audioUtils";

// -----------------------------------------------------------------------------
// Chart.js Registration
// -----------------------------------------------------------------------------
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------
export default function Home() {
  // --- UI Steps State ---
  // Step 1: Input -> Step 2: Sound Check -> Step 3: Mic Input -> Step 4: Final Result
  const [currentStep, setCurrentStep] = useState(1);

  // --- Data State ---
  const [name, setName] = useState("たなかたろう");
  const [birthDate, setBirthDate] = useState("1985-09-22");

  const [sanmeigakuResult, setSanmeigakuResult] = useState<{ myKan: string; myElement: string; guardianElement: string } | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [generatedBuffer, setGeneratedBuffer] = useState<AudioBuffer | null>(null);

  // Mic State
  const [isRecording, setIsRecording] = useState(false);
  const [micStream, setMicStream] = useState<MediaStream | null>(null);
  const [voiceAnalyzer, setVoiceAnalyzer] = useState<AnalyserNode | null>(null);

  // Final Result State
  const [voicePitch, setVoicePitch] = useState(0);
  const [voiceComment, setVoiceComment] = useState("");
  const [radarData, setRadarData] = useState<any>(null);

  // Refs
  const visualizerCanvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>();

  // UseEffect for cleanup
  useEffect(() => {
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (micStream) micStream.getTracks().forEach(track => track.stop());
      if (audioContext && audioContext.state !== 'closed') audioContext.close();
    };
  }, []);

  // ---------------------------------------------------------------------------
  // Step 1: Run Analysis (Sanmeigaku)
  // ---------------------------------------------------------------------------
  const handleAnalyzeDate = () => {
    if (!name || !birthDate) return;
    const result = calculateSanmeigaku(birthDate);
    setSanmeigakuResult(result);
    setCurrentStep(2);
  };

  // ---------------------------------------------------------------------------
  // Audio Logic: Play Guardian Sound
  // ---------------------------------------------------------------------------
  const initAudioContext = () => {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    setAudioContext(ctx);
    return ctx;
  };

  const playToneNodes = (ctx: AudioContext | OfflineAudioContext, dest: AudioNode, t: number, nameStr: string, guardianElement: string) => {
    const master = ctx.createGain();
    master.gain.setValueAtTime(0.5, t);

    const conv = ctx.createConvolver();
    conv.buffer = createReverb(ctx);

    master.connect(conv);
    conv.connect(dest);

    // If real-time context, connect to analyser for visualization
    if (ctx instanceof AudioContext && analyser) {
      conv.connect(analyser);
    }

    // Name Frequencies
    nameStr.split('').forEach((c) => {
      if (charMap[c]) {
        const osc = ctx.createOscillator();
        osc.frequency.value = charMap[c];
        const g = ctx.createGain();
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.1, t + 0.1);
        g.gain.exponentialRampToValueAtTime(0.001, t + 3);

        osc.connect(g);
        g.connect(master);
        osc.start(t);
        osc.stop(t + 3.5);
      }
    });

    // Guardian Frequency
    const gOsc = ctx.createOscillator();
    gOsc.frequency.value = (elementFreqs[guardianElement] || 440) / 2;
    if (guardianElement === "火") gOsc.type = "triangle";

    const gG = ctx.createGain();
    gG.gain.setValueAtTime(0, t);
    gG.gain.linearRampToValueAtTime(0.15, t + 0.5);
    gG.gain.exponentialRampToValueAtTime(0.001, t + 4);

    gOsc.connect(gG);
    gG.connect(master);
    gOsc.start(t);
    gOsc.stop(t + 4.5);
  };

  const handlePlaySound = async () => {
    if (!sanmeigakuResult) return;

    let ctx = audioContext;
    if (!ctx || ctx.state === 'closed') {
      ctx = initAudioContext();
    }
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }

    // Setup Analyser for visualizer if not exists
    let currentAnalyser = analyser;
    if (!currentAnalyser) {
      currentAnalyser = ctx.createAnalyser();
      currentAnalyser.fftSize = 2048;
      setAnalyser(currentAnalyser);
    }

    setIsPlaying(true);

    // Generate and Play (Realtime)
    playToneNodes(ctx, ctx.destination, ctx.currentTime, name, sanmeigakuResult.guardianElement);

    // Start Visualizer
    drawVisualizer(currentAnalyser);

    // Generate Offline for Download
    const offlineCtx = new OfflineAudioContext(2, 44100 * 5, 44100);
    playToneNodes(offlineCtx, offlineCtx.destination, 0, name, sanmeigakuResult.guardianElement);
    const renderedBuffer = await offlineCtx.startRendering();
    setGeneratedBuffer(renderedBuffer);

    // Stop playing state after 5 seconds
    setTimeout(() => {
      setIsPlaying(false);
      // Ensure we can move to next step
      // Wait a bit for user to enjoy the sound, but button is available
    }, 5000);
  };

  const moveToStep3 = () => {
    // Stop visualizer loop
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    setCurrentStep(3);
  };

  // ---------------------------------------------------------------------------
  // Visualizer Logic
  // ---------------------------------------------------------------------------
  const drawVisualizer = (analyserNode: AnalyserNode | null) => {
    if (!analyserNode || !visualizerCanvasRef.current) return;

    const canvas = visualizerCanvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bufferLength = analyserNode.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      requestRef.current = requestAnimationFrame(draw);
      analyserNode.getByteTimeDomainData(dataArray);

      ctx.fillStyle = "rgba(5, 5, 8, 0.2)"; // Fade effect
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.lineWidth = 2;
      ctx.strokeStyle = "#bfa5ff";
      ctx.beginPath();

      const sliceWidth = canvas.width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = v * canvas.height / 2;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);

        x += sliceWidth;
      }

      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
    };

    draw();
  };

  // ---------------------------------------------------------------------------
  // Step 3: Mic Logic
  // ---------------------------------------------------------------------------
  const handleStartMic = async () => {
    try {
      let ctx = audioContext;
      if (!ctx || ctx.state === 'closed') {
        ctx = initAudioContext();
      }
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicStream(stream);

      const source = ctx.createMediaStreamSource(stream);
      const newAnalyser = ctx.createAnalyser();
      newAnalyser.fftSize = 2048;
      source.connect(newAnalyser);
      setVoiceAnalyzer(newAnalyser);
      setAnalyser(newAnalyser); // For visualizer to use

      setIsRecording(true);
      drawVisualizer(newAnalyser);

    } catch (e: any) {
      alert("マイクエラー: " + e.message);
    }
  };

  const handleStopMic = () => {
    if (!voiceAnalyzer || !audioContext) return;
    setIsRecording(false);
    if (requestRef.current) cancelAnimationFrame(requestRef.current);

    // Analyze Pitch
    const bufferLength = voiceAnalyzer.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    voiceAnalyzer.getByteFrequencyData(dataArray);

    let maxVal = -1;
    let maxIndex = -1;
    for (let i = 0; i < bufferLength; i++) {
      if (dataArray[i] > maxVal) {
        maxVal = dataArray[i];
        maxIndex = i;
      }
    }

    const pitch = Math.round(maxIndex * (audioContext.sampleRate / 2048));
    setVoicePitch(pitch);

    // Generate Comment
    let comment = "";
    if (pitch > 0 && pitch < 150) {
      comment = "深く落ち着いた、大地のような響き（土のエネルギー）。安定感があり、信頼を集める周波数です。";
    } else if (pitch < 300) {
      comment = "温かみのある、水のような流動性を持つ響き。柔軟性と適応力を感じる周波数です。";
    } else if (pitch < 500) {
      comment = "力強く、木々が伸びるような生命力を感じる響き。成長と発展を促す周波数です。";
    } else if (pitch >= 500) {
      comment = "高く澄んだ、火や金のような鋭い響き。直感力と決断力を高める周波数です。";
    } else {
      comment = "音声が十分に検出されませんでした。もう一度試してみてください。";
    }
    setVoiceComment(comment);

    // Prepare Radar Data
    prepareRadarData(pitch);

    // Cleanup Mic
    if (micStream) {
      micStream.getTracks().forEach(track => track.stop());
      setMicStream(null);
    }

    setCurrentStep(4);
  };

  const prepareRadarData = (pitch: number) => {
    // Helper to generate randomish data
    const generateRandomData = (seedFreq: number) => {
      const base = Math.min(80, Math.max(30, seedFreq / 8));
      return [
        Math.min(100, Math.max(10, base + Math.random() * 40 - 20)),
        Math.min(100, Math.max(10, base + Math.random() * 40 - 20)),
        Math.min(100, Math.max(10, base + Math.random() * 40 - 20)),
        Math.min(100, Math.max(10, base + Math.random() * 40 - 20)),
        Math.min(100, Math.max(10, base + Math.random() * 40 - 20))
      ];
    };

    let nameFreqSum = 0;
    let validCharCount = 0;
    name.split('').forEach(c => {
      if (charMap[c]) {
        nameFreqSum += charMap[c];
        validCharCount++;
      }
    });
    const nameAvg = (validCharCount > 0) ? nameFreqSum / validCharCount : 440;

    const data = {
      labels: ['木 (成長)', '火 (情熱)', '土 (安定)', '金 (収穫)', '水 (知性)'],
      datasets: [{
        label: '名前の響き',
        data: generateRandomData(nameAvg),
        backgroundColor: 'rgba(191, 165, 255, 0.2)',
        borderColor: 'rgba(191, 165, 255, 1)',
        borderWidth: 2,
        pointBackgroundColor: '#fff',
      }, {
        label: '今の声の状態',
        data: generateRandomData(pitch > 0 ? pitch : 440),
        backgroundColor: 'rgba(56, 239, 125, 0.2)',
        borderColor: 'rgba(56, 239, 125, 1)',
        borderWidth: 2,
        pointBackgroundColor: '#fff',
      }]
    };
    setRadarData(data);
  };

  // ---------------------------------------------------------------------------
  // Download Logic
  // ---------------------------------------------------------------------------
  const handleDownload = () => {
    if (!generatedBuffer) return;
    const wav = bufferToWave(generatedBuffer, generatedBuffer.length);
    const blob = new Blob([wav], { type: "audio/wav" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "astro_resonance_omamori.wav";
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetAll = () => {
    setCurrentStep(1);
    setSanmeigakuResult(null);
    setVoicePitch(0);
    setGeneratedBuffer(null);
  };


  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 relative overflow-hidden bg-zen-black text-white">
      {/* Background */}
      <div className="absolute inset-0 bg-mystic-glow pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyber-primary to-transparent opacity-50" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="z-10 text-center mb-6"
      >
        <h1 className="text-3xl md:text-5xl font-bold text-cyber-primary glow-text mb-2 tracking-widest">
          Astro-Resonance v4
        </h1>
        <p className="text-zen-dim text-xs tracking-[0.3em] uppercase">
          Tuning your Fate via Physics
        </p>
      </motion.div>

      {/* Main Panel */}
      <div className="glass-panel w-full max-w-2xl rounded-2xl p-6 md:p-8 z-10 relative min-h-[500px] flex flex-col">

        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-white/10 rounded-t-2xl overflow-hidden">
          <motion.div
            className="h-full bg-cyber-primary shadow-[0_0_10px_#bfa5ff]"
            animate={{ width: `${(currentStep / 4) * 100}%` }}
          />
        </div>

        {/* Step 1: Input */}
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex-1 flex flex-col justify-center"
            >
              <div className="mb-6 bg-white/5 p-4 rounded-lg border-l-4 border-cyber-primary">
                <h3 className="text-cyber-primary font-bold mb-2 flex items-center gap-2">
                  <Activity size={18} /> CONCEPT
                </h3>
                <p className="text-sm text-zen-dim leading-relaxed">
                  本システムは、算命学（時間）と音響工学（空間）を統合した運命調整装置です。
                  あなたの「名前」と「生年月日」から固有の周波数を算出し、エネルギーの欠損を補完します。
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-zen-dim mb-1 tracking-wider">NAME (Hiragana)</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="たなか たろう"
                    className="w-full bg-zen-dark border border-white/10 rounded-lg p-3 text-white focus:border-cyber-primary focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zen-dim mb-1 tracking-wider">BIRTH DATE</label>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full bg-zen-dark border border-white/10 rounded-lg p-3 text-white focus:border-cyber-primary focus:outline-none transition-colors"
                  />
                </div>
                <button
                  onClick={handleAnalyzeDate}
                  className="w-full bg-gradient-to-r from-violet-600 to-cyber-primary text-zen-black font-bold py-4 rounded-lg hover:opacity-90 transition-transform active:scale-95 flex items-center justify-center gap-2"
                >
                  <Sparkles size={20} /> ANALYZE FATE
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Sound Check */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col"
            >
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Brain className="text-cyber-primary" /> ANALYSIS REPORT
              </h2>

              {sanmeigakuResult && (
                <div className="bg-zen-dark/50 p-4 rounded-lg border border-white/10 mb-6 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-zen-dim">SOUL ELEMENT</p>
                    <p className="text-2xl font-bold text-white">{sanmeigakuResult.myElement}</p>
                  </div>
                  <div>
                    <p className="text-xs text-zen-dim">GUARDIAN TYPE</p>
                    <p className="text-2xl font-bold text-cyber-success">{sanmeigakuResult.guardianElement}</p>
                  </div>
                </div>
              )}

              <div className="bg-black/40 rounded-lg p-4 mb-4 border border-white/5 flex-1 flex flex-col items-center justify-center relative overflow-hidden">
                <canvas
                  ref={visualizerCanvasRef}
                  width={500}
                  height={200}
                  className="w-full h-full absolute inset-0 z-0 opacity-70"
                />
                <div className="z-10 text-center">
                  <p className="text-xs text-zen-dim mb-2 uppercase tracking-widest">Guardian Sound Frequency</p>
                  <button
                    onClick={handlePlaySound}
                    disabled={isPlaying}
                    className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${isPlaying ? "bg-zen-panel border border-cyber-primary animate-pulse" : "bg-cyber-primary hover:scale-110 text-zen-black"}`}
                  >
                    {isPlaying ? <Activity size={32} /> : <Play size={32} className="ml-1" />}
                  </button>
                </div>
              </div>

              <p className="text-center text-xs text-zen-dim mb-4">
                Confirm the resonance of the guardian sound before proceeding.
              </p>

              <button
                onClick={moveToStep3}
                disabled={isPlaying && !generatedBuffer} // enable if generated
                className="w-full bg-zen-panel border border-white/20 hover:bg-white/10 text-white py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                PROCEED TO MIC CHECK
              </button>
            </motion.div>
          )}

          {/* Step 3: Mic Input */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col"
            >
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold mb-2">VOICE SYNCHRONIZATION</h2>
                <p className="text-sm text-zen-dim">
                  Speak your wish or name into the microphone to synchronize with the guardian sound.
                </p>
              </div>

              <div className="bg-black/40 rounded-lg p-4 mb-6 border-2 border-cyber-mic/30 flex-1 flex flex-col items-center justify-center relative overflow-hidden min-h-[200px]">
                <canvas
                  ref={visualizerCanvasRef}
                  width={500}
                  height={200}
                  className="w-full h-full absolute inset-0 z-0 opacity-70"
                />
                <div className="z-10 text-center">
                  {!isRecording ? (
                    <button
                      onClick={handleStartMic}
                      className="w-20 h-20 bg-cyber-mic rounded-full flex items-center justify-center shadow-[0_0_20px_#e91e63] hover:scale-105 transition-transform"
                    >
                      <Mic size={40} className="text-white" />
                    </button>
                  ) : (
                    <button
                      onClick={handleStopMic}
                      className="w-20 h-20 bg-white text-cyber-mic rounded-full flex items-center justify-center shadow-[0_0_20px_white] hover:scale-95 transition-transform animate-pulse"
                    >
                      <Square size={32} fill="currentColor" />
                    </button>
                  )}

                  <p className="mt-4 text-cyber-mic font-bold tracking-widest">
                    {isRecording ? "RECORDING..." : "TAP TO RECORD"}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Result */}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-1 flex flex-col"
            >
              <div className="text-center mb-4">
                <h2 className="text-2xl font-bold text-cyber-success mb-1">RESONANCE COMPLETE</h2>
                <p className="text-xs text-zen-dim tracking-widest">HARMONY ESTABLISHED</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* Radar Chart */}
                <div className="bg-white/5 rounded-lg p-2 min-h-[200px] flex items-center justify-center relative">
                  {radarData && (
                    <Radar
                      data={radarData}
                      options={{
                        scales: {
                          r: {
                            angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
                            grid: { color: 'rgba(255, 255, 255, 0.1)' },
                            pointLabels: { color: '#888', font: { size: 10 } },
                            ticks: { display: false }
                          }
                        },
                        plugins: { legend: { display: false } }, // Custom legend used
                        maintainAspectRatio: false,
                      }}
                    />
                  )}
                </div>

                {/* Stats & Comment */}
                <div className="flex flex-col justify-center space-y-4">
                  <div className="bg-cyber-primary/10 border border-cyber-primary/30 p-3 rounded-lg">
                    <p className="text-[10px] text-cyber-primary mb-1">VOICE FREQUENCY</p>
                    <p className="text-2xl font-bold">{voicePitch} Hz</p>
                  </div>
                  <div className="text-xs text-gray-300 leading-relaxed bg-black/20 p-3 rounded-lg border border-white/5">
                    {voiceComment}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-auto">
                <button
                  onClick={handleDownload}
                  className="flex-1 bg-cyber-success text-zen-black font-bold py-3 rounded-lg hover:opacity-90 flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(56,239,125,0.4)]"
                >
                  <Download size={18} /> SAVE OMAMORI (.WAV)
                </button>
                <button
                  onClick={resetAll}
                  className="w-12 bg-zen-dark border border-white/10 rounded-lg flex items-center justify-center hover:bg-white/10"
                >
                  <RotateCcw size={18} className="text-zen-dim" />
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

      </div>

      <footer className="absolute bottom-4 text-zen-dim text-[10px] opacity-30 mt-8">
        Astro-Resonance System v4.2.0 Next.js Port
      </footer>
    </main>
  );
}

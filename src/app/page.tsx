"use client";
import React, { useState, useRef, useEffect, Suspense } from "react"; // Suspenseを追加
import { useSearchParams } from 'next/navigation'; // ★追加: URLパラメータを受け取るためのフック

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
import Link from 'next/link';
import StaggeredText, { StaggerItem } from '@/components/StaggeredText';

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

// ★メインコンポーネントをSuspenseでラップするための親コンポーネント
export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Home />
    </Suspense>
  );
}

// ★中身のロジック（Home）
function Home() {
  const searchParams = useSearchParams(); // ★URLのパラメータを取得する

  // --- UI Steps State ---
  const [isStep2Visible, setIsStep2Visible] = useState(false);
  const [isStep3Visible, setIsStep3Visible] = useState(false);
  const [isStep4Visible, setIsStep4Visible] = useState(false);

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
  const micVisualizerCanvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);

  // UseEffect for cleanup
  useEffect(() => {
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (micStream) micStream.getTracks().forEach(track => track.stop());
      if (audioContext && audioContext.state !== 'closed') audioContext.close();
    };
  }, []);

  // ★追加機能: URLパラメータがあったら自動で解析する
  useEffect(() => {
    // URLからデータを取得 (?dob=19950808&name=...)
    const dobParam = searchParams.get('dob');
    const nameParam = searchParams.get('name');

    if (dobParam && dobParam.length === 8) {
      // 1. 日付のフォーマット変換 (19950808 -> 1995-08-08)
      const y = dobParam.substring(0, 4);
      const m = dobParam.substring(4, 6);
      const d = dobParam.substring(6, 8);
      const formattedDate = `${y}-${m}-${d}`;

      // 2. フォームに入力
      setBirthDate(formattedDate);
      if (nameParam) setName(nameParam);

      // 3. 自動で解析を実行して Step 2 を開く
      // (Reactのstate更新は非同期なので、変数を直接渡して計算します)
      const result = calculateSanmeigaku(formattedDate);
      setSanmeigakuResult(result);
      setIsStep2Visible(true);
      
      console.log("連携データ受信完了: 自動解析を実行しました");
    }
  }, [searchParams]);

  // ---------------------------------------------------------------------------
  // Step 1: Run Analysis (Sanmeigaku)
  // ---------------------------------------------------------------------------
  const handleAnalyzeDate = () => {
    if (!name || !birthDate) {
      alert("入力してください");
      return;
    }
    const result = calculateSanmeigaku(birthDate);
    setSanmeigakuResult(result);
    setIsStep2Visible(true);
    // In original HTML, Step 3 and 4 are hidden if they were open? 
    // The original didn't reset, but logically in React we might want to if re-analyzing.
    // For faithful reproduction of "runAnalysis()", it just shows step2.
    // It implies we might want to reset subsequent steps if user changes input?
    setIsStep3Visible(false);
    setIsStep4Visible(false);
  };

  // ---------------------------------------------------------------------------
  // Audio Logic
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

    // Dry path (Direct sound)
    master.connect(dest);

    // Wet path (Reverb)
    master.connect(conv);
    conv.connect(dest);

    // If real-time context, connect to analyser for visualization
    if (ctx instanceof AudioContext && analyser) {
      master.connect(analyser); // Visualize dry signal for clarity
    }

    // Name Frequencies
    nameStr.split('').forEach((c) => {
      if (charMap[c]) {
        const osc = ctx.createOscillator();
        osc.frequency.value = charMap[c];
        const g = ctx.createGain();
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.3, t + 0.1);
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
    gG.gain.linearRampToValueAtTime(0.4, t + 0.5);
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

    // Setup Analyser
    let currentAnalyser = analyser;
    if (!currentAnalyser) {
      currentAnalyser = ctx.createAnalyser();
      currentAnalyser.fftSize = 2048;
      setAnalyser(currentAnalyser);
    }

    setIsPlaying(true);

    // Generate and Play (Realtime)
    playToneNodes(ctx, ctx.destination, ctx.currentTime, name, sanmeigakuResult.guardianElement);

    // Start Visualizer logic (targeting the Step 2 canvas)
    drawVisualizer(currentAnalyser, visualizerCanvasRef);

    // Generate Offline for Download
    const offlineCtx = new OfflineAudioContext(2, 44100 * 5, 44100);
    playToneNodes(offlineCtx, offlineCtx.destination, 0, name, sanmeigakuResult.guardianElement);
    const renderedBuffer = await offlineCtx.startRendering();
    setGeneratedBuffer(renderedBuffer);

    // Timeout to reveal Step 3 as per index.html
    setTimeout(() => {
      setIsPlaying(false);
      setIsStep3Visible(true);
    }, 4000); // index.html uses 4000
  };

  // ---------------------------------------------------------------------------
  // Visualizer Logic
  // ---------------------------------------------------------------------------
  const drawVisualizer = (analyserNode: AnalyserNode | null, canvasRef: React.RefObject<HTMLCanvasElement | null>) => {
    if (!analyserNode || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bufferLength = analyserNode.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      requestRef.current = requestAnimationFrame(draw);
      analyserNode.getByteTimeDomainData(dataArray);

      ctx.fillStyle = "#000";
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
      setAnalyser(newAnalyser); // Global analyser pointer if needed

      setIsRecording(true);
      // index.html uses same #visualizer logic, but in React we might need to target the canvas in Step 3?
      // index.html reuses #visualizer id for Step 2? No, id is unique. 
      // ERROR in index.html: <canvas id="visualizer"></canvas> is in Step 2.
      // Step 3 has no canvas in the provided HTML snippet.
      // "visualizer" is only in Step 2.
      // Yet startMic() calls drawVisualizer() which targets "visualizer".
      // So when Mic is running, the canvas in Step 2 (if visible) shows the mic input?
      // YES. In index.html, step2 is NOT hidden when step3 is shown.
      // So the user looks at the canvas in Step 2 while recording in Step 3.
      // I will replicate this behavior: Target the SINGLE visualizer canvas in Step 2.
      // But wait, Step 3 is below Step 2.

      drawVisualizer(newAnalyser, visualizerCanvasRef);

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
    if (pitch < 150) {
      comment = "深く落ち着いた、大地のような響き（土のエネルギー）。<br>安定感があり、信頼を集める周波数です。";
    } else if (pitch < 300) {
      comment = "温かみのある、水のような流動性を持つ響き。<br>柔軟性と適応力を感じる周波数です。";
    } else if (pitch < 500) {
      comment = "力強く、木々が伸びるような生命力を感じる響き。<br>成長と発展を促す周波数です。";
    } else {
      comment = "高く澄んだ、火や金のような鋭い響き。<br>直感力と決断力を高める周波数です。";
    }
    if (maxVal < 10) {
      setVoicePitch(0);
      comment = "音声が検出されませんでした。";
    }

    setVoiceComment(comment);

    // Prepare Radar Data
    prepareRadarData(pitch);

    // Cleanup Mic
    if (micStream) {
      micStream.getTracks().forEach(track => track.stop());
      setMicStream(null);
    }

    // In index.html: step3.display="none", step4.display="block"
    setIsStep3Visible(false);
    setIsStep4Visible(true);
  };

  const prepareRadarData = (pitch: number) => {
    // Helper
    const generateRandomData = (seedFreq: number) => {
      const base = Math.min(100, Math.max(20, seedFreq / 10));
      return [
        base + Math.random() * 30 - 15, base + Math.random() * 30 - 15,
        base + Math.random() * 30 - 15, base + Math.random() * 30 - 15,
        base + Math.random() * 30 - 15
      ];
    };

    let nameFreqSum = 0;
    let valid = 0;
    name.split('').forEach(c => {
      if (charMap[c]) { nameFreqSum += charMap[c]; valid++; }
      else { nameFreqSum += 440; valid++; } // simplistic fallback for unknown chars in strict reproduction
    });
    const nameAvg = valid > 0 ? nameFreqSum / valid : 440;

    // index.html chart code
    const data = {
      labels: ['木 (成長)', '火 (情熱)', '土 (安定)', '金 (収穫)', '水 (知性)'],
      datasets: [{
        label: '名前の響き',
        data: generateRandomData(nameAvg),
        backgroundColor: 'rgba(191, 165, 255, 0.2)',
        borderColor: 'rgba(191, 165, 255, 1)',
        borderWidth: 2
      }, {
        label: '今の声の状態',
        data: generateRandomData(pitch),
        backgroundColor: 'rgba(233, 30, 99, 0.2)',
        borderColor: 'rgba(233, 30, 99, 1)',
        borderWidth: 2
      }]
    };
    setRadarData(data);
  };

  const handleDownload = () => {
    if (!generatedBuffer) return;
    const wav = bufferToWave(generatedBuffer, generatedBuffer.length);
    const url = URL.createObjectURL(new Blob([wav], { type: "audio/wav" }));
    const a = document.createElement("a"); a.href = url; a.download = "astro_resonance.wav"; a.click();
  };


  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <main>
      {/* We keep Main tag but content structure mimics index.html body */}

      {/* Header content directly here as per index.html */}
      <h1>Astro-Resonance</h1>
      <div className="subtitle">運命の周波数チューニング</div>

      <div className="concept-box">
        <p>
          本システムは、算命学を用いて<span className="concept-strong">『運命の時間』</span>を計算し、
          カタカムナの物理学で<span className="concept-strong">『空間の周波数』</span>を調整します。<br /><br />
          中華の統計学（時間）と、和の音響学（空間）を、
          最新の数学（フーリエ解析）によって融合させた、世界初の運命調整アルゴリズムです。<br /><br />
          あなたの「声」に含まれる周波数成分を解析し、不足しているエネルギーを音で補うことで、
          運命のバランスを最適化します。
        </p>
      </div>

      <div className="container">
        {/* Step 1 */}
        <StaggeredText className="container">
          <div id="step1">
            <StaggerItem>
              <div className="form-group">
                <label>お名前（ひらがな）</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="あかさ"
                />
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="form-group">
                <label>生年月日</label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                />
              </div>
            </StaggerItem>
            <StaggerItem>
              <button className="btn-primary" onClick={handleAnalyzeDate}>1. 運命を解析する</button>
            </StaggerItem>
          </div>
        </StaggeredText>

        {/* Step 2 */}
        {isStep2Visible && (
          <div id="step2" className="step-area" style={{ display: 'block', animation: 'fadeIn 0.8s ease' }}>
            {sanmeigakuResult && (
              <div className="report-box">
                <div style={{ fontSize: '0.8rem', color: '#aaa' }}>算命学解析結果</div>
                <div>
                  魂の属性: <span className="highlight">{sanmeigakuResult.myElement}</span> /
                  守護タイプ: <span className="highlight">{sanmeigakuResult.guardianElement}</span>
                </div>
              </div>
            )}
            <p style={{ fontSize: '0.9rem', color: '#ccc', textAlign: 'center' }}>
              あなたのエネルギー不足を補う「守護神サウンド」を生成しました。<br />
              まずは音を聴いて、波動を確認してください。
            </p>
            <button
              className="btn-success"
              onClick={handlePlaySound}
              disabled={isPlaying}
            >
              {isPlaying ? "♪ 再生中..." : "2. 守護音を再生して確認"}
            </button>
            <canvas ref={visualizerCanvasRef} id="visualizer"></canvas>
          </div>
        )}

        {/* Step 3 */}
        {isStep3Visible && (
          <div id="step3" className="step-area" style={{ display: 'block', animation: 'fadeIn 0.8s ease' }}>
            <div className="report-box" style={{ borderLeftColor: '#e91e63' }}>
              <div style={{ fontSize: '0.8rem', color: '#aaa' }}>チューニングの最終工程</div>
              <div style={{ fontWeight: 'bold', marginTop: '5px' }}>
                守護神サウンドに合わせて、あなたの「声」を入力してください。<br />
                音のズレを解析し、統合します。
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn-mic" onClick={handleStartMic} disabled={isRecording}>
                {isRecording ? "録音中..." : "3. 声を入力 (録音開始)"}
              </button>
              <button className="btn-stop" onClick={handleStopMic} disabled={!isRecording}>停止＆解析</button>
            </div>
          </div>
        )}

        {/* Step 4 */}
        {isStep4Visible && (
          <div id="step4" className="step-area" style={{ display: 'block', animation: 'fadeIn 0.8s ease' }}>
            <div className="voice-analysis-box">
              <div className="gratitude">✨ 声を届けてくれてありがとう ✨</div>
              <div style={{ fontSize: '0.9rem', color: '#ccc' }}>あなたの声のフーリエ解析結果</div>
              <div className="voice-data">
                {voicePitch > 0 ? `${voicePitch} Hz` : "Analyzing..."}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#fff' }} dangerouslySetInnerHTML={{ __html: voiceComment }}></div>
            </div>

            <div style={{ textAlign: 'center', color: '#38ef7d', fontWeight: 'bold', margin: '20px 0' }}>
              ▼ あなたの声と、守護神の音が共鳴しました ▼
            </div>

            <div style={{ position: 'relative', height: '300px', width: '100%', marginBottom: '20px' }}>
              {radarData && (
                <Radar
                  data={radarData}
                  options={{
                    scales: {
                      r: {
                        angleLines: { color: 'rgba(255, 255, 255, 0.2)' },
                        grid: { color: 'rgba(255, 255, 255, 0.2)' },
                        pointLabels: { color: '#ccc', font: { size: 12 } },
                        suggestedMin: 0, suggestedMax: 100
                      }
                    },
                    plugins: { legend: { labels: { color: '#fff' } } },
                    maintainAspectRatio: false
                  }}
                />
              )}
            </div>

            <button className="btn-download" onClick={handleDownload}>
              ↓ 完成した「共鳴お守り」を保存 (.wav)
            </button>
          </div>
        )}

      </div>

    </main>
  );
}

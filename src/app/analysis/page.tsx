import Link from 'next/link';
import BreathingButton from '@/components/BreathingButton';
import StaggeredText, { StaggerItem } from '@/components/StaggeredText';

export default function AnalysisPage() {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <header className="w-full">
                <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="h-9 w-9 rounded-full border border-yellow-400/60 flex items-center justify-center text-xs tracking-widest">
                            波
                        </div>
                        <div className="flex flex-col leading-tight">
                            <span className="font-semibold tracking-[0.18em] text-xs uppercase text-yellow-300/90">
                                Shinra Bansho
                            </span>
                            <span className="font-semibold text-slate-50 text-lg">
                                神羅万象 Fourier
                            </span>
                        </div>
                    </Link>

                    <nav className="hidden md:flex items-center gap-8 text-sm">
                        <Link href="/#about" className="hover:text-yellow-300 transition-colors">About</Link>
                        <Link href="/#how" className="hover:text-yellow-300 transition-colors">How it works</Link>
                    </nav>
                </div>
            </header>

            {/* Main */}
            <main className="flex-1">
                <section className="mx-auto max-w-6xl px-4 pt-10 pb-16 md:pt-12 md:pb-24">
                    <StaggeredText>
                        <StaggerItem>
                            <p className="text-xs tracking-[0.35em] uppercase text-yellow-200/80 mb-3">
                                Step 3 / Fourier Analysis Result
                            </p>
                        </StaggerItem>

                        <StaggerItem>
                            <h1 className="text-2xl md:text-3xl font-semibold mb-3">
                                フーリエ変換が完了しました。<br className="hidden md:inline" />
                                あなたの「人生の周波数」を可視化します。
                            </h1>
                        </StaggerItem>

                        <StaggerItem>
                            <p className="text-sm md:text-base text-slate-300/90 mb-10 leading-relaxed max-w-2xl">
                                入力された好調・停滞の波形をフーリエ分解し、
                                繰り返し現れる<strong className="font-semibold text-slate-50">周期（周波数成分）</strong>を抽出しました。
                                ここでは「強い周期」と「合成された人生の波形」を確認できます。
                                <br /><br />
                                ※ 現段階は UI モックのため数値・グラフはダミーです。後で JS で本計算に置き換え可能です。
                            </p>
                        </StaggerItem>

                        {/* Summary */}
                        <StaggerItem>
                            <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-6 md:p-7 shadow-[0_0_40px_rgba(15,23,42,0.9)] mb-10">
                                <h2 className="text-lg font-semibold mb-3 text-slate-50">解析サマリー</h2>
                                <p className="text-sm leading-relaxed text-slate-300">
                                    あなたの人生には、
                                    <span className="text-yellow-300 font-semibold">「約11ヶ月周期」</span> と
                                    <span className="text-indigo-300 font-semibold">「約2.4年周期」</span> の波が特に強く現れています。<br />
                                    これは「短期の調子の波」と「中期のテーマ転換」のリズムとして現れやすい傾向です。
                                </p>
                            </div>
                        </StaggerItem>

                        {/* FFT Spectrum */}
                        <StaggerItem>
                            <h2 className="text-xl font-semibold mb-4">周波数スペクトラム（FFT）</h2>
                        </StaggerItem>

                        <StaggerItem>
                            <div className="rounded-3xl border border-slate-800 bg-slate-950/40 p-6 mb-12">
                                <div className="flex items-center justify-between gap-4 mb-4">
                                    <p className="text-xs text-slate-400">
                                        棒が高いほど、その周期が強く出ています。
                                    </p>
                                    <span className="text-[11px] text-slate-400">（ダミー表示）</span>
                                </div>

                                <div className="w-full flex justify-center">
                                    <svg viewBox="0 0 640 260" className="w-full max-w-4xl" aria-hidden="true">
                                        {/* Grid */}
                                        <g stroke="rgba(148,163,184,0.25)" strokeWidth="0.5">
                                            <path d="M20 220 H620" />
                                            <path d="M20 180 H620" />
                                            <path d="M20 140 H620" />
                                            <path d="M20 100 H620" />
                                            <path d="M20 60 H620" />
                                            <path d="M20 20 H620" />
                                        </g>

                                        {/* Bars (dummy) */}
                                        <rect x="70" y="120" width="50" height="100" fill="#38bdf8" opacity="0.75" />
                                        <rect x="160" y="60" width="50" height="160" fill="#60a5fa" opacity="0.85" />
                                        <rect x="250" y="95" width="50" height="125" fill="#a78bfa" opacity="0.9" />
                                        <rect x="340" y="40" width="50" height="180" fill="#f472b6" opacity="0.85" />
                                        <rect x="430" y="140" width="50" height="80" fill="#fb7185" opacity="0.75" />
                                        <rect x="520" y="110" width="50" height="110" fill="#fbbf24" opacity="0.8" />

                                        {/* Labels */}
                                        <text x="154" y="52" fill="#60a5fa" fontSize="12">11ヶ月周期</text>
                                        <text x="334" y="32" fill="#f472b6" fontSize="12">2.4年周期</text>

                                        {/* X-axis labels */}
                                        <g fill="rgba(226,232,240,0.75)" fontSize="10">
                                            <text x="70" y="245">短期</text>
                                            <text x="160" y="245">基音</text>
                                            <text x="250" y="245">中期</text>
                                            <text x="340" y="245">主峰</text>
                                            <text x="430" y="245">副峰</text>
                                            <text x="520" y="245">長期</text>
                                        </g>
                                    </svg>
                                </div>
                            </div>
                        </StaggerItem>

                        {/* Synth Wave */}
                        <StaggerItem>
                            <h2 className="text-xl font-semibold mb-4">合成波（あなたの人生の波形）</h2>
                        </StaggerItem>

                        <StaggerItem>
                            <div className="rounded-3xl border border-slate-800 bg-slate-950/40 p-6 mb-12">
                                <div className="flex items-center justify-between gap-4 mb-4">
                                    <p className="text-xs text-slate-400">
                                        抽出された周期を重ね合わせた「人生のうねり」です。
                                    </p>
                                    <span className="text-[11px] text-slate-400">（ダミー表示）</span>
                                </div>

                                <div className="w-full flex justify-center">
                                    <svg viewBox="0 0 640 240" className="w-full max-w-4xl" aria-hidden="true">
                                        {/* Grid */}
                                        <g stroke="rgba(148,163,184,0.20)" strokeWidth="0.4">
                                            <path d="M20 200 H620" />
                                            <path d="M20 160 H620" />
                                            <path d="M20 120 H620" />
                                            <path d="M20 80 H620" />
                                            <path d="M20 40 H620" />
                                        </g>

                                        {/* Wave */}
                                        <polyline
                                            fill="none"
                                            stroke="url(#waveGrad)"
                                            strokeWidth="2.6"
                                            points="
                      20,150 60,120 100,150 140,85 180,120 220,75 260,115 300,65
                      340,100 380,75 420,120 460,150 500,135 540,170 580,160 620,180
                    "
                                        />

                                        {/* "Now" marker */}
                                        <line x1="260" y1="35" x2="260" y2="205" stroke="rgba(226,232,240,0.9)" strokeWidth="1.2" strokeDasharray="5 5" />
                                        <text x="268" y="50" fill="rgba(226,232,240,0.9)" fontSize="11">現在</text>

                                        <defs>
                                            <linearGradient id="waveGrad" x1="0" x2="1" y1="0" y2="0">
                                                <stop offset="0%" stopColor="#7dd3fc" />
                                                <stop offset="50%" stopColor="#c4b5fd" />
                                                <stop offset="100%" stopColor="#fb7185" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                </div>

                                <p className="mt-4 text-sm text-slate-300/90">
                                    ● 現在の位置：波の「中腹」
                                    → 次の上昇ピークは <span className="text-yellow-300 font-semibold">約14日後</span> に到来します（ダミー）。
                                </p>
                            </div>
                        </StaggerItem>

                        {/* Resonance with cosmic cycles */}
                        <StaggerItem>
                            <h2 className="text-xl font-semibold mb-4">宇宙周期との共鳴度</h2>
                        </StaggerItem>

                        <StaggerItem>
                            <div className="rounded-3xl border border-slate-800 bg-slate-950/40 p-6 mb-12">
                                <StaggeredText delay={0.5} className="space-y-2 text-sm text-slate-300">
                                    <StaggerItem><li>🌕 木星周期（約12年）との共鳴：<span className="text-yellow-300 font-semibold">83%</span></li></StaggerItem>
                                    <StaggerItem><li>🪐 土星周期（約29.5年）との共鳴：<span className="text-indigo-300 font-semibold">35%</span></li></StaggerItem>
                                    <StaggerItem><li>💫 金星逆行サイクルとの共鳴：<span className="text-pink-300 font-semibold">57%</span></li></StaggerItem>
                                </StaggeredText>

                                <p className="mt-3 text-xs text-slate-400 leading-relaxed">
                                    ※ 実装版では、あなたの波形周期と天体周期の相関を計算して共鳴度を出します。
                                </p>
                            </div>
                        </StaggerItem>

                        {/* Yin-Yang balance */}
                        <StaggerItem>
                            <h2 className="text-xl font-semibold mb-4">陰陽バランス</h2>
                        </StaggerItem>

                        <StaggerItem>
                            <div className="rounded-3xl border border-slate-800 bg-slate-950/40 p-6 mb-12">
                                <div className="flex flex-col md:flex-row gap-6 md:items-center">
                                    <div className="w-full md:w-48 mx-auto">
                                        <svg viewBox="0 0 100 100" className="w-full h-auto" aria-hidden="true">
                                            {/* Yang */}
                                            <path d="M50 50 L50 0 A50 50 0 1 1 50 100 Z" fill="#facc15" opacity="0.75"></path>
                                            {/* Yin */}
                                            <path d="M50 50 L50 100 A50 50 0 1 1 50 0 Z" fill="#3b82f6" opacity="0.6"></path>
                                        </svg>
                                    </div>

                                    <div className="flex-1">
                                        <p className="text-sm text-slate-300">
                                            現在のバランス：
                                            <span className="text-yellow-300 font-semibold">陽 62%</span> ／
                                            <span className="text-slate-200 font-semibold">陰 38%</span>
                                        </p>

                                        <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                                            → 動き・挑戦・拡大に適したフェーズ（陽優位）です。
                                            内省よりも “外に出る行動” が波と調和しやすい状態（ダミー）。
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </StaggerItem>

                        {/* Buttons */}
                        <StaggerItem>
                            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                                <BreathingButton
                                    href="/forecast"
                                    className="inline-flex flex-1 items-center justify-center px-6 py-3 rounded-full bg-yellow-300 text-slate-900 text-sm font-semibold shadow-lg shadow-yellow-300/20 hover:bg-yellow-200 transition-colors"
                                >
                                    未来の波を確認する
                                </BreathingButton>

                                <Link
                                    href="/events"
                                    className="inline-flex items-center justify-center px-5 py-3 rounded-full border border-slate-600 text-sm text-slate-200 hover:border-yellow-300/70 hover:text-yellow-200 transition-colors"
                                >
                                    入力に戻る
                                </Link>
                            </div>
                        </StaggerItem>

                    </StaggeredText>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t border-slate-800/80 bg-slate-950/60">
                <div className="mx-auto max-w-6xl px-4 py-5 text-xs text-slate-500">
                    © 2025 神羅万象グリッド Fourier Oracle
                </div>
            </footer>
        </div>
    );
}

import Link from 'next/link';
import BreathingButton from '@/components/BreathingButton';
import StaggeredText, { StaggerItem } from '@/components/StaggeredText';

export default function ForecastPage() {
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
                                Step 4 / Future Wave Forecast
                            </p>
                        </StaggerItem>

                        <StaggerItem>
                            <h1 className="text-2xl md:text-3xl font-semibold mb-3">
                                これから 2 年間の「未来の波形」を見てみましょう。
                            </h1>
                        </StaggerItem>

                        <StaggerItem>
                            <p className="text-sm md:text-base text-slate-300/90 mb-10 leading-relaxed max-w-2xl">
                                抽出された周期を合成して、未来のエネルギーの流れ（波形）を予測します。
                                ここでの目的は「当てる」ことではなく、
                                <span className="text-slate-50 font-semibold">波に合わせて動く・整える</span>
                                ための地図を手に入れることです。
                                <br /><br />
                                ※ 現段階は UI モックのため、波形・日付はダミーです。
                            </p>
                        </StaggerItem>

                        {/* 24 months wave */}
                        <StaggerItem>
                            <div className="rounded-3xl border border-slate-800 bg-slate-950/40 p-6 md:p-7 mb-10 shadow-[0_0_40px_rgba(15,23,42,0.9)]">
                                <div className="flex items-center justify-between gap-4 mb-4">
                                    <h2 className="text-lg font-semibold text-slate-50">
                                        未来 24 ヶ月の合成波
                                    </h2>
                                    <p className="text-[11px] text-slate-400">
                                        金色ゾーン：上昇期 ／ 紫ゾーン：調整期（ダミー）
                                    </p>
                                </div>

                                <div className="w-full flex justify-center">
                                    <svg viewBox="0 0 640 260" className="w-full max-w-4xl" aria-hidden="true">
                                        {/* Grid */}
                                        <g stroke="rgba(148,163,184,0.20)" strokeWidth="0.4">
                                            <path d="M20 220 H620" />
                                            <path d="M20 180 H620" />
                                            <path d="M20 140 H620" />
                                            <path d="M20 100 H620" />
                                            <path d="M20 60 H620" />
                                            <path d="M20 20 H620" />
                                        </g>

                                        {/* 상승(ゴールド) */}
                                        <rect x="80" y="20" width="120" height="200" fill="#facc1528" />
                                        <rect x="380" y="20" width="110" height="200" fill="#facc1528" />

                                        {/* 調整(パープル) */}
                                        <rect x="230" y="20" width="100" height="200" fill="#a855f728" />
                                        <rect x="520" y="20" width="80" height="200" fill="#a855f728" />

                                        {/* Wave */}
                                        <polyline
                                            fill="none"
                                            stroke="url(#futureGrad)"
                                            strokeWidth="2.6"
                                            points="
                      20,150 60,130 100,115 140,85 180,95 220,125 260,170 300,190
                      340,165 380,125 420,85 460,95 500,130 540,160 580,190 620,165
                    "
                                        />

                                        {/* Today marker */}
                                        <line x1="120" y1="20" x2="120" y2="220"
                                            stroke="rgba(226,232,240,0.85)" strokeWidth="1.2" strokeDasharray="5 5" />
                                        <text x="128" y="35" fill="rgba(226,232,240,0.85)" fontSize="11">今日</text>

                                        <defs>
                                            <linearGradient id="futureGrad" x1="0" x2="1" y1="0" y2="0">
                                                <stop offset="0%" stopColor="#7dd3fc" />
                                                <stop offset="50%" stopColor="#c4b5fd" />
                                                <stop offset="100%" stopColor="#fb7185" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                </div>

                                <p className="mt-4 text-xs text-slate-400 leading-relaxed">
                                    ※ ここは後で「入力→FFT→合成→未来予測」の本計算に置き換えられます。
                                </p>
                            </div>
                        </StaggerItem>

                        {/* Cards */}
                        <StaggerItem>
                            <StaggeredText delay={0.3} className="grid gap-6 md:grid-cols-2 mb-10">
                                {/* Boost */}
                                <StaggerItem>
                                    <div className="rounded-2xl border border-yellow-400/50 bg-yellow-400/5 p-5 h-full">
                                        <h3 className="text-sm font-semibold text-yellow-200 mb-1">次の大きな飛躍期（ダミー）</h3>
                                        <p className="text-lg font-semibold text-slate-50 mb-2">
                                            2026年2月 〜 4月頃
                                        </p>
                                        <p className="text-sm text-slate-200 leading-relaxed">
                                            主要周期が重なり、行動が「結果」に結びつきやすい期間。
                                            企画の立ち上げ・契約・拡大・挑戦に向きます。
                                        </p>
                                        <p className="mt-2 text-[11px] text-yellow-200/80">
                                            キーワード：拡大・出会い・社会的な動き
                                        </p>
                                    </div>
                                </StaggerItem>

                                {/* Trough */}
                                <StaggerItem>
                                    <div className="rounded-2xl border border-fuchsia-400/50 bg-fuchsia-500/5 p-5 h-full">
                                        <h3 className="text-sm font-semibold text-fuchsia-200 mb-1">一度立ち止まるタイミング（ダミー）</h3>
                                        <p className="text-lg font-semibold text-slate-50 mb-2">
                                            2025年11月頃
                                        </p>
                                        <p className="text-sm text-slate-200 leading-relaxed">
                                            波が谷に差しかかり、停滞・再調整が起きやすい時期。
                                            無理に進めるより「整理・手放し・土台固め」が最適です。
                                        </p>
                                        <p className="mt-2 text-[11px] text-fuchsia-200/80">
                                            キーワード：調整・手放し・再定義
                                        </p>
                                    </div>
                                </StaggerItem>

                                {/* Small waves */}
                                <StaggerItem>
                                    <div className="rounded-2xl border border-sky-400/50 bg-sky-500/5 p-5 h-full">
                                        <h3 className="text-sm font-semibold text-sky-200 mb-1">小さな波（ダミー）</h3>
                                        <p className="text-lg font-semibold text-slate-50 mb-2">
                                            約3〜4ヶ月ごとのテーマ切替
                                        </p>
                                        <p className="text-sm text-slate-200 leading-relaxed">
                                            大きな上昇・下降とは別に、3〜4ヶ月単位で
                                            「テーマ」「人間関係」「環境」の入れ替わりが起こりやすい傾向。
                                        </p>
                                        <p className="mt-2 text-[11px] text-sky-200/80">
                                            キーワード：微調整・切替・環境変化
                                        </p>
                                    </div>
                                </StaggerItem>

                                {/* Yin-Yang */}
                                <StaggerItem>
                                    <div className="rounded-2xl border border-slate-700/80 bg-slate-900/60 p-5 h-full">
                                        <h3 className="text-sm font-semibold text-slate-100 mb-2">陰陽の流れ（ダミー）</h3>
                                        <p className="text-sm text-slate-200 leading-relaxed">
                                            向こう 2 年は「陽（動く）」が約 7 割、「陰（整える）」が約 3 割。
                                            特に 2026 年前半は陽が強く、外向きの行動と同期しやすいフェーズです。
                                        </p>
                                        <p className="mt-2 text-[11px] text-slate-400">
                                            → この配分を前提に、仕事・学び・人間関係のタイミング設計ができます。
                                        </p>
                                    </div>
                                </StaggerItem>
                            </StaggeredText>
                        </StaggerItem>

                        {/* Action advice */}
                        <StaggerItem>
                            <div className="rounded-3xl border border-slate-800 bg-slate-950/50 p-6 md:p-7 mb-10">
                                <h2 className="text-lg font-semibold mb-3 text-slate-50">
                                    波に乗るための行動アドバイス（ダミー）
                                </h2>
                                <ul className="space-y-2 text-sm text-slate-200 leading-relaxed">
                                    <li>・上昇期（例：2026年2〜4月）は、<span className="text-yellow-300 font-semibold">発信・出会い・契約</span>を増やす。</li>
                                    <li>・谷の時期（例：2025年11月頃）は、<span className="text-fuchsia-300 font-semibold">整理・手放し・メンテ</span>に集中する。</li>
                                    <li>・小波（3〜4ヶ月周期）は「テーマの切替」の合図として活用する。</li>
                                    <li>・大きな決断は、可能なら「上昇波が立ち上がる直前〜ピーク」に合わせる。</li>
                                </ul>
                            </div>
                        </StaggerItem>

                        {/* Buttons */}
                        <StaggerItem>
                            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                                <BreathingButton
                                    href="/compatibility"
                                    className="inline-flex flex-1 items-center justify-center px-6 py-3 rounded-full bg-yellow-300 text-slate-900 text-sm font-semibold shadow-lg shadow-yellow-300/20 hover:bg-yellow-200 transition-colors"
                                >
                                    相性フーリエ診断へ進む
                                </BreathingButton>

                                <Link
                                    href="/analysis"
                                    className="inline-flex items-center justify-center px-5 py-3 rounded-full border border-slate-600 text-sm text-slate-200 hover:border-yellow-300/70 hover:text-yellow-200 transition-colors"
                                >
                                    解析結果に戻る
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

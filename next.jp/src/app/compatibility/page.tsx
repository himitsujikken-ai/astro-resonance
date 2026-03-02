'use client';

import Link from 'next/link';
import BreathingButton from '@/components/BreathingButton';
import StaggeredText, { StaggerItem } from '@/components/StaggeredText';

export default function CompatibilityPage() {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const resultElement = document.getElementById('result');
        if (resultElement) {
            resultElement.scrollIntoView({ behavior: 'smooth' });
        }
    };

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
                                Step 5 / Compatibility Fourier
                            </p>
                        </StaggerItem>

                        <StaggerItem>
                            <h1 className="text-2xl md:text-3xl font-semibold mb-3">
                                2人の「波」を重ねて、相性のフーリエ診断を行います。
                            </h1>
                        </StaggerItem>

                        <StaggerItem>
                            <p className="text-sm md:text-base text-slate-300/90 mb-10 leading-relaxed max-w-2xl">
                                あなたの波形と、相手の波形。
                                フーリエ解析の視点で「共鳴」「補完」「位相差（タイミングのズレ）」を可視化します。
                                <br /><br />
                                ※ 現段階は UI モックのため、スコア・グラフはダミーです。
                            </p>
                        </StaggerItem>

                        {/* Input Card */}
                        <StaggerItem>
                            <div className="rounded-3xl border border-slate-800 bg-slate-950/40 p-6 md:p-7 shadow-[0_0_40px_rgba(15,23,42,0.9)] mb-10">
                                <h2 className="text-lg font-semibold mb-4 text-slate-50">
                                    2人の基本情報
                                </h2>

                                <form className="space-y-6" onSubmit={handleSubmit}>
                                    <div className="grid gap-6 md:grid-cols-2">
                                        {/* You */}
                                        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
                                            <h3 className="text-sm font-semibold text-slate-200 mb-2">あなた</h3>
                                            <p className="text-xs text-slate-300 leading-relaxed">
                                                生年月日：<span className="text-slate-50 font-semibold">（解析済み）</span><br />
                                                基音（ベース周波数）：<span className="text-yellow-300 font-semibold">11ヶ月周期</span>（ダミー）
                                            </p>
                                            <p className="mt-2 text-[11px] text-slate-400">
                                                ※ 将来は start.html の入力を引き継いで表示できます（JSで対応）。
                                            </p>
                                        </div>

                                        {/* Partner */}
                                        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
                                            <h3 className="text-sm font-semibold text-slate-200 mb-3">お相手</h3>

                                            <label htmlFor="partnerBirthdate" className="block text-xs font-medium text-slate-100 mb-1">
                                                生年月日
                                            </label>
                                            <input
                                                id="partnerBirthdate"
                                                type="date"
                                                className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-yellow-300/70 focus:border-yellow-300/70"
                                            />

                                            <label htmlFor="partnerNote" className="block text-xs font-medium text-slate-100 mb-1 mt-3">
                                                関係性のメモ（任意）
                                            </label>
                                            <input
                                                id="partnerNote"
                                                type="text"
                                                placeholder="例：恋人 / 夫婦 / 友人 / 仕事仲間"
                                                className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-yellow-300/70 focus:border-yellow-300/70"
                                            />
                                        </div>
                                    </div>

                                    {/* Buttons */}
                                    <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                                        <BreathingButton
                                            type="submit"
                                            className="inline-flex flex-1 items-center justify-center px-6 py-3 rounded-full bg-yellow-300 text-slate-900 text-sm font-semibold shadow-lg shadow-yellow-300/20 hover:bg-yellow-200 transition-colors"
                                        >
                                            2人の波を重ねてみる
                                        </BreathingButton>

                                        <Link
                                            href="/forecast"
                                            className="inline-flex items-center justify-center px-5 py-3 rounded-full border border-slate-600 text-sm text-slate-200 hover:border-yellow-300/70 hover:text-yellow-200 transition-colors"
                                        >
                                            未来の波に戻る
                                        </Link>
                                    </div>
                                </form>
                            </div>
                        </StaggerItem>

                        {/* Result */}
                        <div id="result" className="space-y-10">

                            {/* Summary */}
                            <StaggerItem>
                                <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-6 md:p-7">
                                    <h2 className="text-lg font-semibold mb-3 text-slate-50">
                                        相性フーリエ診断・サマリー（ダミー）
                                    </h2>

                                    <div className="flex flex-col md:flex-row md:items-center gap-6">
                                        <div className="flex-1">
                                            <p className="text-sm text-slate-200 leading-relaxed">
                                                2人の波形を比較した結果、
                                                <span className="text-yellow-300 font-semibold text-base">共鳴度 78%</span>（ダミー）。
                                                平均位相差は <span className="text-sky-300 font-semibold">36°</span>（ダミー）で、
                                                <span className="text-slate-50 font-medium">「補完型の強共鳴」</span> に分類されます。
                                            </p>

                                            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                                                ・共鳴度：波の山/谷がどれだけ重なるか<br />
                                                ・位相差：タイミングのズレ（0°に近いほど同調）
                                            </p>
                                        </div>

                                        <div className="w-full md:w-56">
                                            <div className="rounded-2xl border border-yellow-400/60 bg-yellow-400/10 px-4 py-5 text-center">
                                                <p className="text-xs tracking-[0.25em] uppercase text-yellow-200 mb-2">
                                                    Resonance
                                                </p>
                                                <p className="text-3xl font-semibold text-yellow-300 mb-1">
                                                    78<span className="text-base align-top">%</span>
                                                </p>
                                                <p className="text-xs text-slate-200 mb-3">
                                                    補完型の強共鳴
                                                </p>
                                                <p className="text-[11px] text-yellow-100 leading-relaxed">
                                                    違いが摩擦になりにくく、
                                                    一緒にいることで新しい波形が生まれやすい関係です（ダミー）。
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </StaggerItem>

                            {/* Overlay waves */}
                            <StaggerItem>
                                <div className="rounded-3xl border border-slate-800 bg-slate-950/40 p-6 md:p-7">
                                    <div className="flex items-center justify-between mb-4 gap-4">
                                        <h2 className="text-lg font-semibold text-slate-50">
                                            2人の波形の重なり（ダミー）
                                        </h2>
                                        <div className="flex items-center gap-3 text-[11px] text-slate-300">
                                            <span className="inline-flex items-center gap-1">
                                                <span className="w-4 h-[2px] rounded-full bg-sky-300"></span> あなた
                                            </span>
                                            <span className="inline-flex items-center gap-1">
                                                <span className="w-4 h-[2px] rounded-full bg-fuchsia-300"></span> お相手
                                            </span>
                                        </div>
                                    </div>

                                    <div className="w-full flex justify-center">
                                        <svg viewBox="0 0 640 240" className="w-full max-w-4xl" aria-hidden="true">
                                            <g stroke="rgba(148,163,184,0.20)" strokeWidth="0.4">
                                                <path d="M20 200 H620" />
                                                <path d="M20 160 H620" />
                                                <path d="M20 120 H620" />
                                                <path d="M20 80 H620" />
                                                <path d="M20 40 H620" />
                                            </g>

                                            {/* You */}
                                            <polyline
                                                fill="none"
                                                stroke="#7dd3fc"
                                                strokeWidth="2.2"
                                                points="
                        20,150 60,130 100,115 140,85 180,95 220,125 260,170 300,190
                        340,165 380,125 420,85 460,95 500,130 540,160 580,190 620,165
                      "
                                            />

                                            {/* Partner (phase shifted a bit) */}
                                            <polyline
                                                fill="none"
                                                stroke="#f9a8d4"
                                                strokeWidth="2.2"
                                                opacity="0.9"
                                                points="
                        20,160 60,140 100,125 140,95 180,105 220,135 260,175 300,185
                        340,155 380,115 420,75 460,85 500,125 540,155 580,185 620,170
                      "
                                            />
                                        </svg>
                                    </div>

                                    <p className="mt-4 text-sm text-slate-200 leading-relaxed">
                                        波の「山」と「谷」が重なる部分が多く、
                                        大きな流れは共鳴しつつ、細部はズレが補完として働く関係性です（ダミー）。
                                    </p>
                                </div>
                            </StaggerItem>

                            {/* Cards */}
                            <StaggerItem>
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5">
                                        <h3 className="text-sm font-semibold text-slate-100 mb-2">
                                            関係性タイプ（ダミー）
                                        </h3>
                                        <p className="text-base font-semibold text-yellow-200 mb-2">
                                            補完型の成長ペア
                                        </p>
                                        <p className="text-sm text-slate-200 leading-relaxed">
                                            リズムや価値観に違いがあっても、
                                            それが “推進力” になりやすい組み合わせ。
                                            片方が谷にいるとき、もう片方の波を信頼して支える。
                                            片方が谷にいるとき、もう片方が波の上にいることで全体が安定しやすいです。
                                        </p>
                                    </div>

                                    <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5">
                                        <h3 className="text-sm font-semibold text-slate-100 mb-2">
                                            関わり方のヒント（ダミー）
                                        </h3>
                                        <ul className="text-sm text-slate-200 leading-relaxed space-y-2">
                                            <li>・「同じタイミングで同じテンション」を前提にしない。</li>
                                            <li>・どちらかが谷のときは、もう片方の波を信頼して支える。</li>
                                            <li>・重要な話は、2人が中腹〜山にいる時期に寄せる。</li>
                                            <li>・相手を変えようとするより、波の違いを設計にする。</li>
                                        </ul>
                                    </div>
                                </div>
                            </StaggerItem>

                            {/* Note */}
                            <StaggerItem>
                                <div className="rounded-2xl border border-slate-800/80 bg-slate-900/50 px-4 py-3 text-xs text-slate-400 leading-relaxed">
                                    <p className="mb-1">
                                        この診断は「良し悪し」ではなく、2人のリズムを理解するための指標です。
                                    </p>
                                    <p>
                                        波の性質を知ることで、関係性をより意識的に育てていくヒントになります。
                                    </p>
                                </div>
                            </StaggerItem>

                            {/* Final Buttons */}
                            <StaggerItem>
                                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                                    <BreathingButton
                                        href="/"
                                        className="inline-flex flex-1 items-center justify-center px-6 py-3 rounded-full bg-yellow-300 text-slate-900 text-sm font-semibold shadow-lg shadow-yellow-300/20 hover:bg-yellow-200 transition-colors"
                                    >
                                        TOPに戻る（別の波を解析する）
                                    </BreathingButton>

                                    <Link
                                        href="/analysis"
                                        className="inline-flex items-center justify-center px-5 py-3 rounded-full border border-slate-600 text-sm text-slate-200 hover:border-yellow-300/70 hover:text-yellow-200 transition-colors"
                                    >
                                        解析結果に戻る
                                    </Link>
                                </div>
                            </StaggerItem>
                        </div>

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

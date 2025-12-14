'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import BreathingButton from '@/components/BreathingButton';
import StaggeredText, { StaggerItem } from '@/components/StaggeredText';
import CosmicInput from '@/components/CosmicInput';
import RitualOverlay from '@/components/RitualOverlay';

export default function EventsPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        goodStart: '',
        goodEnd: '',
        goodNote: '',
        badStart: '',
        badEnd: '',
        badNote: ''
    });
    const [isRitualActive, setIsRitualActive] = useState(false);

    // Usually no strict validation needed for optional events, but let's simulate intent
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate Ritual
        setIsRitualActive(true);
        setTimeout(() => {
            router.push('/analysis');
        }, 1500);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="min-h-screen flex flex-col">
            <RitualOverlay isVisible={isRitualActive} />

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
                                Step 2 / Events (Good & Bad Waves)
                            </p>
                        </StaggerItem>

                        <StaggerItem>
                            <h1 className="text-2xl md:text-3xl font-semibold mb-3">
                                あなたの人生に現れた「波」を入力してください。
                            </h1>
                        </StaggerItem>

                        <StaggerItem>
                            <p className="text-sm md:text-base text-slate-300/90 mb-8 leading-relaxed max-w-2xl">
                                ここでは、過去に「やたら調子が良かった時期」や「重かった時期」を入力します。
                                <br />
                                この記録が、フーリエ変換にかけるための
                                <span className="text-slate-50 font-semibold">“波形データ”</span> になります。
                            </p>
                        </StaggerItem>

                        {/* Card */}
                        <StaggerItem>
                            <div className="rounded-3xl border border-slate-800 bg-slate-950/40 p-6 md:p-8 shadow-[0_0_40px_rgba(15,23,42,0.9)]">
                                <form className="space-y-10" onSubmit={handleSubmit}>

                                    {/* Good Times */}
                                    <div>
                                        <h2 className="text-lg font-semibold mb-3 text-slate-100">好調だった時期（Peak）</h2>
                                        <p className="text-xs text-slate-400 mb-3">
                                            「人生が加速していた」「巡りが良かった」と感じた期間。
                                        </p>

                                        <div className="grid md:grid-cols-2 gap-4">
                                            <CosmicInput
                                                label="開始日"
                                                type="date"
                                                name="goodStart"
                                                id="goodStart"
                                                value={formData.goodStart}
                                                onChange={handleChange}
                                            />
                                            <CosmicInput
                                                label="終了日"
                                                type="date"
                                                name="goodEnd"
                                                id="goodEnd"
                                                value={formData.goodEnd}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div className="mt-3">
                                            <CosmicInput
                                                label="メモ（任意）"
                                                type="text"
                                                name="goodNote"
                                                id="goodNote"
                                                placeholder="例：仕事・人間関係・体調など"
                                                value={formData.goodNote}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    {/* Bad Times */}
                                    <div>
                                        <h2 className="text-lg font-semibold mb-3 text-slate-100">重かった時期（Trough）</h2>
                                        <p className="text-xs text-slate-400 mb-3">
                                            「なぜか調子が出なかった」「流れが止まった」と感じた期間。
                                        </p>

                                        <div className="grid md:grid-cols-2 gap-4">
                                            <CosmicInput
                                                label="開始日"
                                                type="date"
                                                name="badStart"
                                                id="badStart"
                                                value={formData.badStart}
                                                onChange={handleChange}
                                            />
                                            <CosmicInput
                                                label="終了日"
                                                type="date"
                                                name="badEnd"
                                                id="badEnd"
                                                value={formData.badEnd}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div className="mt-3">
                                            <CosmicInput
                                                label="メモ（任意）"
                                                type="text"
                                                name="badNote"
                                                id="badNote"
                                                placeholder="例：体調低下、別れ、仕事停滞など"
                                                value={formData.badNote}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    {/* Note */}
                                    <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 px-4 py-3 text-xs text-slate-400 leading-relaxed">
                                        フーリエ解析の精度は、入力する「波の時期の幅」によって変化します。
                                        完璧な期間でなくても問題ありません。
                                        あなたの感覚がもっとも大切です。
                                    </div>

                                    {/* Buttons */}
                                    <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                                        <BreathingButton
                                            type="submit"
                                            className="inline-flex flex-1 items-center justify-center px-6 py-3 rounded-full bg-yellow-300 text-slate-900 text-sm font-semibold hover:bg-yellow-200 transition-colors"
                                        >
                                            次へ進む（周期の分析）
                                        </BreathingButton>

                                        <Link
                                            href="/start"
                                            className="inline-flex items-center justify-center px-5 py-3 rounded-full border border-slate-600 text-sm text-slate-200 hover:border-yellow-300/70 hover:text-yellow-200 transition-colors"
                                        >
                                            戻る
                                        </Link>
                                    </div>

                                </form>
                            </div>
                        </StaggerItem>
                    </StaggeredText>
                </section>
            </main>

            <footer className="border-t border-slate-800/80 bg-slate-950/60">
                <div className="mx-auto max-w-6xl px-4 py-5 text-xs text-slate-500">
                    © 2025 神羅万象グリッド Fourier Oracle
                </div>
            </footer>
        </div>
    );
}

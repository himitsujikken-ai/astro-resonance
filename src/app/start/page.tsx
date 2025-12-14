'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import BreathingButton from '@/components/BreathingButton';
import StaggeredText, { StaggerItem } from '@/components/StaggeredText';
import CosmicInput from '@/components/CosmicInput';
import RitualOverlay from '@/components/RitualOverlay';

export default function StartPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        birthdate: '',
        birthtime: '',
        birthplace: ''
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isRitualActive, setIsRitualActive] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        const newErrors: Record<string, string> = {};
        if (!formData.birthdate) {
            newErrors.birthdate = "Required";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return; // Stop
        }

        // Success -> Ritual Transition
        setIsRitualActive(true);

        // Wait for ritual animation (1.5s)
        setTimeout(() => {
            router.push('/events');
        }, 1500);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error on change
        if (errors[name]) {
            setErrors(prev => {
                const next = { ...prev };
                delete next[name];
                return next;
            });
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <RitualOverlay isVisible={isRitualActive} />

            {/* Header */}
            <header className="w-full">
                <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
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
                    </div>
                    <nav className="hidden md:flex items-center gap-8 text-sm">
                        <Link href="/" className="hover:text-yellow-300 transition-colors">Home</Link>
                    </nav>
                </div>
            </header>

            {/* Main */}
            <main className="flex-1">
                <section className="mx-auto max-w-6xl px-4 pt-8 pb-16 md:pt-12 md:pb-24">
                    <StaggeredText className="max-w-2xl mx-auto">
                        <StaggerItem className="text-xs tracking-[0.35em] uppercase text-yellow-200/80 mb-3">
                            Step 1 / Basic Info
                        </StaggerItem>

                        <StaggerItem>
                            <h1 className="text-2xl md:text-3xl font-semibold mb-3">
                                あなたの「波形」のベースとなる<br className="hidden md:inline" />
                                情報を教えてください。
                            </h1>
                        </StaggerItem>

                        <StaggerItem>
                            <p className="text-sm md:text-base text-slate-300/90 mb-8 leading-relaxed">
                                生年月日などの基本情報から、あなた固有の
                                <span className="text-slate-50 font-medium">基音（ベース周波数）</span> を抽出していきます。<br />
                                出生時間や出生地は、宇宙周期との照合精度を高めるために使いますが、
                                未入力でも解析は可能です。
                            </p>
                        </StaggerItem>

                        {/* Input Card */}
                        <StaggerItem>
                            <div className="rounded-3xl border border-slate-800 bg-slate-950/40 p-6 md:p-8 shadow-[0_0_40px_rgba(15,23,42,0.9)]">
                                <form className="space-y-6" onSubmit={handleSubmit} noValidate>

                                    {/* Birthdate */}
                                    <CosmicInput
                                        label="生年月日"
                                        id="birthdate"
                                        name="birthdate"
                                        type="date"
                                        required
                                        value={formData.birthdate}
                                        onChange={handleChange}
                                        error={errors.birthdate}
                                        note="例：1990-08-24"
                                    />

                                    {/* Birthtime */}
                                    <CosmicInput
                                        as="select"
                                        label="出生時間（わかる範囲で）"
                                        id="birthtime"
                                        name="birthtime"
                                        value={formData.birthtime}
                                        onChange={handleChange}
                                        note="正確な時間がわからない場合は、おおよその時間帯を選んでください。"
                                    >
                                        <option value="">未選択（不明）</option>
                                        <option value="early-morning">早朝（4:00〜7:00）</option>
                                        <option value="morning">朝（7:00〜11:00）</option>
                                        <option value="noon">昼（11:00〜15:00）</option>
                                        <option value="evening">夕方（15:00〜19:00）</option>
                                        <option value="night">夜（19:00〜24:00）</option>
                                        <option value="midnight">深夜（0:00〜4:00）</option>
                                    </CosmicInput>

                                    {/* Birthplace */}
                                    <CosmicInput
                                        label="出生地（市区町村まででOK）"
                                        id="birthplace"
                                        name="birthplace"
                                        type="text"
                                        placeholder="例：京都府京都市 / 東京都世田谷区"
                                        value={formData.birthplace}
                                        onChange={handleChange}
                                        note="宇宙周期との照合に用いますが、空欄でも解析は可能です。"
                                    />

                                    {/* Privacy Note */}
                                    <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 px-4 py-3 text-xs text-slate-400 leading-relaxed">
                                        <p className="mb-1">
                                            入力いただいた情報は、波形解析とレポート生成のみに使用されます。
                                        </p>
                                        <p>
                                            保存の有無や匿名性など、詳細な取り扱いはのちほど設定画面から選択できます。
                                        </p>
                                    </div>

                                    {/* Buttons */}
                                    <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                                        <BreathingButton
                                            type="submit"
                                            className="inline-flex flex-1 items-center justify-center px-6 py-3 rounded-full bg-yellow-300 text-slate-900 text-sm font-semibold shadow-lg shadow-yellow-300/20 hover:bg-yellow-200 transition-colors"
                                        >
                                            次へ進む（波の記憶を入力）
                                        </BreathingButton>
                                        <Link
                                            href="/"
                                            className="inline-flex items-center justify-center px-5 py-3 rounded-full border border-slate-600 text-sm text-slate-200 hover:border-yellow-300/70 hover:text-yellow-200 transition-colors"
                                        >
                                            TOPに戻る
                                        </Link>
                                    </div>
                                </form>
                            </div>
                        </StaggerItem>

                        <StaggerItem>
                            <p className="mt-6 text-xs text-slate-400 leading-relaxed">
                                ※ ここで入力するのは、いわば「あなたという楽器」の基本設定です。<br />
                                次のステップで、どんなタイミングでその楽器が鳴りやすかったのか（好調・停滞の波）を一緒に見ていきます。
                            </p>
                        </StaggerItem>
                    </StaggeredText>
                </section>
            </main>

            <footer className="border-t border-slate-800/80 bg-slate-950/60">
                <div className="mx-auto max-w-6xl px-4 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-500">
                    <p>© 2025 神羅万象グリッド Fourier Oracle</p>
                    <div className="flex gap-4">
                        <Link href="/#about" className="hover:text-slate-300 transition-colors">About</Link>
                        <Link href="#" className="hover:text-slate-300 transition-colors">プライバシー</Link>
                        <Link href="#" className="hover:text-slate-300 transition-colors">利用規約</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}

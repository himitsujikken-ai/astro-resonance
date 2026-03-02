'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface CosmicInputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLSelectElement> {
    label: string;
    error?: string; // If present, shows error state
    note?: string; // Helper text
    as?: 'input' | 'select' | 'textarea'; // Element type
    children?: React.ReactNode; // For select options
}

export default function CosmicInput({
    label,
    error,
    note,
    as = 'input',
    className,
    id,
    children,
    ...props
}: CosmicInputProps) {
    const [isFocused, setIsFocused] = useState(false);

    // Glow animation variants
    const glowVariants = {
        idle: {
            boxShadow: '0 0 0px rgba(253, 224, 71, 0)',
            borderColor: error ? '#f472b6' : 'rgba(51, 65, 85, 1)' // slate-700 or pink-400
        },
        focused: {
            boxShadow: '0 0 15px rgba(253, 224, 71, 0.3)',
            borderColor: 'rgba(253, 224, 71, 0.8)', // yellow-300
            transition: { duration: 0.4 }
        }
    };

    const baseInputStyles = twMerge(
        "w-full rounded-xl bg-slate-950/60 px-3 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none transition-colors",
        error ? "text-pink-100 placeholder-pink-300/50" : "",
        className
    );

    return (
        <div className="group relative">
            <label htmlFor={id} className={clsx(
                "block text-sm font-medium mb-2 transition-colors",
                error ? "text-pink-300" : "text-slate-100",
                isFocused && !error ? "text-yellow-200" : ""
            )}>
                {label}
                {props.required && !error && <span className="text-xs text-slate-500 ml-1 align-middle">※必須</span>}
            </label>

            {/* Wrapper for motion border */}
            <motion.div
                className="relative rounded-xl border" // motion handles border color via styling
                variants={glowVariants}
                initial="idle"
                animate={isFocused ? "focused" : "idle"}
            >
                {as === 'select' ? (
                    <select
                        id={id}
                        className={baseInputStyles}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        {...(props as any)}
                    >
                        {children}
                    </select>
                ) : as === 'textarea' ? (
                    // Minimal support for textarea if needed later, but treating as input for now or adding specific logic
                    <input {...(props as any)} />
                ) : (
                    <input
                        id={id}
                        className={baseInputStyles}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        {...(props as any)}
                    />
                )}
            </motion.div>

            {/* Helper Note or Gentle Error */}
            <div className="mt-1.5 min-h-[20px]">
                {error ? (
                    <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs text-pink-300 flex items-center gap-1"
                    >
                        ✦ 星々があなたの情報を待っています...
                    </motion.p>
                ) : note ? (
                    <p className="text-xs text-slate-400">{note}</p>
                ) : null}
            </div>
        </div>
    );
}

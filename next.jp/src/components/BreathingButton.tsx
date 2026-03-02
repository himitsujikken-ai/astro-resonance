'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

interface BreathingButtonProps {
    href?: string;
    onClick?: (e: React.MouseEvent) => void;
    children: React.ReactNode;
    className?: string; // For Tailwind classes usually passed to button/a
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
}

export default function BreathingButton({ href, onClick, children, className, type, disabled }: BreathingButtonProps) {
    const animations = {
        animate: {
            scale: [1, 1.03, 1],
            opacity: [0.9, 1, 0.9],
            boxShadow: [
                '0 0 0px rgba(253, 224, 71, 0)',
                '0 0 15px rgba(253, 224, 71, 0.3)',
                '0 0 0px rgba(253, 224, 71, 0)'
            ],
            transition: {
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut'
            }
        } as any,
        whileHover: {
            scale: 1.05,
            opacity: 1,
            boxShadow: '0 0 20px rgba(253, 224, 71, 0.5)',
            transition: { duration: 0.3 }
        } as any,
        whileTap: { scale: 0.98 }
    };

    const Component = href ? Link : motion.button;
    const props = href ? { href, className } : { onClick, className, type, disabled };

    // If it's a Link, we wrap a motion.div or use motion.create(Link) but motion(Link) can be tricky with types.
    // Instead, simply wrap the inner content if using Link, OR use a span/div wrapper.
    // Actually, easiest is to use motion.create(Link) but let's stick to safe wrapping.
    // If it's a button, we can use motion.button directly.

    if (href) {
        return (
            <Link href={href} className={className}>
                <motion.div
                    className="w-full h-full flex items-center justify-center"
                    {...animations}
                >
                    {children}
                </motion.div>
            </Link>
        );
    }

    return (
        <motion.button
            {...(props as any)}
            {...animations}
        >
            {children}
        </motion.button>
    );
}

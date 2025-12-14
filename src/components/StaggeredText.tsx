'use client';

import { motion } from 'framer-motion';

interface StaggeredTextProps {
    children: React.ReactNode;
    delay?: number;
    className?: string; // Allow passing layout classes like grid/flex
}

export default function StaggeredText({ children, delay = 0, className = "" }: StaggeredTextProps) {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: delay
            }
        }
    };

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className={className}
        >
            {children}
        </motion.div>
    );
}

export const StaggerItem = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
    const item = {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
    } as any;

    return (
        <motion.div variants={item} className={className}>
            {children}
        </motion.div>
    );
};

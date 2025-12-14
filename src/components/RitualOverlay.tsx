'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface RitualOverlayProps {
    isVisible: boolean;
}

export default function RitualOverlay({ isVisible }: RitualOverlayProps) {
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 1 } }}
                >
                    {/* Converging Light Container */}
                    <div className="relative flex items-center justify-center w-full h-full overflow-hidden">

                        {/* 1. Large Light Ring converging */}
                        <motion.div
                            className="absolute w-[200vw] h-[200vw] rounded-full bg-gradient-to-r from-yellow-200/0 via-yellow-100/10 to-yellow-200/0"
                            initial={{ scale: 2, opacity: 0 }}
                            animate={{
                                scale: 0,
                                opacity: [0, 1, 0]
                            }}
                            transition={{
                                duration: 1.5,
                                ease: "easeInOut",
                                times: [0, 0.5, 1]
                            }}
                        />

                        {/* 2. Core Flash */}
                        <motion.div
                            className="absolute w-2 h-2 bg-yellow-100 rounded-full shadow-[0_0_100px_50px_rgba(253,224,71,0.5)]"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{
                                scale: [0, 2, 50],
                                opacity: [0, 1, 0]
                            }}
                            transition={{
                                delay: 1.2,
                                duration: 0.8,
                                ease: "easeOut"
                            }}
                        />

                        {/* Text Message */}
                        <motion.p
                            className="relative z-10 text-xs tracking-[0.5em] text-yellow-200 uppercase font-light"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            解析の儀式...
                        </motion.p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

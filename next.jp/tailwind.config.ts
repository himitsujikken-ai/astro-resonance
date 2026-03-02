import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                zen: {
                    black: "#0d0d15", // Updated to match index.html
                    dark: "#1a1a24",  // Updated to match .container bg
                    panel: "#12121a",
                    text: "#e0e0e0",
                    dim: "#888899",
                },
                cyber: {
                    primary: "#bfa5ff",
                    accent: "#ffeb3b", // Matches .highlight
                    mic: "#e91e63",
                    success: "#38ef7d",
                },
                // Adding mappings for user mentioned colors to ensure they work if used
                slate: {
                    950: "#020617", // Standard slate-950
                },
                yellow: {
                    300: "#fde047", // Standard yellow-300
                },
            },
            backgroundImage: {
                "mystic-glow": "radial-gradient(circle at center, rgba(191, 165, 255, 0.15) 0%, transparent 70%)",
                "universe": "radial-gradient(circle at center, #1a1a24 0%, #0d0d15 100%)", // approximate universe feel
            },
        },
    },
    plugins: [],
};
export default config;

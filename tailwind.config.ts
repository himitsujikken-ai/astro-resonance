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
                    black: "#050508",
                    dark: "#0a0a12",
                    panel: "#12121a",
                    text: "#e0e0e0",
                    dim: "#888899",
                },
                cyber: {
                    primary: "#bfa5ff",
                    accent: "#ffeb3b",
                    mic: "#e91e63",
                    success: "#38ef7d",
                },
            },
            backgroundImage: {
                "mystic-glow": "radial-gradient(circle at center, rgba(191, 165, 255, 0.15) 0%, transparent 70%)",
            },
        },
    },
    plugins: [],
};
export default config;

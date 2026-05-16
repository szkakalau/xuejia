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
        background: "var(--background)",
        foreground: "var(--foreground)",
        gold: {
          DEFAULT: "var(--gold)",
          light: "var(--gold-light)",
          muted: "var(--gold-muted)",
          dark: "#9a7b1a",
        },
        surface: {
          DEFAULT: "var(--surface)",
          elevated: "var(--surface-elevated)",
          border: "var(--border)",
        },
        tobacco: "var(--tobacco)",
        cream: "var(--cream)",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        gold: "0 4px 24px rgba(212, 175, 55, 0.15)",
        "gold-lg": "0 8px 40px rgba(212, 175, 55, 0.22)",
        "inner-glow": "inset 0 1px 0 rgba(255, 255, 255, 0.04)",
        float: "0 -8px 32px rgba(0, 0, 0, 0.55)",
      },
      letterSpacing: {
        luxury: "0.2em",
        wide: "0.12em",
      },
      animation: {
        "fade-up": "fade-up 0.55s cubic-bezier(0.22, 1, 0.36, 1) both",
      },
    },
  },
  plugins: [],
};

export default config;

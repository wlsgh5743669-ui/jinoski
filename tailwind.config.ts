import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.25rem",
        sm: "1.5rem",
        lg: "2rem",
        xl: "2.5rem",
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1200px",
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        brand: {
          DEFAULT: "#2DA8FF",
          50: "#EFF8FF",
          100: "#DDF0FF",
          200: "#B9E2FF",
          300: "#87CDFF",
          400: "#57B4FF",
          500: "#2DA8FF",
          600: "#0F84E0",
          700: "#0C68B0",
          800: "#0B4F87",
          900: "#0A3F6B",
        },
        ice: {
          DEFAULT: "#F3F8FC",
          100: "#FFFFFF",
          200: "#F3F8FC",
          300: "#E7F0F7",
        },
        snow: {
          DEFAULT: "#8A94A0",
          100: "#F5F6F7",
          300: "#D5D9DE",
          500: "#8A94A0",
          700: "#565D66",
        },
        ink: {
          DEFAULT: "#0A0B0D",
          900: "#0A0B0D",
          800: "#121316",
          700: "#1A1C20",
        },
      },
      fontFamily: {
        sans: [
          "Pretendard",
          "SUIT",
          "Noto Sans KR",
          "-apple-system",
          "BlinkMacSystemFont",
          "sans-serif",
        ],
      },
      letterSpacing: {
        tightest: "-0.04em",
        tighter: "-0.03em",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        marquee: "marquee 30s linear infinite",
      },
      backgroundImage: {
        "ice-gradient":
          "linear-gradient(180deg, #FFFFFF 0%, #F3F8FC 60%, #E7F0F7 100%)",
        "hero-scrim":
          "linear-gradient(180deg, rgba(10,11,13,0.15) 0%, rgba(10,11,13,0.55) 70%, rgba(10,11,13,0.85) 100%)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;

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
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        dark: {
          900: "#0D0D0D",
          800: "#141414",
          700: "#1F1F1F",
          600: "#2B2B2B",
        },
        gold: {
          DEFAULT: "#D4AF37",
          light: "#E5C158",
          dark: "#AA8C2C",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 15px -3px rgba(212, 175, 55, 0.3)",
        "glow-lg": "0 0 25px -3px rgba(212, 175, 55, 0.4)",
      },
    },
  },
  plugins: [],
};

export default config;

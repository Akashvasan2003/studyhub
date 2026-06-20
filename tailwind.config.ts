import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: "#0f1117",
          card: "#1a1d27",
          border: "#2a2d3a",
        },
        accent: {
          DEFAULT: "#6c63ff",
          hover: "#574fd6",
        },
      },
      gridTemplateColumns: {
        bento: "repeat(12, 1fr)",
      },
    },
  },
  plugins: [],
};

export default config;

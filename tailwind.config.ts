import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)"],
      },
      fontSize: {
        header: ["32px", "40px"],
      },
      borderWidth: {
        "1": "1px",
      },
      spacing: {
        128: "32rem",
        144: "36rem",
      },
      borderRadius: {
        "4xl": "2rem",
        inherit: "inherit",
      },
      opacity: {
        3: "0.03",
        4: "0.04",
        32: "0.32",
        56: "0.56",
        64: "0.64",
        72: "0.72",
        88: "0.88",
      },
      zIndex: {
        max: "1000",
      },

      animation: {
        loader: "loader 0.6s infinite alternate",
      },
      keyframes: {
        loader: {
          to: {
            opacity: "0.1",
            transform: "translate3d(0, -1rem, 0)",
          },
        },
      },
    },
  },
  plugins: [require("@headlessui/tailwindcss")],
};
export default config;

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/admin/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/website/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/shared/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fff8ed",
          100: "#ffefd3",
          200: "#ffdba5",
          300: "#ffc06d",
          400: "#ff9a33",
          500: "#ff7a0b",
          600: "#f05e02",
          700: "#c74506",
          800: "#9e370d",
          900: "#7f2f0e",
        },
        spice: {
          50: "#fef3f2",
          100: "#fee4e2",
          500: "#e23b2e",
          600: "#cf271e",
          700: "#ab1f18",
        },
        masala: {
          50: "#faf6f0",
          100: "#f2e8d8",
          700: "#6b4f2a",
          900: "#3d2c14",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;

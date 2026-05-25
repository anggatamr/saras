import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-hanken-grotesk)", "sans-serif"],
        display: ["var(--font-syne)", "sans-serif"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        surface: {
          DEFAULT: "var(--surface)",
          dim: "var(--surface-dim)",
          bright: "var(--surface-bright)",
          container: {
            lowest: "var(--surface-container-lowest)",
            low: "var(--surface-container-low)",
            DEFAULT: "var(--surface-container)",
            high: "var(--surface-container-high)",
            highest: "var(--surface-container-highest)",
          },
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
          container: "var(--primary-container)",
          fixed: "var(--primary-fixed)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
          container: "var(--secondary-container)",
          fixed: "var(--secondary-fixed)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
      },
      borderRadius: {
        lg: "0px",
        md: "0px",
        sm: "0px",
        full: "9999px",
      },
      boxShadow: {
        neo: "4px 4px 0px 0px var(--foreground)",
        "neo-sm": "2px 2px 0px 0px var(--foreground)",
        "neo-hover": "6px 6px 0px 0px var(--foreground)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;

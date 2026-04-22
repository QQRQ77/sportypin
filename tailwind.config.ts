import { heroui } from "@heroui/theme";
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      keyframes: {
        borderPulse: {
          '0%, 100%': { borderColor: 'rgba(59, 130, 246, 1)' }, // blue-500
          '50%': { borderColor: 'rgba(59, 130, 246, 0.3)' },    // wyblakły błękit
        }
      },
      animation: {
        'border-pulse': 'borderPulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  darkMode: "class",
  plugins: [
    heroui(),
    require('tailwindcss-animated')
  ],
};
export default config;

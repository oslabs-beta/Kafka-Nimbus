import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-background': 'linear-gradient(157deg, rgba(235,234,235,1) 49%, rgba(255,255,255,1) 73%)',
      },
    }
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ['lofi'],
    base: true,
    utils: true,
  },
} satisfies Config;

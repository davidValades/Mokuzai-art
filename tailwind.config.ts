import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'olive-dark': '#706D54', 
        'earth-noble': '#A08963', 
        'wood-light': '#C9B194',  
        'stone-serene': '#DBDBDB',
      },
    },
  },
  plugins: [],
};
export default config;
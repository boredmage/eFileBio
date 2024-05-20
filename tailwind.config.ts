import { withUt } from "uploadthing/tw";
import { nextui } from "@nextui-org/react";
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{ts,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        hero: "url(/hero-bg.png)",
      },
      boxShadow: {
        hero: "0px -16px 144px 0px rgba(0, 0, 0, 0.02) inset",
        heroCard: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
        featureCard: "rgba(0, 0, 0, 0.05) 0px 1px 4px",
        nav: "rgba(0, 0, 0, 0.1) 0px 0px 5px 0px, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px",
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};
export default withUt(config);

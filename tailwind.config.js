/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  darkMode: "class",
  purge: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    /* any tailwind classes that you using inside of ${} string interpolation you need to put here,
    or the classes will be purged from tailwind when the static files are built */
    "text-lg",
    "font-bold",
    "pl-1",
    "text-xs",
    "h-10",
    "w-10",
    "h-8",
    "w-8",
    "cursor-pointer",
    "overflow-hidden",
    "shadow",
    "rounded-full",
    "relative",
    "pb-0.5",
    "items-end",
    "items-start",
    "mx-auto",
    "grow",
    "p-1",
    "flex",
    "flex-col",
    "justify-center",
    "text-center",
    "text-xs",
    "mx-auto",
    "mx-0",
    "text-right",
    "text-left",
    "justify-end",
    "justify-start",
    "items-start",
    "w-full",
    "gap-0.5",
    "pt-1",
    "text-zinc-800",
    "text-zinc-500",
    {
      pattern: /bg-(red|green|blue)-(100|200|300)/,
      variants: [
        "md",
        "sm",
        "dark",
        "hover",
        "focus",
        "dark:hover",
        "sm:hover",
        "md:hover",
        "dark:sm",
        "dark:md",
      ],
    },
  ],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      sm: "1px",
      md: "768px",
      lg: "860px",
    },
    extend: {
      fontFamily: {
        Archivo: ["Archivo", ...defaultTheme.fontFamily.sans],
        ArchivoBlack: ["Archivo Black", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        darkBackground: "rgb(22,22,22)",
      },
      height: {
        postHeight: "13.666em",
      },
      maxHeight: {
        asideMaxHeight: "calc(100vh - 8rem)",
      },
      minWidth: {
        postWidth: "15em",
      },
      maxWidth: {
        postWidth: "15em",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

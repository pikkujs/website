const { fontFamily } = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  corePlugins: {
    preflight: false,
    container: false,
  },
  darkMode: ["class", '[data-theme="dark"]'],
  content: [
    "./src/**/*.{jsx,tsx,html}", 
    "./src/*.{jsx,tsx,html}",
    "./docs/**/*.{jsx,tsx,html,mdx,}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', ...fontFamily.sans],
        jakarta: ['"Plus Jakarta Sans"', ...fontFamily.sans],
        mono: ['"Fira Code"', ...fontFamily.mono],
      },
      borderRadius: {
        sm: "4px",
      },
      colors: {
        primary: '#a863ee',
        'transport-http': {
          light: '#3b82f6', // blue-500
          dark: '#60a5fa',  // blue-400
        },
        'transport-websocket': {
          light: '#10b981', // green-500
          dark: '#34d399',  // green-400
        },
        'transport-sse': {
          light: '#8b5cf6', // purple-500
          dark: '#a78bfa',  // purple-400
        },
        'transport-cron': {
          light: '#f59e0b', // orange-500
          dark: '#fbbf24',  // orange-400
        },
        'transport-mcp': {
          light: '#14b8a6', // teal-500
          dark: '#5eead4',  // teal-300
        },
        'transport-queue': {
          light: '#ef4444', // red-500
          dark: '#f87171',  // red-400
        },
        'transport-rpc': {
          light: '#6366f1', // indigo-500
          dark: '#818cf8',  // indigo-400
        },
        'transport-cli': {
          light: '#6b7280', // gray-500
          dark: '#9ca3af',  // gray-400
        },
      },
    },
  },
  plugins: [],
};

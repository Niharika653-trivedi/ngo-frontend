/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ngo: {
          50: "#f3f8f4",
          100: "#dceadd",
          300: "#86b38f",
          600: "#2f6d42",
          700: "#1f5030",
          900: "#173b24",
        },
      },
    },
  },
  plugins: [],
}


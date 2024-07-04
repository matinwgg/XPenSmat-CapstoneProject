/** @type {import('tailwindcss').Config} */
module.exports = {
  content:  ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#23CE6B', //20B54B
        secondary: {
          DEFAULT: "#000",
          100: "#FF9001",
          200: "#FF8E01",
        },
        card: '#151515',
        notification: '#0A84FF',
        black: {
          DEFAULT: "#000",
          100: "#1E1E2D",
          200: "#232533",
        },
        gray: {
          100: "#CDCDE0",
          200: "#CCC",
        },
        white: {
          DEFAULT: "#FFF",
        },
        tertiary: {
          DEFAULT: "#5CB85C",
          100: '#0A84FF',   // for border color focus
        },
      },
      fontFamily: {
        pthin: ["Poppins-Thin", "sans-serif"],
        pextralight: ["Poppins-ExtraLight", "sans-serif"],
        plight: ["Poppins-Light", "sans-serif"],
        pregular: ["Poppins-Regular", "sans-serif"],
        pmedium: ["Poppins-Medium", "sans-serif"],
        psemibold: ["Poppins-SemiBold", "sans-serif"],
        pbold: ["Poppins-Bold", "sans-serif"],
        pextrabold: ["Poppins-ExtraBold", "sans-serif"],
        pblack: ["Poppins-Black", "sans-serif"],

        mregular: ["Brighter-Regular", "sans-serif"],
        mbold: ["Brighter-Bold", "sans-serif"],


        nthin: ["NotoSans-Thin", "sans-serif"],
        nextralight: ["NotoSans-ExtraLight", "sans-serif"],
        nlight: ["NotoSans-Light", "sans-serif"],
        nregular: ["NotoSans-Regular", "sans-serif"],
        nmedium: ["NotoSans-Medium", "sans-serif"],
        nsemibold: ["NotoSans-SemiBold", "sans-serif"],
        nbold: ["NotoSans-Bold", "sans-serif"],
        nextrabold: ["NotoSans-ExtraBold", "sans-serif"],
        nblack: ["NotoSans-Black", "sans-serif"],
      },
    
    },
  },
  plugins: [],
}


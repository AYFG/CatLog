/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
    colors: {
      wePeep: "#f2c4d6",
      prelude: "#dbc0e7",
      linen: "#faeee5",
      azalea: "#fad1d8",
      jaggedIce: "#c9e6ee",
    },
  },
  plugins: [],
};

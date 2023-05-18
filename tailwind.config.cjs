// /** @type {import('tailwindcss').Config} */
import colors from "tailwindcss/colors";

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      ...colors,
      primary: "#2c2c38",
      secondary: "#645fc6",
      tertiary: "#21212d",
    },
    extend: {},
  },
  plugins: [require("@tailwindcss/forms")],
};

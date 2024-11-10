/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.html", "./src/**/*.js", "./index.html"],
  theme: {
    extend: {
      colors: {
        "background-color": "#fff8f1",
        "primary-color": "#85727e",
        "secondary-color": "#d7c6b5",
        "card-color": "#fffdfb",
        rose: "#e0c3d4",
        "facebook-color": "#1877f2",
        "google-color": "#ea4335",
        dark: "#735e69", // darkened primary-color by 10%
        light: "#9d8d97", // lightened primary-color by 10%
        "light-light": "#fffbf8", // lightened card-color by 10%
        "dark-light": "#e6d7cf", // darkened card-color by 10%
      },
      fontFamily: {
        base: ["Playfair", "serif"],
      },
      fontSize: {
        base: "1rem",
      },
      fontWeight: {
        base: 400,
      },
      lineHeight: {
        base: "1.5",
      },
      borderRadius: {
        base: "0.25rem",
      },
      spacing: {
        base: "1rem",
      },
    },
  },
  plugins: [require("@tailwindcss/aspect-ratio")],
};

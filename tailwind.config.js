module.exports = {
  mode: "jit",
  purge: [
    "./storage/framework/views/*.php",
    "./resources/**/*.blade.php",
    "./resources/**/*.tsx",
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "980px",
      xl: "980px",
      "2xl": "980px",
    },
    borderColor: (theme) => ({
      ...theme("colors"),
      DEFAULT: "#2F3336",
    }),
    boxShadow: {
      sm: "0 1px 2px 0 rgba(255, 255, 255, 0.05)",
      DEFAULT:
        "0 1px 3px 0 rgba(255, 255, 255, 0.1), 0 1px 2px 0 rgba(255, 255, 255, 0.06)",
      md:
        "0 4px 6px -1px rgba(255, 255, 255, 0.1), 0 2px 4px -1px rgba(255, 255, 255, 0.06)",
      lg:
        "0 10px 15px -3px rgba(255, 255, 255, 0.1), 0 4px 6px -2px rgba(255, 255, 255, 0.05)",
      xl:
        "0 20px 25px -5px rgba(255, 255, 255, 0.1), 0 10px 10px -5px rgba(255, 255, 255, 0.04)",
      "2xl": "0 25px 50px -12px rgba(255, 255, 255, 0.25)",
      "3xl": "0 35px 60px -15px rgba(255, 255, 255, 0.3)",
      inner: "inset 0 2px 4px 0 rgba(255, 255, 255, 0.06)",
      none: "none",
    },
    extend: {
      colors: {
        primary: "#4D8844",
        secondary: "#1F1F23",
        dark: "#0E0E10",
        gray: {
          DEFAULT: "#202327",
          chateau: "#A4A7A8",
        },
        red: {
          persimmon: "#FF585B",
        },
        twitch: "#9147ff",
        steam: "#171A21",
        muted: "#6E767D",
        outerspace: "#2F3336",
        codgray: "#0a0a0a",
        white: {
          light: "#FFFFFF",
          DEFAULT: "#D9D9D9",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/aspect-ratio")],
};

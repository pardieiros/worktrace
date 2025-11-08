import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

const config: Config = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1E88E5",
          weak: "#90CAF9"
        },
        surface: "#F4F6F8",
        text: "#1A1D23",
        success: "#43A047",
        danger: "#E53935",
        cta: "#1565C0"
      },
      fontFamily: {
        sans: ["Inter", ...fontFamily.sans]
      },
      borderRadius: {
        xl: "1rem"
      },
      boxShadow: {
        card: "0 10px 30px rgba(30, 136, 229, 0.15)"
      }
    }
  },
  plugins: [require("@tailwindcss/forms")]
};

export default config;


/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // 🔥 Core Brand Colors (from your logo)
        brand: {
          bg: "#05070B",        // main background (deep black)
          panel: "#0B0F17",     // cards / sections
          line: "rgba(255,255,255,0.10)", // subtle borders
          orange: "#FF6A00",    // main brand orange
          orangeLight: "#FF8A1E", // highlight orange
          ember: "#FF3D00",     // darker flame tone
          steel: "#AEB6C2"      // steel gray accent
        },

        // ⚫ Neutral Dark Layers
        dark: {
          900: "#05070B",
          800: "#0B0F17",
          700: "#111827",
          600: "#1F2937"
        }
      },

      // 🧨 Custom Glow Utilities
      boxShadow: {
        glow: "0 0 25px rgba(255, 106, 0, 0.45)",
        glowSoft: "0 0 60px rgba(255, 106, 0, 0.25)"
      },

      // 🔥 Gradient presets
      backgroundImage: {
        "brand-gradient":
          "linear-gradient(135deg, #FF6A00 0%, #FF8A1E 40%, transparent 100%)",
        "brand-radial":
          "radial-gradient(circle at center, rgba(255,106,0,0.35), transparent 70%)"
      }
    }
  },
  plugins: []
};

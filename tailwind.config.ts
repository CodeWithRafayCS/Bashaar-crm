import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#f4c542",
          foreground: "#0a0a0a",
          50: "#fef9e7",
          100: "#fdf0cc",
          200: "#fbe199",
          300: "#f8d266",
          400: "#f6c333",
          500: "#f4c542",
          600: "#d4a030",
          700: "#b47a1e",
          800: "#94550c",
          900: "#743000",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        gold: {
          DEFAULT: "#f4c542",
          light: "#f8d266",
          dark: "#d4a030",
          darker: "#b47a1e",
        },
        matte: {
          black: "#0a0a0a",
          dark: "#141414",
          card: "#1a1a1a",
          border: "#2a2a2a",
        },
        white: {
          DEFAULT: "#ffffff",
          muted: "rgba(255, 255, 255, 0.7)",
          dim: "rgba(255, 255, 255, 0.5)",
          faint: "rgba(255, 255, 255, 0.3)",
          ghost: "rgba(255, 255, 255, 0.1)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-gold": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        "float": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(30px, -30px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.6s ease-out",
        "slide-up": "slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
        "pulse-gold": "pulse-gold 2s ease-in-out infinite",
        "float": "float 20s ease-in-out infinite",
        "spin-slow": "spin-slow 3s linear infinite",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gradient-gold": "linear-gradient(135deg, #f4c542, #d4a030)",
        "gradient-dark": "linear-gradient(180deg, #0a0a0a, #141414)",
        "gradient-card": "linear-gradient(135deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.01))",
        "gradient-glow": "radial-gradient(circle, rgba(244, 197, 66, 0.06), transparent 70%)",
      },
      boxShadow: {
        "gold": "0 8px 30px rgba(244, 197, 66, 0.3)",
        "gold-sm": "0 4px 20px rgba(244, 197, 66, 0.15)",
        "gold-lg": "0 16px 50px rgba(244, 197, 66, 0.25)",
        "glass": "0 20px 60px rgba(0, 0, 0, 0.4)",
        "glass-sm": "0 10px 30px rgba(0, 0, 0, 0.2)",
      },
      backdropBlur: {
        glass: "20px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
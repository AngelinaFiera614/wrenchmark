
import { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";
import animate from "tailwindcss-animate";

const config = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
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
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
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
          teal: "#00D2B4",
          "teal-hover": "#00b89d",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          background: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // Brand Explorer dark theme
        explorer: {
          dark: "#0a0a0a",
          "dark-light": "#1a1a1a",
          card: "rgba(20, 20, 20, 0.8)",
          teal: "#00D2B4",
          "teal-hover": "#00b89d",
          chrome: "#c0c0c0",
          "chrome-light": "#e8e8e8",
          "chrome-dark": "#888888",
          text: "#ffffff",
          "text-muted": "#a0a0a0",
          smoke: "radial-gradient(circle at 50% 50%, rgba(0, 210, 180, 0.1) 0%, transparent 70%)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["Inter", ...fontFamily.sans],
      },
      keyframes: {
        "accordion-down": {
          from: { height: '0' },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: '0' },
        },
        "chrome-flicker": {
          "0%, 100%": { filter: "brightness(1) contrast(1)" },
          "50%": { filter: "brightness(1.2) contrast(1.1)" }
        },
        "smoke-drift": {
          "0%": { transform: "translateX(0) translateY(0) rotate(0deg)" },
          "100%": { transform: "translateX(100px) translateY(-50px) rotate(360deg)" }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "chrome-flicker": "chrome-flicker 2s ease-in-out infinite",
        "smoke-drift": "smoke-drift 20s linear infinite",
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'explorer-smoke': 'radial-gradient(circle at 20% 80%, rgba(0, 210, 180, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(192, 192, 192, 0.05) 0%, transparent 50%)',
      },
    },
  },
  plugins: [animate],
} satisfies Config;

export default config;

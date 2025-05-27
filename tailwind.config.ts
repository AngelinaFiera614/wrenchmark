
import { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";
import animate from "tailwindcss-animate";

const config = {
  darkMode: "class",
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
        // Smoked Metal Teal Design System
        background: {
          DEFAULT: "var(--background)",
          alt: "var(--background-alt)",
        },
        foreground: "var(--foreground)",
        glass: "var(--glass)",
        
        // Border colors
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        
        // Primary teal system
        primary: {
          DEFAULT: "var(--primary)",
          dark: "var(--primary-dark)",
          glow: "var(--primary-glow)",
          foreground: "var(--primary-foreground)",
        },
        
        // Secondary metallic system
        secondary: {
          DEFAULT: "var(--secondary)",
          muted: "var(--secondary-muted)",
          foreground: "var(--secondary-foreground)",
        },
        
        // Metallic effects
        metallic: {
          glow: "var(--metallic-glow)",
        },
        
        // Legacy shadcn compatibility
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
          teal: "var(--primary)",
          "teal-hover": "var(--primary-dark)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        sidebar: {
          background: "var(--sidebar-background)",
          foreground: "var(--sidebar-foreground)",
          primary: "var(--sidebar-primary)",
          "primary-foreground": "var(--sidebar-primary-foreground)",
          accent: "var(--sidebar-accent)",
          "accent-foreground": "var(--sidebar-accent-foreground)",
          border: "var(--sidebar-border)",
          ring: "var(--sidebar-ring)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      fontFamily: {
        sans: ["Inter", ...fontFamily.sans],
      },
      backdropBlur: {
        xs: "2px",
        sm: "4px",
        md: "12px",
        lg: "16px",
        xl: "24px",
        "2xl": "40px",
        "3xl": "64px",
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'metallic': '0 4px 20px 0 rgba(209, 213, 219, 0.15)',
        'teal-glow': '0 0 20px rgba(0, 179, 179, 0.3)',
        'teal-glow-lg': '0 0 40px rgba(0, 179, 179, 0.4)',
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
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(0, 179, 179, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(0, 179, 179, 0.6)" },
        },
        "glass-shimmer": {
          "0%": { background: "rgba(255, 255, 255, 0.05)" },
          "50%": { background: "rgba(255, 255, 255, 0.1)" },
          "100%": { background: "rgba(255, 255, 255, 0.05)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "glass-shimmer": "glass-shimmer 3s ease-in-out infinite",
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-dark': 'linear-gradient(135deg, #0f1115 0%, #1a1c20 100%)',
        'gradient-metallic': 'linear-gradient(135deg, rgba(209,213,219,0.1) 0%, rgba(156,163,175,0.05) 100%)',
      },
    },
  },
  plugins: [
    animate,
    function({ addComponents, addUtilities }) {
      // Component presets for Smoked Metal Teal design system
      addComponents({
        // Glass card component
        '.card': {
          '@apply bg-glass backdrop-blur-md border border-border rounded-2xl shadow-glass text-white': {},
        },
        '.card-hover': {
          '@apply card hover:bg-metallic-glow hover:border-primary/30 transition-all duration-300': {},
        },
        
        // Primary teal button
        '.button-primary': {
          '@apply bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg shadow-teal-glow transition-all duration-200 font-medium': {},
          '&:hover': {
            '@apply shadow-teal-glow-lg transform scale-105': {},
          },
        },
        
        // Secondary glass button
        '.button-secondary': {
          '@apply bg-glass text-secondary border border-border hover:border-primary hover:text-primary px-6 py-3 rounded-lg backdrop-blur-sm transition-all duration-200': {},
        },
        
        // Metallic outline button
        '.button-metallic': {
          '@apply bg-transparent text-secondary border border-secondary/30 hover:border-secondary hover:bg-metallic-glow px-6 py-3 rounded-lg transition-all duration-200': {},
        },
        
        // Modal/dialog component
        '.modal': {
          '@apply bg-glass backdrop-blur-lg p-6 rounded-2xl shadow-2xl border border-border text-white max-w-md w-full': {},
        },
        
        // Table styling
        '.table-metallic': {
          '@apply bg-background-alt border border-border text-secondary rounded-xl overflow-hidden': {},
          'th': {
            '@apply bg-metallic-glow text-white font-semibold px-4 py-3 border-b border-border': {},
          },
          'td': {
            '@apply px-4 py-3 border-b border-border/50': {},
          },
          'tr:hover': {
            '@apply bg-glass': {},
          },
        },
        
        // Navigation components
        '.nav-glass': {
          '@apply bg-glass backdrop-blur-md border-b border-border': {},
        },
        
        // Input components
        '.input-glass': {
          '@apply bg-glass border border-border text-white placeholder-secondary-muted rounded-lg px-4 py-2 backdrop-blur-sm focus:border-primary focus:ring-2 focus:ring-primary-glow transition-all': {},
        },
      });

      // Utility classes
      addUtilities({
        // Glass morphism utilities
        '.glass-morphism': {
          'background': 'rgba(255, 255, 255, 0.05)',
          'backdrop-filter': 'blur(12px)',
          'border': '1px solid rgba(255, 255, 255, 0.1)',
          'box-shadow': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        },
        
        // Text gradients
        '.text-gradient-teal': {
          'background': 'linear-gradient(135deg, #00b3b3 0%, #00d9d9 100%)',
          'background-clip': 'text',
          'color': 'transparent',
        },
        
        '.text-gradient-metallic': {
          'background': 'linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%)',
          'background-clip': 'text',
          'color': 'transparent',
        },
        
        // Layout utilities
        '.container-glass': {
          '@apply max-w-6xl mx-auto px-6 py-4': {},
        },
        
        '.spacing-generous': {
          '@apply px-6 py-4 gap-4': {},
        },
        
        // Animation utilities
        '.hover-lift': {
          '@apply hover:transform hover:scale-105 transition-transform duration-200': {},
        },
        
        '.glow-on-hover': {
          '@apply hover:shadow-teal-glow transition-shadow duration-300': {},
        },
      });
    },
  ],
} satisfies Config;

export default config;

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "media",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        "background-secondary": "var(--background-secondary)",
        "background-tertiary": "var(--background-tertiary)",
        "card-background": "var(--card-background)",
        
        // Brand & System
        brand: {
          teal: "var(--brand-teal)",
          blue: "var(--apple-blue)",
          "blue-focus": "var(--apple-blue-focus)",
          "blue-dark": "var(--apple-blue-dark)",
        },
        
        system: {
          red: "var(--system-red)",
          orange: "var(--system-orange)",
          green: "var(--system-green)",
          gray: "var(--system-gray)",
          purple: "var(--system-purple)",
        },
        
        // Inks
        ink: "var(--ink)",
        "ink-muted": "var(--ink-muted)",
        "ink-muted-80": "var(--ink-muted-80)",
        
        // Borders
        "border-soft": "var(--border-soft)",
        "border-hairline": "var(--border-hairline)",
        
        // Apple dark tile surfaces
        tile: {
          "1": "var(--surface-tile-1)",
          "2": "var(--surface-tile-2)",
          "3": "var(--surface-tile-3)",
          black: "var(--surface-black)",
        }
      },
      borderRadius: {
        "apple-sm": "var(--apple-radius-sm)",
        "apple-md": "var(--apple-radius-md)",
        "apple-lg": "var(--apple-radius-lg)",
        "apple-pill": "var(--apple-radius-pill)",
      },
      fontFamily: {
        display: ["var(--font-sf-display)", "Inter", "system-ui", "-apple-system", "sans-serif"],
        body: ["var(--font-sf-text)", "Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      boxShadow: {
        product: "var(--shadow-product)",
        overlay: "var(--shadow-overlay)",
      },
      spacing: {
        xxs: "4px",
        xs: "8px",
        sm: "12px",
        md: "17px",
        lg: "24px",
        xl: "32px",
        xxl: "48px",
        section: "80px",
      }
    },
  },
  plugins: [],
};
export default config;

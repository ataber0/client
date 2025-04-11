export const theme = {
  background: "#161a1e",
  surface: "#21262d",
  onSurface: "#ffffff",
  primary: "#FF4F00",
  secondary: "#501361",
};

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "../../packages/*/src/**/*.{js,ts,jsx,tsx}",
  ],
  plugins: [
    // Set a default value on the `:root` element
    ({ addBase }) =>
      addBase({
        ":root": {
          "--color-background": theme.background,
          "--color-surface": theme.surface,
          "--color-on-surface": theme.onSurface,
          "--color-primary": theme.primary,
          "--color-secondary": theme.secondary,
        },
      }),
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--color-background)",
        surface: "var(--color-surface)",
        "on-surface": "var(--color-on-surface)",
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
      },
    },
  },
};

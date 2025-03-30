export const theme = {
  background: "#f9fafb",
  surface: "#fff",
  primary: "#FF4F00",
  secondary: "#501361",
};

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  plugins: [
    // Set a default value on the `:root` element
    ({ addBase }) =>
      addBase({
        ":root": {
          "--color-background": theme.background,
          "--color-surface": theme.surface,
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
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
      },
    },
  },
};

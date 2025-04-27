/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "100%",
            a: {
              color: "var(--tw-prose-links)",
              textDecoration: "underline",
              fontWeight: "500",
            },
            code: {
              color: "var(--tw-prose-code)",
              backgroundColor: "var(--tw-prose-pre-bg)",
              padding: "0.25rem",
              borderRadius: "0.25rem",
              fontWeight: "400",
            },
          },
        },
      },
    },
  },
};

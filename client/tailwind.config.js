/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sports: {
          navy: '#0A192F',       // Primary Deep Navy
          navyLight: '#112240',  // Lighter Navy for secondary containers
          blue: '#1D4ED8',       // Accent Blue
          blueLight: '#3B82F6',  // Light Accent Blue
          grayBg: '#F3F4F6',     // Light Gray Background
          cardBg: '#FFFFFF',     // Pure White Cards
          success: '#10B981',    // Green
          danger: '#EF4444',     // Red
          muted: '#6B7280'       // Cool Muted Gray
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif'],
      },
      boxShadow: {
        premium: '0 4px 20px -2px rgba(10, 25, 47, 0.08), 0 2px 8px -1px rgba(10, 25, 47, 0.04)',
        premiumHover: '0 10px 30px -5px rgba(10, 25, 47, 0.15), 0 4px 12px -2px rgba(10, 25, 47, 0.08)',
      }
    },
  },
  plugins: [],
}

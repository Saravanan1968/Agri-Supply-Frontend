/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#818CF8', // Indigo 400
          DEFAULT: '#4F46E5', // Indigo 600
          dark: '#3730A3', // Indigo 800
        },
        secondary: {
          light: '#22D3EE', // Cyan 400
          DEFAULT: '#06B6D4', // Cyan 500
          dark: '#0891B2', // Cyan 600
        },
        background: {
          DEFAULT: '#0F172A', // Slate 900
          darker: '#020617', // Slate 950
          lighter: '#1E293B', // Slate 800
        },
        glass: {
          DEFAULT: 'rgba(255, 255, 255, 0.05)',
          hover: 'rgba(255, 255, 255, 0.1)',
          border: 'rgba(255, 255, 255, 0.1)',
        }
      },
      fontFamily: {
        heading: ['Poppins', 'Inter', 'sans-serif'],
        body: ['Inter', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
      boxShadow: {
        'glass': '0 4px 30px rgba(0, 0, 0, 0.1)',
        'glow': '0 0 15px rgba(79, 70, 229, 0.5)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(to right, #4F46E5, #7C3AED, #2563EB)',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
}

import type { Config } from 'tailwindcss'
import { theme } from './src/lib/theme'

export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  // @ts-ignore NativeWind preset exports as CommonJS
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: theme.colors,
    },
  },
  plugins: [],
} satisfies Config

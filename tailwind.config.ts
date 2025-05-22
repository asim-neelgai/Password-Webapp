import type { Config } from 'tailwindcss'
import type { Config as DaisyuiConfig } from 'daisyui'

const daisyui: DaisyuiConfig = {
  base: false,
  themes: [
    {
      fortLock: {
        primary: '#2B4EBC',
        secondary: '#E8E8E8',
        accent: '#c1cef9',
        neutral: '#070403',
        'base-100': '#FFFFFF',
        // info: '#1395ff',
        // success: '#00B23D', // figma
        success: '#00823D', // modified
        warning: '#F07129',
        error: '#EB2121'
      }
    }
  ]
}

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          1: '#E8E8E8',
          2: '#F8F8F8',
          3: '#F3F6FF'
        },
        darkblue: '#203A8D',
        darkerblue: '#00002E',
        blacks: '#121A30',
        warning: '#F07129',
        bluecolor: '#E1E7FC',
        darkBlue: '#3661EB',
        ternary: '#2949B0',
        bordergray: '#EEE'
      },
      height: {
        780: '780px',
        800: '800px',
        850: '850px',
        900: '900px',
        1000: '1000px',
        300: '300px',
        400: '400px',
        510: '510px',
        450: '450px',
        500: '480px'
      },
      width: {
        460: '460px',
        625: '625px',
        800: '800px',
        1100: '1100px'
      },
      fontSize: {
        3.5: '56px',
        2: '32px'
      }
    }
  },
  plugins: [require('daisyui')],
  daisyui
}
export default config

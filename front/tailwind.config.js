/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line no-undef
module.exports = {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
  	extend: {
  		colors: {
  			primary: {
  				'50': '#f1f5fd',
  				'100': '#e0e8f9',
  				'200': '#c9d7f4',
  				'300': '#a3bded',
  				'400': '#789ae2',
  				'500': '#587ad9',
  				'600': '#435ecd',
  				'700': '#3b4ec0',
  				'800': '#344099',
  				'900': '#2f3979',
  				'950': '#20254b',
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				'50': '#fff8eb',
  				'100': '#fdebc8',
  				'200': '#fad68d',
  				'300': '#f8be59',
  				'400': '#f6a229',
  				'500': '#ef8011',
  				'600': '#d45d0b',
  				'700': '#b03f0d',
  				'800': '#8f3111',
  				'900': '#752912',
  				'950': '#431205',
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			base: {
  				'50': '#fafafa',
  				'100': '#f2f4f5',
  				'200': '#e8eaec',
  				'300': '#d6dadc',
  				'400': '#bbc1c5',
  				'500': '#a4acb2',
  				'600': '#868f97',
  				'700': '#707880',
  				'800': '#5e656b',
  				'900': '#4d5256',
  				'950': '#31363a'
  			},
  			danger: {
  				'50': '#fff0f0',
  				'100': '#ffdede',
  				'200': '#ffc3c3',
  				'300': '#ff9a9a',
  				'400': '#ff6060',
  				'500': '#ff2e2e',
  				'600': '#f41f1f',
  				'700': '#cd0808',
  				'800': '#a90b0b',
  				'900': '#8b1111',
  				'950': '#4d0202'
  			},
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
  corePlugins: {
    preflight: false,
  },
};

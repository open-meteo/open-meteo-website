import { fontFamily } from 'tailwindcss/defaultTheme';
import type { Config } from 'tailwindcss';

const config: Config = {
	darkMode: 'class',
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		screens: {
			sm: '640px',
			md: '768px',
			lg: '1024px',
			xl: '1280px',
			'2xl': '1536px'
		},
		container: {
			center: true,
			padding: '1.5rem',
			screens: {
				lg: '996px',
				xl: '1100px',
				'2xl': '1400px'
			}
		},
		extend: {
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			colors: {
				link: 'hsl(var(--link) / <alpha-value>)',
				border: 'hsl(var(--border) / <alpha-value>)',
				'border-dark': 'hsl(var(--border-dark) / <alpha-value>)',
				input: 'hsl(var(--input) / <alpha-value>)',
				ring: 'hsl(var(--ring) / <alpha-value>)',
				background: 'hsl(var(--background) / <alpha-value>)',
				foreground: 'hsl(var(--foreground) / <alpha-value>)',
				primary: {
					DEFAULT: 'hsl(var(--primary) / <alpha-value>)',
					foreground: 'hsl(var(--primary-foreground) / <alpha-value>)'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary) / <alpha-value>)',
					foreground: 'hsl(var(--secondary-foreground) / <alpha-value>)'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive) / <alpha-value>)',
					foreground: 'hsl(var(--destructive-foreground) / <alpha-value>)'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted) / <alpha-value>)',
					foreground: 'hsl(var(--muted-foreground) / <alpha-value>)'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent) / <alpha-value>)',
					foreground: 'hsl(var(--accent-foreground) / <alpha-value>)'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover) / <alpha-value>)',
					foreground: 'hsl(var(--popover-foreground) / <alpha-value>)'
				},
				grey: {
					DEFAULT: 'hsl(var(--grey) / <alpha-value>)',
					foreground: 'hsl(var(--grey-foreground) / <alpha-value>)'
				},
				card: {
					DEFAULT: 'hsl(var(--card) / <alpha-value>)',
					foreground: 'hsl(var(--card-foreground) / <alpha-value>)'
				},
				warning: {
					DEFAULT: 'hsl(var(--warning) / <alpha-value>)',
					dark: 'hsl(var(--warning-dark) / <alpha-value>)',
					foreground: 'hsl(var(--warning-foreground) / <alpha-value>)'
				}
			},
			fontFamily: {
				sans: [...fontFamily.sans]
			},
			fontSize: {
				xxs: '11px'
			},
			textUnderlineOffset: {
				3: '3px'
			}
		}
	}
};

export default config;

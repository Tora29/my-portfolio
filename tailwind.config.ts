import daisyui from 'daisyui';
import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	daisyui: {
		themes: [
			{
				light: {
					primary: '#784F22',
					secondary: '#E68320',
					accent: '#E3CA19',
					neutral: '#838286',
					'base-100': '#F4F4F4'
				},
				dark: {
					primary: '#1C2124',
					secondary: '#252837',
					accent: '#6F634C',
					neutral: '#C7C3BB',
					'base-100': '#F4F4F4'
				}
			}
		]
	},
	theme: {
		extend: {
			screens: {
				sm: '640px',
				md: '768px',
				lg: '1024px',
				xl: '1280px'
			}
		}
	},
	plugins: [daisyui]
} satisfies Config;

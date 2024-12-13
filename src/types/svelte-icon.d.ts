declare module '@jamescoyle/svelte-icon' {
	import { SvelteComponentTyped } from 'svelte';

	export interface SvgIconProps {
		type?: string;
		path?: string;
		size?: string | number;
		color?: string;
		'aria-label'?: string;
		role?: string;
	}

	export default class SvgIcon extends SvelteComponentTyped<SvgIconProps> {}
}

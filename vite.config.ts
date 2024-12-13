import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

/// <reference types="vitest" />
// https://github.com/sveltejs/svelte/issues/11394
export default defineConfig(({ mode }) => ({
	plugins: [sveltekit()],
	test: {
		globals: true,
		environment: 'jsdom',
		include: ['src/**/*.test.ts']
	},
	resolve: {
		conditions: mode === 'test' ? ['browser'] : []
	}
}));

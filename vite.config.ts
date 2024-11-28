import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

/// <reference types="vitest" />
export default defineConfig({
	plugins: [sveltekit()],
	test: {
		globals: true,
		environment: 'jsdom',
		include: ['src/**/*.test.ts']
	}
});

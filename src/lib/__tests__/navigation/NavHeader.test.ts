import { render, screen } from '@testing-library/svelte';
import { describe, test, expect } from 'vitest';
import '@testing-library/jest-dom';

import NavHeader from '$lib/components/navigation/NavHeader.svelte';

describe('NavHeader Component', () => {
	test('ロゴが正しく表示されるか', () => {
		render(NavHeader);

		// ロゴ要素を検証
		const logoElements = [
			{ text: 'Tora', className: 'text-neutral' },
			{ text: '29', className: 'text-accent' },
		];

		logoElements.forEach(({ text, className }) => {
			const logoElement = screen.getByText(text);
			expect(logoElement).toBeInTheDocument();
			expect(logoElement).toHaveClass(className);
		});
	});

	test('ヘッダーメニューとアイコンが正しく表示されるか', () => {
		render(NavHeader);

		// メニュー要素とアイコンを検証
		const menuItems = [
			{ text: 'ABOUT ME', icon: 'Account Icon' },
			{ text: 'WORK', icon: 'Work Icon' },
			{ text: 'HISTORY', icon: 'History Icon' },
			{ text: 'BLOG', icon: 'Blog Icon' },
			{ text: 'CONTACT', icon: 'Contact Icon' },
			{ text: 'GitHub', icon: 'GitHub Icon' },
		];

		menuItems.forEach(({ text, icon }) => {
			const menuElement = screen.getByText(text);
			expect(menuElement).toBeInTheDocument();

			const iconElement = screen.getByRole('img', { name: new RegExp(icon, 'i') });
			expect(iconElement).toBeInTheDocument();
		});
	});
});

<script>
	import IconHamburger from '$lib/icons/IconHamburger.svelte';
	import IconAccount from '$lib/icons/IconAccount.svelte';
	import IconWork from '$lib/icons/IconWork.svelte';
	import IconHistory from '$lib/icons/IconHistory.svelte';
	import IconBlog from '$lib/icons/IconBlog.svelte';
	import IconContact from '$lib/icons/IconContact.svelte';
	import IconGithub from '$lib/icons/IconGithub.svelte';

	// メニュー項目データ
	const menuItems = [
		{ icon: IconAccount, label: 'ABOUT ME', link: '#about' },
		{ icon: IconWork, label: 'WORK', link: '#work' },
		{ icon: IconHistory, label: 'HISTORY', link: '#history' },
		{ icon: IconBlog, label: 'BLOG', link: '#blog' },
		{ icon: IconContact, label: 'CONTACT', link: '#contact' },
		{ icon: IconGithub, label: 'GitHub', link: 'https://github.com/Tora29' }
	];
</script>

<!-- ヘッダー -->
<header class="bg-primary text-neutral">
	<div class="grid h-20 grid-cols-12 items-center gap-4 px-20">
		<!-- ロゴ -->
		<div class="col-span-2">
			<a href="/" class="flex items-center text-4xl font-bold">
				<span class="text-neutral">Tora</span>
				<span class="text-accent">29</span>
			</a>
		</div>

		<!-- ナビゲーションメニュー -->
		<div class="col-span-6 col-start-7 hidden justify-between md:flex">
			{#each menuItems as item}
				<a
					href={item.link}
					target={item.label === 'GitHub' ? '_blank' : '_self'}
					class="flex w-28 flex-col items-center whitespace-nowrap rounded py-3 text-center hover:bg-gray-700"
				>
					<svelte:component this={item.icon} />
					<span class="text-sm">{item.label}</span>
				</a>
			{/each}
		</div>

		<!-- ハンバーガーメニュー -->
		<div class="col-span-10 flex justify-end md:hidden">
			<button class="btn btn-square btn-ghost" aria-label="Menu">
				<IconHamburger />
			</button>
		</div>
	</div>
</header>

<script>
  import IconHamburger from '$lib/icons/IconHamburger.svelte';
</script>

<!-- ヘッダー -->
<header class="bg-primary text-white">
	<div class="grid h-20 grid-cols-12 items-center gap-4 px-20">
		<!-- ロゴ -->
		<div class="col-span-2">
			<a class="text-4xl font-bold flex items-center" href="/">
				<span class="text-neutral">Tora</span>
				<span class="text-accent">29</span>
			</a>
		</div>

		<!-- ナビゲーションメニュー -->
		<div class="col-span-9"></div>

		<!-- ハンバーガーメニュー -->
		<div class="col-span-1 flex justify-end">
			<button class="btn btn-square btn-ghost" aria-label="Menu">
				<IconHamburger />
			</button>
		</div>
	</div>
</header>

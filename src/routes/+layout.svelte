<script>
	import '../app.css';
	import NavHeader from '$lib/components/navigation/NavHeader.svelte';
	import DisplayMainLogo from '$lib/components/display/DisplayMainLogo.svelte';
	let { children } = $props();
</script>

<NavHeader />
<DisplayMainLogo />
<div class="bg-primary min-h-screen">
	{@render children()}
</div>

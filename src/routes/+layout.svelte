<script>
	import '../app.css';
	import NavHeader from '$lib/components/navigation/NavHeader.svelte';
	import DisplayMainLogo from '$lib/components/Display/DisplayMainLogo.svelte';

	let { children } = $props();
</script>

<NavHeader />
<DisplayMainLogo />
{@render children()}

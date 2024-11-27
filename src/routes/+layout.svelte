<script>
	import '../app.css';
	import NavHeader from '$lib/components/navigation/NavHeader.svelte';

	let { children } = $props();
</script>

<NavHeader />
{@render children()}

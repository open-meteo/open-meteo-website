<script lang="ts">
	import { page } from '$app/state';
	import { i18n } from '$lib/i18n';
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';

	import { ModeWatcher } from 'mode-watcher';

	import Hero from '$lib/components/hero/hero.svelte';
	import Header from '$lib/components/header/header.svelte';
	import Footer from '$lib/components/footer/footer.svelte';

	import '../app.css';

	let { children, data } = $props();

	const pathname = $derived(data.pathname);
</script>

<ParaglideJS {i18n}>
	<Header {pathname} />
	<Hero {...page.data} />
	{@render children()}
	<Footer />
	<ModeWatcher />
</ParaglideJS>

<script lang="ts">
	import { ModeWatcher } from 'mode-watcher';

	import { page } from '$app/state';

	import Hero from '$lib/components/hero/hero.svelte';
	import Header from '$lib/components/header/header.svelte';
	import Footer from '$lib/components/footer/footer.svelte';

	import UpdateNotification from '$lib/components/update/update-notification.svelte';

	import '../app.css';

	import './perf';

	let { children, data } = $props();

	const pathname = $derived(data.pathname);
</script>

<Header {pathname} />
<Hero {...page.data} />
{@render children()}
<Footer />
<ModeWatcher />
<UpdateNotification />

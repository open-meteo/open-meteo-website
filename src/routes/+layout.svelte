<script lang="ts">
	import { ModeWatcher } from 'mode-watcher';

	import { beforeNavigate, onNavigate } from '$app/navigation';
	import { page } from '$app/state';

	import Footer from '$lib/components/footer/footer.svelte';
	import Header from '$lib/components/header/header.svelte';
	import Hero from '$lib/components/hero/hero.svelte';
	import Loading from '$lib/components/loading/loading.svelte';
	import UpdateNotification from '$lib/components/update/update-notification.svelte';

	import '../app.css';

	let { children, data } = $props();

	const pathname = $derived(data.pathname);

	let loading = $state(false);
	let loadingTimeout: ReturnType<typeof setTimeout> | undefined;
	onNavigate(async (navigation) => {
		if (loadingTimeout) clearTimeout(loadingTimeout);
		loading = false;

		if (!document.startViewTransition) return;
		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();

				await navigation.complete;
			});
		});
	});

	beforeNavigate(() => {
		loadingTimeout = setTimeout(() => {
			loading = true;
		}, 300);
	});
</script>

<Header {pathname} />
{#if loading}
	<Loading />
{/if}
<Hero {...page.data as any} />
{@render children()}
<Footer />
<ModeWatcher />
<UpdateNotification />

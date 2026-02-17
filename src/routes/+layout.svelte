<script lang="ts">
	import { onMount } from 'svelte';

	import { ModeWatcher } from 'mode-watcher';

	import { browser } from '$app/environment';
	import { afterNavigate, beforeNavigate, onNavigate } from '$app/navigation';
	import { page } from '$app/state';

	import Footer from '$lib/components/footer/footer.svelte';
	import Header from '$lib/components/header/header.svelte';
	import Hero from '$lib/components/hero/hero.svelte';
	import Loading from '$lib/components/loading/loading.svelte';
	import UpdateNotification from '$lib/components/update/update-notification.svelte';

	import '../app.css';

	import type { AfterNavigate, BeforeNavigate, OnNavigate } from '@sveltejs/kit';

	let { children, data } = $props();

	const fromNotTo = (navigation: BeforeNavigate | OnNavigate | AfterNavigate) => {
		return navigation.from && navigation.to && navigation.from.route.id !== navigation.to.route.id;
	};

	const pathname = $derived(data.pathname);

	let loading = $state(false);
	let loadingTimeout: ReturnType<typeof setTimeout> | undefined;
	onNavigate(async (e) => {
		if (loadingTimeout) clearTimeout(loadingTimeout);
		loading = false;

		if (browser) {
			if (fromNotTo(e)) {
				if (!document.startViewTransition) return;
				return new Promise((resolve) => {
					document.startViewTransition(async () => {
						resolve();

						await e.complete;
					});
				});
			}
		}
	});

	beforeNavigate((e) => {
		if (fromNotTo(e)) {
			loadingTimeout = setTimeout(() => {
				loading = true;
			}, 300);
		}
	});

	afterNavigate((e) => {
		if (browser) {
			if (fromNotTo(e) && !window.location.hash) {
				setTimeout(() => {
					window.scrollTo(0, 0);
				}, 75);
			}
		}
	});

	onMount(() => {
		if (browser) {
			window.addEventListener('pagehide', () => {
				loading = false;
			});
		}
	});
</script>

<Header {pathname} />
{#if loading}
	<Loading />
{/if}
<main>
	<Hero {...page.data as any} />
	{@render children()}
</main>
<Footer />
<ModeWatcher />
<UpdateNotification />

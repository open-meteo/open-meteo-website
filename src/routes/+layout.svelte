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

	// Gecko's view-transition rendering is unreliable for this hero setup: it
	// presents live document frames while the update callback runs, and its
	// compositor strobes white frames while animating the hero snapshots
	// (verified frame by frame in Firefox 151/152). Skip view transitions
	// there — Firefox still animates the hero height, which is plain CSS on
	// the live element, and pages simply swap in place.
	const isGecko = browser && CSS.supports('-moz-appearance', 'none');

	// The view transition cross-fades to the live hero element, so the incoming
	// hero image must be decoded before the new state is captured — otherwise
	// the page background flashes through until the download finishes. Capped
	// so a slow connection doesn't freeze the old page for too long.
	const waitForHeroImage = () => {
		const heroImage = page.data.heroImage;
		if (!heroImage) return;
		const img = new Image();
		img.src = heroImage;
		return Promise.race([
			img.decode().catch(() => {}),
			new Promise((resolve) => setTimeout(resolve, 1000))
		]);
	};

	onNavigate(async (e) => {
		if (loadingTimeout) clearTimeout(loadingTimeout);
		loading = false;

		if (browser) {
			if (fromNotTo(e)) {
				if (!document.startViewTransition || isGecko) return;
				return new Promise((resolve) => {
					document.startViewTransition(async () => {
						resolve();

						await e.complete;
						await waitForHeroImage();
					});
				});
			}
		}
	});

	beforeNavigate((e) => {
		if (
			fromNotTo(e) &&
			!e?.to?.url?.href.includes('&format=xlsx') &&
			!e?.to?.url?.href.includes('&format=csv')
		) {
			loadingTimeout = setTimeout(() => {
				loading = true;
			}, 300);
		}
	});

	afterNavigate((e) => {
		if (browser) {
			if (fromNotTo(e) && !window.location.hash && e.type !== 'popstate') {
				setTimeout(() => {
					window.scrollTo(0, 0);
				}, 75);
			}
		}
	});

	onMount(() => {
		if (browser) {
			// Reset the overlay when leaving the page or when it's restored from the
			// bfcache. Navigating to an external page (e.g. the maps app) can freeze this
			// document with a pending `beforeNavigate` timeout still queued; on browser-back
			// the page is restored and that stale timer would otherwise re-show the loading
			// overlay with no navigation left to clear it.
			const resetLoading = () => {
				if (loadingTimeout) clearTimeout(loadingTimeout);
				loading = false;
			};
			window.addEventListener('pagehide', resetLoading);
			window.addEventListener('pageshow', (e) => {
				if (e.persisted) resetLoading();
			});
		}
	});
</script>

<Header {pathname} />
{#if loading}
	<Loading onclose={() => (loading = false)} />
{/if}
<main>
	<!-- eslint-disable-next-line @typescript-eslint/no-explicit-any -->
	<Hero {...page.data as any} />
	{@render children()}
</main>
<Footer />
<ModeWatcher />
<UpdateNotification />

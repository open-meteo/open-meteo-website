<script lang="ts">
	import { fade } from 'svelte/transition';

	import { ModeWatcher } from 'mode-watcher';

	import { beforeNavigate, onNavigate } from '$app/navigation';
	import { page } from '$app/state';

	import Footer from '$lib/components/footer/footer.svelte';
	import Header from '$lib/components/header/header.svelte';
	import Hero from '$lib/components/hero/hero.svelte';
	import UpdateNotification from '$lib/components/update/update-notification.svelte';

	import '../app.css';

	let { children, data } = $props();

	const pathname = $derived(data.pathname);

	let loading = $state(false);
	onNavigate(async (navigation) => {
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
		loading = true;
	});
</script>

<Header {pathname} />
<Hero {...page.data} />
{@render children()}
{#if loading}
	<div
		in:fade={{ delay: 300, duration: 300 }}
		out:fade={{ duration: 100 }}
		class="fixed w-full h-full bg-foreground/25 z-10 top-0 flex items-center justify-center"
	>
		<svg
			class="lucide lucide-loader-circle animate-spin"
			xmlns="http://www.w3.org/2000/svg"
			width="40"
			height="40"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<path d="M21 12a9 9 0 1 1-6.219-8.56" />
		</svg>
		<span class="hidden">Loading...</span>
	</div>
{/if}
<Footer />
<ModeWatcher />
<UpdateNotification />

<style>
	@keyframes fade-in {
		from {
			opacity: 0;
		}
	}

	@keyframes fade-out {
		to {
			opacity: 0;
		}
	}

	@keyframes slide-from-right {
		from {
			transform: translateX(30px);
		}
	}

	@keyframes slide-to-left {
		to {
			transform: translateX(-30px);
		}
	}

	@media (prefers-reduced-motion: no-preference) {
		:root::view-transition-old(root) {
			animation:
				90ms cubic-bezier(0.4, 0, 1, 1) both fade-out,
				300ms cubic-bezier(0.4, 0, 0.2, 1) both slide-to-left;
		}

		:root::view-transition-new(root) {
			animation:
				210ms cubic-bezier(0, 0, 0.2, 1) 90ms both fade-in,
				300ms cubic-bezier(0.4, 0, 0.2, 1) both slide-from-right;
		}
	}
</style>

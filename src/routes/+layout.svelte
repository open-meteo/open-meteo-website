<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { theme, themeIsDark } from '$lib/stores';

	import type { Unsubscriber } from 'svelte/store';

	let updateThemeOnChange: ((this: MediaQueryList, ev: MediaQueryListEvent) => any) | undefined;
	let prefersDarkMode: MediaQueryList | undefined;
	let themeUnSubscriber: Unsubscriber | undefined;
	onMount(async () => {
		prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)');
		themeUnSubscriber = theme.subscribe((theme) => {
			switch (theme) {
				case 'auto':
					$themeIsDark = prefersDarkMode?.matches || false;
					break;
				case 'dark':
					$themeIsDark = true;
					break;
				case 'light':
					$themeIsDark = false;
					break;
			}
		});
		// Update the store if OS preference changes
		updateThemeOnChange = (e) => {
			if ($theme == 'auto') $themeIsDark = e.matches;
		};
		prefersDarkMode.addEventListener('change', updateThemeOnChange);
	});

	onDestroy(() => {
		if (prefersDarkMode && updateThemeOnChange) {
			prefersDarkMode.removeEventListener('change', updateThemeOnChange);
		}
		if (themeUnSubscriber) {
			themeUnSubscriber();
		}
	});

	let body: HTMLElement;
	const bindBody = (node: any) => (body = node);
	$: body?.setAttribute('data-bs-theme', $themeIsDark ? 'dark' : '');
</script>

<svelte:body use:bindBody />

<slot />

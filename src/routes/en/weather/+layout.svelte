<script lang="ts">
	import { dev } from '$app/environment';
	import { page } from '$app/state';
	import Button from '$lib/components/ui/button/button.svelte';
	import { type GeoLocation, storedLocation } from '$lib/stores/settings';
	import { geoLocationNameToRoute } from '$lib/utils/meteo';
	import { get } from 'svelte/store';

	let location = get(storedLocation);
	const locationRoute = geoLocationNameToRoute(location.name);

	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();

	const links = [
		{
			title: 'Weather Forecast',
			url: '/en/weather',
			children: [
				{
					title: 'Week Prediction',
					url:
						'/en/weather/week/' +
						(location.population
							? location.population > 543000
								? locationRoute
								: locationRoute + '_' + location.id
							: locationRoute + '_' + location.id)
				},
				{ title: 'Model Comparison', url: '/en/weather/compare' },
				{ title: '14 Day Weather', url: '/en/weather/14-day' }
			]
		}
	];

	let selectedPath = $derived.by(() => {
		for (const link of links) {
			if (link.children) {
				for (const l of link.children) {
					if (page.url.pathname.includes(l.url) || page.url.pathname.includes(l.url + '/')) {
						return l;
					}
				}
			}
			if (page.url.pathname === link.url || page.url.pathname === link.url + '/') {
				return link;
			}
		}
		return {};
	});

	let mobileNavOpened = $state(false);
</script>

<div class="mb-12 flex flex-col md:mb-24 md:flex-row">
	<aside class="w-full md:w-1/6 md:max-w-[400px] md:min-w-[230px]">
		<nav class="sticky top-0 flex flex-col p-6 pb-3 md:pr-3 md:pb-6">
			<Button
				variant="outline"
				class="flex justify-start p-3 md:hidden"
				onclick={() => {
					mobileNavOpened = !mobileNavOpened;
				}}
			>
				<svg
					class="lucide lucide-chevrons-up-down mr-2"
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="m7 15 5 5 5-5" />
					<path d="m7 9 5-5 5 5" />
				</svg><b>{selectedPath.title}</b>
			</Button>

			<ul
				class={`list-unstyled overflow-hidden duration-500 ${mobileNavOpened ? 'mt-2 max-h-[968px] md:max-h-[unset]' : 'max-h-0 md:max-h-[unset] '}`}
			>
				{#each links as link}
					<li
						class="my-[0.125rem] rounded-md border py-2 pr-2 pl-3 duration-300 {selectedPath.title ===
						link.title
							? 'border-border'
							: 'border-transparent'}"
					>
						<a
							class="flex items-center gap-1"
							href={link.url}
							onclick={() => {
								if (link.url != selectedPath.url) {
									mobileNavOpened = false;
								}
							}}
						>
							{link.title}</a
						>

						{#if link.children}
							<ul
								class={`list-unstyled ml-3 overflow-auto duration-500 ${
									selectedPath.url === link.url ||
									link.children.some((l) => l.url === selectedPath.url)
										? 'mt-2 mb-2 max-h-[700px]'
										: 'max-h-0'
								}`}
							>
								{#each link.children as l}
									<li
										class="truncate overflow-hidden rounded-md border p-1 py-1 pl-3 duration-300 {selectedPath.url ===
										l.url
											? 'border-border'
											: 'border-transparent'}"
									>
										<a
											href={l.url}
											onclick={() => {
												if (l.url != selectedPath.url) {
													mobileNavOpened = false;
												}
											}}
										>
											{l.title}</a
										>
									</li>
								{/each}
							</ul>
						{/if}
					</li>
				{/each}
			</ul>
		</nav>
	</aside>
	<div
		class="lg:max-w-unset flex flex-1 flex-col p-6 pt-0 md:max-w-[calc(100%-230px)] md:pt-6 md:pl-3"
	>
		{@render children?.()}
	</div>
</div>

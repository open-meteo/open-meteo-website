<script lang="ts">
	import { page } from '$app/state';

	import Button from '$lib/components/ui/button/button.svelte';

	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();

	const links: {
		title: string;
		url: string;
		children?: { title: string; url: string }[];
		mobileOnly?: boolean;
	}[] = [
		{
			title: 'Weather Forecast',
			url: '/en/docs',
			children: [
				{ title: 'DWD Germany', url: '/en/docs/dwd-api' },
				{ title: 'NOAA U.S.', url: '/en/docs/gfs-api' },
				{ title: 'Météo-France', url: '/en/docs/meteofrance-api' },
				{ title: 'ECMWF', url: '/en/docs/ecmwf-api' },
				{ title: 'UK Met Office', url: '/en/docs/ukmo-api' },
				{ title: 'KMA Korea', url: '/en/docs/kma-api' },
				{ title: 'JMA Japan', url: '/en/docs/jma-api' },
				{ title: 'MeteoSwiss', url: '/en/docs/meteoswiss-api' },
				{ title: 'MET Norway', url: '/en/docs/metno-api' },
				{ title: 'GEM Canada', url: '/en/docs/gem-api' },
				{ title: 'BOM Australia', url: '/en/docs/bom-api' },
				{ title: 'CMA China', url: '/en/docs/cma-api' },
				{ title: 'KNMI Netherlands', url: '/en/docs/knmi-api' },
				{ title: 'DMI Denmark', url: '/en/docs/dmi-api' },
				{ title: 'ItaliaMeteo', url: '/en/docs/italia-meteo-arpae-api' },
				{ title: 'GeoSphere Austria', url: '/en/docs/geosphere-austria-api' }
			]
		},
		{
			title: 'Historical Weather',
			url: '/en/docs/historical-weather-api',
			children: [
				{ title: 'Historical Forecast', url: '/en/docs/historical-forecast-api' },
				{ title: 'Single Runs', url: '/en/docs/single-runs-api' },
				{ title: 'Previous Model Runs', url: '/en/docs/previous-runs-api' }
			]
		},
		{
			title: 'Ensemble Models',
			url: '/en/docs/ensemble-api',
			children: [
				{ title: 'Ensemble Mean API', url: '/en/docs/ensemble-mean-api' },
				{ title: 'Google WeatherNext', url: '/en/docs/google-weathernext-api' }
			]
		},
		{ title: 'Seasonal Forecast', url: '/en/docs/seasonal-forecast-api' },
		{ title: 'Climate Change', url: '/en/docs/climate-api' },
		{ title: 'Marine Forecast', url: '/en/docs/marine-weather-api' },
		{ title: 'Air Quality', url: '/en/docs/air-quality-api' },
		{ title: 'Satellite Radiation', url: '/en/docs/satellite-radiation-api' },
		{ title: 'Geocoding', url: '/en/docs/geocoding-api' },
		{ title: 'Elevation', url: '/en/docs/elevation-api' },
		{ title: 'Flood', url: '/en/docs/flood-api' },
		{ title: 'Model Updates', url: '/en/docs/model-updates', mobileOnly: true }
	];

	interface Path {
		title: string;
		url: string;
		children?: {
			title: string;
			url: string;
		}[];
	}

	let selectedPath: Path = $derived.by(() => {
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
		return { title: '', url: '' };
	});

	let mobileNavOpened = $state(false);
</script>

<div class="mb-12 flex flex-col md:mb-24 md:flex-row">
	<aside class="w-full md:w-1/6 md:max-w-100 md:min-w-57.5">
		<nav
			aria-label="Documentation"
			class="sticky top-0 mb-3 flex flex-col overflow-hidden p-3 pt-6 pb-0 md:mb-0 md:max-h-screen md:overflow-auto md:pr-3 md:pb-3"
		>
			<Button
				variant="outline"
				class="flex justify-start p-3 md:hidden"
				aria-expanded={mobileNavOpened}
				aria-label="Documentation navigation: {selectedPath.title}"
				onclick={() => {
					mobileNavOpened = !mobileNavOpened;
				}}
			>
				<svg
					class="lucide lucide-chevrons-up-down"
					xmlns="http://www.w3.org/2000/svg"
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="m7 15 5 5 5-5" />
					<path d="m7 9 5-5 5 5" />
				</svg>
				<b>{selectedPath.title}</b>
			</Button>

			<div class="nav-collapse" class:expanded={mobileNavOpened}>
				<ul class="list-unstyled min-h-0 overflow-hidden">
					{#each links as link, i (i)}
						{@const sectionExpanded =
							!!link.children &&
							(selectedPath.url === link.url ||
								link.children.some((l) => l.url === selectedPath.url))}
						<li
							class="my-0.5 rounded-md border py-2 pr-2 pl-3 duration-450 max-md:first:mt-2 max-md:last:mb-3 {link.mobileOnly
								? 'md:hidden'
								: ''} {selectedPath.title === link.title
								? 'border-border'
								: 'border-transparent'} {sectionExpanded ? 'mb-3 pt-4' : ''}"
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
								{#if link.children}
									<svg
										class="lucide lucide-chevron-down text-muted-foreground shrink-0 transition-transform duration-450 {sectionExpanded
											? 'rotate-0'
											: '-rotate-90'}"
										xmlns="http://www.w3.org/2000/svg"
										width="16"
										height="16"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									>
										<path d="m6 9 6 6 6-6" />
									</svg>
								{:else}
									<!-- keeps titles aligned with caret-less items -->
									<span class="w-4 shrink-0"></span>
								{/if}
								{link.title}</a
							>

							{#if link.children}
								<div class="nav-collapse" class:expanded={sectionExpanded}>
									<ul class="list-unstyled ml-5 min-h-0 overflow-hidden">
										{#each link.children as l, j (j)}
											<li
												class="truncate overflow-hidden rounded-md border p-1.25 pl-3 duration-300 first:mt-2 last:mb-1 {selectedPath.url ===
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
								</div>
							{/if}
						</li>
					{/each}
				</ul>
			</div>
		</nav>
	</aside>
	<div
		class="docs-content lg:max-w-unset flex flex-1 flex-col p-6 pt-0 md:max-w-[calc(100%-230px)] md:pt-6 md:pl-3"
	>
		{@render children?.()}
	</div>
</div>

<style>
	/* Collapse by animating real content height (grid rows 0fr -> 1fr) instead
	   of a max-height guess, so every section expands at the same speed with no
	   dead time at the start or end of the animation. */
	.nav-collapse {
		display: grid;
		grid-template-rows: 0fr;
	}

	.nav-collapse.expanded {
		grid-template-rows: 1fr;
	}

	@media (prefers-reduced-motion: no-preference) {
		.nav-collapse {
			transition: grid-template-rows 450ms ease;
		}
	}

	/* the outer list only collapses behind the mobile toggle */
	@media (min-width: 768px) {
		nav > .nav-collapse {
			grid-template-rows: 1fr;
		}
	}
</style>

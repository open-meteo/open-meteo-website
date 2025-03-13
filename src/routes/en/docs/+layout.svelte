<script lang="ts">
	import { page } from '$app/state';
	import { dev } from '$app/environment';
	import { afterNavigate } from '$app/navigation';

	import { Button } from '$lib/components/ui/button';

	import Chevrons from 'lucide-static/icons/chevrons-up-down.svg?raw';

	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();

	const links = [
		{
			title: 'Weather Forecast',
			url: '/en/docs',
			children: [
				{ title: 'Historical Forecast', url: '/en/docs/historical-forecast-api' },
				{ title: 'Previous Model Runs', url: '/en/docs/previous-runs-api' },
				{ title: 'DWD Germany', url: '/en/docs/dwd-api' },
				{ title: 'NOAA U.S.', url: '/en/docs/gfs-api' },
				{ title: 'Météo-France', url: '/en/docs/meteofrance-api' },
				{ title: 'ECMWF', url: '/en/docs/ecmwf-api' },
				{ title: 'UK Met Office', url: '/en/docs/ukmo-api' },
				{ title: 'JMA Japan', url: '/en/docs/jma-api' },
				{ title: 'MET Norway', url: '/en/docs/metno-api' },
				{ title: 'GEM Canada', url: '/en/docs/gem-api' },
				{ title: 'BOM Australia', url: '/en/docs/bom-api' },
				{ title: 'CMA China', url: '/en/docs/cma-api' },
				{ title: 'KNMI Netherlands', url: '/en/docs/knmi-api' },
				{ title: 'DMI Denmark', url: '/en/docs/dmi-api' }
			]
		},
		{ title: 'Historical Weather', url: '/en/docs/historical-weather-api' },
		{ title: 'Ensemble Models', url: '/en/docs/ensemble-api' },
		{ title: 'Climate Change', url: '/en/docs/climate-api' },
		{ title: 'Marine Forecast', url: '/en/docs/marine-weather-api' },
		{ title: 'Air Quality', url: '/en/docs/air-quality-api' },
		{ title: 'Geocoding', url: '/en/docs/geocoding-api' },
		{ title: 'Elevation', url: '/en/docs/elevation-api' },
		{ title: 'Flood', url: '/en/docs/flood-api' }
	];
	if (dev) {
		links.push({ title: 'Seasonal Forecast API', url: '/en/docs/seasonal-forecast-api' });
		links.push({ title: 'Satellite Radiation API', url: '/en/docs/satellite-radiation-api' });
	}

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

	afterNavigate((e) => {
		if (!e.from || e.from.route.id !== e.to.route.id) {
			setTimeout(() => {
				window.scrollTo(0, 0);
			}, 100);
		}
	});
</script>

<div class="mb-12 flex flex-col md:mb-24 md:flex-row">
	<aside class="w-full md:w-1/6 md:min-w-[230px] md:max-w-[400px]">
		<nav class="sticky top-0 flex flex-col p-6 pb-3 md:pb-6 md:pr-3">
			<Button
				variant="outline"
				class="flex justify-start p-3 md:hidden"
				onclick={() => {
					mobileNavOpened = !mobileNavOpened;
				}}
			>
				<div class="[&_svg]:h-5 [&_svg]:w-5">
					{@html Chevrons}
				</div>
				<b>{selectedPath.title}</b>
			</Button>

			<ul
				class={`list-unstyled overflow-hidden duration-500 ${mobileNavOpened ? 'mt-2 max-h-[968px] md:max-h-[unset]' : 'max-h-0 md:max-h-[unset] '}`}
			>
				{#each links as link}
					<li
						class="my-[0.125rem] rounded-md border py-2 pl-3 pr-2 duration-300 {selectedPath.title ===
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
										? 'mb-2 mt-2 max-h-[700px]'
										: 'max-h-0'
								}`}
							>
								{#each link.children as l}
									<li
										class="rounded-md border p-1 pl-3 py-1 overflow-hidden truncate duration-300 {selectedPath.url ===
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
		class="flex flex-1 flex-col p-6 pt-0 md:max-w-[calc(100%-230px)] lg:max-w-unset md:pl-3 md:pt-6"
	>
		{@render children?.()}
	</div>
</div>

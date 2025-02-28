<script lang="ts">
	import { page } from '$app/state';
	import { browser, dev } from '$app/environment';

	import Button from '$lib/components/ui/button/button.svelte';
	import Chevrons from 'lucide-svelte/icons/chevrons-up-down';
	import ChevronRight from 'lucide-svelte/icons/chevron-right';

	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();

	const links = [
		{
			title: 'Weather Forecast',
			url: '/en/docs',
			children: [
				{
					title: 'Historical Forecast',
					url: '/en/docs/historical-forecast-api',
					anchors: [
						'#location_and_time',
						'#hourly_weather_variables',
						'#daily_weather_variables',
						'#settings',
						'#api_response',
						'#data_sources'
					]
				},
				{
					title: 'Previous Model Runs',
					url: '/en/docs/previous-runs-api',
					anchors: [
						'#location_and_time',
						'#hourly_weather_variables',
						'#settings',
						'#api_response',
						'#api_documentation'
					]
				},
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
			],
			anchors: [
				'#location_and_time',
				'#hourly_weather_variables',
				'#daily_weather_variables',
				'#current_weather',
				'#settings',
				'#api_response',
				'#data_sources',
				'#api_documentation',
				'#hourly_parameter_definition',
				'#15_minutely_parameter_definition',
				'#pressure_level_variables',
				'#daily_parameter_definition',
				'#json_return_object',
				'#errors',
				'#weather_variable_documentation'
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

	let extendAnchors = $state(false);
	let extendChildAnchors = $state(false);

	let activeAnchor = $state('');
	if (browser) {
		activeAnchor = window.location.hash;
		if (window.location.hash != '') {
			extendAnchors = true;
			extendChildAnchors = true;
		}
		$effect(() => {
			activeAnchor = window.location.hash;
		});
	}
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
				<Chevrons class="mr-2" /><b>{selectedPath.title}</b>
			</Button>

			<ul
				class={`list-unstyled overflow-hidden duration-500 ${mobileNavOpened ? 'mt-2 max-h-[800px] md:max-h-[unset]' : 'max-h-0 md:max-h-[unset] '}`}
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
								if (link.url == selectedPath.url) {
									extendAnchors = !extendAnchors;
								} else {
									extendAnchors = false;
									mobileNavOpened = false;
								}
							}}
						>
							{#if link.anchors && link.url == selectedPath.url}
								<ChevronRight size="18" class="duration-300 {extendAnchors ? 'rotate-90' : ''}" />
							{/if}{link.title}</a
						>
						{#if link.anchors && link.url == selectedPath.url}
							<ul
								class="flex max-h-0 flex-col overflow-hidden text-sm capitalize duration-300 {extendAnchors
									? 'max-h-[500px]'
									: ''}"
							>
								{#each link.anchors as anchor}
									<a class="pt-2" onclick={() => (activeAnchor = anchor)} href={anchor}
										>{anchor.replaceAll('_', ' ').replace('#', '')}</a
									>
								{/each}
							</ul>
						{/if}

						{#if link.children}
							<ul
								class={`list-unstyled ml-3 overflow-hidden duration-500 ${
									selectedPath.url === link.url ||
									link.children.some((l) => l.url === selectedPath.url)
										? 'mb-2 mt-2 max-h-[500px]'
										: 'max-h-0'
								}`}
							>
								{#each link.children as l}
									<li
										class="rounded-md border p-1 pl-3 duration-300 {selectedPath.url === l.url
											? 'border-border'
											: 'border-transparent'}"
									>
										<a
											href={l.url}
											class="my-1 flex items-center gap-1"
											onclick={() => {
												if (l.url == selectedPath.url) {
													extendChildAnchors = !extendChildAnchors;
												} else {
													extendChildAnchors = false;
													mobileNavOpened = false;
												}
											}}
										>
											{#if l.anchors && l.url == selectedPath.url}
												<ChevronRight
													size="18"
													class="duration-300 {extendChildAnchors ? 'rotate-90' : ''}"
												/>
											{/if}{l.title}</a
										>
										{#if l.anchors && l.url == selectedPath.url}
											<ul
												class="flex max-h-0 flex-col overflow-hidden text-sm capitalize duration-300 {extendChildAnchors
													? 'max-h-[500px] pb-2'
													: ''}"
											>
												{#each l.anchors as anchor}
													<a
														onclick={() => (activeAnchor = anchor)}
														class="ml-2 py-1 {activeAnchor === anchor ? 'underline' : ''}"
														href={anchor}>{anchor.replaceAll('_', ' ').replace('#', '')}</a
													>
												{/each}
											</ul>
										{/if}
									</li>
								{/each}
							</ul>
						{/if}
					</li>
				{/each}
			</ul>
			<!-- <ul class="mt-6 flex flex-col gap-2">
				<a href="#location_and_time"> #Location and Time </a>
				<a href="#hourly_weather_variables"> #Hourly Weather Variables </a>
				<a href="#daily_weather_variables"> #Daily Weather Variables </a>
				<a href="#current_weather"> #Current Weather </a>
				<a href="#settings"> #Settings </a>
				<a href="#api_response"> #API Response </a>
				<a href="#data_sources"> #Data Sources </a>
				<a href="#api_documentation"> #API Documentation </a>
				<a href="#hourly_parameter_definition"> #Hourly Parameter Definition </a>
				<a href="#15_minutely_parameter_definition"> #15-Minutely Parameter Definition </a>
				<a href="#pressure_level_variables"> #Pressure Level Variables </a>
				<a href="#daily_parameter_definition"> #Daily Parameter Definition </a>
				<a href="#json_return_object"> #JSON Return Object </a>
				<a href="#errors"> #Errors </a>
				<a href="#weather_variable_documentation"> #Weather variable documentation </a>
			</ul> -->
		</nav>
	</aside>
	<div class="flex flex-1 flex-col overflow-auto p-6 pt-0 md:w-5/6 md:pl-3 md:pt-6">
		{@render children?.()}
	</div>
</div>

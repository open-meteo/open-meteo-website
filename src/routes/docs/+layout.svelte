<script lang="ts">
	import { page } from '$app/state';
	import { dev } from '$app/environment';

	import { i18n } from '$lib/i18n';
	import { languageTag } from '$lib/paraglide/runtime.js';

	import Logo from '$lib/assets/icons/cog.svelte';
	import Chevrons from 'lucide-svelte/icons/chevrons-up-down';
	import Button from '$lib/components/ui/button/button.svelte';

	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();

	const links = [
		{
			title: 'Weather Forecast',
			url: i18n.route('/docs'),
			children: [
				{ title: 'Historical Forecast', url: i18n.route('/docs/historical-forecast-api') },
				{ title: 'Previous Model Runs', url: i18n.route('/docs/previous-runs-api') },
				{ title: 'DWD Germany', url: i18n.route('/docs/dwd-api') },
				{ title: 'NOAA U.S.', url: i18n.route('/docs/gfs-api') },
				{ title: 'Météo-France', url: i18n.route('/docs/meteofrance-api') },
				{ title: 'ECMWF', url: i18n.route('/docs/ecmwf-api') },
				{ title: 'UK Met Office', url: i18n.route('/docs/ukmo-api') },
				{ title: 'JMA Japan', url: i18n.route('/docs/jma-api') },
				{ title: 'MET Norway', url: i18n.route('/docs/metno-api') },
				{ title: 'GEM Canada', url: i18n.route('/docs/gem-api') },
				{ title: 'BOM Australia', url: i18n.route('/docs/bom-api') },
				{ title: 'CMA China', url: i18n.route('/docs/cma-api') },
				{ title: 'KNMI Netherlands', url: i18n.route('/docs/knmi-api') },
				{ title: 'DMI Denmark', url: i18n.route('/docs/dmi-api') }
			]
		},
		{ title: 'Historical Weather', url: i18n.route('/docs/historical-weather-api') },
		{ title: 'Ensemble Models', url: i18n.route('/docs/ensemble-api') },
		{ title: 'Climate Change', url: i18n.route('/docs/climate-api') },
		{ title: 'Marine Forecast', url: i18n.route('/docs/marine-weather-api') },
		{ title: 'Air Quality', url: i18n.route('/docs/air-quality-api') },
		{ title: 'Geocoding', url: i18n.route('/docs/geocoding-api') },
		{ title: 'Elevation', url: i18n.route('/docs/elevation-api') },
		{ title: 'Flood', url: i18n.route('/docs/flood-api') }
	];
	if (dev) {
		links.push({ title: 'Seasonal Forecast API', url: i18n.route('/docs/seasonal-forecast-api') });
	}

	const lang = languageTag();

	let selectedPath = $derived.by(() => {
		for (const link of links) {
			if (link.children) {
				for (const l of link.children) {
					if (page.url.pathname.includes(l.url) || page.url.pathname.includes(l.url + '/')) {
						return l;
					}
				}
			}
			if (
				page.url.pathname === (lang !== 'en' ? '/' + lang : '') + link.url ||
				page.url.pathname === (lang !== 'en' ? '/' + lang : '') + link.url + '/'
			) {
				return link;
			}
		}
		return {};
	});

	let mobileNavClicked = $state(false);
</script>

<div class="flex flex-col md:flex-row">
	<aside class="w-full md:w-1/6 md:min-w-[230px] md:max-w-[400px]">
		<nav class="sticky top-0 flex flex-col p-6 md:pr-3">
			<Button
				variant="custom"
				onclick={() => {
					mobileNavClicked = !mobileNavClicked;
				}}
				class="flex justify-start rounded-md border p-3 md:hidden"
			>
				<Chevrons class="mr-2" /><b>{selectedPath.title}</b>
			</Button>
			<ul
				class={`list-unstyled overflow-hidden duration-500 ${mobileNavClicked ? 'mt-2 max-h-[800px] md:max-h-[unset]' : 'max-h-0 md:max-h-[unset] '}`}
			>
				{#each links as link}
					<li
						class="my-[0.125rem] rounded-md border py-2 pl-3 pr-2 duration-300 {selectedPath.title ===
						link.title
							? 'border-border'
							: 'border-transparent'}"
					>
						<a href={link.url}>{link.title}</a>
						{#if link.children}
							<ul
								class={`list-unstyled ml-3 overflow-hidden duration-500 ${
									selectedPath.url === link.url ||
									link.children.some((l) => l.url === selectedPath.url)
										? 'mt-2 max-h-[500px]'
										: 'max-h-0'
								}`}
							>
								{#each link.children as l}
									<li
										class="rounded-md border p-1 pl-3 duration-300 {selectedPath.url === l.url
											? 'border-border'
											: 'border-transparent'}"
									>
										<a href={l.url} class="my-1">{l.title}</a>
									</li>
								{/each}
							</ul>
						{/if}
					</li>
				{/each}
			</ul>
		</nav>
	</aside>
	<div class="flex flex-col p-6 pt-0 md:w-5/6 md:pl-3 md:pt-6">
		{@render children?.()}
	</div>
</div>

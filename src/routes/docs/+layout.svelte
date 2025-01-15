<script lang="ts">
	import { page } from '$app/state';
	import { dev } from '$app/environment';

	import { mode } from 'mode-watcher';

	import { i18n } from '$lib/i18n';

	import Logo from '$lib/assets/icons/cog.svelte';

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
</script>

<div class="h-[500px]">
	<div
		class="absolute -z-10 h-full w-full"
		style="
		  background-image: url('{page.data.hero}');
          background-size: cover;
          background-position: center;
          height: 500px;
		  {$mode === 'dark' ? 'opacity: 0.80;' : ''}
        "
	></div>

	<div class="container flex h-full flex-col items-center justify-center gap-4 text-white">
		<Logo width="96" height="96" shadow={true} />
		<h1 class="text-shadow text-3xl font-light shadow-[rgba(0,0,0,0.7)] md:text-5xl">
			{page.data.title}
		</h1>
		<div class="flex flex-col items-center justify-center gap-4 font-light md:w-1/2">
			<p class="text-shadow text-center text-lg shadow-[rgba(0,0,0,0.7)]">
				{page.data.subtitle}
			</p>
		</div>
	</div>
</div>

<div class="flex">
	<aside class="w-1/6">
		<nav class="sticky top-0 flex p-6 pr-3">
			<ul class="list-unstyled">
				{#each links as link}
					<li>
						<a
							href={link.url}
							class:active={page.url.pathname == link.url || page.url.pathname === link.url + '/'}
							>{link.title}</a
						>
						{#if link.children && (page.url.pathname === link.url || page.url.pathname === link.url + '/' || link.children.some((l) => l.url === page.url.pathname || page.url.pathname === l.url + '/'))}
							<ul class="list-unstyled ml-6">
								{#each link.children as l}
									<li>
										<a
											href={l.url}
											class=""
											class:active={page.url.pathname === l.url + '/' ||
												page.url.pathname === l.url}>{l.title}</a
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
	<div class="flex w-5/6 flex-col p-6 pl-3">
		{@render children?.()}
	</div>
</div>

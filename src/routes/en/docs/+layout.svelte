<script lang="ts">
	import { page } from '$app/stores';
	import { dev } from '$app/environment';

	const links = [
		{
			title: 'Weather Forecast',
			url: '/en/docs',
			children: [
				{ title: 'DWD ICON', url: '/en/docs/dwd-api' },
				{ title: 'NOAA GFS', url: '/en/docs/gfs-api' },
				{ title: 'MeteoFrance', url: '/en/docs/meteofrance-api' },
				{ title: 'ECMWF', url: '/en/docs/ecmwf-api' },
				{ title: 'JMA', url: '/en/docs/jma-api' },
				{ title: 'MET Norway', url: '/en/docs/metno-api' },
				{ title: 'GEM', url: '/en/docs/gem-api' }
			]
		},
		{ title: 'Historical Weather', url: '/en/docs/historical-weather-api' },
    	{ title: 'Climate Change', url: '/en/docs/climate-api' },
		{ title: 'Marine Forecast', url: '/en/docs/marine-weather-api' },
		{ title: 'Air Quality', url: '/en/docs/air-quality-api' },
		{ title: 'Geocoding', url: '/en/docs/geocoding-api' },
		{ title: 'Elevation', url: '/en/docs/elevation-api' },
		{ title: 'Flood', url: '/en/docs/flood-api' }
	];
	if (dev) {
		links.push({ title: 'Seasonal Forecast API', url: '/en/docs/seasonal-forecast-api' });
    	links.push({ title: 'Ensemble Models', url: '/en/docs/ensemble-api' });
	}
</script>

<div
	class="px-4 py-5 text-center text-white hero-banner"
	style="background-image: url('{$page.data.hero}');"
>
	<svg
		style="filter: drop-shadow( 3px 3px 2px rgba(0, 0, 0, .7));"
		xmlns="http://www.w3.org/2000/svg"
		width="96"
		height="96"
		fill="currentColor"
		class="bi bi-gear-wide-connected mb-5"
		viewBox="0 0 16 16"
	>
		<path
			d="M7.068.727c.243-.97 1.62-.97 1.864 0l.071.286a.96.96 0 0 0 1.622.434l.205-.211c.695-.719 1.888-.03 1.613.931l-.08.284a.96.96 0 0 0 1.187 1.187l.283-.081c.96-.275 1.65.918.931 1.613l-.211.205a.96.96 0 0 0 .434 1.622l.286.071c.97.243.97 1.62 0 1.864l-.286.071a.96.96 0 0 0-.434 1.622l.211.205c.719.695.03 1.888-.931 1.613l-.284-.08a.96.96 0 0 0-1.187 1.187l.081.283c.275.96-.918 1.65-1.613.931l-.205-.211a.96.96 0 0 0-1.622.434l-.071.286c-.243.97-1.62.97-1.864 0l-.071-.286a.96.96 0 0 0-1.622-.434l-.205.211c-.695.719-1.888.03-1.613-.931l.08-.284a.96.96 0 0 0-1.186-1.187l-.284.081c-.96.275-1.65-.918-.931-1.613l.211-.205a.96.96 0 0 0-.434-1.622l-.286-.071c-.97-.243-.97-1.62 0-1.864l.286-.071a.96.96 0 0 0 .434-1.622l-.211-.205c-.719-.695-.03-1.888.931-1.613l.284.08a.96.96 0 0 0 1.187-1.186l-.081-.284c-.275-.96.918-1.65 1.613-.931l.205.211a.96.96 0 0 0 1.622-.434l.071-.286zM12.973 8.5H8.25l-2.834 3.779A4.998 4.998 0 0 0 12.973 8.5zm0-1a4.998 4.998 0 0 0-7.557-3.779l2.834 3.78h4.723zM5.048 3.967c-.03.021-.058.043-.087.065l.087-.065zm-.431.355A4.984 4.984 0 0 0 3.002 8c0 1.455.622 2.765 1.615 3.678L7.375 8 4.617 4.322zm.344 7.646.087.065-.087-.065z"
		/>
	</svg>
	<h1 class="display-5 hero-shadow">{$page.data.title}</h1>
	<div class="col-lg-6 mx-auto">
		<p class="lead mb-4 hero-shadow">{$page.data.subtitle}</p>
	</div>
</div>

<div class="container-fluid">
	<div class="row">
		<div class="col-md-3 col-lg-2 bg-light">
			<div class="my-3 d-md-none">
				<button
					class="btn btn-outline-dark dropdown-toggle collapsed"
					type="button"
					data-bs-toggle="collapse"
					data-bs-target="#sidebarMenu"
					aria-expanded="false"
					aria-controls="sidebarMenu"
				>
					Available APIs
				</button>
			</div>
			<nav id="sidebarMenu" class="d-md-block collapse py-2 py-md-3 py-lg-4">
				<ul class="list-unstyled">
					{#each links as link}
						<li class="py-2">
							<a
								class="btn-hover link-dark text-decoration-none rounded px-2 py-2"
								href={link.url}
								class:active={$page.url.pathname === link.url}>{link.title}</a
							>
							{#if link.children && ($page.url.pathname === link.url || link.children.some((l) => l.url === $page.url.pathname))}
								<ul class="list-unstyled ms-3 mb-4 mt-1">
									{#each link.children as l}
										<li class="py-1">
											<a
												href={l.url}
												class="btn-hover py-1 px-2 link-dark text-decoration-none rounded"
												class:active={$page.url.pathname === l.url}>{l.title}</a
											>
										</li>
									{/each}
								</ul>
							{/if}
						</li>
					{/each}
				</ul>
			</nav>
		</div>
		<main class="col-md-9 col-lg-10 p-2 p-md-3 p-lg-4">
			<slot />
		</main>
	</div>
</div>

<style>
	.btn-hover:hover {
		background-color: #aab1b7;
	}

	.btn-hover.active {
		background-color: #d2e7f4;
	}
	.hero-banner {
		background-size: cover;
		background-position: center;
		height: 400px;
	}
	.hero-shadow {
		text-shadow: 3px 3px 2px rgba(0, 0, 0, 0.7);
	}
</style>

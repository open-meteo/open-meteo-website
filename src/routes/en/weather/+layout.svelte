<script lang="ts">
	import { page } from '$app/stores';
	import { dev } from '$app/environment';
	import { storedLocation, type GeoLocation } from '$lib/stores';

	const links = [
		{
			title: 'Weather Forecast',
			url: '/en/weather',
			children: [
				{ title: 'Week Prediction', url: '/en/weather' }
				// { title: 'Model Comparison?', url: '/en/weather/comparison' },
				// { title: 'Fourteen Day?', url: '/en/weather/14' }
			]
		}
	];
</script>

<div
	class="px-4 py-5 text-center text-white items-center flex flex-col"
	style="
            background-image: url('/images/features_background.webp');
            background-size: cover;
            background-position: center;
            height: 300px;
          "
>
	<svg
		style="filter: drop-shadow( 3px 3px 2px rgba(0, 0, 0, .7));"
		xmlns="http://www.w3.org/2000/svg"
		width="96"
		height="96"
		fill="currentColor"
		class="bi bi-cloud-rain mb-4"
		viewBox="0 0 16 16"
	>
		<path
			d="M4.158 12.025a.5.5 0 0 1 .316.633l-.5 1.5a.5.5 0 0 1-.948-.316l.5-1.5a.5.5 0 0 1 .632-.317zm3 0a.5.5 0 0 1 .316.633l-1 3a.5.5 0 0 1-.948-.316l1-3a.5.5 0 0 1 .632-.317zm3 0a.5.5 0 0 1 .316.633l-.5 1.5a.5.5 0 0 1-.948-.316l.5-1.5a.5.5 0 0 1 .632-.317zm3 0a.5.5 0 0 1 .316.633l-1 3a.5.5 0 1 1-.948-.316l1-3a.5.5 0 0 1 .632-.317zm.247-6.998a5.001 5.001 0 0 0-9.499-1.004A3.5 3.5 0 1 0 3.5 11H13a3 3 0 0 0 .405-5.973zM8.5 2a4 4 0 0 1 3.976 3.555.5.5 0 0 0 .5.445H13a2 2 0 0 1 0 4H3.5a2.5 2.5 0 1 1 .605-4.926.5.5 0 0 0 .596-.329A4.002 4.002 0 0 1 8.5 2z"
		/>
	</svg>
	<h1 class="display-5" style="text-shadow: 3px 3px 2px rgba(0, 0, 0, .7);">
		Weather {$storedLocation.name}
	</h1>
	<h5>
		{#if $storedLocation.admin1}{$storedLocation.admin1},{/if}
		{$storedLocation.country}
	</h5>
</div>

<div class="">
	<div class="row container-fluid">
		<div class="col-md-3 col-lg-2">
			<div class="my-3 d-md-none">
				<button
					class="btn btn-outline-secondary dropdown-toggle collapsed"
					type="button"
					data-bs-toggle="collapse"
					data-bs-target="#sidebarMenu"
					aria-expanded="false"
					aria-controls="sidebarMenu"
				>
					Weather Pages
				</button>
			</div>
			<nav id="sidebarMenu" class="sticky-top d-md-block collapse py-2 py-md-3 py-lg-4">
				<ul class="list-unstyled">
					{#each links as link}
						<li>
							<a
								class="btn btn-hover"
								href={link.url}
								class:active={$page.url.pathname == link.url ||
									$page.url.pathname === link.url + '/'}>{link.title}</a
							>
							{#if link.children && ($page.url.pathname === link.url || $page.url.pathname === link.url + '/' || link.children.some((l) => l.url === $page.url.pathname || $page.url.pathname === l.url + '/'))}
								<ul class="list-unstyled ms-3 mb-4 mt-1">
									{#each link.children as l}
										<li>
											<a
												href={l.url}
												class="btn btn-hover py-1 px-2"
												class:active={$page.url.pathname === l.url + '/' ||
													$page.url.pathname === l.url}>{l.title}</a
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
	.hero-banner {
		background-size: cover;
		background-position: center;
		height: 400px;
	}
	.hero-shadow {
		text-shadow: 3px 3px 2px rgba(0, 0, 0, 0.7);
	}
</style>

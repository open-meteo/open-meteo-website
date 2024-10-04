<script lang="ts">
	import './weather.scss';
	import { page } from '$app/stores';
	import { dev } from '$app/environment';
	import { storedLocation, type GeoLocation } from '$lib/stores';
	import Header from './components/header.svelte';
	import Footer from './components/footer.svelte';

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

<div>
	<Header />
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
		<h1 style="text-shadow: 3px 3px 2px rgba(0, 0, 0, .7);">
			Weather {$storedLocation.name}
		</h1>
		<h5>
			{#if $storedLocation.admin1}{$storedLocation.admin1},{/if}
			{$storedLocation.country}
		</h5>
	</div>

	<div class="flex">
		<aside class="hidden md:flex md:min-w-[200px] lg:min-w-[300px] p-4">
			<div class="md:hidden">
				<button
					type="button"
					data-bs-toggle="collapse"
					data-bs-target="#sidebarMenu"
					aria-expanded="false"
					aria-controls="sidebarMenu"
				>
					Weather Pages
				</button>
			</div>
			<nav>
				<ul class="mt-3">
					{#each links as link}
						<li>
							<a
								class="border border-black rounded px-3 py-2"
								href={link.url}
								class:active={$page.url.pathname == link.url ||
									$page.url.pathname === link.url + '/'}>{link.title}</a
							>
							{#if link.children && ($page.url.pathname === link.url || $page.url.pathname === link.url + '/' || link.children.some((l) => l.url === $page.url.pathname || $page.url.pathname === l.url + '/'))}
								<ul class=" ml-3 mt-4">
									{#each link.children as l}
										<li>
											<a
												href={l.url}
												class="border border-black rounded px-3 py-2"
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
		</aside>
		<main class="p-4 w-full md:w-[calc(100%-200px)] lg:w-[calc(100%-300px)]">
			<slot />
		</main>
	</div>
	<Footer />
</div>

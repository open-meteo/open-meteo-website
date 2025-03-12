<script lang="ts">
	import { onMount } from 'svelte';

	import { fade } from 'svelte/transition';

	import { page } from '$app/state';

	import { browser } from '$app/environment';

	import { goto } from '$app/navigation';

	import { dev } from '$app/environment';

	import { afterNavigate } from '$app/navigation';

	import Button from '$lib/components/ui/button/button.svelte';

	import Chevrons from 'lucide-svelte/icons/chevrons-up-down';
	import ArrowLeftToLine from 'lucide-svelte/icons/arrow-left-to-line';
	import ArrowRightFromLine from 'lucide-svelte/icons/arrow-right-to-line';

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

	let collapsed = $state(false);
	let mobileNavOpened = $state(false);

	afterNavigate((e) => {
		if (!e.from || e.from.route.id !== e.to.route.id) {
			setTimeout(() => {
				window.scrollTo(0, 0);
			}, 100);
		}
	});

	onMount(() => {
		if (browser) {
			const headingElements = document.querySelectorAll('h2, h3, h4');
			for (const heading of headingElements) {
				if (heading.id) {
					heading.addEventListener('click', () => {
						goto(`#${heading.id}`);
						focus(heading);
					});
				}
			}
		}
	});
</script>

<div class="mb-12 flex flex-col md:mb-24 md:flex-row">
	<aside
		class="relative w-full duration-300 md:w-1/6 md:min-w-[230px] border-transparent md:max-w-[350px] {collapsed
			? 'md:w-unset md:min-w-[50px]! md:max-w-[50px]! border-r !border-border'
			: ''} "
	>
		<Button
			variant="ghost"
			onclick={() => {
				collapsed = !collapsed;
			}}
			class="hidden md:flex z-10 absolute w-[42px] right-1 top-1"
		>
			{#if collapsed}
				<div class="absolute" transition:fade>
					<ArrowRightFromLine />
				</div>
			{:else}
				<div class="absolute" transition:fade>
					<ArrowLeftToLine />
				</div>
			{/if}
		</Button>
		{#if !collapsed}
			<nav
				in:fade={{ duration: 150, delay: 200 }}
				out:fade={{ duration: 50 }}
				class="sticky duration-100 top-0 flex flex-col p-6 pb-3 md:pb-6 md:pr-3}"
			>
				<Button
					variant="outline"
					class="flex justify-start p-3 md:hidden"
					onclick={() => {
						mobileNavOpened = !mobileNavOpened;
					}}
				>
					<Chevrons class="mr-2" /><b>{selectedPath.title}</b>
				</Button>
				<!--max-h-[968px] max-h-[485px]-->
				<ul
					class={`list-unstyled overflow-hidden duration-500 ${mobileNavOpened ? `mt-2 max-h-[${selectedPath.children ? '968' : '485'}px] md:max-h-[unset]` : 'max-h-0 md:max-h-[unset] '}`}
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
		{/if}
	</aside>
	<div
		class="flex flex-1 flex-col duration-300 p-6 pt-0 md:max-w-[calc(100%-230px)] lg:max-w-unset md:pl-3 md:pt-6 {collapsed
			? 'md:max-w-[calc(100%-50px)]'
			: ''}"
	>
		{@render children?.()}
	</div>
</div>

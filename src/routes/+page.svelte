<script lang="ts">
	import { fade } from 'svelte/transition';

	import Key from 'lucide-svelte/icons/key-round';
	import Watch from 'lucide-svelte/icons/watch';
	import Archive from 'lucide-svelte/icons/archive';
	import Clipboard from 'lucide-svelte/icons/clipboard';
	import Lightbulb from 'lucide-svelte/icons/lightbulb';
	import MapPinned from 'lucide-svelte/icons/map-pinned';

	import Github from 'simple-icons/icons/github.svg?raw';

	import { i18n } from '$lib/i18n';

	import * as m from '$lib/paraglide/messages.js';

	import Mailbox from '$lib/assets/icons/mailbox.svelte';

	import Button from '$lib/components/ui/button/button.svelte';
	import * as ToggleGroup from '$lib/components/ui/toggle-group/index.js';

	import WeatherApiCodeBlock from '$lib/components/code/home/weather-api.svx';
	import WeatherApiCurlBlock from '$lib/components/code/home/weather-api-curl.svx';

	import Last10DaysCodeBlock from '$lib/components/code/home/last-10-days.svx';
	import Last10DaysCurlBlock from '$lib/components/code/home/last-10-days-curl.svx';

	import HistoricalWeatherCodeBlock from '$lib/components/code/home/historical-weather.svx';
	import HistoricalWeatherCurlBlock from '$lib/components/code/home/historical-weather-curl.svx';

	let tabSelected = $state('weather-api');
</script>

<svelte:head>
	<title>🌤️ {m.home_seo_title()} | Open-Meteo.com</title>
	<link rel="canonical" href="https://open-meteo.com/" />
	<meta name="description" content={m.home_seo_description()} />
</svelte:head>

<div class="container mt-8 lg:mt-16">
	<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
		<div>
			<h2 class="text-3xl font-light lg:text-5xl">{m.home_subtitle()}</h2>
			<p class="mt-4">
				{m.home_subtitle_description_part1()}
			</p>
			<p class="mt-4">
				{m.home_subtitle_description_part2()}
			</p>
			<p class="mt-4">
				{m.home_subtitle_description_part3()}
			</p>
			<div class="mt-4 flex gap-4">
				<Button variant="default" href={i18n.route('/features')}>
					{m.see_features()}
				</Button>
				<Button variant="outline-grey" href={i18n.route('/docs')}>{m.read_docs()}</Button>
			</div>
		</div>

		<div class="overflow-hidden rounded-lg bg-[#282c34] p-6 text-white">
			<ToggleGroup.Root type="single" bind:value={tabSelected} class="justify-start gap-0">
				<ToggleGroup.Item
					value="weather-api"
					class=" min-h-12 rounded-e-none !opacity-100 lg:min-h-[unset]"
					aria-label="Toggle bold"
					disabled={tabSelected === 'weather-api'}
				>
					{m.home_toggle_forecast_and_current()}
				</ToggleGroup.Item>
				<ToggleGroup.Item
					value="last-10-days"
					class="min-h-12 rounded-none !opacity-100 lg:min-h-[unset]"
					aria-label="Toggle italic"
					disabled={tabSelected === 'last-10-days'}
				>
					{m.home_toggle_last_10_days()}
				</ToggleGroup.Item>
				<ToggleGroup.Item
					value="historical-weather"
					class="min-h-12 rounded-s-none !opacity-100 lg:min-h-[unset]"
					aria-label="Toggle strikethrough"
					disabled={tabSelected === 'historical-weather'}
				>
					{m.home_toggle_historical()}
				</ToggleGroup.Item>
			</ToggleGroup.Root>
			<div class="relative min-h-[550px] lg:min-h-[500px]">
				{#if tabSelected === 'weather-api'}
					<div in:fade class="group absolute w-full">
						<Button
							variant="ghost"
							class="curl mt-20 max-h-20 min-h-8 w-full !bg-transparent p-0 lg:mt-12 [&_.shiki]:w-full [&_code]:w-full [&_code]:text-wrap [&_code]:break-words"
							href="https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m"
						>
							<WeatherApiCurlBlock />
						</Button>
						<Button
							variant="outline"
							class="absolute right-0 top-2 z-10 opacity-0 duration-300 group-hover:opacity-100"
							onclick={() => {
								window.prompt(
									'Copy to clipboard: Ctrl+C, Enter',
									'curl https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m'
								);
							}}
						>
							<Clipboard size="22" strokeWidth={1} />
						</Button>
						<div class="code-numbered mt-10 lg:mt-2">
							<WeatherApiCodeBlock />
						</div>
					</div>
				{:else if tabSelected === 'last-10-days'}
					<div in:fade class="group absolute w-full">
						<Button
							variant="ghost"
							class="curl mt-20 max-h-20 min-h-8 w-full !bg-transparent p-0 lg:mt-12 [&_.shiki]:w-full [&_code]:w-full [&_code]:text-wrap [&_code]:break-words"
							href="https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&past_days=10&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m"
						>
							<Last10DaysCurlBlock />
						</Button>
						<Button
							variant="outline"
							class="absolute right-0 top-2 z-10 opacity-0 duration-300 group-hover:opacity-100"
							onclick={() => {
								window.prompt(
									'Copy to clipboard: Ctrl+C, Enter',
									'curl "https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&past_days=10&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m"'
								);
							}}
						>
							<Clipboard size="22" strokeWidth={1} />
						</Button>
						<div class="code-numbered mt-10 lg:mt-2">
							<Last10DaysCodeBlock />
						</div>
					</div>
				{:else if tabSelected === 'historical-weather'}
					<div in:fade class="group absolute w-full">
						<Button
							variant="ghost"
							class="curl mt-20 max-h-20 min-h-8 w-full text-ellipsis !bg-transparent p-0 lg:mt-12 [&_.shiki]:w-full [&_code]:w-full [&_code]:text-wrap [&_code]:break-words"
							href="https://archive-api.open-meteo.com/v1/era5?latitude=52.52&longitude=13.41&start_date=2021-01-01&end_date=2021-12-31&hourly=temperature_2m"
						>
							<HistoricalWeatherCurlBlock />
						</Button>
						<Button
							variant="outline"
							class="absolute right-0 top-2 z-10 opacity-0 duration-300 group-hover:opacity-100"
							onclick={() => {
								window.prompt(
									'Copy to clipboard: Ctrl+C, Enter',
									'curl "https://archive-api.open-meteo.com/v1/era5?latitude=52.52&longitude=13.41&start_date=2021-01-01&end_date=2021-12-31&hourly=temperature_2m"'
								);
							}}
						>
							<Clipboard size="22" strokeWidth={1} />
						</Button>
						<div class="code-numbered mt-10 lg:mt-2">
							<HistoricalWeatherCodeBlock />
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>

	<div id="featured-3">
		<div class="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
			<div>
				<div class="mb-3 flex items-center">
					<div
						class="bg-primary relative flex h-12 w-12 items-center justify-center rounded-xl text-white md:h-14 md:w-14"
					>
						<div
							class="absolute h-12 w-12 rounded-lg bg-gradient-to-t from-transparent to-[rgba(255,255,255,0.2)] md:h-14 md:w-14 dark:bg-gradient-to-b dark:to-[rgba(0,0,0,0.2)]"
						></div>
						<MapPinned size="32" strokeWidth={1.3} />
					</div>

					<h3 class="pl-3 text-2xl">{m.home_high_resolution()}</h3>
				</div>

				<p class="mb-3">
					{m.home_high_resolution_description_part1()}
				</p>
				<p>
					{m.home_high_resolution_description_part2()}
				</p>
			</div>

			<div>
				<div class="mb-3 flex items-center">
					<div
						class="bg-primary relative flex h-12 w-12 items-center justify-center rounded-xl text-white md:h-14 md:w-14"
					>
						<div
							class="absolute h-12 w-12 rounded-lg bg-gradient-to-t from-transparent to-[rgba(255,255,255,0.2)] md:h-14 md:w-14 dark:bg-gradient-to-b dark:to-[rgba(0,0,0,0.2)]"
						></div>
						<Watch size="36" strokeWidth={1.2} />
					</div>

					<h3 class="pl-3 text-2xl">{m.home_rapid_updates()}</h3>
				</div>
				<p class="mb-3">
					{m.home_rapid_updates_description_part1()}
				</p>
				<p>
					{m.home_rapid_updates_description_part2()}
				</p>
			</div>

			<div>
				<div class="mb-3 flex items-center">
					<div
						class="bg-primary relative flex h-12 w-12 items-center justify-center rounded-xl text-white md:h-14 md:w-14"
					>
						<div
							class="absolute h-12 w-12 rounded-lg bg-gradient-to-t from-transparent to-[rgba(255,255,255,0.2)] md:h-14 md:w-14 dark:bg-gradient-to-b dark:to-[rgba(0,0,0,0.2)]"
						></div>
						<Archive size="32" strokeWidth={1.4} />
					</div>

					<h3 class="pl-3 text-2xl">{m.home_80_years_historical_data()}</h3>
				</div>

				<p class="mb-3">
					{@html m.home_80_years_historical_data_description_part1({
						historical_weather_link: `<a href=${i18n.route('/docs/historical-weather-api')} title="${m.historical_weather_via_api()}">${m.historical_weather_api()}</a>`
					})}
				</p>
				<p>
					{m.home_80_years_historical_data_description_part2()}
				</p>
			</div>

			<div>
				<div class="mb-3 flex items-center">
					<div
						class="bg-primary relative flex h-12 w-12 items-center justify-center rounded-xl text-white md:h-14 md:w-14"
					>
						<div
							class="absolute h-12 w-12 rounded-lg bg-gradient-to-t from-transparent to-[rgba(255,255,255,0.2)] md:h-14 md:w-14 dark:bg-gradient-to-b dark:to-[rgba(0,0,0,0.2)]"
						></div>
						<div class="absolute h-8 w-8 fill-white">{@html Github}</div>
					</div>

					<h3 class="pl-3 text-2xl">{m.home_opensource()}</h3>
				</div>
				<p class="mb-3">
					{@html m.home_opensource_description_part1({
						github_link:
							'<a href="https://github.com/open-meteo/open-meteo" title="Open-Meteo GitHub respository">GitHub</a>'
					})}
				</p>
				<p class="mb-3">{m.home_opensource_description_part2()}</p>
				<p>
					{@html m.home_opensource_description_part3()}
				</p>
			</div>

			<div>
				<div class="mb-3 flex items-center">
					<div
						class="bg-primary relative flex h-12 w-12 items-center justify-center rounded-xl text-white md:h-14 md:w-14"
					>
						<div
							class="absolute h-12 w-12 rounded-lg bg-gradient-to-t from-transparent to-[rgba(255,255,255,0.2)] md:h-14 md:w-14 dark:bg-gradient-to-b dark:to-[rgba(0,0,0,0.2)]"
						></div>
						<Key size="30" strokeWidth={1.6} />
					</div>

					<h3 class="pl-3 text-2xl">{m.home_free_api()}</h3>
				</div>
				<p class="mb-3">
					{m.home_free_api_description_part1()}
				</p>

				<p>
					{@html m.home_free_api_description_part1({
						api_subscription_link: `<a href=${i18n.route('/pricing')} title="${m.pricing_api_subscription}">${m.api_subscription}</a>`
					})}
				</p>
			</div>

			<div>
				<div class="mb-3 flex items-center">
					<div
						class="bg-primary relative flex h-12 w-12 items-center justify-center rounded-xl text-white md:h-14 md:w-14"
					>
						<div
							class="absolute h-12 w-12 rounded-lg bg-gradient-to-t from-transparent to-[rgba(255,255,255,0.2)] md:h-14 md:w-14 dark:bg-gradient-to-b dark:to-[rgba(0,0,0,0.2)]"
						></div>
						<Lightbulb size="33" strokeWidth={1.6} />
					</div>

					<h3 class="pl-3 text-2xl">{m.home_easy_to_use()}</h3>
				</div>
				<p class="mb-3">
					{m.home_easy_to_use_description_part1()}
				</p>
				<p>
					{@html m.home_easy_to_use_description_part2({
						documentation_link: `<a href=${i18n.route('/docs')} title="${m.documentation_title()}">${m.documentation_small()}</a>`
					})}
				</p>
			</div>
		</div>
	</div>

	<div class="my-24 flex flex-col items-center justify-center">
		<Mailbox width="72" height="72" shadow={false} />
		<h2 class="my-4 text-4xl font-bold" id="contact">{m.stay_up_to_date()}</h2>
		<div class="text-center">
			<p>
				{@html m.home_engagement({
					latest_features_link: `<a href=${i18n.route('/features')} title="${m.latest_features_title()}">${m.latest_features()}</a>`,
					blog_link: `<a href="https://openmeteo.substack.com/archive?sort=new" target="_blank">${m.blog_small()}</a>`,
					twitter_link: `<a href="https://twitter.com/open_meteo" target="_blank">Twitter</a>`
				})}
			</p>
			<div class="mt-4 flex justify-center gap-4">
				<Button
					href="https://openmeteo.substack.com/subscribe?utm_source=landingpage&simple=true&next=https%3A%2F%2Fopenmeteo.substack.com%2F"
					title="Newsletter Sign-Up">{m.subscribe_to_the_newsletter()}</Button
				>
				<Button
					variant="outline-grey"
					href={i18n.route('/features#available-apis')}
					title="APIs & Features">{m.available_apis()}</Button
				>
			</div>
		</div>
	</div>
</div>

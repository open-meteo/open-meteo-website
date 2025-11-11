<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, slide } from 'svelte/transition';

	import { urlHashStore } from '$lib/stores/url-hash-store';

	import { countVariables } from '$lib/utils/meteo';

	import * as Accordion from '$lib/components/ui/accordion';
	import * as Alert from '$lib/components/ui/alert';
	import { Button } from '$lib/components/ui/button';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Select from '$lib/components/ui/select';

	import AccordionItem from '$lib/components/accordion/accordion-item.svelte';
	import DatePicker from '$lib/components/date/date-picker.svelte';
	import LicenceSelector from '$lib/components/licence/licence-selector.svelte';
	import LocationSelection from '$lib/components/location/location-selection.svelte';
	import { pythonInstallCode } from '$lib/components/response/installs/om-files/python-install-code';
	import { typescriptInstallCode } from '$lib/components/response/installs/om-files/typescript-install-code';
	import ResultPreview from '$lib/components/response/results-preview.svelte';
	import Settings from '$lib/components/settings/settings.svelte';

	import {
		forecastHoursOptions,
		gridCellSelectionOptions,
		pastDaysOptions,
		pastHoursOptions,
		pastMinutely15Options,
		temporalResolutionOptions
	} from '../options';
	import {
		additionalVariables,
		current,
		defaultParameters,
		forecastDaysOptions,
		hourly,
		models,
		solarVariables
	} from './options';

	const params = urlHashStore({
		latitude: [52.52],
		longitude: [13.41],
		...defaultParameters,
		hourly: ['temperature_2m']
	});

	let forecastDays = $derived(
		forecastDaysOptions.find((fco) => fco.value == $params.forecast_days)
	);
	let pastDays = $derived(pastDaysOptions.find((pdo) => pdo.value == $params.past_days));

	let beginDate = new Date();
	beginDate.setMonth(beginDate.getMonth() - 3);

	let lastDate = new Date();
	lastDate.setDate(lastDate.getDate() + 14);

	let mode = $state('typescript');
</script>

<svelte:head>
	<title>OM Files | Open-Meteo.com</title>
	<link rel="canonical" href="https://open-meteo.com/en/docs/om-files" />
</svelte:head>

<Alert.Root variant="info" class="mb-4"
	><svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
		class="lucide lucide-info-icon lucide-info"
		><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg
	>
	<Alert.Description></Alert.Description>
</Alert.Root>

<form method="get" action="https://api.open-meteo.com/v1/dwd-icon">
	<!-- LOCATION -->
	<LocationSelection bind:params={$params} />

	<!-- HOURLY -->
	<div class="mt-6 md:mt-12">
		<a href="#hourly_weather_variables"
			><h2 id="hourly_weather_variables" class="text-2xl md:text-3xl">
				Hourly Weather Variables
			</h2></a
		>
		<div
			class="mt-2 grid grid-flow-row gap-x-2 gap-y-2 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
		>
			{#each hourly as group, i (i)}
				<div>
					{#each group as { value, label } (value)}
						<div class="group flex items-center" title={label}>
							<Checkbox
								id="{value}_hourly"
								class="bg-muted/50 border-border-dark cursor-pointer duration-100 group-hover:border-[currentColor]"
								{value}
								checked={$params.hourly?.includes(value)}
								aria-labelledby="{value}_label"
								onCheckedChange={() => {
									if ($params.hourly?.includes(value)) {
										$params.hourly = $params.hourly.filter((item) => {
											return item !== value;
										});
									} else if ($params.hourly) {
										$params.hourly.push(value);
										$params.hourly = $params.hourly;
									}
								}}
							/>
							<Label
								id="{value}_label"
								for="{value}_hourly"
								class="ml-[0.42rem] cursor-pointer truncate py-[0.1rem]">{label}</Label
							>
						</div>
					{/each}
				</div>
			{/each}
		</div>
	</div>

	<!-- SETTINGS -->
	<div class="mt-6 md:mt-12">
		<Settings bind:params={$params} />
	</div>

	<!-- LICENSE -->
	<div class="mt-3 md:mt-6"><LicenceSelector /></div>

	<div class="mt-2 -mr-6 flex items-center gap-2 overflow-auto md:mt-4 md:mr-0">
		<div class="text-muted-foreground">Language:</div>

		<div class="border-border flex rounded-md border">
			<Button
				variant="ghost"
				class="items-center gap-1 rounded-none !opacity-100 duration-300 {mode === 'python'
					? 'bg-accent cursor-not-allowed'
					: ''}"
				disabled={mode === 'python'}
				onclick={() => {
					mode = 'python';
				}}
			>
				Python
			</Button>
			<Button
				variant="ghost"
				class="items-center gap-1 rounded-none !opacity-100 duration-300 {mode === 'typescript'
					? 'bg-accent cursor-not-allowed'
					: ''}"
				disabled={mode === 'typescript'}
				onclick={() => {
					mode = 'typescript';
				}}
			>
				TypeScript
			</Button>
			<Button
				variant="ghost"
				class="items-center gap-1 rounded-none !opacity-100 duration-300 {mode === 'swift'
					? 'bg-accent cursor-not-allowed'
					: ''}"
				disabled={mode === 'swift'}
				onclick={() => {
					mode = 'swift';
				}}
			>
				Swift
			</Button>
			<Button
				variant="ghost"
				class="items-center gap-1 rounded-s-none !opacity-100 duration-300 {mode === 'other'
					? 'bg-accent cursor-not-allowed'
					: ''}"
				disabled={mode === 'other'}
				onclick={() => {
					mode = 'other';
				}}
			>
				Other
			</Button>
		</div>
	</div>

	{#if mode === 'typescript'}
		{@html typescriptInstallCode}

		Hello{/if}
</form>

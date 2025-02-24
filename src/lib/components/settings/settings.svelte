<script lang="ts">
	import { Label } from '$lib/components/ui/label';
	import * as Select from '$lib/components/ui/select/index';

	import { type Parameters } from '$lib/components/parameters';

	import {
		windSpeedOptions,
		timeFormatOptions,
		temperatureOptions,
		precipitationOptions
	} from './options';

	interface Props {
		params: Parameters;
	}

	let { params = $bindable() }: Props = $props();

	// Settings
	let temperatureUnit = $derived(
		temperatureOptions.find((to) => String(to.value) == params.temperature_unit)
	);
	let windSpeedUnit = $derived(
		windSpeedOptions.find((wso) => String(wso.value) == params.wind_speed_unit)
	);
	let precipitationUnit = $derived(
		precipitationOptions.find((po) => String(po.value) == params.precipitation_unit)
	);
	let timeFormat = $derived(
		timeFormatOptions.find((tfo) => String(tfo.value) == params.timeformat)
	);
</script>

<h2 id="settings" class="text-2xl md:text-3xl">Settings</h2>
<div class="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 md:mt-6 md:flex-row md:gap-6 lg:grid-cols-4">
	<div class="relative">
		<Select.Root name="temperature_unit" type="single" bind:value={params.temperature_unit}>
			<Select.Trigger aria-label="Temperature setting" class="h-12 cursor-pointer pt-6 [&_svg]:mb-3"
				>{temperatureUnit?.label}</Select.Trigger
			>
			<Select.Content preventScroll={false} class="border-border">
				{#each temperatureOptions as to}
					<Select.Item value={to.value}>{to.label}</Select.Item>
				{/each}
			</Select.Content>
			<Label class="text-muted-foreground absolute left-2 top-[0.35rem] z-10 px-1 text-xs"
				>Temperature Unit</Label
			>
		</Select.Root>
	</div>

	<div class="relative">
		<Select.Root name="wind_speed_unit" type="single" bind:value={params.wind_speed_unit}>
			<Select.Trigger aria-label="Wind speed setting" class="h-12 cursor-pointer pt-6 [&_svg]:mb-3"
				>{windSpeedUnit?.label}</Select.Trigger
			>
			<Select.Content preventScroll={false} class="border-border">
				{#each windSpeedOptions as wso}
					<Select.Item value={wso.value}>{wso.label}</Select.Item>
				{/each}
			</Select.Content>
			<Label class="text-muted-foreground absolute left-2 top-[0.35rem] z-10 px-1 text-xs"
				>Wind Speed Unit</Label
			>
		</Select.Root>
	</div>

	<div class="relative">
		<Select.Root name="precipitation_unit" type="single" bind:value={params.precipitation_unit}>
			<Select.Trigger
				aria-label="Precipitation setting"
				class="h-12 cursor-pointer pt-6 [&_svg]:mb-3">{precipitationUnit?.label}</Select.Trigger
			>
			<Select.Content preventScroll={false} class="border-border">
				{#each precipitationOptions as po}
					<Select.Item value={po.value}>{po.label}</Select.Item>
				{/each}
			</Select.Content>
			<Label class="text-muted-foreground absolute left-2 top-[0.35rem] z-10 px-1 text-xs"
				>Precipitation Unit</Label
			>
		</Select.Root>
	</div>

	<div class="relative">
		<Select.Root name="timeformat" type="single" bind:value={params.timeformat}>
			<Select.Trigger aria-label="Time format setting" class="h-12 cursor-pointer pt-6 [&_svg]:mb-3"
				>{timeFormat?.label}</Select.Trigger
			>
			<Select.Content preventScroll={false} class="border-border">
				{#each timeFormatOptions as tfo}
					<Select.Item value={tfo.value}>{tfo.label}</Select.Item>
				{/each}
			</Select.Content>
			<Label class="text-muted-foreground absolute left-2 top-[0.35rem] z-10 px-1 text-xs"
				>Timeformat</Label
			>
		</Select.Root>
	</div>
</div>

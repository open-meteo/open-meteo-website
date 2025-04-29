<script lang="ts">
	import { Label } from '$lib/components/ui/label';
	import * as Select from '$lib/components/ui/select/index';

	import { type Parameters } from '$lib/docs';

	import {
		lengthOptions,
		domainOptions,
		windSpeedOptions,
		timeFormatOptions,
		temperatureOptions,
		precipitationOptions
	} from './options';

	interface Props {
		params: Parameters;
		visible?: string[];
	}

	let {
		params = $bindable(),
		visible = ['temperature', 'wind_speed', 'precipitation', 'timeformat']
	}: Props = $props();

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
	let domain = $derived(domainOptions.find((doo) => String(doo.value) == params.domains));
	let timeFormat = $derived(
		timeFormatOptions.find((tfo) => String(tfo.value) == params.timeformat)
	);
	let lengthUnit = $derived(lengthOptions.find((lo) => String(lo.value) == params.length_unit));
</script>

<a href="#settings"> <h2 id="settings" class="text-2xl md:text-3xl">Settings</h2></a>
<div class="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2 md:mt-4 md:flex-row md:gap-6 lg:grid-cols-4">
	{#if visible.includes('temperature')}
		<div class="relative">
			<Select.Root name="temperature_unit" type="single" bind:value={params.temperature_unit}>
				<Select.Trigger
					aria-label="Temperature setting"
					class="h-12 cursor-pointer pt-6 [&_svg]:mb-3">{temperatureUnit?.label}</Select.Trigger
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
	{/if}

	{#if visible.includes('length')}
		<div class="relative">
			<Select.Root name="precipitation_unit" type="single" bind:value={params.length_unit}>
				<Select.Trigger
					aria-label="Length unit setting"
					class="h-12 cursor-pointer pt-6 [&_svg]:mb-3">{lengthUnit?.label}</Select.Trigger
				>
				<Select.Content preventScroll={false} class="border-border">
					{#each lengthOptions as lo}
						<Select.Item value={lo.value}>{lo.label}</Select.Item>
					{/each}
				</Select.Content>
				<Label class="text-muted-foreground absolute left-2 top-[0.35rem] z-10 px-1 text-xs"
					>Length Unit</Label
				>
			</Select.Root>
		</div>
	{/if}

	{#if visible.includes('wind_speed') || visible.includes('velocity')}
		<div class="relative">
			<Select.Root name="wind_speed_unit" type="single" bind:value={params.wind_speed_unit}>
				<Select.Trigger
					aria-label="Wind speed setting"
					class="h-12 cursor-pointer pt-6 [&_svg]:mb-3">{windSpeedUnit?.label}</Select.Trigger
				>
				<Select.Content preventScroll={false} class="border-border">
					{#each windSpeedOptions as wso}
						<Select.Item value={wso.value}>{wso.label}</Select.Item>
					{/each}
				</Select.Content>
				<Label class="text-muted-foreground absolute left-2 top-[0.35rem] z-10 px-1 text-xs">
					{#if visible.includes('wind_speed')}Wind Speed Unit{:else}Velocity Unit{/if}</Label
				>
			</Select.Root>
		</div>
	{/if}

	{#if visible.includes('precipitation')}
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
	{/if}

	{#if visible.includes('domains')}
		<div class="relative">
			<Select.Root name="domains" type="single" bind:value={params.domains}>
				<Select.Trigger
					aria-label="Domains setting"
					class="h-12 w-full cursor-pointer pt-6 [&_svg]:mb-3 truncate"
					>{domain?.label}</Select.Trigger
				>
				<Select.Content preventScroll={false} class="border-border">
					{#each domainOptions as doo}
						<Select.Item value={doo.value}>{doo.label}</Select.Item>
					{/each}
				</Select.Content>
				<Label class="text-muted-foreground absolute left-2 top-[0.35rem] z-10 px-1 text-xs"
					>Domain</Label
				>
			</Select.Root>
		</div>
	{/if}

	{#if visible.includes('timeformat')}
		<div class="relative">
			<Select.Root name="timeformat" type="single" bind:value={params.timeformat}>
				<Select.Trigger
					aria-label="Time format setting"
					class="h-12 w-full cursor-pointer pt-6 [&_svg]:mb-3 truncate"
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
	{/if}
</div>
